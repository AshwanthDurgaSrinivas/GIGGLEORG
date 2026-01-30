import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productivityData, employees } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Productivity Score Color
const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-600 bg-emerald-500/10';
  if (score >= 75) return 'text-blue-600 bg-blue-500/10';
  if (score >= 60) return 'text-amber-600 bg-amber-500/10';
  return 'text-red-600 bg-red-500/10';
};

// Activity Heatmap
const ActivityHeatmap = () => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const heatmapData = days.map(() =>
    hours.map(() => Math.floor(Math.random() * 60) + 40)
  );

  const getIntensity = (value: number) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 75) return 'bg-emerald-400';
    if (value >= 60) return 'bg-emerald-300';
    if (value >= 45) return 'bg-emerald-200';
    return 'bg-emerald-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-card border"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Activity Heatmap</h3>
          <p className="text-sm text-muted-foreground">Team productivity by hour</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-emerald-100" />
            <div className="w-3 h-3 rounded bg-emerald-200" />
            <div className="w-3 h-3 rounded bg-emerald-300" />
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <div className="w-3 h-3 rounded bg-emerald-500" />
          </div>
          <span className="text-muted-foreground">More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex mb-2">
            <div className="w-12" />
            {hours.map(hour => (
              <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                {hour % 12 || 12}{hour < 12 ? 'AM' : 'PM'}
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-12 text-sm font-medium">{day}</div>
              {hours.map((_, hourIndex) => {
                const value = heatmapData[dayIndex][hourIndex];
                return (
                  <TooltipProvider key={hourIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (dayIndex * 12 + hourIndex) * 0.01, duration: 0.2 }}
                          className={cn(
                            'flex-1 h-8 mx-0.5 rounded cursor-pointer transition-all hover:ring-2 hover:ring-primary',
                            getIntensity(value)
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{day} {hours[hourIndex]}:00</p>
                        <p className="font-medium">{value}% activity</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// App Usage Chart
const AppUsageChart = ({ apps }: { apps: typeof productivityData[0]['appsUsed'] }) => {
  return (
    <div className="space-y-2">
      {apps.map((app, index) => (
        <motion.div
          key={app.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className={cn(
            'w-2 h-2 rounded-full',
            app.category === 'productive' && 'bg-emerald-500',
            app.category === 'neutral' && 'bg-blue-500',
            app.category === 'unproductive' && 'bg-red-500',
          )} />
          <span className="text-sm flex-1">{app.name}</span>
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${app.percentage}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className={cn(
                'h-full rounded-full',
                app.category === 'productive' && 'bg-emerald-500',
                app.category === 'neutral' && 'bg-blue-500',
                app.category === 'unproductive' && 'bg-red-500',
              )}
            />
          </div>
          <span className="text-xs text-muted-foreground w-12 text-right">
            {Math.floor(app.duration / 60)}h {app.duration % 60}m
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// Employee Productivity Card
const EmployeeProductivityCard = ({ data, index }: { data: typeof productivityData[0]; index: number }) => {
  const employee = employees.find(e => e.id === data.employeeId);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="p-4 rounded-xl bg-card border hover:border-primary/30 transition-all cursor-pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={employee?.avatar} />
          <AvatarFallback>{employee?.firstName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h4 className="font-medium">{employee?.firstName} {employee?.lastName}</h4>
          <p className="text-xs text-muted-foreground">{employee?.designation}</p>
        </div>

        <div className="text-right">
          <Badge className={cn(getScoreColor(data.productivityScore))}>
            {data.productivityScore}%
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.floor(data.activeTime / 60)}h {data.activeTime % 60}m active
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-emerald-600">
              {Math.floor(data.productiveTime / 60)}h
            </p>
            <p className="text-xs text-muted-foreground">Productive</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-amber-600">
              {Math.floor(data.idleTime / 60)}h
            </p>
            <p className="text-xs text-muted-foreground">Idle</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-600">
              {data.keyboardActivity}%
            </p>
            <p className="text-xs text-muted-foreground">Activity</p>
          </div>
        </div>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t"
        >
          <h5 className="text-sm font-medium mb-3">App Usage</h5>
          <AppUsageChart apps={data.appsUsed} />
        </motion.div>
      )}
    </motion.div>
  );
};

// Export Report Dialog
const ExportReportModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsDone(true);
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setIsDone(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generating Productivity Report</DialogTitle>
          <DialogDescription>
            We're compiling activity data, app usage, and terminal metrics into a comprehensive PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{isDone ? 'Report Ready' : 'Processing...'}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <AnimatePresence>
            {isDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-sm text-emerald-600"
              >
                <Icons.CheckCircle2 className="w-5 h-5" />
                Performance_Report_Jan2024.pdf generated
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!isDone} className="gap-2" onClick={() => onOpenChange(false)}>
            <Icons.Download className="w-4 h-4" />
            Download Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Live View Dialog
const LiveViewModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const activities = [
        "Michael Chen opened VS Code",
        "Sarah Johnson joined Slack call",
        "Priya Sharma pushing to main branch",
        "Rahul Verma idle for 5 mins",
        "System heartbeat: Healthy",
        "Frontend build started by EMP002",
        "Screenshot captured: Sarah Johnson",
        "Active online users: 6",
      ];

      const interval = setInterval(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${activities[Math.floor(Math.random() * activities.length)]}`].slice(-8));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            Productivity Command Center
          </DialogTitle>
          <DialogDescription>Real-time employee monitoring and activity logs.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Employees</h4>
            <ScrollArea className="h-[350px]">
              <div className="space-y-2">
                {employees.slice(0, 6).map((emp) => (
                  <div key={emp.id} className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback>{emp.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{emp.firstName}</p>
                        <p className="text-[10px] text-muted-foreground">{emp.designation}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600">Active</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <span className="text-indigo-400 font-bold">ACTIVITY_LOG_STREAM</span>
              <Icons.Terminal className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  <span className="text-slate-600 mr-2">$</span>
                  {log}
                </motion.div>
              ))}
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-4 bg-primary inline-block align-middle ml-1"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/50 border-t flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close Live Monitoring</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Date Selector Popover
const DateSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Today');

  return (
    <div className="relative">
      <Button variant="outline" className="gap-2" onClick={() => setIsOpen(!isOpen)}>
        <Icons.Calendar className="w-4 h-4" />
        {selected}
        <Icons.ChevronDown className="w-3 h-3 text-muted-foreground" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-xl shadow-xl z-50 p-1"
            >
              {['Today', 'Yesterday', 'Last 7 Days', 'Specific Date'].map((item) => (
                <button
                  key={item}
                  onClick={() => { setSelected(item); setIsOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors",
                    selected === item && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {item}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Productivity Table
const ProductivityTable = () => {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Active Time</TableHead>
            <TableHead>Idle Time</TableHead>
            <TableHead>Productivity</TableHead>
            <TableHead>Apps Used</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productivityData.map((data, index) => {
            const employee = employees.find(e => e.id === data.employeeId);
            return (
              <motion.tr
                key={data.employeeId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={employee?.avatar} />
                      <AvatarFallback>{employee?.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{employee?.designation}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {Math.floor(data.activeTime / 60)}h {data.activeTime % 60}m
                </TableCell>
                <TableCell>
                  <span className="text-amber-600">
                    {Math.floor(data.idleTime / 60)}h {data.idleTime % 60}m
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={data.productivityScore} className="w-20 h-2" />
                    <Badge className={cn('text-xs', getScoreColor(data.productivityScore))}>
                      {data.productivityScore}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {data.appsUsed.slice(0, 3).map((app, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {app.name}
                      </Badge>
                    ))}
                    {data.appsUsed.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{data.appsUsed.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${data.keyboardActivity}%` }}
                      />
                    </div>
                    <span className="text-xs">{data.keyboardActivity}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm">Online</span>
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Main Productivity Component
export const Productivity = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLiveViewOpen, setIsLiveViewOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Icons.Activity className="w-7 h-7 text-emerald-500" />
            Productivity Monitoring
          </h1>
          <p className="text-muted-foreground text-sm">Track team activity, app usage, and productivity metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <DateSelector />
          <Button variant="outline" className="gap-2" onClick={() => setIsExportModalOpen(true)}>
            <Icons.Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90" onClick={() => setIsLiveViewOpen(true)}>
            <Icons.Play className="w-4 h-4" />
            Live View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Team Online', value: '6', change: 'Active now', icon: 'Users', color: 'emerald' },
          { label: 'Avg Productivity', value: '91%', change: '+3%', icon: 'TrendingUp', color: 'blue' },
          { label: 'Top Performer', value: 'Michael', change: '96% score', icon: 'Trophy', color: 'amber' },
          { label: 'Need Attention', value: '1', change: 'Below 80%', icon: 'AlertTriangle', color: 'red' },
        ].map((stat, index) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const IconComponent = (Icons as any)[stat.icon];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="p-4 rounded-xl bg-card border"
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  stat.color === 'emerald' && 'bg-emerald-500/10',
                  stat.color === 'blue' && 'bg-blue-500/10',
                  stat.color === 'amber' && 'bg-amber-500/10',
                  stat.color === 'red' && 'bg-red-500/10',
                )}>
                  <IconComponent className={cn(
                    'w-5 h-5',
                    stat.color === 'emerald' && 'text-emerald-500',
                    stat.color === 'blue' && 'text-blue-500',
                    stat.color === 'amber' && 'text-amber-500',
                    stat.color === 'red' && 'text-red-500',
                  )} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityHeatmap />
          <ProductivityTable />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Live Activity Recap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="p-5 rounded-xl bg-card border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed Snapshot
              </h3>
              <Badge variant="secondary" className="text-xs">6 Online</Badge>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-3">
                {productivityData.map((data, index) => (
                  <EmployeeProductivityCard key={data.employeeId} data={data} index={index} />
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Productivity Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Icons.Lightbulb className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">Productivity Tips</h3>
                <p className="text-sm text-muted-foreground">AI-powered recommendations</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                'Schedule focused work blocks',
                'Take regular breaks',
                'Minimize context switching',
                'Use time-blocking technique',
              ].map((tip, index) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Icons.CheckCircle className="w-4 h-4 text-emerald-500" />
                  {tip}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <ExportReportModal isOpen={isExportModalOpen} onOpenChange={setIsExportModalOpen} />
      <LiveViewModal isOpen={isLiveViewOpen} onOpenChange={setIsLiveViewOpen} />
    </motion.div>
  );
};

