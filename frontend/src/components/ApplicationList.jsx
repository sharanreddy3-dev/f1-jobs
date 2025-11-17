import React from "react";

export default function ApplicationList({ applications, jobs, resumes }) {
  const jobById = Object.fromEntries(jobs.map((j) => [j.id, j]));
  const resumeById = Object.fromEntries(resumes.map((r) => [r.id, r]));

  return (
    <div className="panel">
      <h2>Applications</h2>
      {applications.length === 0 && <p>No applications yet.</p>}
      <ul className="list">
        {applications.map((app) => {
          const job = jobById[app.jobId];
          const resume = resumeById[app.resumeId];
          return (
            <li key={app.id} className="list-item">
              <div className="list-item-title">
                {job ? job.title : "Unknown Job"}
              </div>
              <div className="list-item-sub">
                {job ? job.company : "Unknown Company"}
              </div>
              <div className="list-item-meta">
                Resume: {resume ? resume.name : "Unknown Resume"} · Status: {" "}
                {app.status} · Match: {app.matchScore}%
              </div>
              <div className="list-item-meta">
                Applied: {new Date(app.createdAt).toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
