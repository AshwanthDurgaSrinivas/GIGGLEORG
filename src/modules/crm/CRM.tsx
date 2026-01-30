import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leads, deals } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/store/uiStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// Lead Status Badge
const LeadStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { color: string; icon: string }> = {
    new: { color: 'blue', icon: 'Sparkles' },
    contacted: { color: 'amber', icon: 'Phone' },
    qualified: { color: 'emerald', icon: 'CheckCircle' },
    unqualified: { color: 'red', icon: 'XCircle' },
    converted: { color: 'indigo', icon: 'Trophy' },
  };
  const variant = variants[status] || variants.new;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[variant.icon] || Icons.Circle;

  return (
    <Badge className={cn(
      'gap-1',
      variant.color === 'blue' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      variant.color === 'amber' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      variant.color === 'emerald' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      variant.color === 'red' && 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      variant.color === 'indigo' && 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    )}>
      <IconComponent className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// AI Score Indicator
const AIScoreIndicator = ({ score }: { score: number }) => (
  <div className="flex items-center gap-2">
    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={cn(
          'h-full rounded-full',
          score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
        )}
      />
    </div>
    <span className={cn(
      'text-sm font-medium',
      score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'
    )}>
      {score}
    </span>
  </div>
);

// Pipeline Stage Column
const PipelineColumn = ({ stage, title, deals: stageDeals, color }: {
  stage: string;
  title: string;
  deals: typeof deals;
  color: string;
}) => {
  const stageDealsList = stageDeals.filter(d => d.stage === stage);
  const totalValue = stageDealsList.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex-shrink-0 w-80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', color)} />
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">{stageDealsList.length}</Badge>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        ₹{(totalValue / 100000).toFixed(1)}L total
      </p>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-3 pr-3">
          {stageDealsList.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="p-4 rounded-xl bg-card border shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm line-clamp-2">{deal.title}</h4>
                {deal.aiPrediction && (
                  <div className="flex items-center gap-1 text-indigo-500">
                    <Icons.Sparkles className="w-3 h-3" />
                    <span className="text-xs font-medium">{deal.aiPrediction.winProbability}%</span>
                  </div>
                )}
              </div>

              <p className="text-lg font-bold text-primary mb-3">
                ₹{(deal.value / 100000).toFixed(1)}L
              </p>

              <div className="flex items-center justify-between">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={deal.assignedToAvatar} />
                  <AvatarFallback>{deal.assignedToName?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                </div>
              </div>

              {deal.aiPrediction?.riskFactors && deal.aiPrediction.riskFactors.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Icons.AlertTriangle className="w-3 h-3" />
                    <span>{deal.aiPrediction.riskFactors[0]}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Leads Table
const LeadsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-10 px-4">
              <Icons.Filter className="w-4 h-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('new')}>New</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('contacted')}>Contacted</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('qualified')}>Qualified</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{lead.companyName}</p>
                    <p className="text-xs text-muted-foreground">{lead.source}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{lead.contactName}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <LeadStatusBadge status={lead.status} />
                </TableCell>
                <TableCell>
                  <p className="font-medium">₹{(lead.value / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-muted-foreground">{lead.probability}% probability</p>
                </TableCell>
                <TableCell>
                  {lead.aiScore ? <AIScoreIndicator score={lead.aiScore} /> : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7 border">
                      <AvatarImage src={lead.assignedToAvatar} />
                      <AvatarFallback>{lead.assignedToName?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{lead.assignedToName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{new Date(lead.lastActivity).toLocaleDateString()}</p>
                  {lead.nextFollowUp && (
                    <p className="text-xs text-amber-600">
                      Follow-up: {new Date(lead.nextFollowUp).toLocaleDateString()}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <Icons.MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Pipeline View
const PipelineView = () => {
  const stages = [
    { id: 'new_lead', title: 'New Lead', color: 'bg-slate-400' },
    { id: 'qualified', title: 'Qualified', color: 'bg-blue-500' },
    { id: 'proposal_sent', title: 'Proposal Sent', color: 'bg-amber-500' },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-purple-500' },
    { id: 'closed_won', title: 'Closed Won', color: 'bg-emerald-500' },
    { id: 'closed_lost', title: 'Closed Lost', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search deals..." className="pl-10 w-64 h-10" />
          </div>
          <Button variant="outline" className="gap-2 h-10">
            <Icons.Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            <Icons.Sparkles className="w-3 h-3 animate-pulse" />
            AI Predictions Enabled
          </Badge>
          <Button className="gap-2 h-10 shadow-lg shadow-primary/20">
            <Icons.Plus className="w-4 h-4" />
            Add Deal
          </Button>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {stages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage.id}
              title={stage.title}
              deals={deals}
              color={stage.color}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Activities View
const ActivitiesView = () => {
  const activities = [
    {
      id: '1',
      type: 'call',
      title: 'Discovery call with Meta',
      contact: 'Mark Zuckerberg',
      time: '10:30 AM',
      status: 'completed',
      note: 'Discussed cloud migration strategy and timeline.',
    },
    {
      id: '2',
      type: 'email',
      title: 'Follow-up email sent to Tesla',
      contact: 'Elon Musk',
      time: 'Yesterday',
      status: 'sent',
      note: 'Sent pricing quotation and contract draft.',
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Architecture Review - Apple',
      contact: 'Tim Cook',
      time: '3:00 PM',
      status: 'scheduled',
      note: 'Deep dive into security protocols and compliance.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search activities..." className="pl-10 w-64 h-10" />
          </div>
          <Button variant="outline" className="gap-2 h-10">
            <Icons.Filter className="w-4 h-4" />
            Types
          </Button>
        </div>
        <Button className="gap-2 h-10 shadow-lg shadow-primary/20">
          <Icons.Plus className="w-4 h-4" />
          Log Activity
        </Button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => {
          const IconComponent =
            activity.type === 'call' ? Icons.Phone :
              activity.type === 'email' ? Icons.Mail :
                activity.type === 'meeting' ? Icons.Video : Icons.CheckCircle2;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                activity.type === 'call' && 'bg-blue-500/10 text-blue-600',
                activity.type === 'email' && 'bg-emerald-500/10 text-emerald-600',
                activity.type === 'meeting' && 'bg-purple-500/10 text-purple-600',
                activity.type === 'task' && 'bg-amber-500/10 text-amber-600',
              )}>
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icons.User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">{activity.contact}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0 h-4 border-muted-foreground/30">
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg italic">
                  "{activity.note}"
                </p>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icons.MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Modals
const ExportModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
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
          <DialogTitle>Exporting CRM Data</DialogTitle>
          <DialogDescription>
            We're preparing your leads, deals, and AI insights for download.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{isDone ? 'Report Ready' : 'Processing Pipeline...'}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <AnimatePresence>
            {isDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-sm text-emerald-600"
              >
                <Icons.CheckCircle2 className="w-5 h-5" />
                CRM_Summary_Jan2024.xlsx generated
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!isDone} className="gap-2" onClick={() => onOpenChange(false)}>
            <Icons.Download className="w-4 h-4" />
            Download XLSX
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NewLeadModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Enter initial lead details for AI scoring and pipeline tracking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="e.g. Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input id="contact" placeholder="John Doe" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Est. Deal Value (₹)</Label>
              <Input id="value" type="number" placeholder="500000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Lead Source</Label>
            <Input id="source" placeholder="e.g. LinkedIn, Referral, Website" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-primary hover:bg-primary/90">Create Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main CRM Component
export const CRM = () => {
  const { activeModule, setActiveModule } = useUIStore();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  // Map specific sub-modules to tab values
  const currentTab = ['leads', 'pipeline', 'activities'].includes(activeModule)
    ? activeModule
    : 'leads';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Icons.LayoutGrid className="w-7 h-7 text-primary" />
            CRM Central
          </h1>
          <p className="text-muted-foreground text-sm">Manage customer relationships and intelligent sales pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-10" onClick={() => setIsExportOpen(true)}>
            <Icons.Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 h-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90" onClick={() => setIsNewLeadOpen(true)}>
            <Icons.Plus className="w-4 h-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: '156', change: '+12%', icon: 'Users', color: 'blue' },
          { label: 'Active Deals', value: '₹2.4Cr', change: '+8%', icon: 'Target', color: 'indigo' },
          { label: 'Win Rate', value: '68%', change: '+5%', icon: 'Trophy', color: 'emerald' },
          { label: 'Avg Deal Size', value: '₹4.2L', change: '+15%', icon: 'TrendingUp', color: 'amber' },
        ].map((stat, index) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const IconComponent = (Icons as any)[stat.icon];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="p-4 rounded-xl bg-card border shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  stat.color === 'blue' && 'bg-blue-500/10',
                  stat.color === 'indigo' && 'bg-indigo-500/10',
                  stat.color === 'emerald' && 'bg-emerald-500/10',
                  stat.color === 'amber' && 'bg-amber-500/10',
                )}>
                  <IconComponent className={cn(
                    'w-5 h-5',
                    stat.color === 'blue' && 'text-blue-500',
                    stat.color === 'indigo' && 'text-indigo-500',
                    stat.color === 'emerald' && 'text-emerald-500',
                    stat.color === 'amber' && 'text-amber-500',
                  )} />
                </div>
                <Badge variant="secondary" className="text-xs text-emerald-600 bg-emerald-500/5">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setActiveModule} className="w-full h-full flex flex-col">
        <TabsList className="bg-muted/50 p-1 w-full md:w-fit overflow-x-auto shrink-0">
          <TabsTrigger value="leads" className="gap-2 px-6">
            <Icons.Users className="w-4 h-4" />
            Leads Management
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2 px-6">
            <Icons.GitBranch className="w-4 h-4" />
            Visual Pipeline
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2 px-6">
            <Icons.Activity className="w-4 h-4" />
            Recent Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6 flex-1 min-h-0">
          <LeadsTable />
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6 flex-1 min-h-0">
          <PipelineView />
        </TabsContent>

        <TabsContent value="activities" className="mt-6 flex-1 min-h-0">
          <ActivitiesView />
        </TabsContent>
      </Tabs>

      <ExportModal isOpen={isExportOpen} onOpenChange={setIsExportOpen} />
      <NewLeadModal isOpen={isNewLeadOpen} onOpenChange={setIsNewLeadOpen} />
    </motion.div>
  );
};

