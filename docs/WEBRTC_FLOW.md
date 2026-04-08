# WebRTC Signaling Flow 📡

This document explains the step-by-step process of establishing a peer-to-peer audio connection in Dev Walkie-Talkie.

## 1. Discovery
When a user joins a room, the signaling server sends them a list of `socket.id`s for peers already in that room.

## 2. The Handshake
For every existing peer, the new client initiates a handshake:

1.  **Offer**: Client A creates an `SDP Offer` and sends it to Client B via the server.
2.  **Answer**: Client B receives the offer, sets it as their remote description, creates an `SDP Answer`, and sends it back.
3.  **Local Description**: Both clients set their respective local/remote descriptions.

## 3. ICE Candidates
Simultaneously, both clients begin "trickling" ICE candidates (network paths).
- The browser detects possible routes (Local IP, Public IP via STUN).
- These candidates are sent via the signaling server.
- The receiving peer adds them to their connection.

## 4. Media Stream
Once a network path is found and verified:
- The `ontrack` event fires on both ends.
- The remote audio stream is attached to a hidden `<audio>` element.
- The connection state moves to `connected`.

## 5. Push-to-Talk Logic
Instead of destroying the connection, we keep it active:
- **Button Pressed**: `audioTrack.enabled = true`
- **Button Released**: `audioTrack.enabled = false`
This ensures zero-latency transmission once the connection is established.
