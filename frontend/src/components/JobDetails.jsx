import React from "react";

export default function JobDetails({
  job,
  resumes,
  selectedResumeId,
  onResumeChange,
  onOptimize,
  optimizedData,
  onApply,
  loadingOptimize,
  loadingApply
}) {
  if (!job) {
    return (
      <div className="panel">
        <h2>Job Details</h2>
        <p>Select a job from the left to see details.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>{job.title}</h2>
      <p className="muted">
        {job.company} · {job.location}
      </p>
      <pre className="pre">{job.description}</pre>

      <hr />

      <h3>Step 1: Choose Resume</h3>
      {resumes.length === 0 ? (
        <p className="warning">You have no resumes uploaded yet.</p>
      ) : (
        <select
          value={selectedResumeId || ""}
          onChange={(e) => onResumeChange(e.target.value)}
        >
          <option value="">Select a resume</option>
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={!selectedResumeId || loadingOptimize}
          onClick={onOptimize}
        >
          {loadingOptimize ? "Optimizing..." : "Optimize for this Job"}
        </button>
      </div>

      {optimizedData && (
        <>
          <hr />
          <h3>Step 2: Optimized Resume</h3>
          <p>
            Match score:{" "}
            <strong>
              {optimizedData.matchScore}
              {" %"}
            </strong>
          </p>
          <pre className="pre">{optimizedData.optimizedResume}</pre>

          <button
            style={{ marginTop: "0.5rem" }}
            onClick={onApply}
            disabled={loadingApply}
          >
            {loadingApply ? "Applying..." : "Apply (simulated)"}
          </button>
          <p className="muted small">
            This only records the application in your dashboard.  
            You still need to submit on the actual company portal.
          </p>
        </>
      )}
    </div>
  );
}
