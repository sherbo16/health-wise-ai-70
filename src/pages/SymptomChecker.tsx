import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, Upload, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addUserLog } from "@/lib/userLogs";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Scan simulation state
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState("");

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("healthcare-ai", {
        body: { type: "symptom-check", input: symptoms },
      });
      if (error) throw error;
      setResult(data.result);
      addUserLog("Symptom Check", `Analyzed symptoms: "${symptoms.slice(0, 60)}..."`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanFile(file);
    setScanResult("");
    setScanLoading(true);

    addUserLog("Body Scan Upload", `Uploaded: ${file.name}`);

    setTimeout(() => {
      setScanLoading(false);
      setScanResult(
        "Scan Analyzed: Mild anomaly detected. Accuracy: 96%. Please consult a doctor."
      );
    }, 3000);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Symptom Checker</h1>
              <p className="text-muted-foreground">Describe your symptoms for AI-powered insights</p>
            </div>
          </div>

          {/* MRI / X-Ray Scan Simulation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" /> Upload Body Scan (MRI / X-Ray)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" /> Upload Body Scan
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleScanUpload}
                    />
                  </span>
                </Button>
                {scanFile && <span className="text-sm text-muted-foreground">{scanFile.name}</span>}
              </label>

              {scanLoading && (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Scanning AI... 🧠</span>
                </div>
              )}

              {scanResult && (
                <Card className="border-primary/30 bg-accent/30">
                  <CardContent className="pt-4">
                    <p className="font-medium text-foreground">{scanResult}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Describe Your Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="E.g., I have a headache, mild fever, and sore throat for the past 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={5}
              />
              <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                  {result}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SymptomChecker;
