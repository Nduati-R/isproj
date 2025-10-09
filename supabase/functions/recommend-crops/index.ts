import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { soilData, climateData, datasetId } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Generate crop recommendations using AI
    const recommendationPrompt = `You are an expert agricultural advisor. Based on the following soil and climate data, recommend the top 3-5 most suitable crops to grow, with detailed explanations.

Soil Data:
- Nitrogen (N): ${soilData.nitrogen}
- Phosphorus (P): ${soilData.phosphorus}
- Potassium (K): ${soilData.potassium}
- pH Level: ${soilData.ph}
- Temperature: ${soilData.temperature}°C
- Humidity: ${soilData.humidity}%

Climate Data:
- Rainfall: ${climateData.rainfall} mm
- Season: ${climateData.season || 'Not specified'}
- Location: ${climateData.location || 'Not specified'}

Provide recommendations in the following format:
1. Crop name and variety
2. Why it's suitable for these conditions
3. Expected yield potential
4. Key cultivation tips

Be specific and practical.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert agricultural advisor specializing in crop recommendations based on soil and climate analysis.' },
          { role: 'user', content: recommendationPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate recommendations' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const recommendationText = aiData.choices[0].message.content;

    // Translate to Swahili
    const translationPrompt = `Translate the following crop recommendation to Swahili. Maintain the structure and keep technical terms clear:

${recommendationText}`;

    const translationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a professional translator specializing in agricultural terminology. Translate to Swahili accurately.' },
          { role: 'user', content: translationPrompt }
        ],
      }),
    });

    if (!translationResponse.ok) {
      console.error('Translation error:', translationResponse.status);
    }

    const translationData = await translationResponse.json();
    const recommendationSwahili = translationData.choices[0].message.content;

    // Extract crop names for structured data
    const cropNames = recommendationText.match(/\d+\.\s+([^\n:]+)/g)?.map((match: string) => 
      match.replace(/\d+\.\s+/, '').trim()
    ) || [];

    // Save recommendation to database
    const { data: recommendation, error } = await supabase
      .from('crop_recommendations')
      .insert({
        user_id: user.id,
        dataset_id: datasetId || null,
        soil_data: soilData,
        climate_data: climateData,
        recommended_crops: cropNames,
        recommendation_text: recommendationText,
        recommendation_swahili: recommendationSwahili,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving recommendation:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      recommendation: {
        ...recommendation,
        recommendationText,
        recommendationSwahili,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in recommend-crops function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
