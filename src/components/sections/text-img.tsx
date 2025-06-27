import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export function TextImg() {
  const benefits = [
    "Täysin ilmainen",
    "Ei rekisteröitymistä",
    "Nopea ja helppokäyttöinen",
    "Ammattimainen PDF-lasku",
    "Suunniteltu suomalaisille yrittäjille",
  ];

  return (
    <section className={`${ubuntu.variable} py-8 md:py-16`}>
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center py-8 lg:py-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-medium mb-12 text-center font-ubuntu">
              Miksi käyttää LaskuProta?
            </h2>
            <div className="space-y-4 mb-8 md:mb-0">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-end">
            <Image
              src="/images/woman-laptop.jpg"
              width={400}
              height={400}
              alt="desk"
              className="rounded-3xl object-cover w-full md:w-[360px] aspect-square shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
