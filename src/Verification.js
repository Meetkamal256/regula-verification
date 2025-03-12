import React, { useState } from "react";
import "./verification.css";

const Verification = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/face/recognize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setResult(data.message || "Verification failed!");
    } catch (error) {
      console.error("Error verifying image:", error);
      setResult("Error processing request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Regula Verification</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Verifying..." : "Upload & Verify"}
        </button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
};

export default Verification;
