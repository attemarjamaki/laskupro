import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import InvoicePDF from "@/components/invoice-pdf";
import { Invoice } from "@/types/invoice";

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const invoice: Invoice = await request.json();

    // Validate data
    if (
      !invoice.sender.name ||
      !invoice.recipient.name ||
      !invoice.details.invoiceNumber
    ) {
      return NextResponse.json(
        { error: "Invalid invoice data" },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfDoc = <InvoicePDF invoice={invoice} />;
    const pdfBuffer = await renderToBuffer(pdfDoc);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=invoice.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
