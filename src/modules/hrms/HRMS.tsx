import { useState } from 'react';
import { motion } from 'framer-motion';
import { employees, leaveRequests, attendanceRecords } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/store/uiStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Dummy Recruitment Data
const jobOpenings = [
  { id: 'JOB-001', title: 'Senior Frontend Developer', department: 'Engineering', type: 'Full-time', status: 'Open', applicants: 12, salary: '₹18L - ₹25L' },
  { id: 'JOB-002', title: 'Backend Lead', department: 'Engineering', type: 'Full-time', status: 'In Review', applicants: 8, salary: '₹22L - ₹30L' },
  { id: 'JOB-003', title: 'UI/UX Designer', department: 'Design', type: 'Contract', status: 'Closed', applicants: 25, salary: '₹12L - ₹15L' },
];

const candidates = [
  { id: 'CAN-001', name: 'Rahul Sharma', position: 'Frontend Dev', stage: 'Interview', score: 85, status: 'Shortlisted', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 'CAN-002', name: 'Sneha Gupta', position: 'Backend Lead', stage: 'Technical Test', score: 92, status: 'In Progress', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' },
  { id: 'CAN-003', name: 'Amit Verma', position: 'UI Designer', stage: 'Applied', score: 0, status: 'New', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
];

// Employee Card (Grid View)
const EmployeeCard = ({ employee, index }: { employee: typeof employees[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{ y: -4, scale: 1.01 }}
    className="p-5 rounded-xl bg-card border hover:shadow-lg transition-all cursor-pointer group"
  >
    <div className="flex items-start justify-between mb-4">
      <Avatar className="w-14 h-14 ring-2 ring-primary/20">
        <AvatarImage src={employee.avatar} />
        <AvatarFallback className="text-lg">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
      </Avatar>
      <div className={cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        employee.status === 'active' && 'bg-emerald-500/10 text-emerald-600',
        employee.status === 'on_leave' && 'bg-blue-500/10 text-blue-600',
        employee.status === 'inactive' && 'bg-red-500/10 text-red-600',
      )}>
        {employee.status.replace('_', ' ')}
      </div>
    </div>

    <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
    <p className="text-sm text-muted-foreground">{employee.designation}</p>
    <p className="text-xs text-muted-foreground">{employee.department}</p>

    <div className="mt-4 pt-4 border-t space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Performance</span>
        <span className="font-medium">{employee.performanceScore}%</span>
      </div>
      <Progress value={employee.performanceScore} className="h-1.5" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Points</span>
        <span className="font-medium text-amber-600">{employee.points?.toLocaleString()}</span>
      </div>

      {employee.badges && employee.badges.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {employee.badges.slice(0, 3).map((badge) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const BadgeIcon = (Icons as any)[badge.icon];
            return (
              <Badge key={badge.id} variant="secondary" className="text-xs gap-1">
                {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
                {badge.name}
              </Badge>
            );
          })}
          {employee.badges.length > 3 && (
            <Badge variant="outline" className="text-xs">+{employee.badges.length - 3}</Badge>
          )}
        </div>
      )}
    </div>

    <div className="mt-4 pt-4 border-t flex items-center justify-between">
      <div className="flex -space-x-2">
        {employee.skills.slice(0, 3).map((skill, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary border-2 border-card"
            title={skill}
          >
            {skill[0]}
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
        View Profile
      </Button>
    </div>
  </motion.div>
);

// Leave Request Card
const LeaveRequestCard = ({ request, index }: { request: typeof leaveRequests[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
    className="p-4 rounded-lg bg-card border hover:border-primary/30 transition-colors"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={employees.find(e => e.id === request.employeeId)?.avatar} />
          <AvatarFallback>{request.employeeName?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{request.employeeName}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Badge className={cn(
        request.status === 'approved' && 'bg-emerald-500/10 text-emerald-600',
        request.status === 'pending' && 'bg-amber-500/10 text-amber-600',
        request.status === 'rejected' && 'bg-red-500/10 text-red-600',
      )}>
        {request.status}
      </Badge>
    </div>

    <div className="mt-3 pt-3 border-t">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Type</span>
        <span className="capitalize">{request.leaveType.replace('_', ' ')}</span>
      </div>
      <div className="flex items-center justify-between text-sm mt-1">
        <span className="text-muted-foreground">Days</span>
        <span>{request.days} days</span>
      </div>
    </div>

    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{request.reason}</p>

    {request.status === 'pending' && (
      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="outline" className="flex-1 gap-1 text-emerald-600">
          <Icons.Check className="w-4 h-4" />
          Approve
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1 text-red-600">
          <Icons.X className="w-4 h-4" />
          Reject
        </Button>
      </div>
    )}
  </motion.div>
);

// Attendance Table
const AttendanceTable = () => {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.map((record, index) => {
            const employee = employees.find(e => e.id === record.employeeId);
            return (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={employee?.avatar} />
                      <AvatarFallback>{employee?.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{employee?.firstName} {employee?.lastName}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </TableCell>
                <TableCell>
                  {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </TableCell>
                <TableCell>{record.workHours} hrs</TableCell>
                <TableCell>
                  <Badge className={cn(
                    record.status === 'present' && 'bg-emerald-500/10 text-emerald-600',
                    record.status === 'late' && 'bg-amber-500/10 text-amber-600',
                    record.status === 'on_leave' && 'bg-blue-500/10 text-blue-600',
                    record.status === 'absent' && 'bg-red-500/10 text-red-600',
                  )}>
                    {record.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Employees View
const EmployeesView = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Icons.Filter className="w-4 h-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">Adjust employee list view.</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="dept">Dept</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="dept" className="col-span-2 h-8">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="status" className="col-span-2 h-8">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-card shadow-sm' : 'hover:bg-muted-foreground/10'
              )}
              title="Grid View"
            >
              <Icons.Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-card shadow-sm' : 'hover:bg-muted-foreground/10'
              )}
              title="List View"
            >
              <Icons.List className="w-4 h-4" />
            </button>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                <Icons.Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Onboard New Employee</DialogTitle>
                <DialogDescription>Create a new employee profile in the organizational directory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="john.doe@company.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Dept" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eng">Engineering</SelectItem>
                        <SelectItem value="des">Design</SelectItem>
                        <SelectItem value="mkt">Marketing</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input placeholder="Software Engineer" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salary (CTC)</Label>
                    <Input type="number" placeholder="1200000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Join Date</Label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button className="bg-primary" onClick={() => setIsAddModalOpen(false)}>Complete Onboarding</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((employee, index) => (
            <EmployeeCard key={employee.id} employee={employee} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-xs text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      employee.status === 'active' && 'bg-emerald-500/10 text-emerald-600',
                      employee.status === 'on_leave' && 'bg-blue-500/10 text-blue-600',
                    )}>
                      {employee.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.performanceScore} className="w-20 h-2" />
                      <span className="text-sm">{employee.performanceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-amber-600">{employee.points?.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// Main HRMS Component
export const HRMS = () => {
  const { activeModule, setActiveModule } = useUIStore();

  const currentTab = ['employees', 'attendance', 'leaves', 'recruitment'].includes(activeModule)
    ? activeModule
    : 'employees';

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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Icons.UsersRound className="w-7 h-7 text-primary" />
            HR Management
          </h1>
          <p className="text-muted-foreground text-sm">Manage employees, attendance, and leave requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Icons.Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: '48', change: '+3', icon: 'Users', color: 'blue' },
          { label: 'Present Today', value: '42', change: '88%', icon: 'UserCheck', color: 'emerald' },
          { label: 'On Leave', value: '4', change: '8%', icon: 'CalendarX', color: 'amber' },
          { label: 'Avg Performance', value: '89%', change: '+2%', icon: 'TrendingUp', color: 'indigo' },
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
                  stat.color === 'blue' && 'bg-blue-500/10',
                  stat.color === 'emerald' && 'bg-emerald-500/10',
                  stat.color === 'amber' && 'bg-amber-500/10',
                  stat.color === 'indigo' && 'bg-indigo-500/10',
                )}>
                  <IconComponent className={cn(
                    'w-5 h-5',
                    stat.color === 'blue' && 'text-blue-500',
                    stat.color === 'emerald' && 'text-emerald-500',
                    stat.color === 'amber' && 'text-amber-500',
                    stat.color === 'indigo' && 'text-indigo-500',
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

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setActiveModule} className="w-full">
        <TabsList className="grid w-full md:w-fit grid-cols-2 md:grid-cols-4 bg-muted/50 p-1">
          <TabsTrigger value="employees" className="gap-2 px-6">
            <Icons.Users className="w-4 h-4" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 px-6">
            <Icons.CalendarCheck className="w-4 h-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leaves" className="gap-2 px-6">
            <Icons.CalendarX className="w-4 h-4" />
            Leaves
            <Badge variant="secondary" className="ml-1 text-xs">{leaveRequests.filter(r => r.status === 'pending').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="recruitment" className="gap-2 px-6">
            <Icons.UserSearch className="w-4 h-4" />
            Recruitment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <EmployeesView />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <AttendanceTable />
        </TabsContent>

        <TabsContent value="leaves" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {leaveRequests.map((request, index) => (
              <LeaveRequestCard key={request.id} request={request} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recruitment" className="mt-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Openings */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Active Job Openings</h3>
                  <Button size="sm" className="gap-2"><Icons.Plus className="w-4 h-4" /> New Job</Button>
                </div>
                <div className="grid gap-4">
                  {jobOpenings.map((job) => (
                    <div key={job.id} className="p-4 rounded-xl border bg-card hover:border-primary/20 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{job.title}</h4>
                          <Badge variant="outline" className="text-[10px]">{job.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Icons.Briefcase className="w-3 h-3" /> {job.department}</span>
                          <span className="flex items-center gap-1"><Icons.IndianRupee className="w-3 h-3" /> {job.salary}</span>
                          <span className="flex items-center gap-1"><Icons.Users className="w-3 h-3" /> {job.applicants} Applicants</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={cn(
                          job.status === 'Open' ? "bg-emerald-500/10 text-emerald-600" :
                            job.status === 'In Review' ? "bg-blue-500/10 text-blue-600" :
                              "bg-slate-500/10 text-slate-600"
                        )}>{job.status}</Badge>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate Pipeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Recent Applications</h3>
                <div className="space-y-3">
                  {candidates.map((can) => (
                    <div key={can.id} className="p-4 rounded-xl border bg-card flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-primary/5">
                        <AvatarImage src={can.avatar} />
                        <AvatarFallback>{can.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold leading-none">{can.name}</p>
                          <Badge className="text-[10px] h-4">{can.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{can.position}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="text-indigo-500 font-bold">{can.stage}</span>
                          <span className="text-muted-foreground">Score: {can.score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-xs">View All Candidates</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

