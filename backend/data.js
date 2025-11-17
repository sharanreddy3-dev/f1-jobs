const { v4: uuidv4 } = require("uuid");

// Simulated job postings (normally you'd scrape or call APIs)
const jobs = [
  {
    id: "job-1",
    title: "Data Engineer - Cloud",
    company: "TechNova",
    location: "Remote",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    description: `
We are looking for a Data Engineer with experience in Python, SQL, Spark, and at least one cloud (AWS/Azure/GCP).
Responsibilities:
- Build ETL/ELT pipelines
- Work with data lakes and warehouses
- Collaborate with data scientists and analysts
`.trim()
  },
  {
    id: "job-2",
    title: "Machine Learning Engineer",
    company: "AI Labs",
    location: "New York, NY",
    postedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
    description: `
Looking for an ML Engineer with experience in Python, TensorFlow/PyTorch, and deploying models to production.
`.trim()
  },
  {
    id: "job-3",
    title: "Junior Data Analyst",
    company: "InsightCorp",
    location: "Chicago, IL",
    postedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago (will be filtered out)
    description: `
Entry-level role. SQL, Excel, and BI tools experience preferred.
`.trim()
  }
];

// In-memory resumes & applications
const resumes = []; // { id, userId, name, content, createdAt }
const applications = []; // { id, jobId, resumeId, status, matchScore, optimizedResume, createdAt }

function addResume({ userId = "default-user", name, content }) {
  const resume = {
    id: uuidv4(),
    userId,
    name,
    content,
    createdAt: new Date().toISOString()
  };
  resumes.push(resume);
  return resume;
}

function listResumes(userId = "default-user") {
  return resumes.filter((r) => r.userId === userId);
}

function getResume(id) {
  return resumes.find((r) => r.id === id);
}

function listRecentJobs(hours = 24) {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return jobs.filter((job) => new Date(job.postedAt).getTime() >= cutoff);
}

function getJob(id) {
  return jobs.find((j) => j.id === id);
}

function addApplication({ jobId, resumeId, matchScore, optimizedResume }) {
  const app = {
    id: uuidv4(),
    jobId,
    resumeId,
    matchScore,
    optimizedResume,
    status: "applied",
    createdAt: new Date().toISOString()
  };
  applications.push(app);
  return app;
}

function listApplications() {
  return applications;
}

module.exports = {
  listRecentJobs,
  getJob,
  addResume,
  listResumes,
  getResume,
  addApplication,
  listApplications
};
