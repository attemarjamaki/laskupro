import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import InvoiceSubmit from "@/components/invoice-submit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uusi lasku",
  description:
    "Luo uusi PDF-lasku helposti. Käytä valmista laskupohjaa ja lähetä ammattimainen lasku muutamassa minuutissa.",
};

export default function InvoicePage() {
  return (
    <main>
      <Header />
      <InvoiceSubmit />
      <Footer />
    </main>
  );
}
