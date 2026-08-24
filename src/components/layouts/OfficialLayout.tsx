'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Shield, BarChart2, Network, FileSearch,
  Eye, Clock, AlertTriangle, ChevronLeft, ChevronRight,
  Home, LogOut, User
} from 'lucide-react'

const navItems = [
  { href: '/official/command-center',      icon: Activity,       label: 'Command Center' },
  { href: '/official/behavioral-dna',      icon: Shield,         label: 'Behavioral DNA',       badge: 'HOT' },
  { href: '/official/peer-benchmarking',   icon: BarChart2,      label: 'Peer Benchmarking' },
  { href: '/official/network-intelligence',icon: Network,        label: 'Network Intelligence' },
  { href: '/official/evidence-verification',icon: FileSearch,    label: 'Evidence Verification' },
  { href: '/official/forensic-reasoning',  icon: Eye,            label: 'Forensic Reasoning' },
  { href: '/official/case-replay',         icon: Clock,          label: 'Case Replay',           badge: 'NEW' },
  { href: '/official/case-files',          icon: AlertTriangle,  label: 'Case Files',            badge: '312' },
]

interface OfficialLayoutProps {
  children: React.ReactNode
  activeHref?: string
}

export default function OfficialLayout({ children, activeHref }: OfficialLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || activeHref === href

  return (
    <div className="min-h-screen bg-[#04070F] flex">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex-shrink-0 flex flex-col border-r border-white/5 bg-[#080D1A]"
      >
        {/* Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-5 border-b border-white/5`}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs font-mono">N</span>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">NIRIKSHAN</div>
                  <div className="text-xs text-saffron font-mono">OFFICIAL</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs font-mono">N</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            {collapsed
              ? <ChevronRight size={14} className="text-[#6B7A99]" />
              : <ChevronLeft size={14} className="text-[#6B7A99]" />
            }
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${active
                    ? 'bg-saffron/10 border border-saffron/20 text-saffron'
                    : 'text-[#6B7A99] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <item.icon size={17} className={`flex-shrink-0 transition-transform ${active ? 'text-saffron' : 'group-hover:text-white group-hover:scale-110'}`} />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!collapsed && item.badge && (
                  <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
                    ${item.badge === 'NEW' ? 'bg-forensic/15 text-forensic border border-forensic/25' :
                      item.badge === 'HOT' ? 'bg-danger/15 text-danger border border-danger/25' :
                      'bg-white/8 text-[#6B7A99]'}`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-saffron rounded-r-full"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 p-3 space-y-1">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6B7A99] hover:text-white hover:bg-white/5 transition-all duration-200`}>
            <Home size={16} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Home</span>}
          </Link>
          <Link href="/auth/login" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6B7A99] hover:text-white hover:bg-white/5 transition-all duration-200`}>
            <User size={16} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Switch Role</span>}
          </Link>
        </div>
      </motion.aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Scanline overlay */}
        <div className="fixed inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
          }}
        />
        {children}
      </main>
    </div>
  )
}
