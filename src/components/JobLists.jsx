import QueuedJobList from "./QueuedJobList";
import CompletedJobList from "./CompletedJobList";

function JobLists({ jobs, onDelete, loading, onRefresh }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Queued Jobs ({jobs.queued.length})
          </h2>
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
        <QueuedJobList
          jobs={jobs.queued}
          onDelete={onDelete}
          loading={loading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Completed Jobs ({jobs.done.length})
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Success:{" "}
              {jobs.done.filter((job) => job.status === "success").length}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              Failed:{" "}
              {jobs.done.filter((job) => job.status === "failed").length}
            </span>
          </div>
        </div>
        <CompletedJobList
          jobs={jobs.done}
          onDelete={onDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default JobLists;
