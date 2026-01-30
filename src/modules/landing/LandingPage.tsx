import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { currentUser } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';

const FeatureCard = ({ icon: Icon, title, description, delay, items }: { icon: any, title: string, description: string, delay: number, items: string[] }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay, duration: 0.6, ease: "circOut" }}
        className="p-8 rounded-[2rem] bg-card border hover:border-primary/50 transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <Icon className="w-7 h-7 text-primary" />
        </div>

        <h3 className="text-2xl font-black mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">{description}</p>

        <ul className="space-y-3">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {item}
                </li>
            ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-dashed flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Module Ready</span>
            <Icons.ArrowUpRight className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
        </div>
    </motion.div>
);


export const LandingPage = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const { login } = useAuthStore();

    const [email, setEmail] = useState('admin@giggleorg.com');
    const [password, setPassword] = useState('password123');
    const [isLoading, setIsLoading] = useState(false);

    const { scrollYProgress } = useScroll();
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            login(currentUser);
            setIsLoading(false);
        }, 1500);
    };

    const features = [
        {
            icon: Icons.Target,
            title: 'Intelligent CRM',
            description: 'Not just lead management, but lead mastery with predictive scoring.',
            items: ['AI Lead Qualification', 'Visual Pipeline Management', 'Win Probability Scoring'],
            delay: 0.1
        },
        {
            icon: Icons.ShieldCheck,
            title: 'Automated HRMS',
            description: 'Employee lifecyle management from onboarding to retirement.',
            items: ['Smart Attendance Tracking', 'Leave Workflow Automation', 'Recruitment Pipeline'],
            delay: 0.2
        },
        {
            icon: Icons.Zap,
            title: 'Smart Payroll',
            description: 'One-click salary processing with 100% compliance guaranteed.',
            items: ['Automated Tax Calculations', 'Multi-format Payslips', 'Performance Incentives'],
            delay: 0.3
        },
        {
            icon: Icons.BarChart3,
            title: 'AI Analytics',
            description: 'Bussiness intelligence that tells you what will happen tomorrow.',
            items: ['Revenue Forecasting', 'Employee ROI Analysis', 'Anomaly Detection'],
            delay: 0.4
        },
        {
            icon: Icons.LayoutGrid,
            title: 'Resource ERP',
            description: 'Inventory, assets, and project management in one unified view.',
            items: ['Stock Optimization', 'Asset Lifetime Tracking', 'Project Resource Planning'],
            delay: 0.5
        },
        {
            icon: Icons.Sparkles,
            title: 'GiggleAI Engine',
            description: 'The core intelligence driving every decision in the platform.',
            items: ['Natural Language Search', 'Auto-generated Reports', 'Email Writing Assistant'],
            delay: 0.6
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans antialiased">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.6 }}
                            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20"
                        >
                            <Icons.Orbit className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-2xl font-black tracking-tighter">GIGGLE<span className="text-primary italic">ORG</span></span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Platform</a>
                        <a href="#ecosystem" className="hover:text-primary transition-colors">Ecosystem</a>
                        <a href="#vision" className="hover:text-primary transition-colors">Vision</a>
                        <a href="#enterprise" className="hover:text-primary transition-colors">Enterprise</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-xs font-black uppercase tracking-widest" onClick={() => setIsLoginOpen(true)}>Login</Button>
                        <Button className="rounded-full px-8 shadow-glow text-xs font-black uppercase tracking-widest" onClick={() => setIsRegisterOpen(true)}>Get Started</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                        >
                            <Badge variant="outline" className="mb-8 py-2 px-6 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest animate-pulse">
                                <Icons.Cpu className="w-4 h-4 mr-2" />
                                Powered by GiggleAI 4.0
                            </Badge>
                            <h1 className="text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.95] inline-block">
                                The Universal OS for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600">Modern Teams.</span>
                            </h1>
                            <p className="max-w-2xl mx-auto text-muted-foreground text-xl mb-12 font-medium leading-relaxed italic opacity-80">
                                GiggleOrg is more than an ERP. It's an intelligent ecosystem that connects your people, projects, and profits with predictive AI.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button size="lg" className="h-16 px-12 text-sm font-black uppercase tracking-widest rounded-full shadow-glow group" onClick={() => setIsRegisterOpen(true)}>
                                    Deploy Now
                                    <Icons.ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-16 px-12 text-sm font-black uppercase tracking-widest rounded-full border-2">
                                    <Icons.PlayCircle className="mr-3 w-5 h-5 text-primary" />
                                    Watch Vision
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Dashboard Teaser */}
                    <motion.div
                        style={{ scale, rotate }}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1, ease: "circOut" }}
                        className="relative max-w-6xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-primary/30 blur-[120px] -z-10 rounded-full scale-90" />
                        <div className="p-1 rounded-[3rem] bg-gradient-to-tr from-white/20 via-white/5 to-transparent border border-white/20 backdrop-blur-md shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                            <div className="overflow-hidden rounded-[2.8rem] border border-white/10">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop"
                                    alt="Platform Preview"
                                    className="w-full transform hover:scale-105 transition-transform duration-[2s]"
                                />
                            </div>
                        </div>

                        {/* Floating Stats Card */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-1/2 p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border backdrop-blur-lg shadow-2xl hidden xl:block"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Icons.TrendingUp className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Profit Boost</p>
                                    <p className="text-xl font-bold">+24.8%</p>
                                </div>
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                                    +12
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="py-20 border-y bg-card/30 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60 mb-12">Orchestrating Growth for Global Innovators</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale group hover:grayscale-0 transition-all">
                        {['SpaceX', 'Tesla', 'Apple', 'NVIDIA', 'Adobe', 'Stripe'].map((brand) => (
                            <span key={brand} className="text-2xl font-black italic tracking-tighter hover:text-primary transition-colors cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Detail Section */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
                        <div className="max-w-2xll">
                            <Badge className="mb-4 bg-primary/10 text-primary border-none text-[10px] uppercase font-black">Modules Ecosystem</Badge>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Everything you need, <br /> all in <span className="text-primary italic">one place.</span></h2>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-sm font-medium leading-relaxed italic">
                            Stop switching tabs. GiggleOrg centralizes every department workflow into a single source of truth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW UNIQUE SECTION: The Neural Mesh */}
            <section id="ecosystem" className="py-32 px-6 relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 text-[10px] uppercase font-black">Interconnected intelligence</Badge>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">The Neural Mesh</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                            Unlike traditional ERPs that operate in siloes, GiggleOrg uses a central "Neural Mesh"
                            to heartbeat data between departments in real-time.
                        </p>
                    </div>

                    <div className="relative h-[600px] flex items-center justify-center">
                        {/* Central AI Hub */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-48 h-48 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center backdrop-blur-xl z-20 shadow-[0_0_100px_rgba(var(--primary-rgb),0.5)]"
                        >
                            <Icons.Zap className="w-16 h-16 text-primary animate-pulse" />
                        </motion.div>

                        {/* Orbiting Department Nodes */}
                        {[
                            { label: 'Sales', icon: Icons.Target, pos: '0%', delay: 0 },
                            { label: 'Talent', icon: Icons.Users, pos: '60deg', delay: 0.2 },
                            { label: 'Finance', icon: Icons.Wallet, pos: '120deg', delay: 0.4 },
                            { label: 'Sourcing', icon: Icons.Package, pos: '180deg', delay: 0.6 },
                            { label: 'Ops', icon: Icons.Activity, pos: '240deg', delay: 0.8 },
                            { label: 'Legal', icon: Icons.Shield, pos: '300deg', delay: 1.0 }
                        ].map((node, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: node.delay }}
                                className="absolute"
                                style={{
                                    transform: `rotate(${node.pos}) translateY(-220px) rotate(-${node.pos})`
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center gap-3 group cursor-default"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <node.icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest">{node.label}</span>

                                    {/* Connection Line to Center */}
                                    <div className="absolute top-1/2 left-1/2 w-[220px] h-[2px] bg-gradient-to-r from-primary/0 to-primary/40 -translate-x-full origin-right -z-10 group-hover:from-primary/50 transition-all" />
                                </motion.div>
                            </motion.div>
                        ))}

                        {/* Background Pulsing Rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: [0, 0.2, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                                    className="absolute w-[440px] h-[440px] border border-primary/20 rounded-full"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
                        <div className="space-y-4 text-center px-4">
                            <h4 className="text-xl font-bold">Zero Latency Sync</h4>
                            <p className="text-slate-400 text-sm">Every lead conversion updates finance projections instantly across your entire org.</p>
                        </div>
                        <div className="space-y-4 text-center px-4">
                            <h4 className="text-xl font-bold">Unified Data Logic</h4>
                            <p className="text-slate-400 text-sm">No more duplicate entries. One customer record shared between Sales, Support, and Billing.</p>
                        </div>
                        <div className="space-y-4 text-center px-4">
                            <h4 className="text-xl font-bold">Predictive Feedback</h4>
                            <p className="text-slate-400 text-sm">AI monitors cross-department bottlenecks and suggests workflow pivots before they hit ROI.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive "Vision" Section */}
            <section id="vision" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Experience <br /> Autonomous <br /><span className="text-primary italic underline decoration-wavy underline-offset-8">Operations.</span></h2>
                            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
                                We don't just process data. We analyze, predict, and suggest. Our AI engine scales with you, becoming more precise as your organization grows.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { icon: Icons.Target, text: "Automated Lead Routing & Conversion" },
                                    { icon: Icons.Activity, text: "Real-time Productivity Heatmaps" },
                                    { icon: Icons.Sparkles, text: "Generative Action Reports" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group cursor-default">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                                            <item.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-bold text-slate-200">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                animate={{ y: [0, -30, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=1200&fit=crop"
                                    alt="Teams collaborating"
                                    className="rounded-[3rem] shadow-[0_0_100px_rgba(var(--primary-rgb),0.3)] border border-white/20"
                                />
                            </motion.div>
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary rounded-full blur-[100px] opacity-30" />
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="enterprise" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-16 rounded-[4rem] bg-gradient-to-br from-slate-900 to-black text-center relative overflow-hidden text-white"
                    >
                        <div className="absolute inset-0 bg-primary/10 blur-[120px]" />
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic">Ready to transform?</h2>
                            <p className="text-xl text-slate-400 max-w-xl mx-auto font-medium">
                                Join 5,000+ companies already building their future on GIGGLEORG.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                <Button size="lg" className="h-16 px-12 text-sm font-black uppercase tracking-widest rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_50px_rgba(255,255,255,0.2)]" onClick={() => setIsRegisterOpen(true)}>
                                    Start Free Trial
                                </Button>
                                <Button variant="outline" size="lg" className="h-16 px-12 text-sm font-black uppercase tracking-widest rounded-full border-white/20 hover:bg-white/5">
                                    Book Executive Demo
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Login Modal */}
            <AnimatePresence>
                {isLoginOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsLoginOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md p-10 rounded-[3rem] bg-card border shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                            <div className="text-center mb-10">
                                <motion.div
                                    whileHover={{ rotate: 90 }}
                                    className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow"
                                >
                                    <Icons.Orbit className="w-8 h-8 text-white" />
                                </motion.div>
                                <h2 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h2>
                                <p className="text-muted-foreground text-sm font-medium italic">Your intelligent organization awaits.</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Work Email</label>
                                    <div className="relative">
                                        <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="admin@giggleorg.com"
                                            className="pl-12 h-14 rounded-2xl bg-muted/50 border-muted focus:ring-primary/20"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Auth Phrase</label>
                                        <button type="button" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Recovery</button>
                                    </div>
                                    <div className="relative">
                                        <Icons.ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-12 h-14 rounded-2xl bg-muted/50 border-muted focus:ring-primary/20"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-14 rounded-2xl shadow-glow gap-3 text-sm font-black uppercase tracking-[0.2em]" disabled={isLoading}>
                                    {isLoading ? (
                                        <Icons.Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Icons.Rocket className="w-5 h-5" />
                                            Enter Workspace
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-10 pt-6 border-t text-center">
                                <p className="text-sm text-muted-foreground font-medium">
                                    New to the ecosystem?{' '}
                                    <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="font-black text-primary hover:underline underline-offset-4">
                                        Create Galaxy
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Register Modal */}
            <AnimatePresence>
                {isRegisterOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsRegisterOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md p-10 rounded-[3rem] bg-card border shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />

                            <div className="text-center mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-glow shadow-indigo-500/30">
                                    <Icons.Rocket className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight mb-2">Initialize Hub</h2>
                                <p className="text-muted-foreground text-sm font-medium italic">Step into the future of operations.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Global First</label>
                                        <Input placeholder="John" className="h-14 rounded-2xl bg-muted/50 border-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Universal Last</label>
                                        <Input placeholder="Doe" className="h-14 rounded-2xl bg-muted/50 border-muted" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Org Domain</label>
                                    <Input type="email" placeholder="john@giggleorg.com" className="h-14 rounded-2xl bg-muted/50 border-muted" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Organization Alias</label>
                                    <Input placeholder="Giggle Systems Inc" className="h-14 rounded-2xl bg-muted/50 border-muted" />
                                </div>

                                <Button className="w-full h-16 rounded-2xl shadow-glow bg-indigo-600 hover:bg-indigo-700 mt-6 text-sm font-black uppercase tracking-[0.2em]">
                                    Provision Workspace
                                </Button>
                            </div>

                            <div className="mt-10 pt-6 border-t text-center">
                                <p className="text-sm text-muted-foreground font-medium">
                                    Already orchestrated?{' '}
                                    <button onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} className="font-black text-indigo-600 hover:underline underline-offset-4">
                                        Login to existing
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="py-24 px-6 border-t bg-card/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2 space-y-8">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Icons.Orbit className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-3xl font-black tracking-tighter">GIGGLE<span className="text-primary italic">ORG</span></span>
                            </div>
                            <p className="text-muted-foreground max-w-sm text-lg font-medium leading-relaxed italic opacity-80">
                                Pioneering the future of work with zero-latency operations and unified intelligence.
                            </p>
                            <div className="flex gap-5">
                                {[Icons.Twitter, Icons.Linkedin, Icons.Github, Icons.Youtube, Icons.MessageSquare].map((Icon, idx) => (
                                    <button key={idx} className="w-12 h-12 rounded-2xl border flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-110">
                                        <Icon className="w-5 h-5 text-muted-foreground hover:text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-black mb-8 italic uppercase tracking-[0.2em] text-xs text-primary">Core Modules</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                                <li><a href="#" className="hover:text-primary transition-colors">Neural CRM</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">HR Lifecycle</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">FinOps Hub</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Asset Galaxy</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black mb-8 italic uppercase tracking-[0.2em] text-xs text-primary">Ecosystem</h4>
                            <ul className="space-y-4 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Status Center</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Security Wall</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Auth Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                        <p>© 2024 GIGGLEORG TECHNOLOGIES. ALL SYSTEMS NOMINAL.</p>
                        <div className="flex gap-10">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> ISO 27001</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> SOC-2 TYPE II</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
