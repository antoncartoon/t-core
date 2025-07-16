
import { createRoot } from 'react-dom/client'
import AppRouter from './App.tsx'
import './index.css'
import { ContentManagementProvider } from '@/contexts/ContentManagementContext'

createRoot(document.getElementById("root")!).render(
  <ContentManagementProvider>
    <AppRouter />
  </ContentManagementProvider>
);
