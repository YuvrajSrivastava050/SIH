'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, MapPin, Calendar, Building2, User, CheckCircle2, 
  Clock, AlertTriangle, Camera, Upload, Send, ShieldCheck,
  FileText, ExternalLink, Activity
} from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'

const journeyStages = [
  { id: 'proposal', name: 'Proposal & Identification', date: 'Jan 12, 2024', status: 'completed', desc: 'Constituency MP recommended community hall under MPLADS annual allocation tranche 1.' },
  { id: 'sanction', name: 'Administrative Sanction', date: 'Feb 02, 2024', status: 'completed', desc: 'District Magistrate approved techno-feasibility and allocated ₹18.40 Lakh budget code.' },
  { id: 'tender', name: 'Tender & Work Order', date: 'Feb 15, 2024', status: 'completed', desc: 'Work Order #WO-2024-889 issued to Shri Ram Constructions Pvt. Ltd. through e-procurement.' },
  { id: 'start', name: 'Groundbreaking & Foundation', date: 'Mar 01, 2024', status: 'completed', desc: 'Plinth construction and site survey geo-tagging completed and logged to portal.' },
  { id: 'progress', name: 'Superstructure & Roofing', date: 'Nov 14, 2024', status: 'active', desc: 'Roof slab casted. Brick masonry and internal electrical conduits underway (72% complete).' },
  { id: 'inspection', name: 'Third-Party Forensic Inspection', date: 'Expected: Jun 2026', status: 'upcoming', desc: 'Mandatory technical verification, material quality test, and solar timestamp verification.' },
  { id: 'completion', name: 'Handover & Public Dedication', date: 'Expected: Aug 2026', status: 'upcoming', desc: 'Issuance of final completion certificate & dedication to Ward 14 residents.' },
]

export default function ProjectJourneyPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.id as string

  const project = mockProjects.find(p => p.id === projectId) || mockProjects[0]

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [reportText, setReportText] = useState('')
  const [reportType, setReportType] = useState('progress_conflict')

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setReportSubmitted(true)
    setTimeout(() => {
      setReportSubmitted(false)
      setReportModalOpen(false)
      setReportText('')
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-[#04070F] text-[#F0F4FF] pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#04070F]/90 backdrop-blur-xl border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/citizen/dashboard" 
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#A8B3CF] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white text-sm">NIRIKSHAN</span>
            <span className="text-xs text-[#6B7A99] font-mono">/ Project Journey</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/25 transition-all"
          >
            <Camera size={13} />
            Report Ground Reality
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
        {/* Project Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-saffron/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-saffron/10 border border-saffron/30 text-saffron">
                  {project.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-[#A8B3CF]">
                  {project.category}
                </span>
              </div>
              <h1 className="font-display font-bold text-white text-2xl md:text-3xl mb-2">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#A8B3CF]">
                <span className="flex items-center gap-1"><MapPin size={13} className="text-saffron" /> {project.constituency}, {project.state}</span>
                <span className="flex items-center gap-1"><Building2 size={13} className="text-blue-400" /> {project.agency}</span>
                <span className="flex items-center gap-1"><User size={13} className="text-purple-400" /> {project.contractor}</span>
              </div>
            </div>

            {/* Completion Ring Badge */}
            <div className="glass-sm rounded-2xl p-4 border border-white/10 flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-[#6B7A99] font-mono">COMPLETION</div>
                <div className="text-2xl font-mono font-bold text-forensic">{project.completion}%</div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-forensic/20 flex items-center justify-center relative">
                <Activity size={20} className="text-forensic" />
              </div>
            </div>
          </div>

          {/* Financial Breakdown Progress */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/5">
            <div>
              <div className="text-xs text-[#6B7A99]">Approved Sanction</div>
              <div className="text-base font-mono font-bold text-white">₹{(project.amount / 100000).toFixed(2)} Lakh</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7A99]">Disbursed to Date</div>
              <div className="text-base font-mono font-bold text-blue-400">₹{(project.spent / 100000).toFixed(2)} Lakh</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7A99]">Start Date</div>
              <div className="text-base font-mono text-[#F0F4FF]">{project.startDate}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7A99]">Target Completion</div>
              <div className="text-base font-mono text-[#F0F4FF]">{project.expectedEnd}</div>
            </div>
          </div>
        </motion.div>

        {/* Visual Lifecycle Timeline */}
        <section className="glass rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-white text-xl">Project Lifecycle Journey</h2>
              <p className="text-xs text-[#6B7A99] mt-0.5">End-to-end transparent verification checkpoints from sanction to handover</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-forensic bg-forensic/10 border border-forensic/20 px-3 py-1 rounded-full">
              <ShieldCheck size={14} />
              Forensic Integrity Checked
            </div>
          </div>

          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-[15px] md:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-forensic before:via-blue-500 before:to-white/10">
            {journeyStages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed'
              const isActive = stage.status === 'active'
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative group"
                >
                  {/* Node icon */}
                  <div className={`absolute -left-[30px] md:-left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110 ${
                    isCompleted ? 'bg-[#04070F] border-forensic text-forensic shadow-[0_0_12px_rgba(79,255,176,0.3)]' :
                    isActive ? 'bg-saffron border-saffron text-white shadow-[0_0_16px_rgba(255,107,0,0.5)] animate-pulse' :
                    'bg-[#080D1A] border-white/20 text-[#6B7A99]'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={15} /> :
                     isActive ? <Clock size={15} /> :
                     <span className="text-xs font-mono">{idx + 1}</span>}
                  </div>

                  {/* Stage Card */}
                  <div className={`glass rounded-2xl p-5 border transition-all duration-300 ${
                    isActive ? 'border-saffron/40 bg-saffron/5 shadow-saffron' :
                    isCompleted ? 'border-white/10 hover:border-white/20' :
                    'border-white/5 opacity-60'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-semibold text-white text-base flex items-center gap-2">
                        {stage.name}
                        {isActive && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-saffron text-black uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                      </h3>
                      <span className="text-xs font-mono text-[#A8B3CF]">{stage.date}</span>
                    </div>
                    <p className="text-sm text-[#A8B3CF] leading-relaxed">{stage.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Geo-tagged Evidence & Public Gallery */}
        <section className="glass rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-white text-xl">Geo-tagged Ground Evidence</h2>
              <p className="text-xs text-[#6B7A99] mt-0.5">High-resolution physical evidence submitted by contractors & verified by NIRIKSHAN AI</p>
            </div>
            <span className="text-xs font-mono text-saffron">{project.photos} Photos Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Foundation Footing & Rebar', date: 'Mar 15, 2024', status: 'AI Match: 99%', tags: 'GPS Verified • 25.3176° N' },
              { title: 'Plinth Beam Casting', date: 'Jul 22, 2024', status: 'AI Match: 98%', tags: 'EXIF Match • 11:20 AM' },
              { title: 'Roof Slab & Masonry Work', date: 'Nov 10, 2024', status: 'AI Match: 96%', tags: 'Solar Match Verified' },
            ].map((photo, i) => (
              <div key={i} className="glass-sm rounded-2xl border border-white/8 overflow-hidden group hover:border-saffron/40 transition-all duration-300">
                <div className="h-44 bg-gradient-to-br from-white/5 via-[#080D1A] to-white/2 relative flex items-center justify-center overflow-hidden">
                  <Camera size={32} className="text-white/20 group-hover:scale-125 group-hover:text-saffron transition-all duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-forensic border border-forensic/20">
                    {photo.status}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="font-semibold text-sm text-white">{photo.title}</div>
                  <div className="text-xs text-[#6B7A99] font-mono">{photo.date}</div>
                  <div className="text-[11px] text-[#A8B3CF] pt-1">{photo.tags}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Community Pulse Reporting Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setReportModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-3xl border border-purple-500/30 p-6 space-y-5 bg-[#080D1A]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Camera size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Community Ground Reality Report</h3>
                    <p className="text-xs text-[#6B7A99]">Your feedback becomes citizen evidence, not automatic accusation.</p>
                  </div>
                </div>
              </div>

              {reportSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="py-8 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-forensic/20 text-forensic mx-auto flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="font-display font-bold text-white text-lg">Report Submitted Successfully</div>
                  <p className="text-xs text-[#A8B3CF] max-w-xs mx-auto">
                    Evidence logged under Ticket #CIT-{Math.floor(1000 + Math.random() * 9000)}. NIRIKSHAN anomaly engine will cross-reference this with contractor logs.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-[#A8B3CF] block mb-1.5">Observation Category</label>
                    <select
                      value={reportType}
                      onChange={e => setReportType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                    >
                      <option value="progress_conflict" className="bg-[#080D1A]">Progress does not match portal records (e.g. marked 72% but foundation only)</option>
                      <option value="abandoned" className="bg-[#080D1A]">Work completely halted / site abandoned for &gt; 30 days</option>
                      <option value="quality" className="bg-[#080D1A]">Substandard material / visible structural defect</option>
                      <option value="location" className="bg-[#080D1A]">Project photo does not match this physical location</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#A8B3CF] block mb-1.5">Ground Description & Notes</label>
                    <textarea
                      required
                      rows={3}
                      value={reportText}
                      onChange={e => setReportText(e.target.value)}
                      placeholder="E.g., Visited the site on Saturday. Boundary wall is missing and work has stopped for 3 weeks..."
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#4B5568] text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="border-2 border-dashed border-white/10 hover:border-purple-400/40 rounded-2xl p-4 text-center cursor-pointer transition-colors">
                    <Upload size={20} className="mx-auto text-purple-400 mb-1" />
                    <div className="text-xs font-semibold text-white">Attach Site Photo with GPS location</div>
                    <div className="text-[10px] text-[#6B7A99]">JPG, PNG or HEIC with EXIF metadata (Demo upload)</div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs text-[#A8B3CF] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-600 shadow-lg shadow-purple-500/20 transition-all"
                    >
                      <Send size={13} />
                      Submit Citizen Evidence
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
