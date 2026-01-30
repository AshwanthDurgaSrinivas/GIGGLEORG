import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { navItems } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface SidebarItemProps {
  item: typeof navItems[0];
  isCompact: boolean;
  depth?: number;
}

const SidebarItem = ({ item, isCompact, depth = 0 }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeModule, setActiveModule } = useUIStore();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeModule === item.id ||
    activeModule.startsWith(item.id + '-') ||
    (item.children && item.children.some(child => child.id === activeModule));

  const IconComponent = (Icons as any)[item.icon] || Icons.Circle;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
    setActiveModule(item.id);
  };

  return (
    <div className={cn('relative', depth > 0 && 'ml-2')}>
      <motion.button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300',
          isActive ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          isCompact && 'justify-center px-0 w-11 h-11 mx-auto'
        )}
        whileHover={{ x: isCompact ? 0 : 4 }}
        whileTap={{ scale: 0.96 }}
      >
        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-500',
          isActive ? 'bg-primary text-white shadow-lg shadow-primary/30 rotate-3' : 'bg-muted/50'
        )}>
          <IconComponent className={cn('w-4 h-4', isActive && 'animate-pulse')} />
        </div>

        {!isCompact && (
          <>
            <span className="flex-1 text-left tracking-tight">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px] font-black uppercase tracking-tighter bg-primary/20 text-primary border-none">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </motion.div>
            )}
          </>
        )}
      </motion.button>

      {isCompact && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-popover text-popover-foreground text-xs font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-2xl border border-border">
          {item.label}
        </div>
      )}

      <AnimatePresence>
        {!isCompact && hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1 space-y-1 border-l-2 border-primary/10 ml-7 pl-3 mt-1">
              {item.children?.map((child) => (
                <SidebarItem key={child.id} item={child} isCompact={isCompact} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Sidebar = () => {
  const { sidebarCompact, toggleSidebar: toggleCompact } = useThemeStore();
  const { sidebarOpen, setSidebarOpen, setActiveModule, setGlobalLoading } = useUIStore();
  const { user, logout } = useAuthStore();
  const isCompact = sidebarCompact;
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    setGlobalLoading(true, 'Terminating session...');
    setTimeout(() => {
      setGlobalLoading(false);
      logout();
    }, 1500);
  };

  const filteredItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children?.some(child => child.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -300,
          width: isCompact ? 80 : 280
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed left-0 top-0 z-50 h-[100dvh] bg-sidebar border-r border-sidebar-border',
          'flex flex-col transition-all duration-300 shadow-2xl shadow-black/5',
          !sidebarOpen && 'pointer-events-none lg:pointer-events-auto'
        )}
      >
        {/* Modern Logo Area */}
        <div className={cn(
          'h-20 flex items-center px-6 mb-2',
          isCompact && 'justify-center px-0'
        )}>
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveModule('dashboard')}
            layout
          >
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 glow-primary active:scale-90 transition-transform">
              <Icons.Orbit className="w-6 h-6 text-white" />
            </div>
            {!isCompact && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <h1 className="text-xl font-black text-foreground tracking-tighter uppercase leading-none">Giggle<span className="text-primary italic">Org</span></h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">Unified Ecosystem</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Improved Search */}
        {!isCompact && (
          <div className="px-5 mb-4 relative group">
            <Icons.Search className="absolute left-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-muted/30 border-none rounded-xl text-xs font-bold placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>
        )}

        {/* Navigation with Enhanced Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 mb-4 custom-scrollbar">
          <nav className="space-y-1.5">
            {filteredItems.map((item) => (
              <div key={item.id} className="group">
                <SidebarItem item={item} isCompact={isCompact} />
              </div>
            ))}
          </nav>
        </div>

        {/* Pro User Profile Section */}
        <div className={cn(
          'p-4 mt-auto',
          isCompact && 'p-2'
        )}>
          <div className="rounded-[2rem] bg-muted/30 border border-border/50 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className={cn(
                    'w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-background transition-all duration-300',
                    isCompact && 'justify-center p-1'
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative group">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                      alt="User"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-lg" />
                  </div>

                  {!isCompact && (
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-black text-foreground truncate leading-none mb-1">{user?.firstName} {user?.lastName}</p>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-none p-0 h-auto text-primary opacity-80">
                        {user?.role?.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}

                  {!isCompact && <Icons.ChevronUp className="w-4 h-4 text-muted-foreground/30" />}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side={isCompact ? 'right' : 'top'} className="w-64 p-2 rounded-2xl border-border shadow-2xl backdrop-blur-xl">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Authenticated As</p>
                  <p className="text-sm font-bold truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl h-11 px-3" onClick={() => setActiveModule('settings')}>
                  <Icons.User className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-bold">Profile Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl h-11 px-3" onClick={() => setActiveModule('settings')}>
                  <Icons.Zap className="w-4 h-4 mr-3 text-amber-500" />
                  <span className="font-bold">Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl h-11 px-3 text-red-500 hover:bg-red-50 focus:bg-red-50" onClick={handleLogout}>
                  <Icons.LogOut className="w-4 h-4 mr-3" />
                  <span className="font-bold text-xs uppercase tracking-widest">Terminate Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isCompact && (
              <button
                onClick={toggleCompact}
                className="mt-2 w-full flex items-center justify-center h-10 rounded-xl hover:bg-background text-muted-foreground hover:text-primary transition-all"
              >
                <Icons.PanelRightOpen className="w-5 h-5" />
              </button>
            )}

            {!isCompact && (
              <button
                onClick={toggleCompact}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                <Icons.PanelLeftClose className="w-3.5 h-3.5" />
                Collapse Menu
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay with Blur */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};
