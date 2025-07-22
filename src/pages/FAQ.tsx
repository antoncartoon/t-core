import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, HelpCircle, Shield, Calculator, TrendingUp, Users } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: HelpCircle,
      color: 'bg-blue-500',
      questions: [
        {
          question: 'What is T-Core Finance?',
          answer: 'T-Core is a transparent DeFi protocol offering risk-tranched yields on TDD stablecoin, backed by T-Bills and diversified DeFi strategies. Users can choose their risk level (tiers 0-100) and earn proportional yields.'
        },
        {
          question: 'How do I get started?',
          answer: 'Connect your wallet (Web3 or social login), deposit stablecoins (USDC/USDT/DAI) to mint TDD tokens 1:1, then stake TDD in your preferred risk tier to start earning yield.'
        },
        {
          question: 'What are TDD tokens?',
          answer: 'TDD are stablecoin tokens minted 1:1 when you deposit supported stablecoins. They can be redeemed back to stablecoins or staked in risk tiers to earn yield.'
        }
      ]
    },
    {
      id: 'risk-tiers',
      title: 'Risk Tiers & Staking',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      questions: [
        {
          question: 'What are risk tiers?',
          answer: 'Risk tiers (0-100) allow you to choose your risk/reward profile. Lower tiers have lower risk and yield, while higher tiers have higher risk and potential yield.'
        },
        {
          question: 'How do I choose a risk tier?',
          answer: 'Consider your risk tolerance and investment goals. Start with lower tiers if you are risk-averse, or explore higher tiers for potentially higher returns.'
        },
        {
          question: 'What are the risks of staking in higher tiers?',
          answer: 'Higher tiers have a higher risk of loss during stress events. Waterfall distribution means lower tiers are protected first, while higher tiers absorb more risk.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Audits',
      icon: Shield,
      color: 'bg-green-500',
      questions: [
        {
          question: 'Is T-Core Finance secure?',
          answer: 'We prioritize security through rigorous testing, audits, and risk management. However, DeFi protocols always carry inherent risks.'
        },
        {
          question: 'Has T-Core been audited?',
          answer: 'Yes, T-Core has been audited by top security firms. Audit reports are available in our documentation.'
        },
        {
          question: 'What security measures are in place?',
          answer: 'We use multi-sig wallets, rate limits, and waterfall distribution to protect user funds. Smart contracts are designed with security best practices.'
        }
      ]
    },
    {
      id: 'tokens',
      title: 'TDD Tokens',
      icon: Calculator,
      color: 'bg-purple-500',
      questions: [
        {
          question: 'How do I mint TDD tokens?',
          answer: 'Connect your wallet, deposit supported stablecoins (USDC/USDT/DAI), and mint TDD tokens 1:1. The process is automated and gas-optimized.'
        },
        {
          question: 'How do I redeem TDD tokens?',
          answer: 'Redeem TDD tokens back to stablecoins at any time. A small redemption fee may apply depending on market conditions.'
        },
        {
          question: 'What is the purpose of TDD tokens?',
          answer: 'TDD tokens represent your share of the underlying assets in T-Core. They can be staked to earn yield or redeemed back to stablecoins.'
        }
      ]
    },
    {
      id: 'community',
      title: 'Community & Support',
      icon: Users,
      color: 'bg-red-500',
      questions: [
        {
          question: 'How can I get support?',
          answer: 'Join our Discord community for support and discussions. You can also find answers in our documentation and FAQs.'
        },
        {
          question: 'How can I contribute to T-Core?',
          answer: 'We welcome community contributions! Join our Discord to discuss ideas, report bugs, or contribute to development.'
        },
        {
          question: 'Where can I find announcements?',
          answer: 'Follow us on Twitter and join our Discord for the latest news, announcements, and updates.'
        }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-light">Frequently Asked Questions</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Find answers to common questions about T-Core Finance
          </p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            const filteredQuestions = category.questions.filter(
              q => 
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (searchTerm && filteredQuestions.length === 0) return null;

            return (
              <Card key={category.id} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge variant="outline">{filteredQuestions.length}</Badge>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {(searchTerm ? filteredQuestions : category.questions).map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default FAQ;
