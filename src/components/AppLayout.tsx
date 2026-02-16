import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";
import MobileHeader from "./MobileHeader";
import { useLang } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
        <footer className="border-t py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>{t("footer.secure")}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("footer.disclaimer")}</p>
        </footer>
        <BottomTabBar />
      </div>
    </div>
  );
};

export default AppLayout;
