import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  value,
  icon,
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-bg-surface border border-border rounded-xl p-5
        transition-all duration-200
        hover:border-border-light hover:shadow-lg hover:shadow-black/10
        ${onClick ? "cursor-pointer hover:scale-[1.01]" : ""}
        ${className}
      `}
    >
      {(title || value || icon) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {subtitle && (
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                {subtitle}
              </p>
            )}
            {value !== undefined && (
              <p className="text-2xl font-bold text-text-primary mb-1">
                {value}
              </p>
            )}
            {title && (
              <p className="text-sm text-text-secondary truncate">{title}</p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 p-2.5 bg-accent/10 text-accent rounded-lg">
              {icon}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
