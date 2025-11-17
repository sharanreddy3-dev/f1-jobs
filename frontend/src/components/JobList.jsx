import React from "react";

export default function JobList({ jobs, selectedJobId, onSelect }) {
  return (
    <div className="panel">
      <h2>Jobs (last 24 hours)</h2>
      {jobs.length === 0 && <p>No jobs found in the last 24 hours.</p>}
      <ul className="list">
        {jobs.map((job) => (
          <li
            key={job.id}
            className={
              "list-item " + (job.id === selectedJobId ? "list-item-selected" : "")
            }
            onClick={() => onSelect(job)}
          >
            <div className="list-item-title">{job.title}</div>
            <div className="list-item-sub">
              {job.company} · {job.location}
            </div>
            <div className="list-item-meta">
              Posted: {new Date(job.postedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
