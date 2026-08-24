'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Shield, Eye, TrendingUp, Network, FileSearch, Clock, ChevronRight, ArrowRight, Zap, Globe } from 'lucide-react'
import { nationalStats } from '@/lib/mock-data'

// ── Animated Counter ──────────────────────────────────────────────
function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const duration = 2000
    const raf = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(eased * value)
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, value])

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.floor(display).toLocaleString('en-IN')

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, prefix, suffix, color }: {
  label: string; value: number; prefix?: string; suffix?: string; color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-6 flex flex-col gap-2 border border-white/5 hover:border-white/10 transition-all duration-300 group"
    >
      <div className={`text-3xl font-bold font-mono ${color} group-hover:text-glow-saffron transition-all`}>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-sm text-[#6B7A99] font-medium">{label}</div>
    </motion.div>
  )
}

// ── Role Card ─────────────────────────────────────────────────────
const roleCards = [
  {
    id: 'citizen',
    icon: '👤',
    title: 'Citizen',
    subtitle: 'Transparency Layer',
    description: 'Track where your constituency\'s funds went. View project status, timelines, and report ground reality.',
    href: '/citizen/dashboard',
    color: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    accent: 'text-blue-400',
    glow: 'shadow-blue-500/10',
    cta: 'Enter Citizen Portal',
  },
  {
    id: 'official',
    icon: '🏛️',
    title: 'Government Official',
    subtitle: 'Investigation Layer',
    description: 'Forensic intelligence, behavioral analysis, network mapping, and evidence verification for investigators.',
    href: '/official/command-center',
    color: 'from-saffron/10 to-orange-600/5',
    border: 'border-saffron/30',
    accent: 'text-saffron',
    glow: 'shadow-saffron/20',
    cta: 'Enter Command Center',
    featured: true,
  },
  {
    id: 'mp',
    icon: '👨‍💼',
    title: 'MP / Senior Official',
    subtitle: 'Strategic Intelligence',
    description: 'Constituency health at a glance. Peer performance benchmarks, action priorities, and citizen pulse.',
    href: '/mp/dashboard',
    color: 'from-forensic/10 to-emerald-600/5',
    border: 'border-forensic/20',
    accent: 'text-forensic',
    glow: 'shadow-forensic/10',
    cta: 'Enter MP Portal',
  },
]

// ── Feature Card ───────────────────────────────────────────────────
const features = [
  {
    icon: Shield,
    number: '01',
    title: 'Behavioral DNA',
    description: 'Every project gets a 6-dimensional behavioral fingerprint. We detect suspicious behavior, not just rule violations.',
    color: 'text-saffron',
    glowColor: 'group-hover:shadow-saffron',
  },
  {
    icon: TrendingUp,
    number: '02',
    title: 'Adaptive Peer Benchmarking',
    description: 'We dynamically construct each project\'s true peer group and compare it across national, local, and contractor dimensions.',
    color: 'text-blue-400',
    glowColor: 'group-hover:shadow-blue-500/30',
  },
  {
    icon: Network,
    number: '03',
    title: 'Network Intelligence',
    description: 'Map hidden relationships between projects, contractors, agencies, and entities. Find the missing link.',
    color: 'text-purple-400',
    glowColor: 'group-hover:shadow-purple-500/30',
  },
  {
    icon: FileSearch,
    number: '04',
    title: 'Evidence & Timeline Verification',
    description: 'Cross-validate photos, GPS, timestamps, documents, and shadow angles. Does the project\'s story make sense?',
    color: 'text-forensic',
    glowColor: 'group-hover:shadow-forensic',
  },
  {
    icon: Eye,
    number: '05',
    title: 'Forensic Reasoning + Counter-Evidence',
    description: 'We build the case — then actively try to disprove it. Prosecution and defense, from the same intelligence engine.',
    color: 'text-caution',
    glowColor: 'group-hover:shadow-yellow-400/30',
  },
  {
    icon: Clock,
    number: '06',
    title: 'Historical Case Replay',
    description: 'Turn back the clock on real documented cases. See exactly when NIRIKSHAN would have raised the early warning.',
    color: 'text-danger',
    glowColor: 'group-hover:shadow-danger',
  },
]

// ── Pipeline Step ──────────────────────────────────────────────────
const pipelineSteps = [
  'DATA INPUT', 'BEHAVIORAL DNA', 'PEER INTELLIGENCE', 'PATTERN DISCOVERY',
  'NETWORK MAPPING', 'EVIDENCE VERIFICATION', 'FORENSIC REASONING',
  'COUNTER-EVIDENCE', 'INVESTIGATION PRIORITY', 'CASE & ACTION',
]

// ── Floating particle positions (deterministic, not random) ─────────
const particlePositions = [
  { x: 15, y: 20, size: 1.5, opacity: 0.4, dur: 4 },
  { x: 72, y: 15, size: 1,   opacity: 0.3, dur: 6 },
  { x: 45, y: 70, size: 2,   opacity: 0.5, dur: 3 },
  { x: 88, y: 45, size: 1.2, opacity: 0.35,dur: 5 },
  { x: 30, y: 85, size: 1.8, opacity: 0.4, dur: 7 },
  { x: 62, y: 35, size: 1,   opacity: 0.25,dur: 4 },
  { x: 10, y: 60, size: 2.2, opacity: 0.3, dur: 5 },
  { x: 80, y: 78, size: 1.5, opacity: 0.45,dur: 6 },
  { x: 55, y: 10, size: 1,   opacity: 0.3, dur: 3 },
  { x: 92, y: 90, size: 1.8, opacity: 0.4, dur: 8 },
  { x: 25, y: 45, size: 1.2, opacity: 0.35,dur: 5 },
  { x: 70, y: 60, size: 2,   opacity: 0.3, dur: 4 },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#04070F] overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#04070F]/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">N</span>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-wide">NIRIKSHAN</span>
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron/10 border border-saffron/20 text-xs text-saffron font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse inline-block" />
              LIVE
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-[#A8B3CF]">
            {['Features', 'Approach', 'Platform'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="hover:text-white transition-colors duration-200 hover:text-glow-saffron">
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-[#A8B3CF] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/official/command-center"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold hover:bg-saffron-light transition-all duration-200 shadow-saffron">
              Enter Platform <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-saffron/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-forensic/5 rounded-full blur-[80px]" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particlePositions.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-saffron/30"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size * 4}px`,
                height: `${p.size * 4}px`,
                opacity: p.opacity,
              }}
              animate={{ y: [0, -16, 0], opacity: [p.opacity, p.opacity * 1.5, p.opacity] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron/25 bg-saffron/8 text-saffron text-sm font-mono mb-8"
          >
            <Zap size={12} />
            SIH 2026 — MPLADS Forensic Intelligence Platform
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            <span className="block">NIRIKSHAN</span>
            <span
              className="block mt-2"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FFD60A 60%, #FF6B00 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              निरीक्षण
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-[#A8B3CF] font-light mb-4 tracking-wide"
          >
            See the pattern before the loss.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[#4B5568] text-sm md:text-base font-mono mb-12 max-w-2xl mx-auto"
          >
            AI-powered behavioral analysis · Pattern evolution tracking · Forensic reasoning · Counter-evidence engine
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/official/command-center"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-saffron text-white font-semibold text-lg hover:bg-saffron-light transition-all duration-300 shadow-saffron hover:shadow-[0_0_40px_rgba(255,107,0,0.4)]"
            >
              Enter Command Center
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/official/case-replay"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300"
            >
              <Clock size={18} className="text-danger" />
              Watch Case Replay
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#4B5568] font-mono">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#4B5568] to-transparent" />
        </motion.div>
      </section>

      {/* ── Platform Stats ─────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-white/5" id="platform">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-mono text-[#4B5568] tracking-widest uppercase">Platform Intelligence</span>
            <h2 className="font-display font-bold text-white text-3xl mt-2">At Scale. In Real Time.</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Projects Analysed" value={nationalStats.projectsAnalysed} color="text-saffron" />
            <StatCard label="Expenditure Tracked" value={8472} prefix="₹" suffix=" Cr" color="text-forensic" />
            <StatCard label="Patterns Discovered" value={nationalStats.patternsDiscovered} color="text-caution" />
            <StatCard label="Anomalies Flagged" value={nationalStats.anomaliesRequiringReview} color="text-danger" />
          </div>

          {/* Sub stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: 'States Monitored', value: '28', color: 'text-blue-400' },
              { label: 'Constituencies', value: '543', color: 'text-purple-400' },
              { label: 'Active Investigations', value: '312', color: 'text-saffron' },
              { label: 'High-Risk Projects', value: '428', color: 'text-danger' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass rounded-xl p-4 flex items-center gap-3"
              >
                <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-xs text-[#6B7A99]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Cards ─────────────────────────────────────────── */}
      <section className="py-24 px-6" id="platform">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-[#4B5568] tracking-widest uppercase">Role-Based Access</span>
            <h2 className="font-display font-bold text-white text-4xl mt-3 mb-4">
              One Intelligence Engine.<br/>
              <span className="gradient-text-saffron">Three Perspectives.</span>
            </h2>
            <p className="text-[#6B7A99] text-lg max-w-2xl mx-auto">
              Whether you're a citizen, investigator, or elected representative — NIRIKSHAN gives you the right view, at the right depth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {roleCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={card.href} className="block h-full group">
                  <div className={`relative h-full glass rounded-3xl p-8 flex flex-col border ${card.border} transition-all duration-500 overflow-hidden
                    ${card.featured ? 'scale-105 shadow-saffron' : ''}
                    group-hover:scale-[1.03] group-hover:shadow-card-hover`}
                  >
                    {card.featured && (
                      <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-saffron/20 border border-saffron/30 text-xs font-mono text-saffron">
                        CORE
                      </div>
                    )}

                    {/* Gradient bg */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50 rounded-3xl pointer-events-none`} />

                    <div className="relative z-10 flex flex-col gap-5 flex-1">
                      <div className="text-4xl">{card.icon}</div>
                      <div>
                        <div className={`text-xs font-mono tracking-widest uppercase mb-1 ${card.accent}`}>
                          {card.subtitle}
                        </div>
                        <h3 className="font-display font-bold text-white text-2xl">{card.title}</h3>
                      </div>
                      <p className="text-[#A8B3CF] text-sm leading-relaxed flex-1">{card.description}</p>

                      <div className={`flex items-center gap-2 text-sm font-semibold ${card.accent} mt-auto group-hover:gap-4 transition-all duration-300`}>
                        {card.cta} <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#080D1A]" id="features">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-[#4B5568] tracking-widest uppercase">Six Core Innovations</span>
            <h2 className="font-display font-bold text-white text-4xl mt-3 mb-4">
              Built to Detect What<br/>
              <span className="gradient-text-forensic">Others Miss</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`group glass rounded-2xl p-6 border border-white/5 hover:border-white/10
                  cursor-default transition-all duration-500 hover:-translate-y-1 ${feature.glowColor}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5`}>
                    <feature.icon size={20} className={feature.color} />
                  </div>
                  <span className={`font-mono text-xs font-bold ${feature.color} opacity-50`}>{feature.number}</span>
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-[#6B7A99] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intelligence Pipeline ───────────────────────────────── */}
      <section className="py-24 px-6" id="approach">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-mono text-[#4B5568] tracking-widest uppercase">The Pipeline</span>
            <h2 className="font-display font-bold text-white text-4xl mt-3 mb-4">
              From Raw Data to<br/>
              <span className="gradient-text-saffron">Actionable Intelligence</span>
            </h2>
            <p className="text-[#6B7A99] text-lg">Every data point passes through the same pipeline. Every flag is explained. Every case can be challenged.</p>
          </motion.div>

          <div className="flex flex-col items-center gap-1">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex flex-col items-center gap-1 w-full"
              >
                <div className={`glass rounded-xl px-8 py-3 border text-sm font-mono font-semibold tracking-widest
                  ${i === 0 ? 'border-saffron/30 text-saffron' :
                    i === pipelineSteps.length - 1 ? 'border-forensic/30 text-forensic' :
                    'border-white/8 text-[#A8B3CF]'}
                  hover:border-saffron/20 hover:text-white transition-all duration-300 cursor-default`}
                >
                  {step}
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="w-px h-5 bg-gradient-to-b from-white/10 to-white/5" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Replay Teaser ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#080D1A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-danger/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-danger/25 bg-danger/8 text-danger text-sm font-mono mb-8">
              <Clock size={12} />
              HEADLINE FEATURE
            </div>
            <h2 className="font-display font-bold text-white text-5xl mb-6">
              Turn Back the Clock.<br/>
              <span className="text-danger" style={{ textShadow: '0 0 40px rgba(255,59,92,0.4)' }}>
                See What We'd Have Found.
              </span>
            </h2>
            <p className="text-[#A8B3CF] text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Select a real documented case. Set the timeline to any point in the past. Run NIRIKSHAN.
              See exactly which signals would have triggered an early warning — and when.
            </p>
            <Link
              href="/official/case-replay"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-danger/30 bg-danger/10 text-danger font-semibold text-lg hover:bg-danger/20 hover:border-danger/50 transition-all duration-300"
            >
              <Clock size={20} />
              Open Historical Case Replay
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs font-mono">N</span>
            </div>
            <span className="font-display font-bold text-white">NIRIKSHAN</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4B5568] font-mono">
            <Globe size={12} />
            Built for Smart India Hackathon 2026 · MPLADS Forensic Intelligence
          </div>

          <div className="flex items-center gap-4 text-xs text-[#4B5568]">
            <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
            <span>·</span>
            <Link href="/citizen/dashboard" className="hover:text-white transition-colors">Citizen</Link>
            <span>·</span>
            <Link href="/official/command-center" className="hover:text-white transition-colors">Official</Link>
            <span>·</span>
            <Link href="/mp/dashboard" className="hover:text-white transition-colors">MP</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
