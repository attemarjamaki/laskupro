"use client";

import Image from "next/image";
import React from "react";
import { Ubuntu } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export default function Header() {
  const pathname = usePathname();
  const hideButton = pathname === "/invoice";

  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-6">
      <Link href="/" className="py-1">
        <div className={`${ubuntu.variable} flex items-center gap-2`}>
          <div className="size-6 md:size-8">
            <Image
              src="/images/logo-lp.png"
              alt="logo"
              width={80}
              height={80}
            />
          </div>
          <p className="text-lg font-medium md:text-2xl font-ubuntu">
            LaskuPro
          </p>
        </div>
      </Link>

      {!hideButton && (
        <Link
          href={"/invoice"}
          className="text-center transform rounded-lg bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Uusi lasku
        </Link>
      )}
    </nav>
  );
}
