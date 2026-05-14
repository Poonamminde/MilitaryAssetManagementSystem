import React from "react";
import { OrderStatus, AssetStatus } from "../../types";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  info: "bg-info/15 text-info border-info/30",
  default: "bg-bg-hover text-text-secondary border-border",
};

const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium rounded-full border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// ─── Helper: Order Status Badge ──────────────────────────────────────────────

export const getOrderStatusVariant = (status: OrderStatus): BadgeVariant => {
  const map: Record<OrderStatus, BadgeVariant> = {
    [OrderStatus.PENDING]: "warning",
    [OrderStatus.APPROVED]: "info",
    [OrderStatus.DISPATCHED]: "info",
    [OrderStatus.IN_TRANSIT]: "warning",
    [OrderStatus.DELIVERED]: "success",
    [OrderStatus.REJECTED]: "danger",
  };
  return map[status] || "default";
};

// ─── Helper: Asset Status Badge ──────────────────────────────────────────────

export const getAssetStatusVariant = (status: AssetStatus): BadgeVariant => {
  const map: Record<AssetStatus, BadgeVariant> = {
    [AssetStatus.AVAILABLE]: "success",
    [AssetStatus.LOW_STOCK]: "warning",
    [AssetStatus.OUT_OF_STOCK]: "danger",
    [AssetStatus.DECOMMISSIONED]: "default",
  };
  return map[status] || "default";
};

export default Badge;
