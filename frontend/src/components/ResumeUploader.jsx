import React, { useState } from "react";

export default function ResumeUploader({ onUpload }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setLoading(true);
    await onUpload(name.trim(), content.trim());
    setName("");
    setContent("");
    setLoading(false);
  }

  return (
    <div className="panel">
      <h2>Resume Manager</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Resume Name
          <input
            type="text"
            placeholder="e.g. Data Engineer Master Resume"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Resume Content (paste text for now)
          <textarea
            rows={8}
            placeholder="Paste your resume text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Save Resume"}
        </button>
      </form>
    </div>
  );
}
