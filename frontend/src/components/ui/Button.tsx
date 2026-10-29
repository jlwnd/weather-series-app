import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "danger";
  size?: "md" | "sm";
  icon?: ReactNode;
};

export function Button({
  variant = "default",
  size = "md",
  icon,
  type = "button",
  className,
  children,
  ...rest
}: Props) {
  const classes = [
    "btn",
    variant === "primary" && "btn-primary",
    variant === "danger" && "btn-danger",
    size === "sm" && "btn-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}
