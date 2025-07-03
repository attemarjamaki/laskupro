"use client";

import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";
import InvoicePDF from "@/components/invoice-pdf";
import { LoaderCircle } from "lucide-react";

export default function InvoicePreview() {
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const storedData = sessionStorage.getItem("invoiceData");
      if (storedData) {
        setInvoiceData(JSON.parse(storedData));
        sessionStorage.removeItem("invoiceData");
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

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
