import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leads, deals } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUIStore } from '@/store/uiStore';
import { Progress } from '@/components/ui/progress';

// Dummy Data for Sales
const quotations = [
    { id: 'QT-2024-001', customer: 'Meta Platforms', date: '2024-01-25', amount: '₹12,50,000', status: 'Pending', validity: '2024-02-25' },
    { id: 'QT-2024-002', customer: 'Tesla Inc', date: '2024-01-26', amount: '₹8,75,000', status: 'Accepted', validity: '2024-02-26' },
    { id: 'QT-2024-003', customer: 'Apple Inc', date: '2024-01-28', amount: '₹25,00,000', status: 'Expired', validity: '2024-02-15' },
    { id: 'QT-2024-004', customer: 'Google', date: '2024-01-30', amount: '₹5,40,000', status: 'Pending', validity: '2024-03-01' },
];

const orders = [
    { id: 'ORD-8821', customer: 'Microsoft', date: '2024-01-20', amount: '₹45,00,000', status: 'Processing', type: 'Enterprise' },
    { id: 'ORD-8822', customer: 'Amazon Web Services', date: '2024-01-22', amount: '₹18,20,000', status: 'Shipped', type: 'Standard' },
    { id: 'ORD-8823', customer: 'Netflix', date: '2024-01-24', amount: '₹9,50,000', status: 'Delivered', type: 'Direct' },
];

const subscriptions = [
    { id: 'SUB-001', customer: 'Spotify', plan: 'Premium Enterprise', renewal: '2024-02-15', status: 'Active', value: '₹4,500/mo' },
    { id: 'SUB-002', customer: 'Adobe', plan: 'Creative Cloud Business', renewal: '2024-02-18', status: 'Active', value: '₹12,800/mo' },
    { id: 'SUB-003', customer: 'Slack', plan: 'Pro Plan', renewal: '2024-01-30', status: 'Expiring', value: '₹2,400/mo' },
];

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
            }, 250);
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
                    <DialogTitle>Generating Sales Report</DialogTitle>
                    <DialogDescription>
                        Compiling all quotations, active orders, and subscription revenue.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{isDone ? 'Report Ready' : 'Analyzing Q1 Revenue...'}</span>
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
                                <Icons.FileText className="w-5 h-5" />
                                Sales_Flash_Report_2024.pdf generated
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button disabled={!isDone} className="gap-2" onClick={() => onOpenChange(false)}>
                        <Icons.Download className="w-4 h-4" />
                        Download PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const Sales = () => {
    const { activeModule, setActiveModule } = useUIStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // Synchronize Tab with Global State
    const currentTab = ['quotations', 'orders', 'subscriptions'].includes(activeModule)
        ? activeModule
        : 'quotations';

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Icons.BarChart3 className="w-7 h-7 text-primary" />
                        Sales Management
                    </h1>
                    <p className="text-muted-foreground text-sm">Track your pipeline, revenue, and subscriptions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setIsExportModalOpen(true)}>
                        <Icons.Download className="w-4 h-4" />
                        Export
                    </Button>

                    <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setIsCreateModalOpen(true)}>
                        <Icons.Plus className="w-4 h-4" />
                        New Quotation
                    </Button>

                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Quotation</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to generate a professional quotation for your client.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="customer" className="text-right">Customer</Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="meta">Meta Platforms</SelectItem>
                                            <SelectItem value="tesla">Tesla Inc</SelectItem>
                                            <SelectItem value="apple">Apple Inc</SelectItem>
                                            <SelectItem value="google">Google</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
                                    <Input id="amount" placeholder="0.00" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="validity" className="text-right">Validity</Label>
                                    <Input id="validity" type="date" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="notes" className="text-right">Notes</Label>
                                    <Input id="notes" placeholder="Optional notes..." className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsCreateModalOpen(false)}>Generate Quotation</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Monthly Revenue', value: '₹12.4L', change: '+15%', icon: 'Banknote', color: 'indigo' },
                    { label: 'Active Quotations', value: '24', change: '+5', icon: 'FileText', color: 'blue' },
                    { label: 'Sales Target', value: '85%', change: '+3%', icon: 'Target', color: 'emerald' },
                    { label: 'Subscriptions', value: '156', change: '+12', icon: 'RefreshCw', color: 'amber' },
                ].map((stat, index) => {
                    const IconComponent = (Icons as any)[stat.icon];
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-5 rounded-2xl bg-card border hover:shadow-md transition-shadow shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center',
                                    stat.color === 'blue' && 'bg-blue-500/10 text-blue-500',
                                    stat.color === 'indigo' && 'bg-indigo-500/10 text-indigo-500',
                                    stat.color === 'emerald' && 'bg-emerald-500/10 text-emerald-500',
                                    stat.color === 'amber' && 'bg-amber-500/10 text-amber-500',
                                )}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <Badge variant="secondary" className="text-xs text-emerald-600 bg-emerald-500/5 border-emerald-500/10">
                                    {stat.change}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold mt-4">{stat.value}</p>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
                <TabsList className="bg-muted/50 p-1 w-full md:w-fit overflow-x-auto shrink-0">
                    <TabsTrigger value="quotations" className="gap-2 px-6">Quotations</TabsTrigger>
                    <TabsTrigger value="orders" className="gap-2 px-6">Orders</TabsTrigger>
                    <TabsTrigger value="subscriptions" className="gap-2 px-6">Subscriptions</TabsTrigger>
                </TabsList>

                <TabsContent value="quotations" className="pt-6 flex-1 min-h-0">
                    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="font-bold">Quotation ID</TableHead>
                                    <TableHead className="font-bold">Customer</TableHead>
                                    <TableHead className="font-bold">Date</TableHead>
                                    <TableHead className="font-bold">Amount</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotations.map((q) => (
                                    <TableRow key={q.id}>
                                        <TableCell className="font-medium text-primary">{q.id}</TableCell>
                                        <TableCell className="font-medium">{q.customer}</TableCell>
                                        <TableCell className="text-muted-foreground">{q.date}</TableCell>
                                        <TableCell className="font-bold">{q.amount}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider",
                                                    q.status === 'Accepted' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                                                    q.status === 'Pending' && 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                                                    q.status === 'Expired' && 'bg-red-500/10 text-red-600 border-red-500/20'
                                                )}
                                            >
                                                {q.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="hover:bg-primary/5 hover:text-primary"><Icons.MoreVertical className="w-4 h-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="pt-6 flex-1 min-h-0">
                    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="font-bold">Order ID</TableHead>
                                    <TableHead className="font-bold">Customer</TableHead>
                                    <TableHead className="font-bold">Date</TableHead>
                                    <TableHead className="font-bold">Amount</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold">Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((o) => (
                                    <TableRow key={o.id}>
                                        <TableCell className="font-medium text-emerald-600">{o.id}</TableCell>
                                        <TableCell className="font-medium">{o.customer}</TableCell>
                                        <TableCell className="text-muted-foreground">{o.date}</TableCell>
                                        <TableCell className="font-bold">{o.amount}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider",
                                                o.status === 'Delivered' && 'text-emerald-600 bg-emerald-50 border-emerald-200',
                                                o.status === 'Shipped' && 'text-blue-600 bg-blue-50 border-blue-200',
                                                o.status === 'Processing' && 'text-amber-600 bg-amber-50 border-amber-200'
                                            )}>
                                                {o.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">{o.type}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="subscriptions" className="pt-6 flex-1 min-h-0">
                    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="font-bold">Customer</TableHead>
                                    <TableHead className="font-bold">Plan</TableHead>
                                    <TableHead className="font-bold">Amount</TableHead>
                                    <TableHead className="font-bold">Next Renewal</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-bold">{s.customer}</TableCell>
                                        <TableCell className="font-medium">{s.plan}</TableCell>
                                        <TableCell className="font-bold text-primary">{s.value}</TableCell>
                                        <TableCell className="text-muted-foreground">{s.renewal}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider",
                                                    s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                )}
                                            >
                                                {s.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
            <ExportModal isOpen={isExportModalOpen} onOpenChange={setIsExportModalOpen} />
        </motion.div>
    );
};


