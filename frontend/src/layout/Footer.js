import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram } from "lucide-react";
import { SocialLinksAPI } from "../services/social-links.service";

export default function Footer() {
  const year = new Date().getFullYear();
  const text = `Copyright ${year} Rabina Dahal Portfolio. All Rights Reserved.`;
  const socialQ = useQuery({ queryKey: ["social-links-public"], queryFn: SocialLinksAPI.getPublic });
  const social = socialQ.data || {};
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-[#151a2f]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff5e73]/70 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-white/70">
        <div className="font-medium tracking-[0.02em]">{text}</div>
        <div className="flex items-center gap-5">
          {social.facebookUrl ? (
            <div className="yazen-social-tooltip">
              <a
                href={social.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="yazen-social-icon"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <span className="yazen-social-tooltip-label">Facebook</span>
            </div>
          ) : null}
          {social.instagramUrl ? (
            <div className="yazen-social-tooltip">
              <a
                href={social.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="yazen-social-icon"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <span className="yazen-social-tooltip-label">Instagram</span>
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
