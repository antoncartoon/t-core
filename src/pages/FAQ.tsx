
import React from 'react';
import Header from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqData = [
    {
      id: 'what-is-tolkachyield',
      question: 'What is Tolkachyield Finance?',
      answer: 'Tolkachyield Finance is a DeFi platform that allows you to deposit stablecoins (USDT/USDC), mint tkchUSD tokens, and earn yield through optimized DeFi strategies. Your funds are automatically deployed to various protocols to maximize returns.'
    },
    {
      id: 'how-minting-works',
      question: 'How does minting tkchUSD work?',
      answer: 'When you deposit stablecoins, you receive tkchUSD tokens at a 1:1 ratio. These tokens represent your claim on the underlying assets. Your original stablecoins are then deployed to DeFi strategies to generate yield.'
    },
    {
      id: 'staking-strategies',
      question: 'What are the different staking strategies?',
      answer: 'We offer three strategies: Conservative (0-33% risk, 2-6% APY) focuses on blue-chip protocols, Moderate (34-66% risk, 6-15% APY) uses diversified yield farming, and Aggressive (67-100% risk, 15-25% APY) targets high-yield opportunities with elevated risk.'
    },
    {
      id: 'risks-involved',
      question: 'What are the risks involved?',
      answer: 'DeFi involves smart contract risk, protocol risk, and market volatility. Higher yield strategies carry proportionally higher risks. We recommend starting with conservative strategies and only investing what you can afford to lose.'
    },
    {
      id: 'withdrawal-process',
      question: 'How do I withdraw my funds?',
      answer: 'You can unstake your tkchUSD tokens at any time. The withdrawal process typically takes 24-48 hours as we need to withdraw funds from underlying DeFi protocols. There may be small fees depending on network congestion.'
    },
    {
      id: 'supported-tokens',
      question: 'Which tokens are supported?',
      answer: 'Currently, we support USDT and USDC for deposits. We plan to add more stablecoins like DAI and FRAX in future updates based on community demand.'
    },
    {
      id: 'fees-structure',
      question: 'What are the fees?',
      answer: 'We charge a small management fee (typically 1-2% annually) and a performance fee (10-15% of profits) to sustain the platform and development. Gas fees for blockchain transactions are separate and depend on network congestion.'
    },
    {
      id: 'self-insurance-pool',
      question: 'How does the Self-Insurance Pool work?',
      answer: 'Self-insurance pool. You are protected by yield generated. Protocol fees (0.5% of all transactions) automatically flow to Level 100 risk tier, creating a community-funded insurance buffer. This pool protects all stakers by absorbing losses before they affect user funds. The more activity on the protocol, the stronger the protection becomes.'
    },
    {
      id: 'security-measures',
      question: 'How secure is the platform?',
      answer: 'We use audited smart contracts, multi-signature wallets, and partner only with established DeFi protocols. However, DeFi always carries inherent risks, and we recommend users do their own research.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-light mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Tolkachyield Finance and DeFi yield strategies
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
