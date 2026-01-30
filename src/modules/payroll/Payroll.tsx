import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { payrollRecords, employees } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/store/uiStore';
import { Progress } from '@/components/ui/progress';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

// Payroll Stats
const PayrollStats = () => {
  const totalPayroll = payrollRecords.reduce((sum, r) => sum + r.netPay, 0);
  const totalEmployees = payrollRecords.length;
  const completedCount = payrollRecords.filter(r => r.status === 'completed').length;
  const complianceScore = 98;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        {
          label: 'Total Payroll',
          value: `₹${(totalPayroll / 100000).toFixed(1)}L`,
          change: 'Jan 2024',
          icon: 'Banknote',
          color: 'indigo'
        },
        {
          label: 'Employees',
          value: totalEmployees.toString(),
          change: 'Processed',
          icon: 'Users',
          color: 'blue'
        },
        {
          label: 'Compliance',
          value: `${complianceScore}%`,
          change: 'On Track',
          icon: 'ShieldCheck',
          color: 'emerald'
        },
        {
          label: 'Pending',
          value: (totalEmployees - completedCount).toString(),
          change: 'Approvals',
          icon: 'Clock',
          color: 'amber'
        },
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
                stat.color === 'indigo' && 'bg-indigo-500/10',
                stat.color === 'blue' && 'bg-blue-500/10',
                stat.color === 'emerald' && 'bg-emerald-500/10',
                stat.color === 'amber' && 'bg-amber-500/10',
              )}>
                <IconComponent className={cn(
                  'w-5 h-5',
                  stat.color === 'indigo' && 'text-indigo-500',
                  stat.color === 'blue' && 'text-blue-500',
                  stat.color === 'emerald' && 'text-emerald-500',
                  stat.color === 'amber' && 'text-amber-500',
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
  );
};

// Payslip Dialog
const PayslipDialog = ({ record }: { record: typeof payrollRecords[0] }) => {
  const employee = employees.find(e => e.id === record.employeeId);

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Icons.FileText className="w-5 h-5" />
          Payslip - {record.month} {record.year}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Employee Info */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="w-16 h-16">
            <AvatarImage src={employee?.avatar} />
            <AvatarFallback>{employee?.firstName[0]}{employee?.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{employee?.firstName} {employee?.lastName}</h3>
            <p className="text-sm text-muted-foreground">{employee?.designation}</p>
            <p className="text-sm text-muted-foreground">{employee?.department}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-muted-foreground">Employee ID</p>
            <p className="font-medium">{employee?.employeeId}</p>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="grid grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="space-y-3">
            <h4 className="font-semibold text-emerald-600 flex items-center gap-2">
              <Icons.Plus className="w-4 h-4" />
              Earnings
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Basic Salary</span>
                <span>₹{record.basicSalary.toLocaleString()}</span>
              </div>
              {record.allowances.map((allowance, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{allowance.name}</span>
                  <span>₹{allowance.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t flex justify-between font-medium">
                <span>Gross Salary</span>
                <span>₹{record.grossSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-red-600 flex items-center gap-2">
              <Icons.Minus className="w-4 h-4" />
              Deductions
            </h4>
            <div className="space-y-2">
              {record.deductions.map((deduction, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{deduction.name}</span>
                  <span>₹{deduction.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t flex justify-between font-medium">
                <span>Total Deductions</span>
                <span>₹{record.totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="text-3xl font-bold text-primary">₹{record.netPay.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={cn(
                record.status === 'completed' && 'bg-emerald-500/10 text-emerald-600',
                record.status === 'processing' && 'bg-amber-500/10 text-amber-600',
                record.status === 'draft' && 'bg-slate-500/10 text-slate-600',
              )}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Icons.ShieldCheck className="w-4 h-4" />
            Compliance Details
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">PF (Employee)</p>
              <p className="font-medium">₹{record.pfContribution?.employee.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">PF (Employer)</p>
              <p className="font-medium">₹{record.pfContribution?.employer.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Professional Tax</p>
              <p className="font-medium">₹{record.professionalTax}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1 gap-2">
            <Icons.Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Icons.MessageCircle className="w-4 h-4" />
            Send via WhatsApp
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Icons.Mail className="w-4 h-4" />
            Send via Email
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

// Payroll Table
const PayrollTable = () => {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Basic Salary</TableHead>
            <TableHead>Allowances</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollRecords.map((record, index) => {
            const employee = employees.find(e => e.id === record.employeeId);
            return (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-muted/50 transition-colors group"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={employee?.avatar} />
                      <AvatarFallback>{employee?.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{employee?.employeeId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>₹{record.basicSalary.toLocaleString()}</TableCell>
                <TableCell>₹{record.allowances.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}</TableCell>
                <TableCell>₹{record.totalDeductions.toLocaleString()}</TableCell>
                <TableCell className="font-medium text-primary">₹{record.netPay.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    record.status === 'completed' && 'bg-emerald-500/10 text-emerald-600',
                    record.status === 'processing' && 'bg-amber-500/10 text-amber-600',
                    record.status === 'draft' && 'bg-slate-500/10 text-slate-600',
                  )}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <Icons.Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <PayslipDialog record={record} />
                  </Dialog>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Incentives Panel
const IncentivesPanel = () => {
  const topPerformers = employees
    .filter(e => e.points && e.points > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Points to Incentive Conversion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Icons.Gift className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold">Points to Incentives</h3>
            <p className="text-sm text-muted-foreground">Convert performance points to monetary incentives</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-card rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-600">100</p>
            <p className="text-xs text-muted-foreground">Points = ₹500</p>
          </div>
          <div className="p-3 bg-card rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-600">500</p>
            <p className="text-xs text-muted-foreground">Points = ₹3,000</p>
          </div>
          <div className="p-3 bg-card rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-600">1000</p>
            <p className="text-xs text-muted-foreground">Points = ₹8,000</p>
          </div>
        </div>
      </motion.div>

      {/* Top Performers */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Icons.Trophy className="w-5 h-5 text-amber-500" />
          Top Performers
        </h3>

        <div className="space-y-3">
          {topPerformers.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-card border hover:border-primary/30 transition-colors"
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                index === 0 && 'bg-amber-500 text-white',
                index === 1 && 'bg-slate-400 text-white',
                index === 2 && 'bg-orange-600 text-white',
                index > 2 && 'bg-muted text-muted-foreground',
              )}>
                {index + 1}
              </div>

              <Avatar className="w-10 h-10">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback>{employee.firstName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                <p className="text-xs text-muted-foreground">{employee.department}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-amber-600">{employee.points?.toLocaleString()} pts</p>
                <p className="text-xs text-muted-foreground">
                  ≈ ₹{Math.floor((employee.points || 0) / 100 * 500).toLocaleString()}
                </p>
              </div>

              {employee.badges && employee.badges.length > 0 && (
                <div className="flex gap-1">
                  {employee.badges.slice(0, 2).map((badge) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const BadgeIcon = (Icons as any)[badge.icon];
                    return (
                      <Badge key={badge.id} variant="secondary" className="text-xs">
                        {BadgeIcon && <BadgeIcon className="w-3 h-3 mr-1" />}
                        {badge.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Process Payroll Workflow Component
const ProcessPayrollModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    { title: 'Verifying Attendance', icon: 'CalendarCheck', description: 'Checking work hours and leave balances...' },
    { title: 'Calculating Salaries', icon: 'Coins', description: 'Applying allowances, bonuses, and deductions...' },
    { title: 'Compliance Check', icon: 'ShieldCheck', description: 'Calculating TDS, PF, and Professional Tax...' },
    { title: 'Generating Payslips', icon: 'FileText', description: 'Finalizing PDF documents for digital distribution...' },
  ];

  useEffect(() => {
    if (isOpen && !isFinished) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (step < steps.length - 1) {
              setStep(step + 1);
              return 0;
            } else {
              setIsFinished(true);
              clearInterval(interval);
              return 100;
            }
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isOpen, step, isFinished, steps.length]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Processing January 2024 Payroll</DialogTitle>
          <DialogDescription>
            Automated workflow is active. Please do not close this window.
          </DialogDescription>
        </DialogHeader>

        <div className="py-8 space-y-6">
          {!isFinished ? (
            <>
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(() => { const Icon = (Icons as any)[steps[step].icon]; return <Icon className="w-6 h-6 text-primary" />; })()}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <h4 className="font-bold text-lg">{steps[step].title}</h4>
                <p className="text-sm text-muted-foreground">{steps[step].description}</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 rounded-full transition-colors",
                      i < step ? "bg-emerald-500" : i === step ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                <Icons.CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Payroll Processed Successfully</h3>
                <p className="text-muted-foreground text-sm">₹2.4M processed for 48 employees.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full gap-2" onClick={() => onOpenChange(false)}>
                  <Icons.Download className="w-4 h-4" />
                  Download Summary Report
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Payroll Component
export const Payroll = () => {
  const { activeModule, setActiveModule } = useUIStore();
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const currentTab = ['salary', 'payslips', 'compliance', 'incentives'].includes(activeModule)
    ? activeModule
    : 'salary';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Icons.Coins className="w-7 h-7 text-indigo-500" />
            Payroll Hub
          </h1>
          <p className="text-muted-foreground text-sm">Process salaries, manage compliance, and track incentives</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Icons.Calendar className="w-4 h-4" />
                January 2024
                <Icons.ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start font-bold">2024</Button>
                {['January', 'February', 'March'].map((m) => (
                  <Button
                    key={m}
                    variant="ghost"
                    size="sm"
                    className={cn("w-full justify-start pl-4", m === 'January' && "bg-primary/10 text-primary")}
                  >
                    {m}
                  </Button>
                ))}
                <div className="h-px bg-muted my-1" />
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-medium">2023</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
            onClick={() => setIsProcessModalOpen(true)}
          >
            <Icons.Play className="w-4 h-4" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Stats */}
      <PayrollStats />

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setActiveModule} className="w-full">
        <TabsList className="grid w-full md:w-fit grid-cols-2 lg:grid-cols-4 bg-muted/50 p-1">
          <TabsTrigger value="salary" className="gap-2 px-6">
            <Icons.Banknote className="w-4 h-4" />
            Salary Processing
          </TabsTrigger>
          <TabsTrigger value="payslips" className="gap-2 px-6">
            <Icons.FileText className="w-4 h-4" />
            Payslips
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2 px-6">
            <Icons.ShieldCheck className="w-4 h-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="incentives" className="gap-2 px-6">
            <Icons.Gift className="w-4 h-4" />
            Incentives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="salary" className="mt-6">
          <PayrollTable />
        </TabsContent>

        <TabsContent value="payslips" className="mt-6">
          <div className="grid gap-4">
            {/* Reuse table layout for payslips history */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Payslip Distribution History</h3>
              <Button variant="outline" size="sm" className="gap-2"><Icons.Mail className="w-3 h-3" /> Bulk Email</Button>
            </div>
            <PayrollTable />
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'PF Compliance', status: 'compliant', lastFiled: '15 Jan 2024', nextDue: '15 Feb 2024' },
              { name: 'ESI Compliance', status: 'compliant', lastFiled: '15 Jan 2024', nextDue: '15 Feb 2024' },
              { name: 'Professional Tax', status: 'pending', lastFiled: '15 Dec 2023', nextDue: '15 Jan 2024' },
              { name: 'TDS Returns', status: 'compliant', lastFiled: '31 Dec 2023', nextDue: '31 Mar 2024' },
              { name: 'GST Filing', status: 'compliant', lastFiled: '20 Jan 2024', nextDue: '20 Feb 2024' },
              { name: 'Income Tax', status: 'upcoming', lastFiled: '31 Jul 2023', nextDue: '31 Jul 2024' },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="p-4 rounded-xl bg-card border"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{item.name}</h4>
                  <Badge className={cn(
                    item.status === 'compliant' && 'bg-emerald-500/10 text-emerald-600',
                    item.status === 'pending' && 'bg-amber-500/10 text-amber-600',
                    item.status === 'upcoming' && 'bg-blue-500/10 text-blue-600',
                  )}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Filed</span>
                    <span>{item.lastFiled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Due</span>
                    <span className={item.status === 'pending' ? 'text-amber-600 font-medium' : ''}>
                      {item.nextDue}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incentives" className="mt-6">
          <IncentivesPanel />
        </TabsContent>
      </Tabs>

      <ProcessPayrollModal
        isOpen={isProcessModalOpen}
        onOpenChange={(v) => {
          setIsProcessModalOpen(v);
          if (!v) {
            // Re-sync with sidebar if needed or just trigger success
          }
        }}
      />
    </motion.div>
  );
};

// Add Popover from UI components
const Popover = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const kids = React.Children.toArray(children);

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)}>{kids[0]}</div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {kids[1]}
          </div>
        </>
      )}
    </div>
  );
};

const PopoverTrigger = ({ children }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>;
};

const PopoverContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("bg-card border rounded-lg shadow-xl", className)}>
      {children}
    </div>
  );
};

