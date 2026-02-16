import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import { Siren, Phone, MapPin, Hospital } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const hospitals = [
  {
    name: { en: "City General Hospital", ta: "நகர பொது மருத்துவமனை" },
    distance: "1.2 km",
    phone: "tel:+911234567890",
    address: { en: "12 Main Road, City Center", ta: "12 மெயின் ரோடு, நகர மையம்" },
  },
  {
    name: { en: "Apollo Health Center", ta: "அப்பல்லோ சுகாதார மையம்" },
    distance: "2.8 km",
    phone: "tel:+919876543210",
    address: { en: "45 Park Avenue, West Zone", ta: "45 பார்க் அவென்யூ, மேற்கு மண்டலம்" },
  },
  {
    name: { en: "Sri Ramachandra Medical", ta: "ஸ்ரீ ராமசந்திர மருத்துவமனை" },
    distance: "4.1 km",
    phone: "tel:+914455667788",
    address: { en: "78 Lake View Road, South District", ta: "78 ஏரி பார்வை சாலை, தெற்கு மாவட்டம்" },
  },
];

const EmergencySOS = () => {
  const { t, lang } = useLang();
  const [showHospitals, setShowHospitals] = useState(false);

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Siren className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("sos.title")}</h1>
          </div>
        </div>

        {/* Emergency Call */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-lg font-semibold text-destructive">{t("sos.emergency")}</p>
            <a href="tel:108">
              <Button variant="destructive" size="lg" className="text-lg px-8">
                <Phone className="h-5 w-5 mr-2" />
                108
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Find Hospitals Button */}
        <Button
          onClick={() => setShowHospitals(true)}
          size="lg"
          className="w-full text-lg py-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          {t("sos.findHospitals")}
        </Button>

        {/* Hospital List */}
        <AnimatePresence>
          {showHospitals && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-foreground">{t("sos.nearbyHospitals")}</h2>
              {hospitals.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Hospital className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-foreground">{h.name[lang]}</h3>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {h.address[lang]}
                          </div>
                          <p className="text-sm font-medium text-primary">{h.distance}</p>
                        </div>
                        <a href={h.phone}>
                          <Button variant="outline" size="sm" className="shrink-0">
                            <Phone className="h-4 w-4 mr-1" />
                            {t("sos.callNow")}
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
};

export default EmergencySOS;
