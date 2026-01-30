import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/modules/dashboard/Dashboard';
import { CRM } from '@/modules/crm/CRM';
import { HRMS } from '@/modules/hrms/HRMS';
import { Payroll } from '@/modules/payroll/Payroll';
import { Productivity } from '@/modules/productivity/Productivity';
import { AIFeatures } from '@/modules/ai-features/AIFeatures';
import { Settings } from '@/modules/settings/Settings';
import { Sales } from '@/modules/sales/Sales';
import { Accounting } from '@/modules/accounting/Accounting';
import { Inventory } from '@/modules/inventory/Inventory';
import { Projects } from '@/modules/projects/Projects';
import { Communications } from '@/modules/communications/Communications';
import { LandingPage } from '@/modules/landing/LandingPage';
import { useThemeStore } from '@/store/themeStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

// Main Content Router
const MainContent = () => {
  const { activeModule } = useUIStore();

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'crm':
      case 'leads':
      case 'pipeline':
      case 'activities':
        return <CRM />;
      case 'sales':
      case 'quotations':
      case 'orders':
      case 'subscriptions':
        return <Sales />;
      case 'accounting':
      case 'invoices':
      case 'payments':
      case 'expenses':
        return <Accounting />;
      case 'inventory':
      case 'products':
      case 'purchase':
      case 'stock':
        return <Inventory />;
      case 'projects':
      case 'all-projects':
      case 'tasks':
      case 'timesheets':
        return <Projects />;
      case 'hrms':
      case 'employees':
      case 'attendance':
      case 'leaves':
      case 'recruitment':
        return <HRMS />;
      case 'payroll':
      case 'salary':
      case 'payslips':
      case 'compliance':
      case 'incentives':
        return <Payroll />;
      case 'productivity':
        return <Productivity />;
      case 'ai-features':
        return <AIFeatures />;
      case 'communications':
      case 'whatsapp':
      case 'email':
      case 'sms':
        return <Communications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={activeModule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[calc(100vh-80px)]"
      >
        {renderContent()}
      </motion.main>
    </AnimatePresence>
  );
};

// Global Loading Overlay - Premium Redesign
const GlobalLoading = () => {
  const { globalLoading, loadingMessage } = useUIStore();

  return (
    <AnimatePresence>
      {globalLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-2xl flex items-center justify-center p-6"
        >
          <div className="text-center relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-[2rem] border-2 border-primary/20 border-t-primary border-r-primary/50 mx-auto mb-8 shadow-2xl shadow-primary/20"
            />
            <div className="absolute inset-0 flex items-center justify-center -top-8">
              <Icons.Orbit className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">GIGGLE<span className="text-primary italic">ORG</span></h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">{loadingMessage || 'Initializing Environment...'}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Keyboard Shortcuts Handler
const useKeyboardShortcuts = () => {
  const { toggleSearch } = useUIStore();
  const { toggleSidebar } = useThemeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      // Ctrl/Cmd + B for sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch, toggleSidebar]);
};

function App() {
  const { sidebarCompact } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  // Setup keyboard shortcuts
  useKeyboardShortcuts();

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage />
        <GlobalLoading />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Layout Container */}
      <div className={cn(
        'transition-all duration-500 ease-spring min-h-screen relative overflow-x-hidden',
        sidebarCompact ? 'lg:ml-20' : 'lg:ml-[280px]',
        'ml-0'
      )}>
        {/* Decorative Lighting Environment */}
        <div className="fixed top-0 right-0 w-[50%dvw] h-[50dvh] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[40%dvw] h-[40dvh] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Unified Navbar */}
        <Navbar />

        {/* Global Actionable Layer (Content) */}
        <div className="pt-20 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
          <MainContent />
        </div>
      </div>

      {/* System-Level Overlays */}
      <GlobalLoading />
    </div>
  );
}

export default App;
