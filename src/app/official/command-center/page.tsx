'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Activity, AlertTriangle, TrendingUp, Network,
  FileSearch, Clock, Eye, ChevronRight, ArrowRight,
  Zap, Filter, Bell, Settings, RefreshCw
} from 'lucide-react'
import { nationalStats, liveFeedAlerts, mockProjects } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'
import TerrainBackground from '@/components/TerrainBackground'

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

// ── KPI cell (lives inside the unified pulse card) ───────────────
function KPICell({ label, value, prefix, suffix, color, icon: Icon, trend, delta }: {
  label: string; value: number; prefix?: string; suffix?: string
  color: string; icon: React.ElementType; trend?: 'up' | 'down'; delta?: string
}) {
  return (
    <div className="group relative px-6 py-6 transition-colors duration-300 hover:bg-sky-400/[0.04]">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-sky-400/8 border border-sky-400/12 group-hover:scale-105 transition-transform">
          <Icon size={16} className={color} />
        </div>
        {trend && delta && (
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'bg-danger/10 text-danger border border-danger/20'
                          : 'bg-forensic/10 text-forensic border border-forensic/20'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <div className={`text-[1.7rem] leading-none font-bold font-mono ${color} mb-2`}>
        <Counter value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-xs text-[#7E9BB4] font-medium">{label}</div>
    </div>
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
      className={`flex items-start gap-3 p-3 rounded-xl border-l-2 bg-sky-400/[0.03] hover:bg-sky-400/[0.07] transition-all duration-200 cursor-pointer group
        ${typeColors[alert.type] || 'border-l-white/20'}`}
    >
      <span className="text-base mt-0.5 flex-shrink-0">{alert.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#A3C2D9] leading-snug group-hover:text-white transition-colors truncate">{alert.text}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-[#56718A] font-mono">{alert.time}</span>
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
    <tr className="border-t border-sky-400/6 hover:bg-sky-400/[0.04] transition-colors group">
      <td className="py-3.5 px-6">
        <div className="font-medium text-sm text-white group-hover:text-saffron-light transition-colors">{project.name}</div>
        <div className="text-xs text-[#56718A] font-mono mt-0.5">{project.id}</div>
      </td>
      <td className="py-3.5 px-6 text-sm text-[#A3C2D9]">{project.constituency}</td>
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-3">
          <div className="w-24 bg-sky-400/10 rounded-full h-1.5">
            <div
              className={`h-full rounded-full ${
                project.riskScore > 75 ? 'bg-danger' :
                project.riskScore > 50 ? 'bg-caution' : 'bg-forensic'
              }`}
              style={{ width: `${project.completion}%` }}
            />
          </div>
          <span className="text-xs text-[#7E9BB4] font-mono">{project.completion}%</span>
        </div>
      </td>
      <td className="py-3.5 px-6">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono border ${riskColors[project.riskLevel] || riskColors.low}`}>
          {project.riskScore}
        </span>
      </td>
      <td className="py-3.5 px-6">
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

// ── Card header helper ──────────────────────────────────────────
function CardHeader({ icon: Icon, title, accent, right }: {
  icon: React.ElementType; title: string; accent: string; right?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-sky-400/8">
      <div className="flex items-center gap-2.5">
        <Icon size={14} className={accent} />
        <h2 className="font-semibold text-white text-sm tracking-wide">{title}</h2>
      </div>
      {right}
    </div>
  )
}

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
    setFeedAlerts([...liveFeedAlerts].reverse())
    setTimeout(() => setRefreshing(false), 1200)
  }

  // High-risk projects for the table
  const highRisk = [...mockProjects]
    .filter(p => p.riskScore > 50)
    .sort((a, b) => b.riskScore - a.riskScore)

  return (
    <OfficialLayout activeHref="/official/command-center">
      <div className="px-6 lg:px-10 py-8 space-y-6 max-w-[1600px]">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-forensic animate-pulse-green" />
              <span className="text-xs font-mono text-[#56718A] tracking-[0.25em]">LIVE MONITORING</span>
            </div>
            <h1 className="font-display font-bold text-white text-3xl tracking-tight">Command Center</h1>
            <p className="text-[#7E9BB4] text-sm mt-1.5">MPLADS Forensic Intelligence — National Overview</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl border border-sky-400/12 bg-sky-400/5 hover:bg-sky-400/12 transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={16} className="text-[#A3C2D9]" />
            </button>
            <button className="p-2.5 rounded-xl border border-sky-400/12 bg-sky-400/5 hover:bg-sky-400/12 transition-all relative">
              <Bell size={16} className="text-[#A3C2D9]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-danger rounded-full text-[8px] flex items-center justify-center font-mono text-white">8</span>
            </button>
            <button className="p-2.5 rounded-xl border border-sky-400/12 bg-sky-400/5 hover:bg-sky-400/12 transition-all">
              <Settings size={16} className="text-[#A3C2D9]" />
            </button>
          </div>
        </div>

        {/* ── National Pulse — all KPIs in one organised card ──── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <CardHeader
            icon={Activity}
            title="National Pulse"
            accent="text-saffron"
            right={
              <span className="text-[11px] font-mono text-[#56718A] tracking-[0.2em] uppercase">
                FY 2025–26 · Updated 2 min ago
              </span>
            }
          />
          <div className="grid grid-cols-2 xl:grid-cols-4">
            <KPICell label="Projects Monitored"    value={nationalStats.projectsAnalysed}     icon={Activity}       color="text-saffron"    trend="up" delta="3.2%" />
            <KPICell label="High-Risk Projects"    value={nationalStats.highRiskProjects}      icon={AlertTriangle}  color="text-danger"     trend="up" delta="12" />
            <KPICell label="Active Investigations" value={nationalStats.activeInvestigations}  icon={Eye}            color="text-caution" />
            <KPICell label="Patterns Discovered"   value={nationalStats.patternsDiscovered}    icon={TrendingUp}     color="text-forensic"   trend="up" delta="7" />
            <KPICell label="Funds Under Review"    value={847}  suffix=" Cr" prefix="₹"        icon={Shield}         color="text-blue-400"   />
            <KPICell label="Evidence Flags"        value={1893}                                icon={FileSearch}     color="text-purple-400" trend="up" delta="23" />
            <KPICell label="Pending Reviews"       value={312}                                 icon={Clock}          color="text-caution"    />
            <KPICell label="Cases Resolved"        value={2847}                                icon={Network}        color="text-forensic"   trend="down" delta="14" />
          </div>
        </motion.section>

        {/* ── Feed + Terrain Risk Map ──────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Live Intelligence Feed */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-2xl overflow-hidden flex flex-col"
          >
            <CardHeader
              icon={Zap}
              title="Live Intelligence Feed"
              accent="text-saffron"
              right={
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forensic animate-pulse" />
                  <span className="text-xs font-mono text-forensic">LIVE</span>
                </div>
              }
            />

            <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[26rem]">
              <AnimatePresence>
                {feedAlerts.map((alert, i) => (
                  <FeedAlert key={`${alert.id}-${tick}`} alert={alert} index={i} />
                ))}
              </AnimatePresence>
            </div>

            <div className="px-6 py-3.5 border-t border-sky-400/8">
              <Link href="/official/case-files" className="flex items-center gap-2 text-xs text-saffron font-mono hover:text-saffron-light transition-colors">
                View all alerts <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>

          {/* National Risk Map — interactive terrain */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 glass rounded-2xl overflow-hidden flex flex-col"
          >
            <CardHeader
              icon={Network}
              title="National Risk Map"
              accent="text-saffron"
              right={
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#A3C2D9] border border-sky-400/12 hover:bg-sky-400/10 transition-all">
                    <Filter size={10} /> Filter
                  </button>
                  <Link href="/official/network-intelligence" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-saffron border border-saffron/25 hover:bg-saffron/10 transition-all font-mono">
                    Full Map <ArrowRight size={10} />
                  </Link>
                </div>
              }
            />

            {/* Interactive terrain map */}
            <div className="relative flex-1 min-h-[22rem] overflow-hidden">
              <TerrainBackground
                variant="map"
                density={0.8}
                imageSrc="/terrain-bg.png"
                className="absolute inset-0"
              />

              {/* Top risk states — floating chips */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <div className="text-[10px] text-[#7E9BB4] font-mono tracking-[0.2em] mb-0.5 text-right">TOP RISK STATES</div>
                {[
                  { state: 'Uttar Pradesh', risk: 72, color: 'text-danger' },
                  { state: 'Bihar', risk: 68, color: 'text-orange-400' },
                  { state: 'Jharkhand', risk: 63, color: 'text-caution' },
                ].map(s => (
                  <div key={s.state} className="flex items-center gap-2 glass-sm px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <span className={`font-mono font-bold text-xs ${s.color}`}>{s.risk}</span>
                    <span className="text-xs text-[#C4DAEA]">{s.state}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-5 flex flex-col gap-1.5 z-10">
                {[
                  { color: 'bg-danger', label: 'Critical Risk (>75)' },
                  { color: 'bg-orange-400', label: 'High Risk (50–75)' },
                  { color: 'bg-caution', label: 'Medium Risk (25–50)' },
                  { color: 'bg-forensic', label: 'Low Risk (<25)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_6px_currentColor]`} />
                    <span className="text-xs text-[#A3C2D9] font-mono">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── High Risk Projects ──────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <CardHeader
            icon={AlertTriangle}
            title="High-Priority Projects"
            accent="text-danger"
            right={
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full bg-danger/10 border border-danger/20 text-xs font-mono text-danger">
                  {highRisk.length} flagged
                </span>
                <Link href="/official/case-files" className="flex items-center gap-1.5 text-xs text-saffron font-mono hover:text-saffron-light transition-colors">
                  View all cases <ChevronRight size={12} />
                </Link>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sky-400/8">
                  {['Project', 'Constituency', 'Completion', 'Risk Score', 'Action'].map(col => (
                    <th key={col} className="text-left py-3 px-6 text-[11px] text-[#56718A] font-mono uppercase tracking-[0.2em]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRisk.map(p => <ProjectRow key={p.id} project={p} />)}
              </tbody>
            </table>
          </div>
        </motion.section>

      </div>
    </OfficialLayout>
  )
}