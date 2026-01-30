import { motion } from 'framer-motion';
import { employees } from '@/data/dummyData';
import { useUIStore } from '@/store/uiStore';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// General Settings
const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-card border"
      >
        <h3 className="font-semibold mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input defaultValue="GIGGLEORG Technologies Pvt Ltd" />
          </div>
          <div className="space-y-2">
            <Label>Domain</Label>
            <Input defaultValue="giggleorg.com" />
          </div>
          <div className="space-y-2">
            <Label>GST Number</Label>
            <Input defaultValue="27AABCU9603R1ZX" />
          </div>
          <div className="space-y-2">
            <Label>PAN Number</Label>
            <Input defaultValue="AABCU9603R" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-xl bg-card border"
      >
        <h3 className="font-semibold mb-4">Localization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="asia-kolkata">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="asia-dubai">Asia/Dubai (GST)</SelectItem>
                <SelectItem value="america-newyork">America/New_York (EST)</SelectItem>
                <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select defaultValue="inr">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                <SelectItem value="usd">US Dollar ($)</SelectItem>
                <SelectItem value="eur">Euro (€)</SelectItem>
                <SelectItem value="gbp">British Pound (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl bg-card border"
      >
        <h3 className="font-semibold mb-4">Branding</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl gradient-primary flex items-center justify-center">
            <Icons.Hexagon className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="gap-2">
              <Icons.Upload className="w-4 h-4" />
              Upload Logo
            </Button>
            <p className="text-xs text-muted-foreground">
              Recommended size: 512x512px. Max file size: 2MB.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

// Users & Roles
const UsersRoles = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Users & Roles</h3>
          <p className="text-sm text-muted-foreground">Manage users and their permissions</p>
        </div>
        <Button className="gap-2">
          <Icons.Plus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp, index) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={emp.avatar} />
                      <AvatarFallback>{emp.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {emp.role ? emp.role.replace('_', ' ') : 'Employee'}
                  </Badge>
                </TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      emp.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                    )} />
                    <span className="capitalize">{emp.status}</span>
                  </div>
                </TableCell>
                <TableCell>{emp.lastActive ? new Date(emp.lastActive).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Icons.MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Role Permissions Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 rounded-xl bg-card border"
      >
        <h3 className="font-semibold mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 text-sm font-medium">Module</th>
                <th className="text-center py-2 px-3 text-sm font-medium">Super Admin</th>
                <th className="text-center py-2 px-3 text-sm font-medium">Admin</th>
                <th className="text-center py-2 px-3 text-sm font-medium">Manager</th>
                <th className="text-center py-2 px-3 text-sm font-medium">Employee</th>
              </tr>
            </thead>
            <tbody>
              {['Dashboard', 'CRM', 'Sales', 'HRMS', 'Payroll', 'Settings'].map((module, i) => (
                <tr key={module} className="border-b last:border-0">
                  <td className="py-2 px-3 text-sm">{module}</td>
                  <td className="text-center py-2 px-3">
                    <Icons.Check className="w-4 h-4 text-emerald-500 mx-auto" />
                  </td>
                  <td className="text-center py-2 px-3">
                    <Icons.Check className="w-4 h-4 text-emerald-500 mx-auto" />
                  </td>
                  <td className="text-center py-2 px-3">
                    {i < 4 ? <Icons.Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <Icons.X className="w-4 h-4 text-red-500 mx-auto" />}
                  </td>
                  <td className="text-center py-2 px-3">
                    {i < 2 ? <Icons.Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <Icons.X className="w-4 h-4 text-red-500 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// Security Settings
const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-card border"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="p-4 bg-emerald-500/10 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-600">
            <Icons.ShieldCheck className="w-5 h-5" />
            <span className="font-medium">2FA is enabled</span>
          </div>
          <p className="text-sm text-emerald-600/70 mt-1">
            Your account is protected with authenticator app
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-xl bg-card border"
      >
        <h3 className="font-semibold mb-4">Session Management</h3>
        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows', location: 'Mumbai, India', current: true, time: 'Active now' },
            { device: 'Safari on macOS', location: 'Bangalore, India', current: false, time: '2 hours ago' },
            { device: 'Nexus App on iPhone', location: 'Delhi, India', current: false, time: '1 day ago' },
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icons.Laptop className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{session.device}</p>
                  <p className="text-xs text-muted-foreground">{session.location} • {session.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.current && <Badge variant="secondary">Current</Badge>}
                <Button variant="ghost" size="sm" className="text-red-600">
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl bg-card border"
      >
        <h3 className="font-semibold mb-4">Password Policy</h3>
        <div className="space-y-3">
          {[
            { label: 'Minimum password length', value: '8 characters', enabled: true },
            { label: 'Require uppercase letters', value: '', enabled: true },
            { label: 'Require numbers', value: '', enabled: true },
            { label: 'Require special characters', value: '', enabled: true },
            { label: 'Password expiration', value: '90 days', enabled: false },
          ].map((policy, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={policy.enabled} />
                <span className="text-sm">{policy.label}</span>
              </div>
              {policy.value && <span className="text-sm text-muted-foreground">{policy.value}</span>}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 rounded-xl bg-card border"
      >
        <h3 className="font-semibold mb-4">Audit Log</h3>
        <div className="space-y-2">
          {[
            { action: 'User login', user: 'Alex Morgan', time: '2 minutes ago', type: 'success' },
            { action: 'Password changed', user: 'Sarah Johnson', time: '1 hour ago', type: 'info' },
            { action: 'Role updated', user: 'Michael Chen', time: '3 hours ago', type: 'warning' },
            { action: 'Failed login attempt', user: 'Unknown', time: '5 hours ago', type: 'error' },
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  log.type === 'success' && 'bg-emerald-500',
                  log.type === 'info' && 'bg-blue-500',
                  log.type === 'warning' && 'bg-amber-500',
                  log.type === 'error' && 'bg-red-500',
                )} />
                <span className="text-sm">{log.action}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{log.user}</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Integrations
const Integrations = () => {
  const integrations = [
    { name: 'WhatsApp Business', icon: 'MessageCircle', status: 'connected', description: 'Send notifications and approvals via WhatsApp' },
    { name: 'Email (SMTP)', icon: 'Mail', status: 'connected', description: 'Transactional and marketing emails' },
    { name: 'SMS Gateway', icon: 'Smartphone', status: 'connected', description: 'DLT compliant SMS notifications' },
    { name: 'Google Calendar', icon: 'Calendar', status: 'disconnected', description: 'Sync meetings and events' },
    { name: 'Slack', icon: 'Hash', status: 'connected', description: 'Team notifications and alerts' },
    { name: 'Zoom', icon: 'Video', status: 'disconnected', description: 'Video conferencing integration' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Integrations</h3>
        <p className="text-sm text-muted-foreground">Connect third-party services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, index) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const IconComponent = (Icons as any)[integration.icon] || Icons.Plug;
          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="p-4 rounded-xl bg-card border flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{integration.name}</h4>
                  <Badge className={cn(
                    integration.status === 'connected' && 'bg-emerald-500/10 text-emerald-600',
                    integration.status === 'disconnected' && 'bg-slate-500/10 text-slate-600',
                  )}>
                    {integration.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                <div className="mt-3">
                  <Button
                    variant={integration.status === 'connected' ? 'outline' : 'default'}
                    size="sm"
                  >
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Main Settings Component
export const Settings = () => {
  const { activeSubModule, setActiveModule } = useUIStore();
  const currentTab = ['general', 'users', 'security', 'integrations', 'notifications'].includes(activeSubModule || '')
    ? (activeSubModule as string)
    : 'general';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={(val) => setActiveModule('settings', val)} className="w-full">
        <TabsList className="grid w-fit grid-cols-5">
          <TabsTrigger value="general" className="gap-2">
            <Icons.Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Icons.Users className="w-4 h-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Icons.Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Icons.Plug className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Icons.Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UsersRoles />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Integrations />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-card border"
            >
              <h3 className="font-semibold mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: 'System Alerts', desc: 'Critical system updates and security alerts', enabled: true },
                  { label: 'New Lead Assignment', desc: 'When a new lead is assigned to you', enabled: true },
                  { label: 'Weekly Reports', desc: 'Summary of your module performance', enabled: false },
                  { label: 'Payroll Updates', desc: 'Notifications about salary processing', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-xl bg-card border"
            >
              <h3 className="font-semibold mb-4">Push & Desktop Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: 'Browser Notifications', desc: 'Show desktop alerts for new activities', enabled: true },
                  { label: 'Sound Alerts', desc: 'Play a sound for incoming messages', enabled: true },
                  { label: 'Mobile App Notifications', desc: 'Sync alerts with GIGGLEORG mobile app', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-xl bg-card border"
            >
              <h3 className="font-semibold mb-4">WhatsApp Notifications</h3>
              <div className="flex items-start gap-4 p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Icons.MessageCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Official WhatsApp Channel</h4>
                    <Badge className="bg-emerald-500 text-white">Active</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Receive your payslips and urgent approvals directly on WhatsApp.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
