import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-4 py-2.5 
          bg-bg-dark border rounded-lg
          text-text-primary placeholder-text-muted
          text-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-danger focus:ring-danger/40" : "border-border hover:border-border-light"}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
