# 🇮🇳 NIRIKSHAN — MPLADS Forensic Intelligence & Early-Warning Platform
> **Smart India Hackathon 2026**
> Problem Statement: *Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation.*
> 
> *"See the pattern before the loss."*

---

## 🌟 Overview & Core Philosophy
NIRIKSHAN is not just a reactive rule checker. It is an end-to-end intelligence engine that **learns the behavioral DNA** of public infrastructure projects, tracks how irregularity patterns evolve across geographic clusters, benchmarks projects dynamically against their true peers, uncovers hidden shell-contractor networks, verifies multi-modal ground evidence (including solar angle verification), actively tests counter-evidence hypotheses, and **replays historical cases** to demonstrate early warnings.

```
                     NIRIKSHAN
                  INTELLIGENCE CORE
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
     CITIZEN          OFFICIAL            MP
        │                │                │
 Transparency       Investigation     Strategic
    Layer               Layer        Intelligence
```

---

## 🚀 Key Innovation Pillars (For Presentation)

| Pillar | Innovation | What It Proves |
|---|---|---|
| 🧬 **1. Behavioral DNA + Risk Engine** | 6-dimensional project fingerprinting (Financial, Temporal, Entity, Documentation, Geographic, Image) | We detect behavioral patterns, not just simple threshold violations. |
| 📊 **2. Adaptive Peer Benchmarking** | Dynamic peer clustering + Multi-Benchmark Convergence | We understand whether a project is abnormal in its true local/national/contractor context. |
| 🕸️ **3. Network Intelligence** | Force-directed entity relationship graph with suspicious chain highlighting | Uncovers hidden connections between projects, shell entities, and contractors. |
| 📸 **4. Multi-Modal Evidence Lab** | GPS + EXIF + Timeline Feasibility + Solar/Shadow physics check | Validates whether the project's ground story is physically possible. |
| ⚖️ **5. Forensic Reasoning & Counter-Evidence** | Prosecution vs. Defense balance scale + "What if I'm wrong?" engine | Explains reasons transparently and reduces false positives by testing legitimate explanations. |
| 🕰️ **6. Historical Case Replay Lab** | Time-scrubber replaying real historical cases without hindsight bias | Demonstrates retrospective early warning and quantified time/funds saved. |

---

## 🧭 Application Route Architecture

### 👤 Citizen Interface (Transparency)
- `/` — Cinematic Landing page with live statistics, animated India map, 6 core innovations, and pipeline breakdown.
- `/auth/login` — 3-Role secure access portal with glowing selection cards.
- `/citizen/dashboard` — Live search, status filters (Completed, Ongoing, Delayed, Review), allocation cards, and Community Pulse.
- `/citizen/project/[id]` — Visual 7-stage lifecycle journey, financial breakdown, verified geo-tagged photo gallery, and ground reality reporting modal.

### 🏛️ Government Official Interface (Investigation)
- `/official/command-center` — Real-time live intelligence ticker, KPI spark cards, India risk heatmap, and high-priority flagged projects.
- `/official/behavioral-dna` — 6D Radar chart, dimension score breakdown, animated risk gauge, and pattern comparison vs. known suspicious signatures.
- `/official/peer-benchmarking` — Multi-benchmark convergence badge, national/local/contractor percentile metrics, and peer composition matrix.
- `/official/network-intelligence` — Interactive force-directed relationship graph, suspicious path routing, and entity inspector drawer.
- `/official/evidence-verification` — Multi-modal evidence checklist (GPS, timestamp, perceptual similarity, EXIF, solar shadow angle), and timeline feasibility analysis.
- `/official/forensic-reasoning` — Prosecution vs. defense evidence cards, animated balance scale, Counter-Evidence engine, and recommended actions.
- `/official/case-replay` — Headline SIH demo scrubber (2017–2021) with autoplay, full-screen **🚨 Early Warning Overlay**, score contribution bar chart, and dual timeline.
- `/official/case-files` — Ranked investigation priority queue with risk badges, evidence strength dots, and 12-section full Audit Dossier modal.

### 👨‍💼 MP / Senior Official Interface (Strategic)
- `/mp/dashboard` — Constituency health score dial (0–100 arc), urgent vs. positive action center, peer performance benchmark, community-official conflict detector, and report exporter.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack, Server & Client Components)
- **Styling**: Tailwind CSS v4 with custom dark aesthetic (`#04070F` deep space black, `#FF6B00` saffron, `#4FFFB0` forensic green, `#FF3B5C` alert red)
- **Motion & Physics**: Framer Motion, GSAP
- **Data Visualization**: Recharts, D3.js
- **Network Graph**: React Force Graph 2D
- **Icons**: Lucide React

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/YuvrajSrivastava050/SIH.git
cd SIH/nirikshan

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm run dev

# 4. Open browser
http://localhost:3000
```

---

## 🔗 Backend API Integration Guide (For Backend Collaborators)
All frontend data is currently served via `@/lib/mock-data/index.ts`. To connect real backend endpoints:
1. Copy `.env.example` to `.env.local`
2. Update the API endpoints in `src/lib/api/` to point to your FastAPI / Flask / Node.js backend.
3. Every component utilizes clean JSON contracts matching the data structures documented in `src/lib/mock-data/index.ts`.
