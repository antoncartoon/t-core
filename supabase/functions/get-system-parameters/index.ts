import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Fetch all system parameters
    const { data: parameters, error } = await supabaseClient
      .from('system_parameters')
      .select('*');

    if (error) {
      console.error('Error fetching system parameters:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch system parameters' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Transform array to key-value object for easier use
    const parametersObject = parameters.reduce((acc, param) => {
      acc[param.key] = param.value;
      return acc;
    }, {} as Record<string, any>);

    return new Response(
      JSON.stringify({ parameters: parametersObject }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in get-system-parameters function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});