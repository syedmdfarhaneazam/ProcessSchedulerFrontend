// Socket service for real-time communication
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.baseURL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";
    this.eventHandlers = new Map();
  }

  // Connect to Socket.IO server
  connect() {
    if (this.socket && this.socket.connected) {
      console.log("Socket already connected");
      return;
    }

    console.log("Connecting to Socket.IO server...");

    this.socket = io(this.baseURL, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    });

    // Set up default event handlers
    this.setupDefaultHandlers();
  }

  // Disconnect from Socket.IO server
  disconnect() {
    if (this.socket) {
      console.log("Disconnecting from Socket.IO server...");
      this.socket.disconnect();
      this.socket = null;
      this.eventHandlers.clear();
    }
  }

  // Set up default socket event handlers
  setupDefaultHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket.IO connected:", this.socket.id);
      this.triggerHandler("connect");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      this.triggerHandler("disconnect", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      this.triggerHandler("connect_error", error);
    });

    this.socket.on("connection_established", (data) => {
      console.log("Connection established:", data.message);
    });

    // Job-related events
    this.socket.on("job_updated", (data) => {
      console.log("Job updated:", data.job.id);
      this.triggerHandler("job_updated", data);
    });

    this.socket.on("job_created", (data) => {
      console.log("Job created:", data.job.id);
      this.triggerHandler("job_created", data);
    });

    this.socket.on("job_deleted", (data) => {
      console.log("Job deleted:", data.jobId);
      this.triggerHandler("job_deleted", data);
    });

    this.socket.on("job_lists_updated", (data) => {
      console.log("Job lists updated");
      this.triggerHandler("job_lists_updated", data);
    });

    // System-related events
    this.socket.on("worker_stats_updated", (data) => {
      console.log("Worker stats updated");
      this.triggerHandler("worker_stats_updated", data);
    });

    this.socket.on("system_status_updated", (data) => {
      console.log("System status updated:", data.status.message);
      this.triggerHandler("system_status_updated", data);
    });

    this.socket.on("system_error", (data) => {
      console.error("System error:", data.error);
      this.triggerHandler("system_error", data);
    });
  }

  // Helper method to trigger registered handlers
  triggerHandler(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }

  // Register event handler
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  // Remove event handler
  off(event, handler) {
    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  // Emit event to server
  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit:", event);
    }
  }

  // Convenience methods for common events
  onConnect(handler) {
    this.on("connect", handler);
  }

  onDisconnect(handler) {
    this.on("disconnect", handler);
  }

  onJobUpdate(handler) {
    this.on("job_updated", handler);
  }

  onJobCreated(handler) {
    this.on("job_created", handler);
  }

  onJobDeleted(handler) {
    this.on("job_deleted", handler);
  }

  onJobListsUpdate(handler) {
    this.on("job_lists_updated", handler);
  }

  onWorkerStatsUpdate(handler) {
    this.on("worker_stats_updated", handler);
  }

  onSystemStatus(handler) {
    this.on("system_status_updated", handler);
  }

  onError(handler) {
    this.on("system_error", handler);
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket ? this.socket.id : null;
  }

  // Request current job status
  requestJobStatus() {
    this.emit("request_job_status");
  }

  // Request worker stats
  requestWorkerStats() {
    this.emit("request_worker_stats");
  }
}

// Export singleton instance
export const socketService = new SocketService();
