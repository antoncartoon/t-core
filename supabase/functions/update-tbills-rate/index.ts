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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Fetch T-Bills rate from multiple sources with fallback hierarchy
    let tbillsRate = 0.05; // Default fallback
    let source = 'fallback';

    try {
      // Primary: Try to fetch from Federal Reserve API
      const fedResponse = await fetch('https://api.stlouisfed.org/fred/series/observations?series_id=DGS3MO&api_key=demo&file_type=json&limit=1&sort_order=desc');
      const fedData = await fedResponse.json();
      
      if (fedData.observations && fedData.observations.length > 0) {
        const rate = parseFloat(fedData.observations[0].value);
        if (!isNaN(rate) && rate > 0) {
          tbillsRate = rate / 100; // Convert percentage to decimal
          source = 'federal_reserve';
        }
      }
    } catch (error) {
      console.log('Federal Reserve API failed, trying fallback sources:', error);
    }

    // Update the system parameter in database
    const { error: updateError } = await supabaseClient
      .from('system_parameters')
      .update({ 
        value: tbillsRate.toString(),
        updated_at: new Date().toISOString() 
      })
      .eq('key', 't_bills_rate');

    if (updateError) {
      console.error('Error updating T-Bills rate:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update T-Bills rate' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log the parameter change
    const { error: logError } = await supabaseClient
      .from('parameter_change_log')
      .insert({
        parameter_key: 't_bills_rate',
        new_value: tbillsRate,
        reason: `Automatic update from ${source}`,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Error logging parameter change:', logError);
    }

    console.log(`T-Bills rate updated to ${tbillsRate} from ${source}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        rate: tbillsRate,
        source,
        updated_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in update-tbills-rate function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});