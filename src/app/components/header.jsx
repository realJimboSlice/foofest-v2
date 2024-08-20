"use client";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import { useState } from "react";
import MobileNavigation from "./MobileNavigation";

export default function Header() {
  return (
    <header className="">
      <nav className="w-full fixed top-0 left-0 right-0 z-10 bg-black">
        <div className="justify-between md:mx-10">
          <div>
            <div className="flex items-center justify-between">
              <Link href="/" className="flex flex-col items-center">
                <Image
                  src="/assets/images/foofest-banner-nobg.webp"
                  alt="Foofest Logo"
                  aria-label="Home Button"
                  width={100}
                  height={100}
                />
              </Link>
              <div>
                <MobileNavigation />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
