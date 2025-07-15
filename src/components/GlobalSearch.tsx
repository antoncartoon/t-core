import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, FileText, HelpCircle, TrendingUp, Settings, Clock, Star } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'position' | 'transaction' | 'faq' | 'docs' | 'feature';
  description: string;
  url?: string;
  category: string;
  relevance: number;
  timestamp?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Aave USDC Position',
      type: 'position',
      description: 'Your active USDC lending position on Aave protocol',
      category: 'Positions',
      relevance: 95,
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'How to calculate APY?',
      type: 'faq',
      description: 'Learn how Annual Percentage Yield is calculated',
      category: 'FAQ',
      relevance: 88,
      url: '/faq#apy-calculation'
    },
    {
      id: '3',
      title: 'Risk Management Documentation',
      type: 'docs',
      description: 'Complete guide to risk management features',
      category: 'Documentation',
      relevance: 82,
      url: '/docs/risk-management'
    },
    {
      id: '4',
      title: 'Recent Compound Transaction',
      type: 'transaction',
      description: 'Deposit of 1000 USDC to Compound protocol',
      category: 'Transactions',
      relevance: 75,
      timestamp: '2024-01-14T15:45:00Z'
    },
    {
      id: '5',
      title: 'Portfolio Optimizer',
      type: 'feature',
      description: 'AI-powered portfolio optimization tool',
      category: 'Features',
      relevance: 70,
      url: '/app/optimizer'
    }
  ];

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      // Simulate search delay
      const timeout = setTimeout(() => {
        const filtered = mockResults.filter(result =>
          result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filtered);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    if (term.trim() && !recentSearches.includes(term)) {
      const newSearches = [term, ...recentSearches.slice(0, 4)];
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    }
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearch(searchTerm);
    if (result.url) {
      window.location.href = result.url;
    }
    onOpenChange(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'position': return <TrendingUp className="h-4 w-4" />;
      case 'transaction': return <Clock className="h-4 w-4" />;
      case 'faq': return <HelpCircle className="h-4 w-4" />;
      case 'docs': return <FileText className="h-4 w-4" />;
      case 'feature': return <Settings className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'position': return 'default';
      case 'transaction': return 'secondary';
      case 'faq': return 'outline';
      case 'docs': return 'outline';
      case 'feature': return 'default';
      default: return 'outline';
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search positions, transactions, FAQ, docs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!searchTerm.trim() && recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Recent Searches</h4>
                  <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm(search)}
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {searchTerm.trim() && (
              <div className="space-y-2">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getResultIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            <Badge variant={getTypeColor(result.type)} className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {result.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {result.category}
                            </span>
                            {result.timestamp && (
                              <span className="text-xs text-muted-foreground">
                                • {new Date(result.timestamp).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or browse our documentation
                    </p>
                  </div>
                )}
              </div>
            )}

            {!searchTerm.trim() && recentSearches.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Search Everything</h3>
                <p className="text-muted-foreground mb-4">
                  Find positions, transactions, FAQ, documentation, and features
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['positions', 'APY', 'risk', 'staking', 'yield'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;