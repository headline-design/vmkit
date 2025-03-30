"use client";

import { cn } from "@/lib/utils";
import styles from "./styles.module.css";

// Function to get the correct style based on the variant
const getVariantStyle = (variant) => {
  const variantStyles = {
    rust: styles.rustColors,
    default: styles.rustColors,
    neutral: styles.neutralColors,
    info: styles.neutralColors,
    error: styles.errorColors,
    warning: styles.warningColors,
    success: styles.successColors,
    blue: styles.successColrs,
    teal: styles.tealColors,
    purple: styles.purpleColors,
  };

  // Return the corresponding style or undefined if the variant is not recognized
  return variantStyles[variant];
};

export const Badge = ({
  text,
  variant,
  className,
  onClick,
  children,
}: {
  text?: string;
  variant?:
    | "purple"
    | "blue"
    | "black"
    | "teal"
    | "warning"
    | "success"
    | "danger"
    | "destructive"
    | "gray"
    | "rust"
    | "neutral"
    | "secondary"
    | "outline"
    | "default";
  className?: string;
  onClick?: any;
  children?: React.ReactNode;
}) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        styles.badge,
        getVariantStyle(variant), // Use the function to get the correct style
        className,
        {
          "bg-red-2 text-red-3 dark:bg-red-3 dark:text-red-2 ":
            variant === "danger" || variant === "destructive",
          "border-primary-accent bg-black text-white": variant === "black",
          "border bg-gray-400 text-white": variant === "gray",
          "border text-secondary": variant === "neutral",
          "flex border bg-accent-muted text-primary-accent":
            variant === "outline",
          "border bg-secondary text-primary": variant === "secondary",
        },
      )}
    >
      {text && <span className={styles.badgeContentContainer}> {text} </span>}
      {children}
    </span>
  );
};

export default Badge;
