import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Loader2, Search, Camera, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addUserLog } from "@/lib/userLogs";

const MedicineGuide = () => {
  const [medicine, setMedicine] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Pill identifier state
  const [pillFile, setPillFile] = useState<File | null>(null);
  const [pillPreview, setPillPreview] = useState<string | null>(null);
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

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setPillFile(file);
    setPillResult("");

    const reader = new FileReader();
    reader.onload = (ev) => setPillPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePillFile = () => {
    setPillFile(null);
    setPillPreview(null);
    setPillResult("");
  };

  const handleIdentify = async () => {
    if (!pillFile) {
      toast.error("Please upload a photo of the medicine first");
      return;
    }

    setPillLoading(true);
    setPillResult("");

    try {
      const reader = new FileReader();
      const fileData: string = await new Promise((resolve) => {
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(pillFile);
      });

      addUserLog("Pill Identifier", `Uploaded photo: ${pillFile.name}`);

      const { data, error } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "medicine-info",
          input: "Identify this medicine/pill from the uploaded photo. Provide the medicine name, its common uses, typical dosage, and any important warnings.",
          fileData,
          hasFile: true,
          fileType: pillFile.type,
        },
      });

      if (error) throw error;
      setPillResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to identify medicine. Please try again.");
    } finally {
      setPillLoading(false);
    }
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

          {/* Pill Identifier */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" /> Pill Identifier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!pillFile ? (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePillUpload}
                    className="hidden"
                    id="pill-upload"
                  />
                  <label htmlFor="pill-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Upload a photo of your medicine
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP · Max 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                  {pillPreview && (
                    <img
                      src={pillPreview}
                      alt="Medicine preview"
                      className="w-20 h-20 object-cover rounded-lg border border-border"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{pillFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(pillFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removePillFile} disabled={pillLoading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                onClick={handleIdentify}
                disabled={!pillFile || pillLoading}
                className="w-full"
              >
                {pillLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing medicine... 🔍
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Identify Medicine
                  </>
                )}
              </Button>

              {pillResult && (
                <Card className="border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/50">
                  <CardContent className="pt-4">
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                      {pillResult}
                    </div>
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
