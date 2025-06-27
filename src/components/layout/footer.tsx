import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-16">
      <div className="container max-w-7xl mx-auto flex justify-between gap-4 items-center px-4">
        <div>
          &copy; {new Date().getFullYear()} LaskuPro |{" "}
          <Link href={"https://www.lappersdigital.com/"} target="_blank">
            Lappers Digital
          </Link>
        </div>
        <div>All rights reserved.</div>
      </div>
    </footer>
  );
}
