'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Eye, FileText, X, ChevronRight, Filter } from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

const riskColors: Record<string, string> = {
  critical: 'text-danger border-danger/25 bg-danger/8',
  high:     'text-orange-400 border-orange-400/25 bg-orange-400/8',
  medium:   'text-caution border-caution/25 bg-caution/8',
  low:      'text-forensic border-forensic/25 bg-forensic/8',
}

const evidenceDots = (score: number) => {
  const filled = Math.round((score / 100) * 5)
  return Array.from({ length: 5 }, (_, i) => i < filled)
}

function DossierModal({ project, onClose }: { project: typeof mockProjects[0]; onClose: () => void }) {
  const sections = [
    'Case Overview',
    'Behavioral DNA Analysis',
    'Pattern Match & Evolution',
    'Peer Benchmarking Results',
    'Network Relationships',
    'Timeline Analysis',
    'Evidence Analysis',
    'Evidence Supporting Suspicion',
    'Counter-Evidence',
    'Alternative Explanations',
    'Recommended Investigation Steps',
    'Case Priority Assessment',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#080D1A]/90 backdrop-blur-xl px-6 py-4 border-b border-white/8 flex items-center justify-between z-10">
          <div>
            <div className="text-xs font-mono text-saffron mb-0.5">AUDIT CASE FILE / DOSSIER</div>
            <h2 className="font-display font-bold text-white text-lg">{project.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold hover:bg-saffron-light transition-colors">
              Download PDF
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <X size={16} className="text-[#6B7A99]" />
            </button>
          </div>
        </div>

        {/* Project summary */}
        <div className="px-6 py-4 border-b border-white/5 grid grid-cols-3 gap-4 text-sm">
          <div><div className="text-[#4B5568] text-xs">Case ID</div><div className="text-white font-mono">{project.id}</div></div>
          <div><div className="text-[#4B5568] text-xs">Risk Score</div><div className={`font-mono font-bold ${riskColors[project.riskLevel]?.split(' ')[0]}`}>{project.riskScore}</div></div>
          <div><div className="text-[#4B5568] text-xs">Amount</div><div className="text-white font-mono">₹{(project.amount / 100000).toFixed(1)}L</div></div>
        </div>

        {/* 12 sections */}
        <div className="p-6 space-y-3">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl border border-white/5 p-4 hover:border-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#4B5568] w-5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-medium text-white group-hover:text-saffron transition-colors">{section}</span>
                </div>
                <ChevronRight size={14} className="text-[#4B5568] group-hover:text-saffron transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CaseFilesPage() {
  const [filter, setFilter] = useState('all')
  const [dossierProject, setDossierProject] = useState<typeof mockProjects[0] | null>(null)

  const sorted = [...mockProjects]
    .filter(p => filter === 'all' || p.riskLevel === filter)
    .sort((a, b) => b.riskScore - a.riskScore)

  return (
    <OfficialLayout activeHref="/official/case-files">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-danger" />
              <span className="text-xs font-mono text-danger tracking-widest">INVESTIGATION PRIORITY QUEUE</span>
            </div>
            <h1 className="font-display font-bold text-white text-3xl mb-1">Case Files</h1>
            <p className="text-[#6B7A99] text-sm">Ranked by risk, evidence strength, and financial impact</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-saffron/15 border border-saffron/30 text-saffron'
                  : 'border border-white/8 text-[#6B7A99] hover:text-white hover:border-white/20'
              }`}
            >
              {f === 'all' ? 'All Cases' : f}
            </button>
          ))}
        </div>

        {/* Case List */}
        <div className="space-y-4">
          {sorted.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl border border-white/5 hover:border-white/10 p-5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Priority rank */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <span className="font-mono font-bold text-lg" style={{
                    color: i === 0 ? '#FF3B5C' : i === 1 ? '#FF6B00' : i === 2 ? '#FFD60A' : '#6B7A99'
                  }}>
                    {i + 1}
                  </span>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      <div className="text-xs text-[#6B7A99] font-mono mt-0.5">{project.id} · {project.constituency}</div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${riskColors[project.riskLevel]}`}>
                      RISK: {project.riskScore}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 mt-3 flex-wrap">
                    <div>
                      <div className="text-xs text-[#4B5568]">Financial Exposure</div>
                      <div className="text-sm font-mono font-bold text-white">₹{(project.amount / 100000).toFixed(1)}L</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#4B5568]">Evidence Strength</div>
                      <div className="flex items-center gap-1 mt-1">
                        {evidenceDots(project.behavioralMatch).map((filled, j) => (
                          <div key={j} className={`w-2 h-2 rounded-full ${filled ? 'bg-saffron' : 'bg-white/10'}`} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#4B5568]">Behavioral Match</div>
                      <div className="text-sm font-mono font-bold text-saffron">{project.behavioralMatch}%</div>
                    </div>
                    {project.flags && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {project.flags.map((f, j) => (
                          <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-danger/8 border border-danger/15 text-danger">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/official/behavioral-dna?project=${project.id}`}
                    className="p-2 rounded-xl border border-white/8 hover:bg-white/5 transition-colors"
                    title="Open Case"
                  >
                    <Eye size={14} className="text-[#A8B3CF]" />
                  </Link>
                  <button
                    onClick={() => setDossierProject(project)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-saffron/10 border border-saffron/25 text-saffron text-xs font-semibold hover:bg-saffron/20 transition-colors"
                  >
                    <FileText size={12} /> Dossier
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dossier Modal */}
      <AnimatePresence>
        {dossierProject && (
          <DossierModal project={dossierProject} onClose={() => setDossierProject(null)} />
        )}
      </AnimatePresence>
    </OfficialLayout>
  )
}
