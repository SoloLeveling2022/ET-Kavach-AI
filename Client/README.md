# Kavach-AI: Enterprise Digital Public Safety Dashboard

A production-grade real-time threat interdiction and digital public safety intelligence platform built with **Next.js 16+**, **React 19**, **TypeScript**, and **TailwindCSS v4**.

## Overview

Kavach-AI is a sophisticated dashboard for monitoring and visualizing threat vectors in real-time. It integrates WebSocket media streaming (audio/gyro), live threat visualization, forensic certification, and transaction network analysis—all with a cyber-noir design aesthetic.

### Key Features

- **Real-Time Threat Visualization**: HSL-based threat gauge (teal→gold→crimson) with smooth animations
- **Audio Analysis**: Canvas-based oscilloscope with RMS/peak stress detection
- **Liveness Monitoring**: WebRTC-integrated camera feed with authentication checks
- **Transaction Network**: Neo4j-inspired SVG graph for visualizing money flow
- **GIS Hotspots**: Canvas-based geospatial heat mapping
- **Forensic Docket**: Section 63 BSA certification with Merkle hash and ECDSA signatures
- **Media Streaming**: Dual WebSocket support for 16kHz PCM audio and 50Hz gyro telemetry
- **Virtual Camera Detection**: Built-in Veritas Hardware Gate validation

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16+ (App Router) |
| **UI Library** | React 19 |
| **Styling** | TailwindCSS v4 + CSS custom properties |
| **Components** | shadcn/ui + custom canvas/SVG |
| **Data Fetching** | Axios + SWR |
| **Real-Time** | Native WebSocket API |
| **State** | React Context + Hooks |
| **Type Safety** | TypeScript (strict mode) |

### Directory Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout (dark theme)
│   ├── page.tsx                   # Home → /dashboard redirect
│   ├── globals.css                # Design tokens + animations
│   └── dashboard/
│       ├── layout.tsx             # SessionProvider wrapper
│       └── page.tsx               # Main dashboard
├── components/
│   ├── DashboardLayout.tsx        # 6-panel grid container
│   ├── SessionHeader.tsx          # Top bar (session + threat status)
│   ├── ThreatGauge.tsx            # SVG circular gauge
│   ├── AudioVisualizer.tsx        # Canvas oscilloscope
│   ├── LivenessMonitor.tsx        # WebRTC video feed
│   ├── MoneyFlowGraph.tsx         # SVG transaction graph
│   ├── GISMap.tsx                 # Canvas heat map
│   ├── ForensicDocket.tsx         # Certificate viewer
│   ├── ErrorBoundary.tsx          # Error handling wrapper
│   └── ui/                        # shadcn components
├── context/
│   └── SessionContext.tsx         # Global session state
├── hooks/
│   ├── useThreatPolling.ts        # Threat data polling (1.5s intervals)
│   ├── useWebSocket.ts            # WebSocket connection manager
│   ├── useMediaStream.ts          # Audio/camera capture
│   ├── useGyroSensor.ts           # Gyroscope listener
│   └── useThemeColors.ts          # Dynamic threat colors
├── lib/
│   ├── api.ts                     # REST client (axios)
│   ├── websocket.ts               # WebSocket manager + auto-reconnect
│   ├── audio.ts                   # PCM encoding/decoding + DSP
│   ├── colors.ts                  # HSL threat color mapping
│   ├── types.ts                   # TypeScript interfaces
│   └── constants.ts               # API endpoints + config
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript config
├── next.config.mjs                # Next.js config
└── package.json                   # Dependencies

```

## Installation & Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 10+ (or npm/yarn)
- Backend API running on `http://localhost:8080/api/v1`

### Local Development

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment** (optional)
   ```bash
   # .env.local
   NEXT_PUBLIC_API_BASE=http://localhost:8080/api/v1
   NEXT_PUBLIC_WS_BASE=ws://localhost:8080/api/v1
   ```

3. **Start Dev Server**
   ```bash
   pnpm dev
   ```
   Opens at `http://localhost:3000` → auto-redirects to `/dashboard`

4. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## API Integration

### Backend Requirements

The dashboard expects a FastAPI/asyncio backend at `http://localhost:8080/api/v1` with these endpoints:

#### REST Endpoints
- `POST /session/init` → Returns `{ session_id, device_labels }`
- `GET /session/{session_id}/threat` → Returns threat index + agent scores
- `POST /session/{session_id}/close` → Session cleanup

#### WebSocket Endpoints
- `ws://localhost:8080/api/v1/stream/audio?session_id={id}` → 16kHz PCM (binary)
- `ws://localhost:8080/api/v1/stream/sensor?session_id={id}` → Gyro telemetry (JSON)

### Session Initialization Flow

1. User lands on `/dashboard`
2. `SessionProvider` calls `initializeSession()` (POST /session/init)
3. Session ID stored in context
4. `useThreatPolling` starts 1.5s polling intervals
5. `useMediaStream` requests microphone permission
6. Audio frames encoded as 16kHz PCM and sent via WebSocket

### Error Handling

| Error | Handling |
|-------|----------|
| **Session Init Failed** | Auto-retry after 3s (exponential backoff) |
| **Virtual Camera (403)** | Show alert + block interdiction |
| **WebSocket Disconnect** | Auto-reconnect with exponential backoff |
| **Gyro Permission Denied** | Graceful fallback (iOS 13+) |
| **Microphone Permission** | User consent dialog |

## Design System

### Color Palette (HSL)

```css
--bg-deep: hsl(220, 13%, 9%);           /* Deep navy */
--bg-card: hsl(220, 14%, 16%);          /* Card background */
--border-color: hsl(220, 10%, 25%);     /* Borders */
--text-primary: hsl(0, 0%, 95%);        /* Primary text */
--text-secondary: hsl(0, 0%, 70%);      /* Secondary text */

/* Threat Index Color Map */
--threat-safe: hsl(190, 100%, 50%);     /* 0.0-0.30: Cyber teal */
--threat-warning: hsl(40, 100%, 50%);   /* 0.30-0.60: Gold */
--threat-critical: hsl(0, 100%, 50%);   /* 0.60-1.0: Crimson red */
```

### Motion Design (Corporate Personality)

- **Duration Palette**: Quick (150ms) | Standard (300ms) | Slow (500ms)
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (standard)
- **Entrance**: 300ms ease-out with 50-100ms stagger
- **Threat Gauge**: Smooth interpolation over 350ms
- **Critical Alert**: Glow pulse animation at 0.60+ threat index

### Typography

- **Font**: System fonts (Inter fallback)
- **Headings**: 600 weight, 24px
- **Body**: 400 weight, 13-14px
- **Mono**: Font-mono for hashes/code

## Component APIs

### DashboardLayout

6-panel responsive grid (2x3):

```tsx
<DashboardLayout
  header={<SessionHeader />}
  threatGauge={<ThreatGauge />}
  audioVisualizer={<AudioVisualizer audioData={data} />}
  liveness={<LivenessMonitor />}
  moneyFlow={<MoneyFlowGraph />}
  gisMap={<GISMap />}
  forensicDocket={<ForensicDocket />}
/>
```

### ThreatGauge

Canvas-based circular gauge with smooth animation:
- Renders 0°-360° arc mapped to 0.0-1.0 threat
- Dynamic color transitions
- Smooth 350ms interpolation on updates
- Glow effect at critical (0.60+)

### AudioVisualizer

Canvas oscilloscope with real-time audio analysis:
- Accepts `audioData?: ArrayBuffer` (PCM)
- Displays RMS and peak values
- Color changes to red on stress (RMS > 0.3)
- Fallback animation when no audio

### LivenessMonitor

WebRTC video feed placeholder with liveness indicator:
- Shows "Live" badge (green)
- Camera icon placeholder
- Ready for video element integration

### MoneyFlowGraph

SVG-based transaction network graph:
- 4 sample nodes (Source, Banks A/B, Destination)
- Directed edges with arrowheads
- Suitable for Neo4j topology visualization

### GISMap

Canvas-based geospatial heat map:
- Grid background
- Sample hotspots with radial gradients
- Intensity-based coloring (red for high)

### ForensicDocket

Certificate viewer card:
- Displays Merkle hash (SHA-256)
- Shows ECDSA signature (P-256)
- Timestamp and export functionality

## Hooks Reference

### `useSession()`
Global session state management.

```tsx
const { sessionId, threatIndex, isInitialized, error } = useSession();
```

### `useThreatPolling()`
Polls threat data at 1.5s intervals.

```tsx
const { data, error, isLoading } = useThreatPolling();
```

### `useMediaStream(options)`
Captures audio and video with device validation.

```tsx
const { hasAudio, hasCamera, isBlocked, startAudio, startCamera } = useMediaStream({
  onAudioFrame: (data) => { /* 16kHz PCM */ },
  onCameraBlocked: () => { /* Virtual camera detected */ },
});
```

### `useGyroSensor(options)`
Listens to device gyroscope (iOS 13+).

```tsx
const { isSupported, requestPermission, start, stop } = useGyroSensor({
  onData: (data) => { /* { gx, gy, gz, timestamp } */ },
});
```

### `useWebSocket(url, config)`
Manages WebSocket connections with auto-reconnect.

```tsx
const { isConnected, error, send } = useWebSocket('ws://...', {
  binaryType: 'arraybuffer',
  onMessage: (data) => {},
});
```

## Utilities

### Color Functions (`lib/colors.ts`)

```tsx
getThreatColor(threatIndex)       // HSL string based on threat level
getThreatLevel(threatIndex)       // 'SAFE' | 'SUSPICIOUS' | 'CRITICAL'
formatThreatPercentage(threatIndex) // "45%"
getThreatShadow(threatIndex)      // CSS shadow string
hslToRgb(hslString)               // [r, g, b] for canvas
```

### Audio Functions (`lib/audio.ts`)

```tsx
encodeAudioFrame(float32)         // ArrayBuffer PCM
decodeAudioFrame(arrayBuffer)     // Float32Array
calculateRMS(samples)             // RMS energy
isAudioStressed(samples)          // Stress detection
getAudioStats(samples)            // { rms, peak, mean }
```

## Performance Optimization

- **Canvas Rendering**: Device pixel ratio aware with requestAnimationFrame
- **Audio Processing**: ScriptProcessor with 100ms chunks
- **Threat Updates**: Smooth interpolation to avoid jank
- **WebSocket**: Binary protocol for audio (no JSON overhead)
- **SWR**: Deduplication + revalidation control
- **Code Splitting**: Dynamic imports via Next.js App Router

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS 13+ (with gyro permission), Android 8+
- **Features Requiring Permission**: Microphone, Camera, Gyroscope (iOS)

## Security Considerations

- ✅ **Virtual Camera Detection**: Blocks OBS, v4l2loopback, DroidCam
- ✅ **HTTPS Only**: WebSocket over WSS in production
- ✅ **CORS**: Configure backend with appropriate CORS headers
- ✅ **Session Validation**: Server-side session checks required
- ✅ **Input Validation**: All API responses validated
- ✅ **Error Messages**: Generic messages in production

## Responsive Design

Dashboard adapts to viewport sizes:

| Viewport | Behavior |
|----------|----------|
| **Desktop (1920x1080)** | Full 6-panel grid |
| **Laptop (1366x768)** | Slight compression |
| **Tablet (1024x768)** | Stacked layout (future) |
| **Mobile (375x667)** | Single column (future) |

Currently optimized for desktop/1216px+ (dev environment).

## Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repo
vercel link

# Deploy
vercel deploy

# Production
vercel promote
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Environment Variables (Production)

```bash
NEXT_PUBLIC_API_BASE=https://api.kavach-ai.example.com/api/v1
NEXT_PUBLIC_WS_BASE=wss://api.kavach-ai.example.com/api/v1
```

## Development Roadmap

- [ ] Full WebRTC liveness integration
- [ ] Real Neo4j graph visualization (react-force-graph)
- [ ] Advanced audio DSP (FFT, spectrogram)
- [ ] Geospatial map library (react-simple-maps)
- [ ] Mobile responsive layout
- [ ] Dark/light theme toggle
- [ ] Export dashboard to PDF
- [ ] Multi-session support
- [ ] Real-time notifications
- [ ] Analytics dashboard

## Troubleshooting

### Dashboard Shows "Failed to initialize session"

**Cause**: Backend not running or wrong URL
```bash
# Check backend
curl http://localhost:8080/api/v1/session/init

# Update .env.local if needed
NEXT_PUBLIC_API_BASE=http://your-backend:8080/api/v1
```

### Audio visualizer shows no data

**Cause**: Microphone permission denied
- Check browser permissions (Settings → Privacy → Microphone)
- Reload page and grant permission

### Virtual camera detected error

**Cause**: Running in VM or with screen capture software
- Disable OBS/screen capture
- Use physical camera device
- Set `VERITAS_HARDWARE_GATE_BYPASS=1` in development only

### WebSocket connection fails

**Cause**: CORS or WSS in production
- Backend must include WebSocket CORS headers
- Use WSS (WebSocket Secure) in production
- Check firewall rules

## Support

For issues, feature requests, or questions:
- Create an issue in GitHub
- Email: support@kavach-ai.example.com
- Docs: https://docs.kavach-ai.example.com

## License

Proprietary - Enterprise Digital Public Safety Platform

---

**Built with v0** | Last Updated: 2025
