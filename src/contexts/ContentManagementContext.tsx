import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Content types for different sections
interface ContentData {
  // Landing page content
  hero: {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    cta: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  
  // Transparency content
  transparency: {
    title: string;
    subtitle: string;
    description: string;
    dashboardTitle: string;
    tabs: {
      governance: string;
      collateral: string;
      fees: string;
      audits: string;
      roadmap: string;
    };
    metrics: {
      overcollateralization: {
        label: string;
        description: string;
      };
      performanceFee: {
        label: string;
        description: string;
      };
      surplusToTier4: {
        label: string;
        description: string;
      };
      decentralization: {
        label: string;
        description: string;
      };
    };
    security: {
      title: string;
      measures: {
        multisig: {
          title: string;
          description: string;
        };
        audits: {
          title: string;
          description: string;
        };
        onchain: {
          title: string;
          description: string;
        };
      };
    };
    roadmap: {
      title: string;
      phases: {
        current: {
          title: string;
          description: string;
        };
        governance: {
          title: string;
          description: string;
        };
        decentralization: {
          title: string;
          description: string;
        };
      };
    };
  };
  
  // Navigation content
  navigation: {
    home: string;
    dashboard: string;
    portfolio: string;
    defi: string;
    transparency: string;
    docs: string;
    faq: string;
  };
  
  // Common UI elements
  common: {
    connect: string;
    loading: string;
    error: string;
    success: string;
    edit: string;
    save: string;
    cancel: string;
    export: string;
    import: string;
    reset: string;
  };
}

// Default content data
const defaultContent: ContentData = {
  hero: {
    title: "T-Core DeFi Protocol",
    subtitle: "Risk-Tiered Yield on TDD Stablecoin",
    description: "Fixed 6% guaranteed yield (Tier 1) backed by T-Bills, with bonus yields up to 35% for higher risk tiers. Fully transparent, centralized management with multisig security.",
    features: [
      "6% Fixed Guarantee (T-Bills×1.2)",
      "Bonus Yields: 8-35% APY",
      "Multisig Security (3/5)",
      "Quarterly Audits"
    ],
    cta: {
      primary: "Start Investing",
      secondary: "Take Tutorial",
      tertiary: "Learn More"
    }
  },
  
  transparency: {
    title: "Protocol Transparency",
    subtitle: "Transparency & Security", 
    description: "Real-time data on protocol governance, collateral, audits, and development roadmap",
    dashboardTitle: "Protocol Transparency Dashboard",
    tabs: {
      governance: "Governance",
      collateral: "Collateral", 
      fees: "Performance Fee",
      audits: "Audits",
      roadmap: "Roadmap"
    },
    metrics: {
      overcollateralization: {
        label: "Overcollateralization",
        description: "Real asset backing"
      },
      performanceFee: {
        label: "Performance Fee",
        description: "Transparent allocation"
      },
      surplusToTier4: {
        label: "Surplus to Tier4",
        description: "Insurance compensation"
      },
      decentralization: {
        label: "Decentralization",
        description: "DAO governance launch"
      }
    },
    security: {
      title: "Security Measures",
      measures: {
        multisig: {
          title: "Multisig 3/5 Signatures",
          description: "Team wallet with Gnosis Safe standards"
        },
        audits: {
          title: "Quarterly Audits",
          description: "External security reviews (e.g., Quantstamp)"
        },
        onchain: {
          title: "On-Chain Verification",
          description: "All transactions verifiable on Etherscan"
        }
      }
    },
    roadmap: {
      title: "Decentralization Roadmap",
      phases: {
        current: {
          title: "Current: Centralized Management",
          description: "Multisig for security and efficiency"
        },
        governance: {
          title: "Q1 2026: Governance Token",
          description: "DAO voting on bonus distribution and upgrades"
        },
        decentralization: {
          title: "Full Decentralization",
          description: "Community control over all protocol parameters"
        }
      }
    }
  },
  
  navigation: {
    home: "Home",
    dashboard: "Dashboard",
    portfolio: "Portfolio",
    defi: "DeFi",
    transparency: "Transparency",
    docs: "Docs",
    faq: "FAQ"
  },
  
  common: {
    connect: "Connect",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    export: "Export",
    import: "Import",
    reset: "Reset"
  }
};

interface ContentManagementContextType {
  content: ContentData;
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  updateContent: (path: string, value: string | string[]) => void;
  exportContent: () => void;
  importContent: (content: ContentData) => void;
  resetContent: () => void;
  saveContent: () => void;
}

const ContentManagementContext = createContext<ContentManagementContextType | undefined>(undefined);

interface ContentManagementProviderProps {
  children: ReactNode;
}

export const ContentManagementProvider: React.FC<ContentManagementProviderProps> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('tcore-content');
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        setContent(parsed);
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }
  }, []);

  // Save content to localStorage when it changes
  const saveContent = () => {
    localStorage.setItem('tcore-content', JSON.stringify(content));
  };

  // Update content at a specific path
  const updateContent = (path: string, value: string | string[]) => {
    setContent(prev => {
      const newContent = { ...prev };
      const keys = path.split('.');
      let current: any = newContent;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  // Export content as JSON
  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tcore-content.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import content from JSON
  const importContent = (newContent: ContentData) => {
    setContent(newContent);
    saveContent();
  };

  // Reset to default content
  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem('tcore-content');
  };

  // Toggle edit mode
  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled);
    if (enabled) {
      // Auto-save when entering edit mode
      saveContent();
    }
  };

  return (
    <ContentManagementContext.Provider 
      value={{
        content,
        isEditMode,
        setEditMode,
        updateContent,
        exportContent,
        importContent,
        resetContent,
        saveContent
      }}
    >
      {children}
    </ContentManagementContext.Provider>
  );
};

export const useContentManagement = () => {
  const context = useContext(ContentManagementContext);
  if (context === undefined) {
    throw new Error('useContentManagement must be used within a ContentManagementProvider');
  }
  return context;
};