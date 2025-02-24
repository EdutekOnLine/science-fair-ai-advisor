
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
    const { projectTitle, experimentResults } = await req.json();
    
    const dataPoints = Object.entries(experimentResults)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

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
            content: 'You are a scientific data analyst assistant. Analyze experimental data and provide insights and recommendations in a clear, concise format.'
          },
          {
            role: 'user',
            content: `Please analyze this experimental data for the project "${projectTitle}":

            Data points:
            ${dataPoints}

            Please provide:
            1. Statistical analysis and key insights
            2. Pattern identification
            3. Potential correlations
            4. Suggestions for improvement
            5. Recommendations for future experiments

            Format the response in two sections:
            1. Key Insights (statistical analysis and findings)
            2. Recommendations (suggestions for improvement and future experiments)`
          }
        ],
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Split the analysis into insights and recommendations
    const [insights, recommendations] = analysis.split(/recommendations:/i);

    return new Response(
      JSON.stringify({
        insights: insights.replace(/key insights:/i, '').trim(),
        recommendations: recommendations?.trim() || 'No recommendations available.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
