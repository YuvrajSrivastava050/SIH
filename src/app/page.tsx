'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Shield, Eye, TrendingUp, Network, FileSearch, Clock, ChevronRight, ArrowRight, Zap, Globe } from 'lucide-react'
import { nationalStats } from '@/lib/mock-data'
import TerrainBackground from '@/components/TerrainBackground'

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

// ── Role Card ─────────────────────────────────────────────────────
const roleCards = [
  {
    id: 'citizen',
    icon: '👤',
    title: 'Citizen',
    subtitle: 'Transparency Layer',
    description: 'Track where your constituency\'s funds went. View project status, timelines, and report ground reality.',
    href: '/citizen/dashboard',
    accent: 'text-blue-400',
    border: 'hover:border-blue-400/40',
    cta: 'Enter Citizen Portal',
  },
  {
    id: 'official',
    icon: '🏛️',
    title: 'Government Official',
    subtitle: 'Investigation Layer',
    description: 'Forensic intelligence, behavioral analysis, network mapping, and evidence verification for investigators.',
    href: '/official/command-center',
    accent: 'text-saffron',
    border: 'hover:border-saffron/50',
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
    accent: 'text-forensic',
    border: 'hover:border-forensic/40',
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
  },
  {
    icon: TrendingUp,
    number: '02',
    title: 'Adaptive Peer Benchmarking',
    description: 'We dynamically construct each project\'s true peer group and compare it across national, local, and contractor dimensions.',
    color: 'text-blue-400',
  },
  {
    icon: Network,
    number: '03',
    title: 'Network Intelligence',
    description: 'Map hidden relationships between projects, contractors, agencies, and entities. Find the missing link.',
    color: 'text-purple-400',
  },
  {
    icon: FileSearch,
    number: '04',
    title: 'Evidence & Timeline Verification',
    description: 'Cross-validate photos, GPS, timestamps, documents, and shadow angles. Does the project\'s story make sense?',
    color: 'text-forensic',
  },
  {
    icon: Eye,
    number: '05',
    title: 'Forensic Reasoning + Counter-Evidence',
    description: 'We build the case — then actively try to disprove it. Prosecution and defense, from the same intelligence engine.',
    color: 'text-caution',
  },
  {
    icon: Clock,
    number: '06',
    title: 'Historical Case Replay',
    description: 'Turn back the clock on real documented cases. See exactly when NIRIKSHAN would have raised the early warning.',
    color: 'text-danger',
  },
]

// ── Pipeline Step ──────────────────────────────────────────────────
const pipelineSteps = [
  'DATA INPUT', 'BEHAVIORAL DNA', 'PEER INTELLIGENCE', 'PATTERN DISCOVERY',
  'NETWORK MAPPING', 'EVIDENCE VERIFICATION', 'FORENSIC REASONING',
  'COUNTER-EVIDENCE', 'INVESTIGATION PRIORITY', 'CASE & ACTION',
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#020A12] overflow-x-hidden">

      {/* ── Interactive terrain backdrop ─────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <TerrainBackground
          variant="full"
          tilt
          density={0.9}
          imageSrc="/terrain-bg.png"
          className="absolute inset-0"
        />
        {/* readability veil — strengthens as you scroll past the hero */}
        <div
          className="absolute inset-0 bg-[#020A12] transition-opacity duration-700"
          style={{ opacity: scrolled ? 0.82 : 0 }}
        />
      </div>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#020A12]/85 backdrop-blur-xl border-b border-sky-400/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron to-forensic flex items-center justify-center shadow-[0_0_18px_rgba(62,214,255,0.35)]">
              <span className="text-[#02141d] font-bold text-sm font-mono">N</span>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-wide">NIRIKSHAN</span>
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron/10 border border-saffron/25 text-xs text-saffron font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse inline-block" />
              LIVE
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-[#A3C2D9]">
            {['Features', 'Approach', 'Platform'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="hover:text-white transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-[#A3C2D9] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/official/command-center"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron/15 border border-saffron/40 text-saffron-light text-sm font-semibold hover:bg-saffron/25 transition-all duration-200 shadow-[0_0_20px_rgba(62,214,255,0.15)]">
              Enter Platform <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-400/25 bg-sky-400/8 text-saffron-light text-sm font-mono mb-10 backdrop-blur-sm"
          >
            <Zap size={12} />
            SIH 2026 — MPLADS Forensic Intelligence Platform
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-white mb-8"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 6.5rem)', lineHeight: 1.12, letterSpacing: '-0.035em' }}
          >
            <span className="block" style={{ textShadow: '0 0 60px rgba(62,214,255,0.25)' }}>NIRIKSHAN</span>
            <span
              className="block mt-3"
              style={{
                paddingTop: '0.16em',
                background: 'linear-gradient(135deg, #9FE9FF 0%, #3ED6FF 45%, #35F0C8 90%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 5s linear infinite',
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
            className="text-xl md:text-2xl text-[#C4DAEA] font-light mb-5 tracking-wide"
          >
            See the pattern before the loss.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[#6E8BA3] text-sm md:text-base font-mono mb-14 max-w-2xl mx-auto leading-relaxed"
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
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-saffron text-[#02141d] font-semibold text-lg hover:bg-saffron-light transition-all duration-300 shadow-[0_0_36px_rgba(62,214,255,0.35)] hover:shadow-[0_0_52px_rgba(62,214,255,0.5)]"
            >
              Enter Command Center
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/official/case-replay"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-sky-400/20 bg-white/[0.03] backdrop-blur-sm text-white font-medium hover:bg-white/[0.07] hover:border-sky-400/40 transition-all duration-300"
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
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-xs text-[#56718A] font-mono">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#56718A] to-transparent" />
        </motion.div>
      </section>

      {/* ── Platform Stats — single calm band ──────────────────── */}
      <section className="relative z-10 py-20 px-6" id="platform">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-mono text-[#56718A] tracking-[0.25em] uppercase">Platform Intelligence</span>
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl mt-3">At Scale. In Real Time.</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { label: 'Projects Analysed', value: nationalStats.projectsAnalysed, prefix: '', suffix: '', color: 'text-saffron' },
                { label: 'Expenditure Tracked', value: 8472, prefix: '₹', suffix: ' Cr', color: 'text-forensic' },
                { label: 'Patterns Discovered', value: nationalStats.patternsDiscovered, prefix: '', suffix: '', color: 'text-caution' },
                { label: 'Anomalies Flagged', value: nationalStats.anomaliesRequiringReview, prefix: '', suffix: '', color: 'text-danger' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`px-8 py-9 flex flex-col gap-2 border-sky-400/8 ${
                    i % 2 === 1 ? 'border-l' : ''
                  } ${i >= 2 ? 'max-md:border-t max-md:border-sky-400/8' : ''} md:border-l md:first:border-l-0`}
                >
                  <div className={`text-3xl md:text-4xl font-bold font-mono ${s.color}`}>
                    <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <div className="text-sm text-[#7E9BB4] font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* sub-stats — quiet inline row, no boxes */}
            <div className="border-t border-sky-400/8 px-8 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
              {[
                { label: 'States Monitored', value: '28' },
                { label: 'Constituencies', value: '543' },
                { label: 'Active Investigations', value: '312' },
                { label: 'High-Risk Projects', value: '428' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 text-sm">
                  <span className="font-mono font-bold text-[#A3C2D9]">{s.value}</span>
                  <span className="text-[#56718A]">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Role Cards ─────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-[#56718A] tracking-[0.25em] uppercase">Role-Based Access</span>
            <h2 className="font-display font-bold text-white text-4xl mt-3 mb-4">
              One Intelligence Engine.<br />
              <span className="gradient-text-saffron">Three Perspectives.</span>
            </h2>
            <p className="text-[#7E9BB4] text-lg max-w-2xl mx-auto">
              Whether you&apos;re a citizen, investigator, or elected representative — NIRIKSHAN gives you the right view, at the right depth.
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
                  <div className={`relative h-full glass rounded-3xl p-8 flex flex-col transition-all duration-500 overflow-hidden
                    ${card.featured ? 'md:-translate-y-2 border-saffron/30 shadow-[0_0_44px_rgba(62,214,255,0.12)]' : ''}
                    ${card.border} group-hover:-translate-y-1`}
                  >
                    {card.featured && (
                      <div className="absolute top-5 right-5 px-2 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-xs font-mono text-saffron-light">
                        CORE
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col gap-5 flex-1">
                      <div className="text-4xl">{card.icon}</div>
                      <div>
                        <div className={`text-xs font-mono tracking-[0.2em] uppercase mb-1.5 ${card.accent}`}>
                          {card.subtitle}
                        </div>
                        <h3 className="font-display font-bold text-white text-2xl">{card.title}</h3>
                      </div>
                      <p className="text-[#8FA9BE] text-sm leading-relaxed flex-1">{card.description}</p>

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
      <section className="relative z-10 py-24 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-[#56718A] tracking-[0.25em] uppercase">Six Core Innovations</span>
            <h2 className="font-display font-bold text-white text-4xl mt-3 mb-4">
              Built to Detect What<br />
              <span className="gradient-text-forensic">Others Miss</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group glass rounded-2xl p-7 cursor-default transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2.5 rounded-xl bg-sky-400/8 border border-sky-400/12">
                    <feature.icon size={20} className={feature.color} />
                  </div>
                  <span className={`font-mono text-xs font-bold ${feature.color} opacity-50`}>{feature.number}</span>
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2.5">{feature.title}</h3>
                <p className="text-[#7E9BB4] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intelligence Pipeline — compact chip grid ──────────── */}
      <section className="relative z-10 py-24 px-6" id="approach">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center translate-y-8 sm:translate-x-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-mono text-[#56718A] tracking-[0.25em] uppercase">The Pipeline</span>
            <h2 className="font-display font-bold text-white text-4xl mt-4 mb-6 leading-[1.15]">
              From Raw Data to<br />
              <span className="gradient-text-saffron">Actionable Intelligence</span>
            </h2>
            <p className="text-[#7E9BB4] text-lg leading-relaxed">Every data point passes through the same pipeline. Every flag is explained. Every case can be challenged.</p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-center gap-2.5"
              >
                <div className={`glass-sm rounded-full px-5 py-2.5 text-xs font-mono font-semibold tracking-[0.15em] transition-all duration-300 cursor-default
                  ${i === 0 ? 'border-saffron/40 text-saffron-light' :
                    i === pipelineSteps.length - 1 ? 'border-forensic/40 text-forensic' :
                    'text-[#A3C2D9] hover:text-white'}
                  hover:border-sky-400/40`}
                >
                  <span className="opacity-40 mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </div>
                {i < pipelineSteps.length - 1 && (
                  <ChevronRight size={12} className="text-[#3d5468] hidden lg:block flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Replay Teaser ──────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6" style={{ paddingBottom: '8rem' }}>
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 translate-y-8 sm:translate-x-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-danger/25 bg-danger/8 text-danger text-sm font-mono mb-8">
              <Clock size={12} />
              HEADLINE FEATURE
            </div>
            <h2 className="font-display font-bold text-white text-4xl md:text-5xl mb-7 leading-[1.1]">
              Turn Back the Clock.<br />
              <span className="text-danger" style={{ textShadow: '0 0 40px rgba(255,77,109,0.35)' }}>
                See What We&apos;d Have Found.
              </span>
            </h2>
            <p className="text-[#A3C2D9] text-xl mb-11 max-w-2xl mx-auto leading-relaxed">
              Select a real documented case. Set the timeline to any point in the past. Run NIRIKSHAN.
              See exactly which signals would have triggered an early warning — and when.
            </p>
            <Link
              href="/official/case-replay"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-danger/30 bg-danger/10 text-danger font-semibold text-lg leading-relaxed hover:bg-danger/20 hover:border-danger/50 transition-all duration-300"
            >
              <Clock size={20} />
              Open Historical Case Replay
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-sky-400/8 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron to-forensic flex items-center justify-center">
              <span className="text-[#02141d] font-bold text-xs font-mono">N</span>
            </div>
            <span className="font-display font-bold text-white">NIRIKSHAN</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#56718A] font-mono">
            <Globe size={12} />
            Built for Smart India Hackathon 2026 · MPLADS Forensic Intelligence
          </div>

          <div className="flex items-center gap-4 text-xs text-[#56718A]">
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
