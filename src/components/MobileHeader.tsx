import { Heart, Languages } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const MobileHeader = () => {
  const { lang, toggleLang, t } = useLang();

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-card/95 backdrop-blur">
      <Link to="/" className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary" />
        <span className="font-bold text-foreground">{t("app.title")}</span>
      </Link>
      <button
        onClick={toggleLang}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground"
      >
        <Languages className="h-4 w-4" />
        {lang === "en" ? "தமிழ்" : "EN"}
      </button>
    </header>
  );
};

export default MobileHeader;
