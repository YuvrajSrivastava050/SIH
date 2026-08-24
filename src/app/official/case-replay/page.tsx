'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Play, Pause, SkipBack, AlertTriangle, ChevronRight, BarChart2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { caseReplayData } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

const YEARS = [2017, 2018, 2019, 2020, 2021]

// ── Custom bar tooltip ────────────────────────────────────────────
const BarTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs">
        <p className="text-[#EAF7FF] font-semibold">{payload[0]?.payload?.factor}</p>
        <p className="font-mono" style={{ color: payload[0]?.payload?.color }}>+{payload[0]?.value} pts</p>
      </div>
    )
  }
  return null
}

export default function CaseReplayPage() {
  const [selectedYear, setSelectedYear] = useState(2017)
  const [playing, setPlaying] = useState(false)
  const [earlyWarningShown, setEarlyWarningShown] = useState(false)
  const [earlyWarningDismissed, setEarlyWarningDismissed] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const yearData = caseReplayData.timeline[selectedYear as keyof typeof caseReplayData.timeline]
  const isWarningYear = selectedYear === caseReplayData.warningYear

  useEffect(() => {
    if (isWarningYear && !earlyWarningDismissed) {
      const timer = setTimeout(() => setEarlyWarningShown(true), 400)
      return () => clearTimeout(timer)
    }
  }, [selectedYear, earlyWarningDismissed, isWarningYear])

  // Autoplay
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setSelectedYear(y => {
          const idx = YEARS.indexOf(y)
          if (idx >= YEARS.length - 1) {
            setPlaying(false)
            return y
          }
          return YEARS[idx + 1]
        })
      }, 1800)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing])

  const handleReset = () => {
    setSelectedYear(2017)
    setPlaying(false)
    setEarlyWarningShown(false)
    setEarlyWarningDismissed(false)
  }

  const dismissWarning = () => {
    setEarlyWarningShown(false)
    setEarlyWarningDismissed(true)
  }

  const playScrubCue = (year: number) => {
    if (typeof window === 'undefined') return
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const audioContext = audioContextRef.current ?? new AudioContextClass()
    audioContextRef.current = audioContext
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const nearWarning = Math.abs(year - caseReplayData.warningYear) <= 1
    oscillator.frequency.value = nearWarning ? 520 : 300
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(nearWarning ? 0.045 : 0.018, audioContext.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.09)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    playScrubCue(year)
    if (year !== caseReplayData.warningYear) setEarlyWarningDismissed(false)
  }

  return (
    <OfficialLayout activeHref="/official/case-replay">
      <div className="p-6 lg:p-8 space-y-8 relative">

        {/* ── Early Warning Overlay ─────────────────────────── */}
        <AnimatePresence>
          {earlyWarningShown && !earlyWarningDismissed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={dismissWarning}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative glass rounded-3xl border-2 border-danger/50 p-10 max-w-lg mx-4 text-center"
                onClick={e => e.stopPropagation()}
                style={{ boxShadow: '0 0 80px rgba(255,77,109,0.4), 0 0 160px rgba(255,77,109,0.15)' }}
              >
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-3xl border-2 border-danger/30 animate-pulse" />

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  🚨
                </motion.div>

                <div className="text-danger font-mono text-xs tracking-widest mb-2">NIRIKSHAN EARLY WARNING SYSTEM</div>
                <h2 className="font-display font-bold text-[#EAF7FF] text-3xl mb-4">
                  EARLY WARNING TRIGGERED
                </h2>
                <p className="text-[#A3C2D9] text-sm mb-3">
                  At this point in time (<strong className="text-[#EAF7FF]">2018</strong>), NIRIKSHAN would have surfaced these indicators for investigation:
                </p>

                <div className="space-y-2 text-left mb-6">
                  {caseReplayData.timeline[2018].nirikshan.indicators.map((ind, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 + 0.5 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <AlertTriangle size={12} className="text-danger flex-shrink-0" />
                      <span className="text-[#A3C2D9]">{ind}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="glass rounded-xl border border-danger/20 p-3 mb-5">
                  <span className="text-danger font-mono text-sm font-bold">Risk Score: </span>
                  <span className="text-[#EAF7FF] font-mono text-2xl font-bold">79</span>
                </div>

                <button
                  onClick={dismissWarning}
                  className="px-6 py-2.5 rounded-xl bg-danger/15 border border-danger/30 text-danger font-semibold text-sm hover:bg-danger/25 transition-colors"
                >
                  View Full Breakdown
                </button>
                <p className="text-xs text-[#56718A] mt-3">Click outside to dismiss</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-danger" />
            <span className="text-xs font-mono text-danger tracking-widest">HISTORICAL CASE REPLAY LAB</span>
          </div>
          <h1 className="font-display font-bold text-[#EAF7FF] text-3xl mb-1">Historical Case Replay</h1>
          <p className="text-[#7E9BB4] text-sm">Turn back the clock. See what NIRIKSHAN would have found — and when.</p>
        </div>

        {/* Case Banner */}
        <div className="glass rounded-2xl border border-white/8 p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#56718A] mb-1">SELECTED CASE</div>
            <h2 className="font-display font-bold text-[#EAF7FF] text-lg">{caseReplayData.title}</h2>
            <p className="text-sm text-[#7E9BB4] mt-1">{caseReplayData.description}</p>
          </div>
          <div className="flex flex-col gap-2 text-right flex-shrink-0 ml-6">
            <div className="text-xs text-[#56718A]">Potential exposure</div>
            <div className="text-xl font-bold font-mono text-danger">₹3.2 Cr</div>
            <div className="text-xs text-[#56718A]">Time saved: <span className="text-forensic">{caseReplayData.timeSaved}</span></div>
          </div>
        </div>

        {/* ── Timeline Scrubber ─────────────────────────────── */}
        <div className="glass rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[#EAF7FF] text-sm flex items-center gap-2">
              <Clock size={14} className="text-saffron" /> Timeline Scrubber
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                <SkipBack size={14} className="text-[#A3C2D9]" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  playing
                    ? 'bg-danger/15 border border-danger/30 text-danger'
                    : 'bg-saffron text-[#02141d] hover:bg-saffron-light'
                }`}
              >
                {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play Timeline</>}
              </button>
            </div>
          </div>

          {/* Year selector */}
          <div className="relative">
            {/* Track */}
            <div className="absolute top-5 left-8 right-8 h-px bg-white/10" />
            {/* Progress */}
            <div
              className="absolute top-5 left-8 h-px bg-gradient-to-r from-forensic to-saffron transition-all duration-500"
              style={{ width: `calc((${YEARS.indexOf(selectedYear)} / ${YEARS.length - 1}) * (100% - 4rem))` }}
            />

            <div className="relative flex justify-between px-2">
              {YEARS.map(year => {
                const isWarn = year === caseReplayData.warningYear

                return (
                  <div
                    key={year}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="h-4" aria-hidden="true" />
                    <div className="text-xs font-mono font-bold text-[#A3C2D9]">{year}</div>
                    {isWarn && (
                      <div className="text-[10px] text-danger font-mono">⚠ FLAG</div>
                    )}
                    {year === caseReplayData.actualDiscoveryYear && (
                      <div className="text-[10px] text-caution font-mono">FOUND</div>
                    )}
                  </div>
                )
              })}
            </div>
            <input
              aria-label="Replay year"
              type="range"
              min={0}
              max={YEARS.length - 1}
              step={1}
              value={YEARS.indexOf(selectedYear)}
              onChange={event => handleYearChange(YEARS[Number(event.target.value)])}
              className={`replay-range ${isWarningYear ? 'replay-range-warning' : ''}`}
              style={{ '--scrub-intensity': `${Math.max(0, 1 - Math.abs(selectedYear - caseReplayData.warningYear) / 2)}` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* ── Year Detail Panel ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* NIRIKSHAN View */}
            <div className={`glass rounded-2xl border p-6 ${
              (yearData?.nirikshan as any)?.earlyWarning ? 'border-danger/30 bg-danger/3' : 'border-white/5'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-saffron" />
                <span className="text-xs font-mono text-saffron">NIRIKSHAN AT {selectedYear}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div>
                  <div className="text-xs text-[#56718A] mb-1">Risk Score</div>
                  <div className={`text-4xl font-bold font-mono ${
                    (yearData?.nirikshan?.riskScore || 0) > 75 ? 'text-danger' :
                    (yearData?.nirikshan?.riskScore || 0) > 50 ? 'text-caution' : 'text-forensic'
                  }`}>
                    {yearData?.nirikshan?.riskScore || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#56718A] mb-1">Would Flag?</div>
                  <div className={`text-sm font-semibold font-mono ${yearData?.nirikshan?.wouldFlag ? 'text-danger' : 'text-forensic'}`}>
                    {yearData?.nirikshan?.wouldFlag ? '🚨 YES' : '✓ NO'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-[#56718A] font-mono mb-1.5">INDICATORS VISIBLE</div>
                {yearData?.nirikshan?.indicators.map((ind, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                    <span className="text-[#A3C2D9]">{ind}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actual Reality */}
            <div className="glass rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#7E9BB4]" />
                <span className="text-xs font-mono text-[#7E9BB4]">WHAT ACTUALLY HAPPENED IN {selectedYear}</span>
              </div>
              <p className="text-[#A3C2D9] text-sm leading-relaxed">{yearData?.actual}</p>

              <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#56718A]">New Projects</div>
                  <div className="text-lg font-bold font-mono text-[#EAF7FF]">{yearData?.projectsCreated}</div>
                </div>
                <div>
                  <div className="text-xs text-[#56718A]">Anomalies Visible</div>
                  <div className="text-lg font-bold font-mono text-caution">{yearData?.anomaliesVisible}</div>
                </div>
              </div>

              {selectedYear >= caseReplayData.warningYear && (
                <div className="mt-4 p-3 rounded-xl bg-forensic/5 border border-forensic/15 text-xs text-forensic font-mono">
                  ← NIRIKSHAN would have been flagging since {caseReplayData.warningYear}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Score Breakdown Chart ─────────────────────────── */}
        <div className="glass rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={14} className="text-saffron" />
            <h2 className="font-semibold text-[#EAF7FF] text-sm">Why Was This Flagged? — Score Breakdown</h2>
            <span className="ml-auto font-mono font-bold text-danger text-lg">{caseReplayData.totalScore}</span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseReplayData.scoreBreakdown} layout="vertical" barCategoryGap={8}>
                <XAxis type="number" tick={{ fill: '#56718A', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis dataKey="factor" type="category" width={160}
                  tick={{ fill: '#A3C2D9', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                  {caseReplayData.scoreBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Dual Timeline Comparison ──────────────────────── */}
        <div className="glass rounded-2xl border border-white/5 p-6">
          <h2 className="font-semibold text-[#EAF7FF] text-sm mb-6">Timeline Comparison: NIRIKSHAN vs Reality</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* NIRIKSHAN Timeline */}
            <div>
              <div className="text-xs font-mono text-saffron mb-4">NIRIKSHAN WOULD HAVE...</div>
              {[
                { year: '2017', text: 'Mild peer deviation noted — monitor' },
                { year: '2018', text: '🚨 Early Warning Triggered (Score: 79)', highlight: true },
                { year: '2018', text: 'Recommended physical site verification' },
                { year: '2019', text: 'Pattern escalation — urgent escalation' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${item.highlight ? 'bg-danger animate-pulse-danger' : 'bg-saffron'}`} />
                    {i < 3 && <div className="w-px flex-1 bg-saffron/20 my-1" />}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#56718A]">{item.year}</div>
                    <div className={`text-xs mt-0.5 ${item.highlight ? 'text-danger font-semibold' : 'text-[#A3C2D9]'}`}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actual Timeline */}
            <div>
              <div className="text-xs font-mono text-[#7E9BB4] mb-4">WHAT ACTUALLY HAPPENED...</div>
              {[
                { year: '2017', text: 'Projects sanctioned. No investigation.' },
                { year: '2018', text: 'Projects marked complete. Payments released.' },
                { year: '2019', text: 'More projects with same contractors.' },
                { year: '2021', text: 'CAG investigation. ₹3.2 Cr irregularity found.', highlight: true },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${item.highlight ? 'bg-caution' : 'bg-white/20'}`} />
                    {i < 3 && <div className="w-px flex-1 bg-white/10 my-1" />}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#56718A]">{item.year}</div>
                    <div className={`text-xs mt-0.5 ${item.highlight ? 'text-caution' : 'text-[#7E9BB4]'}`}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-sm">
            <span className="text-[#7E9BB4]">Time saved by early detection:</span>
            <span className="text-forensic font-bold font-mono text-xl">{caseReplayData.timeSaved}</span>
            <span className="text-[#7E9BB4] ml-4">Funds potentially recovered:</span>
            <span className="text-forensic font-bold font-mono text-xl">₹3.2 Cr</span>
          </div>
        </div>
      </div>
    </OfficialLayout>
  )
}
