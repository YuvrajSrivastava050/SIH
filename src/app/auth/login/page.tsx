'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield, Eye, Users, Lock, Zap } from 'lucide-react'

const roles = [
  {
    id: 'citizen',
    icon: Users,
    emoji: '👤',
    title: 'Citizen',
    subtitle: 'Transparency & Public Access',
    description: 'Track constituency projects, view fund utilization, and report ground reality.',
    features: ['Project explorer', 'Fund tracking', 'Community reporting', 'Project timeline'],
    color: 'blue',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    bg: 'from-blue-500/10 to-transparent',
    accent: 'text-blue-400',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/20',
    href: '/citizen/dashboard',
  },
  {
    id: 'official',
    icon: Shield,
    emoji: '🏛️',
    title: 'Government Official',
    subtitle: 'Forensic Investigation Layer',
    description: 'Full forensic intelligence: behavioral DNA, network mapping, evidence verification, and case management.',
    features: ['Behavioral DNA Lab', 'Network Intelligence', 'Evidence Verification', 'Forensic Reasoning', 'Case Replay'],
    color: 'saffron',
    border: 'border-saffron/40',
    glow: 'shadow-saffron',
    bg: 'from-saffron/15 to-transparent',
    accent: 'text-saffron',
    accentBg: 'bg-saffron/10',
    accentBorder: 'border-saffron/25',
    href: '/official/command-center',
    featured: true,
  },
  {
    id: 'mp',
    icon: Eye,
    emoji: '👨‍💼',
    title: 'MP / Senior Official',
    subtitle: 'Strategic Intelligence Layer',
    description: 'Constituency health overview, peer benchmarking, and action-oriented alerts.',
    features: ['Constituency health', 'Peer benchmarking', 'Action center', 'Community pulse'],
    color: 'forensic',
    border: 'border-forensic/30',
    glow: 'shadow-green',
    bg: 'from-forensic/10 to-transparent',
    accent: 'text-forensic',
    accentBg: 'bg-forensic/10',
    accentBorder: 'border-forensic/20',
    href: '/mp/dashboard',
  },
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEnter = () => {
    if (!selectedRole) return
    const role = roles.find(r => r.id === selectedRole)
    if (!role) return
    setLoading(true)
    setTimeout(() => {
      router.push(role.href)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#04070F] flex flex-col relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-saffron/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-blue-600/4 rounded-full blur-[100px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Nav */}
      <div className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs font-mono">N</span>
          </div>
          <span className="font-display font-bold text-white">NIRIKSHAN</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#4B5568] font-mono">
          <Lock size={10} />
          SECURE ACCESS PORTAL
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron/20 bg-saffron/8 text-saffron text-xs font-mono mb-6">
            <Zap size={10} /> SELECT YOUR ACCESS LEVEL
          </div>
          <h1 className="font-display font-bold text-white text-4xl mb-3">
            Choose Your Interface
          </h1>
          <p className="text-[#6B7A99] text-lg max-w-xl mx-auto">
            NIRIKSHAN serves three stakeholders, each with a purpose-built view of the same intelligence.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-5 w-full max-w-5xl mb-10">
          {roles.map((role, i) => {
            const isSelected = selectedRole === role.id
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedRole(role.id)}
                className={`relative text-left glass rounded-2xl p-6 border transition-all duration-300 overflow-hidden
                  ${isSelected ? `${role.border} scale-[1.03] ${role.glow}` : 'border-white/8 hover:border-white/15'}
                  ${role.featured ? 'md:scale-105' : ''}
                `}
              >
                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.bg} pointer-events-none transition-opacity duration-300
                  ${isSelected ? 'opacity-100' : 'opacity-40'}`}
                />

                {/* Selected ring */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-ring"
                    className={`absolute inset-0 rounded-2xl border-2 ${role.border} pointer-events-none`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{role.emoji}</div>
                    {role.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-saffron/20 border border-saffron/30 text-xs font-mono text-saffron">
                        FULL ACCESS
                      </span>
                    )}
                    {isSelected && !role.featured && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-5 h-5 rounded-full ${role.accentBg} ${role.accent} flex items-center justify-center text-xs`}
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <div className={`text-xs font-mono tracking-widest uppercase mb-1 ${role.accent}`}>
                      {role.subtitle}
                    </div>
                    <h3 className="font-display font-bold text-white text-xl">{role.title}</h3>
                  </div>

                  <p className="text-[#A8B3CF] text-sm leading-relaxed">{role.description}</p>

                  <div className="flex flex-col gap-1.5">
                    {role.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-[#6B7A99]">
                        <div className={`w-1 h-1 rounded-full ${isSelected ? role.accentBg.replace('bg-', 'bg-').replace('/10', '') : 'bg-white/20'}`}
                          style={{ backgroundColor: isSelected ? undefined : '#374151' }}
                        />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Enter Button */}
        <AnimatePresence>
          {selectedRole && (
            <motion.button
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={handleEnter}
              disabled={loading}
              className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-saffron text-white font-semibold text-lg
                hover:bg-saffron-light transition-all duration-300 shadow-saffron hover:shadow-[0_0_40px_rgba(255,107,0,0.4)]
                disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Enter NIRIKSHAN
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {!selectedRole && (
          <p className="text-xs text-[#4B5568] font-mono mt-2">← Select a role to continue</p>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-4 border-t border-white/5 flex items-center justify-center">
        <p className="text-xs text-[#4B5568] font-mono">
          For SIH 2026 demonstration purposes · All data is synthetic
        </p>
      </div>
    </div>
  )
}
