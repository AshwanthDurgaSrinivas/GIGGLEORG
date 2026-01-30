import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/store/uiStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

// Extended Dummy Data for Interactivity
const chats = [
    {
        id: 'C1',
        sender: 'John Doe',
        unread: 2,
        status: 'online',
        messages: [
            { id: 'm1', text: 'Hey, did you check the invoice Q1?', time: '10:45 AM', type: 'incoming' },
            { id: 'm2', text: 'Looking into it right now.', time: '10:46 AM', type: 'outgoing' },
            { id: 'm3', text: 'Great, thanks!', time: '10:47 AM', type: 'incoming' },
        ]
    },
    {
        id: 'C2',
        sender: 'Sales Group',
        unread: 0,
        status: 'away',
        messages: [
            { id: 's1', text: 'New lead assigned to @Sam', time: '09:30 AM', type: 'incoming' },
            { id: 's2', text: 'I am on it!', time: '09:35 AM', type: 'incoming' },
            { id: 's3', text: 'Let me know if you need help guys.', time: '09:40 AM', type: 'outgoing' },
        ]
    },
    {
        id: 'C3',
        sender: 'Sarah Smith',
        unread: 0,
        status: 'online',
        messages: [
            { id: 'sa1', text: 'Payment received for order #8821', time: 'Yesterday', type: 'incoming' },
            { id: 'sa2', text: 'Perfect, shipping is scheduled.', time: 'Yesterday', type: 'outgoing' },
        ]
    },
];

const emails = [
    {
        id: 'E1',
        subject: 'Monthly Performance Report',
        sender: 'HR Department',
        senderEmail: 'hr@nexuserp.com',
        snippet: 'Please find attached the performance metrics for...',
        content: 'Dear Team,\n\nPlease find the attached performance report for the last month. We have seen a 15% increase in productivity across all modules.\n\nBest regards,\nHR Department',
        date: '10:00 AM',
        read: false
    },
    {
        id: 'E2',
        subject: 'Server Maintenance Notice',
        sender: 'DevOps Team',
        senderEmail: 'devops@nexuserp.com',
        snippet: 'Scheduled maintenance will occur this weekend at...',
        content: 'Hi everyone,\n\nWe will be performing scheduled maintenance on the production servers this Sunday from 2 AM to 4 AM UTC. The platform will be offline during this window.\n\nThanks,\nDevOps',
        date: 'Yesterday',
        read: true
    },
];

const smsCampaigns = [
    { id: 'S1', name: 'Summer Sale Broadcast', sent: '15,000', delivered: '98%', failed: '2%', status: 'Completed' },
    { id: 'S2', name: 'OTP Verification Flow', sent: '1,200', delivered: '100%', failed: '0%', status: 'Active' },
    { id: 'S3', name: 'Waitlist Alert', sent: '5,400', delivered: '92%', failed: '8%', status: 'Draft' },
];

// Config Modal Component
const ConfigModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icons.Settings className="w-5 h-5 text-primary" />
                        Communication Settings
                    </DialogTitle>
                    <DialogDescription>Configure API keys and gateway settings for unified messaging.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Icons.MessageCircle className="w-4 h-4" /> WhatsApp Business API
                        </h4>
                        <div className="space-y-2">
                            <Label>Personal Access Token</Label>
                            <Input type="password" placeholder="••••••••••••••••" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number ID</Label>
                            <Input placeholder="1092837465" />
                        </div>
                    </div>
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Icons.Mail className="w-4 h-4" /> Email SMTP (SendGrid/AWS SES)
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>SMTP Host</Label>
                                <Input placeholder="smtp.sendgrid.net" />
                            </div>
                            <div className="space-y-2">
                                <Label>Port</Label>
                                <Input placeholder="587" />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onOpenChange(false)}>Save Configuration</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// New Broadcast Modal
const NewBroadcastModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    const [step, setStep] = useState(1);
    const [channel, setChannel] = useState<'whatsapp' | 'email' | 'sms' | null>(null);
    const [progress, setProgress] = useState(0);

    const handleSend = () => {
        setStep(3);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Multi-Channel Broadcast</DialogTitle>
                    <DialogDescription>Reach hundreds of customers across multiple platforms instantly.</DialogDescription>
                </DialogHeader>
                <div className="py-6 min-h-[300px] flex flex-col justify-center">
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-sm font-medium mb-4">Select Primary Channel</p>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', color: 'text-emerald-500' },
                                    { id: 'email', label: 'Email', icon: 'Mail', color: 'text-blue-500' },
                                    { id: 'sms', label: 'SMS', icon: 'Smartphone', color: 'text-orange-500' }
                                ].map((c) => {
                                    const Icon = (Icons as any)[c.icon];
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => setChannel(c.id as any)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:border-primary",
                                                channel === c.id ? "border-primary bg-primary/5 shadow-inner" : "border-muted"
                                            )}
                                        >
                                            <Icon className={cn("w-6 h-6", c.color)} />
                                            <span className="text-xs font-bold">{c.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <Button disabled={!channel} className="w-full mt-4" onClick={() => setStep(2)}>Next: Compose Message</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Campaign Name</Label>
                                <Input placeholder="e.g. Q1 Sales Blast" />
                            </div>
                            <div className="space-y-2">
                                <Label>Message Content</Label>
                                <textarea
                                    className="w-full h-32 rounded-lg border bg-muted/20 p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Type your message here..."
                                />
                                <p className="text-[10px] text-muted-foreground">Dynamic tags: ({`{name}`}, {`{last_order}`}) are supported.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                                <Button className="flex-1" onClick={handleSend}>Send Broadcast</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            {progress < 100 ? (
                                <>
                                    <div className="relative w-20 h-20 mx-auto">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="w-full h-full rounded-full border-4 border-primary/20 border-t-primary"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icons.Send className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold">Sending to Recipients...</h4>
                                        <Progress value={progress} className="h-2" />
                                        <p className="text-xs text-muted-foreground">{Math.floor(progress * 1.5)}/150 sent</p>
                                    </div>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                                        <Icons.CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Broadcast Successful!</h3>
                                        <p className="text-sm text-muted-foreground">Your message has been queued for 150 recipients.</p>
                                    </div>
                                    <Button className="w-full" onClick={() => onOpenChange(false)}>Done</Button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

// New Message Modal (Internal)
const NewMessageModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>New Communication</DialogTitle>
                    <DialogDescription>Start a new chat or internal discussion.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="relative">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search employees or clients..." className="pl-9" />
                    </div>
                    <ScrollArea className="h-60">
                        <div className="space-y-2">
                            {['Alex Morgan', 'Michael Chen', 'Sarah Smith', 'HR Support'].map((person) => (
                                <button
                                    key={person}
                                    onClick={() => onOpenChange(false)}
                                    className="w-full p-3 rounded-lg hover:bg-muted flex items-center gap-3 transition-colors text-left"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{person.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{person}</p>
                                        <p className="text-[10px] text-muted-foreground">Available</p>
                                    </div>
                                    <Icons.MessageSquare className="w-3 h-3 text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const Communications = () => {
    const { activeModule, setActiveModule } = useUIStore();
    const [selectedChatId, setSelectedChatId] = useState('C1');
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [emailActionMsg, setEmailActionMsg] = useState<string | null>(null);

    // Modal states
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const currentTab = ['whatsapp', 'email', 'sms'].includes(activeModule)
        ? activeModule
        : 'whatsapp';

    const handleTabChange = (value: string) => {
        setActiveModule(value);
    };

    const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];
    const selectedEmail = emails.find(e => e.id === selectedEmailId);

    const showEmailAction = (action: string) => {
        setEmailActionMsg(`Email ${action} successfully`);
        setTimeout(() => setEmailActionMsg(null), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-[calc(100vh-100px)] p-6 space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Icons.MessageSquare className="w-7 h-7 text-emerald-500" />
                        Communications Hub
                    </h1>
                    <p className="text-muted-foreground text-sm">Unified messaging across WhatsApp, Email, and SMS</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setIsConfigOpen(true)}>
                        <Icons.Settings className="w-4 h-4" />
                        Config
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => setIsMessageOpen(true)}>
                        <Icons.MessageCircle className="w-4 h-4" />
                        New Message
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20 bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsBroadcastOpen(true)}>
                        <Icons.Plus className="w-4 h-4" />
                        New Broadcast
                    </Button>
                </div>
            </div>

            {/* Main Tabs UI */}
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
                <TabsList className="bg-muted/50 p-1 w-full md:w-fit overflow-x-auto shrink-0">
                    <TabsTrigger value="whatsapp" className="gap-2 px-6">
                        <Icons.MessageCircle className="w-4 h-4" />
                        WhatsApp
                    </TabsTrigger>
                    <TabsTrigger value="email" className="gap-2 px-6">
                        <Icons.Mail className="w-4 h-4" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="gap-2 px-6">
                        <Icons.Smartphone className="w-4 h-4" />
                        SMS
                    </TabsTrigger>
                </TabsList>

                {/* WhatsApp Chat Interface */}
                <TabsContent value="whatsapp" className="flex-1 mt-6 h-full min-h-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 h-full border rounded-2xl bg-card overflow-hidden">
                        {/* Sidebar */}
                        <div className="col-span-1 border-r flex flex-col bg-muted/5">
                            <div className="p-4 border-b bg-muted/20">
                                <div className="relative">
                                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input placeholder="Search chats..." className="pl-9 h-9 bg-background focus:ring-emerald-500" />
                                </div>
                            </div>
                            <ScrollArea className="flex-1">
                                {chats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setSelectedChatId(chat.id)}
                                        className={cn(
                                            "p-4 border-b hover:bg-muted/30 cursor-pointer flex gap-3 transition-colors group",
                                            selectedChatId === chat.id && "bg-emerald-50/50 dark:bg-emerald-500/10 border-l-4 border-l-emerald-500"
                                        )}
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                    {chat.sender[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {chat.status === 'online' && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className="font-semibold text-sm truncate">{chat.sender}</h4>
                                                <span className="text-[10px] text-muted-foreground">{chat.messages[chat.messages.length - 1].time}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate italic">
                                                {chat.messages[chat.messages.length - 1].type === 'outgoing' && 'You: '}
                                                {chat.messages[chat.messages.length - 1].text}
                                            </p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600">
                                                {chat.unread}
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        {/* Chat Window */}
                        <div className="hidden md:flex flex-col col-span-2 bg-[#f0f2f5] dark:bg-slate-900/40 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedChatId}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="p-3 border-b bg-card flex items-center justify-between shadow-sm z-10">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border-2 border-emerald-500/20">
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">{selectedChat.sender[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold text-sm">{selectedChat.sender}</h4>
                                                <p className={cn(
                                                    "text-[10px] font-medium tracking-wide uppercase",
                                                    selectedChat.status === 'online' ? "text-emerald-500" : "text-muted-foreground"
                                                )}>{selectedChat.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-muted-foreground">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Icons.Video className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Icons.Phone className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Icons.Search className="w-4 h-4" /></Button>
                                        </div>
                                    </div>

                                    <ScrollArea className="flex-1 p-6">
                                        <div className="space-y-4">
                                            {selectedChat.messages.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className={cn(
                                                        "p-3 rounded-xl shadow-sm text-sm break-words relative max-w-[80%]",
                                                        m.type === 'incoming'
                                                            ? "bg-white dark:bg-card rounded-tl-none self-start"
                                                            : "bg-emerald-500 text-white rounded-tr-none ml-auto"
                                                    )}
                                                >
                                                    {m.text}
                                                    <p className={cn(
                                                        "text-[10px] mt-1 text-right",
                                                        m.type === 'incoming' ? "text-muted-foreground" : "text-emerald-100"
                                                    )}>{m.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="p-4 bg-card border-t shrink-0">
                                        <div className="flex gap-2 items-center">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground"><Icons.Plus className="w-5 h-5" /></Button>
                                            <Input placeholder="Type a message..." className="bg-muted/50 border-none h-11 flex-1 text-sm focus:ring-emerald-500" />
                                            <Button size="icon" className="h-11 w-11 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/20"><Icons.Send className="w-5 h-5" /></Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </TabsContent>

                {/* Email Professional Hub */}
                <TabsContent value="email" className="flex-1 mt-6 h-full min-h-0">
                    <div className="h-full border rounded-2xl bg-card flex overflow-hidden shadow-sm relative">
                        {/* Status Message */}
                        <AnimatePresence>
                            {emailActionMsg && (
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-xl flex items-center gap-2"
                                >
                                    <Icons.CheckCircle className="w-4 h-4" />
                                    {emailActionMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Split List & View */}
                        <div className={cn("flex flex-col border-r h-full transition-all duration-300 bg-muted/5", selectedEmailId ? "w-1/3" : "w-full")}>
                            <div className="p-4 border-b flex items-center justify-between bg-muted/10 shrink-0">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => showEmailAction('archived')} className="h-8 gap-2"><Icons.Archive className="w-3.5 h-3.5" /> Archive</Button>
                                    <Button variant="outline" size="sm" onClick={() => showEmailAction('trashed')} className="h-8 gap-2 text-red-500 hover:text-red-600"><Icons.Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                                    <Button variant="outline" size="sm" onClick={() => showEmailAction('labeled')} className="h-8 gap-2"><Icons.Tag className="w-3.5 h-3.5" /> Label</Button>
                                </div>
                            </div>
                            <ScrollArea className="flex-1">
                                {emails.map((email) => (
                                    <div
                                        key={email.id}
                                        onClick={() => setSelectedEmailId(email.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 border-b hover:bg-muted/30 cursor-pointer transition-all relative group",
                                            !email.read && "bg-blue-50/20 dark:bg-blue-900/5",
                                            selectedEmailId === email.id && "bg-blue-50/50 dark:bg-blue-500/10"
                                        )}
                                    >
                                        {!email.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                                        <Icons.Star className={cn("w-4 h-4 shrink-0", email.id === 'E1' ? "text-amber-400 fill-amber-400" : "text-muted-foreground")} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={cn("text-sm truncate", !email.read ? "font-bold" : "text-muted-foreground")}>{email.sender}</span>
                                                <span className="text-[10px] text-muted-foreground">{email.date}</span>
                                            </div>
                                            <span className={cn("text-xs block mb-0.5", !email.read ? "font-bold" : "font-medium")}>{email.subject}</span>
                                            <p className="text-[11px] text-muted-foreground truncate">{email.snippet}</p>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>

                        {/* Email Details View */}
                        <div className={cn("flex-1 h-full bg-background transition-all duration-300", selectedEmailId ? "block" : "hidden md:flex items-center justify-center")}>
                            {selectedEmail ? (
                                <motion.div
                                    key={selectedEmail.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="p-4 border-b flex justify-between items-center bg-card shadow-sm z-10 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedEmailId(null)} className="h-8 gap-2"><Icons.ArrowLeft className="w-4 h-4" /> Back</Button>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Icons.Reply className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Icons.MoreVertical className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                    <ScrollArea className="flex-1 p-8">
                                        <div className="max-w-3xl mx-auto space-y-8">
                                            <div className="flex justify-between items-start pt-2">
                                                <div className="space-y-4">
                                                    <h2 className="text-2xl font-bold tracking-tight">{selectedEmail.subject}</h2>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{selectedEmail.sender.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-bold text-sm">{selectedEmail.sender}</div>
                                                            <div className="text-xs text-muted-foreground">From: {selectedEmail.senderEmail}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right text-xs text-muted-foreground">{selectedEmail.date}</div>
                                            </div>
                                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap border-t border-dashed pt-8">
                                                {selectedEmail.content}
                                            </div>
                                            <div className="pt-8 border-t">
                                                <div className="mt-8 flex gap-3">
                                                    <Button className="gap-2 px-6 h-10"><Icons.Reply className="w-4 h-4" /> Reply</Button>
                                                    <Button variant="outline" className="gap-2 px-6 h-10"><Icons.Forward className="w-4 h-4" /> Forward</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </motion.div>
                            ) : (
                                <div className="text-center space-y-4 opacity-40 select-none">
                                    <Icons.Mail className="w-16 h-16 mx-auto" />
                                    <p className="text-sm font-medium tracking-wider uppercase">Select an email to read</p>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* SMS Broadcast Management */}
                <TabsContent value="sms" className="flex-1 mt-6 h-full min-h-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                        {smsCampaigns.map((camp, idx) => (
                            <motion.div
                                key={camp.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 rounded-2xl border bg-card hover:border-emerald-500/30 transition-all space-y-4 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                        <Icons.Smartphone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <Badge variant="outline" className={cn(
                                        "uppercase text-[10px] font-bold tracking-widest",
                                        camp.status === 'Completed' && "bg-emerald-50 text-emerald-600 border-emerald-200",
                                        camp.status === 'Active' && "bg-blue-50 text-blue-600 border-blue-200 animate-pulse",
                                        camp.status === 'Draft' && "bg-slate-50 text-slate-600 border-slate-200"
                                    )}>
                                        {camp.status}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-lg">{camp.name}</h3>
                                <div className="grid grid-cols-2 gap-4 py-2">
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Delivered</p>
                                        <p className="text-xl font-bold text-emerald-600">{camp.delivered}</p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Failed</p>
                                        <p className="text-xl font-bold text-red-600">{camp.failed}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">View Analytics</Button>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <ConfigModal isOpen={isConfigOpen} onOpenChange={setIsConfigOpen} />
            <NewBroadcastModal isOpen={isBroadcastOpen} onOpenChange={setIsBroadcastOpen} />
            <NewMessageModal isOpen={isMessageOpen} onOpenChange={setIsMessageOpen} />
        </motion.div>
    );
};



