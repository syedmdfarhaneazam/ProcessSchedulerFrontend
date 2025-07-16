import JobCard from "./JobCard";

function QueuedJobList({ jobs, onDelete, loading }) {
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No queued jobs
        </h3>
        <p className="text-gray-500">
          Create your first job using the form on the left.
        </p>
      </div>
    );
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(a.startTime) - new Date(b.startTime);
  });

  return (
    <div className="space-y-4">
      {sortedJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          type="queued"
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </div>
  );
}

export default QueuedJobList;
