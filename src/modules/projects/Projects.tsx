import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/store/uiStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Dummy Data for Projects Module
const projectData = [
    { id: '1', name: 'Nexus ERP v2.0', category: 'Productivity', status: 'In Progress', progress: 45, team: ['A', 'B', 'C'], priority: 'High', deadline: 'Jun 30' },
    { id: '2', name: 'WhatsApp Bot', category: 'Automation', status: 'Planning', progress: 12, team: ['D', 'E'], priority: 'Medium', deadline: 'Apr 15' },
    { id: '3', name: 'Cloud Migration', category: 'Infrastructure', status: 'Review', progress: 88, team: ['F', 'G', 'H', 'I'], priority: 'High', deadline: 'Feb 20' },
    { id: '4', name: 'Mobile App', category: 'Design', status: 'In Progress', progress: 30, team: ['J', 'K'], priority: 'Critical', deadline: 'Aug 10' },
];

const taskData = [
    { id: 'T1', title: 'Design System Update', project: 'Nexus ERP', assignee: 'Alex', priority: 'High', status: 'In Progress', due: 'In 2 days' },
    { id: 'T2', title: 'API Authentication', project: 'Nexus ERP', assignee: 'Sarah', priority: 'Critical', status: 'Backlog', due: 'In 5 days' },
    { id: 'T3', title: 'Webhook Setup', project: 'WhatsApp Bot', assignee: 'Mike', priority: 'Medium', status: 'Completed', due: 'Done' },
    { id: 'T4', title: 'User Testing', project: 'Mobile App', assignee: 'Emily', priority: 'High', status: 'Review', due: 'Tomorrow' },
];

const timesheetData = [
    { id: 'TS1', project: 'Nexus ERP', task: 'UI Development', duration: '4h 30m', date: 'Today, 10:30 AM', category: 'Development' },
    { id: 'TS2', project: 'Mobile App', task: 'Asset Export', duration: '2h 15m', date: 'Today, 03:00 PM', category: 'Design' },
    { id: 'TS3', project: 'Nexus ERP', task: 'Client Meeting', duration: '1h 00m', date: 'Yesterday', category: 'Meeting' },
];

const timelineEvents = [
    { id: 'tl1', project: 'Nexus ERP v2.0', task: 'Phase 1: Backend Setup', start: 'Feb 01', end: 'Feb 15', progress: 100, status: 'Completed' },
    { id: 'tl2', project: 'Nexus ERP v2.0', task: 'Phase 2: UI Implementation', start: 'Feb 16', end: 'Mar 15', progress: 45, status: 'In Progress' },
    { id: 'tl3', project: 'Nexus ERP v2.0', task: 'Phase 3: Integration', start: 'Mar 16', end: 'Mar 31', progress: 0, status: 'Planned' },
    { id: 'tl4', project: 'Mobile App', task: 'App Refactor', start: 'Feb 10', end: 'Feb 28', progress: 30, status: 'In Progress' },
];

export const Projects = () => {
    const { activeModule, setActiveModule } = useUIStore();
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);

    const currentTab = ['all-projects', 'tasks', 'timesheets'].includes(activeModule)
        ? activeModule
        : 'all-projects';

    const handleTabChange = (value: string) => {
        setActiveModule(value);
    };

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
                        <Icons.FolderKanban className="w-7 h-7 text-indigo-500" />
                        Projects & Collaboration
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage tasks, timelines, and team resources</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Icons.Calendar className="w-4 h-4" />
                                Timeline
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                            <DialogHeader>
                                <DialogTitle>Project Roadmap</DialogTitle>
                                <DialogDescription>Visual timeline of active and upcoming project phases.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                {timelineEvents.map((event) => (
                                    <div key={event.id} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <div>
                                                <span className="font-bold text-indigo-600">{event.project}</span>
                                                <span className="mx-2 text-muted-foreground opacity-50">|</span>
                                                <span className="font-medium">{event.task}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] h-5">{event.start} - {event.end}</Badge>
                                        </div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <Badge className={cn(
                                                        "text-[10px] uppercase h-5",
                                                        event.status === 'Completed' && "bg-emerald-500",
                                                        event.status === 'In Progress' && "bg-blue-500",
                                                        event.status === 'Planned' && "bg-slate-400"
                                                    )}>{event.status}</Badge>
                                                </div>
                                                <div className="text-right font-mono text-xs">
                                                    {event.progress}%
                                                </div>
                                            </div>
                                            <Progress value={event.progress} className="h-1.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700">
                                <Icons.Plus className="w-4 h-4" />
                                New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Launch New Project</DialogTitle>
                                <DialogDescription>Initialize a new project workspace and define core parameters.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Project Name</Label>
                                    <Input placeholder="Nexus v3.0..." className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Category</Label>
                                    <Select defaultValue="productivity">
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="productivity">Productivity</SelectItem>
                                            <SelectItem value="automation">Automation</SelectItem>
                                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                                            <SelectItem value="design">Design</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Priority</Label>
                                    <Select defaultValue="medium">
                                        <SelectTrigger className="col-span-3 border-l-4 border-l-amber-500">
                                            <SelectValue placeholder="Set Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="critical">Critical</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Deadline</Label>
                                    <Input type="date" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>Cancel</Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsNewProjectOpen(false)}>Create Workspace</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Projects', value: '18', change: '+3', icon: 'FolderKanban', color: 'indigo' },
                    { label: 'Total Tasks', value: '456', change: '85% Done', icon: 'CheckSquare', color: 'emerald' },
                    { label: 'Billable Hours', value: '1,280', change: '+12%', icon: 'Clock', color: 'blue' },
                    { label: 'Team Capacity', value: '92%', change: 'High', icon: 'Users', color: 'amber' },
                ].map((stat, index) => {
                    const IconComponent = (Icons as any)[stat.icon];
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-5 rounded-2xl bg-card border hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                                    stat.color === 'indigo' && 'bg-indigo-500/10 text-indigo-500',
                                    stat.color === 'emerald' && 'bg-emerald-500/10 text-emerald-500',
                                    stat.color === 'blue' && 'bg-blue-500/10 text-blue-500',
                                    stat.color === 'amber' && 'bg-amber-500/10 text-amber-500',
                                )}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {stat.change}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold mt-4">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Tabs Content */}
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="bg-muted/50 p-1 w-full md:w-fit overflow-x-auto">
                    <TabsTrigger value="all-projects" className="gap-2 px-6">
                        <Icons.Folders className="w-4 h-4" />
                        All Projects
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="gap-2 px-6">
                        <Icons.CheckSquare className="w-4 h-4" />
                        Tasks
                    </TabsTrigger>
                    <TabsTrigger value="timesheets" className="gap-2 px-6">
                        <Icons.Clock className="w-4 h-4" />
                        Timesheets
                    </TabsTrigger>
                </TabsList>

                {/* All Projects View */}
                <TabsContent value="all-projects" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {projectData.map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-6 rounded-2xl border bg-card hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <Badge variant="outline" className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                        project.priority === 'High' && "bg-red-50 text-red-600 border-red-200",
                                        project.priority === 'Critical' && "bg-purple-50 text-purple-600 border-purple-200",
                                        project.priority === 'Medium' && "bg-amber-50 text-amber-600 border-amber-200"
                                    )}>
                                        {project.priority}
                                    </Badge>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                                            {project.category}
                                        </p>
                                        <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                                            {project.name}
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-bold">{project.progress}%</span>
                                        </div>
                                        <Progress value={project.progress} className="h-2 bg-slate-100" />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex -space-x-2">
                                            {project.team.map((m) => (
                                                <Avatar key={m} className="w-8 h-8 border-2 border-background">
                                                    <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-blue-50 text-[10px] text-indigo-600 font-bold">
                                                        {m}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-background flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                                                +2
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Icons.Calendar className="w-3 h-3" />
                                            {project.deadline}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Tasks Board View */}
                <TabsContent value="tasks" className="pt-6">
                    <div className="space-y-3">
                        {taskData.map((task, idx) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-slate-50/50 transition-all group"
                            >
                                <div className={cn(
                                    "w-1 h-10 rounded-full",
                                    task.priority === 'Critical' ? "bg-purple-500" :
                                        task.priority === 'High' ? "bg-red-500" : "bg-amber-500"
                                )} />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                                    <p className="text-xs text-muted-foreground">{task.project}</p>
                                </div>
                                <div className="hidden md:flex flex-col items-center min-w-[100px]">
                                    <Badge variant="outline" className="text-[10px]">{task.status}</Badge>
                                </div>
                                <div className="flex items-center gap-4 min-w-[120px] justify-end">
                                    <div className="text-right">
                                        <p className="text-xs font-medium">{task.assignee}</p>
                                        <p className="text-[10px] text-muted-foreground">{task.due}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icons.ArrowRight className="w-4 h-4 text-primary" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Timesheets Timeline View */}
                <TabsContent value="timesheets" className="pt-6">
                    <div className="space-y-6 max-w-2xl mx-auto">
                        {timesheetData.map((entry, idx) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <Icons.Clock className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="w-0.5 flex-1 bg-slate-100 my-2" />
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs font-bold text-indigo-500">{entry.project}</p>
                                                <h4 className="font-semibold">{entry.task}</h4>
                                            </div>
                                            <Badge className="bg-indigo-600 text-[11px] h-6 px-3">{entry.duration}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 text-[10px]">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Icons.Tag className="w-3 h-3" />
                                                {entry.category}
                                            </div>
                                            <div className="font-medium text-slate-500">
                                                {entry.date}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};


