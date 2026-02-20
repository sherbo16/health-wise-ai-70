import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ReportSimplifier = () => {
  const [reportText, setReportText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image (JPG, PNG, GIF, WebP) or PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
  };

  const handleSimplify = async () => {
    if (!reportText.trim() && !uploadedFile) {
      toast.error("Please enter report text or upload a file");
      return;
    }

    setLoading(true);
    try {
      let textContent = reportText || "Please analyze this uploaded medical report.";
      let fileData: string | null = null;

      if (uploadedFile) {
        if (uploadedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          fileData = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(uploadedFile);
          });
        } else if (uploadedFile.type === 'application/pdf') {
          textContent = `[PDF file uploaded: ${uploadedFile.name}] ${reportText}`;
        }
      }

      const { data, error } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "report-simplify",
          input: textContent,
          fileData: fileData,
          hasFile: !!uploadedFile,
          fileType: uploadedFile?.type,
        },
      });

      if (error) throw error;
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to simplify report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
              <FileText className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Report Simplifier</h1>
              <p className="text-muted-foreground">Get easy-to-understand explanations of your reports</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload or Paste Your Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image or PDF (max 10MB)
                  </p>
                </label>
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or paste text</span>
                </div>
              </div>

              <Textarea
                placeholder="Paste your medical report text here..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={6}
              />
              <Button onClick={handleSimplify} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Simplifying...
                  </>
                ) : (
                  "Simplify Report"
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Simplified Explanation</CardTitle>
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

export default ReportSimplifier;
