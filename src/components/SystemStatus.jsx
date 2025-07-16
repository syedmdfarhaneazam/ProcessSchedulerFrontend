import ISTTimezoneHelper from "../utils/ISTTimezoneHelper";

function SystemStatus({
  systemStatus = {},
  socketConnected = false,
  className = "",
}) {
  if (
    !systemStatus.workerStats &&
    !systemStatus.schedulerStats &&
    !systemStatus.dagStats
  ) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🇮🇳 System Status (IST)
        </h2>
        <div className="text-center text-gray-500">
          <p>Loading system status...</p>
          <div className="mt-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white text-black rounded-lg shadow-md p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🇮🇳 Enhanced System Status (IST)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Connection</h3>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${socketConnected ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="text-sm text-gray-600">
              {socketConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {ISTTimezoneHelper.getCurrentIST()}
          </div>
        </div>

        {systemStatus.workerStats && (
          <div className="bg-gray-50 rounded-lg p-4 text-black">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Workers</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">
                  {systemStatus.workerStats.totalWorkers || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Available:</span>
                <span className="font-medium">
                  {systemStatus.workerStats.availableWorkers || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">Busy:</span>
                <span className="font-medium">
                  {systemStatus.workerStats.busyWorkers || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Jobs Done:</span>
                <span className="font-medium ">
                  {systemStatus.workerStats.totalJobsExecuted || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {systemStatus.schedulerStats && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              DAG Scheduler
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium ${systemStatus.schedulerStats.isRunning ? "text-green-600" : "text-red-600"}`}
                >
                  {systemStatus.schedulerStats.isRunning
                    ? "Running"
                    : "Stopped"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processed:</span>
                <span className="font-medium">
                  {systemStatus.schedulerStats.totalJobsProcessed || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Success:</span>
                <span className="font-medium">
                  {systemStatus.schedulerStats.successfulJobs || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600">Failed:</span>
                <span className="font-medium">
                  {systemStatus.schedulerStats.failedJobs || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {systemStatus.dagStats && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              DAG Structure
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Nodes:</span>
                <span className="font-medium">
                  {systemStatus.dagStats.totalNodes || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Max Depth:</span>
                <span className="font-medium">
                  L{systemStatus.dagStats.maxDepthLevel || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">No Deps:</span>
                <span className="font-medium">
                  {systemStatus.dagStats.nodesWithoutDependencies || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Avg Deps:</span>
                <span className="font-medium">
                  {systemStatus.dagStats.averageDependencies?.toFixed(1) || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {systemStatus.schedulerStats && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-md p-3">
              <div className="text-sm font-medium text-blue-700">
                Avg Execution Time
              </div>
              <div className="text-lg font-bold text-blue-900">
                {systemStatus.schedulerStats.averageExecutionTimeMs || 0}ms
              </div>
            </div>
            <div className="bg-green-50 rounded-md p-3">
              <div className="text-sm font-medium text-green-700">
                Success Rate
              </div>
              <div className="text-lg font-bold text-green-900">
                {systemStatus.schedulerStats.totalJobsProcessed > 0
                  ? Math.round(
                      (systemStatus.schedulerStats.successfulJobs /
                        systemStatus.schedulerStats.totalJobsProcessed) *
                        100,
                    )
                  : 0}
                %
              </div>
            </div>
            <div className="bg-orange-50 rounded-md p-3">
              <div className="text-sm font-medium text-orange-700">
                Retry Rate
              </div>
              <div className="text-lg font-bold text-orange-900">
                {systemStatus.schedulerStats.totalJobsProcessed > 0
                  ? Math.round(
                      (systemStatus.schedulerStats.retriedJobs /
                        systemStatus.schedulerStats.totalJobsProcessed) *
                        100,
                    )
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>
      )}

      {systemStatus.workerStats && systemStatus.workerStats.workers && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Worker Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {systemStatus.workerStats.workers.map((worker) => (
              <div key={worker.id} className="bg-gray-50 rounded-md p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {worker.id}
                  </span>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${
                        worker.status === "available"
                          ? "bg-green-500"
                          : worker.status === "busy"
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    {worker.isReal && (
                      <span className="text-xs text-blue-600 font-medium">
                        REAL
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {worker.hostname}
                </div>
                <div className="text-xs text-gray-500">
                  Jobs: {worker.totalJobsExecuted}
                </div>
                <div className="text-xs text-gray-500">
                  Last: {ISTTimezoneHelper.formatIST(worker.lastHeartbeat)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            🇮🇳 System Time: {ISTTimezoneHelper.getCurrentIST()} (IST +05:30)
          </span>
          <span>
            Features: DAG Dependencies • Min-Heap Queue • Exponential Backoff
          </span>
        </div>
      </div>
    </div>
  );
}

export default SystemStatus;
