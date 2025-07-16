// Enhanced Job service for API communication with IST support
class JobService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    this.apiURL = `${this.baseURL}/api`;
  }

  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.apiURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const requestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      console.log(`Making ${requestOptions.method || "GET"} request to:`, url);
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all jobs
  async getAllJobs() {
    return await this.makeRequest("/jobs");
  }

  // Get specific job by ID
  async getJob(jobId) {
    return await this.makeRequest(`/jobs/${jobId}`);
  }

  // Create new job
  async createJob(jobData) {
    return await this.makeRequest("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    });
  }

  // Update existing job
  async updateJob(jobId, jobData) {
    return await this.makeRequest(`/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    });
  }

  // Delete job
  async deleteJob(jobId) {
    return await this.makeRequest(`/jobs/${jobId}`, {
      method: "DELETE",
    });
  }

  // Get execution order preview
  async getExecutionOrder() {
    return await this.makeRequest("/jobs/execution-order");
  }

  // Get system status
  async getSystemStatus() {
    return await this.makeRequest("/system/status");
  }

  // Get worker statistics
  async getWorkerStats() {
    return await this.makeRequest("/system/workers");
  }

  // Get scheduler statistics
  async getSchedulerStats() {
    return await this.makeRequest("/system/scheduler/stats");
  }
}

// Export singleton instance
export const jobService = new JobService();
