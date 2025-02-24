
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interests, ageGroup } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a science fair project advisor. Generate a project idea and respond ONLY with a JSON object containing these exact fields (no explanation or markdown):
            {
              "title": "Project title",
              "description": "Brief project description",
              "category": "Project category (Biology, Physics, Chemistry, etc.)",
              "hypothesis": "Scientific hypothesis to test",
              "materials": ["Array of required materials"]
            }`
          },
          {
            role: 'user',
            content: `Generate an age-appropriate science fair project for a ${ageGroup} school student interested in: ${interests}`
          }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data.choices[0].message.content);
    
    try {
      const projectIdea = JSON.parse(data.choices[0].message.content.trim());
      return new Response(JSON.stringify(projectIdea), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("JSON Parse error:", parseError);
      return new Response(JSON.stringify({ 
        error: "Failed to parse project idea. Please try again." 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
