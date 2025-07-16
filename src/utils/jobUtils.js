// Job utility functions for state management
export const updateJobInState = (updatedJob, setJobs) => {
  setJobs((prevJobs) => {
    const newJobs = { ...prevJobs };

    // Remove job from both lists first
    newJobs.queued = newJobs.queued.filter((job) => job.id !== updatedJob.id);
    newJobs.done = newJobs.done.filter((job) => job.id !== updatedJob.id);

    // Add job to appropriate list based on status
    if (updatedJob.status === "queued" || updatedJob.status === "running") {
      newJobs.queued.push(updatedJob);
    } else if (
      updatedJob.status === "success" ||
      updatedJob.status === "failed"
    ) {
      newJobs.done.push(updatedJob);
    }

    return newJobs;
  });
};

// Sort jobs by priority and start time
export const sortJobsByPriority = (jobs) => {
  return [...jobs].sort((a, b) => {
    // First sort by priority (0 = high, 1 = medium, 2 = low)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Then sort by start time
    return new Date(a.startTime) - new Date(b.startTime);
  });
};

// Filter jobs by status
export const filterJobsByStatus = (jobs, status) => {
  return jobs.filter((job) => job.status === status);
};

// Get job statistics
export const getJobStatistics = (jobs) => {
  const total = jobs.length;
  const byStatus = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const byPriority = jobs.reduce((acc, job) => {
    const priority =
      job.priority === 0 ? "high" : job.priority === 1 ? "medium" : "low";
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    byStatus,
    byPriority,
  };
};
