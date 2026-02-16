import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ta";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Nav & Global
  "app.title": { en: "Health-Wise AI", ta: "ஹெல்த்-வைஸ் AI" },
  "nav.dashboard": { en: "Dashboard", ta: "டாஷ்போர்டு" },
  "nav.symptoms": { en: "Symptom Analyzer", ta: "அறிகுறி பகுப்பாய்வு" },
  "nav.medicine": { en: "Medicine Info", ta: "மருந்து தகவல்" },
  "nav.emergency": { en: "Emergency SOS", ta: "அவசர SOS" },
  "nav.contact": { en: "Contact Us", ta: "தொடர்பு கொள்ள" },
  
  // Dashboard
  "dash.welcome": { en: "Welcome", ta: "வரவேற்கிறோம்" },
  "dash.healthScore": { en: "Health Score", ta: "ஆரோக்கிய மதிப்பெண்" },
  "dash.healthTrend": { en: "Health Trend", ta: "ஆரோக்கிய போக்கு" },
  "dash.dailyTip": { en: "Daily Health Tip", ta: "தினசரி ஆரோக்கிய குறிப்பு" },
  "dash.bmi": { en: "BMI", ta: "உடல் நிறை குறியீடு" },
  "dash.age": { en: "Age", ta: "வயது" },
  "dash.setupProfile": { en: "Set Up Your Profile", ta: "உங்கள் சுயவிவரத்தை அமைக்கவும்" },
  "dash.name": { en: "Your Name", ta: "உங்கள் பெயர்" },
  "dash.save": { en: "Save Profile", ta: "சுயவிவரத்தை சேமி" },
  "dash.editProfile": { en: "Edit Profile", ta: "சுயவிவரத்தை திருத்து" },

  // Symptom Analyzer
  "sym.title": { en: "AI Symptom Analyzer", ta: "AI அறிகுறி பகுப்பாய்வு" },
  "sym.select": { en: "Select your symptoms", ta: "உங்கள் அறிகுறிகளைத் தேர்ந்தெடுக்கவும்" },
  "sym.analyze": { en: "Analyze Symptoms", ta: "அறிகுறிகளை பகுப்பாய்வு செய்" },
  "sym.result": { en: "Analysis Result", ta: "பகுப்பாய்வு முடிவு" },
  "sym.fever": { en: "Fever", ta: "காய்ச்சல்" },
  "sym.cough": { en: "Cough", ta: "இருமல்" },
  "sym.headache": { en: "Headache", ta: "தலைவலி" },
  "sym.fatigue": { en: "Fatigue", ta: "சோர்வு" },
  "sym.disclaimer": {
    en: "⚕️ Disclaimer: This is a mock analysis for educational purposes only. Always consult a qualified healthcare professional.",
    ta: "⚕️ மறுப்பு: இது கல்வி நோக்கங்களுக்கான போலி பகுப்பாய்வு மட்டுமே. எப்போதும் தகுதிவாய்nt மருத்துவரை அணுகவும்."
  },
  "sym.noSymptoms": { en: "Please select at least one symptom.", ta: "குறைந்தது ஒரு அறிகுறியைத் தேர்ந்தெடுக்கவும்." },

  // Medicine
  "med.title": { en: "Medicine Information", ta: "மருந்து தகவல்" },
  "med.search": { en: "Search medicines...", ta: "மருந்துகளைத் தேடு..." },
  "med.uses": { en: "Uses", ta: "பயன்கள்" },
  "med.sideEffects": { en: "Side Effects", ta: "பக்க விளைவுகள்" },
  "med.dosage": { en: "Dosage", ta: "மருந்தளவு" },
  "med.addReminder": { en: "Add Reminder", ta: "நினைவூட்டல் சேர்" },
  "med.reminders": { en: "My Reminders", ta: "எனது நினைவூட்டல்கள்" },
  "med.noReminders": { en: "No reminders yet", ta: "நினைவூட்டல்கள் இல்லை" },
  "med.remove": { en: "Remove", ta: "நீக்கு" },

  // Emergency
  "sos.title": { en: "Emergency SOS", ta: "அவசர SOS" },
  "sos.findHospitals": { en: "🚑 Find Hospitals", ta: "🚑 மருத்துவமனைகளை கண்டறி" },
  "sos.nearbyHospitals": { en: "Nearest Hospitals", ta: "அருகிலுள்ள மருத்துவமனைகள்" },
  "sos.callNow": { en: "Call Now", ta: "இப்போது அழை" },
  "sos.emergency": { en: "Emergency: Call 108", ta: "அவசரம்: 108 அழைக்கவும்" },

  // Contact
  "contact.title": { en: "Contact Us", ta: "தொடர்பு கொள்ள" },
  "contact.name": { en: "Your Name", ta: "உங்கள் பெயர்" },
  "contact.email": { en: "Your Email", ta: "உங்கள் மின்னஞ்சல்" },
  "contact.message": { en: "Your Message", ta: "உங்கள் செய்தி" },
  "contact.send": { en: "Send Message", ta: "செய்தி அனுப்பு" },

  // Footer
  "footer.secure": { en: "🔒 Secure & Private — All data stored locally on your device", ta: "🔒 பாதுகாப்பான & தனிப்பட்ட — அனைத்து தரவுகளும் உங்கள் சாதனத்தில் சேமிக்கப்படுகின்றன" },
  "footer.disclaimer": { en: "This is an educational tool. Always consult healthcare professionals.", ta: "இது ஒரு கல்வி கருவி. எப்போதும் மருத்துவ நிபுணர்களை அணுகவும்." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("hw-lang") as Language) || "en";
  });

  const toggleLang = () => {
    const next = lang === "en" ? "ta" : "en";
    setLang(next);
    localStorage.setItem("hw-lang", next);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};
