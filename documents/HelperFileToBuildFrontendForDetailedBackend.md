# 🛡️ Kavach-AI: Frontend Integration Specification
### 🔌 Systems Engineering REST/WebSocket API Spec & Client-Side Design Guide
**Author**: Principal Cyber-Forensic Systems & UI Architect (15+ Years Distributed Systems)  
**Target Audience**: Frontend Engineers, UX/UI Designers, Media Streaming Developers  
**Release Version**: v1.0.0-Python-Release  

---

## 1. System Overview & Ingestion Flow

Kavach-AI runs an asynchronous, low-latency agentic swarm to analyze voice clones, cognitive stress hand-tremors, facial deepfakes, and transaction flows in real time. The entire backend runs on **Python (FastAPI + Redis + PostgreSQL pgvector + Neo4j)**.

As the frontend team, your system must handle three distinct tasks:
1. **REST Communications**: Manage session lifecycle (initialization, threat polling, termination).
2. **Binary Audio Streaming**: Capture user microphone input, compress or packetize it, and stream raw 16kHz PCM chunks over a binary WebSocket connection.
3. **High-Frequency Gyro Streaming**: Capture mobile device gyroscope sensor events at 50Hz and stream telemetry JSON over a text WebSocket connection.

---

## 2. Session Lifecycle REST HTTP APIs

All HTTP requests must use the base endpoint: `http://localhost:8080/api/v1`.

### 2.1 Initialize Monitoring Session
This HTTP POST request must be called **before** initiating any media streams. It validates browser properties, registers platform context, and screens camera hardware devices.

*   **Endpoint**: `POST /session/init`
*   **Headers**: `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
      "camera_device_label": "FaceTime HD Camera (Built-in)",
      "platform": "Win32"
    }
    ```
    > [!IMPORTANT]
    > **The Veritas Gate-1 Hardware Filter**: If `camera_device_label` contains strings like `"OBS Virtual Camera"`, `"v4l2loopback"`, or `"DroidCam"`, the backend returns `403 Forbidden` instantly to prevent virtual-camera deepfake bypasses. Ensure you query `navigator.mediaDevices.enumerateDevices()` and pass the raw label string.

*   **Response (201 Created)**:
    ```json
    {
      "session_id": "c6c0d2c4-ec65-4a22-8753-cf7b61e5223b",
      "status": "active",
      "ws_audio_url": "/api/v1/stream/audio?session_id=c6c0d2c4-ec65-4a22-8753-cf7b61e5223b",
      "ws_sensor_url": "/api/v1/stream/sensor?session_id=c6c0d2c4-ec65-4a22-8753-cf7b61e5223b"
    }
    ```

---

### 2.2 Retrieve Real-time Fused Threat Coordinates
Fetch the current fused risk score calculated by the 8-agent swarm. Your dashboard should poll this endpoint every **1.5 to 2.0 seconds** (or listen to the corresponding Server-Sent Events/PubSub channel if configured).

*   **Endpoint**: `GET /session/{session_id}/threat`
*   **Response (200 OK)**:
    ```json
    {
      "session_id": "c6c0d2c4-ec65-4a22-8753-cf7b61e5223b",
      "threat_index": 0.6195,
      "status": "active",
      "agent_scores": {
        "phoneme": 1.0,
        "hermes": 0.5,
        "veritas": 0.95,
        "aegis": 1.0,
        "nexus": 0.18,
        "vanguard": 0.0,
        "lumen": 0.0,
        "lex": 0.0
      },
      "sampled_at": "2026-07-18T18:15:29.545395Z"
    }
    ```
    *   `threat_index` ($0.0$ to $1.0$): Fused index mapping threat severity.
    *   **Interdiction Actions**: If the `threat_index` crosses the threshold configured in the backend (e.g. `0.60`), the backend automatically initiates account freezes and SIP terminations. The frontend should display a prominent visual warning state when this occurs.

---

### 2.3 Retrieve Full Session State
Fetch detailed raw logs and device configuration matrices.

*   **Endpoint**: `GET /session/{session_id}`
*   **Response (200 OK)**:
    ```json
    {
      "session_id": "c6c0d2c4-ec65-4a22-8753-cf7b61e5223b",
      "status": "active",
      "device_info": {
        "user_agent": "Mozilla/5.0 ...",
        "client_ip": "127.0.0.1",
        "camera_device_label": "Integrated FaceTime Camera",
        "platform": "Win32"
      },
      "threat_index": 0.6195,
      "agent_scores": { ... },
      "created_at": "2026-07-18T18:15:00.367Z",
      "updated_at": "2026-07-18T18:15:29.848Z"
    }
    ```

---

### 2.4 Terminate Session (Heartbeat Teardown)
Teardown the monitoring loop, clear the cache pools, and finalize audit trails.

*   **Endpoint**: `POST /session/{session_id}/close`
*   **Response (200 OK)**:
    ```json
    {
      "closed": true,
      "session_id": "c6c0d2c4-ec65-4a22-8753-cf7b61e5223b"
    }
    ```

---

## 3. WebSocket Real-time Ingestion Streams

Use standard browser WebSocket implementations (`new WebSocket(...)`) to connect to these ingestion streams.

### 3.1 Audio Ingestion WebSocket
This stream handles raw audio chunking. Voice processing is sensitive to sampling offsets: you must supply exactly **16kHz mono PCM frames**.

*   **URL**: `ws://localhost:8080/api/v1/stream/audio?session_id={session_id}`
*   **Protocol Mode**: `binary`
*   **Expected Audio Format**:
    *   Sampling Rate: **16,000 Hz** (16kHz)
    *   Channel: **1 (Mono)**
    *   Format: **Signed 16-bit Int (PCM)**, Little-Endian.
    *   Buffer/Packet Size: Send **3200 bytes** (representing 1600 samples / 100ms of audio) per message frame.
    *   Frequency: Stream a packet every **100ms**.

#### 💡 JS Media Recorder Implementation Guideline:
```javascript
const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
const source = audioContext.createMediaStreamSource(micStream);
const processor = audioContext.createScriptProcessor(4096, 1, 1);

processor.onaudioprocess = (e) => {
  const float32Samples = e.inputBuffer.getChannelData(0);
  // Convert float32 array [-1.0, 1.0] to signed 16-bit PCM integer byte array
  const int16Buffer = new Int16Array(float32Samples.length);
  for (let i = 0; i < float32Samples.length; i++) {
    int16Buffer[i] = Math.min(1, Math.max(-1, float32Samples[i])) * 0x7FFF;
  }
  // Send the raw binary arraybuffer over the WS connection
  wsAudio.send(int16Buffer.buffer);
};
```

---

### 3.2 Sensor/Gyro Ingestion WebSocket
Captures physical handset hand tremors to screen for neurological fear/stress coordinates.

*   **URL**: `ws://localhost:8080/api/v1/stream/sensor?session_id={session_id}`
*   **Protocol Mode**: `text`
*   **Sampling Rate**: **50 Hz** (Send 1 frame every 20ms).
*   **Expected Frame Schema**:
    ```json
    {
      "gx": 0.0012,
      "gy": -0.0025,
      "gz": 0.0049,
      "ts": 1718819282900
    }
    ```
    *   `gx`, `gy`, `gz`: Floating-point angular velocity rates along the x, y, and z axes (radians per second).
    *   `ts`: Epoch timestamp of the sample (milliseconds).

---

## 4. UI/UX Dashboard Layout Guidelines
*Designed by Principal Systems Architects for Maximum Judge Visual Impact.*

```
+---------------------------------------------------------------------------------------+
|  KAVACH-AI Sovereign Forensic Dashboard | Session: ac785969-96b9-466f  | STATUS: ACTIVE  |
+---------------------------------------------------------------------------------------+
|  [Voice Stress Centroid Osc.]   |  [Liveness Reflectance View]  |  [FUSED RISK GAUGE] |
|                                 |                               |       /-----\       |
|    /\_/\    /\/\_               |    Genuine Skin Subsurface:   |      /   |   \      |
|  _/     \__/     \__            |    Variance: 0.0125           |     |    |    |     |
|  (16kHz Real-time Audio wave)   |    Liveness: VERIFIED [OK]    |      \ 0.6195 /     |
|                                 |                               |       \-----/       |
+---------------------------------+-------------------------------+---------------------+
|  [Hawkes Spatial Patrol Grid]   |  [Neo4j Circular Money Flow]  |  [Forensic Docket]  |
|                                 |                               |                     |
|  Hotspot priority: HIGH         |  Mule Loop Detected:          |  Merkle Cert:       |
|  Delhi Center: 28.61, 77.20     |  501002300091 -> 999999999    |  S.63 BSA Certified |
|  Units Rec: 8                   |  Loop Hops: 3                 |  Signature Signed   |
+---------------------------------------------------------------------------------------+
```

### 🎯 Key Design Elements to Implement:
1.  **The Fused Risk Gauge**:
    *   A radial dashboard gauge displaying the `threat_index`.
    *   **Dynamic Color Shift**: HSL transition from sleek teal/cyan (`0.0 - 0.3` - normal) to warning yellow (`0.3 - 0.6` - suspicious) to high-concurrency bright warning crimson (`0.6 - 1.0` - threat flagged / interdiction triggered).
2.  **Voice Stress Centroid (Audio Visualizer)**:
    *   Create a Web Audio API `AnalyserNode` canvas oscillator. Display the incoming voice patterns. Highlight frequency shifts between low and high spectral centroids.
3.  **Liveness Reflectance Monitor**:
    *   Display the raw liveness reflection value overlay on the webcam video feed. If Veritas blocks due to virtual camera driver detection, display a red shield alert overlay containing: `CRITICAL DRIVER BLOCK: VIRTUAL CAMERA INGEST INHIBITED`.
4.  **Neo4j Circular Flow Network View**:
    *   Render a lightweight node diagram showing transaction circularity. If `nexus` score is non-zero, connect nodes `Account -> Target -> Source` to visualize circular money routing loops in red.
5.  **Lex BSA Section 63 Merkle Certified Widget**:
    *   A card displaying forensic validation details:
        *   `Merkle Hash`: Display the SHA-256 evidence chain signature.
        *   `Signature`: ECDSA P-256 Base64 representation.
        *   Include a `Download Certified Court Docket` button that downloads the full forensics JSON dossier.
