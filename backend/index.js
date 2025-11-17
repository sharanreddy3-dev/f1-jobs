const express = require("express");
const cors = require("cors");

const {
  listRecentJobs,
  getJob,
  addResume,
  listResumes,
  getResume,
  addApplication,
  listApplications
} = require("./data");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Job AI backend running" });
});

// List jobs from last 24 hours
app.get("/api/jobs", (req, res) => {
  const hours = parseInt(req.query.hours || "24", 10);
  const jobs = listRecentJobs(hours);
  res.json(jobs);
});

// Upload / save a resume (plain text for simplicity)
app.post("/api/resumes", (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) {
    return res.status(400).json({ error: "name and content are required" });
  }
  const resume = addResume({ name, content });
  res.status(201).json(resume);
});

// List resumes
app.get("/api/resumes", (req, res) => {
  const list = listResumes();
  res.json(list);
});

// Optimize resume for a job (dummy logic with placeholder "AI")
app.post("/api/optimize", (req, res) => {
  const { jobId, resumeId } = req.body;
  if (!jobId || !resumeId) {
    return res.status(400).json({ error: "jobId and resumeId are required" });
  }

  const job = getJob(jobId);
  const resume = getResume(resumeId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  if (!resume) {
    return res.status(404).json({ error: "Resume not found" });
  }

  // --- AI PLACEHOLDER ---
  // Here is where you'd call a real LLM (OpenAI, etc.) to:
  // - extract key skills from job.description
  // - rephrase & reorder resume.content
  // For now, we simulate:
  const optimizedResume =
    `Optimized for: ${job.title} at ${job.company}\n\n` +
    `Job Highlights:\n${job.description}\n\n` +
    `Candidate Resume:\n${resume.content}\n`;

  // Basic "match score" heuristic: count overlapping keywords (demo only)
  const lowerJD = job.description.toLowerCase();
  const lowerRes = resume.content.toLowerCase();
  const keywords = ["python", "sql", "spark", "aws", "azure", "gcp", "ml", "data"];
  let hits = 0;
  keywords.forEach((k) => {
    if (lowerJD.includes(k) && lowerRes.includes(k)) hits += 1;
  });
  const matchScore = Math.round((hits / keywords.length) * 100);

  res.json({
    jobId,
    resumeId,
    optimizedResume,
    matchScore
  });
});

// "Apply" to a job (no external portal calls, just tracks in system)
app.post("/api/apply", (req, res) => {
  const { jobId, resumeId, optimizedResume, matchScore } = req.body;

  if (!jobId || !resumeId || !optimizedResume) {
    return res
      .status(400)
      .json({ error: "jobId, resumeId and optimizedResume are required" });
  }

  const job = getJob(jobId);
  const resume = getResume(resumeId);
  if (!job || !resume) {
    return res.status(404).json({ error: "Job or resume not found" });
  }

  // In a real system, here you would:
  // - trigger a worker to auto-fill/apply via allowed APIs or automation
  // - handle captchas, MFA, failures
  // For now, we simply log + track.
  const appRecord = addApplication({
    jobId,
    resumeId,
    matchScore: matchScore || 0,
    optimizedResume
  });

  console.log("Simulated application submitted:", appRecord);

  res.status(201).json(appRecord);
});

// List applications
app.get("/api/applications", (req, res) => {
  res.json(listApplications());
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
