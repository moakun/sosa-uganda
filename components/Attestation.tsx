"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/components/Certificate";
import jsPDF from "jspdf";
import { Loader2 } from "lucide-react";

async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function Attestation() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCertificate = async () => {
    if (!session?.user?.email) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF("landscape", "mm", "a4");
      const W = 297;
      const H = 210;

      // Borders
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(1.5);
      pdf.rect(8, 8, W - 16, H - 16);
      pdf.setLineWidth(0.5);
      pdf.rect(12, 12, W - 24, H - 24);

      // Logo
      const logoData = await fetchImageAsBase64("/assets/sosal.png");
      pdf.addImage(logoData, "PNG", W / 2 - 20, 18, 40, 40);

      const userName = session.user?.fullName || "User";
      const company = session.user?.companyName || "CompanyName";
      const courseName = "Anticorruption and Business Ethics";
      const dateStr = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Intro line
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(80, 80, 80);
      pdf.text("The company Sogea Satom Uganda certify that", W / 2, 88, { align: "center" });

      // Name + company
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(20, 20, 20);
      pdf.text(
        `${userName.toUpperCase()} from the Company ${company.toUpperCase()}`,
        W / 2,
        102,
        { align: "center" }
      );

      // Completion line
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(80, 80, 80);
      pdf.text(
        "has successfully completed the following training program:",
        W / 2,
        116,
        { align: "center" }
      );

      // Course name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(20, 20, 20);
      pdf.text(courseName, W / 2, 135, { align: "center" });

      // Date
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Date: ${dateStr}`, 28, 182);

      pdf.save("certificat.pdf");

      // Update DB
      const response = await fetch("/api/certinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update attestation status");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Please sign in to view your certificate.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-screen-lg mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Certificate</h1>
          <Button onClick={downloadCertificate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Download Certificate"
            )}
          </Button>
        </div>

        {/* Certificate Preview */}
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-auto">
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
  );
}