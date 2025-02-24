
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectTitle, projectDescription, hypothesis, materials } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a scientific experiment planning assistant. Help design detailed experiment procedures that are safe, practical, and scientifically sound for science fair projects.'
          },
          {
            role: 'user',
            content: `Please create a detailed experiment plan for this project:
              
              Title: ${projectTitle}
              Description: ${projectDescription}
              Hypothesis: ${hypothesis || 'Not specified'}
              Available Materials: ${materials.join(', ')}
              
              Please provide:
              1. Step-by-step experimental procedure
              2. List of control and test variables
              3. Data collection methods and measurements
              4. Timeline and schedule recommendations
              5. Suggested data visualization methods
              6. Safety considerations and precautions
              7. Tips for maintaining experimental consistency`
          }
        ],
      }),
    });

    const data = await response.json();
    const plan = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ plan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
