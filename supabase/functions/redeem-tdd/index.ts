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

    const { amount, tokenSymbol } = await req.json();

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (tokenSymbol !== 'TDD') {
      return new Response(
        JSON.stringify({ error: 'Only TDD redemption supported' }),
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

    // Record transaction
    const { data: transaction, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        type: 'redeem',
        amount: amount,
        token_symbol: 'USDC',
        tx_hash: txHash,
        status: 'completed',
        block_number: Math.floor(Math.random() * 1000000),
        gas_used: 35000,
        gas_price: 20
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction recording failed:', txError);
      return new Response(
        JSON.stringify({ error: 'Transaction recording failed' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`TDD redeemed: ${amount} for user ${user.id}, tx: ${txHash}`);

    return new Response(
      JSON.stringify({
        success: true,
        transaction: transaction,
        txHash: txHash,
        amount: amount,
        tokenSymbol: 'USDC'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in redeem-tdd function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});