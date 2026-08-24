'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { animate, motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, CheckCircle, MapPin, FileText, Bell, Users } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts'
import { mockConstituencies, mockProjects } from '@/lib/mock-data'

// ── Health Dial ───────────────────────────────────────────────────
function HealthDial({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0)
  const color = score > 75 ? '#35F0C8' : score > 50 ? '#FFC94D' : '#FF4D6D'
  const r = 60
  const circ = 2 * Math.PI * r
  const half = circ / 2
  const dashoffset = half - (half * score / 100)

  useEffect(() => {
    const controls = animate(0, score, {
      type: 'spring',
      stiffness: 75,
      damping: 18,
      mass: 0.8,
      onUpdate: latest => setDisplayScore(Math.round(latest)),
    })
    return () => controls.stop()
  }, [score])

  return (
    <div className="relative w-48 h-28 mx-auto">
      <svg viewBox="0 0 160 90" className="w-full h-full">
        {/* Background arc */}
        <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round" />
        {/* Value arc */}
        <motion.path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${half} ${half}`}
          initial={{ strokeDashoffset: half }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.8, delay: 0.15 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
        {/* Labels */}
        <text x="20" y="78" fill="#56718A" fontSize="9" fontFamily="JetBrains Mono">0</text>
        <text x="132" y="78" fill="#56718A" fontSize="9" fontFamily="JetBrains Mono">100</text>
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="text-4xl font-bold font-mono" style={{ color }}
        >
          {displayScore}
        </motion.div>
        <div className="text-xs text-[#7E9BB4] font-mono">HEALTH SCORE</div>
      </div>
    </div>
  )
}

const constituency = mockConstituencies[0]

const peerData = [
  { name: 'My Constituency', rate: constituency.completionRate, color: '#3ED6FF' },
  { name: 'State Average', rate: 71, color: '#6B7280' },
  { name: 'National Average', rate: 69, color: '#6B7280' },
  { name: 'Top Performer', rate: 94, color: '#35F0C8' },
]

export default function MPDashboard() {
  const [exportingReport, setExportingReport] = useState<string | null>(null)

  const exportReport = (report: string) => {
    setExportingReport(report)
    window.setTimeout(() => setExportingReport(null), 900)
  }

  return (
    <div className="min-h-screen bg-[#020A12]">

      {/* Navbar */}
      <div className="sticky top-0 z-40 bg-[#020A12]/90 backdrop-blur-xl border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-saffron to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="font-display font-bold text-white text-sm">NIRIKSHAN</span>
          <span className="text-xs font-mono text-forensic border border-forensic/25 px-2 py-0.5 rounded-full">MP ACCESS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-xs text-[#7E9BB4] hover:text-white transition-colors">Switch Role</Link>
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-sm">
            <Users size={13} className="text-forensic" />
            <span className="text-white text-xs font-medium">{constituency.mp}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-mono text-forensic tracking-widest mb-2">MP STRATEGIC INTELLIGENCE</div>
          <h1 className="font-display font-bold text-white text-3xl mb-1">{constituency.name} Constituency</h1>
          <p className="text-[#7E9BB4] text-sm">{constituency.state} · MPLADS Allocation Overview</p>
        </motion.div>

        {/* Top row: Health + Key Metrics */}
        <div className="grid md:grid-cols-4 gap-5">
          {/* Health dial */}
          <div className="md:col-span-1 glass rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center">
            <HealthDial score={constituency.healthScore} />
          </div>

          {/* Metrics */}
          {[
            { label: 'Total Allocation', value: '₹2.5 Cr', color: 'text-saffron' },
            { label: 'Total Spent', value: '₹1.93 Cr', color: 'text-blue-400' },
            { label: 'Completion Rate', value: `${constituency.completionRate}%`, color: 'text-forensic' },
            { label: 'Projects Total', value: constituency.projects.total, color: 'text-white' },
            { label: 'Completed', value: constituency.projects.completed, color: 'text-forensic' },
            { label: 'Ongoing', value: constituency.projects.ongoing, color: 'text-blue-400' },
            { label: 'Delayed', value: constituency.projects.delayed, color: 'text-caution' },
            { label: 'Under Review', value: constituency.projects.review, color: 'text-danger' },
          ].slice(0, 6).map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl border border-white/5 p-4"
            >
              <div className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</div>
              <div className="text-xs text-[#7E9BB4] mt-1">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Action Center + Peer Chart */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* MP Action Center */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <Bell size={14} className="text-saffron" />
              <h2 className="font-semibold text-white text-sm">MP Action Center</h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Urgent */}
              <div>
                <div className="text-xs font-mono text-danger tracking-widest mb-2">URGENT</div>
                <div className="space-y-2">
                  {[
                    { text: `${constituency.projects.delayed} projects delayed >180 days`, icon: '🔴' },
                    { text: '₹82L expenditure cluster requiring review', icon: '🔴' },
                    { text: '2 emerging behavioral patterns detected', icon: '🔴' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-danger/5 border border-danger/10 text-sm">
                      <span>{item.icon}</span>
                      <span className="text-[#A3C2D9]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positive */}
              <div>
                <div className="text-xs font-mono text-forensic tracking-widest mb-2">POSITIVE</div>
                <div className="space-y-2">
                  {[
                    { text: `Completion rate +14% vs last quarter`, icon: '🟢' },
                    { text: 'Pending projects reduced by 6', icon: '🟢' },
                    { text: 'No major active anomalies', icon: '🟢' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-forensic/5 border border-forensic/10 text-sm">
                      <span>{item.icon}</span>
                      <span className="text-[#A3C2D9]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Peer Benchmarking */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-400" />
              <h2 className="font-semibold text-white text-sm">Peer Performance Benchmarking</h2>
            </div>
            <div className="p-5">
              <div className="h-48">
                <ResponsiveContainer>
                  <BarChart data={peerData} layout="vertical" barCategoryGap={10}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#56718A', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <YAxis dataKey="name" type="category" width={130} tick={{ fill: '#A3C2D9', fontSize: 11 }} />
                    <ReferenceLine x={69} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 2" label={{ value: 'Nat. Avg', fill: '#56718A', fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{ background: '#05141F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                      itemStyle={{ color: '#A3C2D9', fontFamily: 'JetBrains Mono' }}
                    />
                    <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                      {peerData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-forensic/5 border border-forensic/20 text-xs text-forensic font-mono text-center">
                🟢 Above peer performance — {constituency.completionRate}% vs {71}% state avg
              </div>
            </div>
          </div>
        </div>

        {/* Community Pulse */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Users size={14} className="text-purple-400" />
            <h2 className="font-semibold text-white text-sm">Community Pulse</h2>
            <span className="ml-auto text-xs text-[#56718A] font-mono">Citizen reports vs Official records</span>
          </div>
          <div className="p-5">
            <div className="glass rounded-xl border border-caution/20 bg-caution/3 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-caution mb-1">STATUS CONFLICT</div>
                  <h3 className="font-semibold text-white text-sm">Community Hall Construction · PRJ-2024-0817</h3>
                  <div className="flex gap-6 mt-2 text-xs">
                    <div><span className="text-[#56718A]">Official: </span><span className="text-forensic">72% Complete</span></div>
                    <div><span className="text-[#56718A]">Community: </span><span className="text-caution">3 reports of incomplete</span></div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#7E9BB4]">
                    <span>📸 2 photos submitted</span>
                    <span>📍 3 location pins</span>
                  </div>
                </div>
                <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-caution/15 border border-caution/30 text-caution text-xs font-semibold hover:bg-caution/25 transition-colors">
                  Request Verification
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Report */}
        <div className="glass rounded-2xl border border-white/5 p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Constituency Reports</h3>
            <p className="text-xs text-[#7E9BB4] mt-0.5">Generate monthly, quarterly, or annual performance reports</p>
          </div>
          <div className="flex gap-3">
            {['Monthly', 'Quarterly', 'Annual'].map(r => (
              <motion.button
                key={r}
                onClick={() => exportReport(r)}
                whileTap={{ scale: 0.96 }}
                animate={exportingReport === r ? { y: [0, -3, 0], borderColor: ['rgba(255,255,255,0.1)', '#3ED6FF', 'rgba(255,255,255,0.1)'] } : {}}
                transition={{ duration: 0.45 }}
                className="px-4 py-2 rounded-xl border border-white/10 text-[#A3C2D9] text-xs hover:bg-white/5 hover:text-white transition-all flex items-center gap-1.5"
              >
                <motion.span animate={exportingReport === r ? { rotate: [0, -12, 12, 0] } : {}}>
                  <FileText size={12} />
                </motion.span>
                {exportingReport === r ? 'Exporting...' : r}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
