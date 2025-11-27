"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-[360px] lg:max-w-[360px] bg-black/40 border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl backdrop-blur-sm lg:sticky lg:top-16 self-start lg:h-fit cursor-default">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative h-40 w-40 rounded-xl overflow-hidden bg-white/5">
          {/* Profil görselini daha sonra /public içine ekleyebilirsin */}
          <Image
            src="/IMG_9912.JPG"
            alt="Berkay ÖCER"
            fill
            className=" p-3 rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Berkay ÖCER</h2>
          <p className="mt-1 inline-block text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
            Yazılım Mühendisi
          </p>
        </div>
      </div>

      <div className="my-8 h-px bg-white/10" />

      <ul className="flex flex-col gap-4 text-sm">
        <li className="flex items-center gap-3">
          <span className="inline-grid place-items-center h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <MdEmail className="w-6 h-6 text-blue-400" />
          </span>
          <div>
            <p className="text-white/60">Email</p>
            <a
              className="hover:underline"
              href="mailto:berkayocer2003@gmail.com"
            >
              berkayocer2003@gmail.com
            </a>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-grid place-items-center h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/30">
            <MdLocationOn className="w-6 h-6 text-red-400" />
          </span>
          <div>
            <p className="text-white/60">Yaşam Yeri</p>
            <p>İstanbul / Kağıthane</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-grid place-items-center h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/30">
            <FaPhoneAlt className="w-6 h-6 text-green-400" />
          </span>
          <div>
            <p className="text-white/60">Telefon</p>
            <p>+90 534 484 6406</p>
          </div>
        </li>
      </ul>

      <div className="my-8 h-px bg-white/10" />

      <div className="flex items-center justify-center gap-4">
        <Link
          href="https://linkedin.com/in/berkayocer"
          target="_blank"
          className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/20 transition-colors"
        >
          <FaLinkedin className="w-5 h-5 text-blue-400" />
        </Link>
        <Link
          href="https://github.com/torcheRR"
          target="_blank"
          className="w-10 h-10 rounded-lg bg-gray-500/10 border border-gray-500/30 flex items-center justify-center hover:bg-gray-500/20 transition-colors"
        >
          <FaGithub className="w-5 h-5 text-gray-400" />
        </Link>
        <Link
          href="https://x.com/berkayocer_"
          target="_blank"
          className="w-10 h-10 rounded-lg bg-black/10 border border-gray-500/30 flex items-center justify-center hover:bg-black/20 transition-colors"
        >
          <FaXTwitter className="w-5 h-5 text-white" />
        </Link>
        <Link
          href="https://www.instagram.com/berkayocer_/"
          target="_blank"
          className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center hover:bg-pink-500/20 transition-colors"
        >
          <FaInstagram className="w-5 h-5 text-pink-400" />
        </Link>
      </div>
    </aside>
  );
}
