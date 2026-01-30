import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/store/uiStore';
import { Progress } from '@/components/ui/progress';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Dummy Data for Inventory
const products = [
    { id: 'PRD-001', name: 'MacBook Pro M3', category: 'Electronics', stock: 45, maxStock: 100, price: '₹1,50,000', status: 'In Stock' },
    { id: 'PRD-002', name: 'Dell UltraSharp', category: 'Peripherals', stock: 8, maxStock: 50, price: '₹45,000', status: 'Low Stock' },
    { id: 'PRD-003', name: 'iPhone 15 Pro', category: 'Mobile', stock: 120, maxStock: 200, price: '₹1,20,000', status: 'In Stock' },
    { id: 'PRD-004', name: 'Magic Mouse', category: 'Peripherals', stock: 0, maxStock: 40, price: '₹8,500', status: 'Out of Stock' },
    { id: 'PRD-005', name: 'Sony WH-1000XM5', category: 'Audio', stock: 15, maxStock: 60, price: '₹28,000', status: 'Low Stock' },
    { id: 'PRD-006', name: 'Keychron Q1', category: 'Peripherals', stock: 25, maxStock: 50, price: '₹15,000', status: 'In Stock' },
];

const purchaseOrders = [
    { id: 'PO-2024-051', vendor: 'Apple Distribution', date: '2024-01-25', items: 12, total: '₹18,50,000', progress: 75, status: 'Shipping' },
    { id: 'PO-2024-052', vendor: 'Dell Global', date: '2024-01-28', items: 5, total: '₹2,25,000', progress: 25, status: 'Ordered' },
    { id: 'PO-2024-053', vendor: 'Logitech Hub', date: '2024-01-30', items: 50, total: '₹4,50,000', progress: 100, status: 'Received' },
];

const stockMovements = [
    { id: 'MOV-001', type: 'inbound', product: 'MacBook Pro M3', qty: '+10', from: 'Primary Vendor', to: 'Main Warehouse', time: '2 hours ago' },
    { id: 'MOV-002', type: 'outbound', product: 'iPhone 15 Pro', qty: '-2', from: 'Main Warehouse', to: 'Retail Store A', time: '4 hours ago' },
    { id: 'MOV-003', type: 'internal', product: 'Magic Mouse', qty: '15', from: 'Warehouse B', to: 'Main Warehouse', time: 'Yesterday' },
    { id: 'MOV-004', type: 'inbound', product: 'Sony Headphones', qty: '+25', from: 'International Shipping', to: 'Warehouse B', time: 'Yesterday' },
];

const stockAudits = [
    { id: 'AUD-001', date: '2024-01-29', product: 'iPhone 15 Pro', systemQty: 122, physicalQty: 120, variance: -2, auditor: 'Admin' },
    { id: 'AUD-002', date: '2024-01-28', product: 'MacBook Pro M3', systemQty: 35, physicalQty: 45, variance: 10, auditor: 'Store Manager' },
    { id: 'AUD-003', date: '2024-01-25', product: 'Magic Mouse', systemQty: 0, physicalQty: 0, variance: 0, auditor: 'Admin' },
];

export const Inventory = () => {
    const { activeModule, setActiveModule } = useUIStore();
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isAuditOpen, setIsAuditOpen] = useState(false);

    const currentTab = ['products', 'purchase', 'stock'].includes(activeModule)
        ? activeModule
        : 'products';

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Icons.Warehouse className="w-7 h-7 text-primary" />
                        Inventory & Warehouse
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage products, stock levels, and supply chain</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Icons.BarChart2 className="w-4 h-4" />
                                Stock Audit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                            <DialogHeader>
                                <DialogTitle>Recent Stock Audits</DialogTitle>
                                <DialogDescription>Review discrepancies between system records and physical stock.</DialogDescription>
                            </DialogHeader>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">System</TableHead>
                                        <TableHead className="text-right">Physical</TableHead>
                                        <TableHead className="text-right">Variance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stockAudits.map((audit) => (
                                        <TableRow key={audit.id}>
                                            <TableCell className="text-xs font-medium">{audit.date}</TableCell>
                                            <TableCell>{audit.product}</TableCell>
                                            <TableCell className="text-right">{audit.systemQty}</TableCell>
                                            <TableCell className="text-right">{audit.physicalQty}</TableCell>
                                            <TableCell className={cn(
                                                "text-right font-bold font-mono",
                                                audit.variance > 0 ? "text-emerald-500" : audit.variance < 0 ? "text-red-500" : ""
                                            )}>
                                                {audit.variance > 0 ? `+${audit.variance}` : audit.variance}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                                <Icons.Plus className="w-4 h-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                                <DialogDescription>Enter the product details to add it to your inventory.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" placeholder="MacBook M3..." className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">Category</Label>
                                    <Select defaultValue="electronics">
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="peripherals">Peripherals</SelectItem>
                                            <SelectItem value="mobile">Mobile</SelectItem>
                                            <SelectItem value="audio">Audio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="stock" className="text-right">Initial Stock</Label>
                                    <Input id="stock" type="number" placeholder="50" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="price" className="text-right">Base Price</Label>
                                    <div className="col-span-3 relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</div>
                                        <Input id="price" type="number" className="pl-7" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
                                <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddProductOpen(false)}>Create Product</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: '1,280', change: '+24', icon: 'Box', color: 'blue' },
                    { label: 'Low Stock Alerts', value: '12', change: '-2', icon: 'AlertTriangle', color: 'amber' },
                    { label: 'Warehouse Capacity', value: '78%', change: 'Normal', icon: 'Warehouse', color: 'indigo' },
                    { label: 'Stock Valuation', value: '₹1.2Cr', change: '+₹5.4L', icon: 'Calculator', color: 'emerald' },
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
                                    stat.color === 'blue' && 'bg-blue-500/10 text-blue-500',
                                    stat.color === 'amber' && 'bg-amber-500/10 text-amber-500',
                                    stat.color === 'indigo' && 'bg-indigo-500/10 text-indigo-500',
                                    stat.color === 'emerald' && 'bg-emerald-500/10 text-emerald-500',
                                )}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <Badge variant="secondary" className={cn(
                                    "text-xs",
                                    stat.label === 'Low Stock Alerts' && "text-red-500 bg-red-50 border-red-200"
                                )}>
                                    {stat.change}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold mt-4">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="bg-muted/50 p-1 w-full md:w-fit overflow-x-auto">
                    <TabsTrigger value="products" className="gap-2 px-6">
                        <Icons.Box className="w-4 h-4" />
                        Products
                    </TabsTrigger>
                    <TabsTrigger value="purchase" className="gap-2 px-6">
                        <Icons.ShoppingBag className="w-4 h-4" />
                        Purchase Orders
                    </TabsTrigger>
                    <TabsTrigger value="stock" className="gap-2 px-6">
                        <Icons.Move className="w-4 h-4" />
                        Stock Movements
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 rounded-xl border bg-card hover:border-primary/30 transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                            {product.category}
                                        </Badge>
                                        <h4 className="font-semibold text-lg">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground">{product.id}</p>
                                    </div>
                                    <Badge variant="outline" className={cn(
                                        "px-2 py-0.5 rounded-full text-[11px]",
                                        product.status === 'In Stock' && "bg-emerald-50 text-emerald-600 border-emerald-200",
                                        product.status === 'Low Stock' && "bg-amber-50 text-amber-600 border-amber-200",
                                        product.status === 'Out of Stock' && "bg-red-50 text-red-600 border-red-200"
                                    )}>
                                        {product.status}
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Stock Level</span>
                                        <span className="font-medium">{product.stock} / {product.maxStock}</span>
                                    </div>
                                    <Progress value={(product.stock / product.maxStock) * 100} className={cn(
                                        "h-1.5",
                                        product.stock < product.maxStock * 0.2 ? "[&>div]:bg-red-500" :
                                            product.stock < product.maxStock * 0.5 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"
                                    )} />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xl font-bold">{product.price}</span>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <Icons.MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="purchase" className="pt-6">
                    <div className="space-y-4">
                        {purchaseOrders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col md:flex-row items-start md:items-center gap-6 p-5 rounded-2xl border bg-card hover:shadow-md transition-all"
                            >
                                <div className="flex gap-4 items-center min-w-[200px]">
                                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                                        {order.vendor[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{order.id}</h4>
                                        <p className="text-sm text-muted-foreground">{order.vendor}</p>
                                    </div>
                                </div>

                                <div className="flex-1 w-full space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className={order.progress >= 25 ? "text-primary" : "text-muted-foreground"}>Ordered</span>
                                        <span className={order.progress >= 50 ? "text-primary" : "text-muted-foreground"}>Packed</span>
                                        <span className={order.progress >= 75 ? "text-primary" : "text-muted-foreground"}>Shipping</span>
                                        <span className={order.progress >= 100 ? "text-primary" : "text-muted-foreground"}>Received</span>
                                    </div>
                                    <Progress value={order.progress} className="h-2" />
                                </div>

                                <div className="flex items-center gap-8 min-w-[250px] justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Items: {order.items}</p>
                                        <p className="font-bold">{order.total}</p>
                                    </div>
                                    <Button variant="outline" className="h-9">Track</Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="stock" className="pt-6 px-4">
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        {stockMovements.map((move, idx) => (
                            <motion.div
                                key={move.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    {move.type === 'inbound' && <Icons.TrendingUp className="w-4 h-4 text-emerald-500" />}
                                    {move.type === 'outbound' && <Icons.TrendingDown className="w-4 h-4 text-red-500" />}
                                    {move.type === 'internal' && <Icons.RefreshCcw className="w-4 h-4 text-blue-500" />}
                                </div>

                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card group-hover:border-primary/20 transition-all">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-foreground">{move.product}</div>
                                        <time className="font-medium text-xs text-indigo-500">{move.time}</time>
                                    </div>
                                    <div className="text-muted-foreground text-sm mb-2">
                                        Move <span className="font-bold text-foreground px-1">{move.qty}</span> units from <span className="italic">{move.from}</span> to <span className="italic">{move.to}</span>
                                    </div>
                                    <Badge variant="outline" className="capitalize text-[10px] font-semibold">
                                        {move.type}
                                    </Badge>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};


