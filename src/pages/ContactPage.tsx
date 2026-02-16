import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/contexts/LanguageContext";
import { Mail, Send } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const ContactPage = () => {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:aloysiussherbo651@gmail.com?subject=Health-Wise Support&body=${body}`;
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t("contact.title")}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("contact.send")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder={t("contact.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder={t("contact.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Textarea
                placeholder={t("contact.message")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {t("contact.send")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default ContactPage;
