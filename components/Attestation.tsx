"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/components/Certificate";
import html2canvas from "html2canvas";
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
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Convert canvas to image and trigger download
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = "certificate.png";
      link.href = image;
      link.click();

      // Update attestation status in the database
      const response = await fetch("/api/certinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }), // Pass the session email
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update attestation status");
      }

      console.log("Attestation status updated successfully");
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
          <h1 className="text-2xl font-bold">Votre Attestation</h1>
          <Button onClick={downloadCertificate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loading spinner while generating
            ) : (
              "Télécharger"
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
                courseName="Anticorruption et Éthique des Affaires"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
