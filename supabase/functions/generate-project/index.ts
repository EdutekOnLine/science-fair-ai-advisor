
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
    const { interests } = await req.json();

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
            content: `You are a science fair project advisor. Generate creative and educational project ideas based on student interests. 
            Return the response in JSON format with the following structure:
            {
              "title": "Project title",
              "description": "Brief project description",
              "category": "Project category (e.g., Biology, Physics, Chemistry, etc.)",
              "hypothesis": "Scientific hypothesis to test",
              "materials": ["Array of required materials"]
            }`
          },
          {
            role: 'user',
            content: `Generate a science fair project idea related to: ${interests}`
          }
        ],
      }),
    });

    const data = await response.json();
    const projectIdea = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(projectIdea), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
