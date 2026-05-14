import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types";

const Header: React.FC<{ onToggleSidebar: () => void }> = ({
  onToggleSidebar,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadgeColor = (role: Role): string => {
    const colors: Record<Role, string> = {
      [Role.ADMIN]: "bg-danger/15 text-danger border-danger/30",
      [Role.BASE_COMMANDER]: "bg-info/15 text-info border-info/30",
      [Role.LOGISTICS_OFFICER]: "bg-warning/15 text-warning border-warning/30",
    };
    return colors[role] || "bg-bg-hover text-text-secondary";
  };

  return (
    <header className="sticky top-0 z-40 glass-strong">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-hover transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <svg className="w-5 h-5 text-bg-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-text-primary leading-tight">
                MILITARY ASSET
              </h1>
              <p className="text-[10px] font-medium text-accent tracking-[0.2em]">
                MANAGEMENT SYSTEM
              </p>
            </div>
          </Link>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-text-primary leading-tight">
                    {user.name}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-accent font-bold text-sm border border-border-light">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-bg-surface border border-border rounded-xl shadow-xl shadow-black/30 py-2 animate-slide-up z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                    <p className="text-xs text-text-muted mt-0.5">Base: {user.assignedBase}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
