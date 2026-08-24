'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { peerBenchmarkData } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

const metrics = [
  { key: 'costPerUnit', label: 'Cost per Unit (₹/m)', unit: '₹/m' },
  { key: 'completionSpeed', label: 'Completion Speed (days)', unit: 'days' },
  { key: 'paymentCycle', label: 'Payment Cycle (days)', unit: 'days' },
]

const PercentileBadge = ({ value, label }: { value: number; label: string }) => (
  <div className={`glass rounded-xl p-3 border text-center ${
    value > 90 ? 'border-[#2D8DBB]/60 bg-[#071A29]/80 shadow-[0_0_18px_rgba(45,141,187,0.18)]' :
    value > 70 ? 'border-caution/30 bg-caution/5' :
    'border-forensic/30 bg-forensic/5'
  }`}>
    <div className={`text-2xl font-bold font-mono ${
      value > 90 ? 'text-[#57C7F2] drop-shadow-[0_0_8px_rgba(87,199,242,0.45)]' : value > 70 ? 'text-caution' : 'text-forensic'
    }`}>{value}th</div>
    <div className="text-xs text-[#7E9BB4] mt-1">{label}</div>
  </div>
)

export default function PeerBenchmarkingPage() {
  const [activeMetric, setActiveMetric] = useState('costPerUnit')
  const metricData = peerBenchmarkData.metrics[activeMetric as keyof typeof peerBenchmarkData.metrics]

  const barData = [
    { name: 'This Project', value: metricData.project, color: '#3ED6FF', highlight: true },
    { name: 'National Avg', value: metricData.nationalPeer, color: '#3B82F6' },
    { name: 'Local Avg', value: metricData.localPeer, color: '#6E8BFF' },
    { name: 'Contractor Avg', value: metricData.contractorAvg, color: '#6B7280' },
  ]

  const radarData = [
    { dimension: 'Cost', score: metricData.nationalPercentile },
    { dimension: 'Speed', score: peerBenchmarkData.metrics.completionSpeed.nationalPercentile },
    { dimension: 'Payment', score: peerBenchmarkData.metrics.paymentCycle.nationalPercentile },
  ]

  return (
    <OfficialLayout activeHref="/official/peer-benchmarking">
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={16} className="text-blue-400" />
            <span className="text-xs font-mono text-blue-400 tracking-widest">ADAPTIVE PEER BENCHMARKING</span>
          </div>
          <h1 className="font-mono font-bold text-[#57C7F2] text-3xl mb-1 drop-shadow-[0_0_8px_rgba(87,199,242,0.45)]">Peer Intelligence</h1>
          <p className="text-[#7E9BB4] text-sm">Is this project actually abnormal — compared to its true peers?</p>
        </div>

        {/* Convergence Banner */}
        {peerBenchmarkData.convergence && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-danger/25 bg-danger/5 p-5 flex items-center gap-4"
          >
            <TrendingUp size={24} className="text-[#57C7F2] drop-shadow-[0_0_8px_rgba(87,199,242,0.45)] flex-shrink-0" />
            <div>
              <div className="font-semibold text-[#57C7F2] text-lg drop-shadow-[0_0_8px_rgba(87,199,242,0.35)]">Multi-Benchmark Convergence Detected</div>
              <p className="text-sm text-[#A3C2D9] mt-0.5">
                National, local, AND contractor benchmarks all independently flag this project as anomalous.
                This convergence significantly strengthens the investigation signal.
              </p>
            </div>
          </motion.div>
        )}

        {/* Percentile Cards */}
        <div className="grid grid-cols-3 gap-4">
          <PercentileBadge value={metricData.nationalPercentile} label="National Percentile" />
          <PercentileBadge value={metricData.localPercentile} label="Local Percentile" />
          <PercentileBadge value={metricData.contractorPercentile} label="Contractor Percentile" />
        </div>

        {/* Metric Tabs + Chart */}
        <div className="glass rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-6 overflow-x-auto">
            {metrics.map(m => (
              <button key={m.key} onClick={() => setActiveMetric(m.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeMetric === m.key
                    ? 'bg-saffron/15 border border-saffron/30 text-saffron'
                    : 'text-[#7E9BB4] hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#7E9BB4', fontSize: 11 }} />
                <YAxis tick={{ fill: '#7E9BB4', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  cursor={false}
                  contentStyle={{ background: '#05141F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, boxShadow: 'none' }}
                  labelStyle={{ color: '#EAF7FF' }}
                  itemStyle={{ color: '#A3C2D9', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color}
                      style={{ filter: entry.highlight ? `drop-shadow(0 0 8px ${entry.color}80)` : undefined }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar: Overall Anomaly Profile */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="font-semibold text-white text-sm mb-4">National Percentile Profile</h3>
            <div className="h-52">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#7E9BB4', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#3ED6FF" fill="rgba(62,214,255,0.15)" dot={{ r: 4, fill: '#3ED6FF' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="font-semibold text-white text-sm mb-4">Peer Group Composition</h3>
            <div className="space-y-3">
              {[
                { label: 'Project Type', value: 'Road & Connectivity', icon: '🛣️' },
                { label: 'Cost Range', value: '₹25L – ₹50L', icon: '💰' },
                { label: 'Geography', value: 'UP — Urban', icon: '📍' },
                { label: 'Year', value: '2023–2024', icon: '📅' },
                { label: 'Agency Type', value: 'State PWD', icon: '🏛️' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span>{item.icon}</span>
                  <span className="text-[#56718A] w-28 flex-shrink-0">{item.label}</span>
                  <span className="text-[#A3C2D9]">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#56718A] font-mono">
              Peer group: 847 similar projects nationally
            </div>
          </div>
        </div>
      </div>
    </OfficialLayout>
  )
}
