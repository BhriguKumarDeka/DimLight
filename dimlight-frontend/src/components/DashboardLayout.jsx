import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Moon, BookOpen, Wind, Plus, LogOut,
  Sparkles, Menu, X, Settings as SettingsIcon, User
} from "lucide-react";
import { useState } from "react";
import LogSleepModal from "./LogSleepModal";
import NightSky from "./NightSky";

// SidebarItem
const SidebarItem = ({ icon: Icon, label, to, onClick, isActive, onCloseMobile }) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (onCloseMobile) onCloseMobile();
  };
  const content = (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group cursor-pointer ${isActive
        ? "bg-text text-background font-medium shadow-glow"
        : "text-textMuted hover:text-text hover:bg-text/5"
      }`}>
      <Icon size={18} className={isActive ? "text-background" : "text-textMuted group-hover:text-text"} />
      <span className="text-sm">{label}</span>
    </div>
  );

  return to ? (
    <Link to={to} onClick={() => onCloseMobile && onCloseMobile()}>{content}</Link>
  ) : (
    <div onClick={handleClick}>{content}</div>
  );
};

export default function DashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Get User Info
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "ME";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen bg-surface text-text font-sans selection:bg-primary/30 relative">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight">DimLight</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col p-4 transition-transform duration-300 lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center gap-2 mb-8 px-4 mt-2">
          <Moon className="w-5 h-5 text-white" />
          <span className="text-xl font-extralight tracking-tight">DimLight</span>
        </div>

        <nav className="flex flex-col flex-1 space-y-1">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            to="/dashboard"
            isActive={isActive("/dashboard")}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <SidebarItem
            icon={Sparkles}
            label="Insights"
            to="/insights"
            isActive={isActive("/insights")}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <SidebarItem
            icon={BookOpen}
            label="Journal"
            to="/diary"
            isActive={isActive("/diary")}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <SidebarItem
            icon={Wind}
            label="Techniques"
            to="/techniques"
            isActive={isActive("/techniques") || location.pathname.startsWith("/techniques")}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        </nav>

        {/* Profile Footer */}
        <div className="pt-4 border-t border-border mt-auto space-y-2">

          {/* User Profile */}
          <Link
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group border ${isActive("/settings")
                ? "bg-surface border-primary/30 shadow-lg"
                : "border-transparent hover:bg-text/5 hover:border-border"
              }`}
          >
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">
                {user.name || "Guest User"}
              </div>
              <div className="text-[10px] text-textMuted font-mono truncate opacity-70 group-hover:opacity-100">
                {user.email || "Sign in to sync"}
              </div>
            </div>
            {/* Settings Icon */}
            <SettingsIcon size={14} className="ml-auto text-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/login"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-textMuted hover:text-error w-full text-left rounded-lg hover:bg-error/5 transition-colors"
          >
            <LogOut size={16} /> <span className="text-xs font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="relative bg-background min-h-screen lg:pl-64 pt-12 lg:pt-0 z-10">
        <NightSky minimal />
        <div className="p-6 lg:p-10 pt-6 max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Modals */}
      <LogSleepModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} onSuccess={() => window.location.reload()} />
    </div>
  );
}