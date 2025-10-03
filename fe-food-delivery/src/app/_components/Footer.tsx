"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="text-white ">
      {/* Top Banner */}
      <div className="bg-[#EF4444] text-white py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-scroll py-4 px-3">
          {Array(10)
            .fill("Fresh fast delivered")
            .map((text, i) => (
              <span
                key={i}
                className="inline-block mx-8 font-semibold text-base"
              >
                {text}
              </span>
            ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#0B0D12] py-10 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-5 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image src="/nomlogo.png" alt="NomNom" width={140} height={50} />
            </div>
          </div>

          {/* NOMNOM Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">NOMNOM</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="hover:text-white transition-colors"
                >
                  Delivery zone
                </Link>
              </li>
            </ul>
          </div>

          {/* MENU Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">MENU</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/#appetizers"
                  className="hover:text-white transition-colors"
                >
                  Appetizers
                </Link>
              </li>
              <li>
                <Link
                  href="/#salads"
                  className="hover:text-white transition-colors"
                >
                  Salads
                </Link>
              </li>
              <li>
                <Link
                  href="/#pizzas"
                  className="hover:text-white transition-colors"
                >
                  Pizzas
                </Link>
              </li>
              <li>
                <Link
                  href="/#main-dishes"
                  className="hover:text-white transition-colors"
                >
                  Main dishes
                </Link>
              </li>
              <li>
                <Link
                  href="/#desserts"
                  className="hover:text-white transition-colors"
                >
                  Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Additional Menu Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm invisible">
              MENU
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/#side-dish"
                  className="hover:text-white transition-colors"
                >
                  Side dish
                </Link>
              </li>
              <li>
                <Link
                  href="/#brunch"
                  className="hover:text-white transition-colors"
                >
                  Brunch
                </Link>
              </li>
              <li>
                <Link
                  href="/#desserts"
                  className="hover:text-white transition-colors"
                >
                  Desserts
                </Link>
              </li>
              <li>
                <Link
                  href="/#beverages"
                  className="hover:text-white transition-colors"
                >
                  Beverages
                </Link>
              </li>
              <li>
                <Link
                  href="/#fish-sea"
                  className="hover:text-white transition-colors"
                >
                  Fish & Sea foods
                </Link>
              </li>
            </ul>
          </div>

          {/* FOLLOW US Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">FOLLOW US</h3>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <Facebook size={20} className="text-gray-800" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <Instagram size={20} className="text-gray-800" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Copy right 2024 © Nomnom LLC
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms and condition
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookie policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: inline-block;
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </footer>
  );
};
