import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addUserLog } from "@/lib/userLogs";

interface ReportSlot {
  file: File | null;
  preview: string | null;
}

const ReportUploadCard = () => {
  const [report1, setReport1] = useState<ReportSlot>({ file: null, preview: null });
  const [report2, setReport2] = useState<ReportSlot>({ file: null, preview: null });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [chartData, setChartData] = useState<{ name: string; value: number }[] | null>(null);
  const [badge, setBadge] = useState("");

  const handleUpload = (slot: 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
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

    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = ev.target?.result as string;
      if (slot === 1) setReport1({ file, preview });
      else setReport2({ file, preview });
    };
    reader.readAsDataURL(file);
    addUserLog("Analytics Photo Upload", `Uploaded report photo ${slot}: ${file.name}`);
  };

  const removeFile = (slot: 1 | 2) => {
    if (slot === 1) setReport1({ file: null, preview: null });
    else setReport2({ file: null, preview: null });
  };

  const handleCompare = async () => {
    if (!report1.file || !report2.file) {
      toast.error("Please upload both reports first");
      return;
    }

    setLoading(true);
    setResult("");
    setChartData(null);
    setBadge("");

    try {
      // Read both files as base64
      const readFile = (file: File): Promise<string> =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });

      const [data1, data2] = await Promise.all([
        readFile(report1.file),
        readFile(report2.file),
      ]);

      // Send first report for analysis
      const { data: res1, error: err1 } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "report-simplify",
          input: "Extract the key numeric health metrics (like blood sugar, cholesterol, BP, hemoglobin, etc.) from this medical report. Return ONLY a JSON array of objects with 'metric' and 'value' keys. Example: [{\"metric\":\"Blood Sugar\",\"value\":120}]. No other text.",
          fileData: data1,
          hasFile: true,
          fileType: report1.file.type,
        },
      });
      if (err1) throw err1;

      const { data: res2, error: err2 } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "report-simplify",
          input: "Extract the key numeric health metrics (like blood sugar, cholesterol, BP, hemoglobin, etc.) from this medical report. Return ONLY a JSON array of objects with 'metric' and 'value' keys. Example: [{\"metric\":\"Blood Sugar\",\"value\":120}]. No other text.",
          fileData: data2,
          hasFile: true,
          fileType: report2.file.type,
        },
      });
      if (err2) throw err2;

      // Try to parse JSON from results
      const parseMetrics = (text: string) => {
        try {
          const match = text.match(/\[[\s\S]*\]/);
          if (match) return JSON.parse(match[0]);
        } catch { /* ignore */ }
        return null;
      };

      const metrics1 = parseMetrics(res1.result);
      const metrics2 = parseMetrics(res2.result);

      if (metrics1 && metrics2) {
        // Build comparison chart from first matching metric
        const chart = metrics1.slice(0, 4).map((m: { metric: string; value: number }) => {
          const match = metrics2.find((m2: { metric: string; value: number }) =>
            m2.metric.toLowerCase() === m.metric.toLowerCase()
          );
          return {
            name: m.metric,
            "Report 1": m.value,
            "Report 2": match?.value ?? 0,
          };
        });
        setChartData(chart);
      }

      // Get a summary comparison
      const { data: summary, error: sumErr } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "report-simplify",
          input: `Compare these two medical report analyses and give a brief health trend summary (improving, stable, or needs attention). Also state key changes.\n\nReport 1 (Past):\n${res1.result}\n\nReport 2 (Current):\n${res2.result}`,
        },
      });
      if (sumErr) throw sumErr;

      setResult(summary.result);

      // Set badge
      const lower = summary.result.toLowerCase();
      if (lower.includes("improv")) setBadge("Health is Improving! ✅");
      else if (lower.includes("stable") || lower.includes("no significant")) setBadge("Stable ➡️");
      else setBadge("Needs attention ⚠️");

      addUserLog("Analytics Photo Compare", `Compared: ${report1.file.name} vs ${report2.file.name}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to analyze reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const UploadSlot = ({ slot, data, label }: { slot: 1 | 2; data: ReportSlot; label: string }) => (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      {!data.file ? (
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(slot, e)}
            className="hidden"
            id={`report-upload-${slot}`}
          />
          <label htmlFor={`report-upload-${slot}`} className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs font-medium text-foreground">Upload report photo</p>
            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG · Max 10MB</p>
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-2 bg-secondary rounded-lg">
          {data.preview && (
            <img
              src={data.preview}
              alt="Report preview"
              className="w-16 h-16 object-cover rounded-lg border border-border"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs truncate">{data.file.name}</p>
            <p className="text-xs text-muted-foreground">{(data.file.size / 1024).toFixed(1)} KB</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeFile(slot)} disabled={loading} className="h-7 w-7">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" /> Compare Reports via Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <UploadSlot slot={1} data={report1} label="Report 1 (Past)" />
          <UploadSlot slot={2} data={report2} label="Report 2 (Current)" />
        </div>

        <Button onClick={handleCompare} disabled={!report1.file || !report2.file || loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing & Comparing Reports...
            </>
          ) : (
            <>
              <BarChart3 className="mr-2 h-4 w-4" /> Compare Reports
            </>
          )}
        </Button>

        {badge && (
          <div className="inline-block rounded-full px-4 py-1 text-sm font-semibold bg-accent text-accent-foreground">
            {badge}
          </div>
        )}

        {chartData && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Report 1" fill="hsl(199, 89%, 48%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Report 2" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {result && (
          <Card className="border-cyan-300 dark:border-cyan-700 bg-cyan-50/50 dark:bg-cyan-950/50">
            <CardContent className="pt-4">
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                {result}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportUploadCard;
