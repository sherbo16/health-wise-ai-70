import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Stethoscope, Pill, Phone, Mail, Heart, Languages } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const { t, lang, toggleLang } = useLang();

  const links = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/symptoms", icon: Stethoscope, label: t("nav.symptoms") },
    { to: "/medicine", icon: Pill, label: t("nav.medicine") },
    { to: "/emergency", icon: Phone, label: t("nav.emergency") },
    { to: "/contact", icon: Mail, label: t("nav.contact") },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">{t("app.title")}</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="p-4 border-t">
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <Languages className="h-5 w-5" />
          {lang === "en" ? "தமிழ் (Tamil)" : "English"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
