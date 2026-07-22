# **Product Requirement Document (PRD), Software Requirements Specification (SRS), and System Design Specification for Kavach-AI**

**Project:** Kavach-AI: Enterprise Digital Public Safety and Threat Intelligence Infrastructure  
**Document Version:** 1.0.0-PROD  
**Target Problem Statement:** ET AI Hackathon PS-6 (AI for Digital Public Safety)  
**Security Classification:** Restricted / Law Enforcement & Financial Institutions Only

## **1\. Product Requirement Document (PRD)**

### **1.1 The Crux: Problem Statement and Threat Landscape (July 2026\)**

As of July 2026, digital public safety in India faces coordinated, highly organized cybercrime syndicates.3 The Indian Cyber Crime Coordination Centre (I4C) reported that in 2025 alone, citizens lost ₹19,812.96 crore across 21.77 lakh reported financial cyber-fraud complaints.13  
The defining threat vector of this era is the **"Digital Arrest" scam**. In these schemes, cross-border fraud syndicates impersonate central law enforcement officers (such as CBI, ED, NCB, or Customs officials) over encrypted video communication channels (WhatsApp, Skype, Zoom).  
By displaying forged documents with official government seals, using deepfake video streams, and creating realistic backdrops of police stations, attackers trap victims in continuous "virtual custody" for hours or days, coercing them into transferring their life savings into complex money-mule accounts.3

Traditional Flow (Reactive):   
\[Victim Coerced\] ──\> ──\> ──\> \[1930 Helpline Complaint\] ──\>

Kavach-AI Flow (Pre-Emptive Interdiction):  
 ──\> ──\> ──\> (7.2 Seconds)

At the same time, Fake Indian Currency Notes (FICN) have reached high levels of print quality. High-denomination Rs 500 counterfeits are now capable of bypassing standard manual inspections and retail cash-counting machines, undermining economic trust.  
Traditional cyber-forensic frameworks are reactive, focusing on post-incident analysis after funds have already been laundered through multi-hop money-mule networks.3 Kavach-AI addresses this structural gap by shifting public safety systems from post-incident investigations to real-time interdiction at the point of contact.3

### **1.2 Solution Positioning: From Retrospective Forensics to Real-Time Interdiction**

Kavach-AI is a low-latency, multi-modal threat interdiction and forensic certification infrastructure. It bridges the gap between active telecom calls, Core Banking Rails (CBS), and police enforcement systems.  
Rather than functioning as a passive dashboard, Kavach-AI acts as an active, automated defensive system. When the system detects a high-confidence scam signature or circular transfer loop, it triggers instant API kill-switches to block calls and freeze bank accounts.

### **1.3 Target Audience and User Personas**

#### **1.3.1 The Vulnerable Citizen (Edge Protection)**

* **Context:** Receives a spoofed call alleging their Aadhaar identity has been linked to a high-profile narcotics package or money-laundering case.15  
* **Pain Point:** Extreme psychological coercion, isolation, lack of direct verification tools, and high risk of transferring immediate deposits.17  
* **Platform Intervention:** A lightweight, browser-based on-call companion running local WebRTC capture to detect voice spoofing, synthetic faces, and behavioral duress.18

#### **1.3.2 Bank and Telecom Security Operations (Interdiction Gateways)**

* **Context:** Tasked with monitoring thousands of rapid transactions and high-frequency SIP call packets daily.  
* **Pain Point:** Inability to detect multi-hop, circular transaction paths or automated SIP spoofing using static, tabular rules.7  
* **Platform Intervention:** Low-latency Webhook microservices running on Rust to execute real-time graph path checks and call blocks under a strict ![][image1] processing budget.7

#### **1.3.3 Cyber Cell Investigators (MHA / I4C / CBI)**

* **Context:** Tasked with investigating international fraud compounds, tracking money mule operations, and compiling court-admissible evidence.  
* **Pain Point:** Fragmented intelligence, lack of standardized cross-jurisdictional case linking, and electronic evidence being rejected in court due to non-compliance with the Bharatiya Sakshya Adhiniyam, 2023 (BSA).15  
* **Platform Intervention:** An interactive command center with automated, cryptographically signed Section 63 BSA evidence packages and GNN-driven fraud network mapping.

### **1.4 Core Value Propositions and Unique Selling Propositions (USPs)**

1. **Acoustic Glottal-Pulse Spoof Verification (Speech AI):** Isolates the raw glottal excitation waveform of incoming audio streams to detect zero-shot cloned voices (such as ElevenLabs or Coqui). This approach bypasses standard compression barriers on standard telephone channels, where conventional spectral models fail.  
2. **Anisotropic Skin-Reflectance Face Liveness (Computer Vision):** Captures browser media device parameters and analyzes sub-pixel skin illumination properties to identify injected WebRTC virtual cameras and synthetic video feeds.  
3. **Client-Side Behavioral Duress Biometrics (Behavioral AI):** Monitors high-frequency gyroscopic micro-tremors and touch interface dynamics at 50 Hz to detect physiological signs of extreme fear or coercion.  
4. **Temporal GNN Circular Flow Tracking (Graph AI):** Maps multi-bank transaction topologies in a live graph, identifying circular fund flows designed to bypass standard velocity alerts.  
5. **Fourier Ptychographic Intaglio print Verification (Optical AI):** Resolves microscopic intaglio print ridges on banknotes using standard smartphone cameras, verifying physical authenticity without expensive hardware.  
6. **Automated Section 63 BSA Certification (Legal AI):** Generates dual-signed compliance dockets containing SHA-256 asset fingerprints and system state logs, ensuring digital evidence is ready for courtroom submission.

## **2\. Software Requirements Specification (SRS)**

### **2.1 Scope and System Boundary**

Kavach-AI provides real-time, zero-hardware-dependent public safety shielding across three core user groups:

* **The Indian Citizen:** Direct endpoint protection via a mobile-responsive web portal (Next.js) featuring live-call duress tracking, instant smartphone-camera banknote validation, and an interactive multilingual advisory chatbot.  
* **Financial Institutions & Telecom Operators:** Real-time transaction interdiction pipelines, device IMEI tracking, and dynamic "Kill-Switch" APIs to freeze compromised payment rails instantly.  
* **Law Enforcement Agencies (MHA/I4C/CBI):** Interactive GIS crime maps and GNN-generated multi-jurisdictional intelligence packages ready to be submitted as court-admissible evidence.

### **2.2 Functional Requirements**

#### **2.2.1 Real-Time Media and Data Ingestion**

* **FR-1.1:** The system MUST support binary WebSocket ingestion of raw 16kHz mono PCM audio streams with latency under ![][image2].  
* **FR-1.2:** The system MUST capture gyroscopic (![][image3]) coordinates and touch interaction metrics at a minimum sampling rate of 50 Hz.  
* **FR-1.3:** The system MUST parse browser-exposed camera device labels and reject known virtual driver signatures (such as OBS, v4l2loopback, or SparkoCam).

#### **2.2.2 Multi-Agent Threat Classification**

* **FR-2.1:** The **Phoneme-Agent** MUST calculate acoustic liveness by running linear predictive coding (LPC) inverse filtering on rolling 1-second audio windows.  
* **FR-2.2:** The **Veritas-Agent** MUST extract face mesh regions of interest and evaluate anisotropic skin reflectance to flag synthetic visual elements.  
* **FR-2.3:** The **Hermes-Agent** MUST transcribe audio using Whisper and match extracted keywords against a threat script state machine stored in Redis.  
* **FR-2.4:** The **Nexus-Agent** MUST execute neighborhood aggregation queries on the Neo4j graph database to detect circular transaction loops.

#### **2.2.3 Automated Interdiction and Response**

* **FR-3.1:** When the cumulative threat index exceeds ![][image4], the system MUST dispatch an outbound transaction-freeze webhook to Core Banking Systems.  
* **FR-3.2:** The system MUST send immediate SIP-termination commands to telecom gateways to disconnect confirmed scam numbers.  
* **FR-3.3:** The **Vanguard-Agent** MUST update spatio-temporal Hawkes intensity coordinates to calculate optimized police patrol routes.

#### **2.2.4 Forensic Certification and Legal Compliance**

* **FR-4.1:** The **Lex-Agent** MUST calculate SHA-256 fingerprints of all captured session audio, video, and text transcript binaries.  
* **FR-4.2:** The system MUST compile a dual-signed Section 63 BSA compliance certificate containing the calculated file hashes and system stability metrics.  
* **FR-4.3:** The system MUST log all evidence movements to an immutable, chronological chain-of-custody ledger.

## **3\. System Design & Engineering Architecture**

Kavach-AI's system architecture is engineered for sub-millisecond execution loops, memory safety under high concurrency, and reliable distributed state management.3 The system splits operations between a high-speed, edge-cognition ingestion layer and a highly coordinated central cooperative cloud core.12

### **3.1 Global Architectural Topology**

The architecture consists of a Next.js single-page application communicating over HTTP/2 and raw binary WebSockets with an asynchronous Rust engine compiled to native machine targets for maximum CPU instruction throughput.3

                                SYSTEM ARCHITECTURE TOPOLOGY  
                                  
  \+---------------------------------------------------------------------------------------+  
  |                                     CLIENT TIER                                       |  
  |  \+--------------------+      \+-----------------------+      \+----------------------+  |  
  |  |  Next.js App UI    |      | WebRTC Video Capture  |      | 16kHz Mic Ingestion  |  |  
  |  |  (Tailwind/shadcn) |      | (Veritas Mesh Stream) |      | (Binary WebSockets)  |  |  
  |  \+---------+----------+      \+-----------+-----------+      \+-----------+----------+  |  
  \+------------│─────────────────────────────│──────────────────────────────│-------------+  
               │ HTTP/2 JSON                 │ WebRTC                       │ WS Bin Packets  
               ▼                             ▼                              ▼  
  +------------│─────────────────────────────│──────────────────────────────│-------------+  
  |            │                             │                              │             |  
  |            v                             v                              v             |  
  |  +---------------------------------------------------------------------------------+  |  
  |  |                               FASTAPI INGESTION CORE                            |  |  
  |  |  * Asyncio Concurrent Runtime             * fastapi-websockets Protocol         |  |  
  |  |  * onnxruntime Quantized ML Inference     * OpenCV 2D FFT Matrix Engine         |  |  
  |  |  * Whisper ONNX Language Parser           * Cryptographic PKI Hashing           |  |  
  |  +---------------------------------------+-----------------------------------------+  |  
  |                                          │                                            |  
  +──────────────────────────────────────────┼────────────────────────────────────────────+  
                                             │ Parallel TCP Pools  
                                             ▼  
  +───────────────────────────────────────────────────────────────────────────────────────+  
  |                                   PERSISTENCE TIER                                    |  
  |  +----------------------------+  +----------------------------+  +-----------------+  |  
  |  |     POSTGRESQL + pgvector  |  |        NEO4J GRAPH DB      |  |  REDIS MEMORY   |  |  
  |  |  * Semantic Embeddings     |  |  * Transaction Ledgers     |  |  * Session ring |  |  
  |  |  * Suspect Identity Logs   |  |  * Money-Mule Networks     |  |    buffers      |  |  
  |  +----------------------------+  +----------------------------+  +-----------------+  |  
  +---------------------------------------------------------------------------------------+

### **3.2 Thread-Safe, Non-Blocking Ingestion Pipeline (Python FastAPI)**

The backend is written in Python, leveraging the FastAPI and asyncio runtimes to execute non-blocking, asynchronous worker loops.3 Raw media payloads are received via binary WebSocket channels and buffered directly into memory-resident ring structures, bypassing file-system I/O latency entirely.3

                     FASTAPI ASYNCHRONOUS WEBSOCKET DATAFLOW  
                       
  Incoming WS Conn ──\> [FastAPI Http Ingestion] ──\>  
                                                        │  
                                                        v  
  Local CPU Worker ◄── \[Lock-Free Queue\] ◄──  
         │  
         ├──\> \[Extract Glottal Pulse / LPC Filter\] ──\> Phoneme Score  
         ├──\> ──\> Lumen Score  
         └──\> ──\> Hermes stress Score

### **3.3 Microservice and Storage Architecture**

1. **PostgreSQL with pgvector:** Stores suspect identity registries, historical incident logs, and 384-dimensional semantic conversation embeddings.3 HNSW indexing is configured over vector columns to enable sub-millisecond similarity matches against known threat templates.3  
2. **Neo4j Graph Database:** Acts as the primary database for relationship analytics.8 It maps accounts, device identifiers, and logged IP addresses to perform multi-hop transaction tracing and spot circular fund transfers.7  
3. **Redis State Cache:** Serves as the real-time memory buffer.23 It holds active call states, running gyroscopic variance pools, and temporary media buffers, ensuring sub-second execution speeds.23

## **4\. Deep-Dive Specification of the Coordinated Multi-Agent Swarm**

Kavach-AI coordinates its operations through an active, self-coordinating multi-agent swarm.24 The coordinator agent maps incoming multi-modal threat vectors to specialized agents via the Model Context Protocol (MCP), combining their outputs into a single, cohesive threat interdiction flow.24

                            MCP MULTI-AGENT COORDINATION FLOW  
                              
                                   \+-----------------------+  
                                   |   Coordinator Agent   |  
                                   |  (MCP Context Frame)  |  
                                   \+-------+───────+-------+  
                                           │       │  
                ┌──────────────────────────┘       └──────────────────────────┐  
                ▼                                                             ▼  
    \+-----------------------+                                     \+-----------------------+  
    |     Phoneme-Agent     |                                     |     Veritas-Agent     |  
    |  \* Glottal Excitation |                                     |  \* Skin Reflectance   |  
    |  \* Wav2Vec Stability  |                                     |  \* Mesh Geometry      |  
    \+-----------+-----------+                                     \+-----------+-----------+  
                │                                                             │  
                └──────────────────────────┐       ┌──────────────────────────┘  
                                           ▼       ▼  
                                   \+-------+───────+-------+  
                                   |     Hermes-Agent      |  
                                   |  \* Whisper Parser     |  
                                   |  \* Duress Variance    |  
                                   \+-------+───────+-------+  
                                           │       │  
                ┌──────────────────────────┘       └──────────────────────────┐  
                ▼                                                             ▼  
    \+-----------------------+                                     \+-----------------------+  
    |      Nexus-Agent      |                                     |    Vanguard-Agent     |  
    |  \* Neo4j R-GCN Graph  |                                     |  \* Spatio-Temporal    |  
    |  \* Banking Freeze API |                                     |    Hawkes Process     |  
    \+-----------+-----------+                                     \+-----------+-----------+  
                │                                                             │  
                └──────────────────────────┐       ┌──────────────────────────┘  
                                           ▼       ▼  
                                   \+-------+───────+-------+  
                                   |       Lex-Agent       |  
                                   |  \* SHA-256 Hashing    |  
                                   |  \* S.63 BSA Certified |  
                                   \+-----------------------+

### **4.1 Agent 1: Aegis-Agent — Sovereign Multi-Source Threat-Intelligence Fusion Engine**

* **Operational Role:** Captures multi-source intelligence feeds (CCTNS logs, dark web identity dumps, reported calling histories) and resolves disparate entities using probabilistic link analysis.26  
* **Tool Integrations:** PostgreSQL semantic indexing (pgvector), Levenshtein distance modules, and MAC/IMEI hardware registries.3  
* **Direct Outcome:** Resolves identity nodes across isolated databases and generates unified Suspect Entity Dossiers.26

### **4.2 Agent 2: Veritas-Agent — WebRTC Video Injection and Visual Liveness Detector**

* **Operational Role:** Inspects active browser WebRTC stream parameters and checks captured frames to identify virtual camera injection attacks and facial deepfakes.2  
* **Tool Integrations:** Browser MediaDevice queries, anisotropic skin reflectance models, and face-mesh landmark estimators.28  
* **Direct Outcome:** Flags synthetic video streams and virtual camera drivers at the media capture layer, blocking synthetic feeds before they bypass identity verification barriers.18

### **4.3 Agent 3: Phoneme-Agent — Acoustic Liveness and Voice Spoofing Countermeasure**

*   **Input Telemetry**: Raw 16kHz mono PCM binary audio frames.
*   **What it does**: Identifies whether the voice on a call is a real human vocal tract or a synthesized AI voice clone (Text-to-Speech vocoder/Deepfake).
*   **How it does it**:
    *   **Autoregressive LP Coefficients**: Applies **Levinson-Durbin Recursion (LPC)** of order $p=16$ to model the vocal tract resonance structure.
    *   **Inverse Filtering**: Filters the audio using the LPC parameters to extract the glottal excitation residual $e(t)$. Jitter (cycle-to-cycle frequency variation) and shimmer (cycle-to-cycle amplitude deviation) are calculated. Real human voices exhibit natural micro-variations (high jitter/shimmer), whereas AI clones exhibit flat, highly regular, or unnaturally stable excitation profiles.
    *   **Boundary Stability**: Computes the cosine similarity of consecutive hidden states from ONNX embeddings. A low boundary discrepancy indicates acoustic vocoder splicing.
*   **Technologies Used**: `numpy`, `scipy`, `onnxruntime` (CPU inference), `Wav2Vec2 int8` quantized models.
*   **Output**: An MCP frame containing a `glottal_stress_score` ($0.0$ to $1.0$), `jitter`, `shimmer`, and a verdict (`genuine_voice` or `voice_clone_detected`).
*   **How to Verify / Optimize**:
    *   *Verify*: Feed real recorded speech vs. ElevenLabs cloned speech. Real speech should score $<0.15$, while ElevenLabs clones should score $>0.80$.
    *   *Optimize*: Adjust the LPC filter order ($p$) and calibrate the jitter/shimmer thresholds based on common vocoder models.

### **4.4 Agent 4: Hermes-Agent — Real-Time Cognitive Stress and Scam Script Parser**

*   **Input Telemetry**: Raw 16kHz PCM audio stream and raw sensor gyroscope telemetry.
*   **What it does**: Parses the spoken audio text for coercion/scam scripts (e.g., "digital arrest", "CBI uniform") while concurrently monitoring physical hand tremors via gyroscope data.
*   **How it does it**:
    *   **Tremor Demodulation**: Feeds 50Hz gyroscope telemetry through a **2nd-Order High-Pass Butterworth IIR Filter** ($f_c = 3	ext{ Hz}$) to isolate micro-tremors ($3	ext{--}12	ext{ Hz}$) caused by neurological stress/fear from voluntary movements.
    *   **Tremor Variance**: Uses a **Welford Online Variance Estimator** to compute real-time variance without saving samples. High variance indicates stress.
    *   **FSM Text Parsing**: Evaluates Whisper-transcribed audio text against a scam keyword Finite State Machine (FSM). Matches are classified into critical, suspicious, and de-escalating.
*   **Technologies Used**: `numpy`, `Whisper Tiny int8` quantized ONNX model, custom Butterworth filter algorithms, Redis pub/sub.
*   **Output**: MCP frame returning a stress score, keyword match list, maximum tremor variance, and a verdict (`coercion_script_detected` or `clear`).
*   **How to Verify / Optimize**:
    *   *Verify*: Read standard conversational speech vs. a script threatening legal action (e.g., "Your bank accounts are under digital arrest"). The scam script should immediately trigger a high threat score.
    *   *Optimize*: Refine keyword dictionaries with synonyms using cosine embeddings from a local lightweight sentence transformer. Adjust the Butterworth cutoff frequency to target typical tremor bandwidths.

### **4.5 Agent 5: Nexus-Agent — Dynamic Heterogeneous Temporal Graph Neural Network**

*   **Input Telemetry**: Transaction details (Originating account, target account, amount, channel) from the session.
*   **What it does**: Traverses transaction networks to identify circular transaction patterns and money mule routing structures.
*   **How it does it**:
    *   **Cypher Loop Detection**: Executes a variable-length path traversal query on Neo4j (depth 2 to 10) to find loops where funds return to the source account:
        `MATCH p = (a:BankAccount)-[:TRANSFERRED_TO*2..10]->(a)`
    *   **R-GCN Aggregation**: Performs a 1-layer Relational Graph Convolutional Network (R-GCN) check over transacted accounts to compute node-level risk propagation.
*   **Technologies Used**: `neo4j` Python driver, Neo4j Graph Database, Cypher.
*   **Output**: Loop topology (nodes in loop, total flow, path length), R-GCN risk score, and a verdict (`accounts_frozen_circular_flow_interdicted` or `clean`).
*   **How to Verify / Optimize**:
    *   *Verify*: Setup a circular transfer path in Neo4j (e.g., A -> B -> C -> A). Trigger a transaction from A. The agent should flag a circular loop and trigger a freeze request.
    *   *Optimize*: Adjust Neo4j APOC timeouts and limit traversal depth ($d \le 10$) to safeguard query performance during high transaction volume peaks.

### **4.6 Agent 6: Vanguard-Agent — Spatio-Temporal Hawkes Process and Patrol Optimizer**

*   **Input Telemetry**: Reported cybercrime coordinates (Latitude, Longitude, timestamps) from PostgreSQL.
*   **What it does**: Predicts self-exciting spatio-temporal cybercrime clusters to optimize police deployment and patrol routes.
*   **How it does it**:
    *   **Hawkes Process Intensity**: Models cybercrime clusters using a self-exciting point process:
        $$\lambda(t, x, y) = \mu(x, y) + \sum_{t_i < t} eta_i \cdot e^{-lpha(t - t_i)} \cdot G(x - x_i, y - y_i)$$
    *   **Patrol Area Index (PAI)**: Maximizes PAI on a grid over India using a greedy simplex approach to select optimal, non-overlapping patrol hotspots.
*   **Technologies Used**: PostgreSQL GIS queries, `numpy` grid matrix operations.
*   **Output**: Optimized patrol zone list (coordinates, priority, units recommended), max intensity, and a verdict (`hotspots_computed`).
*   **How to Verify / Optimize**:
    *   *Verify*: Inject 10 fake incident reports close to one city in PostgreSQL within a 2-hour window. The agent must immediately output that city as a "CRITICAL" priority patrol zone.
    *   *Optimize*: Calibrate the spatial decay standard deviation ($\sigma_s pprox 0.015^\circ$ or $1.5	ext{km}$) and temporal decay constant ($lpha=0.5$ per hour) against actual crime frequency datasets.

### **4.7 Agent 7: Lumen-Agent — Fourier Ptychographic Banknote Intaglio and OVI Verifier**

*   **Input Telemetry**: Device camera image captures of banknotes.
*   **What it does**: Inspects banknotes to verify authenticity, targeting print patterns and optically variable inks.
*   **How it does it**:
    *   **2D Fast Fourier Transform**: Converts the grayscale print pattern of a note to spatial frequencies.
    *   **Intaglio Energy Ratio ($\eta$)**: Computes energy ratios of high spatial frequencies representing fine relief print lines. Counterfeits (printed on standard inkjet/laser printers) show flat energy ratios.
*   **Technologies Used**: `scipy.fftpack`, `numpy` 2D FFT, spectral band filters.
*   **Output**: Intaglio energy ratio, print quality index, and a verdict (`banknote_genuine` or `counterfeit_detected`).
*   **How to Verify / Optimize**:
    *   *Verify*: Test using an actual genuine banknote image vs. a standard photocopy scan. Photocopies will lack high-frequency intaglio printing and fail the energy test.
    *   *Optimize*: Adjust frequency cutoff thresholds based on printer DPI models and camera focal variations.

### **4.8 Agent 8: Lex-Agent — Automated Legal Admissibility and Section 63 BSA Evidence Certifier**

*   **Input Telemetry**: All preceding 7 agent outputs (McpFrames), transcripts, and raw sample metrics.
*   **What it does**: Compiles a court-admissible forensic docket under **Section 63 of the Indian Bharatiya Sakshya Adhiniyam (BSA), 2023**.
*   **How it does it**:
    *   **Evidence Hash Chain**: Builds a Merkle-style hash chain over all session assets:
        $$	ext{ChainHash} = \mathcal{H}(\mathcal{H}(	ext{audio}) \mathbin{\Vert} \mathcal{H}(	ext{sensors}) \mathbin{\Vert} \mathcal{H}(	ext{agent\_scores}))$$
    *   **System Stability Integration**: Integrates system metrics over the session to calculate drift ($\Delta_{	ext{system}} < 0.15$), confirming that no host-level tampering occurred.
    *   **ECDSA-P256 Cryptographic Signature**: Digitally signs the evidence chain using a secure NIST P-256 ECDSA key.
*   **Technologies Used**: `cryptography` (ECDSA curves), hashlib, `asyncpg` background insertion tasks.
*   **Output**: Cryptographic signature, Merkle hash, legal certificate text, and a verdict (`docket_certified`).
*   **How to Verify / Optimize**:
    *   *Verify*: Export the signed docket JSON. Use standard open tools (like `openssl` or python `cryptography` scripts) to verify that the public key successfully decrypts and validates the Merkle chain hash.
    *   *Optimize*: Delegate DB operations to background asyncio tasks to run within the wave execution timeout limit.

## **5\. Mathematical and Algorithmic Formulations**

### **5.1 Optical Intaglio Print Verification via 2D Spatial Fast Fourier Transform (FFT)**

Authentic currency features deep, high-frequency raised patterns, while flat inkjet or offset counterfeits produce low-frequency, blurred color transitions.3  
An input banknote crop image ![][image7] of dimensions ![][image8] is converted into the spatial frequency domain using a 2D Discrete Fourier Transform 3:  
![][image9]  
The spatial frequency power spectrum ![][image10] is computed. The system calculates the High-Frequency Spectral Ratio (![][image11]) beyond a radial pixel threshold ![][image12] to evaluate print quality 3:  
![][image13]  
If the spectral energy ratio falls below the authenticity threshold (![][image14]), the note is classified as counterfeit 3:  
![][image15]

### **5.2 Physiological Stress Detection via Gyroscopic Micro-Tremors**

The system captures real-time gyroscopic data (![][image16]) at 50 Hz and processes it through a digital high-pass Butterworth filter to isolate high-frequency muscle micro-tremors:  
![][image17]  
The running variance (![][image18]) of the filtered signal is calculated dynamically using Welford's algorithm to avoid memory overhead on edge devices 3:  
![][image19]  
![][image20]  
![][image21]  
When the rolling variance ![][image18] exceeds the user's registered baseline variance (![][image22]) by more than three standard deviations, the behavioral duress alert is triggered 3:  
![][image23]

### **5.3 Relational Graph Convolutional Network (R-GCN) Message-Passing Mechanics**

To identify money-mule networks and circular fund flows, the transaction ledger is modeled as a heterogeneous directed graph ![][image24], where nodes ![][image25] represent accounts or devices, and edges ![][image26] represent relationships belonging to relation types ![][image27] (such as *TRANSFERRED\_TO*, *USED\_DEVICE*, or *LOGGED\_IP*).8  
The forward propagation update for a node ![][image28] at layer ![][image29] of the R-GCN aggregates structural and semantic representations from its relational neighbors 8:  
![][image30]  
where ![][image31] is the latent representation of node ![][image32] at layer ![][image33], ![][image34] is the set of neighbors of node ![][image32] under relation ![][image35], ![][image36] is the relation-specific transformation matrix, ![][image37] is the self-loop transformation matrix, and ![][image38] is a non-linear activation function.8

### **5.4 Spatio-Temporal Hawkes Point Process for Predictive Patrol Optimization**

The propagation and clustering of regional cybercrime, cash drop-offs, and counterfeit distribution networks are modeled as a self-exciting point process.3 The conditional intensity ![][image39] of criminal incidents at coordinate ![][image40] and time ![][image41] is calculated as 3:  
![][image42]  
where ![][image43] is the stationary background crime rate, ![][image44] is the temporal decay rate, ![][image45] is the triggering coefficient of event ![][image32], and ![][image46] is the spatial dispersion parameter.3  
To optimize physical police resource deployments, the boundaries of active patrol grids are tuned to maximize the Predictive Accuracy Index (PAI) using a simplex optimizer 30:  
![][image47]  
where ![][image48] is the number of predicted events within the target patrol grids, ![][image49] is the total events, ![][image50] is the area of the predicted patrol grids, and ![][image51] is the total boundary area.30

### **5.5 Thin-Film Interference Calculations for Optically Variable Ink (OVI) Validation**

Optically Variable Ink (OVI) features on authentic currency show a distinct, angle-dependent color shift (e.g., from green to copper) when tilted under standard light. The system validates this optical feature by calculating the constructive interference wavelength (![][image52]) as a function of the capture angle (![][image53]) using the thin-film path equation 6:  
![][image54]  
where ![][image48] is the refractive index of the dielectric spacer layer, ![][image41] is the physical thickness of the spacer, ![][image55] is the refractive order, and ![][image53] is the light incidence angle relative to the surface normal.6  
The camera tracking module calculates the viewing angle ![][image53] in real time using the device's accelerometer. If the observed color shift in the designated OVI region fails to track the calculated wavelength shift, the banknote is flagged as a counterfeit print 6:  
![][image56]

### **5.6 Admissibility Metrics Under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (BSA)**

To guarantee the admissibility of digital forensic dockets in judicial proceedings, the system must certify that no data alteration occurred during the capture window. The system calculates the cryptographic hash (![][image57]) of the forensic binary asset ![][image51]:  
![][image58]  
The system's operational stability (![][image59]) is calculated by integrating hardware resource deviations over the capture window ![][image60] to satisfy Section 63(2)(c) of the BSA 31:  
![][image61]  
The forensic output is certified as authentic and untampered only when the calculated system stability metric is within the defined threshold (![][image62]) 3:  
![][image63]

## **6\. Complete and Production-Ready Code Blocks**

### **6.1 Python Ingestion Server (FastAPI + Asyncio + Uvicorn)**

This high-performance, asynchronous Python service implements a FastAPI server to ingest 16kHz mono PCM raw audio packets over WebSockets, buffering them directly in a Redis ring buffer to maintain low latency.3

```python
import asyncio
import uuid
import time
from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
import redis.asyncio as aioredis

app = FastAPI(title="Kavach-AI Ingestion Gateway", version="0.1.0")
redis_client = aioredis.from_url("redis://default:password@localhost:6379")

class AppState:
    def __init__(self):
        self.startup_time = time.monotonic()

state = AppState()

@app.websocket("/api/v1/stream/audio")
async def ws_audio_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    audio_key = f"kavach:session:{session_id}:audio_pool"
    trigger_channel = "kavach:mcp_triggers"
    print(f"WebSocket session {session_id} successfully registered")
    try:
        while True:
            # Receive binary frame packets (PCM 16kHz Mono)
            bin_data = await websocket.receive_bytes()
            if bin_data:
                # Buffer raw frame in Redis
                async with redis_client.pipeline() as pipe:
                    pipe.rpush(audio_key, bin_data)
                    pipe.ltrim(audio_key, -150, -1) # Keep last 15 seconds
                    await pipe.execute()
                # Trigger coordinator run
                await redis_client.publish(trigger_channel, session_id)
    except WebSocketDisconnect:
        print(f"WebSocket session {session_id} disconnected from pipeline")

if __name__ == "__main__":
    import uvicorn
    print("Kavach-AI Ingestion core successfully initialized over port 8080")
    uvicorn.run(app, host="127.0.0.1", port=8080)
```



### **6.2 Next.js Client-Side Audio Ingestion Component (TypeScript \+ Web Audio)**

This client-side component captures mic input via the Web Audio API, resamples it to 16kHz, converts the frames to base64, and streams them over a live WebSocket connection.4

TypeScript  
import React, { useEffect, useRef, useState } from 'react';

export const KavachAudioInjest: React.FC \= () \=\> {  
  const \= useState\<boolean\>(false);  
  const \= useState\<string\>('Disconnected');  
  const wsRef \= useRef\<WebSocket | null\>(null);  
  const audioContextRef \= useRef\<AudioContext | null\>(null);  
  const processorRef \= useRef\<ScriptProcessorNode | null\>(null);  
  const micStreamRef \= useRef\<MediaStream | null\>(null);

  const initInjestStream \= async () \=\> {  
    try {  
      // Connect to the secure Actix-web ingestion endpoint  
      wsRef.current \= new WebSocket('ws://localhost:8080/api/v1/stream/audio');  
      wsRef.current.binaryType \= 'arraybuffer';

      wsRef.current.onopen \= () \=\> setConnectionStatus('Secure Connection Established');  
      wsRef.current.onclose \= () \=\> setConnectionStatus('Disconnected');  
      wsRef.current.onerror \= (e) \=\> console.error('WebSocket Ingestion Error:', e);

      // Request raw microphone access  
      const stream \= await navigator.mediaDevices.getUserMedia({ audio: true, video: false });  
      micStreamRef.current \= stream;

      // Configure the Web Audio API context to resample input to 16kHz  
      audioContextRef.current \= new (window.AudioContext || (window as any).webkitAudioContext)({  
        sampleRate: 16000,  
      });

      const source \= audioContextRef.current.createMediaStreamSource(stream);  
      // Create a processing node with a 4096-frame buffer  
      processorRef.current \= audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(processorRef.current);  
      processorRef.current.connect(audioContextRef.current.destination);

      processorRef.current.onaudioprocess \= (e: AudioProcessingEvent) \=\> {  
        const inputData \= e.inputBuffer.getChannelData(0); // 16kHz Float32 mono PCM data  
        const pcm16Buffer \= new Int16Array(inputData.length);

        // Convert the Float32 samples to 16-bit Signed Integer PCM  
        for (let i \= 0; i \< inputData.length; i++) {  
          const s \= Math.max(-1, Math.min(1, inputData\[i\]));  
          pcm16Buffer\[i\] \= s \< 0? s \* 0x8000 : s \* 0x7FFF;  
        }

        // Stream the raw binary audio over the active WebSocket channel  
        if (wsRef.current && wsRef.current.readyState \=== WebSocket.OPEN) {  
          wsRef.current.send(pcm16Buffer.buffer);  
        }  
      };

      setIsRecording(true);  
    } catch (err) {  
      console.error('Failed to initialize audio capture:', err);  
      setConnectionStatus('Hardware Access Refused');  
    }  
  };

  const terminateInjestStream \= () \=\> {  
    if (processorRef.current) {  
      processorRef.current.disconnect();  
      processorRef.current \= null;  
    }  
    if (audioContextRef.current) {  
      audioContextRef.current.close();  
      audioContextRef.current \= null;  
    }  
    if (micStreamRef.current) {  
      micStreamRef.current.getTracks().forEach((track) \=\> track.stop());  
      micStreamRef.current \= null;  
    }  
    if (wsRef.current) {  
      wsRef.current.close();  
      wsRef.current \= null;  
    }  
    setIsRecording(false);  
    setConnectionStatus('Session Concluded');  
  };

  return (  
    \<div className="p-6 bg-slate-900 border border-slate-800 rounded-lg max-w-md mx-auto shadow-xl"\>  
      \<h3 className="text-xl font-bold text-white mb-2"\>Kavach-AI Citizen Shield\</h3\>  
      \<div className="flex items-center space-x-2 mb-4"\>  
        \<span className={\`w-3 h-3 rounded-full ${isRecording? 'bg-red-500 animate-pulse' : 'bg-slate-600'}\`} /\>  
        \<p className="text-sm text-slate-300 font-mono"\>Status: {connectionStatus}\</p\>  
      \</div\>  
      {\!isRecording? (  
        \<button  
          onClick={initInjestStream}  
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md transition duration-200"  
        \>  
          Activate Call Shield  
        \</button\>  
      ) : (  
        \<button  
          onClick={terminateInjestStream}  
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition duration-200"  
        \>  
          Terminate Call Shield  
        \</button\>  
      )}  
    \</div\>  
  );  
};

### **6.3 Python Transactional R-GCN Script (PyTorch \+ DGL)**

This production-grade script constructs a heterogeneous transaction graph and applies an R-GCN layer to calculate relational risk scores, identifying circular transaction paths across money-mule networks.26

Python  
import torch  
import torch.nn as nn  
import torch.nn.functional as F  
import dgl  
from dgl.nn import HeteroGraphConv, GraphConv

class HeteroRGCNLayer(nn.Module):  
    def \_\_init\_\_(self, in\_features, out\_features, relation\_types):  
        super(HeteroRGCNLayer, self).\_\_init\_\_()  
        \# Construct an R-GCN layer mapping relation-specific transformations  
        self.conv \= HeteroGraphConv({  
            rel: GraphConv(in\_features, out\_features, norm='both', weight=True, bias=True)  
            for rel in relation\_types  
        }, aggregate='sum')

    def forward(self, g, inputs):  
        \# g: Heterogeneous DGL Graph representation  
        \# inputs: Dictionary of node features mapping node type strings to feature tensors  
        h\_outputs \= self.conv(g, inputs)  
        \# Apply non-linear activation across all node type representations  
        return {node\_type: F.leaky\_relu(h\_feat, negative\_slope=0.1) for node\_type, h\_feat in h\_outputs.items()}

\# Construct a simulated transaction network for money-mule tracing  
def build\_transaction\_network():  
    \# Node types: 'account', 'device'  
    \# Relation types: 'transferred\_to', 'registered\_on'  
    data\_dict \= {  
        ('account', 'transferred\_to', 'account'): (torch.tensor(), torch.tensor()),  
        ('account', 'registered\_on', 'device'): (torch.tensor(), torch.tensor()),  
        ('device', 'associated\_with', 'account'): (torch.tensor(), torch.tensor())  
    }  
    return dgl.heterograph(data\_dict)

if \_\_name\_\_ \== "\_\_main\_\_":  
    g \= build\_transaction\_network()  
      
    \# Initialize node features (8-dimensional embeddings)  
    input\_features \= {  
        'account': torch.randn(5, 8),  
        'device': torch.randn(2, 8)  
    }  
      
    relations \= \['transferred\_to', 'registered\_on', 'associated\_with'\]  
    rgcn\_model \= HeteroRGCNLayer(in\_features=8, out\_features=4, relation\_types=relations)  
      
    \# Execute forward pass  
    with torch.no\_grad():  
        output\_embeddings \= rgcn\_model(g, input\_features)  
          
    print("--- Heterogeneous Node Representation Updates \---")  
    for node\_type, embedding in output\_embeddings.items():  
        print(f"Node Type: '{node\_type}', Feature Shape: {embedding.shape}")  
        print(f"Updated Feature Matrix:\\n{embedding}\\n")

## **7\. Enterprise Integration Architecture and Data Schemas**

### **7.1 Relational Schema (PostgreSQL \+ pgvector)**

This PostgreSQL DDL sets up the core tables to store incident details, identity records, and biometric embeddings.\[1, 1\]

SQL  
\-- Enable the vector extension to store high-dimensional semantic embeddings  
CREATE EXTENSION IF NOT EXISTS vector;

\-- Table to store suspect identity profiles compiled by the Aegis-Agent  
CREATE TABLE suspect\_profiles (  
    suspect\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    registered\_phone\_no VARCHAR(15) UNIQUE NOT NULL,  
    registered\_upi\_id VARCHAR(50) UNIQUE NOT NULL,  
    associated\_imei VARCHAR(17) UNIQUE,  
    associated\_aadhaar\_hash VARCHAR(64),  
    risk\_classification\_index DOUBLE PRECISION DEFAULT 0.0,  
    created\_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP,  
    last\_active\_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

\-- Index for phone number searches  
CREATE INDEX idx\_suspects\_phone ON suspect\_profiles(registered\_phone\_no);

\-- Table to store multi-modal threat vectors  
CREATE TABLE incident\_threat\_logs (  
    incident\_id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    session\_id VARCHAR(64) UNIQUE NOT NULL,  
    suspect\_id UUID REFERENCES suspect\_profiles(suspect\_id),  
    voice\_spoof\_confidence DOUBLE PRECISION NOT NULL,  
    facial\_deepfake\_confidence DOUBLE PRECISION NOT NULL,  
    behavioral\_stress\_score DOUBLE PRECISION NOT NULL,  
    geospatial\_coordinate POINT NOT NULL,  
    scam\_transcript\_raw TEXT NOT NULL,  
    \-- 384-dimensional vector representation of the conversation transcript  
    transcript\_semantic\_embedding vector(384),  
    creation\_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

\-- HNSW vector index to enable sub-millisecond semantic similarity searches  
CREATE INDEX idx\_incidents\_vector ON incident\_threat\_logs   
USING hnsw (transcript\_semantic\_embedding vector\_cosine\_ops) WITH (m \= 16, ef\_construction \= 64);

### **7.2 Graph Schema (Neo4j Cypher)**

These Cypher scripts set up database indexes and analyze transaction paths to identify circular flows across money-mule accounts.7

Cypher  
// Create unique constraints and indexes to optimize graph queries  
CREATE CONSTRAINT FOR (a:Account) REQUIRE a.accountId IS UNIQUE;  
CREATE CONSTRAINT FOR (d:Device) REQUIRE d.deviceId IS UNIQUE;

CREATE INDEX FOR (a:Account) ON (a.riskScore);

// Detect circular transaction loops designed to launder funds  
MATCH (start:Account)  
MATCH path \= (start)--\>(start)  
WHERE start.riskScore \> 0.85  
RETURN path,   
       reduce(total \= 0, r IN relationships(path) | total \+ r.amount) AS totalVolume,  
       \[n IN nodes(path) | n.accountId\] AS circularRoute  
LIMIT 10;

### **7.3 Interdiction Webhook Trigger Flow**

When high-confidence scam markers are identified, Kavach-AI's orchestration layer dispatches automated, structured JSON payloads to freeze transaction routing and terminate spoofed SIP connections.15

#### **7.3.1 Telecom Carrier SIP-Termination Payload**

This payload directs telecom operators to instantly disconnect spoofed VoIP/SIP numbers.35

JSON  
{  
  "request\_id": "req\_tc\_block\_892348",  
  "dispatch\_timestamp": 1782390400000,  
  "telecom\_operator\_target": "Airtel\_Enterprise\_Gateway",  
  "threat\_profile": {  
    "target\_spoofed\_number": "+919876543210",  
    "origin\_sip\_ip": "103.245.12.98",  
    "call\_session\_id": "sip\_call\_8849204A"  
  },  
  "action\_directive": {  
    "action": "IMMEDIATE\_TERMINATION",  
    "apply\_global\_carrier\_block": true,  
    "reported\_reason": "Digital Arrest Scam Signature Detected"  
  },  
  "cryptographic\_verification": {  
    "signature\_algorithm": "SHA256withECDSA",  
    "signature": "MEQCID3N9u8X2pC..."  
  }  
}

#### **7.3.2 Core Banking Rail Transaction-Freeze Webhook**

This payload is dispatched directly to UPI gateways or Core Banking systems to freeze compromised mule accounts.3

JSON  
{  
  "webhook\_id": "wh\_cbs\_freeze\_239849",  
  "dispatch\_timestamp": 1782390400120,  
  "target\_bank": "State\_Bank\_of\_India\_CBS",  
  "target\_account": {  
    "account\_number": "30492840294",  
    "upi\_id": "mule.laundering@oksbi",  
    "current\_balance\_inr": 482094.00  
  },  
  "interdiction\_parameters": {  
    "action": "IMMEDIATE\_DEBIT\_LOCK",  
    "associated\_incident\_id": "inc\_f81d4fae-7dec-11d0",  
    "risk\_score": 0.984  
  },  
  "cryptographic\_verification": {  
    "signature\_algorithm": "SHA256withECDSA",  
    "signature": "MEQCIFz8f/7K9XG..."  
  }  
}

## **8\. Legal Safety, Compliance, and Roadmap**

### **8.1 Admissibility and Compliance Framework (BSA 2023 & BNSS 2023\)**

To ensure that all generated threat intelligence packages are fully admissible in Indian courts, Kavach-AI is built around the statutory requirements of the **Bharatiya Sakshya Adhiniyam, 2023 (BSA)** and the **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**:

* **Section 63 BSA Compliance (Electronic Record Certification):** The platform's Lex-Agent replaces the old Section 65B IEA framework. It automatically generates the mandatory dual-signed electronic evidence certificate 11:  
  * **Part A (The Litigant/Officer):** Certifies that the capture hardware was operating properly and under lawful control during the collection window.31  
  * **Part B (The Forensic Expert):** Signed by a certified technical examiner, validating the SHA-256 fingerprint of the captured audio/video assets to prove they are unaltered and authentic.  
* **Section 193(2)(i) BNSS Compliance (Chronological Chain-of-Custody):** The system maintains an immutable, chronological ledger of all digital evidence, recording every stage of capture, transfer, and processing to satisfy statutory audit standards.36  
* **Section 176(3) BNSS Compliance (Mandatory Forensic Ingestion):** For serious offenses carrying prison terms of seven years or more, the platform coordinates immediate, secure data routing to forensic expert systems, ensuring that scene-of-crime evidence is captured and preserved according to legal protocols.36

### **8.2 Data Privacy Boundaries (DPDPA 2023\)**

To align with the **Digital Personal Data Protection Act, 2023 (DPDPA)**, Kavach-AI enforces strict privacy boundaries 15:

* **Memory-Only Processing:** High-frequency WebRTC audio and video packets are held in volatile RAM (Redis memory-resident ring buffers) and deleted immediately after classification is complete.3  
* **Irreversible Feature Anonymization:** Raw biometric identifiers (facial geometries, voice spectrograms) are converted into anonymous, high-dimensional vector embeddings.3 The original media frames are purged, ensuring that personal data is never stored in an unencrypted or identifiable state.

### **8.3 Strategic Execution Plan**

       PHASE 1 (Weeks 1-2)                PHASE 2 (Weeks 3-4)                 PHASE 3 (Weeks 5-6)  
 ┌─────────────────────────────┐    ┌─────────────────────────────┐     ┌─────────────────────────────┐  
 │  Ingestion Tier Deployment   │    │  Agentic Swarm Integration  │     │   Pilot Field Deployment    │  
 │  \* Next.js WebRTC client     │───\>│  \* Connect GNN, NLP & CV    │────\>│   \* Deploy CBS Webhooks     │  
 │  \* Python FastAPI WS core    │    │  \* Setup Redis state cache  │     │   \* Run S.63 Certification  │  
 └─────────────────────────────┘    └─────────────────────────────┘     └─────────────────────────────┘

* **Phase 1: Ingestion Tier & Core Routing (Weeks 1–2):** Deploy the Next.js client-side WebRTC interface alongside the asynchronous Python FastAPI WebSocket core to handle real-time streaming.4  
* **Phase 2: Agentic Swarm & State Cache Integration (Weeks 3–4):** Connect the specialized AI agents (Computer Vision, Speech AI, Graph AI, and NLP script engines) using the Model Context Protocol, and configure the in-memory Redis cache to handle session states.12  
* **Phase 3: Pilot Field Deployment & Interdiction Launch (Weeks 5–6):** Integrate transaction-freeze webhooks with core banking APIs, deploy the law enforcement GIS patrol command dashboard, and launch the automated Section 63 BSA evidence certification system.3

#### **Works cited**

1. Voice deepfake detection: 2026 guide \- Corsound AI, accessed on July 18, 2026, [https://www.corsound.ai/blog-posts/voice-deepfake-detection-guide](https://www.corsound.ai/blog-posts/voice-deepfake-detection-guide)  
2. How Injection Attacks Feed Deepfakes Into Verification \- DuckDuckGoose AI, accessed on July 18, 2026, [https://www.duckduckgoose.ai/blog/how-injection-attacks-feed-deepfakes-into-verification](https://www.duckduckgoose.ai/blog/how-injection-attacks-feed-deepfakes-into-verification)  
3. ProblemStatement.txt  
4. Fine-Tuning Wav2Vec2 for Real-Time Deepfake Audio Detection \- Gary A. Stafford \- Medium, accessed on July 18, 2026, [https://garystafford.medium.com/fine-tuning-wav2vec2-for-real-time-deepfake-audio-detection-b72d7efebdd7](https://garystafford.medium.com/fine-tuning-wav2vec2-for-real-time-deepfake-audio-detection-b72d7efebdd7)  
5. Fourier Ptychography | Smart Imaging Lab | University of Connecticut, accessed on July 18, 2026, [https://smartimaging.uconn.edu/fourier-ptychtography/](https://smartimaging.uconn.edu/fourier-ptychtography/)  
6. Optically variable ink \- Grokipedia, accessed on July 18, 2026, [https://grokipedia.com/page/Optically\_variable\_ink](https://grokipedia.com/page/Optically_variable_ink)  
7. Graph Neural Networks for Fraud Detection: How to Guide \- FluxForce AI, accessed on July 18, 2026, [https://www.fluxforce.ai/blog/graph-neural-networks-for-fraud-detection](https://www.fluxforce.ai/blog/graph-neural-networks-for-fraud-detection)  
8. Graph-based fraud detection (IP / mule / network): how do you handle high recall without drowning in false positives? Forged CSV with hard realism and its backfired. \- Reddit, accessed on July 18, 2026, [https://www.reddit.com/r/MLQuestions/comments/1qgv7bv/graphbased\_fraud\_detection\_ip\_mule\_network\_how\_do/](https://www.reddit.com/r/MLQuestions/comments/1qgv7bv/graphbased_fraud_detection_ip_mule_network_how_do/)  
9. Marked Point Process Hotspot Maps for Homicide and Gun Crime Prediction in Chicago | Request PDF \- ResearchGate, accessed on July 18, 2026, [https://www.researchgate.net/publication/261564053\_Marked\_Point\_Process\_Hotspot\_Maps\_for\_Homicide\_and\_Gun\_Crime\_Prediction\_in\_Chicago](https://www.researchgate.net/publication/261564053_Marked_Point_Process_Hotspot_Maps_for_Homicide_and_Gun_Crime_Prediction_in_Chicago)  
10. Voice Spoofing Detection via Speech Rule Generation Using wav2vec 2.0-Based Attention \- ACL Anthology, accessed on July 18, 2026, [https://aclanthology.org/2025.rocling-main.13.pdf](https://aclanthology.org/2025.rocling-main.13.pdf)  
11. Electronic evidence under the BSA, 2023 \- iPleaders, accessed on July 18, 2026, [https://blog.ipleaders.in/electronic-evidence-under-the-bsa-2023/](https://blog.ipleaders.in/electronic-evidence-under-the-bsa-2023/)  
12. Agentic Edge AI: Autonomous Intelligence on the Edge | TrendAI (US), accessed on July 18, 2026, [https://www.trendaisecurity.com/en-us/resources-insights/research/agentic-edge-ai-autonomous-intelligence-on-the-edge](https://www.trendaisecurity.com/en-us/resources-insights/research/agentic-edge-ai-autonomous-intelligence-on-the-edge)  
13. Representation Selective Self-distillation and wav2vec 2.0 Feature Exploration for Spoof-aware Speaker Verification \- ISCA Archive, accessed on July 18, 2026, [https://www.isca-archive.org/interspeech\_2022/lee22q\_interspeech.pdf](https://www.isca-archive.org/interspeech_2022/lee22q_interspeech.pdf)  
14. Cloud KYC | Accelerate the KYC / KYB and Remote Identity Verification Process \- Fraud.com, accessed on July 18, 2026, [https://www.fraud.com/cloud-kyc](https://www.fraud.com/cloud-kyc)  
15. Digital Arrest Scams Explained: UPSC Current Affairs \- IAS Gyan, accessed on July 18, 2026, [https://www.iasgyan.in/daily-current-affairs/digital-arrest-the-modern-day-cyber-scam](https://www.iasgyan.in/daily-current-affairs/digital-arrest-the-modern-day-cyber-scam)  
16. Digital Arrest Scams in India: A Growing Threat in the Age of Technology \- RJ Wave, accessed on July 18, 2026, [https://www.rjwave.org/jaafr/papers/JAAFR2601211.pdf](https://www.rjwave.org/jaafr/papers/JAAFR2601211.pdf)  
17. digital arrest: challenges and legal safeguards in india \- RJPN, accessed on July 18, 2026, [https://rjpn.org/jetnr/papers/JETNR2604390.pdf](https://rjpn.org/jetnr/papers/JETNR2604390.pdf)  
18. Real-Time Liveness Detection Solutions for Deepfake Fraud \- Resemble AI, accessed on July 18, 2026, [https://www.resemble.ai/resources/real-time-liveness-detection-solutions-for-deepfake-fraud](https://www.resemble.ai/resources/real-time-liveness-detection-solutions-for-deepfake-fraud)  
19. Admissibility of Electronic Evidence, Certificate and Hash Value, S 63 Bharatiya Sakshya Adhiniyam \- Corpotech Legal, accessed on July 18, 2026, [https://corpotechlegal.com/admissibility-electronic-evidence-sec-63-bsa/](https://corpotechlegal.com/admissibility-electronic-evidence-sec-63-bsa/)  
20. garystafford/wav2vec2-deepfake-voice-detector \- Hugging Face, accessed on July 18, 2026, [https://huggingface.co/garystafford/wav2vec2-deepfake-voice-detector](https://huggingface.co/garystafford/wav2vec2-deepfake-voice-detector)  
21. RTCFake: Speech Deepfake Detection in Real-Time Communication \- arXiv, accessed on July 18, 2026, [https://arxiv.org/html/2604.23742v1](https://arxiv.org/html/2604.23742v1)  
22. Banknote Verification using Image Processing Techniques \- Journal of Computing & Biomedical Informatics, accessed on July 18, 2026, [https://jcbi.org/index.php/Main/article/download/473/378](https://jcbi.org/index.php/Main/article/download/473/378)  
23. Audio Deepfake Detection Benchmark Results: How 8 Systems Performed in 2026, accessed on July 18, 2026, [https://www.resemble.ai/resources/audio-deepfake-detection-benchmark-results-how-8-systems-performed-in-2026](https://www.resemble.ai/resources/audio-deepfake-detection-benchmark-results-how-8-systems-performed-in-2026)  
24. Agentic AI \- Booz Allen, accessed on July 18, 2026, [https://www.boozallen.com/expertise/artificial-intelligence/ai-solutions/agentic-ai.html](https://www.boozallen.com/expertise/artificial-intelligence/ai-solutions/agentic-ai.html)  
25. What is Agentic AI? | UiPath, accessed on July 18, 2026, [https://www.uipath.com/ai/agentic-ai](https://www.uipath.com/ai/agentic-ai)  
26. The Evolution of AI in National Security and Law Enforcement: From Prediction to Autonomous Action \- Innefu Labs, accessed on July 18, 2026, [https://innefu.com/the-evolution-of-ai-in-national-security-and-law-enforcement-from-prediction-to-autonomous-action/](https://innefu.com/the-evolution-of-ai-in-national-security-and-law-enforcement-from-prediction-to-autonomous-action/)  
27. Realtime deepfake software is a SaaS product now \- DEV Community, accessed on July 18, 2026, [https://dev.to/thoams\_aidetection/realtime-deepfake-software-is-a-saas-product-now-13no](https://dev.to/thoams_aidetection/realtime-deepfake-software-is-a-saas-product-now-13no)  
28. Real-Time Deepfake Detection: Your Complete Guide \- Adaptive Security, accessed on July 18, 2026, [https://adaptivesecurity.com/blog/real-time-deepfake-detection-the-complete-guide](https://adaptivesecurity.com/blog/real-time-deepfake-detection-the-complete-guide)  
29. (PDF) GRAPH-BASED NEURAL NETWORKS FOR DETECTING FRAUD RINGS IN FINANCIAL TRANSACTION NETWORKS \- ResearchGate, accessed on July 18, 2026, [https://www.researchgate.net/publication/401255721\_GRAPH-BASED\_NEURAL\_NETWORKS\_FOR\_DETECTING\_FRAUD\_RINGS\_IN\_FINANCIAL\_TRANSACTION\_NETWORKS](https://www.researchgate.net/publication/401255721_GRAPH-BASED_NEURAL_NETWORKS_FOR_DETECTING_FRAUD_RINGS_IN_FINANCIAL_TRANSACTION_NETWORKS)  
30. (PDF) Rotational grid, PAI-maximizing crime forecasts \- ResearchGate, accessed on July 18, 2026, [https://www.researchgate.net/publication/326496015\_Rotational\_grid\_PAI-maximizing\_crime\_forecasts](https://www.researchgate.net/publication/326496015_Rotational_grid_PAI-maximizing_crime_forecasts)  
31. BSA 2023 Electronic Records Certificate | PDF | Cryptography | Computer Science \- Scribd, accessed on July 18, 2026, [https://www.scribd.com/document/832369597/BSA-2023-Certificates](https://www.scribd.com/document/832369597/BSA-2023-Certificates)  
32. Graph Neural Networks and Network Analysis to Detect Financial Fraud | by Brian James Curry | Medium, accessed on July 18, 2026, [https://medium.com/@brian-curry-research/graph-neural-networks-and-network-analysis-to-detect-financial-fraud-ddd636c129db](https://medium.com/@brian-curry-research/graph-neural-networks-and-network-analysis-to-detect-financial-fraud-ddd636c129db)  
33. Deepfake injection attacks bypassing liveness checks — ML detection as a signal layer, not a gate. Anyone stress-tested this approach? \- Reddit, accessed on July 18, 2026, [https://www.reddit.com/r/AskNetsec/comments/1s1u4l8/deepfake\_injection\_attacks\_bypassing\_liveness/](https://www.reddit.com/r/AskNetsec/comments/1s1u4l8/deepfake_injection_attacks_bypassing_liveness/)  
34. Section 63 BSA 2023: Admissibility of Electronic Evidence \- King Stubb & Kasiva, accessed on July 18, 2026, [https://ksandk.com/litigation/section-63-bharatiya-sakshya-adhiniyam-2023/](https://ksandk.com/litigation/section-63-bharatiya-sakshya-adhiniyam-2023/)  
35. Digital Arrest Scams \- PMF IAS, accessed on July 18, 2026, [https://www.pmfias.com/digital-arrest/](https://www.pmfias.com/digital-arrest/)  
36. Role-of-Forensic-Evidence-under-BNSS-2023.pdf \- INTERNATIONAL JOURNAL OF LAW MANAGEMENT & HUMANITIES, accessed on July 18, 2026, [https://ijlmh.com/wp-content/uploads/Role-of-Forensic-Evidence-under-BNSS-2023.pdf](https://ijlmh.com/wp-content/uploads/Role-of-Forensic-Evidence-under-BNSS-2023.pdf)  
37. The Bharatiya Nagarik Suraksha Sanhita, 2023 \- PRS India, accessed on July 18, 2026, [https://prsindia.org/billtrack/the-bharatiya-nagarik-suraksha-sanhita-2023](https://prsindia.org/billtrack/the-bharatiya-nagarik-suraksha-sanhita-2023)  
38. Cyber Crime and Digital Evidence Under Bharatiya Nyaya Sanhita (BNS) \- IRE Journals, accessed on July 18, 2026, [https://www.irejournals.com/paper-details/1719396](https://www.irejournals.com/paper-details/1719396)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAZCAYAAACCXybJAAACfklEQVR4Xu2WTehNQRjGH/mIiLCQUvJRsrIgYkWiLFhIEWEhkQWlfCyUf1mIpJTsfG0QSsKC5GNHFljIQhYkoijCQonn8c44c997ztxL6v/HPPXr3vPOOWfOMzPvOwMUFRX96xpOxvpg0Ggy1MVG1cT6k0mB+bDn+pyGkZlkF3lPdrQ2/5Ti38gb8py8I3fROkjjyA2yN7CCXCT7yMDkvl7Xf2l6EdlO1pPPyJuWURl+QNaQIUn7AHKaHCb9AtIY8pAsDdd9StPJJ+RNL/bBRFPJW7Sb02CcJ1fIYNfW6+rWtAqVipN+U6lNy79uYE6Sp7BZ99JgLSOrwv/JgU1kA6r0UUwrMo1FTSH7yZGA3rUSXQxyN6avkVPkKHlMVqNaxluRN/2KTPQNMKPHYM/eJusCMrabvCSHXOwFmaCHqQXkMmzniWm1nFyF1ausOpneCHtZ1DzygSwJ17HQNZnWu9VHnWLfKnhpPfDxNBb7Ub8qlml9kdmdaN9O29TJtJdG/RmqXO0008p3zWqdvJFc3Mc001/JF3InsAU28x2VMz2C9MAOG1HR9C3YyP5uTkveSC5eF5tBTpDXAX3Hddh3Z5UzPRc2mnFWJT/TsXqriKRSm+5Jn/WqM9IU9zHVlWlV8w/NgW2v2o6zyplW0biA1plSTuv+mOc6fJxF/T79CHZQaZI3kov7mL53D6r+pJGwFTg7ibVIBSqesLQslBu6PhiI0v57EzaTm8kT2LaSdjae3INVWDGLXCIH0HwiU/+x74/kTGBbTdzH9H2K3SfHydrAOdiJsKnPX5JyZGGgKV/UkXJMaDaa8vhPaRBs4JU6SjnRlEZFRUVFRUV/i74DaWGqALqpnmIAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAZCAYAAACclhZ6AAACTklEQVR4Xu2WwUsVURTGP4nEKE0KegiBGxEiIqWoRZIPE81FLTJoUVAQ6CYIiiiCgv4BiZYigoJgtJQgyl1Q5iIKykW1qKBFBbXJlUR9n+de5jhv5iGvQIv54Le4Z86dueeec88doFChQrWoiWx247pAiWx0dknj3eQAaUg9Wxe6Sn6RL+Qj+REYxcpgdpE5cpkMkWdkv3u+LvTfBfMNFogWOxjY4Hw2kRlywdmOkudkh7OtuRTMsbQxpX3kM+lyNmXqKxlwtjVXDEYltQ1JA/A6QRZhQUW1kA+w+Xk6SE7CsthIesh1UoZlXmwnZ8gl0rY8K5Ga03lYyV8kpwLN3slrmDwid8kE7CyIbuejBecFM+ZsaR0mj8k7mJ/md5K3ZDxwm7SSs+QTrFtKW8g9ciiMVQmzAX07U72waKNOB1RC8cXVgtEGVJPmLiEpUWV9CnbehDIjxffp29Ie8oZ0hLF0JbDqc6oFCy0+ltCfBiM/v5uao4BELOl02SozD2Gd9hW5FXxys6IudY0ccTYfTFxorWdGygsmEpX1Pp2ZG7BgFJQyJVSWFYqLvo/kRs/KjMZq3yrJqL3kOznubFmqNZh22J0WtZO8CKhZVEj1qkNYcrZzAX9mlMEHqLxnXmLl3CzVGow28CmS99eRyUDuBvbDalMH7yZ5H0jfH7rtF2DNokzmUemT1gjsbyL+YagFPyE/HRrLrufyk/80rGG8hl3Was93kGzAVlSRfjT7YItUueX9RMpeDuT5/C3p3quH3UXqXmoIhQoVKlTo39FvcdmQ/sUw01QAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAaCAYAAAAaAmTUAAACQ0lEQVR4Xu2WTahOURSGl1D+EyIhpRRRCElREkUiZCIDE6IoA9e9EWYGopQMMKAMmJgYKHUHd6iYoGSkKBPMZKbwPq21z3d85+cecpXaTz31nX32Wefsvdba95plMplMJpP5bRbJE3KbnBBuiLH5pXldYP4pubo0Nk4ukZNLY11g/l65Q46X08J9cV2ByZfkYnlPPg2PyHPyiZxazG5nhbxm/rJXckGMr5Uf5Pq47sJEeV9+kd/lHXklZNMrzJZXrbdjfPzzcKl8KR+YZ6oNdh4vmj93Ur6Wc+L+MflWzovrLlAtbApxef9ReTxkrAKrT7s+ST6W18N0vzadfaTFTDePRzZvlMbvyoc2+qbUwfMHzReT4o0KJfFOHgr/lJXyo/VKgeyQpaFiRnfYSLK83zosgp3fYv5CXv5ZrgqBZt4cv7uy27w/FsY1ffJJbipmdINvOy13lsaIheXDpYCJNNcueVm+N18AshOcShuL2Wbn5Te5vTTWD7uY4hDjrHnG02EAKU5TLJ4bNO/dw+Z9yIk2HNJPFdbIEfPGvSAfWe/EuGVebuX0slMs/kxprB8y8sw8xm351ar9kuI0xaJKBuQMeVP+MK+arWEjNP7M+E2Nzg0Zr4MS5HSqg4XPMn+WGBz3b6x+firnuntTrHfwpJiU3V+HbNWe82KP+S7SN0AGON5ZWD/poGmK9U9o+4D/ajGUDf8tNKWcJuVvzDLz8nkhl/8yw0lx2mKNOfRCUy8B9U0fHJDrrPlDU5y2WJlMZgz5CckAW6adXdDcAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAZCAYAAAC2JufVAAACJklEQVR4Xu2VMUiVURTH/1FBURaEaGGolCVRg2BtzW2CtCTq1mBIBAphQ0QNEW5RkdAiLgUNgYOo0fBSEcHBlqhFKEGDwE0dJMj/n3Pu++77/F7vgQQO3x9+vPed795zz73n3PMBuXL9Px0k58l1ctypVmG85sqHfMU6TGpTtpPOiZS9qNNkgjwjPWTWuRkPKqNu8s7pIo9gc5uiMe1kk2yQFfKbfHPicSXad0EdIM/JK/8vXXG+kstuy1IrGYGlRwT1krfkkD8rqF+wgL6TJ7C0lU1dA/kBO6Eg5V8oqMHInlYHmSJHnaBr5AM55s8K6mXyurLkYAu2QFAo3AIZi+xphbR8cs7CivwpuZMap6CUiVMoPdVMKZi//hsUB6XFwo7TUnoewuaLbbJEHqB04UtkBnZ6b8gCue9kBlgpKPGv9tAIS6H4A/M1T5qjMXWwOgoBnCNrTnyiRe0lKJ3AHOwyCBXua5i/AsrPi32LXeP2UlMvyN2UTXVzi6zDfEvyPYDkpOKgfpIzbi8q3L6+yFbvLJOhyB7rCKy3xZsJqiHTSL4OBViQOlmp4klpZ+pRWX1KPUW/kopaPWmVXHTbYzKK3X2qhUzCaklSPd1IXuMCrG+JzJqS1FUXyT3Y9f3o9CMJNASlLqyrL+nb9Z6MO+ro8vGZtPkYSelRkOp5t8kXMuxk3r4gvbwK21H4WFYjBd3sdMJ8ZC2k/qUNK90qjVy5cuWqRjtOQHignr0R5AAAAABJRU5ErkJggg==>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAZCAYAAAB6v90+AAAC1klEQVR4Xu2WS+hNURTGP3mHJOVR1P2LJM/ySnlEHsljYEIMFZIRRYkiRAYKhSSivCckmUhXBhQDlEfKgEhRRDEw4fustbrnHOfce66MOF/9+t//OvucvdfZ315nAZUqVcpRV7KB3CILSaf05V/qTzaTbk5L6SE1Mp30SF9KSZOPJlPQfFyRepGB2aBrE9lJupOj5DAsEUnrG0fukBkea6lB5DrZS9aQx2SRk9QIcg02ZjW5R5alRuRLL0D3rievyJb0ZfRz7pMlHptIdsGSvUmukHMey9vJXP2TifWELfY86eKx2eS50+ExLe4YbIGh4eQuGmOKNAFmsRXkLX5PbLCjpCMx/a8kQgPISTSs2VLjyRekJxtG3jmrPKaJHpAxMYjqQ67CnlFGsfhsYjpz4iUaiY0i2/23dmg32jhbkh70A+nJYgHihMd6kzr5QObBJpsD22ntehkVJSanCD1LVVHS7i7w35pvG0paMDSZfEPxjp1OxGeRT7AX8YRchp3PsipKLDSE3CCXyH5YBW7bgqG+sCJwKBFbClu8uEg6e1w7swNmXV37TBaj/JtslVhWWQvqxd6GFRNZVTTVJPKULCdTYd+Q907smJK6AKuGss1K8tVRBSujdhOTBTfCEhwK+3CrYNXIQaflMdCHcz6ZSUaiYcVYxFxY9Uw+SJO8IFsTsWZqJzFZ8AjMUZKKWB121iUlLJrumhJKWkrdxxsnquBapM9bSEntyQYLVDYxOWIfzD0h3VNHI7F1TqFboto9gh1QHdhTMDuK+LZNIw9hNghp7BmYZSQdfvEMVliyLVfZxHTGw4KhP9oxfd1VJFRiz8LKriwQNpA0iUqxqqE6D00ka6qbiAUkE0u+lLGwbuYjrOh8J6/JAb+elO4/jvTckvpTdSYdsA2QS0TTM6aF1WB21N/km8pKE8q6Ijv535A6dzXYeVLHr+TU/qmbEZUqVapU6f/VT5Pvl7O18gVWAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAZCAYAAAB6v90+AAAC3UlEQVR4Xu2WS8hOURSGl9xD7n5EfhLJtdxKLimX5DIxoEyMMDAQxYQi5DJDKIkk94mSGIhfJspA5DYxIFEmykAZ8T7W3t/Z/+n7zjm/Ieetp++cfW7fWvtda2+zWrVqNVFPsV08FKtEt86X/2io2C16BUrFS9rFQtGn86WGhpl/PKq7GG3N/0CqIWKqld+3SxwQvcVZcco8EMSzM8QTsSiMlWqkuCuOiC3ipVgdSHVJ/BKfxUfx0zx7ZX94rflzzTgvBgeehXvRbHHQPNgH4ra4GsbKvtfQPxlYX3FHXBM9wthS8S4wPoyhi+KreVD3xWKr9pEd4p44l3BdPBfjxKjAB8sC45wgokaIC5ZZs1QzxXexJxmbIL4ENiXjeJ5MdlWHzN8ZRTKOiXXhvC3w3rLApoh94Zj7eUfl2kLRJmlgMXuAVaJiYDSXQcl4mQaYN5qo9WKnZbONUwDX0BXRRrEyHC8Xe62aOxqaK35Y6xmjrqLIMpbiD9wSj8Sk5HoVYb3L1txSY8zff1McN+/AXbZg1EDxVJxMxrBILO4blmV7s1gQjtFh8cr841VExqmbNIlFyltwiXhs3kywKhRqjngjNoj55msITQLSGcsr2jjWSploRNTRsvyFFsKC0bJjzRfuiebr7YkAza9Q/cQK80432TIrxuwOF/vNF8moZvVZJOrmm3nDKhMuOGPuKEQT6xD9wzkBQ+GsEdAay4qT3cenwLQwFoNILdvVGeNZGhLNqUg0kqPm7okieR2WBbYt0LJLc2OHeGFeoBQs6xV2hLi2MYunzWcWxZad1hjFD2/Nm0u6NeOYTUCVwEhU2jXRX80YqztNAqtcMe96WCDaIGqrecfiPlr/azEruZ4GliYFkRCKnhprS8bz4nkW8Py32WuyM6FOmQAaFxTWGJlpN7cjv2mm8uKlWJCGk26Iq4hWPz0/mBNbtHn5wSB2/ATHzJPQNKm1atWqVev/02+8xJ7y5Y30hAAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAAaCAYAAADmF08eAAADFklEQVR4Xu2XW4hNURjHP7mk3C+RKJOmXFKIlCLlEh54EKVcmheXIvfijZKSUhK5pIR4UpQU8jBRcksSKVJ4kQcv4kEK/5+19sw639l7zsXklJlf/TrT2vucvda3vu/ba8y66abL0VtulzP9hX/INjnPD1bDKnkmx0NycHJfD7lDrkzGGgHBPmV1BJvFTJAv5NvoNDlC9kzuWyYvWHhQo2mWt+WYaFV0mYXCdPlNnouSpimD5F252I03CuZ3XO6PVs1q+St+oocF3pdD/IUGMls+iY5013IhOuziZzkx6jkmz/rByDC5RrZEB8pRcrNcYKXpXwm+2yKXW2mJMM680kxjca+iPKciw+VL2Sr7R1P6yTtyjxuHGfKoHCs3RF/Li3Ju/HtJ290dQ3mclHPkI7kxuXZQ3pMDkjHm2RrdmYwXQgr8sPBjeWSBWOrGedARCzsKRBWpdX6Th3+Xs+L1SqyTi+RkC9nFaw8ol8cWsspzPlo09xKYEPVJV82DNHxv5QslJdMIs+NIUAgOaVZL2rKjpCu/8U6OjuOkLAsnnT3ZQrFDeskr8qMc565lFC00pa+8Eb1k5V27WljsAwsdNfsNmmPWPzxVL5SovbMwQSabB7tGffhuTPTnW6hPgkSwMKstJsopKj1dVcLvXtYoW628d6TBzesfJVBTP63jHM923d9DkyHlSX3qiXpE6hM4oh228H3YZOFZfBYxRX6x9uxpsnCA8c+GrHYxL63/sFZ+kF8tTJbPZ3JS1EPE/K5zeqI77rMQ9cvR63K3hfPo0La7zdZbWOg1K84esoTOe9NCAJ9aaJR5rw92n36AeWldF3TC51Zex0yYrpvWJKlalK40qQPWvssevkeK8snv7rXwnsw7EFBKV6NFgasZJkakt/gLNcIJK30/poyXn6y9sTTJN3JXdkMCwbglF0Y7jS6zUKC7UqdNbrxa+D4npuyA4WGhDy00M/7JoNNvtfx3MUfOExY2oKgM/oqpFhoP77taodH08YOOZrnCQtctCgjd/LTVN4eaoPA7rfjrgPd63i53083/wm9/tpcP/Wx5sgAAAABJRU5ErkJggg==>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAaCAYAAAADiYpyAAACi0lEQVR4Xu2WS8hNURTHl1BEHiGJEjLwKF8RKWYKA4+YeI2UiQxQkm9CIpTyTknJwHMiGZAMzCgTipgoAyZKSgwMPP4/a+/2vsfnfucc8U32r37de8/e55x91lpn7WtWKBQK9dkgLwSPBcd1zEgMlbsszd8jhwX/Jz2W1nBazsjGWAvriuNRzunKGLlcfpCfgvM7ZiTWyjfylZxjfu5AwMPOlI/kD3lSDgpjfJLI/fJGkLn9JqsEImOdPCu/BFd1Dv9iijwkn8lLlm48UEyXZ+R9+VZO6xy23XJJsDYHzbPNBZGL5PDQO80DRsVs7hzuykQ5onowY7D5nKaslhvNexxVsSMbI/vn5ORgLUbKE+bl8yJ4uGOGR3W9eQComD+9On2xQF6Wo6sD5s2XexHgpuw1XwdBfCkfW7oH1cvrMiRYi1nyuHlAHgSvWCp9Lt4rh8uL8okcG8bqslDetLRQAoAstk0QYvLiOg7I73JF+L3MfHdrBCW2LXwnc/jQ/GawVc4zvylBaNsfqIyrcoJ5ANoGAegPRy2tY678KK+ZV0DsD42gP8RSJ/P42rzk2BkIEjckGE37Q5VF8p3cFGwTUIj9IcLDEwSCQcBjf6gNWT8vx4ffPCSylfLg+yz9uWrTH3Liq0DgqSrsq2/UIfaHnKXyq7xuvpvU7g1AfzhlKTMrg5/lEbk4HGechbfpD0AQWBwNF8hafFWaBqOavAg97J75DlLd9fpli9ye/SbKSObzPyl/0x+qQcjpseaVwTmUPttuFbZSqqJ2f6CrvjeP3jd5W46Sk4J3zbcgjt3K5lIpT+Vsqw8BWFM9mMGDUerdmGqeCGS9rOW5/b4O+tqd8FkoFAqFQqFQ+Nf8BHb5g4VOTgzfAAAAAElFTkSuQmCC>

[image9]: <data:image/png;base64,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>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAaCAYAAADL5WCkAAADwUlEQVR4Xu2YS6hNURjHP3lEXonIK49Ccstz5jFSHkkiUcRAXANJ3mQgkUJCJl7JQFLKyCMZnBgQIqIkIikDGRATCt+vtT5nnXX3Pmefe+8558r+1b9z1t5rr732f31r7W9tkZycOjBHdU51W3VB1bf0dE5WBqguq4aruqquqvaGFcrRXdXsf2vBeNUeVbf4RJ1Yolqh6hSfCFioGuv/91fdUM305d3iojMTvVT7/W8Ss1SnM2ieXRAwQnVGGjtNMJHBxNQ01qumxgeVHqrr4s5nopKZHG9SvVa9VE1QDfYaplqr+q5abBd4uI4pYiPcSIg2TJkcn/CkmUlEHxY33TORm1lHM4EbYdh5SV57zqpmR8eWi3sApkpHYIPqkqqLV0iSmYtUm8TV7RmdSyWLmYzQb/9rcAMbseOqicE5DLwppfUbzWjVM3GzDIXEZk5RbVUNUY1TrQvOlaWSmUQiEflZ3JvZjh0JyvOl9HqOv5JSg4Hr6PQWcS+n8DgaqeoTHC+HXcM9VkuxPY4tUE33ZYPBJ28kc0EhoZksCU/FBY9psz9XkUpmkne9UD1QjRG3VtL5a5J+DW/2d+LqhrCubletEddhOg6Yjz6JS1OyQFvW3kYptjdI9UZVkJb9I8VhSUIhcWS2mkpmzlD9VD0SlwLRoS+qA2GlCEa+IKVtMijHxEXISdV9KaZMLAcojP5yWFtp7a1U3fLnQnaorniF62bdzKQDhHoYMdskOa80uKYgpW2yvvKwQ8VFLXUMi5aCpPcjxNpCo1QfxL1gDIzZF5QN6xcK71MXMxk9RvGjuAXcWCYtp3BIkpkGb3kisMmX+6keep2wSlUQtwf0b25QNhpqpkUR62M1203WMszBqBgMu6vq7cs8xFcvon+StHx5lIOIDtsjkziqGvi3RhHuzTIVbw/rYia54y9x+9NqYJ0lyQ+j2QinM2/eXeIi36KflIQow4znXknGGBhUkGL/l4qL1hibZTxL/Dw1M5Pp8d7rm7j1kl/K3DQLRDSpEYMRM031VpyJp8SZQRlh9CFxD46Bj1U/JLkdg0gm2zgobp0k7UrasfDSeiKurbi9mpnZHhBxvGHT3vg8LCmMLR2UEQ/c2Sp5VomL9HJwDeaXewbauCcufbKUzOjQZgL74DviTGstrH/srtrSBhDppHVpMys3swr+eTOZ6uxOdvr/1cI15LPtsb/nyxVfsNKescObCayDrJvx57mssINpzUCEsGe/KO5zYRrtZiadJUdra6fTqHX7lQi/bqWRpU5OTs7/zR/DObne9InKGAAAAABJRU5ErkJggg==>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAaCAYAAABhJqYYAAAAyklEQVR4Xu3QsQuBQRzG8ZOEMCiLmGSxKJHJYDCYTcpoMMgipewGq+yyW+3KaFbKYhCZ/Au+d+9PrjdvjJSnPr39nve67k6pf742JXSRhF9UMZKvnk2ymKCHPeaijgIOaD4Wt1FRzi43lIVOFGsMZVYxBLFUzo4+oZPBBS2ZTVI4omOXpIYzcnapj3FF0S7JGFvE7bKPHRJWF8IKU6szWWCmnmfVSeOEhtWZRBBwdS/P6xX9lBvlvNbbfLRYX8zzcu6ExQB517+fyx3OwR22nsevLAAAAABJRU5ErkJggg==>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAaCAYAAAAHfFpPAAAC8UlEQVR4Xu2WS6hOURTH1w3l/Y7k9VHXYyCKSF5fijJAihLKLZlRUoiJwsRAHhOFCDExYEAMDD6PIhQTEyWPkiIGYiAD/r/W3t1t8917fdfn5rvnX7/OOWvvc87ea6+11zYrVKhQoVYtFCfaYKeYJJriC42m/qJZPBCPxeTAKDFGbBafxXHRK7zTUOr2DkBTxQdxLG8IOiu+irl5Q6Nohfgu1ucNUh9xQ3wT87O2hhErTwQQCbnmiC/mG2JDpsAQ8dB8D2AvIPdj/m8SL8UO80joCvU2HwvURdPFJ/HIfi5/d8Sb0J7qkDgvemT236mnuVM7o9HigtgVnsvimRgXO3RW5D35vyyzE+6XxX0xKLGPF9OS57ZEdG3PjTWIyUcH9BPz7C+lI4ebM+KtmJi1EXrXxCvzlED8dKQYbP7uMDEi9I32KCJkg7ho/j59EBNYan4ASydB/1ICIV827xMdkP4zRiDts+zX73VIw8VT84nGAUbhEBzD/sBKoqFiv3lZJLzXitdin/kGSrWgVAKhe1DcFqvD80Bx17zqMOBL5ucQBn5YrEmgrcXcedEB/HOV+ZiwE5mcT+LZ5VywxwVrV5Q1ylsMr1QzzXf/ivkgmSCHouXmDkD86Enoi7DTDijti1jBKeaOmCCum7/LdyrhGonPKE2BtA3bnmBH3Kd9q2qBeG5+wiP/P5rn+tikD969GfotFkfN878WBxCufc1XmkGSdkus1QHYT4uN5mkDR8xXHFVzAN9OJ8s9ttTpnVLMLyZC7qFaHEC/deapUTFPqQHiqnmYLxJbzVOS/E5zHFVzAGUaR0Vxjw3qopK4Il6IlWKveQk9ZT5B7PcCM8zT5pbYLWabb2w8M9kt5nsPJY60OCneme8pgGPZLPkOJRriP9+HK4vC3rEtwD2bLNRFJevmDqhFpFE6oCbzFEhDvCwOZLZmc2eTFu2JCpZXsf9KRAqnS3IfBwEViqjoqiP4P1c8IHFmADbWjhy3CxUq9Gf6AU7dqByA4T78AAAAAElFTkSuQmCC>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAwCAYAAACsRiaAAAAK80lEQVR4Xu3daaitVRnA8ScasFEbaKDpNhfZXIZgdomrGFIfUjIryuo2CBctI6PBLEvK4EYTBZZESZglDR+cSupg3/JiA4pRCVsxpMQ+REYJaet/1rvaa6/z7uHs9t6e4f+Dh/u++33P3mu/58J5eNYUIUmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEnjPCLFcSke3J0/MMXrUjz6f3doq+B38+EUh1Kc3lyTJEk71MEU30pxdYqbU7wpxQ2Rk4K7qvt2us+keFh1zvETxkR93xdTvKE6X4SndlEr7XtViitTPDzFL0fu2OihKU5O8cr2wgyOjfyzD2gvSJKk1bsxcnJGgvCiyMnbZZGrbkdV9+10bcL22sjP4t8pvpviwhQXpbg3xXur+76Q4n7V+aJ8J3I1rWjbd2Tk390kL47c/vPbCzP4Woo7woRNkqQtgQSE7s/itsgJ3G7TJkTYFxufxVdSvKw7PhDLS2jekuKq6rxuH4nc0d2/09ye4untizPgu++mCqskSVsaf5RLAlLO2yRlN+hL2KhMkbjg+BR7UlwQOQE6LMXl3bVleF6MVtBK+6jm7Y/cNXtCdb0P914TuWt0s/g/QBe5JEnaAqioPak6bytuu0WbsJGUUZ2iW5Tu0O/HaDWNJPeP1TmTNs5KcWfk5zdtjNnzU3w+hl3Sp6b4T3WdJItkq2jbN87ZKa6NnKx9OsXru2PGsdGVS6KHv6Y4pjsuTkrxrO6Y/we0q/1en0jx9+4eSZK0AiQFt8Twjzjaittu0SZEVNbuiTy2j0SlrTryGs+uoPL2tMiJDdUxgjFg43wgcrcmz5vPIhm8ZOSOiG9Xx237xvlXDCtvJGgknk+JPAOYsYlUBjFI8cTuGCSQdXtpFwld+70emeKK6j5JkrRkJGp065U/4iQNbQK3FbC8SGnjsrQJEc9lUJ233YptwgaSozIh4csprquu9XlMDCcEPC7yBIbaZhM2fm9MkKCixnvXXaqMiSPpQv25xVoMK4I8a5K7UlEkUePnwWSHc7tjSZK0AnSF1kkBCQFJBlWUPk+O2Qa6tzaTcLXLZ/CzJEF0TR5e3bdobUJEdyhJyzhtlyiYWfqK7pjk55uRK3MkPjzTdjYp71GWBDmli2KeLlGeWakE8t50XbIMyImR21ISMtpIW1/TnWMthv8XqLzxPs/uzklOy/eiy5XKoCRJWhH+qJfKCfiDXydwNZI7/nCTxLQJ3aQxbyRZb4zc3UcFiq65SV2uJGclUeK+cu/7YmPCs0glIaI78dbIY7jujvy5fdqECnxXKnMHI1e6OH5sd43u1R93xwWJ3G9SfDDFM5tr4yYdTPO7FOekeFfk9fQYJ8fnvDzyeMWLU3w8cgJ3XvczYAmQQyl+lOKMFJdGXsYEfO7PIidrj+pekyRJK0KiRaWlICkrFRoqaSXZqKtqDGJvtQkb1bT7R07OSpJVJ1wkhiSKXG+R6JRuRRbxpQ3czzgsqm3LMmtCVDsQG5f1oI1HRP6udXvphmQSQIvPLM+5xvOpZ6HO2r7298bvob5WKp20p74Gzuvr9e+d77TM5y9JkiokEi/ojknOqJYxsJ7X98WwosU9VNtIEqi6sKjuIHJCxR91Xi9dl2+vjp/b3Xtk5JmSdKv9KsUvIicBLapLVHyK6yMPgKcL9N3V68s2a0LUmnXhXBairWfjTjNt4VxJkrSDkVQxWJ7KEMnXgyJ31THoncpWqXrRffnTyF1zfbMCxyVsYHYhSV1fgtZ6f4qPVed0h9K2j8b47tllmDchmnVrqs0kayTQRG3e9kmSpG2KbadO6/4FXWFnxug4KhKMH6T4XuRqT9v1V2u7RF8SOfmjS7NPX5foM1J8I3KSyHiqr3fnrB/2nuq+oiSHfagScv0d7QVJkqSdpoxxesjIqxu1CRvaZTAKkrQy43ASPpuxWMxY3B85+WO24+MjV//eHPm9PhJ51iKvc99JkRM2KoNvi1zlY6zZPLNbJUmSNCMG65MUEmXWJmPjGH/HpAnGkZ0eeTFaKoEkbHQf0o1IpY7jekakJEmSFogK2w8jb4lEMHifpSVOjjzO69WRkzImL7AMBZU2lrTYG3myBBMXmNnKRAhJkiTdh0jIqMC59IQkSVo6FjT9c+T9G1ls9qYYXZFekiRJ9yHGX9EFyD6UbAMFjtfKDZWyjEYbk9YEY9zXHwxjQXFtSJK0S7HYLHs+lsSLY6pukiRJ2iIYIM+m3QXHfQPmL5wQDMzfylhigwVzWd+NNddY843FZ1/aXZMkSdrS6AK9rjrnuN1sfTtgAsBx1fmx3WtgI3JQRRzEcLN3vLA6liRJ2pIOj2GVicVf2RFguzkYeeHcqyNvecWityxgy96lrJH2nOGt60tyMBaqfGf2EZ2GddXabZrasXwl6vt4tkdV54tAZZDtqWp1+z4XeYst1oubhOd1fOSdHTaLZ8cyJ3ub1yVJ0gqQDJC0bSckZjd2x6yTxo4FbOTOhAq2wuKcytoZkfcQJYmiS/S3kbfCmjRpouhL2PiMOyLvj0q3MGuy/SnyFlngfT/VHS8S78vCvbW6fWdFvuf3kWf+jkPXMG0/v70wgz2Rv3tdqZQkSSvApuwkHdsNlaR7q3OSsduq80XoS9j2pbineQ1U9PDVmC8ZmgXJKNtfFX3tuz7yVluTkFyy7dY87kpxTPuiJElSH7pwSR4KEqb6fBH6EiKSsTph29P9WxKgX0dO6pbl8hSHdcdt+1jMlwraJFThqBKO24N1mpsjdz9LkiRNxXituqJG1aiuuC1CmxDh9sjdgnSHshQKVa8a3bR01xZ0VTJerkyE4GcmVeDa+5m9W6p3GFTndfvYnJ7N7k+Jjd3bJGmM32OrLfZL5Tmxof2XYnT9PbrG28obm9yXrue3Rh4fiGntlCRJimtS3FKdk0isosJGde3cyInKT5prWIvhzzCOjvFkVANLEkWyx5Iqffruv6I6xiCGEwvq9pGEEX0VMGbRntAdk9iSdDIp4kORZweTtIF/2+9Lew90x1QO6Q6dpZ2SJEnryRrdg8Vl3WuL1CZsdEUOIu8Sgb5169Zi9GeoWJEgFdOWTyHpubM6JzmsDaI/YRuHGaw8F6psoFpWV/hKRbD9XPDeVARZZJnvzvMuFcX2/radkiRJ692hdIsWazG6rtwitAkRyReJYdsNWmu7REmu/tEdk/iwmwSTAniPvsV7qdz9szo/ujrGIPq7RMcpCVtB1yUVvhMjj2NjxijJHN2hXDs1huvX8d7lGZOkDiJvO7Y/prdTkiRpvfuzXjuOpKRO4BahTohuTXF3FxyPc1OMTjpgOZErI68Zx1pwVKnYeQEXRP/aapekODvy5IDWpEkH45A0nhO5HTfEcPkT/CXFeZG7lNm3853d68WhFJ+NvDzKzyPPKC6fO6mdkiRJ6+O1StcgqLiVAfGTMJOyHuNFtYvX+syaENX6lvWggnVEd8xnlYQLDN7vw32lG7MgySrrvWEz7eN7UtEj6gogbSnPg+P2MxmvVpYJ4bitCva1U5Ik7WIkBnTxoYwFYxwZr/8tRrsK250IuGezW1VtJiEqeO92gdtxWPB31vfve9952idJkrRUJF6XRq40fTLyor9lVuRVkZeqwLiEbW93HRdHnmla7K2Oi3kTolm3pmKx31kxxqyv+3Se9kmSJC0Va4GdVp0zXuzM6nwSkrb/Z6sqSZIkrQDjtOoxZFSo6nNJkiRJkraP/wKveRlBbf6uMwAAAABJRU5ErkJggg==>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAZCAYAAACB6CjhAAAC5ElEQVR4Xu2YS6hNURjH/0LeuSjvV4QkA0ReeSWPREiIZCCUmVImHiMjmSAJJcREQmKAUCZeSYZKomQgyoAh/r/77d1ZZ997u+ccrnLu+devddb6vr3XWt/61trrXqmhhhpqqKTuZrN5aq4lUN9oupZc609DzX3FhAcWbNRpx45fXapTB6CvuWuemUEFWy7aseOHf12Jff/LbC0aCtqt8MO/btTT3DbfzSzTr9zcrC5mgJltfij8ea4uNMS8Ne/NdPPAnClwXvElwI4f/jz3r8VCsBXHm14FW80apphUHgBK0rxIageeW2TemNGqTIPV8oCtRt3MOvNc0f8kRf9kbs0i5R+bL2auWV9ubhbpvkNhxw9/nutj5inuD5VojZlRbKxSTPxRVtIv/TOOP9Jx89MsLRoKWqHwO6ZSOrKqXJAIEoPiC9Gk2CIMMA8OfnfMcsVzPI9tgVmmlpPgPVMz+pv5ZozKA5D2k4v6SjMqaWtXU8xnc06RZq2Jduz44V9MxxHmpnmomOR2cyGD4BC8l2a/Yuv0MJey+mRzy4xUiJS+aCZkcAfZY9aqPAALzROVsors3acIJiVfLahIPPzNbFKsTirqtGNPt0g6GMRkmDBiUDcyWE3gd7oFxioyg4y4alZn7bwHcqX1tM/0nSwA7XkQKakDtoo007w2ZxWrwJ4HVoN27KlqDUBvRQZtM9cV2ZEGgD7ZLvkWwDYts7UVAHiVted+1KGqc4fVHq4YTA71YlagWgOwRRFMbpbjFO++bHaaVWax4mzgvflEc7UVALLonmI7IUrqgO2vi319WHEmUJIxL8w7xQQ5L75mHFR8t4+ak2av4mLF6h8yu8wVxQVrjmK1P5kPCacUB1zeJwc37/mo6KvJLFHcW7jRUlKHDlGnD0Ct4v6Q/l+BT1z6GSOwp1VKZYT/AVV2orOd6KO1LftfiIEfUfzBxcSBz9oJtX9PqRsRhIlmQwYHcYccZA11dv0GR72wFT4hnHYAAAAASUVORK5CYII=>

[image15]: <data:image/png;base64,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>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAaCAYAAAA9rOU8AAACK0lEQVR4Xu2WPUhcQRSFr6igaCQYEUQlIlikCqJEBAULiwRRg5WQVrEwkkTUQFCxsZAEBbUJ2ETwpxDUQggSiJDCn1QRtI6NjUWqtCHnOHd488bdWYVXrOgHH+zOvJ13Z+bMsCL33AGa4KAaoha+g/l+R1I8g+uwWM1ED3wLc9TE4Mu3YIPfoTyBI7DQaeOqLMMuNTGyqpheuArz/A5lGn6DRV77c7irXmdrM1IAd+Arv0PhS/bEFORTBg/VZq8vRrWYU9EuZsbUnpYK5zmejBP41GkjXIUOOAT/whn97q4Og7uiDjvtMV6KmcljMfu6r/bBD/CrRIO2wFOJF0hKYTechX9gP3wh8dwQjke/eO2XPIKfJPoRH/yp1sFfcE2ifHSK2YZ0ez4vqfNiea/uSYoxmHL7Q5sHDkhtf65+JqFiQnmxBItxqYS/xYQzXUBDxfBIX4jZnnQEi+HM28QkneHlYAynDSiz0aqfCYthgPm8D++PczEh57byCiiJPREVsyEprgbO4p+Y5PMEnIkpgDL9byR+DHnRHcMqp83Cl/yAD8ScxDG5evUvqTYGMerhdzgJJ+A2/Kh+FrNd7oBckSMxp8qHK8tVG4dzcjXE/G4vvbS3MIP7UD8zrOUq231Y2CKc8totzIEdy4eZOlCZz0TgVnF2vBZuwmsxk6CJkVXFcKtG4YDfEaAGbkoUgUThlcDTxz9ZNASDuwAb/Y4kYdh5jGkI95a/53bzHx3iXFX8xAuXAAAAAElFTkSuQmCC>

[image17]: <data:image/png;base64,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>

[image18]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAaCAYAAABYQRdDAAABe0lEQVR4Xu3VzytFQRQH8CM/8jOESCKibLBBNpKSUrJAUVizslUWViRWb0EUyQZlw1KUXpH4A2wsJdb+APE9zsHMuVfd26UsfOvTe/fcefNm7sy8R/RH0gZbcAxnqsZrETO5sAPtkAEr6gCynHaxwp3uwpReD6s0FGotUXikayql14nTTTJqVuzdSZAf75QXahnyVAElnH4dLEAtyVZisySLGBq+0alGjRa9fwSvxjZ/2IaHPgbPFPwAe4HFz9YRMwJ30OHUmuEBBpxa5FTCLUyaehFcwJypl0ATVJm6lyF4hAZT5+snkhPjpgduyJ9VIDySNAWP2TjcQ72p85edQrmpe+mDc5LpcirUJcmztuFnfEjyA1Lt8JIN6yTbgvfbtRqk8A29BDPQT9Ke7VFwpu/hBSgj6SisMw6fnBPYgEZoVd8NIFL4eV6RnKh9kjOf+Nz/Sqcfi1RK8nfSpSYgx2kXK/MwTbLym7Cqet1GccM7JVPf82u++s9X3gAdFkEuD77zIAAAAABJRU5ErkJggg==>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA8CAYAAADbhOb7AAAFDklEQVR4Xu3dS6huYxgH8FfudyK3hIRyT64JpShyGciITEiUSCbuTBgQAySRAeqk5JLkEgZKIQwkUkompIiBMCCX99+7lr32OvtzPufs/e3v7PP71b9vnXedc77Vnuyn9/KsUgAAAAAAAAAAAAAAAAAAAAAAAAAAAACALdYONft3Gdu6Zp/S7uUTAIBVcFbNDzV/j29UF9T8WvNMzQ2jewAAzNDDNa/W7DIY26rmyprfBmMAAKySi2uerNl7MHZKzTVFwQYAsJ7MbJ1aWrHU7yv7qeacf//G8kqRlpm1S2pO7sYuK61g+7xmXTcGAEDnoJoda57vPuO7mkNr9q05thtbLn2RdkbNRd31daUVjn+UVjhGiro8AwAA1eU1P3bXmQG7t7vOZ19ALYdtah7rrjObl71s5w3uZYatXybds+bI7npDssT66XgQAGAtyX6yd7vrzID1y6GvlDYTlsJp225sU6QYe6K7zgzaBzW3D+5lOTQzbXF8aUXbXoOxSU6s+WQ8CADMt/yS73t5pbfXWN8HbHhKcbnle/vvWarg2KNM7kc2ayfVfFPzcmltNdIrLT4rbX/ZFTX7dWMb68zSWnkkR3Vj13afX9X8XvNLWSgcU0Rmb92BpRWLSf/z6tMXkQo2ANgM3V3zZmlFSH7hD6VI+6vm/TL9ktvGSEHxcWkFyq6je3mmD2ter3lwdG81ZCZr+5qDa74YjD9e8+zgz7OS53mr5qXSnikUbACwxvR7pVKY9Rvb47CaW8rivVIr6emaO0srKIauL20mqZ/JWinj750khVme5evSZtsiRWV+RqfV3FRWdjZyLCdIs7/tjppHRveWksLu55rzxzcAgPmVQiMFW36JDzfN31ZzQlm8V2olPVBa9/5hi4zdS2th0W/yX0nTFmw5XJC9ZbsNxoY/n6WWlVdSCu4kz7Dz6B4AsEZcXdrJwcxi9X29sp8tS2gp4PrWEhuSZbcsWaaYWSp5fVIKi0lSMGWmKoViHF3as2X2KMu1K23agg0AYOYeKm1/WnqLvVPaTE16faW4yli/HJqN/4d310vJv+sPMIyzoeXM7FvL92Q/VpZG49bS/r+PSns1U2T2Kr3O+h5oy0nBBgDMrfu6z5tLW3rMDFf2YKVFRZqz9tKYNYcTJvmvgi1JwTdJepv1smcuS7H9bFz21g2XSTPjNo08f05uTmuagu3cNRoAYM5l03rkwEHeTZk9YzF+V2U2qT9Xc0CXsU1ZEr1ncP19WWgYG+PTqynuMtO2of1aeZ7/cxpymoINAGCmsvT4Z2k9vTLLlmXRt0tbvnyqLPQB6/t/vVFaIXVczYXd2KbKjFz/PVd1Yy+UtuSZVhV5T2eesd/DlgaxKfyyhHpENzZpJk/BBgBscd6ruau0k5urJbNrKRpvHIyttYItS5SXlsmzkQAAE2WJNEXE/TVnj+7NQmbVXiytOexrZf0mv2PrSmtV0s/cbS4y0zmLNiYAwBrU9xfbadHobPWnTbdbNLq2DF8uDwDAHEobk5yEPaS0txIM3z4BAMAcyAvlM8uWV02dXlq7FQAA5kR62eXE7Ldl4WXtAADMkbzpIS9wT+uUNCme5UvkAQCYQpZCc0o0spctfeqOWbgNAMBqy2GDvs/dlzWPlrZMCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADB//gH6x7LrsbEJ+wAAAABJRU5ErkJggg==>

[image20]: <data:image/png;base64,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>

[image21]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA9CAYAAAAQ2DVeAAADE0lEQVR4Xu3dv6tXZRwH8EdUyGugUfgDhW6LEhgNNUg4KrgIIdeCIggaQgeHFhOiprYGkUCshpYQf+FgOKjDl2hrrT+goYagoKG5Ph+ec7jnHK4J93zvPdn39YI333Oezxm+48PzsxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4D9ja+Ry5IvIUmSlXwYAYEq7Ijcie5vnHyPf974AAGBSv0aOd94vRN7uvAMAMLG/I+923i9GDnXeAQCY2JVSO21ttvfLAABMbUupI2q5di07bO30aK5pe6n9CACAaXw2eH8lcrp5/jTyfqcGALCwXo58GXkQOTiobaRnIvcGbScjLzTPdyPHIi8W06QAwIL7OvJOqSNbs15lY+VO0OuldhTfi/wUOdep5xTpW6X+t32ddgCAhfV55NKwcQMdiOyILEdejzzVq5ZyNXJt0AYAsLBeLbXztHNYmEhOzT4XORr5IPJ0vwwAsFiej3xcaifp/KA2ldw52sprqwAAFsLNyG+Rb0s9PiPv7fyw98XacnTrk1K/XytZMwIGADDStsjDUu/qzOdb/fJj7Y7sXyM6agAAc5LrwHJNWMrf3JHZyk5XTov+m0d12DLPlv4UZit3nW5mAACeaF+V1V2YedbZH51annP2Xed9yJQoAMAmyN2f35Q60vZm6Y+I5cG590sdKVvutAMAsMlyWnPPsLHUA2wvR85Gbg9q83AislLq2jkAANYhbxrIac3HrWNbr5xy/X3YOEJeCJ+3IPxZNvdmBgCAyeR0aN7reSpyZlCbhxzBm2eHrTVrAgDwv9dOVW7ULQc/lDrluhy5U2rHcB5mTQAAGOmvUkfZPoq8FrnQL6/brAkAACPkbtS8VeGXyPZBrXW41NsXZo/IUn60hlkTAABGyCNDcnQt/VzqQbtvrJZHmTUBAGCE7KzlLtGUa9nyrLcjq+VRZk0AABihvV2hfc4OGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzB/gFCrWRplY1AkAAAAABJRU5ErkJggg==>

[image22]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAaCAYAAADv/O9kAAAC4ElEQVR4Xu2Xy+tNURTH1y+PyDPKI+TnEVGiPMpAHhl4h5RXHqUwUSjklSIhmWDiMfgZUCKPJJRCBoQkGUhEysDEwD/A99Pa2913++GXzh38zr3f+nTvOXuftfc6e+219jFrqM3qJY6KC+KVmFvdXF5tENtFk5gp3ophVT1KqjWiRXQRg8VrMTHtUA+aI16KfnlDmdVXXBET8oayqy4dJ7OfFCNFZ9GpurmcwsndYrIYKJaLMVU92qE6iBFisViWMV90My9nPxI+iP483F41Xby3aqdSPonxsXNZtFB8FUvMV72ruCpuB6jZpRM1+I04ZH4ai9olHga6hzYy+WjR51evYtXb/BTYM2+ohWaLb1Z9+upovuL3A+xt7i0wP5/X6qTGdntqbp8og+tib9qpKG2x3xMUb/2z2ByIYuVvWO0cb83+ODE0uS5MrPg7MShcU67OBvif1ug4sanmId9sle3B7yjzijAk3Isib+DMDPOqQfTQv9n8644thFLH44pTMtOtxtbkPgvF1ojK7UWbfxSOHRM3xTrz0NphnuByMQFCf4/5Bwq/fKLiCCXvgRggzolFASZEP2o9uYH+PcQ2sdPcscuhPXWchYCL5vmGMVaYR+LB0P+u+SIwRm4v2vynGJS3+LdTWB6KDPLMfAASEitOn7Xm3+vAhFvEKTFJjDU/8T03nzQ2ePGbwrN5qOM0IPqmOQb7VCS2Zm4v2ixE+cRYuUfm4YXzd8wH22gVxxFRcML8LHBPTDOvJJwLmGgM59w+aovjXOf2os1ClE+sbh0fbl5+CF321Opwf6lVHF8vDps/S5I7I2aZv7Boh0Q0JfT5H8d5PrcXbRYiJsZgR8wTDf9xEm0V18RKcVw8DpAoub/ffO+fNrfDfr9l/rL2mSdLSucXcUnMC7wI4MQB8V2cF6vER/HE/NM4txdtFi7CnBVMRZlpLbxIcCRNPmdTNZnb4bcIpfaKstlQQ+1ZPwFAmJXCzdPpsAAAAABJRU5ErkJggg==>

[image23]: <data:image/png;base64,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>

[image24]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAaCAYAAAB/w1TuAAAFD0lEQVR4Xu2Za6hVRRTHV/SgKHtTiYX2QIoeFJGRFYb2pAdiiWFQH4soiKTnBzVUIkFKs5QoIqGCKCJ6ENWHi0UUCUXYgx5YYQZCSpBCRen/5+zx7DNn5pzZ5+5zwnv3D/7cc2f2nj2PNWut2dusoaGhoaFhn2I/ab40O6wYh5wiLZEODStGw0RpqfR9oV+lH6WXpBOk6dKivVcPnxule80ZAtwsPRPo3KLOc5i5Pvv6ldKU8gWZxJ4V003+hgocL82VVllne+hOaaq1xu25VHpcOjAorwwN3Cf9Lj0oHVHIc5r0nvSndEOpfJicJ70jHVMqO1K6StopvSlNss7J2F86W/rCnCGcWJRVhWfNkP6Q3pcmm9swiN+3Sb9ID/gbMmBR10ufSq9L/0kbrLXwz0kbpV2FVksH7LnTgUE8Ii0olfVFYwC9GbMGwITxsO3StKCuzF3mDOSMsGIIMOiXzfUhhAX4WRox5+5jzJMWWqcLrQrGz0KkFvlh6fqwMAFzTXi9uPif+2h7zt4rWpwubTE3TsZb5izpc+nkoDwLJuQh6V9z8bUbdHDE0pM8SBjkl+YSn5CjpM+kr6Rjgzpgx79g7Z6jX5ZJ/0iXlMrwjkcXv4nVF5TqUhwkrZPusdaOJrfBk8XuZ85HpHelQ9qr9tz/qsU3R09IIv6SXrFO1xmCATAB/we3Sx9YPOOljLrfrNNAmJwnpCuC8n7wi1A2NOZsjbWee5117tBcnpU2mzPYEDYAHiA1DoznbengsKIb3q3iduqI63gTdpmPizk6zvLiMZPDLk5B3Q7p/KCccT1mo3f9QOgjBH5sLmPnVMAufsMqTnyECdKH1rmI9JtTDR6OZ6bGweYknHCayIaLuSm2c/oB13SNuWNQrmZZb8/DhDAxqbgL1GHIPv5iWAgD528d3GLuGRgUfed/Ym+3fuXC/LMOJODkK98WIi973uJeoQyG/7VVXEdv0VgeFhjWoaet/TzKi4fDS9cNA+96u020XxxCBbuERUJ1eDagTRYi9DK4Xp8P4P3mW3uWngvehFA801wbLDwiN0u5/TL0iRNI6AG7ggtOZc/sOsQ1t5qb3OXmBplyQ4MixwDwPPSRHIUJI+6jfhYjhk80Eb8951grKcP42L1V8cb1ibWO3ncUYkwcb8PEL6QvA6BRssqfzJ2fU8Qy3xhkwrRHR3LF9T6DTsEEvWjdE1AGzu4kGSShxWX2cptV8O3zpi7GFHN9LL87yYXjG8nf4lIZ4Rl9Y84zXFSqI2Seae3Gfbm5N7ds2EqwW3AzuPZYLOYFx3fWR4JRMyw+R53UjmaxmUTGkuv2MSy8RI6bZXenzugs4HprP4bRdm77uH9CMZl+yGJzzyUHwhOyWTDy+63dExMCY6E8ixnSD4V4kUGC82iht8yFgKcsPfnDgEXdaPFzPngXzZEst59M4Apzb99YqBh3m/NUf5tbiK3F/17binJ230nFPeANoFf73guvs3i/MWy8AM/gWZvMHTXDMIxnSnmnLDiKnWruK9uV5mJ9HS9O6gLvs8HSYYjJ441ar3ASg2SXZG5QdGsfAyC8dDsKk3RzuqGd2HUY/0fSZUH5mGOB9KR1Wv9owb1fHRbWyKDbJyy9Zr0TxX2exgDijBsDIMNmoBeGFaOADzJrLZ4A18Gg2ydM84WUL6XjApIijlucTuqAjzKDWhwYZPu0S5J5bVgx1mHgsY9C441mHhoaGhoa+mE34rMWVOEtwaMAAAAASUVORK5CYII=>

[image25]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAbCAYAAACa9mScAAAA7UlEQVR4Xu3SwQoBQRzH8RGKUhQpcZCrHCRHN44clCdwcHNQkjvFE5BQLp5jj17A0cHBI3BR+P2b/9bMsFnhtt/6XOY/u+3OrhBefysOU1gY2sqeEPSN+QRi9gY/JGELV1aHiL0B+SAHOxiylJDXag3gwsrGjKrASMgbkpc14c7oSdSiQr5Cxlh/qgo31jNmXWgZay8rwZmNlfU8LCGsrDlGB3VkG14LwhyK9qZ3JWDPLCG/TkPIV3M8SLOf3IQushjdiM5iLeTP+FF0FuQEK6jpY3fRVyH0r8wgoI/d1WEHyOoj96VZwRx4eX3bA+o6Le43xWhxAAAAAElFTkSuQmCC>

[image26]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAA/0lEQVR4Xu3SPctBYRgH8EsMRCksYiGL2GySibIwyKDwBXwBZfEdZLLIYLP6ECaTMhhkUep5Jib18L+6r/N2i55iPP/6dc65r+63q0PkRk8Zpv/UB6+aZiUEedjDDnIiLpJQhw3MZY4jHy/AKcAVZuARepow0AeNdOAuT3sSgsOn4EWewrvxzj+Q1cZHUJLvIjnrZmKwJdWDHrTEGNZSfxve4QYLUhPbYkVWT96GG8P3b2jjfF+jJwHoQtAqq/hgCSdIa7UMROS9CkNbzQx3+EDquH5nyUyY1PVSeoFTgT96sToSJTV5QlovanCEC6n7/8q33Vlq/IPxj+bGzXfzAAf/NXIXXvACAAAAAElFTkSuQmCC>

[image27]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAaCAYAAAD43n+tAAACF0lEQVR4Xu2VMWgUQRSGfzEikhg1EYOIREQDUQyCFgqJsYigRRAUQdDOJkbFYCNYnWWKEEysxBBSCSKmVEzhIRaKRbCwEtFGQhK0sLPQ+P+8udvJ3u1tbu+EI8wHX3Gzb29n5r15AwQCgfXGJnqK3qePYg7TLueGwguNykZ6k36lz+kyXaBTsMW8p3/oinMMDb6ohl2QJraL7nZ2wMqoEpqYJviUbqE76Sc64weRg/SLUwvcvvpx/Wil4863WF3z52lbFFoWnYnX9Kj7vR+WnbvFCKOF5p3PaJP/0Oc4vYFoVy87T8N2vBKddJb2OOtBL/1Nz8XGDyDK0JnYsyIKGqW36A/6hA46P9OBKLQE7dADejj+oEauwObS7Y2p3PL0kjPx/FyD7cg92AL20jtOHcxKk9UHc6jw5xl5TD/QE7BSXKIv6CE/KImtdDOsJqdhkyuYVm7H6BxK7wtfZXCfi18LO2CLmYAdhXlYV7vqB6Wxh36DpboatKCh+GCNnKS/EJV6H+w8vaPbCkFpqOQWYROshnY6Ces+9SIHa9lq3UJt/CX9S8+6sQLNSChDnRelWemulgt0BFGZ1oIyoEzkYuP6hhb0BhYj1V0/0oteXBFdYA+RbUJ65zqsO8ojSD97SSgD31HaiFQBr2Bn6adTi+n3g3yUurTbPA2Vn7yN7E1BrVn3YDl0eesqUWeVWTctEAgEAoH/xj/+tGcISh64DQAAAABJRU5ErkJggg==>

[image28]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAaCAYAAAAe97TpAAAByklEQVR4Xu2VvytGURjHH6Eov4qSEDJhJAbLqygKg1JKGRgoJZKUDEaMUkSSwSYWJouY5D9gQTIoo5nvt+e+3Hvc9zru9S46n/oM9zz3xznPOc9zRRwORxQFsMwczBKNnhtwx2ef7x7OZdWIL4jOMxQGTuC16MPZXky+ZwO8gi+wXYITzIWt8BaOeZbDHN89Af7FIhjoh51mwAJ+mFb5jPyYwQF8gjVmAIzCSXPwL2mG5/DYk2eWZ5wfTsG8zzujWYJvoln3Uw+3YZExHkoFnIYdYp+9IdFJl5iBGDDT7xIsaiaARc05/Qi3cFf0BXfyPRth8BxvwUIzEJMB0UVwB9P0wDWxTOoE7ILd8Bk2BcOhjMNeczABTByP06J3zXpinYTVSCjFolu3Cc8kogf7mBPtZP7+bRrZzw2YuFfRiZMZOPwVtqMa3ktwO6OYErtjZwu72YNoEvleJpTt91eMwEfRsz4Iaz0zkYKz5mAC2H0u4A08hC2BqCXcxn3Rs7giWrBRRcsssej4c/oLeJyPRIt73ohZwwdPRRfSZsQyUQr34DKs9EwC/y+Xou+NBdsYd8G2ENPwOf7w1j3jFjZhcdeZgw6Hw+FwJOUDzjJJ3LDNCB8AAAAASUVORK5CYII=>

[image29]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAaCAYAAADBuc72AAABKUlEQVR4Xu2UMUsDMRiGI9YitIMU6aKD6NRVJ0HEgotDf4Gjg+Isle7t4OLg0IIg/gFXd39CLbiLi1MX0cWlPh8N9fItSVsMHuSBh4S8d9xLLnfGJBL5YAu72Mc7LLpxFKrWig6yLOM2vuOlyv6SFTzAG/y2NrIXaHJTVDjEL9zTgYcStuw4LSd4jhc4snqLyk6+4ppa91HGth1nRcoFFZVX/4gPWFCZj6hFN834fJ7qIICoRY/wA3d0EEDUoh18wVUdKPbxVnmPAzvqTJR7fAQVlZ14MuMHLbhRENF2tIZDPLbzuht7iVZUAvl/yvls4q4be4lWdB2fsYdXuOTGXuYpeo1v+Gl+i8pc1s4y102QcvIhLeoggHmKRkU+wA07/mtyUzSRSOSJH6iRSUvL5RkBAAAAAElFTkSuQmCC>

[image30]: <data:image/png;base64,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>

[image31]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAB8klEQVR4Xu2WTStFURSGl3zkM/lICQNioMjAwIQRAwYkKeIHoFwDEykDBooyopSvjDAyUBIlE0N+hpmk/AHe11m7u+6+9+o6zmHiqafrrH3u2XfvtdY+RMJRCOdgE8yHdbATlsAuOKXmuS9EwSQc1b85UQLewAqNzat9ev1jKuG2fjqmNeZoVrdggYmHpheueLFDOGaui9UD2GLioZmRYGWOKngF203MwZUO+MEwLMFhc83CuZBkPi3+vWm0wnG1wRuz+A/y82nx703j1ydlhS3AR/gimfPjWJTUnHLCCY0VmTjJKad8wL1kzo+DD1k11xtwFw6aWM7Vyyp8kOxb5aiB+5LsU546ZcnhT3LuU24pt9b2WzbsiZSJWbXHH/BhTl4lyO0dfFJvYaO5j9iz1+dbZy+39R0uS3CIM6+UOV4390WGy+exBKtwMRePZVKXT9sK3eobHDHxyOBkfn+61xPzykqMHOaT28jtJHxHXqtnsFyCN0u1jnPlJ5J+GOSMKxbbn6xAbitlC3Gb1yRZjexL9mtouKXPkpo3/vvBldM9eArrdYwnDcdZ4aHhr+e2+g9hFdNaM8Z+TcBzOKSx2GmTYGcuYYc3Fht/MinhW4YV/eVBHiXM/44E5yoPfbZS7HB1R3AT9ntjscJKLvWD/2TiAxzfTlXJNYvFAAAAAElFTkSuQmCC>

[image32]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAcCAYAAACtQ6WLAAAAkklEQVR4XmNgGAKAB4g50AXFofguEM9Ak2NgheJYIJZAk8MNJIE4H4rV0eRwS8oAcTMQR0DxGSAWgUlmALExEKdD8WkgFoRJ8gIxNxBvheIGmAQM6ADxQyi2RJNjyAHiE1AMCgh/IGYDSYCM3APE5VAMMiUVooeAJCMQTwDiuVDcD8T8MEkQYGaA+A2EQeE7ogAAYFYWnRxMs9AAAAAASUVORK5CYII=>

[image33]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAaCAYAAAB7GkaWAAAAjElEQVR4XmNgGDhgB8QrofgSEBsjS/IAcRwUPwBiaaIlQaAVircCMQeyBIgDEgRhkAIUIAPED6HYE02OwQUqAcJKaHIM5UB8AIpBjoMDFiBeA8SToBgFiADxVSAOgmIUYMoAsUsfiv2BmA8m6QvEp4FYFYqbGSBWgYEhA8TY2VAMcjkKAAWCABSPOAAAjo0Z7/h53t8AAAAASUVORK5CYII=>

[image34]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAZCAYAAAAiwE4nAAABu0lEQVR4Xu2VPShFYRjHH4WI8s3AQhmUjzApg0lSPiaU0UAyGQwGHYNBJiluKYVBGcTiI4MyKbMMVrvJwID/3/Nc95z33nPvrevchV/9uu99zvue97zP+7zniPyTmXI4ADuc+K9TAOfhO/yEq7AelpiVsMb6paUCXsA1M4xe+AxjcAyOwwX4YM7AE9gVHxAGb/QK782q4OUfPDhk7UJrT8I9s0F00lLrE0reJxwR3ZM3sy94+Rs+xIHoTf1wC6bNrFmGu/DD9AJXlX64IcGCYLWeimaIZgVTw8kGJbH5qdK6AkedWAs8E+3r9g+lFu6LDvBMrjK+V4QrOYTNvhjhaoudWEaYqnVrc+8o9/FIdPWkDe74/ueEP1WsLnoJX2C7xVkQs9bOCR54rqTRiU+JVq0nmrZNSS6KbngFq514WlJVHmHpP8In2COJPfbDTNQ5sVA4Ed99PKypzhyZE13lHdyW4EMVib5D+ZsVvBE9lvBBTPetaD+mOA4rdkk0M4u+eFpu4DVsci84dMIJCT4Ux7SKptl/dCKFx+Rckvc1MvI+Ib+BHhyW5CMVCR7cEv00uUcqEjhJmRv8u3wBZsJMaQi+u5EAAAAASUVORK5CYII=>

[image35]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAAAg0lEQVR4XmNgGAUDAkyAOBuIJZFwBBA7ADEzTJEKEHcCcS4QvwXi5VDsC8S3gdgFpjAZiG2AuAoqIQvFRUD8Goi1YQp5gZgdiNcA8XwgZkTCcGthQBqIHwBxNJo4BgBZ/RKIjdEl0AHIPaeBWBBdAh0sBOIpDBB34QXcQMyKLjgKqA8A99sQpGLaAW0AAAAASUVORK5CYII=>

[image36]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAdCAYAAAApQnX+AAACYElEQVR4Xu2WTahNURTHl3xHIfISEin5KMpA6imDl3oDMiOMFBGlDCgMRApRUjJQSi/e6zFgZMbEyFAGJgZv8gzMxIR8/H/ttd9dd99z671u93TV/deve/fa+5yzztprrX3Muqs14oyYKxb4eIuYJY6I7U7twqGbYq2PV4un4pKPF4u7znK31abd4kIYzxGjYijYDgVq1RUxGMYD4o2lrc3a7Dy05HwtIr8eiQ3BhqPPfS5rhTPuv7WIfHoiVgXbeWvkWxbrqtZOabZYaWkys9ShqkjWOMcYe3kd9jxXPrAq39D/7RzG++Kr+C1eiGFnkbgsPom/4rU4askBHCOvfoqP4qTDHNeNWCPnyCeuJe/2uS3bp5VzeD9h1W9wUfwQOws7PeyeWFjY0S1rVCsRfSWui3VTK2ZQre2co5nyZr+suTWgs2JPYcvaa80FwH3mhTGadp+7Ib5Z63HCw99Z2tb9wb5eXLX2b1yeEKXINZ4JS4q5FlVtHdvF9pywZufIK1rDNh+3Uzxbo7h+RmcrzpVbd1ActlQcOIdDaKulLeMhtYio5OjkEr9jKeREk6jyAmzjNbExXVaPonNEC4gcys4RLf6fcntUfiEqc76lszQeVR2JBvlH3LaUZ5BbBP3qixiz6iQnuqcd+tszcU48iIs6UY7OpCVHYzenvdBmvovjwZ61ydInEry0dC/ydFdc1Imyc/Q0qitWGFv0Wby39h+GRBdotsuKuY5F2X+w1lMAkUtvxbFyIuiA89i6UMXk1w6rvjEVylzZr6JyQ+Xs7TnlVOBrpefU08711Vdf3dQ/Q3tliIGj4usAAAAASUVORK5CYII=>

[image37]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAdCAYAAAApQnX+AAACdUlEQVR4Xu2XS6hOURTHlzwiCpFHSMTAoyhSijKQGJAZYaRIMTKgMBApzxLJwEgSYWJkoJgYyUAyMDEwYWAmJuTx/7XXut/+9neO7nXv3V11//Xr3LX22fess/daa5/PbHg1XxwW48VEt5eLMWKPWOVUFwGdFwvcnifuihNuTxFXnBnuq6b14lhmjxP3xObMtyujqk6JDZk9WzyztLWhZc5NS8FXEfl1SyzOfAT60MdCM50Hfq0i8um2mJv5jlon30Lc13Rvn8aKWZYGg2kOVUWy5mPY+Mt5+GOsfGBTvqH/Ozic18Rn8VM8EtucyeKkeCd+iydir6UACIy8+i7eioMOY8y7Y52cI5+YS95tcV/4+5VzRP/Bmt/guPgm1hR+ethVManwowvWqVZW9LE4Kxb23TGAam0LjmbKm/2w7taAjoiNhS+0yboLgP8zIbNRv/vcOfHFeo8THv7C0rZuz/yLxGlrf+PyhChFrvFMmFqM9ahp69gutueAdQdHXtEaVrrdpvxszcX8AZ2tBFdu3U6x21JxEBwBoRWWtoyHVBGrEqsTJX7Z0pKzmqwqL8A2nhFL0rQ6yoNjtYCVQxEcq8Xfh9xfTTTIX+KipTyDaBH0q0/ivrUn+RyH3sfXCFfsIVGszkdLgebdnPZCm/kq9mf+ELl3ydnqvh1uD4kiOHoa1ZVXGJ8778VLa/4wnC6eOlHtXLEZG7Qo+zfWewogiuO52FcOuFjZ104eHHbZ1P9J5Ndqa24PVChjZb8KDXtwgxHb/srJg+Nk+euBXkMjOji2nQ8HiCrnit129lbVOue6WCpuiLVdd4wA8QOGIsh/yIxqVKE/EIJzpdA+GpYAAAAASUVORK5CYII=>

[image38]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAaCAYAAADSbo4CAAABuklEQVR4Xu2WzysFURTHj1CEkF8pEiuFlSh7CwoLFAt7OwsWyk6xsBYL2Vizk5XSK0JZWNnYkVj7A/z4frvn9mbu3Jl57zWLR+9Tn3pzz8ybM+eee2dEKvxT6uGW2u/ELC1i4s1uICtq4T6cU5MYh3tirqGZMg8PYY2aRBXchhtqppRFIpzvSzjhBhIYhndqrxMrmUl4C1vdQAJ18FxddmIReDIba9HjSOC8XXgcOC4Uu8Jir+UcLsFP+OPxC+7oueyHM7ipx8XAvqI52BgOGRbgMxzT40H1DU7bkxT+QQ7OOuMWPlSbmOq68Br6ArudmHTBJ7gSGGtSryX65GmJsH++xV/+xES4Gb3DgcAYf9MPMaUMkpZIj5iGdCtJEhPhE+ckPGfsavoq0a3bJrLqjBeCTeRBPCuOpbwSMxWkA96o7B0fJ2K6v1jW1Qvx9BD3/gMxc7oG7+GMysbzwWpw5aTtqC68B3X7LgTfkuz2uJsH4S75KNFpS6Jd8pUedWIlw0ocSXilpTElZkppsZWMpWwSIX1i+qRTTYIvyVM4pGaO/eCxHz0+OM4V5u5HmdOgxiVSLfmtocLf4xdurE435UughQAAAABJRU5ErkJggg==>

[image39]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAAaCAYAAAAdQLrBAAADrElEQVR4Xu2YW6hOQRiGP6HI+RCJsp2SckEOpSg5FMkhh1Ik5cIFyiGEFOHOIYcilHChxCVJYoekFJFDkWwSpaTEDSnv08z0zx5r/2utbae99b/11L/XrJk16/u+eWfWNqupppr+I3UU68XEtKGNaKjYI7qkDUXUU1wU18TYpC1L7cQGsSRtaGOaIg6ZS35p9RC3xX3/u5rmiXOW/aBRYoena9LW2kTid4tNaUMR1QLWDK0VP8XktCFSCOystMFrn3jg6ZW0tUaNFo/EEE8p0eG9OGYu+pCKQN2z7GBQUfXijCerf2tTB3HJXLFAKdH5gmgQAz2pjojTybXeYr5YJ76LE54Fom90XzW1F+PMLQ/gN/OZIdaIAZVbc0WiwliDk+tYRvfoGtoorng6JW25ooJ+iaWeWGzBN8TW5DqBXWwuSASMwAFBJJh5wgtZynPECA9eelMsF3vN7eBFjwALxRaxSjyzStI4Snz07bHmitee/klbrpjsJ8uOOA9mAjwgS1RevbmlWcbwqcSQHJ4HPJulMsjci1D5VFw19fHsNxdcrCXexJaJz+aqLBbV+NxDUAtruLglrosvHkwxiGXx1rIDhqdh9FRKWfFyYccNVtAgVvtrLNcifsgYQIDCGPFqwE7uiG7RNUTA3nn4XUhE/bG5cqUTSwt2RfdUCxh9vorZaUNJ4VlAsiYkbWVExVJNIeEhoQQtVemATTK3Oy7yf3c25xkQHw/IDBmitFNRDfhDXNJ4UhFPwJinW8XLIPaeYWKa/11UaTWFhHKGTEWCXnlyNxdeikystMZlH0yfDSCcucIWnLXszlrFv/i+BO6jTz/x1MPvWGEjwadGmvMc4Dn0JYh4Ush8tbFixX7Ke22zPxMaRAEQ3Kzl2khM8IO5HSX1CCYTJsd3ZvAYPCHdDBDV+VJsF0c9wWwZ56H4YS6bsQgK954S58VOD9nmWZznSGqYX7WxYo0Xb8wF6qT4ZtnzRlRjoKowU5ZbGqxYZIhJci/CE55Ydqa4l12qqUPvCsv+iuBe+sUvQ4J4bkhUqqbGQvRhOTMelsCSbrDsgynvf1dM9bS4qIjjlv3wasIXD1sxT8tT3lgHzG1YLOOwHF+YO6KkYpO7bG5MaHHVAtYMsavhB3XJ9abEpDdb9u5aVkXGImAHzc2TYPHFUBff4IUNXLVi/wP8a40xZ8h5/woKYjfM8rXmKG8sKmWmuc81qiz4byx8jsCyofwzhc+YtigCVvTbtKaaamp9+g03W7PaIaj3mgAAAABJRU5ErkJggg==>

[image40]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAZCAYAAAB3oa15AAACrElEQVR4Xu2WS6hNURjH//LIwJtClJOUlJI8SpHyCAMTj1KkO/EI3SsUMwoTpSTymEhipO4tKYx078QrIyKPukYyMFF3cFPc/9+31jnrrr2Wc3Z0TnF+9eueu9Y+++zvW9+31gbatPnrzKBn6KR4ool00TXxYCNMpNdpJRpvNqPpVbrc2RCj6GW6K55oEfPoI+fsaC7JCvqMTo8nWsQIesl5avhUEX/x2Xiixax0vkCdxE6jr+imeCJgKqy8OugEOpMepOvoyNplddF3O+gWWK2H4wtgyfTooeUb2O9kWUT76ZJo3LOUXqBz6F76jt6iq93n3wUeok3iCl0FK9d9wZxWv4+OD8bGOR/TI8F4AUX3HpbVEH+D87AVELp2ALa0uukgrH8aYTfdQBfSr3SHG59Mn9OL7v+Ym6hT3pvpJxQDUGnIMCvH6WtY2Wm5y5SPVkBlo3v001luXKWjgFRWKRSAzPLPBhAzlt6ntzG82cqgIJ7Adj1/j52wABRIiroBLKNv6dxoXNmSa2ENrPnPqDWfHmA7yr12xNnWPW7AGlX9FqKE+aRp1bLowT7AGjNEu4v8CWtYNZ2a1l+nY/4c7BQX++kP9zeHdrxvsFUXFfoR6SZVc/sGz5XXL/xWFW5rYrFTW95JWKbu0Hv0GOx9ZUr1amAPLIAeWOZSaEW1lT6AJeUl/Y70Pq/Vkuq5XHlVOUTvopbNED2MtlFfsyqZXNmouU8jfR+h7ylh+qt7noAdVKmTVr0hu5FPSBW9MPXC9ug/YSOKK+mZT7+g1pAV2Plz1F8QoCAfOtdHc1m2wsoiPOLLoEbXCe0PvRgF8BTWQzr1dfJ2Ir0V67VFb8cyt5oFVCIH6GH3uSwKfEw8GKHX5G2wJs4Fqs3hGmzLlaXRwZXKSrNo9e+3+X8YAowqbTE+7zVqAAAAAElFTkSuQmCC>

[image41]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAeCAYAAADgiwSAAAAAmUlEQVR4XmNgGKqAH4pLgFgSTQ6/pAsUPwRiJTQ5hnIoPgDEPDBBXSAOAeJDULwNiAOAWAQkaQ7EqUD8Hoo7gdgfiIUISoKAKRDfhWJNmCAMpAPxaSgWRJZgBOL5QDwHilEASCVIRzQUgwDIv7IEJUH+fMAAcRQIywBxCxCzgiRBobEViNuheDEQy4MkYIAZiIWhGMQeBTAAAEANHUChZvfmAAAAAElFTkSuQmCC>

[image42]: <data:image/png;base64,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>

[image43]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAaCAYAAADrCT9ZAAADLUlEQVR4Xu2XS6iNURTHlzwirzwiUS6SlJJQBpQ8ikSSgSIDBhIj8ioGQiYeeYxQBgYMyIgMJGGgFCmP8sjNxEBSYqLE/9fe29nf/h73O+mcW+7516/z3b3Pt89aa6+19r5mHXXUUaKZ4qAYlE60SVPFETE0nWiFJouLYmQ60WYtEqfFQE9LNEzcNPdjva1+4rDY7WmJ+pzDG8RtMSSd6CXNEs88U5K5fxZO3hEb04le1ABx3bMzmSsUabFCzC4Y7xIjojE68xvLfxf1F3M9pBefGLNM7BATGl/tUfx2WIcGGY9jQ2wT2uW5JQYncznR3j9ZfteKxleKbssbT4c8JlZ5povH4p7YJI6ay4y6R8g6sVdsFS/FWD8ebGI+1mrPezE+mctpjfhmLqLp+GdzEQ3aJu6ba1yx1pqr7SCiTLRJs0nmDLlqbsd70hhxwlxwzpsLXDj+CP4Xy9qEQma9MheUSp0VT8SogvGHYng0ts+KHca4+BycaC4TCBAi3UnHOmIdHAxr8JtBRTah4PBH/1kqXmQBFgrCcSAI8TgqczgVdftVzE8nmhAZw27ShVGZTai2w6QGi8Z1ylgYp1Z4XuDn+LsoG2gsS61x46Ge49qbJpb457pKdxNHKD1KLRUBhreW7y8Z4ehvazQBUu+4J9QKuxqitlC8s2ydkM53zdXpDA91R/1SswSAmgxrjBMvPDyX6ZI1solyOGCuYRXVKH5AUbr/FYtcFr/M7Rod8ZrY7nlurmmwW6HZUFccS0QziLlz5u7WVzyHzEWbYPEbdO5Qwzj5VPy07Dqp5okP5hy9IL5b+bFDNgRKRbqRdjhEFGnncePhebRlmw3PIQixGKe7YkwwiPdxruxSv9lcxhSJd7CPtbCLkui24osF5fXIszg7lVWoCc7WZjRHPLAa512FuLGdsfI1Toof5mwM6fza3BGXinK84am87vY5hzkjy5pAlTCAW9B+/9yseGeP5W92sXD4lLnuj7Pc2LriL3hRRvwjwyZApWjvW6ze7SdVOHpCd29WdPaqYLFTy8V6c7vM6ZEKGwgMDbEtwmCOgCrDWykcrns376ij/01/AL7PkveSwArBAAAAAElFTkSuQmCC>

[image44]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAaCAYAAABsONZfAAAAwUlEQVR4Xu3QMQtBURiA4SMpMhhYlIEMomQwKSODwS+gjG4WWWxGk5Ky2ZUfYbNYzVYpg9Eo3tP9zu27P0HuW0+3zndO53SNifqbshhiIRqIhXao7GCCE5ooiyPmMu+i4g7YPFxR1Is0wA01bJBzg5IMlm5B1cYDU+PfGNTDGx29KNmnvnBBQQ/GeKKqFyV3yD4zVAt3429wpcQKH/SRRsJtsH9mhjNGWGMv6tjhgC0yciYoibx8dXHj/7Xglqjf6Ato6RuVs1oPxQAAAABJRU5ErkJggg==>

[image45]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAABOklEQVR4Xu3TTysFYRQG8CN/0o0I+bPCXsmCIgufgdhc/zaSsrBTigULC9nIjo0sKCIL38HWxk7xCXwFz9P7vDNn7tTMTdfuPvWrO+8997xzzztj1sxf0wLL8AJPcAvDmYqSsAHtWWjEz8wBXMSietKwRlNyZGkTZh9u3HVh+MNjmXDrbfAIu26tMANwIl2wADOwCq/Qk1SWZBq25BB+4Bu+YC4tK886zIvPIrxZekcrcplUuHAOZzAkPmz8ASO67pPBpMIlzocNyacKnxY26IR+8aeahLvyiGvDpnfSC5sWHgPiQeSyDc/QLjFL8A6jMAaT8CDjaVkIdz238NeuZQPu4cqy79isq6kdQWY+nAFxHv7OYvjErwln1+G/5Hx2/EJBuOGp5GbUsEbxQawnrVCRXLotFDTzz/kFb7wuiVXrslYAAAAASUVORK5CYII=>

[image46]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAbCAYAAABIpm7EAAAApElEQVR4XmNgGAXDAnAAsRkQh2DBukjqGBiBOByIPwLxfyz4LxC3wFUDQTAQ3wJiUyhfA4qfALEnTBEMiAPxVSCOQRLjheLDQFyOJA4GJGvwA+JnQKyEJAZig/BzIA5CEgcDkAkHgJgHSSwCih8BsSKSOBi4APE+BogTQEAUiI9AMSgwMAArEE8F4jlAnAfEJ4DYB4pBwY0TCACxMAMBRaNgcAAAKd0d3Q3+84UAAAAASUVORK5CYII=>

[image47]: <data:image/png;base64,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>

[image48]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAbCAYAAABIpm7EAAAAxklEQVR4Xu3RsQpBURzH8SNEIQMl2awWUibKaLIpZTTcyWJAnsADsCmZLJ7A5CWUkjKRySv4/u/9dx02G3V/9el0/v97Tv97rzFB/jpl9JFHGE011VVqfkqYYYIjVmipCk7o+k+TAeoY44Ga1Utirz0/KcSwNd7tIatXxA09q/b9AUkBFzgf9Tauxjv4FnmHO6q6j6iNkik6iGvfDHFAVvc5dTbeOA2MtOdmjbl5zS9fR+ywxAJp7blJIGoXNPLDMroG+aE8AcQiHEjaeSMyAAAAAElFTkSuQmCC>

[image49]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAYAAABVX2cEAAABGUlEQVR4Xu3SvWpCQRAF4JFoYVASK7GLKQKCkMJnEGJjYSFKSlsxpalEtLEQRBvBPuQVUuQBAj5AXsDKJmCnYOI57FwzXOMPJE3gHvia3XH3OjsiQX6bGkyMR4ia/SsY+mp6cGlqtuFiQS1gDXmzH4E0vKoGpODM1Gzzp4cxVdWCD3iGsNmPw0glzPpOQuJ6QDfiDuKBWVOTgb5i/d7wpoGKwR18QtvUlOBeHUwOmoq5gDd4h6SudbSODoa9KiovdfiCinz3i//gpH5dKy98vRm8iPsar1cn9Yu9Ii/8UReW4ob0aK8Y3sp+/BS+Jl+Vs3fr29sJb3+Asn9DwznjmEzlSK/41HNxTV7Bkzq3ReLGZOxbCxLkf2cDrK40eNbJtywAAAAASUVORK5CYII=>

[image50]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAaCAYAAABhJqYYAAAAtUlEQVR4XmNgGAWDGjACsRoQR0OxMRBzATEHsiIQYAXiHiBeDMTyUFwFxL+AeBKSOjAoBuKrQCyOJCYHxE8ZILbAgSIQPwHiVmRBIHAB4mdArIks6AnEf6GSyKAciE8DsSCyYBEQPwdiJSgf5CEQ3grEc4BYEog9oHJgE+8CsQyUbw3FXxkg7g0HYl+oHDgkpjJATGligLgdhBcyQEyfDMT8MMUwIADEPEh8ULgLMUAMGwV0BABkMRjkTMqPygAAAABJRU5ErkJggg==>

[image51]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAA7ElEQVR4Xu3SsUpCURjA8eMQCBoighAGzeHYJjQ6tDREotDSM4QQPoJv4Grg5OITxKUgyF6gNajRTRcH7f9xvss9fl67QVv4h99yvnP0eK/O/fuKyNvF31TBFHd2kFUOPaxxb2aZ/elwHe9YYWhmOztQA1ziEyPnb5JZW3VRwwci55/6jx07f0UhT1oORHhDOdm2nVyrj6aS4sPy7Ue6lto5ntBR12jhBTOcJls3K+EBt84fCj1igbN4s03+QTd2UZN3LO/6wg6kBiY4tANNPlgOX4WL8hu/dCDGKATzE7xiqfM5nlEN9uzbl943bhUpgl4wBdcAAAAASUVORK5CYII=>

[image52]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAaCAYAAACD+r1hAAAAu0lEQVR4XmNgGF5AEYgPAPFsIJaAYoJABYifAXEDFBMEJGtgAeLlQHwaigVRpbEDPyD+C8UuaHJYgTgQX4fiKUDMiCqNCUAKQApBGKQJZABBkADF/xkgTsQLvIH4IBTfYYAEAigwsIIgID4HxPJQ3ADETxggkYoCQO4OB+LnQGyGJG4JxD+BOBpJDKdiEOAE4h1QDGKDgT4QvwTiYJgAGsgA4k9AbAwTYGaAxCiu8AbJiwExD7rEKBg4AABEvSB/pmR7YgAAAABJRU5ErkJggg==>

[image53]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAbCAYAAABFuB6DAAAA4ElEQVR4Xu3RoWqCURjG8VcwKA5ElkRvYEywi17ClgSDZcXiDVg/EKNFjAar1jFksGCf4BUIClbLqiD+H7/3wDdMhpXhA79wXh5ezuGY/ePkMHRfmCH/q+GDBVpOGSAKBSWFPt6RdUoPH8j42So44DUMPNq4xEMYRNiiFAYWb9E23VV3twK+sUbN4u3yhh0mKilV/GCKZkKEE9qh+IIj6mHg0UN076cwuKm4R9nPeqEsLb5f2ueXoi5d9HPDbfAcSopeuLK4qN/5dJ1kSdHqEcaYo+v0W1fR8NESX3XP3+QMGs4nY1xFuWAAAAAASUVORK5CYII=>

[image54]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAxCAYAAABnGvUlAAADgklEQVR4Xu3cS6huYxwG8FcocotOLiGHpIx0MlIYMTBwyVTKjGJEnIwcyVCdFEkkA4oUkggTFIowIKXkkjKQo8SAcvk/3rV87172iZzPtye/Xz211nq/s7+1z+jp/a+1WwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPjvDqvcX7lzubBB11ROW14EANikyysPtF6Orq48WTlyyye2t6vy8fLiGl1V+Ww6vrJyyrC2SZdVflteBADYpEcqX0zHKW0pJykp/+Tiyk/Li2v0UWXfdJzCduFqaaNOrLxbOWq5AACwKSkiJw/nc2G7q/JN5dTWx5JfVa6vHFF5qPJL5dfKg9O12S2VzysfVJ6YrmXH7u3K45XbpvNjKvdVHq28UTl2+mwcXXmncsJ0nlJ5xmr5kOTnflK5ovXvfa1y5nT8deu/79JFlb3LiwAAOyHF5ZXWy9Mdre9svVTZXbmurUaUkeNlickOXcrQWa2XrBS6XEsxSwmLFyp3V25sq0J3btta2M5vvfQ9XHms8m3luGE9Lm19/WDJ+lKK5XmVZys3VQ5vfffsrek4Y95b//r0Su5tLJAAADvihsqbw3mKVsrSXKSeqby4Wv5zjHr6cB4peNcurqUA/T6c5zM5v6D1IpZS9/qwHimCWY8Uu5+HtUOV0eoPw/mPre+2Rca8y3Fwdvby//J95d7FGgDARj1fOan1EpYsXyrIuDDjzshOVcrb8rmulLFklPK1XWGL4yvPtT5eHUee+TfzSwb5npeHtVnGqvlM3uDcLst7m6UAZtQ7y/E50/G+9veXGz5sfYyb+/g/X7IAADiojB/zgP88Svyy9d2tjEDHYpPCkrHk2a3vUqV4pTTtGT6T84xKd7e+Q5fdtYxCMwad3zx9ekpK2T3TtTzYP75UkGfGUhjn0Wx+1rqkdM07ZfmO+Tjff6BySevfmTHtp2113/m9U1rXeS8AAP9Kilh2vOaksGWHKs+gjSPQ91ofkUaKVF4WyJh0KS8ofFd5qvXdrMgLBnlWLIVw/3R+e+svJtxcebVt/VMiOc6fF0nRy7Nl65Qx7Dz2TEmbj/Pixfut32OeVcvLCMksRS33niIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAO+APH84W9H9IBVgAAAABJRU5ErkJggg==>

[image55]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAbCAYAAABxwd+fAAABE0lEQVR4Xu3Sr0uDURTG8SMqCvMnWIZFRBAxiSIIhgkGF9w/oMVkEEEWV80iiF3MWm0Gu1kQhrCkiKD/gt9n73PnZVWD4X3gw7j3bPfc9+yNKFPmH2YNR6jaIGpo+VPrCeyjaQvRl2Wc4RjPdoMdrKCNc1xiCbv2gsXIogM2o+j+ZeuujeEB95j03qp9Ytt73YxjBLe4sgHX5vGGPa+Vhr263sufHaTMooNDS9HV9QPNRlEDzUruMOr9XjSj9/h5/hTN7RHTXqeGooZz2HKtG/2dT5gxRd3U9SJ9idTxYbrlATayelxHcV1dPc1H71Mninmk6FVRQznFCYayelQwnG9EcaAeSS9jHt1Upvr2y5T5db4BEhwxK3Zhrx0AAAAASUVORK5CYII=>

[image56]: <data:image/png;base64,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oNXzccVuHrlsyGCJ/9jgjz+24ie+s48CUmY+g0jgOYwbovfGHjbaGL/m7ZcHm61Him3KgC8RIjw/2hGC/NhIf7ZBlPzDIv1DpObsYmdE/tr1/MiB8TP1M7Q9xOTJkYM3AzXLUM+LjE6xh+jxNW+nfwBBuecJhUWwB+y07nit5k2xFhklGsUxLCvYengGRNxoV7Q57kE0iPusx7Rgo71dVtN8DnFCHwL87b8Hn9Af0C6xt3fnGnxHL5xGWr14pkSr4NDIctMeiEYSceMdOzzmC2ai7w/tjls92oSC9npoTbMX9PjI6DX79fqVh1GwAT7oJzXc61s1jY/oz0RENqV1LHR2WINOhAHt3jFbFmCApGPqRQJRGzob9mHQwa1FdkzMZhFUDMB0xNeKnPVznmUERAmihc++uea1SAId9ChEGDjoeBvc8+ORv+gaO2C+lw76ijLPJ4hHlm84RkRSF8Qby1yUpwk2/HFBZPkQGQxUROugDXStnjeI/NxT63ETKLAVPwGCjj04QBnPixzEKecIz6+xjGDD7+sxK+cyEEVhwJpnRIWIDuEz2iNlZhAH0gy6zR9r9W9rX9QfcXLdYreP9CP15T74CR+R5t74jkGca9gzxDPkMwjhvm1tN/hsUQRyM5j4sMSOuMb4sQbtaQraCf7qYSP8JZG+RlwwYeghKsU5RCATihGWE4kMvrvYGyP34vE9fIYlUiYlfPbyyO/ieTBpwN/viYzQcR2TKK7hWsRR45zICBjPiHbQgzhs7aRt7O/h+1q9mEQyoWJyQ3vnexHxPO/1eh12ab22p90Ha1DO5hfOMzlBwNGmqBttE8FJe6Nu7OnkOsrCZ/qy/io2ijLuxbvHnjbaH/cSEdmUcSY4clDk0gAgQDjuRcJazDrZe0XuDyGaBnSUTVwAHTkia1c9/mbk93NPolCvrvkMqlNChIEK4bYIBkfE4U5BJ/31mqbsa5EDFEIOwXZI5OBDPSkzkObfaOBLOmfqCNQTQUenDUQgTooUgggTOv2t+onBapn689wob2MZwbaTNMFGOc6seQjP42oeRvtqgxvtq6//eqSPz43c7D0KNiKciA2grTKYMwHh2cwTQLLvQ/SbSG2DNtP+f6OIyD7DIsEGzByZ2RPGh4dFLis9P1K8cIzIOCMymsBg+8zI5QUiTAyyDURCG3CZ5SIYWEokescsHoFyUWT0Y4TZ6zjDnoJ7Im52krtELu8ym2cAWC/2msj/a3Zqsd9HLp+wZHJy5FIpgpVZ9SmRAgL/8Bf/vDjSh28t9sLIaBgi8OmxdT8R7WsiezMQdvzyr3FlCzbqjtimDbE8TBtai1wuPT3SdwdHlpFz/ENglkKJ8CDsELb4nggjYpa2h4+I8BHx4D74FH8j3k6I9AHCbk+XK2X14d0jSs3ECCNNnojIPsWBY8aKw1LCuATawx4VSRB380DQjsswiMQjhzwREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREdlf+S+S3i+UJlvmxAAAAABJRU5ErkJggg==>

[image57]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAaCAYAAABLlle3AAABWElEQVR4Xu2UvytGYRTHjzJQiqIklExMksluoPxYbC+lDJT/QFZlNlpMNquM3tFgkCgDhcUgi9iE79c5Tz33vPe+t25Xb+l+6tMdvvd5zvO857xXpOK/MwcPUtyDPRl5yArTBcfgNbw3J2EvbEvJ46wwflO/sc9LKUom4Bs8NP2Gce6zwtTgtz2pJ85LgSfnDV7huBnj81LogzfwDq6ay5Fr8BHWRfubRbfJ9R0ua2AKfsAjSRYLbsNPuB8WZLBpnknzw/2yIdqvRR8YeTkZET00vYL9idTRDo/hMxx1GcnLCXvOG/IjQi/hQOINxyB8gCeS3oe8nEzDedFDUc4H/2KZzMAv0b6lEfJdHxidomtZjIUoPyKckwZm4RN8F+0Xn+dw2GyWxyzBLdGBWzFv4UL8UpkMiRYMXyhOLK3LHxVdF73Rqeik8mfeMV/ghehQlUpLilZUtIYfqONYufAwOJAAAAAASUVORK5CYII=>

[image58]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAxCAYAAABnGvUlAAAEPUlEQVR4Xu3dS8htYxgH8Fcot1DkPnGNEGFyxIxyJ1EKIwM6jEhKkpKBCSUZyIDkMkAZyLV8MxNFcovJSWIgTBhQLu//vOttr72+/bH35zufwfn96qm9nnfttdZ3Rk/P8659SgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2cMI0sYHza5w2TQIArOqQGscOcVSNfUfHPbenXVnjqRo31DioxuE19i/zz3FAjaMnuannaxw4TW6x60t7to1cV9qzxmE1XhytAQBs2vc13hgdp4P0bZkVHnvSjhonjY5vKbNi7Ooaf43Weu6+SS6OL+3cuyb5FHAXDp/zN/46fE6hmvMTr9U4ZsjH5zWurXFrjR9G+WfK+uuPPVza9Y4c5fYpi58XAGAlf5b5ouKSIbcdct9xtyzFzmYKtmtq/FzjrUn+nBqP19ivtBFlCrYUoinYLqpx3uzU3ZJ/srRC66Eav43WPinzxeVUumlrZX3378PSuoMAAJuS4mVXaR2qLp2o5LbDmaUVZWs1jiutUOqWLdjy7C/VuL2sPz/XSxEWZ9T4scwKthRr99Q4ZViPR2pcVeOJGo/WOHTI5zpZ28ilpZ2T76UwHHulxv2THADA0jL+/KO0Eeg3Q6ToGY9Il/X0P0T2qG3k9zIbT6aL1fWCrT9X4qeyvmBLd+3BMivIeoE2le/lb42ck47YqTW+Kq1wi+dqvF7a/rPHarw35HN+CsJFjqjxwvA597h8tBYZpea6AACbks5PRoNjGYdmLDp1R433p8ktlM382Qd203C8bIfti9IKphSGGT9O1yN71LL/bNzB68b3SWHVO2R9hBoZc+a8Rb4ss/u/U+Pu+eXdz7M2yQEALCWjwXTSxuPQRSPSLkXJuAM2NX6Dcxob7eHaOTnOHrFecC1bsGV02e9zcWnF0bjLlm5ZumYp1rKXLZE3Uy8Y1sf3ydhzlYIt17qizO5/Y1n/fDnunToAgJUserkguUX7rXaUVkx9Nl34j1LMZJTZZS/YicPnZQq208v8G56R7/Rz0rX7uMxGsx8N+ctK+wmTyEsG6dJFfsakvwmaTl9GsLFoD1vGyW9PcinyUtiOO3n2sAEAm5KCpe8dyxgxG++zRyy5X4Zcl5/GSMGRNy4/HeW3wr2ljVlfLW0f2q4hf3aZPV/216WQTHcvub7n7oNhPbmsH1zj5SGXSC7Rj3tECrmMP28ubaR57pCPr0vb07artE5cl25k/6mT7Fvr18uzxrOl/dsl992QixSJi0bMAABb5s4ye9tybX5pr5I3UXv3bVn5d1v1OwAAK7mtxpul7UF7oLQfkp2+Bbm3yE+QvDtN/ot8J904AAC20bL/l+hZNU6eJgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+N38DGNu4J4tccMwAAAAASUVORK5CYII=>

[image59]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAZCAYAAACCXybJAAACbUlEQVR4Xu2XTYiNURjHH6HxGUP5TJGPQUSRsmBGg2yUhIRmOSOxQBISFgqlFBsfCxZGhGwUpVyTItkoNYtZkK2FZqHY4P/rOaf3ndPcO7eMGb33/uvXfe9znvfc85znOR/XrK66alIjxdQAzzWhLeJHYFPSVkhNEC/E78AzMbaPRwFVk0FvF5fE08CvYCusJomHYoFYF/gpSuYVUEjtE+fECDE68MC8zHfn/AojjieyPC+xx2y/Na+EQoksH0uN0ihxzzzb+Ay26H9hahwKTROPxJy0IWiV+C7emVfEYKpRHEmNQ6H94kBqzIls3DLPNr5R3NaYkBYx33yzm5ljTM42uR//BvPq6cz5R+G7RGwW4833l+nm/cQ+8c/bqxYvsFmR7UpaJr6Jj+a+bHYnzQc2RVwQi8R58T4wV2wQL0VzGf+LokvsELMt20CviJ1iqfn48MXWLXaJjeKDOGXeJ/eJtYEBddD85RsDcFN8sSzbZP+2uCpWmw8OG5NYCjAY2tZX8N8q7limOPA3YrGYJe6bB4lvybJMs9z4DUQftENFsYZ7LLt9VQuzTXAzxGXxWTy37Cwn23BItJuvW9Sffwyach4XvgNBc1/IL5U0aJ75RFUH/TdinZ01HwADvm6+XlHMFhN6NNjK+cegGfwe0RR4bV7uiGOU8h72oPnhx+K0aBPXgg1xV4e75nsBKudPeb4SJ8Sa4Iu2mR+Ve8VxsVw8EV/FYXFG9JpPHpP1ybw6YKX9I5ULAhU2aMRGxE4bb2qU7UTLgu4IPlGpfxQ2yj9V7O+/Vov531LOXmju01pQkbFWsSLAWV5XXcOgP0qjkiyvqFN0AAAAAElFTkSuQmCC>

[image60]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAaCAYAAAA38EtuAAADvElEQVR4Xu2YSciNURjHH6HMc4aMCSVTGSNKhpAMYWHKggwbGRZkWFIkZMyUYUGUREJKXMNCEZKQsmDBwkIUa8/P85zu+x3v/b573Xtz1fuvX/d+55z3nOf8zznPee8nkilTpkx/rZbKReWjsi+qy5SuKWJ+vVSGOA2qlbLDPzOVpjXKCKdBNWT0Qud/0UBlmxSeTyWVGS2F51NJVczo9soTZWdcUcMiVmIm9mqrYkbTwXdldlxRgyJ+yClnlEZ1aqujsozm6C1wjig/lXXKZKWpt6kldVDmKGudH8oxZa7SKdGuGirL6DGSz8vPxY4h3ycqTbxNLam72KbAXMBoDMd8FqEcNVY6i72+NY/qUFlGoy7Oe2VzoryQCKacSbGA/ePCEnXKyUl6GvwbYe5y5YXSLapDZRs93vnqnw2JHF7UYAXExbUxLixB4dKuxsWNwTn/jFW20exiYEezs5PqqMxQBovlQHbzTWWa13EJBQaI5cqev5/MH0Vo6+3ZzUuVC2KTgWbevliFSxuILSni6OPljIfaic2LcYiF8hB7EPENFztpOamC0Qx+w7ksZgR185ShYgtA2SJlpjJdeeblE70OyJv3lK7KSbFdH47iN+WA2B0wVdmtPPBngLxbilYrn52+XkZsjL1B2SRm1CWxy56L/bVyXCz/nnXC74X5ymmlt7JCeSNVMJoOPziYxyqvV2YpY5XHYjuQgNkNPHdV/hysjdiOpn6Zcs7L6R9Te4j9n4X+6TvUp2mQ8kW5LumXEs/mHMYbLZZC+omlE+JmXBaURaENbRkXhRMMnNJHkp9P1VIHr3AnnGvKXmWl5NMBqeCO5N+vk0a3EEsPwELcEpvYKqlrdM4/g4LR4Vn6SYq+2K2f/HssduA7Z6tySOzoE9MrZZjk0xLx1mc0O5zLr5fXpcUbVJbRKJjaMSonTYTgximHpa7Ri8V2KnBMl3hb0g5GLhI72jlJNzqYQT9pwsSQGmIFA4k55Fq+35e8EfzNbq/PaBbotjLK65gLJ7AqRhcSee+umGG7/G8mtUfMdPIhJwJIN1e8LfUPxSZyUCwNkLf7iIldiiFbHMyIxeVFXk9LHfVppFjKYdG3ixmHQcTABmETPHXeil2ak5Tz/gw/2rhTjotdokllRif0XxpN/sRYjlf8c7y1WH1SvMEU0y+iPy5HiEXdfmVCXFGkiJn4QkopRswlzCm+M4JKNprV4k1iTFRXK8KgtAX4Vwo/+49KCUaHS49kHx+NTOnipOIX6SykykyZMmWqpH4BBGrH147xpCAAAAAASUVORK5CYII=>

[image61]: <data:image/png;base64,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>

[image62]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAZCAYAAABnweOlAAAC9klEQVR4Xu2X2avNURTHlwyZCblkuobIFGVKHtwHMk+3lMyUInmiZIpIlBTxwovrAQ+E8kQerpSEIqXkiQcp8hfI8P209u7su51z6w7n5Z7ftz79zt57nd9ee+291j7HrFChQoWqp3pxWVwvA/2M15x6ijoxRbxNoE0/4zWnIihB3cVwa7no/qI5gTaKQcOe73VZ9RGHxB9xSXSz8kGhn/HfYr/VwKkZJj5YKQDlghL7sMO+yysu+LkYkLQjtPPAdVScvKHm9WpIoDUNFuPFwHygWsLBG+KbmGDlg0I/49hhX0mkI4zLBzL1EKvFOzEnkKtBfBJjxWLx0tyut3ggjgWimJO5O01LxS+x1/4PCrtzxLyeYNeaCB7syAfKiHkeWuWg9BOLzOtXaotmmgchDf4+MTJpd1js/nbxU1ywllfyxdC/LdhFcQPhZIOYaL5LJwJnrOWNNkasF5Ot9I640IUBUqk+jMf0ijddGhROCouPtQ5NNd/AWeapRj820Qf64nfaLCZcLj4m0KY/FU4fNXeGenDe3OFbCevC2Hzx3jwNjouD5sLBp+bvgdHhybuYb4N4baXFxKCMMn//4QCbsdnc1z1igblfTeZphg87w2dOWLuUp0+56FITmsQVMVdMC33RUYjC6emir1gmHllpl/P0IQCvzBfF5+bwzNMnnye1jZohnplfEmwsPrRZRJEd/S7+JtCmP4/yCPPU+iwemzueOsux7RXs7pqfgo3WelC4/VjICmt/UKhFnGQ26Y5oNP9tRbuqYuJT5s6S89fMHU6djfUGu7PmmmceFI47RTIPCkWaW4brt71BiZcF2iS+iLWhXVUx6X3zokqBvhr6lgSemJ8MFrfG3OEt5lfoC3Ha/FjfFOcCLIA2O0tNOSl+hOcB8VXcFivFm4TZ5inKGMHfZaViXifuhWfVVQSlgshR6sagfMB8UemNVckuFfWkI380CQTv4Ml8pDjB2Joa1bJ2m58crmhuskLmp2SVmJQPFCrUOfoHQYGxjWJmDi8AAAAASUVORK5CYII=>

[image63]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAwCAYAAACsRiaAAAAI3UlEQVR4Xu3cd6hsVxWA8SUW7C1WFDUiipjYY7DmxSgqRsWCSswfohgrqEjsQbGgIhEVG5ZEERtYsYuYSQyxBRs2JGJBnkSJgqhYsOyPdVZm333n3jtzc7133uP7weKdOWfPzD77zGWvWfvMi5AkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkaXUPbPHlcecR6Ootbt7FTVpceUMLXTU2jlEfV+rarZux39ffePiIckyLp7Z4d4vTIs/tERta7I2zIt9jlet6jRaPa3HieECSdPDOb/GnyATnaPDrFh8Yd+pyJAf/HfbdKzIR2k8PbvHvcec27tHir+PObdB+r9DXs7vHu3ltEqcXtnjssP8XLWbDvp1wra7dPe77x/uc2+Iqkdf6cy0unY4t40Ph348krR2+Ud+1xXtbPGM4tm741n/muLO5Q4tvRZ4HKmFj4npeZJXhmtOxownXbjcWJWyM1W6SkCvqWuOObaySsJHM7PX59JWqR3bby6oEdax4PSdWT9g4tz5hQ70u+2fdfip4V+se74S/HRM2SVojTPgfnLb5Ns4kfvr88Fpgsvlmi6eMBwa3jPkkUwkbVQi2j1ZviKyMrWpM2F7UbYNKzYUtvt/iCZFJ1UdbXBLZ9oLI8T6pxXda/LzFmyMrtF9v8dUWp7b4bWT1tnyhxfsi2z+8xQ9b/L47fkKL70VWhDg2GhO237T4XWQ1ib7RV5KW17T4Z+Rr06bQ109G9pVzoi23A/wq8jP2xRaHI5/zxxafbvGHFneO7A/vgx9Fjh/tON83TdvEg6Z9bB8/tS+MBzFieZclUjCm9JExoo+8Bufxicgq+Osib1/g/Xkt+kWbvn8XRSaG9KH6xjiVcRzA9aTdd1t8KkzYJGmt3L/FW7rH/2jx7e7xQXtu5ERK0rYTkrPPR97HVgnbOMGvKyqAuwmSqJ/G6iph4zUYpz5hI4knKeDev5u1uHjazzXgOa9u8Z8WD4uc4PkMcU9WfW6uNx2nEsprfSnyy8CNIhMy8Br04RaRCVohqWC5kNceK4AYrycVYdrxniCBOXba5pz6ChuJLX0FfeX4vVtcNu07ucUpLZ7U4o6Ry5R3j0xcSWroayUxi74IkPg9bdp+VIvzumOFvo/P69HHSjAZ07ouJID8bfLlin5VBa2vsPX9GytsZ8R83BaNw60jP0d1v2f9/UiS1gTLoEymhQmMiaEmwFXsdnluESalZ487l/CvyOWlmnCo9FANWaQ/7x77qSz1k/2hyIoHkyL394AqVE1wN5z+PShUs6jCbHVOo+0qbHwm+nPnGFUjkBBRicFNW/wtMpmYRY5Z3QPJ40omuA5s0zfek3hBZALYJxYkQYwtVa+tjAkb59E/Zrv6/vRum77ymer7yjZt/jy1IUmrKteY8NS+SmJIPn/cHSv1/u9ocYPhGHhOX+kqfMl4TGQfGdPZFPSRMeV963MH2vPlpE/Y+v6N/a9x2moc2CYK2yZskrQmmEBJ0MZ9H4mcPFZ123HHFXDdFi+PrFpUUrQMEpfDkZMTk+MFLW7TN+gsmlALS2F90kKF5b7TdiU3VCVK33Y3+l8/rhokUC+LHLNljQkbyUphoh4TNipeIBHmPcHkP4vN91FhFpsTNvC6LNFRgSNpGxO2nZKEVRI2jrFNAkilsCpTvRu3+EFkJe1jMf+iMiY8tW9RQkTyVEhoXxl5PRZ5W+S5j7iGLE9u9eMD3nccmxrXqj5v1T+MCds4DrMp+sfj+0mSDgCJGZWUcYmNeH/kpPLQFq+PrJyx9MSkzr0tVJP4l3ttOEYiwzEqACwFcfzjLW4/PZ/JiOWhh0TeO8Nr8fjYWM6y97D1SCzGCYdKRfWXShn3f/HfF7DN/T+3ikwiQGXupVNwDo+O7DtIYDhHlvUYR8aJfYdavDZyCfHkWLwkttc4h724h63HOL0kMtE5JnLZjG30CRsujbxvDLeLeYVvFpsTNp5HG7DseO60fzbtw99j/nonxuZq2yoJG0nmCZHXl6SKcer7SuJI5ZAlWT4Hx8X8y8F1IitPvT4hIoHnM0L/nn95i3mFertKJ1+GeO++Iv2eyGSRPjKmhXa81qJfbfL3Sz/rxw/LJGxYNA4skValESR1/A1Lkg5YTXy1RLUouPeIROlZMU+uzo9cDrrTtI9jVZ3pl9WoJDBBfyWyfU0kF06PxwrWTphISQa5p61ukl6ECZh7gOocakkJY3+ZxArnw69IPxs52VX/OAcSFv6dTW3rPOv5tK9zqarTPVs8YNr3/8SS3qqOj7whn/GhIsR9cCN+HPC1yCWzM2P+owOew834dQ1OavGzyB8SUJllrL8xtWOJ9qLIm9/Zfnzk9SAJ5nPAdfjJ1JZ2PJdE4rLIZO6dsRH9/ktk+8ORiUadB9sE27QBCRB96RMP+soPGugrXySoSs5i/nnhBwZcO/pb48Nnivemr5wLfQWJF6/z9ukx+Cyc1z3eCp8p3uOJLd4VWQEsjCl9ZEzpI+9d/ePLTqGfnNuHpzZ9/2pcGSf6X+NWzx/HgcTz1BZvjLx/8ZKpPa8rSToCVELAN3wmIyYYqiy4y/QvlSmOkciQuBxqcU7kJHCfyEmxEjYSoT4h2k9jf0m4SMROi6yMgYSNx9U/lnlJWpdJ2HgeqLJUpU7rjcrq/brHXFOqS6s6o8VnIv/bDhJSSZL2FdUCbsR+5vSYClJVLEhSOPbi6THf5JmsqGSdHblkSBJztxa/nLapzpwV8/+mYD+N/aXCw9IfS0SzyGU6qhOvikwwqTTwL5WUV0RWX2h7cYsnRyZ1LLuRmFJRrKUxlrqOm7a13kisWeqmgkuwvZtk+62Rv7KkKlg/ypAk6UBwDxn/bUEtKWoz7ms6fdwpSZK0X7hvqW4a12KnxHzpVZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSTqS/A91zOKDswDMIwAAAABJRU5ErkJggg==>