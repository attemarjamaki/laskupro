"use client";

import InvoiceForm from "@/components/invoice-form";
import { useState } from "react";
import { Invoice } from "@/types/invoice";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function InvoicePage() {
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: Invoice) => {
    try {
      sessionStorage.setItem("invoiceData", JSON.stringify(data));
      window.open("/invoice/pdf", "_blank");

      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || "Failed to process invoice");
    }
  };

  return (
    <>
      <Header />
      <section className="py-8 px-4 container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <InvoiceForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
