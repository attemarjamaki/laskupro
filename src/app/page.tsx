import { BasicCta } from "@/components/sections/cta";
import { AccordionFaq } from "@/components/sections/faq";
import { GridCards } from "@/components/sections/grid-cards";
import { HeroSectionOne } from "@/components/sections/hero";
import { TextImg } from "@/components/sections/text-img";

export default function Home() {
  return (
    <div>
      <main>
        <HeroSectionOne />
        <GridCards />
        <TextImg />
        <AccordionFaq />
        <BasicCta />
      </main>
    </div>
  );
}
