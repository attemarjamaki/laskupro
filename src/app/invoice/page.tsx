"use client";

import InvoiceForm from "@/components/invoice-form";
import { useState } from "react";
import { Invoice } from "@/types/invoice";

export default function InvoicePage() {
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: Invoice) => {
    try {
      console.log("Sending data to API:", data);

      // Send data to API
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API request failed");
      }

      // Get PDF as blob
      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open in new tab
      console.log("Opening PDF URL:", pdfUrl);
      window.open(pdfUrl, "_blank");

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
        console.log("Blob URL revoked");
      }, 1000);
      //@ts-ignore
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Failed to generate PDF");
    }
  };

  return (
    <section className="py-8 px-4 container mx-auto">
      <div className="max-w-5xl mx-auto">
        <div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <InvoiceForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </section>
  );
}
