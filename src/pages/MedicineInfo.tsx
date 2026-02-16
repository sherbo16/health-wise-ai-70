import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/contexts/LanguageContext";
import { Pill, Search, Bell, Trash2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface Medicine {
  name: string;
  uses: { en: string; ta: string };
  sideEffects: { en: string; ta: string };
  dosage: { en: string; ta: string };
}

const medicines: Medicine[] = [
  {
    name: "Paracetamol",
    uses: { en: "Reduces fever and relieves mild to moderate pain.", ta: "காய்ச்சலைக் குறைக்கிறது மற்றும் லேசான முதல் மிதமான வலியைப் போக்குகிறது." },
    sideEffects: { en: "Nausea, rash, liver damage (overdose).", ta: "குமட்டல், தோல் அரிப்பு, கல்லீரல் பாதிப்பு (அதிகப்படியான அளவு)." },
    dosage: { en: "500mg every 4-6 hours. Max 4g/day.", ta: "ஒவ்வொரு 4-6 மணி நேரத்திற்கும் 500mg. அதிகபட்சம் 4g/நாள்." },
  },
  {
    name: "Amoxicillin",
    uses: { en: "Treats bacterial infections (throat, ear, urinary).", ta: "பாக்டீரியா தொற்றுகளை குணப்படுத்துகிறது (தொண்டை, காது, சிறுநீர்)." },
    sideEffects: { en: "Diarrhea, nausea, skin rash.", ta: "வயிற்றுப்போக்கு, குமட்டல், தோல் அரிப்பு." },
    dosage: { en: "250-500mg every 8 hours for 7-10 days.", ta: "7-10 நாட்களுக்கு ஒவ்வொரு 8 மணி நேரத்திற்கும் 250-500mg." },
  },
  {
    name: "Cetirizine",
    uses: { en: "Relieves allergy symptoms like sneezing and itching.", ta: "தும்மல் மற்றும் அரிப்பு போன்ற ஒவ்வாமை அறிகுறிகளைப் போக்குகிறது." },
    sideEffects: { en: "Drowsiness, dry mouth, headache.", ta: "தூக்கம், வறண்ட வாய், தலைவலி." },
    dosage: { en: "10mg once daily.", ta: "தினமும் ஒரு முறை 10mg." },
  },
  {
    name: "Aspirin",
    uses: { en: "Pain relief, anti-inflammatory, blood thinner.", ta: "வலி நிவாரணம், அழற்சி எதிர்ப்பு, இரத்தத்தை மெலிக்கிறது." },
    sideEffects: { en: "Stomach ulcers, bleeding, heartburn.", ta: "வயிற்றுப் புண்கள், இரத்தப்போக்கு, நெஞ்செரிச்சல்." },
    dosage: { en: "300-600mg every 4-6 hours. Max 4g/day.", ta: "ஒவ்வொரு 4-6 மணி நேரத்திற்கும் 300-600mg. அதிகபட்சம் 4g/நாள்." },
  },
  {
    name: "Antacid",
    uses: { en: "Neutralizes stomach acid, relieves heartburn.", ta: "வயிற்று அமிலத்தை நடுநிலையாக்குகிறது, நெஞ்செரிச்சலைப் போக்குகிறது." },
    sideEffects: { en: "Constipation, diarrhea, bloating.", ta: "மலச்சிக்கல், வயிற்றுப்போக்கு, வீக்கம்." },
    dosage: { en: "1-2 tablets after meals or as needed.", ta: "உணவுக்குப் பிறகு 1-2 மாத்திரைகள் அல்லது தேவைக்கேற்ப." },
  },
];

const MedicineInfo = () => {
  const { t, lang } = useLang();
  const [search, setSearch] = useState("");
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [reminders, setReminders] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("hw-reminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  const saveReminders = (list: string[]) => {
    setReminders(list);
    localStorage.setItem("hw-reminders", JSON.stringify(list));
  };

  const addReminder = (name: string) => {
    if (!reminders.includes(name)) saveReminders([...reminders, name]);
  };

  const removeReminder = (name: string) => {
    saveReminders(reminders.filter((r) => r !== name));
  };

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("med.title")}</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("med.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Medicine List */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((med) => (
            <Card
              key={med.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMed?.name === med.name ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedMed(med)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-lg">{med.name}</h3>
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{med.uses[lang]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Medicine Detail */}
        {selectedMed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle>{selectedMed.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">{t("med.uses")}</h4>
                  <p className="text-foreground">{selectedMed.uses[lang]}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-destructive text-sm uppercase tracking-wide">{t("med.sideEffects")}</h4>
                  <p className="text-foreground">{selectedMed.sideEffects[lang]}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-600 text-sm uppercase tracking-wide">{t("med.dosage")}</h4>
                  <p className="text-foreground">{selectedMed.dosage[lang]}</p>
                </div>
                <Button onClick={() => addReminder(selectedMed.name)} variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  {t("med.addReminder")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {t("med.reminders")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">{t("med.noReminders")}</p>
            ) : (
              <ul className="space-y-2">
                {reminders.map((r) => (
                  <li key={r} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <span className="font-medium text-foreground">{r}</span>
                    <button onClick={() => removeReminder(r)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default MedicineInfo;
