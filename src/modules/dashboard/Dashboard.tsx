import { motion } from 'framer-motion';
import { KPICard } from '@/components/data-display/KPICard';
import { kpiData, revenueChartData, aiInsights, tasks, attendanceRecords } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

// AI Insight Card
const AIInsightCard = ({ insight }: { insight: typeof aiInsights[0] }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all group cursor-default"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <Icons.Sparkles className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-foreground">{insight.title}</h4>
          <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{insight.confidence}% matched</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-2">{insight.description}</p>
        {insight.actionable && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {insight.actions?.slice(0, 2).map((action, i) => (
              <Badge key={i} variant="secondary" className="text-[9px] font-black uppercase tracking-tighter bg-white dark:bg-slate-800 border-none px-2 h-5">
                {action}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Task Item
const TaskItem = ({ task }: { task: typeof tasks[0] }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/50 group"
  >
    <div className={cn(
      'w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all',
      task.status === 'done'
        ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20'
        : 'border-muted-foreground/20 group-hover:border-primary'
    )}>
      {task.status === 'done' && <Icons.Check className="w-4 h-4 text-white" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn(
        'text-sm font-bold truncate tracking-tight',
        task.status === 'done' && 'line-through text-muted-foreground opacity-50'
      )}>
        {task.title}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{task.projectId === '1' ? 'GIGGLEORG CORE' : 'WHATSAPP NODE'}</p>
      </div>
    </div>
    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-[9px] font-black uppercase px-2 h-5">
      {task.priority}
    </Badge>
  </motion.div>
);

// Attendance Widget
const AttendanceWidget = () => {
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
  const onLeaveCount = attendanceRecords.filter(r => r.status === 'on_leave').length;
  const total = attendanceRecords.length;

  return (
    <motion.div
      variants={itemVariants}
      className="pro-card p-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Workforce Hub</h3>
          <p className="text-xl font-black tracking-tight">Daily Presence</p>
        </div>
        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 border-primary/20 bg-primary/5 text-primary">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { icon: Icons.UserCheck, count: presentCount, label: 'Present', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: Icons.Clock, count: lateCount, label: 'Threshold', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { icon: Icons.CalendarX, count: onLeaveCount, label: 'Away', color: 'text-primary', bg: 'bg-primary/10' },
        ].map((item, i) => (
          <div key={i} className="text-center group">
            <div className={cn("w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", item.bg)}>
              <item.icon className={cn("w-6 h-6", item.color)} />
            </div>
            <p className="text-2xl font-black tracking-tight">{item.count}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-dashed">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] mb-3">
          <span className="text-muted-foreground">Efficiency Rate</span>
          <span className="text-primary">{Math.round((presentCount / total) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${(presentCount / total) * 100}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1, ease: 'circOut' }}
            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export const Dashboard = () => {
  const pieColors = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-[0.3em] mb-3">Operations Dashboard</Badge>
          <h1 className="text-4xl font-black tracking-tighter">Enterprise <span className="text-primary italic">Command.</span></h1>
          <p className="text-muted-foreground font-medium mt-1 italic">Real-time intelligence across the GIGGLEORG ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-11 px-6 font-bold uppercase text-[10px] tracking-widest bg-card border-border/50">
            <Icons.Download className="w-4 h-4 mr-2" /> Export Hub
          </Button>
          <Button className="rounded-xl h-11 px-6 font-bold uppercase text-[10px] tracking-widest shadow-glow">
            <Icons.Zap className="w-4 h-4 mr-2" /> Process AI
          </Button>
        </div>
      </motion.div>

      {/* KPI Surface */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={kpi.id} data={kpi} index={index} variant={index === 2 ? 'ai' : 'default'} />
        ))}
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Intelligence Visualization */}
        <div className="xl:col-span-2 space-y-8">
          {/* Revenue Trajectory */}
          <motion.div
            variants={itemVariants}
            className="pro-card p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-2xl font-black tracking-tighter italic">Revenue Flow</h3>
                <p className="text-sm font-medium text-muted-foreground">Strategic growth & target vectors</p>
              </div>
              <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow shadow-primary/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Actual</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target</span>
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData.labels.map((label, i) => ({
                  name: label,
                  revenue: revenueChartData.datasets[0].data[i],
                  target: revenueChartData.datasets[1].data[i],
                }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(v) => v.toUpperCase()}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={4}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 3, r: 5, stroke: 'white' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={false}
                    opacity={0.4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Efficiency Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={itemVariants}
              className="pro-card p-6"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Unit Performance</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'SALES', score: 92 },
                    { name: 'ENG', score: 95 },
                    { name: 'HR', score: 88 },
                    { name: 'MKT', score: 85 },
                    { name: 'FIN', score: 90 },
                  ]}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={9}
                      dy={10}
                    />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="pro-card p-6"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Lead Distribution</h3>
              <div className="h-56 flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Website', value: 35 },
                        { name: 'Referral', value: 25 },
                        { name: 'Social', value: 20 },
                        { name: 'Email', value: 15 },
                        { name: 'Events', value: 5 },
                      ]}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieColors.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3 pl-4">
                  {[
                    { name: 'Website', value: 35, color: pieColors[0] },
                    { name: 'Referral', value: 25, color: pieColors[1] },
                    { name: 'Social', value: 20, color: pieColors[2] }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</p>
                        <p className="text-xs font-bold">{item.value}% contribution</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Actionable Intelligence Column */}
        <div className="space-y-8">
          {/* GiggleAI Panel */}
          <motion.div
            variants={itemVariants}
            className="pro-card bg-primary text-primary-foreground p-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icons.Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs">GiggleAI Insights</h3>
                </div>
                <Badge className="bg-white/20 text-white border-none text-[9px] uppercase font-black">AI Active</Badge>
              </div>
              <div className="space-y-4">
                {aiInsights.slice(0, 2).map((insight) => (
                  <AIInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 text-white border-none py-6 rounded-2xl">
                Enter AI Control Center
              </Button>
            </div>
          </motion.div>

          {/* Operation Tasks */}
          <motion.div
            variants={itemVariants}
            className="pro-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                  <Icons.CheckSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Workflow Queue</h3>
              </div>
              <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black">{tasks.length} Total</Badge>
            </div>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Attendance Signal */}
          <AttendanceWidget />

          {/* Real-time Collaboration */}
          <motion.div
            variants={itemVariants}
            className="pro-card p-6"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6 italic">Network Health</h3>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative">
                  <Avatar className="w-12 h-12 rounded-2xl border-2 border-background ring-4 ring-primary/5">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-background" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border-none text-xs font-black">
                +18
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-6 opacity-60">23 Nodes connected securely</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
