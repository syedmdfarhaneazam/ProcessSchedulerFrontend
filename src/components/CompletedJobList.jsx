// Import shared job card component
import JobCard from "./JobCard";

// CompletedJobList component for displaying finished jobs
function CompletedJobList({ jobs, onDelete, loading }) {
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
          No completed jobs
        </h3>
        <p className="text-gray-500">
          Completed jobs will appear here once they finish executing.
        </p>
      </div>
    );
  }

  // Sort jobs by completion time (most recent first)
  const sortedJobs = [...jobs].sort((a, b) => {
    const aTime = new Date(a.completedAt || a.createdAt);
    const bTime = new Date(b.completedAt || b.createdAt);
    return bTime - aTime;
  });

  return (
    <div className="space-y-4">
      {sortedJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          type="done"
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </div>
  );
}

export default CompletedJobList;
