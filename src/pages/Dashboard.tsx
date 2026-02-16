import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Heart, Lightbulb, User, Save } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const tipsEN = [
  "Drink at least 8 glasses of water daily to stay hydrated.",
  "Take a 10-minute walk after every meal for better digestion.",
  "Practice deep breathing for 5 minutes to reduce stress.",
  "Eat a rainbow — include colorful fruits and vegetables daily.",
  "Get 7-8 hours of quality sleep every night.",
  "Wash your hands frequently to prevent infections.",
  "Limit screen time before bed for better sleep quality.",
  "Include protein in every meal to maintain energy levels.",
];

const tipsTA = [
  "நீரேற்றமாக இருக்க தினமும் குறைந்தது 8 கிளாஸ் தண்ணீர் குடிக்கவும்.",
  "சிறந்த செரிமானத்திற்கு ஒவ்வொரு உணவுக்குப் பிறகும் 10 நிமிட நடைப்பயிற்சி செய்யுங்கள்.",
  "மன அழுத்தத்தைக் குறைக்க 5 நிமிடம் ஆழ்ந்த சுவாசப் பயிற்சி செய்யுங்கள்.",
  "வானவில் போல சாப்பிடுங்கள் — தினமும் வண்ணமயமான பழங்கள் மற்றும் காய்கறிகளைச் சேர்க்கவும்.",
  "ஒவ்வொரு இரவும் 7-8 மணி நேரம் தரமான தூக்கம் பெறுங்கள்.",
  "தொற்றுகளைத் தடுக்க அடிக்கடி கைகளைக் கழுவுங்கள்.",
  "சிறந்த தூக்கத்திற்கு படுக்கைக்கு முன் திரை நேரத்தைக் குறைக்கவும்.",
  "ஆற்றல் அளவை பராமரிக்க ஒவ்வொரு உணவிலும் புரதத்தைச் சேர்க்கவும்.",
];

const trendData = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 75 },
  { day: "Thu", score: 82 },
  { day: "Fri", score: 80 },
  { day: "Sat", score: 85 },
  { day: "Sun", score: 88 },
];

interface UserProfile {
  name: string;
  age: string;
  bmi: string;
}

const Dashboard = () => {
  const { t, lang } = useLang();
  const [profile, setProfile] = useState<UserProfile>({ name: "", age: "", bmi: "" });
  const [editing, setEditing] = useState(false);
  const [healthScore] = useState(() => Math.floor(Math.random() * 30) + 65);
  const [tipIndex] = useState(() => Math.floor(Math.random() * tipsEN.length));

  useEffect(() => {
    const saved = localStorage.getItem("hw-profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setEditing(true);
    }
  }, []);

  const saveProfile = () => {
    if (!profile.name.trim()) return;
    localStorage.setItem("hw-profile", JSON.stringify(profile));
    setEditing(false);
  };

  const tip = lang === "en" ? tipsEN[tipIndex] : tipsTA[tipIndex];
  const scoreColor = healthScore >= 80 ? "text-emerald-500" : healthScore >= 60 ? "text-amber-500" : "text-destructive";

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Welcome / Profile Setup */}
        {editing ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t("dash.setupProfile")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder={t("dash.name")}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder={t("dash.age")}
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder={t("dash.bmi")}
                  value={profile.bmi}
                  onChange={(e) => setProfile({ ...profile, bmi: e.target.value })}
                />
              </div>
              <Button onClick={saveProfile} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {t("dash.save")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t("dash.welcome")}, {profile.name}! 👋
              </h1>
              {profile.age && (
                <p className="text-muted-foreground mt-1">
                  {t("dash.age")}: {profile.age} · {t("dash.bmi")}: {profile.bmi || "—"}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              {t("dash.editProfile")}
            </Button>
          </div>
        )}

        {/* Score + Tip */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  {t("dash.healthScore")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className={`text-7xl font-black ${scoreColor}`}>{healthScore}</div>
                <p className="text-muted-foreground mt-2">/100</p>
                <div className="w-full mt-4 h-3 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${healthScore}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  {t("dash.dailyTip")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-lg leading-relaxed">{tip}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Health Trend Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t("dash.healthTrend")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[50, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
