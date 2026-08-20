import {
  ShieldCheck,
  Lightbulb,
  Network,
  Search,
  ScanSearch,
  PackageCheck,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Scale,
  Wallet,
  Sparkles,
} from "lucide-react";

const COLOR_STYLES = {
  green:  { color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)" },
  purple: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
  red:    { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
  blue:   { color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)" },
  orange: { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)" },
  yellow: { color: "#fde047", bg: "rgba(253,224,71,0.1)",  border: "rgba(253,224,71,0.25)" },
};

const ICON_MAP = {
  shield: ShieldCheck,
  bulb: Lightbulb,
  network: Network,
  search: Search,
  scan: ScanSearch,
  package: PackageCheck,
  mail: Mail,
  phone: Phone,
  pin: MapPin,
  grad: GraduationCap,
  scale: Scale,
  wallet: Wallet,
  spark: Sparkles,
};

export function IconBox({ icon, color = "blue", size = 22 }) {
  const LucideIcon = ICON_MAP[icon] || Sparkles;
  const s = COLOR_STYLES[color] || COLOR_STYLES.blue;
  return (
    <span
      className="icon-box"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      <LucideIcon size={size} strokeWidth={2} />
    </span>
  );
}

export const ICONS = {
  shield: "shield",
  bulb: "bulb",
  network: "network",
  search: "search",
  scan: "scan",
  package: "package",
  mail: "mail",
  phone: "phone",
  pin: "pin",
  grad: "grad",
  scale: "scale",
  wallet: "wallet",
  spark: "spark",
};

export { COLOR_STYLES };
