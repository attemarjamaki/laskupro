import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionFaq() {
  return (
    <section className="py-8 md:py-16">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
          Usein kysytyt kysymykset
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Onko LaskuPro ilmainen?</AccordionTrigger>
            <AccordionContent>
              Kyllä, Laskupro on täysin maksuton käyttää. Ei piilomaksuja tai
              rajoituksia.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Tallennetaanko tietojani?</AccordionTrigger>
            <AccordionContent>
              Ei - LaskuPro ei tallenna syöttämiäsi tietoja. Kaikki tiedot
              käsitellään paikallisesti selaimessasi.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Minkälaisia laskuja voin tehdä?</AccordionTrigger>
            <AccordionContent>
              Voit luoda tavallisia myyntilaskuja suomalaisille asiakkaille.
              Lasku sisältää kaikki tarvittavat tiedot ja on ALV-säännösten
              mukainen.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Toimiiko palvelu mobiililaitteilla?
            </AccordionTrigger>
            <AccordionContent>
              Kyllä! Laskupro toimii sujuvasti sekä tietokoneella että
              mobiililaitteilla.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
