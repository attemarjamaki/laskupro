"use client";

import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";
import InvoicePDF from "@/components/invoice-pdf";

export default function InvoicePreview() {
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);

  useEffect(() => {
    // Retrieve invoice data from sessionStorage
    const storedData = sessionStorage.getItem("invoiceData");
    if (storedData) {
      setInvoiceData(JSON.parse(storedData));
      // Optionally, clear the data after loading to avoid stale data
      sessionStorage.removeItem("invoiceData");
    }
  }, []);

  if (!invoiceData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">No invoice data available</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <PDFViewer width="100%" height="100%">
        <InvoicePDF invoice={invoiceData} />
      </PDFViewer>
    </div>
  );
}
