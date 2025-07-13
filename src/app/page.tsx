import { BasicCta } from "@/components/sections/cta";
import { AccordionFaq } from "@/components/sections/faq";
import { GridCards } from "@/components/sections/grid-cards";
import { HeroSectionOne } from "@/components/sections/hero";
import { TextImg } from "@/components/sections/text-img";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSectionOne />
        <GridCards />
        <TextImg />
        <AccordionFaq />
        <BasicCta />
      </main>
      <Footer />
    </>
  );
}
