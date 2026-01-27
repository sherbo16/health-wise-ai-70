import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HealthTips = () => {
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "health-tips",
          input: "Give me personalized daily health tips",
        },
      });

      if (error) throw error;
      setTips(data.result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch health tips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Daily Health Tips</h1>
              <p className="text-muted-foreground">Get personalized wellness advice</p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Tips</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchTips} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                  {tips}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default HealthTips;
