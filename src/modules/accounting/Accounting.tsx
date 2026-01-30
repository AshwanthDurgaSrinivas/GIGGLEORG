import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/store/uiStore';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dummy Data
const invoices = [
    { id: 'INV-001', client: 'Meta Platforms', date: '2024-01-15', amount: '₹12,40,000', status: 'Paid', due: 'Paid' },
    { id: 'INV-002', client: 'Tesla Inc', date: '2024-01-18', amount: '₹8,50,000', status: 'Overdue', due: '2024-01-25' },
    { id: 'INV-003', client: 'SpaceX', date: '2024-01-20', amount: '₹22,00,000', status: 'Pending', due: '2024-02-15' },
    { id: 'INV-004', client: 'Apple Inc', date: '2024-01-25', amount: '₹15,00,000', status: 'Draft', due: 'N/A' },
];

const payments = [
    { id: 'PAY-7712', from: 'Meta Platforms', date: '2024-01-28', amount: '₹12,40,000', method: 'Bank Transfer', status: 'Completed' },
    { id: 'PAY-7713', from: 'Amazon', date: '2024-01-29', amount: '₹5,20,000', method: 'UPI', status: 'Completed' },
    { id: 'PAY-7714', from: 'Netflix', date: '2024-01-30', amount: '₹2,50,000', method: 'Credit Card', status: 'Processing' },
];

const expenses = [
    { id: 'EXP-901', category: 'Cloud Infrastructure', date: '2024-01-10', amount: '₹2,40,000', vendor: 'AWS', status: 'Approved' },
    { id: 'EXP-902', category: 'Marketing', date: '2024-01-12', amount: '₹1,20,000', vendor: 'Google Ads', status: 'Approved' },
    { id: 'EXP-903', category: 'Office Rent', date: '2024-01-01', amount: '₹4,50,000', vendor: 'DLF Cyberhub', status: 'Pending' },
    { id: 'EXP-904', category: 'Team Outing', date: '2024-01-25', amount: '₹45,000', vendor: 'Team Event', status: 'Draft' },
];

export const Accounting = () => {
    const { activeModule, setActiveModule } = useUIStore();
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

    // Synchronize Tab with Global State
    const currentTab = ['invoices', 'payments', 'expenses'].includes(activeModule)
        ? activeModule
        : 'invoices';

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Icons.Calculator className="w-6 h-6 text-emerald-600" />
                        </div>
                        Accounting & Invoicing
                    </h1>
                    <p className="text-muted-foreground text-sm">Monitor your financial health and cash flow</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Icons.Download className="w-4 h-4" />
                        Export Report
                    </Button>

                    <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                                <Icons.Plus className="w-4 h-4" />
                                New Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Generate New Invoice</DialogTitle>
                                <DialogDescription>
                                    Create and send a professional tax invoice to your client.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="client" className="text-right">Client</Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="meta">Meta Platforms</SelectItem>
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
                                    <Label htmlFor="due" className="text-right">Due Date</Label>
                                    <Input id="due" type="date" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>Cancel</Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsInvoiceOpen(false)}>Create Invoice</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Receivables', value: '₹42.8L', change: '+₹2.4L', icon: 'ArrowUpRight', color: 'emerald' },
                    { label: 'Total Payables', value: '₹12.2L', change: '-₹1.2L', icon: 'ArrowDownRight', color: 'red' },
                    { label: 'Cash on Hand', value: '₹85.5L', change: '+8%', icon: 'Wallet', color: 'blue' },
                    { label: 'Net Profit', value: '₹18.4L', change: '+22%', icon: 'TrendingUp', color: 'indigo' },
                ].map((stat, index) => {
                    const IconComponent = (Icons as any)[stat.icon];
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-5 rounded-2xl bg-card border hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center',
                                    stat.color === 'emerald' && 'bg-emerald-500/10 text-emerald-500',
                                    stat.color === 'red' && 'bg-red-500/10 text-red-500',
                                    stat.color === 'blue' && 'bg-blue-500/10 text-blue-500',
                                    stat.color === 'indigo' && 'bg-indigo-500/10 text-indigo-500',
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

            {/* Tabs Section */}
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="bg-muted/50 p-1 w-fit">
                    <TabsTrigger value="invoices" className="gap-2 px-6">
                        <Icons.FileText className="w-4 h-4" />
                        Invoices
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="gap-2 px-6">
                        <Icons.CreditCard className="w-4 h-4" />
                        Payments
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="gap-2 px-6">
                        <Icons.Receipt className="w-4 h-4" />
                        Expenses
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="invoices" className="pt-6">
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-semibold">{inv.id}</TableCell>
                                        <TableCell>{inv.client}</TableCell>
                                        <TableCell>{inv.date}</TableCell>
                                        <TableCell>{inv.amount}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    inv.status === 'Paid' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                                                    inv.status === 'Overdue' && 'bg-red-500/10 text-red-600 border-red-500/20',
                                                    inv.status === 'Pending' && 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                                                    inv.status === 'Draft' && 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                                                )}
                                            >
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{inv.due}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="payments" className="pt-6">
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-semibold">{p.id}</TableCell>
                                        <TableCell>{p.from}</TableCell>
                                        <TableCell>{p.date}</TableCell>
                                        <TableCell>{p.amount}</TableCell>
                                        <TableCell>{p.method}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                )}
                                            >
                                                {p.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="expenses" className="pt-6">
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Voucher #</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell className="font-semibold">{e.id}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{e.category}</Badge>
                                        </TableCell>
                                        <TableCell>{e.date}</TableCell>
                                        <TableCell>{e.amount}</TableCell>
                                        <TableCell>{e.vendor}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    e.status === 'Approved' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                                                    e.status === 'Draft' && 'bg-slate-500/10 text-slate-600 border-slate-500/20',
                                                    e.status === 'Pending' && 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                )}
                                            >
                                                {e.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

