'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Shield, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Minus } from 'lucide-react'
import { forensicReasoningData } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

// ── Evidence Item ─────────────────────────────────────────────────
function EvidenceItem({ item, type, index }: {
  item: { id: number; text: string; weight: number; source: string }
  type: 'for' | 'against'
  index: number
}) {
  const isFor = type === 'for'
  const color = isFor ? 'text-danger' : 'text-forensic'
  const bg = isFor ? 'bg-danger/5 border-danger/15 hover:border-danger/30' : 'bg-forensic/5 border-forensic/15 hover:border-forensic/30'
  const barColor = isFor ? '#FF3B5C' : '#4FFFB0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`p-3.5 rounded-xl border transition-all duration-200 ${bg}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {isFor
            ? <AlertTriangle size={14} className="text-danger flex-shrink-0" />
            : <CheckCircle size={14} className="text-forensic flex-shrink-0" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#A8B3CF] leading-snug">{item.text}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#4B5568] font-mono">{item.source}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.weight / 25) * 100}%` }}
                  transition={{ delay: index * 0.07 + 0.3, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                />
              </div>
              <span className={`text-xs font-mono font-bold ${color}`}>+{item.weight}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Scales Visual ─────────────────────────────────────────────────
function ForensicScales({ forTotal, againstTotal }: { forTotal: number; againstTotal: number }) {
  const total = forTotal + againstTotal
  const forPct = (forTotal / total) * 100
  const tiltDeg = ((forTotal - againstTotal) / total) * 25

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Balance beam */}
      <motion.div
        animate={{ rotate: tiltDeg }}
        transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 80 }}
        className="relative"
        style={{ width: 200, height: 8 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-danger via-white/20 to-forensic" />
        {/* Left pan */}
        <motion.div
          animate={{ y: tiltDeg > 0 ? 12 : -12 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -left-8 -top-6 w-16 h-6 rounded-lg bg-danger/20 border border-danger/30 flex items-center justify-center"
        >
          <span className="text-xs font-mono text-danger font-bold">{forTotal}</span>
        </motion.div>
        {/* Right pan */}
        <motion.div
          animate={{ y: tiltDeg > 0 ? -12 : 12 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -right-8 -top-6 w-16 h-6 rounded-lg bg-forensic/20 border border-forensic/30 flex items-center justify-center"
        >
          <span className="text-xs font-mono text-forensic font-bold">{againstTotal}</span>
        </motion.div>
        {/* Center pivot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/20 border border-white/30" />
      </motion.div>
      <div className="text-xs text-[#4B5568] font-mono mt-4">Evidence Balance</div>
    </div>
  )
}

export default function ForensicReasoningPage() {
  const [counterApplied, setCounterApplied] = useState(false)
  const [expandedAlternative, setExpandedAlternative] = useState<number | null>(null)
  const { evidenceFor, evidenceAgainst, riskScore, adjustedRiskScore, counterEvidenceReasons, alternativeExplanations, recommendedAction } = forensicReasoningData

  const forTotal = evidenceFor.reduce((sum, e) => sum + e.weight, 0)
  const againstTotal = evidenceAgainst.reduce((sum, e) => sum + e.weight, 0)
  const displayScore = counterApplied ? adjustedRiskScore : riskScore

  return (
    <OfficialLayout activeHref="/official/forensic-reasoning">
      <div className="p-6 lg:p-8 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-caution" />
            <span className="text-xs font-mono text-caution tracking-widest">FORENSIC REASONING CENTER</span>
          </div>
          <h1 className="font-display font-bold text-white text-3xl mb-1">Forensic Case Analysis</h1>
          <p className="text-[#6B7A99] text-sm">Building the case — and actively trying to disprove it</p>
        </div>

        {/* Score + Scales row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Risk Score */}
          <div className="glass rounded-2xl border border-white/5 p-6 flex flex-col items-center gap-4">
            <div className="text-xs font-mono text-[#4B5568] tracking-widest">OVERALL RISK SCORE</div>
            <motion.div
              key={displayScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-bold font-mono"
              style={{ color: displayScore > 75 ? '#FF3B5C' : displayScore > 50 ? '#FFD60A' : '#4FFFB0' }}
            >
              {displayScore}
            </motion.div>
            {counterApplied && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs text-caution font-mono text-center"
              >
                ↓ Reduced from {riskScore} after counter-evidence
              </motion.div>
            )}
          </div>

          {/* Scales */}
          <div className="glass rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center">
            <ForensicScales forTotal={forTotal} againstTotal={againstTotal} />
            <div className="flex items-center gap-6 mt-6 text-xs font-mono">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-danger" /> FOR ({forTotal} pts)</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-forensic" /> AGAINST ({againstTotal} pts)</div>
            </div>
          </div>

          {/* Counter-Evidence Engine */}
          <div className="glass rounded-2xl border border-caution/20 bg-caution/3 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-caution" />
              <h3 className="font-semibold text-white text-sm">Counter-Evidence Engine</h3>
            </div>
            <p className="text-xs text-[#A8B3CF] mb-4">
              The AI asks: <em className="text-caution">"What if I'm wrong?"</em> Legitimate explanations found:
            </p>
            <div className="space-y-2 mb-5">
              {counterEvidenceReasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#A8B3CF]">
                  <Minus size={10} className="text-caution mt-0.5 flex-shrink-0" />
                  {r}
                </div>
              ))}
            </div>
            <button
              onClick={() => setCounterApplied(!counterApplied)}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                counterApplied
                  ? 'bg-forensic/15 border border-forensic/30 text-forensic'
                  : 'bg-caution/15 border border-caution/30 text-caution hover:bg-caution/25'
              }`}
            >
              {counterApplied ? '✓ Counter-Evidence Applied' : 'Apply Counter-Evidence'}
            </button>
          </div>
        </div>

        {/* Evidence For / Against */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Evidence FOR */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-danger" />
              <h2 className="font-semibold text-white text-sm">Evidence FOR Suspicion</h2>
            </div>
            {evidenceFor.map((item, i) => (
              <EvidenceItem key={item.id} item={item} type="for" index={i} />
            ))}
          </div>

          {/* Evidence AGAINST */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} className="text-forensic" />
              <h2 className="font-semibold text-white text-sm">Evidence AGAINST Suspicion</h2>
            </div>
            {evidenceAgainst.map((item, i) => (
              <EvidenceItem key={item.id} item={item} type="against" index={i} />
            ))}

            {/* Alternative Explanations */}
            <div className="mt-2">
              <div className="text-xs text-[#4B5568] font-mono uppercase tracking-widest mb-2">Alternative Explanations</div>
              {alternativeExplanations.map((exp, i) => (
                <div key={i}
                  className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-white/3 cursor-pointer transition-colors"
                  onClick={() => setExpandedAlternative(expandedAlternative === i ? null : i)}
                >
                  <ChevronRight size={12} className="text-[#4B5568] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#6B7A99]">{exp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl border border-saffron/25 bg-saffron/5 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-saffron/15 border border-saffron/25 flex-shrink-0">
              <Eye size={20} className="text-saffron" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg mb-1">Recommended Investigation</h3>
              <p className="text-[#A8B3CF] text-sm leading-relaxed">{recommendedAction}</p>
              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold hover:bg-saffron-light transition-colors">
                  Create Investigation Task
                </button>
                <button className="px-4 py-2 rounded-xl border border-white/15 text-[#A8B3CF] text-sm hover:bg-white/5 transition-colors">
                  Generate Case Dossier
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </OfficialLayout>
  )
}
