
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';

const LandingFooter = () => {
  const links = {
    product: [
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Security', href: '#security' },
      { name: 'Documentation', href: '/docs' },
      { name: 'FAQ', href: '/faq' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Team', href: '/team' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ]
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <span className="text-background font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-medium">T-Core</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Unlock the power of your stablecoins with T-Digital Dollar. 
              Fair distribution, transparent rewards.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('#') ? (
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <NavLink 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <NavLink 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <NavLink 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 T-Core. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
              Built with transparency and trust in mind.
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong>Risk Disclaimer:</strong> T-Core is experimental DeFi. No guaranteed returns, risk of loss. 
              Not investment advice. Performance fee 20% allocated to bonus/buyback/protocol revenue/insurance buffer.
            </p>
            <p>
              <strong>Centralized Management:</strong> Multisig security (3/5 signatures) for current operations, 
              transitioning to full decentralization Q1 2025 with governance token and DAO control.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
