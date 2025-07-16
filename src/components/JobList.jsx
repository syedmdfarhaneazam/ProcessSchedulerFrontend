// JobList component for displaying jobs in queued or done state
function JobList({ jobs, type, onDelete, loading }) {
  // Function to format date and time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not set";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Function to get priority display with color coding
  const getPriorityDisplay = (priority) => {
    const priorityMap = {
      0: { label: "High", color: "bg-red-100 text-red-800" },
      1: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
      2: { label: "Low", color: "bg-green-100 text-green-800" },
    };

    const priorityInfo = priorityMap[priority] || {
      label: "Unknown",
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.color}`}
      >
        {priorityInfo.label}
      </span>
    );
  };

  // Function to get status display with appropriate styling
  const getStatusDisplay = (status) => {
    const statusMap = {
      queued: { label: "Queued", color: "bg-blue-100 text-blue-800" },
      running: { label: "Running", color: "bg-purple-100 text-purple-800" },
      success: { label: "Success", color: "bg-green-100 text-green-800" },
      failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  // Function to get code type display
  const getCodeTypeDisplay = (codeType) => {
    const typeMap = {
      python: { label: "Python", icon: "🐍" },
      javascript: { label: "JavaScript", icon: "📜" },
      shell: { label: "Shell", icon: "💻" },
      file: { label: "File", icon: "📁" },
    };

    const typeInfo = typeMap[codeType] || { label: codeType, icon: "❓" };

    return (
      <span className="inline-flex items-center text-sm text-gray-600">
        <span className="mr-1">{typeInfo.icon}</span>
        {typeInfo.label}
      </span>
    );
  };

  // Function to handle job deletion with confirmation
  const handleDelete = async (jobId, jobDescription) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the job "${jobDescription}"?\n\nThis action cannot be undone.`,
    );

    if (confirmed) {
      console.log(`Deleting job: ${jobId}`);
      await onDelete(jobId);
    }
  };

  // Function to calculate time until job execution
  const getTimeUntilExecution = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return "Overdue";

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  // Show empty state if no jobs
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {type} jobs
        </h3>
        <p className="text-gray-500">
          {type === "queued"
            ? "Create your first job using the form on the left."
            : "Completed jobs will appear here once they finish executing."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          {/* Job Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {job.description}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>ID: {job.id.slice(0, 8)}...</span>
                {getCodeTypeDisplay(job.codeType)}
                {getPriorityDisplay(job.priority)}
                {getStatusDisplay(job.status)}
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(job.id, job.description)}
              disabled={loading}
              className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Job"
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
                  Start Time:
                </span>
                <p className="text-sm text-gray-600">
                  {formatDateTime(job.startTime)}
                </p>
                {type === "queued" && job.status === "queued" && (
                  <p className="text-xs text-blue-600">
                    Executes in: {getTimeUntilExecution(job.startTime)}
                  </p>
                )}
              </div>

              {job.executedAt && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Executed At:
                  </span>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(job.executedAt)}
                  </p>
                </div>
              )}

              {job.completedAt && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Completed At:
                  </span>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(job.completedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Configuration Information */}
            <div className="space-y-2">
              {job.retryPolicy > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Retry Policy:
                  </span>
                  <p className="text-sm text-gray-600">
                    {job.retryCount}/{job.retryPolicy} attempts
                  </p>
                </div>
              )}

              {job.repeat > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Repeat Interval:
                  </span>
                  <p className="text-sm text-gray-600">
                    {job.repeat / 60} minutes
                  </p>
                </div>
              )}

              {job.dependencies && job.dependencies.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Dependencies:
                  </span>
                  <p className="text-sm text-gray-600">
                    {job.dependencies.length} job(s)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Code Content Preview */}
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">
              Code Preview:
            </span>
            <div className="mt-1 bg-gray-50 rounded-md p-3 border">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
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
                <pre className="text-sm text-red-800 whitespace-pre-wrap overflow-x-auto">
                  {job.errorMessage}
                </pre>
              </div>
            </div>
          )}

          {/* Job Footer with Additional Info */}
          <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
            <span>Created: {formatDateTime(job.createdAt)}</span>
            {job.status === "running" && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-600">Executing...</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;
