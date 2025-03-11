import React, { useEffect } from "react";
import "./verification.css";

const Verification = () => {
  useEffect(() => {
    // Initialize Liveness SDK
    window.RegulaLiveness.init({
      license: "/regula.license",
      onReady: () => console.log("Liveness SDK ready"),
      onError: (error) => console.error("Liveness SDK error:", error),
    });
    
    // Initialize Document Verification SDK
    window.RegulaDocument.init({
      license: "/regula.license",
      onReady: () => console.log("Document SDK ready"),
      onError: (error) => console.error("Document SDK error:", error),
    });
  }, []);
  
  const handleLivenessCheck = async () => {
    try {
      const result = await window.RegulaLiveness.start();
      console.log("Liveness result:", result);
      alert("Liveness Check Success!");
    } catch (error) {
      console.error("Liveness Check Error:", error);
      alert("Liveness Check Failed!");
    }
  };
  
  const handleDocumentVerification = async () => {
    try {
      const result = await window.RegulaDocument.start();
      console.log("Document Verification result:", result);
      alert("Document Verification Success!");
    } catch (error) {
      console.error("Document Verification Error:", error);
      alert("Document Verification Failed!");
    }
  };
  
  return (
    <div className="container">
      <h1>Regula Verification</h1>
      <button className="button" onClick={handleLivenessCheck}>
        Start Liveness Check
      </button>
      <button className="button" onClick={handleDocumentVerification}>
        Start Document Verification
      </button>
    </div>
  );
};

export default Verification;
