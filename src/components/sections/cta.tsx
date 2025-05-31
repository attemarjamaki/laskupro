import Link from "next/link";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export function BasicCta() {
  return (
    <section className={`${ubuntu.variable} py-8 md:py-16`}>
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="bg-neutral-100 w-full rounded-xl shadow-lg p-8 md:p-16 lg:p-20 text-center">
          <h2 className="text-3xl md:text-4xl font-medium font-ubuntu mb-8">
            Tee lasku nyt - ilmaiseksi ja ilman kirjautumista
          </h2>
          <p className="mb-8">
            Aloita laskun teko heti. Ei rekisteröitymistä, ei maksuja, ei
            ongelmia.
          </p>
          <div className="flex items-center justify-center">
            <Link
              href="/invoice"
              className="text-center transform rounded-lg bg-neutral-900 px-6 py-2 font-medium text-white hover:bg-neutral-800"
            >
              Luo ensimmäinen laskusi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
