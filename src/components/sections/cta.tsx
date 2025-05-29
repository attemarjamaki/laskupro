import { Button } from "@/components/ui/button";

export function BasicCta() {
  return (
    <section className="py-8 md:py-16">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="bg-neutral-100 w-full rounded-xl shadow-lg p-8 md:p-16 lg:p-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">
            Tee lasku nyt - ilmaiseksi ja ilman kirjautumista
          </h2>
          <p className="mb-8">
            Aloita laskun teko heti. Ei rekisteröitymistä, ei maksuja, ei
            ongelmia.
          </p>
          <div className="flex items-center justify-center">
            <Button size="lg">Luo ensimmäinen laskusi</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
