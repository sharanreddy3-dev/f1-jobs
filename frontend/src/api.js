import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function getJobs() {
  const res = await api.get("/jobs?hours=24");
  return res.data;
}

export async function getResumes() {
  const res = await api.get("/resumes");
  return res.data;
}

export async function uploadResume(name, content) {
  const res = await api.post("/resumes", { name, content });
  return res.data;
}

export async function optimizeResume(jobId, resumeId) {
  const res = await api.post("/optimize", { jobId, resumeId });
  return res.data;
}

export async function applyToJob(payload) {
  const res = await api.post("/apply", payload);
  return res.data;
}

export async function getApplications() {
  const res = await api.get("/applications");
  return res.data;
}
