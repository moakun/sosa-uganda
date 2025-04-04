"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/components/Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Loader2 } from "lucide-react";

export default function Attestation() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    // Check if certificate ref and session email are available
    if (!certificateRef.current || !session?.user?.email) return;

    setIsGenerating(true);
    try {
      // Generate the certificate image using html2canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Try increasing the scale for better resolution
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Convert canvas to PDF using jsPDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("landscape", "mm", "a4"); // A4 size, landscape orientation
      const imgWidth = 297; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Keep aspect ratio
      const scaledHeight = imgHeight > 210 ? 210 : imgHeight; // Scale if image is too large  

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, scaledHeight);
      pdf.save("certificat.pdf");


      // Update attestation status in the database
      const response = await fetch("/api/certinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }), // Pass the session email
      });

      if (!response.ok) {
        throw new Error("Failed to update attestation status");
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // If the session is not available, prompt the user to sign in
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Please sign in to view your certificate.</p>
      </div>
    );
  }

  // Render the certificate page with a download button
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-screen-lg mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Certificate</h1>
          <Button onClick={downloadCertificate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loading spinner while generating
            ) : (
              "Download Certificate"
            )}
          </Button>
        </div>

        {/* Certificate Preview */}
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-auto">
            <div ref={certificateRef}>
              <Certificate
                userName={session.user?.fullName || "User"}
                company={session.user?.companyName || "CompanyName"}
                date={new Date()}
                courseName="Anticorruption and Business Ethics"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}