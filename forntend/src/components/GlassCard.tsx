import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className, hover = true, ...props }: GlassCardProps) => {
  return (
    <div
      {...props}
      className={cn(
        "glass-card rounded-xl p-6 transition-smooth",
        hover && "hover-lift cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
