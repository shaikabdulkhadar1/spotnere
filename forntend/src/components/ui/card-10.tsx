"use client";

import * as React from "react";
import {
  motion,
  useSpring,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

// Define the props for the component
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number;
  change: number;
  changeDescription: string;
  icon: React.ReactNode;
  valueIcon?: LucideIcon;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      change,
      changeDescription,
      icon,
      valueIcon,
      className,
      ...props
    },
    ref
  ) => {
    // Determine trend for styling
    const isPositive = change >= 0;

    // Ref for intersection observer
    const cardRef = React.useRef(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.3 });

    // Framer Motion hook for animating the number
    const motionValue = useSpring(0, {
      damping: 100,
      stiffness: 100,
    });

    // Transform the motion value to a rounded integer for display
    const displayValue = useTransform(motionValue, (latest) =>
      Math.round(latest).toLocaleString()
    );

    React.useEffect(() => {
      // Only animate when the component comes into view
      if (isInView) {
        const controls = animate(motionValue, value, {
          duration: 2,
          ease: "easeOut",
        });
        return controls.stop;
      }
    }, [isInView, value, motionValue]);

    // Construct a meaningful ARIA label for accessibility
    const ariaLabel = `${title}: ${value}. Change is ${
      change > 0 ? "+" : ""
    }${change}% ${changeDescription}.`;

    return (
      <div
        ref={(node) => {
          // Merge refs: external ref and internal ref for intersection observer
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          cardRef.current = node;
        }}
        className={cn(
          "flex flex-col gap-2 rounded-xl border bg-card p-6 text-card-foreground shadow",
          className
        )}
        aria-label={ariaLabel}
        role="region"
        {...props}
      >
        {/* Main animated value */}
        <div className="flex items-baseline gap-1">
          {valueIcon &&
            React.createElement(valueIcon, {
              className: "w-6 h-6 text-muted-foreground shrink-0",
            })}
          <motion.p className="text-5xl ml-1 font-bold tracking-tighter">
            {displayValue}
          </motion.p>
          <span className="text-2xl font-semibold text-muted-foreground">
            +
          </span>
        </div>

        {/* Title */}
        <p className="text-base text-muted-foreground">{title}</p>

        {/* Change indicator */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center rounded-full p-1.5",
              isPositive ? "bg-green-500/20" : "bg-red-500/20"
            )}
          >
            {icon}
          </span>
          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-semibold",
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span> from {changeDescription}</span>
          </p>
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };
