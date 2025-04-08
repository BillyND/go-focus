import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
  ...props
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center font-medium transition-colors";

  const variantStyles = {
    primary: "bg-gray-800 hover:bg-gray-900 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
    icon: "border border-gray-300 hover:bg-gray-100 p-0 flex items-center justify-center",
  };

  const sizeStyles = {
    sm: variant === "icon" ? "h-8 w-8" : "text-xs px-2 py-1 rounded",
    md: variant === "icon" ? "h-9 w-9" : "text-sm px-3 py-2 rounded-md",
    lg: variant === "icon" ? "h-10 w-10" : "px-4 py-2 rounded-md",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
