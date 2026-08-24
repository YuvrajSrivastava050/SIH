'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Network, X, AlertTriangle, ChevronRight, Zap } from 'lucide-react'
import { networkGraphData } from '@/lib/mock-data'
import OfficialLayout from '@/components/layouts/OfficialLayout'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

const NODE_COLORS: Record<string, string> = {
  project:    '#3B82F6',
  contractor: '#3ED6FF',
  agency:     '#6E8BFF',
  entity:     '#6B7280',
}

const NODE_LABELS: Record<string, string> = {
  project:    'Project',
  contractor: 'Contractor',
  agency:     'Agency',
  entity:     'Entity',
}

type GraphNode = { id: string; label: string; type: string; risk: number }
type PositionedGraphNode = GraphNode & { val: number; x?: number; y?: number }
type GraphLink = { source: string; target: string; type: string }

const CRIMSON = '#DC143C'

export default function NetworkIntelligencePage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [highlightSuspicious, setHighlightSuspicious] = useState(false)
  const graphRef = useRef<any>(null)
  const pulsePhase = useRef(0)

  const graphData: { nodes: PositionedGraphNode[]; links: typeof networkGraphData.links } = {
    nodes: networkGraphData.nodes.map(n => ({ ...n, val: n.risk / 20 + 3 })),
    links: networkGraphData.links,
  }

  const fitGraph = useCallback(() => {
    window.requestAnimationFrame(() => {
      const liveGraphData = graphRef.current?.graphData?.()
      const positionedNodes = (liveGraphData?.nodes ?? []).filter(
        (node: PositionedGraphNode) => node.x != null && node.y != null,
      )
      graphRef.current?.zoomToFit(600, 80)
      if (positionedNodes.length) {
        const bounds = positionedNodes.reduce(
          (current: { minX: number; maxX: number; minY: number; maxY: number }, node: PositionedGraphNode) => ({
            minX: Math.min(current.minX, node.x as number),
            maxX: Math.max(current.maxX, node.x as number),
            minY: Math.min(current.minY, node.y as number),
            maxY: Math.max(current.maxY, node.y as number),
          }),
          { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
        )
        graphRef.current?.centerAt((bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2, 600)
      }
    })
  }, [graphData])

  useEffect(() => {
    let frame: number
    const tick = () => {
      pulsePhase.current += 0.04
      const refresh = graphRef.current?.refresh
      if (typeof refresh === 'function') refresh()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const fitTimer = window.setTimeout(fitGraph, 1400)
    return () => window.clearTimeout(fitTimer)
  }, [fitGraph])

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node as GraphNode)
    if (graphRef.current && node.x != null && node.y != null) {
      graphRef.current.centerAt(node.x, node.y, 800)
      graphRef.current.zoom(2.2, 800)
    }
  }, [])

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label?.split('\n')[0] || node.id
    const fontSize = 11 / globalScale
    const r = (node.risk / 20 + 3) * 1.5
    const color = NODE_COLORS[node.type] || '#6B7280'

    // Glow for high risk
    if (node.risk > 70) {
      ctx.shadowBlur = 16
      ctx.shadowColor = node.type === 'entity' ? '#FF4D6D' : color
    }

    // Node circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.globalAlpha = highlightSuspicious && node.risk < 50 ? 0.2 : 0.85
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 0.5
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1

    // Label
    ctx.font = `${fontSize}px JetBrains Mono`
    ctx.fillStyle = '#A3C2D9'
    ctx.textAlign = 'center'
    ctx.fillText(label, node.x, node.y + r + fontSize + 2)
  }, [highlightSuspicious])

  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const suspicious = link.type === 'suspicious'
    const start = link.source
    const end = link.target
    if (!start?.x || !end?.x) return

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)

    const pulse = 0.5 + 0.5 * Math.sin(pulsePhase.current)

    if (suspicious) {
      const alpha = highlightSuspicious ? 0.55 + pulse * 0.45 : 0.35 + pulse * 0.35
      ctx.strokeStyle = `rgba(220, 20, 60, ${alpha})`
      ctx.lineWidth = highlightSuspicious ? 1.5 + pulse * 2.5 : 1 + pulse * 1.5
      ctx.setLineDash(highlightSuspicious ? [5, 3] : [4, 4])
      ctx.shadowBlur = 6 + pulse * 14
      ctx.shadowColor = CRIMSON
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1
      ctx.setLineDash([])
      ctx.shadowBlur = 0
    }
    ctx.stroke()
    ctx.setLineDash([])
    ctx.shadowBlur = 0
  }, [highlightSuspicious])

  // Connected nodes/links for selected
  const connectedNodeIds = selectedNode
    ? new Set(networkGraphData.links
        .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
        .flatMap(l => [l.source, l.target]))
    : null

  return (
    <OfficialLayout activeHref="/official/network-intelligence">
      <div className="px-8 lg:px-12 xl:px-14 py-6 lg:py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Network size={16} className="text-purple-400" />
              <span className="text-xs font-mono text-purple-400 tracking-widest">NETWORK INTELLIGENCE</span>
            </div>
            <h1 className="font-display font-bold text-white text-3xl mb-1">Entity Relationship Graph</h1>
            <p className="text-[#7E9BB4] text-sm">Map hidden connections between projects, contractors, agencies, and entities</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHighlightSuspicious(!highlightSuspicious)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                highlightSuspicious
                  ? 'border-danger/40 bg-danger/10 text-danger'
                  : 'border-white/10 text-[#A3C2D9] hover:bg-white/5'
              }`}
            >
              <Zap size={14} />
              {highlightSuspicious ? 'Suspicious Path ON' : 'Show Suspicious Paths'}
            </button>
          </div>
        </div>

        {/* Suspicious Path Alert */}
        <AnimatePresence>
          {highlightSuspicious && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-xl border border-danger/25 bg-danger/5 p-4 flex items-center gap-3"
            >
              <AlertTriangle size={18} className="text-danger flex-shrink-0" />
              <p className="text-sm text-[#A3C2D9]">
                <span className="text-danger font-semibold">Suspicious path highlighted:</span>{' '}
                PRJ-1203 → Delta Infrastructure → Shell Entity (JK Pvt.) → PWD Lucknow → PRJ-0782.
                This chain suggests possible payment routing through an intermediary entity.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Graph + Side Panel */}
        <div className="grid lg:grid-cols-4 gap-6">

          {/* Force Graph */}
          <div className="lg:col-span-3 glass rounded-2xl border border-white/5 overflow-hidden relative mx-0" style={{ height: 520 }}>
            {/* @ts-ignore */}
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeCanvasObject={nodeCanvasObject}
              linkCanvasObject={linkCanvasObject}
              backgroundColor="transparent"
              onNodeClick={handleNodeClick}
              linkDirectionalArrowLength={4}
              linkDirectionalArrowRelPos={0.85}
              cooldownTicks={80}
              onEngineStop={fitGraph}
              nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                const r = (node.risk / 20 + 3) * 1.5 + 4
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
                ctx.fill()
              }}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-5 glass-sm rounded-xl px-4 py-3 flex flex-col gap-1.5">
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-[#7E9BB4] font-mono capitalize">{NODE_LABELS[type]}</span>
                </div>
              ))}
              <div className="border-t border-white/10 mt-1 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px border-t border-dashed border-danger" />
                  <span className="text-xs text-danger font-mono">Suspicious</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-6 h-px border-t border-white/30" />
                  <span className="text-xs text-[#7E9BB4] font-mono">Normal</span>
                </div>
              </div>
            </div>

            {/* Click hint */}
            <div className="absolute top-4 left-5 text-xs text-[#56718A] font-mono">
              Click any node to inspect
            </div>
          </div>

          {/* Node Detail Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="glass rounded-2xl border border-white/8 px-5 lg:px-6 py-5 h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS[selectedNode.type] }} />
                      <span className="text-xs font-mono text-[#7E9BB4] capitalize">{selectedNode.type}</span>
                    </div>
                    <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                      <X size={12} className="text-[#7E9BB4]" />
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-white text-base mb-4 leading-tight">
                    {selectedNode.label.replace('\n', ' ')}
                  </h3>

                  {/* Risk */}
                  <div className="mb-4">
                    <div className="text-xs text-[#56718A] mb-1.5">Risk Level</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/5 rounded-full h-1.5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${selectedNode.risk}%`,
                            backgroundColor: selectedNode.risk > 75 ? '#FF4D6D' : selectedNode.risk > 50 ? '#FFC94D' : '#35F0C8',
                          }}
                        />
                      </div>
                      <span className={`text-sm font-mono font-bold ${
                        selectedNode.risk > 75 ? 'text-danger' : selectedNode.risk > 50 ? 'text-caution' : 'text-forensic'
                      }`}>{selectedNode.risk}</span>
                    </div>
                  </div>

                  {/* Connections */}
                  <div className="mb-4">
                    <div className="text-xs text-[#56718A] mb-2">Connections</div>
                    <div className="space-y-1.5">
                      {networkGraphData.links
                        .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                        .map((link, i) => {
                          const otherId = link.source === selectedNode.id ? link.target : link.source
                          const otherNode = networkGraphData.nodes.find(n => n.id === otherId)
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <div className={`w-1.5 h-1.5 rounded-full ${link.type === 'suspicious' ? 'bg-danger' : 'bg-white/30'}`} />
                              <span className="text-[#A3C2D9]">{otherNode?.label.split('\n')[0]}</span>
                              {link.type === 'suspicious' && (
                                <span className="text-danger font-mono text-[10px]">⚠</span>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  <button className="w-full py-2 rounded-xl bg-saffron/10 border border-saffron/20 text-saffron text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-saffron/20 transition-colors">
                    View Full Profile <ChevronRight size={12} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl border border-white/5 px-5 lg:px-6 py-5 h-full flex flex-col items-center justify-center text-center gap-4"
                >
                  <Network size={32} className="text-white/10" />
                  <div>
                    <div className="text-sm text-[#7E9BB4] font-medium">Click a node</div>
                    <div className="text-xs text-[#56718A] mt-1">to inspect entity details and connections</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Entities Mapped', value: networkGraphData.nodes.length, color: 'text-purple-400' },
            { label: 'Connections', value: networkGraphData.links.length, color: 'text-blue-400' },
            { label: 'Suspicious Links', value: networkGraphData.links.filter(l => l.type === 'suspicious').length, color: 'text-danger' },
            { label: 'High-Risk Entities', value: networkGraphData.nodes.filter(n => n.risk > 70).length, color: 'text-saffron' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl px-5 py-4 border border-white/5"
            >
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#7E9BB4] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </OfficialLayout>
  )
}
