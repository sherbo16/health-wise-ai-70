const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, input, hasFile, fileType } = await req.json();

    // Input validation
    if (!input || typeof input !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid input: must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
      return new Response(
        JSON.stringify({ error: "Input cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (trimmedInput.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length of 5000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize input - remove potential script tags
    const sanitizedInput = trimmedInput.replace(/<[^>]*>/g, "");

    const systemPrompts: Record<string, string> = {
      "symptom-check": `You are a helpful healthcare assistant. Analyze the symptoms described and provide:
1. Possible conditions (not a diagnosis)
2. Recommended actions
3. When to see a doctor
Always remind users to consult a healthcare professional.`,
      "report-simplify": `You are a medical report translator. Simplify the medical report in easy-to-understand language:
1. Explain medical terms in simple words
2. Highlight key findings
3. Explain what the results mean
4. Suggest follow-up questions for the doctor`,
      "medicine-info": `You are a pharmaceutical information assistant. Provide information about medicines:
1. Generic and brand names
2. Common uses
3. Typical dosage information
4. Common side effects
5. Important warnings
Always recommend consulting a pharmacist or doctor.`,
      "nutrition-fitness": `You are a nutrition and fitness advisor. Create personalized plans:
1. Meal suggestions based on dietary preferences
2. Exercise recommendations
3. Daily calorie and macro targets
4. Healthy lifestyle tips
Consider any mentioned health conditions or restrictions.`,
      "mental-wellness": `You are a compassionate mental wellness companion. Provide:
1. Supportive and empathetic responses
2. Mindfulness and relaxation techniques
3. Coping strategies
4. Encouragement and motivation
If someone seems in crisis, recommend professional help.`,
      "health-tips": `You are a daily health advisor. Provide 5 personalized health tips covering:
1. Nutrition tip
2. Exercise tip
3. Mental wellness tip
4. Sleep/rest tip
5. General wellness tip
Make tips practical and actionable.`,
    };

    const systemPrompt = systemPrompts[type] || systemPrompts["symptom-check"];

    let userMessage = sanitizedInput;
    if (hasFile && fileType) {
      if (fileType.startsWith("image/")) {
        userMessage = `[Image of medical report uploaded] Please analyze this medical report image and provide a simplified explanation. Additional context: ${sanitizedInput}`;
      } else if (fileType === "application/pdf") {
        userMessage = `[PDF medical report uploaded] Please analyze this report and provide a simplified explanation. Report content: ${sanitizedInput}`;
      }
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      throw new Error("API key not configured");
    }

    const response = await fetch(LOVABLE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response generated";

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in healthcare-ai function:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
