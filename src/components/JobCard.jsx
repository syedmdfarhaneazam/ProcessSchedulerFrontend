// Enhanced JobCard component with IST timezone support and DAG features
import ISTTimezoneHelper from "../utils/ISTTimezoneHelper";

function JobCard({ job, type, onDelete, loading }) {
  // Function to format date and time for IST display
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not set";
    return ISTTimezoneHelper.formatIST(dateString);
  };

  // Function to get priority display with color coding
  const getPriorityDisplay = (priority) => {
    const priorityMap = {
      0: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
      1: {
        label: "Medium",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      2: {
        label: "Low",
        color: "bg-green-100 text-green-800 border-green-200",
      },
    };
    const priorityInfo = priorityMap[priority] || {
      label: "Unknown",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo.color}`}
      >
        {priorityInfo.label}
      </span>
    );
  };

  // Function to get status display with appropriate styling
  const getStatusDisplay = (status) => {
    const statusMap = {
      queued: {
        label: "Queued",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      running: {
        label: "Running",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      success: {
        label: "Success",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      failed: {
        label: "Failed",
        color: "bg-red-100 text-red-800 border-red-200",
      },
    };
    const statusInfo = statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  // Function to get code type display
  const getCodeTypeDisplay = (codeType) => {
    const typeMap = {
      python: { label: "Python", icon: "🐍", color: "text-blue-600" },
      javascript: { label: "JavaScript", icon: "📜", color: "text-yellow-600" },
      shell: { label: "Shell", icon: "💻", color: "text-green-600" },
      file: { label: "File", icon: "📁", color: "text-purple-600" },
    };
    const typeInfo = typeMap[codeType] || {
      label: codeType,
      icon: "❓",
      color: "text-gray-600",
    };
    return (
      <span className={`inline-flex items-center text-sm ${typeInfo.color}`}>
        <span className="mr-1">{typeInfo.icon}</span>
        {typeInfo.label}
      </span>
    );
  };

  // Function to handle job deletion with confirmation
  const handleDelete = async (jobId, jobDescription) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the job "${jobDescription}"?\n\nThis action cannot be undone and may affect dependent jobs.`,
    );
    if (confirmed) {
      console.log(`Deleting job: ${jobId}`);
      await onDelete(jobId);
    }
  };

  // Function to calculate time until job execution in IST
  const getTimeUntilExecution = (startTime) => {
    const timeDiff = ISTTimezoneHelper.getTimeDifferenceFromNow(startTime);
    return timeDiff.isInFuture ? timeDiff.humanReadable : "Ready to execute";
  };

  // Function to get execution duration
  const getExecutionDuration = (executedAt, completedAt) => {
    if (!executedAt || !completedAt) return null;
    const start = new Date(executedAt);
    const end = new Date(completedAt);
    const diff = end - start;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Job Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {job.description}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap gap-2">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              ID: {job.id.slice(0, 8)}...
            </span>
            {getCodeTypeDisplay(job.codeType)}
            {getPriorityDisplay(job.priority)}
            {getStatusDisplay(job.status)}
            {job.assignedWorker && (
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                Worker: {job.assignedWorker}
              </span>
            )}
          </div>
        </div>
        {/* Delete Button */}
        <button
          onClick={() => handleDelete(job.id, job.description)}
          disabled={loading || job.status === "running"}
          className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            job.status === "running"
              ? "Cannot delete running job"
              : "Delete Job"
          }
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Timing Information */}
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">
              🇮🇳 Start Time (IST):
            </span>
            <p className="text-sm text-gray-600">
              {formatDateTime(job.startTime)}
            </p>
            {type === "queued" && job.status === "queued" && (
              <p className="text-xs text-blue-600">
                {getTimeUntilExecution(job.startTime)}
              </p>
            )}
          </div>
          {job.executedAt && (
            <div>
              <span className="text-sm font-medium text-gray-700">
                🇮🇳 Executed At (IST):
              </span>
              <p className="text-sm text-gray-600">
                {formatDateTime(job.executedAt)}
              </p>
            </div>
          )}
          {job.completedAt && (
            <div>
              <span className="text-sm font-medium text-gray-700">
                🇮🇳 Completed At (IST):
              </span>
              <p className="text-sm text-gray-600">
                {formatDateTime(job.completedAt)}
              </p>
              {job.executedAt && (
                <p className="text-xs text-green-600">
                  Duration:{" "}
                  {getExecutionDuration(job.executedAt, job.completedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Configuration Information */}
        <div className="space-y-2">
          {job.retryPolicy > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">
                Retry Policy (Exponential Backoff):
              </span>
              <p className="text-sm text-gray-600">
                {job.retryCount}/{job.retryPolicy} attempts
                {job.retryCount > 0 && (
                  <span className="text-orange-600 ml-1">(retried)</span>
                )}
              </p>
              {job.nextRetryDelay && (
                <p className="text-xs text-orange-600">
                  Next retry delay: {Math.floor(job.nextRetryDelay / 1000)}s
                </p>
              )}
            </div>
          )}
          {job.repeat > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">
                Repeat Interval:
              </span>
              <p className="text-sm text-gray-600">{job.repeat / 60} minutes</p>
            </div>
          )}
          {job.dependencies && job.dependencies.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">
                DAG Dependencies:
              </span>
              <p className="text-sm text-gray-600">
                {job.dependencies.length} job(s)
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.dependencies.map((depId) => (
                  <span
                    key={depId}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {depId.slice(0, 8)}...
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Content Preview */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700">Code Preview:</span>
        <div className="mt-1 bg-gray-50 rounded-md p-3 border">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto font-mono">
            {job.codeContent.length > 200
              ? `${job.codeContent.substring(0, 200)}...`
              : job.codeContent}
          </pre>
        </div>
      </div>

      {/* Error Message (for failed jobs) */}
      {job.status === "failed" && job.errorMessage && (
        <div className="mb-4">
          <span className="text-sm font-medium text-red-700">
            Error Message:
          </span>
          <div className="mt-1 bg-red-50 rounded-md p-3 border border-red-200">
            <pre className="text-sm text-red-800 whitespace-pre-wrap overflow-x-auto font-mono">
              {job.errorMessage}
            </pre>
          </div>
        </div>
      )}

      {/* Job Footer with Additional Info */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>🇮🇳 Created: {formatDateTime(job.createdAt)}</span>
        {job.status === "running" && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-2"></div>
            <span className="text-purple-600 font-medium">Executing...</span>
          </div>
        )}
        {job.repeat > 0 && job.status === "success" && (
          <span className="text-blue-600">🔄 Recurring</span>
        )}
        {job.dependencies && job.dependencies.length > 0 && (
          <span className="text-green-600">🔗 DAG Dependent</span>
        )}
      </div>
    </div>
  );
}

export default JobCard;
