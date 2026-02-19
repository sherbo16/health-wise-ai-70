import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Loader2, Search, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addUserLog } from "@/lib/userLogs";

const MedicineGuide = () => {
  const [medicine, setMedicine] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Pill identifier state
  const [pillFile, setPillFile] = useState<File | null>(null);
  const [pillLoading, setPillLoading] = useState(false);
  const [pillResult, setPillResult] = useState("");

  const handleSearch = async () => {
    if (!medicine.trim()) {
      toast.error("Please enter a medicine name");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("healthcare-ai", {
        body: { type: "medicine-info", input: medicine },
      });
      if (error) throw error;
      setResult(data.result);
      addUserLog("Medicine Search", `Searched: ${medicine}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get medicine information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPillFile(file);
    setPillResult("");
    setPillLoading(true);

    addUserLog("Pill Identifier", `Uploaded photo: ${file.name}`);

    setTimeout(() => {
      setPillLoading(false);
      setPillResult("Detected: Dolo 650. Use: Fever/Pain. Dosage: After food.");
    }, 2000);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
              <Pill className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Medicine Guide</h1>
              <p className="text-muted-foreground">Learn about medicines, dosage, and side effects</p>
            </div>
          </div>

          {/* Pill Identifier Simulation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" /> Pill Identifier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Camera className="mr-2 h-4 w-4" /> Identify Medicine via Camera/Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePillUpload}
                    />
                  </span>
                </Button>
                {pillFile && <span className="text-sm text-muted-foreground">{pillFile.name}</span>}
              </label>

              {pillLoading && (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Extracting text... 🔍</span>
                </div>
              )}

              {pillResult && (
                <Card className="border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/50">
                  <CardContent className="pt-4">
                    <p className="font-medium text-foreground">{pillResult}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Medicine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter medicine name (e.g., Paracetamol, Ibuprofen)"
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Medicine Information</CardTitle>
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

export default MedicineGuide;
