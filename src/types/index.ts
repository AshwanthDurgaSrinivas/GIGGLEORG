// GIGGLEORG - Type Definitions

// User & Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  permissions: Permission[];
  lastActive: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'employee' | 'viewer';

export interface Permission {
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve')[];
}

// Company & Organization
export interface Company {
  id: string;
  name: string;
  logo?: string;
  domain: string;
  timezone: string;
  currency: string;
  language: string;
  address: Address;
  taxId?: string;
  gstNumber?: string;
  panNumber?: string;
  udyamNumber?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Dashboard & Analytics
export interface KPIData {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  trend?: number[];
  prefix?: string;
  suffix?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

// CRM Types
export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  stage: PipelineStage;
  value: number;
  probability: number;
  assignedTo: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  aiScore?: number;
  lastActivity: Date;
  nextFollowUp?: Date;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type LeadSource = 'website' | 'referral' | 'social_media' | 'email' | 'call' | 'event' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
export type PipelineStage = 'new_lead' | 'qualified' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  probability: number;
  stage: PipelineStage;
  expectedCloseDate: Date;
  assignedTo: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  aiPrediction?: {
    winProbability: number;
    recommendedActions: string[];
    riskFactors: string[];
  };
  activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  createdBy: string;
  createdAt: Date;
  completed?: boolean;
}

// HRMS Types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  department: string;
  designation: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  manager?: string;
  managerName?: string;
  location?: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary?: {
    basic: number;
    allowances: number;
    deductions: number;
    netPay: number;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  documents?: Document[];
  skills: string[];
  performanceScore?: number;
  points?: number;
  badges?: Badge[];
  role?: UserRole;
  lastActive?: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  workHours: number;
  breakHours: number;
  location?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveType: 'annual' | 'sick' | 'casual' | 'maternity' | 'paternity' | 'unpaid' | 'other';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  appliedAt: Date;
}

// Payroll Types
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName?: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  grossSalary: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'processing' | 'completed';
  pfContribution?: {
    employee: number;
    employer: number;
  };
  esiContribution?: {
    employee: number;
    employer: number;
  };
  professionalTax?: number;
  tds?: number;
}

export interface Allowance {
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
}

export interface Deduction {
  name: string;
  amount: number;
  type: 'statutory' | 'voluntary';
}

export interface Payslip {
  id: string;
  payrollId: string;
  employeeId: string;
  month: string;
  year: number;
  generatedAt: Date;
  sentVia: ('email' | 'whatsapp' | 'portal')[];
  downloaded: boolean;
}

// Productivity Types
export interface ProductivityData {
  employeeId: string;
  employeeName?: string;
  date: Date;
  activeTime: number; // in minutes
  idleTime: number;
  productiveTime: number;
  unproductiveTime: number;
  productivityScore: number; // 0-100
  appsUsed: AppUsage[];
  websitesVisited: WebsiteUsage[];
  screenshots?: Screenshot[];
  keyboardActivity: number;
  mouseActivity: number;
}

export interface AppUsage {
  name: string;
  category: 'productive' | 'neutral' | 'unproductive';
  duration: number;
  percentage: number;
}

export interface WebsiteUsage {
  url: string;
  category: 'productive' | 'neutral' | 'unproductive';
  duration: number;
  visits: number;
}

export interface Screenshot {
  id: string;
  timestamp: Date;
  thumbnailUrl: string;
  fullUrl: string;
  activityLevel: 'high' | 'medium' | 'low';
}

// AI Features Types
export interface AIInsight {
  id: string;
  type: 'lead_score' | 'deal_prediction' | 'performance_forecast' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actions?: string[];
  createdAt: Date;
}

export interface LeadScore {
  leadId: string;
  score: number; // 0-100
  factors: {
    name: string;
    impact: number;
    weight: number;
  }[];
  predictedConversionDate?: Date;
  recommendedActions: string[];
}

export interface DealPrediction {
  dealId: string;
  winProbability: number;
  expectedCloseDate: Date;
  expectedValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendedActions: string[];
}

export interface GeneratedEmail {
  id: string;
  leadId?: string;
  template: string;
  tone: 'professional' | 'friendly' | 'urgent' | 'casual';
  subject: string;
  body: string;
  generatedAt: Date;
  sent: boolean;
}

// Sales & Invoicing
export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  createdAt: Date;
}

export interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  quotationId?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
  paidAt?: Date;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

// Inventory Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  quantityInStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  supplier?: string;
  status: 'active' | 'inactive' | 'discontinued';
  images?: string[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

// Project Management
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  spent?: number;
  manager: string;
  team: string[];
  progress: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
}

export interface Timesheet {
  id: string;
  employeeId: string;
  projectId: string;
  taskId?: string;
  date: Date;
  hours: number;
  description: string;
  billable: boolean;
  approved: boolean;
}

// Communication Types
export interface WhatsAppMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  type: 'text' | 'image' | 'document' | 'template';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  templateName?: string;
}

export interface Email {
  id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: Attachment[];
  status: 'draft' | 'sent' | 'delivered' | 'opened' | 'bounced';
  sentAt?: Date;
  openedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'proposal' | 'sow' | 'invoice' | 'other';
  category: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  version: number;
  versions?: DocumentVersion[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  signed?: boolean;
  signedAt?: Date;
  signedBy?: string;
}

export interface DocumentVersion {
  version: number;
  url: string;
  createdBy: string;
  createdAt: Date;
  notes?: string;
}

// Approval Workflow
export interface ApprovalRequest {
  id: string;
  type: 'leave' | 'expense' | 'purchase_order' | 'invoice' | 'other';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvers: Approver[];
  currentApproverIndex: number;
  data: Record<string, unknown>;
}

export interface Approver {
  userId: string;
  userName?: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  actedAt?: Date;
}

// Settings Types
export interface Integration {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms' | 'voip' | 'calendar' | 'storage';
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>;
  lastSync?: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  children?: NavItem[];
  permissions?: string[];
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  sidebarCompact: boolean;
  animationsEnabled: boolean;
}
