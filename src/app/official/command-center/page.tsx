'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Activity, AlertTriangle, TrendingUp, Network,
  FileSearch, Clock, Eye, ChevronRight, ArrowRight,
  Zap, Filter, Bell, Settings, BarChart2, Map, RefreshCw
} from 'lucide-react'
import { nationalStats, liveFeedAlerts, mockProjects } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

// ── Animated Counter ─────────────────────────────────────────────
function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const duration = 1800
    const raf = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 4)
      setDisplay(Math.floor(e * value))
      if (p < 1) requestAnimationFrame(raf)
    }
    const t = setTimeout(() => requestAnimationFrame(raf), 200)
    return () => clearTimeout(t)
  }, [value])
  return <>{prefix}{display.toLocaleString('en-IN')}{suffix}</>
}

// ── KPI Card ────────────────────────────────────────────────────
function KPICard({ label, value, prefix, suffix, color, icon: Icon, trend, delta }: {
  label: string; value: number; prefix?: string; suffix?: string
  color: string; icon: React.ElementType; trend?: 'up' | 'down'; delta?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform`}>
          <Icon size={18} className={color} />
        </div>
        {trend && delta && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'bg-danger/10 text-danger border border-danger/20'
                          : 'bg-forensic/10 text-forensic border border-forensic/20'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold font-mono ${color} mb-1`}>
        <Counter value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-xs text-[#6B7A99] font-medium">{label}</div>
    </motion.div>
  )
}

// ── Feed Alert ──────────────────────────────────────────────────
function FeedAlert({ alert, index }: { alert: typeof liveFeedAlerts[0]; index: number }) {
  const typeColors: Record<string, string> = {
    critical: 'border-l-danger text-danger',
    warning:  'border-l-caution text-caution',
    info:     'border-l-blue-400 text-blue-400',
    success:  'border-l-forensic text-forensic',
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`flex items-start gap-3 p-3 rounded-xl border-l-2 bg-white/2 hover:bg-white/4 transition-all duration-200 cursor-pointer group
        ${typeColors[alert.type] || 'border-l-white/20'}`}
    >
      <span className="text-base mt-0.5 flex-shrink-0">{alert.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#A8B3CF] leading-snug group-hover:text-white transition-colors truncate">{alert.text}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-[#4B5568] font-mono">{alert.time}</span>
          <span className={`text-xs font-mono font-semibold ${typeColors[alert.type]?.split(' ')[1]}`}>{alert.action} →</span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Project Row ─────────────────────────────────────────────────
function ProjectRow({ project }: { project: typeof mockProjects[0] }) {
  const riskColors: Record<string, string> = {
    critical: 'text-danger bg-danger/10 border-danger/20',
    high:     'text-orange-400 bg-orange-400/10 border-orange-400/20',
    medium:   'text-caution bg-caution/10 border-caution/20',
    low:      'text-forensic bg-forensic/10 border-forensic/20',
  }
  return (
    <tr className="border-t border-white/4 hover:bg-white/2 transition-colors group">
      <td className="py-3 px-4">
        <div className="font-medium text-sm text-white group-hover:text-saffron transition-colors">{project.name}</div>
        <div className="text-xs text-[#4B5568] font-mono mt-0.5">{project.id}</div>
      </td>
      <td className="py-3 px-4 text-sm text-[#A8B3CF]">{project.constituency}</td>
      <td className="py-3 px-4">
        <div className="w-full bg-white/5 rounded-full h-1.5 mb-1">
          <div
            className={`h-full rounded-full ${
              project.riskScore > 75 ? 'bg-danger' :
              project.riskScore > 50 ? 'bg-caution' : 'bg-forensic'
            }`}
            style={{ width: `${project.completion}%` }}
          />
        </div>
        <div className="text-xs text-[#4B5568] font-mono">{project.completion}%</div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono border ${riskColors[project.riskLevel] || riskColors.low}`}>
          {project.riskScore}
        </span>
      </td>
      <td className="py-3 px-4">
        <Link
          href={`/official/behavioral-dna?project=${project.id}`}
          className="text-xs text-saffron hover:text-saffron-light font-mono flex items-center gap-1"
        >
          Analyse <ArrowRight size={10} />
        </Link>
      </td>
    </tr>
  )
}

// ── Navigation Items ─────────────────────────────────────────────
export const navItems = [
  { href: '/official/command-center',     icon: Activity,     label: 'Command Center',       active: true },
  { href: '/official/behavioral-dna',     icon: Shield,        label: 'Behavioral DNA',      badge: '87' },
  { href: '/official/peer-benchmarking',  icon: BarChart2,     label: 'Peer Benchmarking' },
  { href: '/official/network-intelligence',icon: Network,      label: 'Network Intelligence' },
  { href: '/official/evidence-verification',icon: FileSearch,  label: 'Evidence Verification' },
  { href: '/official/forensic-reasoning', icon: Eye,           label: 'Forensic Reasoning' },
  { href: '/official/case-replay',        icon: Clock,         label: 'Case Replay',          badge: 'NEW' },
  { href: '/official/case-files',         icon: AlertTriangle, label: 'Case Files',           badge: '312' },
]

export default function CommandCenter() {
  const [feedAlerts, setFeedAlerts] = useState(liveFeedAlerts)
  const [tick, setTick] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // Simulate live feed rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  // High-risk projects for the table
  const highRisk = [...mockProjects]
    .filter(p => p.riskScore > 50)
    .sort((a, b) => b.riskScore - a.riskScore)

  return (
    <OfficialLayout activeHref="/official/command-center">
      <div className="p-6 lg:p-8 space-y-8">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-forensic animate-pulse-green" />
              <span className="text-xs font-mono text-[#4B5568] tracking-widest">LIVE MONITORING</span>
            </div>
            <h1 className="font-display font-bold text-white text-3xl">Command Center</h1>
            <p className="text-[#6B7A99] text-sm mt-1">MPLADS Forensic Intelligence — National Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={16} className="text-[#A8B3CF]" />
            </button>
            <button className="p-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 transition-all relative">
              <Bell size={16} className="text-[#A8B3CF]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full text-[8px] flex items-center justify-center font-mono text-white">8</span>
            </button>
            <button className="p-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 transition-all">
              <Settings size={16} className="text-[#A8B3CF]" />
            </button>
          </div>
        </div>

        {/* ── KPI Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Projects Monitored"    value={nationalStats.projectsAnalysed}     icon={Activity}       color="text-saffron"  trend="up" delta="3.2%" />
          <KPICard label="High-Risk Projects"    value={nationalStats.highRiskProjects}      icon={AlertTriangle}  color="text-danger"   trend="up" delta="12" />
          <KPICard label="Active Investigations" value={nationalStats.activeInvestigations}  icon={Eye}            color="text-caution"  />
          <KPICard label="Patterns Discovered"   value={nationalStats.patternsDiscovered}    icon={TrendingUp}     color="text-forensic" trend="up" delta="7" />
        </div>

        {/* ── Second Row KPIs ────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Funds Under Review"   value={847}  suffix=" Cr" prefix="₹" icon={Shield}     color="text-blue-400" />
          <KPICard label="Evidence Flags"       value={1893}                         icon={FileSearch} color="text-purple-400" trend="up" delta="23" />
          <KPICard label="Pending Reviews"      value={312}                          icon={Clock}      color="text-caution" />
          <KPICard label="Cases Resolved"       value={2847}                         icon={Network}    color="text-forensic" trend="down" delta="14" />
        </div>

        {/* ── Main Content Grid ─────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Live Intelligence Feed */}
          <div className="lg:col-span-1 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-saffron" />
                <h2 className="font-semibold text-white text-sm">Live Intelligence Feed</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forensic animate-pulse" />
                <span className="text-xs font-mono text-forensic">LIVE</span>
              </div>
            </div>

            <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {feedAlerts.map((alert, i) => (
                  <FeedAlert key={`${alert.id}-${tick}`} alert={alert} index={i} />
                ))}
              </AnimatePresence>
            </div>

            <div className="px-5 py-3 border-t border-white/5">
              <Link href="/official/case-files" className="flex items-center gap-2 text-xs text-saffron font-mono hover:text-saffron-light transition-colors">
                View all alerts <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* India Map placeholder + stats */}
          <div className="lg:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Map size={14} className="text-saffron" />
                <h2 className="font-semibold text-white text-sm">National Risk Map</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#A8B3CF] border border-white/8 hover:bg-white/5 transition-all">
                  <Filter size={10} /> Filter
                </button>
                <Link href="/official/network-intelligence" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-saffron border border-saffron/25 hover:bg-saffron/10 transition-all font-mono">
                  Full Map <ArrowRight size={10} />
                </Link>
              </div>
            </div>

            {/* Map SVG Placeholder */}
            <div className="relative h-72 bg-gradient-to-br from-white/2 to-transparent flex items-center justify-center overflow-hidden">
              {/* India outline approximation using SVG art */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 400 450" className="w-full h-full max-w-xs opacity-60" fill="none">
                  {/* Simplified India polygon for visual effect */}
                  <path
                    d="M200 30 L280 60 L320 100 L340 150 L330 200 L310 240 L280 280 L250 310 L200 380 L160 360 L130 330 L110 290 L90 250 L80 200 L90 150 L110 100 L150 60 Z"
                    fill="rgba(255,107,0,0.05)"
                    stroke="rgba(255,107,0,0.2)"
                    strokeWidth="1.5"
                  />
                  {/* Risk dots */}
                  {[
                    { cx: 200, cy: 160, r: 8, color: '#FF3B5C', pulse: true },
                    { cx: 170, cy: 200, r: 6, color: '#FF6B00', pulse: true },
                    { cx: 220, cy: 230, r: 5, color: '#FF6B00' },
                    { cx: 160, cy: 140, r: 4, color: '#FFD60A' },
                    { cx: 240, cy: 180, r: 4, color: '#FFD60A' },
                    { cx: 190, cy: 270, r: 3, color: '#4FFFB0' },
                    { cx: 210, cy: 120, r: 5, color: '#FF3B5C', pulse: true },
                    { cx: 150, cy: 170, r: 3, color: '#FFD60A' },
                    { cx: 250, cy: 260, r: 4, color: '#4FFFB0' },
                    { cx: 180, cy: 300, r: 3, color: '#4FFFB0' },
                  ].map((dot, i) => (
                    <g key={i}>
                      <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} opacity={0.8} />
                      {dot.pulse && (
                        <circle cx={dot.cx} cy={dot.cy} r={dot.r + 4} fill={dot.color} opacity={0.1}>
                          <animate attributeName="r" from={dot.r + 2} to={dot.r + 10} dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  ))}
                </svg>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
                {[
                  { color: 'bg-danger', label: 'Critical Risk (>75)' },
                  { color: 'bg-saffron', label: 'High Risk (50–75)' },
                  { color: 'bg-caution', label: 'Medium Risk (25–50)' },
                  { color: 'bg-forensic', label: 'Low Risk (<25)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-[#6B7A99] font-mono">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Top states */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="text-xs text-[#4B5568] font-mono mb-1">TOP RISK STATES</div>
                {[
                  { state: 'Uttar Pradesh', risk: 72, color: 'text-danger' },
                  { state: 'Bihar', risk: 68, color: 'text-orange-400' },
                  { state: 'Jharkhand', risk: 63, color: 'text-caution' },
                ].map(s => (
                  <div key={s.state} className="flex items-center gap-2 glass-sm px-2.5 py-1.5 rounded-lg">
                    <span className={`font-mono font-bold text-xs ${s.color}`}>{s.risk}</span>
                    <span className="text-xs text-[#A8B3CF]">{s.state}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── High Risk Projects Table ───────────────────────── */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-danger" />
              <h2 className="font-semibold text-white text-sm">High-Priority Projects</h2>
              <span className="px-2 py-0.5 rounded-full bg-danger/10 border border-danger/20 text-xs font-mono text-danger">
                {highRisk.length} flagged
              </span>
            </div>
            <Link href="/official/case-files" className="flex items-center gap-1.5 text-xs text-saffron font-mono hover:text-saffron-light transition-colors">
              View all cases <ChevronRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Project', 'Constituency', 'Completion', 'Risk Score', 'Action'].map(col => (
                    <th key={col} className="text-left py-3 px-4 text-xs text-[#4B5568] font-mono uppercase tracking-widest">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRisk.map(p => <ProjectRow key={p.id} project={p} />)}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Feature Quick Access ───────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { href: '/official/behavioral-dna',      icon: Shield,      label: 'Behavioral DNA',       color: 'text-saffron', border: 'border-saffron/20' },
            { href: '/official/peer-benchmarking',   icon: BarChart2,   label: 'Peer Benchmarking',    color: 'text-blue-400', border: 'border-blue-400/20' },
            { href: '/official/network-intelligence',icon: Network,     label: 'Network Graph',        color: 'text-purple-400', border: 'border-purple-400/20' },
            { href: '/official/evidence-verification',icon: FileSearch, label: 'Evidence Lab',         color: 'text-forensic', border: 'border-forensic/20' },
            { href: '/official/forensic-reasoning',  icon: Eye,         label: 'Forensic Reasoning',   color: 'text-caution', border: 'border-caution/20' },
            { href: '/official/case-replay',         icon: Clock,       label: 'Case Replay',          color: 'text-danger', border: 'border-danger/20' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
            >
              <Link href={item.href}
                className={`flex flex-col items-center gap-3 p-4 glass rounded-xl border ${item.border} 
                  hover:bg-white/5 transition-all duration-300 group text-center`}
              >
                <item.icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-[#A8B3CF] group-hover:text-white transition-colors leading-tight">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </OfficialLayout>
  )
}
