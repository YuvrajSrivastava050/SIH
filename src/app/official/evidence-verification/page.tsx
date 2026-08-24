'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSearch, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { evidenceVerificationData } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

type CheckStatus = 'pass' | 'fail' | 'warning'

const StatusIcon = ({ status }: { status: CheckStatus }) => {
  if (status === 'pass')    return <CheckCircle size={18} className="text-forensic" />
  if (status === 'fail')    return <XCircle size={18} className="text-danger" />
  return <AlertCircle size={18} className="text-caution" />
}

const statusLabel: Record<CheckStatus, string> = {
  pass: 'VERIFIED',
  fail: 'INCONSISTENT',
  warning: 'REQUIRES REVIEW',
}
const statusColor: Record<CheckStatus, string> = {
  pass:    'text-forensic border-forensic/20 bg-forensic/8',
  fail:    'text-danger border-danger/20 bg-danger/8',
  warning: 'text-caution border-caution/20 bg-caution/8',
}

// ── Evidence Integrity Gauge ─────────────────────────────────────
function IntegrityGauge({ score }: { score: number }) {
  const color = score > 70 ? '#35F0C8' : score > 40 ? '#FFC94D' : '#FF4D6D'
  const circumference = 2 * Math.PI * 52
  const dashoffset = circumference - (circumference * score / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r="52" fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="text-4xl font-bold font-mono" style={{ color }}
          >
            {score}
          </motion.div>
          <div className="text-xs text-[#7E9BB4] font-mono">/ 100</div>
        </div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-white text-sm">Evidence Integrity Score</div>
        <div className={`text-xs font-mono mt-1 ${score > 70 ? 'text-forensic' : score > 40 ? 'text-caution' : 'text-danger'}`}>
          {score > 70 ? 'Consistent' : score > 40 ? 'Requires Review' : 'Inconsistent'}
        </div>
      </div>
    </div>
  )
}

// ── Timeline Feasibility Bar ─────────────────────────────────────
function TimelineFeasibility({ data }: { data: typeof evidenceVerificationData.timelineFeasibility }) {
  const { reportedDays, expectedMin, expectedMax, feasibilityPercent } = data
  const scale = expectedMax + 20

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-white">Timeline Feasibility Analysis</div>

      {/* Reported */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A3C2D9]">Reported construction time</span>
          <span className="text-danger font-mono font-bold">{reportedDays} days</span>
        </div>
        <div className="bg-white/5 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(reportedDays / scale) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-danger rounded-full"
            style={{ boxShadow: '0 0 8px rgba(255,77,109,0.6)' }}
          />
        </div>
      </div>

      {/* Expected range */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A3C2D9]">Expected range</span>
          <span className="text-forensic font-mono">{expectedMin}–{expectedMax} days</span>
        </div>
        <div className="bg-white/5 rounded-full h-3 relative overflow-hidden">
          <motion.div
            initial={{ width: 0, left: `${(expectedMin / scale) * 100}%` }}
            animate={{ width: `${((expectedMax - expectedMin) / scale) * 100}%`, left: `${(expectedMin / scale) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-full bg-forensic/40 rounded-full absolute top-0"
            style={{ border: '1px solid rgba(53,240,200,0.4)' }}
          />
        </div>
      </div>

      <div className="glass rounded-xl border border-danger/20 p-3 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#A3C2D9]">Timeline Feasibility</span>
          <span className="text-danger font-mono font-bold text-lg">{feasibilityPercent}%</span>
        </div>
        <div className="text-xs text-danger mt-1">
          Reported timeline is physically implausible for this project type and scale.
        </div>
      </div>
    </div>
  )
}

export default function EvidenceVerificationPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const { checks, consistencyScore, timelineFeasibility } = evidenceVerificationData

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <OfficialLayout activeHref="/official/evidence-verification">
      <div className="px-8 lg:px-12 xl:px-14 py-6 lg:py-8 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileSearch size={16} className="text-forensic" />
            <span className="text-xs font-mono text-forensic tracking-widest">EVIDENCE VERIFICATION LAB</span>
          </div>
          <h1 className="font-display font-bold text-white text-3xl mb-1">Multi-Modal Evidence Analysis</h1>
          <p className="text-[#7E9BB4] text-sm">GPS · Timestamps · Image Similarity · Solar Verification · Document Consistency</p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Evidence Checklist */}
          <div className="lg:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 lg:px-7 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">Evidence Checklist</h2>
              <button
                onClick={() => setRevealed(!revealed)}
                className="text-xs font-mono text-saffron hover:text-saffron-light transition-colors"
              >
                {revealed ? 'Hide Details' : 'Expand All'}
              </button>
            </div>

            <div className="px-5 lg:px-6 py-4 space-y-2">
              {checks.map((check, i) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    onClick={() => toggleExpand(check.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left
                      ${expandedId === check.id || revealed
                        ? statusColor[check.status as CheckStatus]
                        : 'border-white/5 hover:border-white/12 bg-white/2'}`}
                  >
                    {/* Animated icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <StatusIcon status={check.status as CheckStatus} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white">{check.label}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusColor[check.status as CheckStatus]}`}>
                          {statusLabel[check.status as CheckStatus]}
                        </span>
                      </div>

                      <AnimatePresence>
                        {(expandedId === check.id || revealed) && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs text-[#A3C2D9] mt-1.5 leading-relaxed overflow-hidden"
                          >
                            {check.detail}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {expandedId === check.id
                      ? <ChevronUp size={14} className="text-[#7E9BB4] flex-shrink-0" />
                      : <ChevronDown size={14} className="text-[#7E9BB4] flex-shrink-0" />
                    }
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Integrity Gauge */}
            <div className="glass rounded-2xl border border-white/5 px-6 lg:px-7 py-6 flex flex-col items-center">
              <IntegrityGauge score={consistencyScore} />
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl border border-danger/15 bg-danger/3 px-6 lg:px-7 py-5">
              <div className="text-sm font-semibold text-white mb-3">NIRIKSHAN Assessment</div>
              <p className="text-sm text-[#A3C2D9] leading-relaxed">
                Evidence is <strong className="text-danger">inconsistent and requires verification</strong>.
                Multiple indicators suggest photographic evidence may not represent actual project progress.
              </p>
              <div className="mt-3 pt-3 border-t border-white/8 flex gap-4 text-xs font-mono">
                <span className="text-danger">3 FAIL</span>
                <span className="text-caution">3 REVIEW</span>
                <span className="text-forensic">2 PASS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Feasibility */}
        <div className="glass rounded-2xl border border-white/5 px-6 lg:px-7 py-6">
          <TimelineFeasibility data={timelineFeasibility} />
        </div>

        {/* Solar/Shadow Verification Teaser */}
        <div className="glass rounded-2xl border border-caution/20 bg-caution/3 px-6 lg:px-8 py-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-caution/10 border border-caution/20 flex-shrink-0">
              <span className="text-2xl">☀️</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg mb-1">Solar & Shadow Verification</h3>
              <p className="text-[#A3C2D9] text-sm mb-3">
                Using claimed GPS location (25.3176°N, 82.9739°E) and claimed capture time (14:30 IST), the expected sun azimuth is 231° and elevation 52°.
                Shadow direction in photograph is inconsistent with this geometry.
              </p>
              <div className="flex gap-4 text-xs font-mono">
                <span className="text-[#7E9BB4]">Expected azimuth: <span className="text-white">231°</span></span>
                <span className="text-[#7E9BB4]">Shadow in photo: <span className="text-caution">≈ 180°</span></span>
                <span className="text-caution font-bold">⚠ INCONSISTENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OfficialLayout>
  )
}
