import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import { Stethoscope, AlertTriangle, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const symptomKeys = ["sym.fever", "sym.cough", "sym.headache", "sym.fatigue"] as const;

interface AnalysisResult {
  title: { en: string; ta: string };
  advice: { en: string; ta: string };
  severity: "low" | "medium" | "high";
}

const analyzeSymptoms = (selected: string[]): AnalysisResult => {
  const has = (s: string) => selected.includes(s);

  if (has("sym.fever") && has("sym.cough")) {
    return {
      title: { en: "Possible Viral Infection", ta: "சாத்தியமான வைரஸ் தொற்று" },
      advice: {
        en: "Suggested: Rest, hydration, and monitor temperature. If symptoms persist for more than 3 days, consult a doctor.",
        ta: "பரிந்துரை: ஓய்வு, நீரேற்றம், மற்றும் வெப்பநிலையை கண்காணிக்கவும். 3 நாட்களுக்கு மேல் அறிகுறிகள் தொடர்ந்தால், மருத்துவரை அணுகவும்.",
      },
      severity: "high",
    };
  }
  if (has("sym.headache") && has("sym.fatigue")) {
    return {
      title: { en: "Stress or Exhaustion", ta: "மன அழுத்தம் அல்லது சோர்வு" },
      advice: {
        en: "Suggested: Take adequate rest, reduce screen time, stay hydrated, and practice relaxation techniques.",
        ta: "பரிந்துரை: போதுமான ஓய்வு எடுங்கள், திரை நேரத்தைக் குறைக்கவும், நீரேற்றமாக இருங்கள், தளர்வு நுட்பங்களைப் பயிற்சி செய்யுங்கள்.",
      },
      severity: "medium",
    };
  }
  if (has("sym.fever")) {
    return {
      title: { en: "Mild Fever Detected", ta: "லேசான காய்ச்சல் கண்டறியப்பட்டது" },
      advice: {
        en: "Monitor temperature regularly. Stay hydrated and rest. Consult a doctor if temperature exceeds 102°F.",
        ta: "வெப்பநிலையை தொடர்ந்து கண்காணிக்கவும். நீரேற்றமாக இருந்து ஓய்வு எடுங்கள். 102°F-க்கு மேல் வெப்பநிலை அதிகரித்தால் மருத்துவரை அணுகவும்.",
      },
      severity: "medium",
    };
  }
  return {
    title: { en: "General Wellness Check", ta: "பொது ஆரோக்கிய சோதனை" },
    advice: {
      en: "Your symptoms appear mild. Maintain a healthy lifestyle, stay hydrated, and get adequate rest.",
      ta: "உங்கள் அறிகுறிகள் லேசாகத் தெரிகின்றன. ஆரோக்கியமான வாழ்க்கை முறையை பராமரிக்கவும், நீரேற்றமாக இருங்கள், போதுமான ஓய்வு எடுங்கள்.",
    },
    severity: "low",
  };
};

const SymptomAnalyzer = () => {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
    setResult(null);
  };

  const handleAnalyze = () => {
    if (selected.length === 0) return;
    setResult(analyzeSymptoms(selected));
  };

  const severityColors = {
    low: "border-emerald-500 bg-emerald-500/10",
    medium: "border-amber-500 bg-amber-500/10",
    high: "border-destructive bg-destructive/10",
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("sym.title")}</h1>
            <p className="text-muted-foreground">{t("sym.select")}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {symptomKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${
                    selected.includes(key)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {t(key)}
                </button>
              ))}
            </div>

            <Button onClick={handleAnalyze} disabled={selected.length === 0} className="w-full">
              {t("sym.analyze")}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className={`border-2 ${severityColors[result.severity]}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {result.title[lang]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{result.advice[lang]}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{t("sym.disclaimer")}</p>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default SymptomAnalyzer;
