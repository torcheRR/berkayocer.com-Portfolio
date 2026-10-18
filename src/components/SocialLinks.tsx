import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { site, type SocialLink } from "@/lib/site";

const styles: Record<SocialLink["label"], { icon: IconType; box: string; color: string }> = {
  LinkedIn: { icon: FaLinkedin, box: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20", color: "text-blue-400" },
  GitHub: { icon: FaGithub, box: "bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20", color: "text-gray-400" },
  X: { icon: FaXTwitter, box: "bg-black/10 border-gray-500/30 hover:bg-black/20", color: "text-white" },
  Instagram: { icon: FaInstagram, box: "bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20", color: "text-pink-400" },
};

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-4 ${className}`}>
      {site.socials.map(({ label, href }) => {
        const { icon: Icon, box, color } = styles[label];
        return (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (yeni sekmede açılır)`}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${box}`}
            >
              <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
