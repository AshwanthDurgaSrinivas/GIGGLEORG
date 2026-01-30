import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import { useUIStore } from '@/store/uiStore';
import { notifications } from '@/data/dummyData';
import { useAuthStore } from '@/store/authStore';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const { mode, setMode } = useThemeStore();
  const { sidebarOpen, setSidebarOpen, searchOpen, toggleSearch, unreadCount, markAllNotificationsRead, setActiveModule } = useUIStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [currentTime]);

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 right-0 z-30 h-20 bg-background/70 backdrop-blur-2xl border-b border-border',
        'flex items-center justify-between px-6 transition-all duration-300 left-0'
      )}
    >
      {/* Left Station: Context & Greeting */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden h-11 w-11 rounded-xl bg-muted/50"
        >
          <Icons.Menu className="w-5 h-5" />
        </Button>

        <div className="hidden sm:flex flex-col">
          <h2 className="text-xl font-black text-foreground tracking-tight leading-none mb-1">
            {greeting}, <span className="text-primary italic">{user?.firstName || 'Guest'}</span>
          </h2>
          <div className="flex items-center gap-2">
            <Icons.Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </p>
            <span className="w-1 h-1 rounded-full bg-border" />
            <Icons.Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Intelligence Hub (Search) */}
      <div className="flex-1 max-w-2xl mx-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <Icons.Search className="absolute left-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search platform intelligence... (⌘+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-12 bg-muted/30 border-none rounded-2xl font-semibold text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:bg-background transition-all"
            />
            <div className="absolute right-4 flex items-center gap-1.5 opacity-50 group-focus-within:opacity-100">
              <kbd className="h-6 px-1.5 rounded-md bg-muted border border-border flex items-center justify-center text-[10px] font-black tracking-tighter shadow-sm">⌘</kbd>
              <kbd className="h-6 px-1.5 rounded-md bg-muted border border-border flex items-center justify-center text-[10px] font-black tracking-tighter shadow-sm">K</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Right Station: Actions & Health */}
      <div className="flex items-center gap-3">
        {/* Module Fast-Track */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-4 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest border-border/50 hover:bg-muted transition-all hidden xl:flex">
              <Icons.Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-border shadow-2xl">
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Workspace Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: 'New Lead', icon: Icons.Target, color: 'text-primary' },
                { label: 'Invoice', icon: Icons.FileText, color: 'text-emerald-500' },
                { label: 'Meeting', icon: Icons.Calendar, color: 'text-indigo-500' },
                { label: 'Asset', icon: Icons.Box, color: 'text-amber-500' },
              ].map((act, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-center justify-center h-20 rounded-xl gap-2 hover:bg-muted cursor-pointer">
                  <act.icon className={cn("w-5 h-5", act.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{act.label}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl bg-muted/50 hover:bg-muted group">
              <Icons.Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-background animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border-border shadow-2xl overflow-hidden">
            <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-widest">System Alerts</h4>
              <Badge className="bg-primary/20 text-primary border-none text-[10px] uppercase font-black">{unreadCount} New</Badge>
            </div>
            <div className="max-h-80 overflow-auto py-2">
              {unreadNotifications.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground italic text-sm">No pending alerts</div>
              ) : (
                unreadNotifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="mx-2 my-1 p-3 rounded-xl flex items-start gap-3 cursor-pointer">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      n.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                    )}>
                      <Icons.Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight mb-0.5">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <button
              onClick={markAllNotificationsRead}
              className="w-full h-11 border-t border-border text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors"
            >
              Clear Workspace Inbox
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* System Health */}
        <div className="h-11 flex items-center gap-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 ml-2 hidden sm:flex">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">All Systems Nominal</span>
        </div>

        {/* Theme Hub */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          className="h-11 w-11 rounded-xl bg-muted/50"
        >
          {mode === 'dark' ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
        </Button>
      </div>

    </motion.header>
  );
};
