import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Role, INavItem } from "../../types";

const navigationItems: INavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    roles: [Role.ADMIN, Role.BASE_COMMANDER, Role.LOGISTICS_OFFICER],
  },
  // Admin Routes
  {
    label: "User Management",
    path: "/admin/users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    roles: [Role.ADMIN],
  },
  {
    label: "Asset Management",
    path: "/admin/assets",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    roles: [Role.ADMIN],
  },
  // Base Commander Routes
  {
    label: "Order Assets",
    path: "/commander/order",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
    roles: [Role.BASE_COMMANDER],
  },
  {
    label: "Order Tracking",
    path: "/commander/tracking",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    roles: [Role.BASE_COMMANDER],
  },
  // Logistics Officer Routes
  {
    label: "Order Management",
    path: "/logistics/orders",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    roles: [Role.LOGISTICS_OFFICER],
  },
  {
    label: "Shipping Updates",
    path: "/logistics/shipping",
    icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    roles: [Role.LOGISTICS_OFFICER],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  const filteredNav = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const getSectionLabel = (): string => {
    switch (user.role) {
      case Role.ADMIN:
        return "ADMINISTRATION";
      case Role.BASE_COMMANDER:
        return "OPERATIONS";
      case Role.LOGISTICS_OFFICER:
        return "LOGISTICS";
      default:
        return "NAVIGATION";
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-40
          w-64 bg-bg-surface border-r border-border
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Nav Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Dashboard link */}
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-accent/15 text-accent border border-accent/20"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent"
              }`
            }
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d={navigationItems[0].icon}
              />
            </svg>
            Dashboard
          </NavLink>

          {/* Section Divider */}
          <div className="pt-4 pb-2">
            <p className="px-3 text-[10px] font-bold text-text-muted tracking-[0.15em] uppercase">
              {getSectionLabel()}
            </p>
          </div>

          {/* Role-specific links */}
          {filteredNav.slice(1).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-accent/15 text-accent border border-accent/20"
                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent"
                }`
              }
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d={item.icon}
                />
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Base Info */}
        <div className="p-4 border-t border-border">
          <div className="px-3 py-2 bg-bg-dark/50 rounded-lg">
            <p className="text-[10px] font-bold text-text-muted tracking-wider uppercase mb-1">
              ASSIGNED BASE
            </p>
            <p className="text-sm font-medium text-accent truncate">
              {user.assignedBase}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
