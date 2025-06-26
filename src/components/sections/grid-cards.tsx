import { FileText, Send, Plus } from "lucide-react";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export function GridCards() {
  return (
    <section className={`${ubuntu.variable} py-8 md:py-16`}>
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium mb-12 text-center font-ubuntu">
          Miten se toimii?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          <div className="w-full bg-neutral-100 rounded-xl shadow-lg">
            <div className="p-10">
              <div className="flex items-center justify-center">
                <div className="size-16 p-4 bg-blue-300 rounded-full">
                  <FileText size={32} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-8 text-center">
                1. Täytä lomake
              </h3>
              <p className="mt-4 text-center">
                Kirjoita laskun tiedot helppokäyttöiseen kenttäpohjaan.
              </p>
            </div>
          </div>
          <div className="w-full bg-neutral-100 rounded-xl shadow-lg">
            <div className="p-10">
              <div className="flex items-center justify-center">
                <div className="size-16 p-4 bg-blue-300 rounded-full">
                  <Plus size={32} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-8 text-center">
                2. Luo PDF-lasku
              </h3>
              <p className="mt-4 text-center">
                Klikkaa &quot;Esikatsele PDF&quot; ja saat heti valmiin PDF:n.
              </p>
            </div>
          </div>
          <div className="w-full bg-neutral-100 rounded-xl shadow-lg">
            <div className="p-10">
              <div className="flex items-center justify-center">
                <div className="size-16 p-4 bg-blue-300 rounded-full">
                  <Send size={32} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-8 text-center">
                3. Lähetä asiakkaille
              </h3>
              <p className="mt-4 text-center">
                Lataa tiedosto ja lähetä sähköpostilla tai tulosta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
