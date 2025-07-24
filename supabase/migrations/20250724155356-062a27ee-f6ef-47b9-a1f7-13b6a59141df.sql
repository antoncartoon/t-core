-- Create system_parameters table for dynamic protocol parameters
CREATE TABLE public.system_parameters (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for system_parameters
ALTER TABLE public.system_parameters ENABLE ROW LEVEL SECURITY;

-- Create policies for system_parameters (read-only for authenticated users, admin-only for writes)
CREATE POLICY "Anyone can view system parameters" 
ON public.system_parameters 
FOR SELECT 
USING (true);

-- Create parameter_change_log table for audit trail
CREATE TABLE public.parameter_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parameter_key TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for parameter_change_log
ALTER TABLE public.parameter_change_log ENABLE ROW LEVEL SECURITY;

-- Create policies for parameter_change_log
CREATE POLICY "Anyone can view parameter changes" 
ON public.parameter_change_log 
FOR SELECT 
USING (true);

-- Add tier-specific columns to pool_settings
ALTER TABLE public.pool_settings 
ADD COLUMN tier_name TEXT,
ADD COLUMN tier_range INT[];

-- Create trigger for updating timestamps on system_parameters
CREATE TRIGGER update_system_parameters_updated_at
BEFORE UPDATE ON public.system_parameters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial system parameters with corrected values
INSERT INTO public.system_parameters (key, value, description) VALUES
('t_bills_rate', '0.05', 'Current T-Bills rate from tokenized providers - updated via oracle'),
('safe_tier_multiplier', '1.2', 'Multiplier for Safe tier APY calculation (T-Bills × 1.2)'),
('target_tier_distribution', '{"safe": 0.40, "conservative": 0.20, "balanced": 0.20, "hero": 0.20}', 'Target liquidity allocation across tiers - 40% Safe for baseline coverage'),
('performance_fee_allocation', '{"bonus_pool": 0.25, "buyback_pool": 0.25, "protocol_revenue": 0.25, "insurance_reserve": 0.25}', 'Performance fee distribution across protocol functions'),
('tier_breakpoints', '{"safe": [0,9], "conservative": [10,29], "balanced": [30,59], "hero": [60,99]}', 'Risk level ranges for each tier'),
('tier_formulas', '{"safe": "Fixed 5.16%", "conservative": "Linear: 5.16% → 7%", "balanced": "Quadratic: 7% → 9.5%", "hero": "Exponential: 9.5% × 1.03^(i-60)"}', 'APY calculation formulas for each tier');

-- Update pool_settings to include tier mapping
UPDATE public.pool_settings SET 
  tier_name = CASE pool_name
    WHEN 'Conservative Pool' THEN 'safe'
    WHEN 'Balanced Pool' THEN 'conservative' 
    WHEN 'Growth Pool' THEN 'balanced'
    WHEN 'Aggressive Pool' THEN 'hero'
    ELSE pool_name
  END,
  tier_range = CASE pool_name
    WHEN 'Conservative Pool' THEN ARRAY[0,9]
    WHEN 'Balanced Pool' THEN ARRAY[10,29]
    WHEN 'Growth Pool' THEN ARRAY[30,59] 
    WHEN 'Aggressive Pool' THEN ARRAY[60,99]
    ELSE ARRAY[0,100]
  END;