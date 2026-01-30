import { useState } from 'react';
import { motion } from 'framer-motion';
import { leads, aiInsights, employees } from '@/data/dummyData';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// AI Lead Scoring
const LeadScoringPanel = () => {
  const scoredLeads = leads.filter(l => l.aiScore).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Icons.Sparkles className="w-5 h-5 text-indigo-500" />
            AI Lead Scoring
          </h3>
          <p className="text-sm text-muted-foreground">Leads ranked by conversion probability</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Icons.RefreshCw className="w-4 h-4" />
          Refresh Scores
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {scoredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="p-4 rounded-xl bg-card border hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{lead.companyName}</h4>
                <p className="text-sm text-muted-foreground">{lead.contactName}</p>
              </div>
              <div className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center border-4',
                (lead.aiScore || 0) >= 80 ? 'border-emerald-500 bg-emerald-500/10' :
                  (lead.aiScore || 0) >= 60 ? 'border-amber-500 bg-amber-500/10' :
                    'border-red-500 bg-red-500/10'
              )}>
                <span className={cn(
                  'text-lg font-bold',
                  (lead.aiScore || 0) >= 80 ? 'text-emerald-600' :
                    (lead.aiScore || 0) >= 60 ? 'text-amber-600' :
                      'text-red-600'
                )}>
                  {lead.aiScore}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deal Value</span>
                <span className="font-medium">₹{(lead.value / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Source</span>
                <span className="capitalize">{lead.source.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Activity</span>
                <span>{new Date(lead.lastActivity).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-2">AI Recommendations:</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">Schedule demo</Badge>
                <Badge variant="secondary" className="text-xs">Send proposal</Badge>
                <Badge variant="secondary" className="text-xs">Follow up</Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Deal Prediction Panel
const DealPredictionPanel = () => {
  const dealsWithPrediction = leads.filter(l => l.probability > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Icons.Target className="w-5 h-5 text-indigo-500" />
            Deal Win Prediction
          </h3>
          <p className="text-sm text-muted-foreground">AI-powered deal outcome forecasting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dealsWithPrediction.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="p-4 rounded-xl bg-card border"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium line-clamp-1">{deal.companyName}</h4>
              <Badge className={cn(
                deal.probability >= 70 ? 'bg-emerald-500/10 text-emerald-600' :
                  deal.probability >= 50 ? 'bg-amber-500/10 text-amber-600' :
                    'bg-red-500/10 text-red-600'
              )}>
                {deal.probability >= 70 ? 'High' : deal.probability >= 50 ? 'Medium' : 'Low'}
              </Badge>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${deal.probability * 3.52} 352`}
                  className={cn(
                    deal.probability >= 70 ? 'text-emerald-500' :
                      deal.probability >= 50 ? 'text-amber-500' :
                        'text-red-500'
                  )}
                  initial={{ strokeDasharray: '0 352' }}
                  animate={{ strokeDasharray: `${deal.probability * 3.52} 352` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{deal.probability}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Value</span>
                <span className="font-medium">₹{(deal.value / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stage</span>
                <span className="capitalize">{deal.stage.replace('_', ' ')}</span>
              </div>
            </div>

            {deal.probability < 60 && (
              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Icons.AlertTriangle className="w-3 h-3" />
                  At Risk - Consider follow-up
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Email Generator
const EmailGenerator = () => {
  const [tone, setTone] = useState('professional');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedEmail(`Subject: Follow-up on our discussion

Dear Valued Customer,

I hope this email finds you well. I wanted to follow up on our recent conversation regarding your interest in our ERP solutions.

Based on your requirements, I believe our Enterprise package would be the perfect fit for your organization. Here are the key benefits:

• Comprehensive CRM and Sales modules
• Advanced AI-powered analytics
• 24/7 dedicated support
• Seamless integration with your existing tools

I'd love to schedule a personalized demo to show you how GiggleOrg can transform your business operations. Would you be available for a 30-minute call this week?

Looking forward to hearing from you.

Best regards,
Alex Morgan
Sales Team, GiggleOrg Ecosystem`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Icons.Mail className="w-5 h-5 text-indigo-500" />
            AI Email Generator
          </h3>
          <p className="text-sm text-muted-foreground">Generate personalized emails with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-xl bg-card border space-y-4"
        >
          <div>
            <label className="text-sm font-medium mb-2 block">Email Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Context / Prompt</label>
            <Textarea
              placeholder="Describe what you want to communicate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icons.Sparkles className="w-4 h-4" />
                Generate Email
              </>
            )}
          </Button>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-xl bg-card border"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Generated Email</h4>
            {generatedEmail && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Icons.Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Icons.Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            )}
          </div>

          {generatedEmail ? (
            <div className="p-4 bg-muted/50 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-sans">{generatedEmail}</pre>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Icons.Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Your generated email will appear here</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Performance Forecast
const PerformanceForecast = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Icons.BarChart3 className="w-5 h-5 text-indigo-500" />
            Performance Forecast
          </h3>
          <p className="text-sm text-muted-foreground">AI-powered performance predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-card border"
        >
          <h4 className="font-medium mb-4">Q1 Revenue Forecast</h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Predicted Revenue</span>
                <span className="font-medium">₹32.5L</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium">₹30L</span>
              </div>
              <Progress value={100} className="h-2 bg-muted" />
            </div>

            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <p className="text-sm text-emerald-600 flex items-center gap-2">
                <Icons.TrendingUp className="w-4 h-4" />
                8% above target projected
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Key Drivers:</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">Strong pipeline</Badge>
              <Badge variant="secondary" className="text-xs">High win rate</Badge>
              <Badge variant="secondary" className="text-xs">New enterprise deals</Badge>
            </div>
          </div>
        </motion.div>

        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-card border"
        >
          <h4 className="font-medium mb-4">Team Performance Prediction</h4>

          <div className="space-y-3">
            {employees.slice(0, 4).map((emp) => (
              <div key={emp.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={emp.avatar} />
                  <AvatarFallback>{emp.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                  <Progress
                    value={(emp.performanceScore || 0) + Math.random() * 10}
                    className="h-1.5 mt-1"
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.min(100, Math.round((emp.performanceScore || 0) + Math.random() * 10))}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Recommendations:</p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <Icons.CheckCircle className="w-3 h-3 text-emerald-500" />
                Consider promotion for top 2 performers
              </li>
              <li className="flex items-center gap-2">
                <Icons.CheckCircle className="w-3 h-3 text-emerald-500" />
                Schedule training for underperformers
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main AI Features Component
export const AIFeatures = () => {
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
            <Icons.Sparkles className="w-7 h-7 text-indigo-500" />
            AI Features
          </h1>
          <p className="text-muted-foreground">Leverage AI to enhance productivity and decision making</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="badge-ai gap-1">
            <Icons.Zap className="w-3 h-3" />
            AI Powered
          </Badge>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Leads Scored', value: '156', change: 'Today', icon: 'Target', color: 'indigo' },
          { label: 'Predictions Made', value: '48', change: 'This week', icon: 'Brain', color: 'purple' },
          { label: 'Emails Generated', value: '24', change: 'Saved 12 hrs', icon: 'Mail', color: 'blue' },
          { label: 'Accuracy Rate', value: '94%', change: 'AI Model', icon: 'CheckCircle', color: 'emerald' },
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
                  stat.color === 'purple' && 'bg-purple-500/10',
                  stat.color === 'blue' && 'bg-blue-500/10',
                  stat.color === 'emerald' && 'bg-emerald-500/10',
                )}>
                  <IconComponent className={cn(
                    'w-5 h-5',
                    stat.color === 'indigo' && 'text-indigo-500',
                    stat.color === 'purple' && 'text-purple-500',
                    stat.color === 'blue' && 'text-blue-500',
                    stat.color === 'emerald' && 'text-emerald-500',
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
      <Tabs defaultValue="lead-scoring" className="w-full">
        <TabsList className="grid w-fit grid-cols-5">
          <TabsTrigger value="lead-scoring" className="gap-2">
            <Icons.Target className="w-4 h-4" />
            Lead Scoring
          </TabsTrigger>
          <TabsTrigger value="deal-prediction" className="gap-2">
            <Icons.TrendingUp className="w-4 h-4" />
            Deal Prediction
          </TabsTrigger>
          <TabsTrigger value="email-generator" className="gap-2">
            <Icons.Mail className="w-4 h-4" />
            Email Generator
          </TabsTrigger>
          <TabsTrigger value="forecast" className="gap-2">
            <Icons.BarChart3 className="w-4 h-4" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Icons.Lightbulb className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lead-scoring" className="mt-6">
          <LeadScoringPanel />
        </TabsContent>

        <TabsContent value="deal-prediction" className="mt-6">
          <DealPredictionPanel />
        </TabsContent>

        <TabsContent value="email-generator" className="mt-6">
          <EmailGenerator />
        </TabsContent>

        <TabsContent value="forecast" className="mt-6">
          <PerformanceForecast />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Icons.Sparkles className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                      {insight.actionable && (
                        <Badge className="badge-ai text-xs">Actionable</Badge>
                      )}
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
