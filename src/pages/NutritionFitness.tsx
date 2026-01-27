import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Salad, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NutritionFitness = () => {
  const [goals, setGoals] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goals.trim()) {
      toast.error("Please describe your health goals");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "nutrition-fitness",
          input: goals,
        },
      });

      if (error) throw error;
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
              <Salad className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Nutrition & Fitness</h1>
              <p className="text-muted-foreground">Get personalized meal and exercise plans</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Describe Your Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="E.g., I want to lose 10kg in 3 months, I'm vegetarian, I can exercise 30 minutes daily..."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={5}
              />
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Your Personalized Plan</CardTitle>
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

export default NutritionFitness;
