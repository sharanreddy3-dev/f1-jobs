import React, { useEffect, useState } from "react";
import {
  getJobs,
  getResumes,
  uploadResume,
  optimizeResume,
  applyToJob,
  getApplications
} from "./api.js";
import JobList from "./components/JobList.jsx";
import JobDetails from "./components/JobDetails.jsx";
import ResumeUploader from "./components/ResumeUploader.jsx";
import ApplicationList from "./components/ApplicationList.jsx";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [optimizedData, setOptimizedData] = useState(null);

  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [loadingOptimize, setLoadingOptimize] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);

  async function loadJobs() {
    setLoadingJobs(true);
    try {
      const data = await getJobs();
      setJobs(data);
      // auto-select first job
      if (data.length > 0 && !selectedJob) {
        setSelectedJob(data[0]);
      }
    } finally {
      setLoadingJobs(false);
    }
  }

  async function loadResumes() {
    setLoadingResumes(true);
    try {
      const data = await getResumes();
      setResumes(data);
    } finally {
      setLoadingResumes(false);
    }
  }

  async function loadApplications() {
    const data = await getApplications();
    setApplications(data);
  }

  useEffect(() => {
    loadJobs();
    loadResumes();
    loadApplications();
    // Refresh jobs every hour (3600000 ms) as per your requirement
    const interval = setInterval(() => {
      loadJobs();
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleUploadResume(name, content) {
    await uploadResume(name, content);
    await loadResumes();
  }

  async function handleOptimize() {
    if (!selectedJob || !selectedResumeId) return;
    setLoadingOptimize(true);
    try {
      const data = await optimizeResume(selectedJob.id, selectedResumeId);
      setOptimizedData(data);
    } finally {
      setLoadingOptimize(false);
    }
  }

  async function handleApply() {
    if (!selectedJob || !selectedResumeId || !optimizedData) return;
    setLoadingApply(true);
    try {
      await applyToJob({
        jobId: selectedJob.id,
        resumeId: selectedResumeId,
        optimizedResume: optimizedData.optimizedResume,
        matchScore: optimizedData.matchScore
      });
      await loadApplications();
      alert("Application recorded (simulated). Check Applications panel.");
    } finally {
      setLoadingApply(false);
    }
  }

  function handleSelectJob(job) {
    setSelectedJob(job);
    setOptimizedData(null);
  }

  return (
    <div className="app">
      <header className="header">
        <h1>AI Job Agent</h1>
        <p className="muted">
          Free, simple job assistant — fetch jobs, tailor your resume, and track
          applications.
        </p>
      </header>

      <main className="main">
        <section className="column">
          <div className="panel">
            <div className="panel-header-row">
              <h2>Job Feed</h2>
              <button onClick={loadJobs} disabled={loadingJobs}>
                {loadingJobs ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
          <JobList
            jobs={jobs}
            selectedJobId={selectedJob?.id}
            onSelect={handleSelectJob}
          />
        </section>

        <section className="column">
          <JobDetails
            job={selectedJob}
            resumes={resumes}
            selectedResumeId={selectedResumeId}
            onResumeChange={setSelectedResumeId}
            onOptimize={handleOptimize}
            optimizedData={optimizedData}
            onApply={handleApply}
            loadingOptimize={loadingOptimize}
            loadingApply={loadingApply}
          />
        </section>

        <section className="column">
          <ResumeUploader onUpload={handleUploadResume} />
          <ApplicationList
            applications={applications}
            jobs={jobs}
            resumes={resumes}
          />
        </section>
      </main>
    </div>
  );
}
