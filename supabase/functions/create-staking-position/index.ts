import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const { amount, desiredApy, riskScore } = await req.json();

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!desiredApy || desiredApy <= 0 || desiredApy > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid desired APY' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!riskScore || riskScore < 1 || riskScore > 10) {
      return new Response(
        JSON.stringify({ error: 'Invalid risk score (1-10)' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get user's primary wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    if (walletError || !wallet) {
      return new Response(
        JSON.stringify({ error: 'No primary wallet found' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate transaction hash (mock)
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);

    // Create staking position
    const { data: position, error: positionError } = await supabaseClient
      .from('staking_positions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        amount: amount,
        desired_apy: desiredApy,
        risk_score: riskScore,
        tx_hash: txHash,
        status: 'active',
        block_number: Math.floor(Math.random() * 1000000)
      })
      .select()
      .single();

    if (positionError) {
      console.error('Staking position creation failed:', positionError);
      return new Response(
        JSON.stringify({ error: 'Staking position creation failed' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Record transaction
    const { error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        staking_position_id: position.id,
        type: 'stake',
        amount: amount,
        token_symbol: 'TDD',
        tx_hash: txHash,
        status: 'completed',
        block_number: Math.floor(Math.random() * 1000000),
        gas_used: 45000,
        gas_price: 20
      });

    if (txError) {
      console.error('Transaction recording failed:', txError);
    }

    console.log(`Staking position created: ${amount} TDD for user ${user.id}, tx: ${txHash}`);

    return new Response(
      JSON.stringify({
        success: true,
        position: position,
        txHash: txHash
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-staking-position function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});