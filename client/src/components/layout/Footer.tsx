import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-bg-surface/50">
      <div className="px-4 lg:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} Military Asset Management System. All
          rights reserved.
        </p>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse-slow" />
          <span>System Operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
