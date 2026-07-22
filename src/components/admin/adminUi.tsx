import { LucideIcon } from "lucide-react";

export const adminInputCls =
  "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/50 transition-colors";

export const AdminCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden ${className}`}>{children}</div>
);

export const AdminCardHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
    <div className="w-8 h-8 rounded-lg bg-[#7c93c3]/12 border border-[#7c93c3]/20 flex items-center justify-center shrink-0">
      <Icon size={14} className="text-[#7c93c3]" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-white font-semibold text-sm">{title}</div>
      {subtitle && <div className="font-mono text-[9px] text-white/35 mt-0.5">{subtitle}</div>}
    </div>
    {action}
  </div>
);

export const AdminStatBox = ({
  label,
  value,
  color = "text-white",
  onClick,
}: {
  label: string;
  value: string | number;
  color?: string;
  onClick?: () => void;
}) => {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-left w-full ${
        onClick ? "hover:bg-white/[0.05] hover:border-[#7c93c3]/25 transition-colors cursor-pointer" : ""
      }`}
    >
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-[#52525b] text-xs mt-1 font-mono">{label}</p>
    </Tag>
  );
};
