// Enhanced Header component with IST timezone and DAG information
import ISTTimezoneHelper from "../utils/ISTTimezoneHelper";

function Header({
  jobCounts = { queued: 0, done: 0 },
  systemStatus = {},
  socketConnected = false,
  onRefresh,
}) {
  // Function to get connection status indicator
  const getConnectionStatus = () => {
    if (socketConnected && systemStatus.isOnline) {
      return {
        color: "bg-green-500",
        text: "System Online",
        icon: "✓",
      };
    } else if (socketConnected && !systemStatus.isOnline) {
      return {
        color: "bg-yellow-500",
        text: "System Starting",
        icon: "⚠",
      };
    } else {
      return {
        color: "bg-red-500",
        text: "Disconnected",
        icon: "✗",
      };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🇮🇳 DAG Job Scheduling System
            </h1>
            <p className="text-gray-600 mt-1">
              Enhanced with DAG dependencies, Min-Heap priority queue, and IST
              timezone support
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>IST: {ISTTimezoneHelper.getCurrentIST()}</span>
              <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Asia/Kolkata +05:30
              </span>
            </div>
          </div>

          {/* Status and controls */}
          <div className="flex items-center space-x-6">
            {/* Connection status */}
            <div className="flex items-center">
              <div
                className={`w-3 h-3 ${connectionStatus.color} rounded-full mr-2`}
              ></div>
              <span className="text-sm text-gray-600 flex items-center">
                <span className="mr-1">{connectionStatus.icon}</span>
                {connectionStatus.text}
              </span>
            </div>

            {/* Job counts */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium text-blue-600">
                  {jobCounts.queued}
                </span>
                <span className="ml-1">Queued</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-green-600">
                  {jobCounts.done}
                </span>
                <span className="ml-1">Done</span>
              </div>
            </div>

            {/* Worker stats */}
            {systemStatus.workerStats && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium text-purple-600">
                    {systemStatus.workerStats.availableWorkers}
                  </span>
                  <span className="ml-1">Available</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-orange-600">
                    {systemStatus.workerStats.busyWorkers}
                  </span>
                  <span className="ml-1">Busy</span>
                </div>
              </div>
            )}

            {/* DAG Stats */}
            {systemStatus.dagStats && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium text-indigo-600">
                    {systemStatus.dagStats.totalNodes}
                  </span>
                  <span className="ml-1">DAG Nodes</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-pink-600">
                    L{systemStatus.dagStats.maxDepthLevel}
                  </span>
                  <span className="ml-1">Max Depth</span>
                </div>
              </div>
            )}

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Refresh Data"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
