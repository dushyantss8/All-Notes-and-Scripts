# WebSockets and Socket.IO

WebSockets are bidirectional persistent connections. Authenticate at connection setup, authorize each room/action, send heartbeats, handle reconnect and duplicate delivery, and store durable state outside socket memory. Socket.IO adds fallbacks and rooms but is not the raw WebSocket protocol.

**Interview angles:** sticky sessions, fan-out via Redis adapter, backpressure, presence TTLs, and observability.
