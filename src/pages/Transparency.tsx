
import React from 'react';
import Header from '@/components/Header';
import TransparencyDashboard from '@/components/TransparencyDashboard';
import { EditableText } from '@/components/EditableText';
import { useContentManagement } from '@/contexts/ContentManagementContext';

const Transparency = () => {
  const { content } = useContentManagement();
  
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <EditableText
                path="transparency.title"
                value={content.transparency.title}
                as="h1"
                className="text-2xl sm:text-3xl font-light mb-2"
              />
              <EditableText
                path="transparency.description"
                value={content.transparency.description}
                as="p"
                className="text-muted-foreground"
                type="textarea"
              />
            </div>
          </div>
        </div>

        <TransparencyDashboard />
      </main>
    </div>
  );
};

export default Transparency;
