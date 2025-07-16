import { useState, useEffect } from "react";
import JobForm from "./components/JobForm";
import JobLists from "./components/JobLists";
import Header from "./components/Header";
import SystemStatus from "./components/SystemStatus";
import ErrorBoundary from "./components/ErrorBoundary";

import { jobService } from "./services/jobService";
import { socketService } from "./services/socketService";

import ISTTimezoneHelper from "./utils/ISTTimezoneHelper";
import { updateJobInState } from "./utils/jobUtils";

import "./App.css";

function App() {
  const [jobs, setJobs] = useState({
    queued: [],
    done: [],
  });

  const [systemStatus, setSystemStatus] = useState({
    isOnline: false,
    workerStats: null,
    schedulerStats: null,
    dagStats: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    console.log(`🇮🇳 App starting at IST: ${ISTTimezoneHelper.getCurrentIST()}`);

    socketService.connect();

    socketService.onConnect(() => {
      console.log("Connected to server via Socket.IO");
      setSocketConnected(true);
      setError(null);
    });

    socketService.onDisconnect(() => {
      console.log("Disconnected from server");
      setSocketConnected(false);
    });

    socketService.onJobUpdate((data) => {
      console.log("Received job update:", data.job);
      updateJobInState(data.job, setJobs);
    });

    socketService.onJobListsUpdate((data) => {
      console.log("Received job lists update");
      setJobs(data.data);
    });

    socketService.onWorkerStatsUpdate((data) => {
      console.log("Received worker stats update");
      setSystemStatus((prev) => ({
        ...prev,
        workerStats: data.stats,
      }));
    });

    socketService.onSystemStatus((data) => {
      console.log("Received system status:", data.status);
      setSystemStatus((prev) => ({
        ...prev,
        isOnline: data.status.status === "online",
      }));
    });

    socketService.onError((data) => {
      console.error("Received system error:", data.error);
      setError(data.error);
    });

    fetchInitialData();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [jobsResponse, systemResponse] = await Promise.all([
        jobService.getAllJobs(),
        jobService.getSystemStatus(),
      ]);

      if (jobsResponse.success) {
        setJobs(jobsResponse.data);
      }

      if (systemResponse.success) {
        setSystemStatus({
          isOnline: true,
          workerStats: systemResponse.data.workers,
          schedulerStats: systemResponse.data.scheduler,
          dagStats: systemResponse.data.scheduler?.dagStats,
        });
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Creating job:", jobData);

      const response = await jobService.createJob(jobData);
      if (response.success) {
        console.log("Job created successfully:", response.job);
        // Refresh jobs list after creation
        await fetchInitialData();
        return { success: true, job: response.job };
      } else {
        throw new Error(response.message || "Failed to create job");
      }
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await jobService.deleteJob(jobId);
      if (response.success) {
        console.log("Job deleted successfully");
        setJobs((prevJobs) => ({
          queued: prevJobs.queued.filter((job) => job.id !== jobId),
          done: prevJobs.done.filter((job) => job.id !== jobId),
        }));
        return { success: true };
      } else {
        throw new Error(response.message || "Failed to delete job");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchInitialData();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 w-full">
        <Header
          jobCounts={{
            queued: jobs.queued?.length || 0,
            done: jobs.done?.length || 0,
          }}
          systemStatus={systemStatus}
          socketConnected={socketConnected}
          onRefresh={refreshData}
        />

        <main className="w-full px-6 py-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="mb-6 flex justify-center">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          )}

          <SystemStatus
            systemStatus={systemStatus}
            socketConnected={socketConnected}
            className="mb-8"
          />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 w-full">
              <JobForm
                onSubmit={createJob}
                loading={loading}
                availableJobs={[...(jobs.queued || []), ...(jobs.done || [])]}
              />
            </div>

            <div className="lg:w-1/2 w-full">
              <JobLists
                jobs={jobs}
                onDelete={deleteJob}
                loading={loading}
                onRefresh={refreshData}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="w-full px-6 py-4">
            <p className="text-center text-gray-500 text-sm">
              by SYED MD FARHAN E AZAM
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
