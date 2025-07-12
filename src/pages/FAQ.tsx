
import React from 'react';
import Header from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqData = [
    {
      id: 'what-is-tcore',
      question: 'What is T-Core Finance?',
      answer: 'T-Core Finance is an advanced DeFi yield optimization platform that allows you to deposit TDD tokens into NFT staking positions across 100 different risk tiers. Each risk level (1-100) offers different APY rates based on a non-linear yield curve, allowing precise risk-reward customization.'
    },
    {
      id: 'how-nft-staking-works',
      question: 'How do NFT staking positions work?',
      answer: 'When you create a staking position, you receive an NFT that represents your stake in specific risk tiers. You can choose single ticks (like Risk Level 95) or ranges (like Risk Level 20-40). Each NFT contains your TDD tokens and earns yield based on the risk profile you selected.'
    },
    {
      id: 'risk-tier-system',
      question: 'How does the 100-level risk tier system work?',
      answer: 'Risk levels 1-3 are "Safe" (guaranteed 5.016% APY), levels 4-24 are "Conservative", levels 25-80 are "Balanced", and levels 81-100 are "T-Core HERO" with the highest yields. The APY follows a non-linear curve (k=2), meaning higher risk levels offer exponentially higher rewards.'
    },
    {
      id: 'yield-curve-explanation',
      question: 'What is the non-linear yield curve (k=2)?',
      answer: 'The yield curve uses a power function where APY = Base_APY × (Risk_Level/100)^k, with k=2. This means Risk Level 50 doesn\'t give 50% of max yield, but 25% (50²/100² = 0.25). Risk Level 90 gives 81% of max yield. This creates exponential reward growth for taking higher risks.'
    },
    {
      id: 'tdd-token-explanation',
      question: 'What are TDD tokens?',
      answer: 'TDD (T-Core Diversified Deposit) tokens are the main utility tokens of T-Core Finance. You deposit stablecoins to mint TDD tokens, which you then stake in NFT positions across different risk tiers. TDD tokens represent your proportional share of the protocol\'s yield-generating activities.'
    },
    {
      id: 'risk-categories',
      question: 'What are the different risk categories?',
      answer: 'Safe (Levels 1-3): Guaranteed 5.016% APY with capital protection. Conservative (4-24): Lower risk DeFi strategies. Balanced (25-80): Diversified medium-risk protocols. T-Core HERO (81-100): Highest risk, highest reward strategies with protocol insurance backing.'
    },
    {
      id: 'protocol-insurance',
      question: 'How does T-Core protect my investment?',
      answer: 'T-Core uses a unique self-insurance model where the protocol itself stakes in Risk Level 100 (highest risk). Protocol fees and treasury funds go to the riskiest tier first, creating a buffer that absorbs losses before affecting user funds. The protocol takes the hit first, users second.'
    },
    {
      id: 'liquidity-distribution',
      question: 'How is liquidity distributed across risk levels?',
      answer: 'Each risk level has its own liquidity pool. When you stake in a range (e.g., 20-40), your TDD is split equally across those 21 risk levels. The protocol calculates weighted average APY based on your distribution and the theoretical APY of each individual risk level.'
    },
    {
      id: 'position-management',
      question: 'Can I modify my NFT positions after creation?',
      answer: 'Once created, NFT positions have fixed risk ranges, but you can trade them, sell them, or use them as collateral for borrowing on AAVE. You can also create multiple positions with different risk profiles to diversify your strategy.'
    },
    {
      id: 'aave-integration',
      question: 'How does the AAVE integration work?',
      answer: 'You can use your T-Core NFT staking positions as collateral to borrow assets on AAVE. The borrowing capacity is typically 75% of your NFT position value (Loan-to-Value ratio). This allows you to leverage your T-Core positions while maintaining your yield exposure.'
    },
    {
      id: 'fees-and-rewards',
      question: 'What are the fees and how are rewards distributed?',
      answer: 'T-Core charges a 0.5% protocol fee on all transactions, which flows directly to Risk Level 100 to strengthen the insurance pool. There are no management fees. Rewards are distributed based on your risk tier selection and the amount of TDD staked in each level.'
    },
    {
      id: 'getting-started',
      question: 'How do I get started with T-Core Finance?',
      answer: 'First, deposit stablecoins (USDT/USDC) to mint TDD tokens. Then choose your risk strategy: start with Safe levels (1-3) for guaranteed returns, or explore higher risk levels for potentially higher yields. Create NFT positions for your chosen risk tiers and start earning immediately.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-light mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about T-Core Finance, NFT staking positions, and our 100-level risk tier system
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
          <h3 className="font-medium mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join our community or reach out to our support team
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a href="#" className="text-sm text-primary hover:underline">Discord Community</a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="text-sm text-primary hover:underline">Support Center</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
