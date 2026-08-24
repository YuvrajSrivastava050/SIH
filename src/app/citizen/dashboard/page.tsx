'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, MapPin, ArrowRight, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react'
import { mockProjects, mockConstituencies } from '@/lib/mock-data'

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  completed: { label: 'Completed', color: 'text-forensic', bg: 'bg-forensic/10 border-forensic/20', dot: 'bg-forensic' },
  ongoing:   { label: 'Ongoing',   color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', dot: 'bg-blue-400' },
  delayed:   { label: 'Delayed',   color: 'text-caution',  bg: 'bg-caution/10 border-caution/20',   dot: 'bg-caution' },
  review:    { label: 'Review',    color: 'text-danger',   bg: 'bg-danger/10 border-danger/20',     dot: 'bg-danger' },
}

const constituency = mockConstituencies[0]

function ProjectCard({ project }: { project: typeof mockProjects[0] }) {
  const sc = statusConfig[project.status]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-2xl border border-white/5 hover:border-white/12 p-5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} inline-block mr-1.5`} />
          {sc.label}
        </span>
        <span className="text-xs font-mono text-[#56718A]">{project.id}</span>
      </div>

      <h3 className="font-semibold text-white text-base group-hover:text-saffron transition-colors mb-1 leading-snug">{project.name}</h3>

      <div className="flex items-center gap-1.5 text-xs text-[#7E9BB4] mb-3">
        <MapPin size={11} />
        {project.constituency}, {project.state}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#56718A]">Completion</span>
          <span className="font-mono text-white">{project.completion}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.completion}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full rounded-full ${
              project.status === 'completed' ? 'bg-forensic' :
              project.status === 'delayed' ? 'bg-caution' :
              project.status === 'review' ? 'bg-danger' : 'bg-blue-400'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-bold text-white">₹{(project.amount / 100000).toFixed(1)}L</span>
        <Link href={`/citizen/project/${project.id}`}
          className="flex items-center gap-1 text-saffron hover:text-saffron-light transition-colors font-mono"
        >
          View Journey <ArrowRight size={10} />
        </Link>
      </div>
    </motion.div>
  )
}

export default function CitizenDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = mockProjects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.constituency.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = {
    all: mockProjects.length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
    ongoing: mockProjects.filter(p => p.status === 'ongoing').length,
    delayed: mockProjects.filter(p => p.status === 'delayed').length,
    review: mockProjects.filter(p => p.status === 'review').length,
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
          <span className="text-xs font-mono text-blue-400 border border-blue-400/25 px-2 py-0.5 rounded-full">CITIZEN</span>
        </div>
        <Link href="/auth/login" className="text-xs text-[#7E9BB4] hover:text-white transition-colors">Switch Role</Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-mono text-blue-400 tracking-widest mb-2">CITIZEN TRANSPARENCY PORTAL</div>
          <h1 className="font-display font-bold text-white text-3xl mb-1">
            Where is the money going?
          </h1>
          <p className="text-[#7E9BB4]">
            Track MPLADS fund utilization in {constituency.name}. See every project, its status, and its journey.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Allocation', value: '₹2.5 Cr', icon: Activity, color: 'text-saffron' },
            { label: 'Projects Approved', value: constituency.projects.total, icon: CheckCircle, color: 'text-blue-400' },
            { label: 'Completed', value: constituency.projects.completed, icon: CheckCircle, color: 'text-forensic' },
            { label: 'Delayed', value: constituency.projects.delayed, icon: AlertTriangle, color: 'text-caution' },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl border border-white/5 p-4 flex items-center gap-3"
            >
              <c.icon size={18} className={c.color} />
              <div>
                <div className={`text-xl font-bold font-mono ${c.color}`}>{c.value}</div>
                <div className="text-xs text-[#7E9BB4]">{c.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status legend */}
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <span className="text-[#56718A] font-mono">Project Status:</span>
          {Object.entries(statusConfig).map(([key, sc]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
              <span className={sc.color}>{sc.label}</span>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#56718A]" />
            <input
              type="text"
              placeholder="Search projects, constituencies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/8 text-white placeholder-[#56718A] text-sm focus:outline-none focus:border-saffron/40 transition-colors bg-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'completed', 'ongoing', 'delayed', 'review'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterStatus === status
                    ? status === 'all' ? 'bg-saffron/15 border border-saffron/30 text-saffron'
                      : `${statusConfig[status as keyof typeof statusConfig]?.bg} ${statusConfig[status as keyof typeof statusConfig]?.color} border`
                    : 'border border-white/8 text-[#7E9BB4] hover:text-white'
                }`}
              >
                {status !== 'all' && <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[status as keyof typeof statusConfig]?.dot}`} />}
                {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig]?.label}
                <span className="font-mono text-xs opacity-60">{counts[status as keyof typeof counts]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#56718A]">
            <Search size={32} className="mx-auto mb-3 opacity-30" />
            <div>No projects found</div>
          </div>
        )}

        {/* Community Pulse CTA */}
        <div className="glass rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white mb-1">Something doesn't look right? 🤔</h3>
            <p className="text-sm text-[#A3C2D9]">Submit a photo, location, or description. Your report becomes community evidence.</p>
          </div>
          <button className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-purple-400/15 border border-purple-400/30 text-purple-300 font-semibold text-sm hover:bg-purple-400/25 transition-colors">
            Report Issue
          </button>
        </div>
      </div>
    </div>
  )
}
