import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MentalWellness = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    if (!message.trim()) {
      toast.error("Please share how you're feeling");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("healthcare-ai", {
        body: {
          type: "mental-wellness",
          input: message,
        },
      });

      if (error) throw error;
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mental Wellness</h1>
              <p className="text-muted-foreground">Chat for stress relief, motivation, and mindfulness</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, feelings, or what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              <Button onClick={handleChat} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Support"
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Wellness Guidance</CardTitle>
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

export default MentalWellness;
