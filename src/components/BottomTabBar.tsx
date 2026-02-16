import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Stethoscope, Pill, Phone, Mail } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const BottomTabBar = () => {
  const location = useLocation();
  const { t } = useLang();

  const tabs = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/symptoms", icon: Stethoscope, label: t("nav.symptoms") },
    { to: "/medicine", icon: Pill, label: t("nav.medicine") },
    { to: "/emergency", icon: Phone, label: "SOS" },
    { to: "/contact", icon: Mail, label: t("nav.contact") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              <span className="truncate max-w-[60px]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
