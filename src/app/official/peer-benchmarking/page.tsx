'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Globe, MapPin, User } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, RadarChart,
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
    value > 90 ? 'border-danger/30 bg-danger/5' :
    value > 70 ? 'border-caution/30 bg-caution/5' :
    'border-forensic/30 bg-forensic/5'
  }`}>
    <div className={`text-2xl font-bold font-mono ${
      value > 90 ? 'text-danger' : value > 70 ? 'text-caution' : 'text-forensic'
    }`}>{value}th</div>
    <div className="text-xs text-[#6B7A99] mt-1">{label}</div>
  </div>
)

export default function PeerBenchmarkingPage() {
  const [activeMetric, setActiveMetric] = useState('costPerUnit')
  const metricData = peerBenchmarkData.metrics[activeMetric as keyof typeof peerBenchmarkData.metrics]

  const barData = [
    { name: 'This Project', value: metricData.project, color: '#FF6B00', highlight: true },
    { name: 'National Avg', value: metricData.nationalPeer, color: '#3B82F6' },
    { name: 'Local Avg', value: metricData.localPeer, color: '#9333EA' },
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
          <h1 className="font-display font-bold text-white text-3xl mb-1">Peer Intelligence</h1>
          <p className="text-[#6B7A99] text-sm">Is this project actually abnormal — compared to its true peers?</p>
        </div>

        {/* Convergence Banner */}
        {peerBenchmarkData.convergence && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-danger/25 bg-danger/5 p-5 flex items-center gap-4"
          >
            <TrendingUp size={24} className="text-danger flex-shrink-0" />
            <div>
              <div className="font-semibold text-danger text-lg">Multi-Benchmark Convergence Detected</div>
              <p className="text-sm text-[#A8B3CF] mt-0.5">
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
                    : 'text-[#6B7A99] hover:text-white border border-transparent hover:border-white/10'
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
                <XAxis dataKey="name" tick={{ fill: '#6B7A99', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7A99', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ background: '#080D1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}
                  labelStyle={{ color: '#F0F4FF' }}
                  itemStyle={{ color: '#A8B3CF', fontFamily: 'JetBrains Mono' }}
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
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#6B7A99', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#FF6B00" fill="rgba(255,107,0,0.15)" dot={{ r: 4, fill: '#FF6B00' }} />
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
                  <span className="text-[#4B5568] w-28 flex-shrink-0">{item.label}</span>
                  <span className="text-[#A8B3CF]">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#4B5568] font-mono">
              Peer group: 847 similar projects nationally
            </div>
          </div>
        </div>
      </div>
    </OfficialLayout>
  )
}
