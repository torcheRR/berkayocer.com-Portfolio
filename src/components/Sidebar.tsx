import Image from "next/image";
import { MdEmail, MdLocationOn } from "react-icons/md";
import SocialLinks from "./SocialLinks";
import { site } from "@/lib/site";

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-[360px] lg:max-w-[360px] bg-black/40 border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl backdrop-blur-sm lg:sticky lg:top-16 self-start lg:h-fit cursor-default">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative h-40 w-40 rounded-xl overflow-hidden bg-white/5">
          <Image
            src="/IMG_9912.JPG"
            alt="Berkay ÖCER"
            fill
            sizes="160px"
            priority
            className=" p-3 rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-2xl font-semibold">{site.name}</p>
          <p className="mt-1 inline-block text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
            {site.role}
          </p>
        </div>
      </div>

      <div className="my-8 h-px bg-white/10" />

      <ul className="flex flex-col gap-4 text-sm">
        <li className="flex items-center gap-3">
          <span className="inline-grid place-items-center h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <MdEmail className="w-6 h-6 text-blue-400" aria-hidden="true" />
          </span>
          <div>
            <p className="text-white/60">Email</p>
            <a className="hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-grid place-items-center h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/30">
            <MdLocationOn className="w-6 h-6 text-red-400" aria-hidden="true" />
          </span>
          <div>
            <p className="text-white/60">Yaşam Yeri</p>
            <p>{site.location}</p>
          </div>
        </li>
      </ul>

      <div className="my-8 h-px bg-white/10" />

      <SocialLinks className="items-center justify-center" />
    </aside>
  );
}
