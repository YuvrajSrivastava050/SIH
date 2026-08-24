'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import { Shield, ChevronDown, Info, ArrowRight, AlertTriangle } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { behavioralDNAData, mockProjects } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

// ── Custom Tooltip for radar ─────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs">
        <p className="text-white font-semibold">{payload[0]?.payload?.dimension}</p>
        <p className="text-saffron font-mono">Score: {payload[0]?.value}</p>
        {payload[1] && <p className="text-forensic font-mono">Threshold: {payload[1]?.value}</p>}
      </div>
    )
  }
  return null
}

// ── DNA Dimension Bar ────────────────────────────────────────────
function DNABar({ label, score, index }: { label: string; score: number; index: number }) {
  const color = score > 75 ? '#FF4D6D' : score > 60 ? '#FFC94D' : '#35F0C8'
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <div className="w-32 ml-1 mr-3 text-xs text-[#A3C2D9] font-mono text-right flex-shrink-0">{label}</div>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.3 + index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <div className="w-10 mr-1 text-right font-mono text-xs font-bold flex-shrink-0" style={{ color }}>{score}</div>
    </motion.div>
  )
}

// ── Risk Score Gauge ─────────────────────────────────────────────
function RiskGauge({ score }: { score: number }) {
  const color = score > 75 ? '#FF4D6D' : score > 50 ? '#FFC94D' : '#35F0C8'
  const dasharray = 220
  const dashoffset = dasharray - (dasharray * score / 100)

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="50" fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={dasharray}
          initial={{ strokeDashoffset: dasharray }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="font-mono font-bold text-3xl"
          style={{ color }}
        >
          {score}
        </motion.div>
        <div className="text-xs text-[#7E9BB4] font-mono">RISK SCORE</div>
      </div>
    </div>
  )
}

// ── Pattern Card ─────────────────────────────────────────────────
function PatternCard({ patternId, projects, amount, match, active }: {
  patternId: string; projects: number; amount: string; match: number; active: boolean
}) {
  return (
    <div className={`glass rounded-xl p-4 border transition-all duration-300 cursor-pointer
      ${active ? 'border-saffron/40 bg-saffron/5' : 'border-white/5 hover:border-white/15'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs font-bold text-saffron">Pattern #{patternId}</span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
          match > 80 ? 'bg-danger/10 text-danger border border-danger/20' :
          match > 60 ? 'bg-caution/10 text-caution border border-caution/20' :
          'bg-forensic/10 text-forensic border border-forensic/20'
        }`}>{match}% match</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><span className="text-[#56718A]">Projects</span><div className="text-white font-mono">{projects}</div></div>
        <div><span className="text-[#56718A]">Amount</span><div className="text-white font-mono">₹{amount}</div></div>
      </div>
    </div>
  )
}

const radarData = behavioralDNAData.dimensions.map(d => ({
  dimension: d.dimension,
  score: d.score,
  threshold: 65,
}))

// ── Animated Radar Chart ─────────────────────────────────────────
function AnimatedRadarChart({ data, className }: { data: typeof radarData; className?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const controls = animate(0, 1, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setProgress(v),
    })
    return () => controls.stop()
  }, [])

  const animatedData = data.map(d => ({
    ...d,
    score: d.score * progress,
    threshold: d.threshold * progress,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={animatedData} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: '#7E9BB4', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
          <Tooltip content={<CustomTooltip />} />
          <Radar name="Threshold" dataKey="threshold" stroke="rgba(53,240,200,0.3)" fill="rgba(53,240,200,0.04)" strokeDasharray="4 2" />
          <Radar name="Project" dataKey="score" stroke="#3ED6FF" fill="rgba(62,214,255,0.12)" dot={{ r: 3, fill: '#3ED6FF' }} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default function BehavioralDNAPage() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[1])
  const [showComparison, setShowComparison] = useState(false)
  const { overallMatch, riskScore, breakdown } = behavioralDNAData

  return (
    <OfficialLayout activeHref="/official/behavioral-dna">
      <div className="px-8 lg:px-12 xl:px-14 py-6 lg:py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-saffron" />
              <span className="text-xs font-mono text-saffron tracking-widest">BEHAVIORAL DNA LAB</span>
            </div>
            <h1 className="font-display font-bold text-white text-3xl mb-1">Behavioral DNA Analysis</h1>
            <p className="text-[#7E9BB4] text-sm">Detect behaviour patterns, not just rule violations</p>
          </div>

          {/* Project Selector */}
          <div className="glass rounded-xl border border-white/8 overflow-hidden">
            <div className="px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <div className="text-xs text-[#56718A] font-mono">Analysing</div>
                <div className="text-sm font-semibold text-white">{selectedProject.name}</div>
              </div>
              <ChevronDown size={14} className="text-[#7E9BB4] ml-3" />
            </div>
          </div>
        </div>

        {/* Top Banner — Match Result */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-danger/20 bg-danger/3 p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <AlertTriangle size={24} className="text-danger animate-pulse-danger" />
            <div>
              <div className="text-danger font-semibold text-lg font-display">
                {overallMatch}% Behavioral Match Detected
              </div>
              <div className="text-sm text-[#A3C2D9]">
                This project's behavior closely resembles <strong className="text-white">Known Suspicious Pattern #{behavioralDNAData.similarPattern}</strong> — a documented irregularity cluster.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/15 border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/25 transition-all"
          >
            Compare Patterns <ArrowRight size={14} />
          </button>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Radar Chart */}
          <div className="glass rounded-2xl border border-white/5 px-6 lg:px-7 py-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-saffron" />
              <h2 className="font-semibold text-white text-sm">6-Dimensional DNA Profile</h2>
            </div>

            <div className="h-64 px-3 mx-1">
              <AnimatedRadarChart data={radarData} className="h-full w-full" />
            </div>

          </div>

          {/* Dimension Bars + Risk Score */}
          <div className="glass rounded-2xl border border-white/5 px-6 lg:px-7 py-6 flex flex-col gap-5">
            <h2 className="font-semibold text-white text-sm">Dimension Breakdown</h2>

            <div className="space-y-3">
              {behavioralDNAData.dimensions.map((d, i) => (
                <DNABar key={d.dimension} label={d.dimension} score={d.score} index={i} />
              ))}
            </div>

            <div className="border-t border-white/5 pt-4">
              <RiskGauge score={riskScore} />
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="glass rounded-2xl border border-white/5 px-6 lg:px-7 py-6">
            <h2 className="font-semibold text-white text-sm mb-5">Risk Factor Breakdown</h2>
            <div className="space-y-2">
              {Object.entries(breakdown).map(([key, val], i) => {
                const labels: Record<string, string> = {
                  paymentAnomalies: 'Payment Anomalies',
                  timelineImpossibility: 'Timeline Impossibility',
                  contractorHistory: 'Contractor History',
                  peerDeviation: 'Peer Deviation',
                  networkAnomaly: 'Network Anomaly',
                  documentationGap: 'Documentation Gap',
                }
                const numVal = parseInt(val)
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#A3C2D9]">{labels[key]}</span>
                        <span className="text-xs font-mono font-bold text-danger">{val}</span>
                      </div>
                      <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${numVal}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.7 }}
                          className="h-full rounded-full bg-gradient-to-r from-danger to-saffron"
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="text-xs text-[#7E9BB4]">Total Risk Score</div>
              <div className="text-2xl font-bold font-mono text-danger">87</div>
            </div>
          </div>
        </div>

        {/* Pattern Comparison (expandable) */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-2xl border border-saffron/20 overflow-hidden"
            >
              <div className="px-6 lg:px-7 py-6">
                <h2 className="font-display font-bold text-white text-xl mb-6">
                  Pattern Comparison: <span className="text-saffron">This Project</span> vs <span className="text-danger">Pattern #47</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {['This Project', 'Pattern #47 (Known Suspicious)'].map((label, pi) => (
                    <div key={pi}>
                      <div className={`text-sm font-semibold mb-4 ${pi === 0 ? 'text-saffron' : 'text-danger'}`}>{label}</div>
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData.map(d => ({
                            ...d,
                            score: pi === 0 ? d.score : Math.min(d.score + (Math.random() * 10 - 5), 100),
                          }))}>
                            <PolarGrid stroke="rgba(255,255,255,0.06)" />
                            <PolarAngleAxis dataKey="dimension" tick={{ fill: '#56718A', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                            <Radar dataKey="score" stroke={pi === 0 ? '#3ED6FF' : '#FF4D6D'} fill={pi === 0 ? 'rgba(62,214,255,0.1)' : 'rgba(255,77,109,0.1)'} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Similar Patterns */}
        <div>
          <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <Info size={14} className="text-saffron" /> Similar Behavioral Patterns
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PatternCard patternId="47" projects={83} amount="11.4 Cr" match={87} active={true} />
            <PatternCard patternId="23" projects={41} amount="6.8 Cr" match={64} active={false} />
            <PatternCard patternId="91" projects={29} amount="4.2 Cr" match={51} active={false} />
            <PatternCard patternId="12" projects={17} amount="2.1 Cr" match={38} active={false} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 pt-8 pb-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-[#7E9BB4]">
            <div className="w-4 h-0.5 bg-saffron" />Project DNA
          </div>
          <div className="flex items-center gap-2 text-xs text-[#7E9BB4]">
            <div className="w-4 h-0.5 border-t border-dashed border-forensic opacity-60" />Threshold
          </div>
        </div>
      </div>
    </OfficialLayout>
  )
}
