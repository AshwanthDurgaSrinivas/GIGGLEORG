import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KPIData } from '@/types';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from 'recharts';

interface KPICardProps {
  data: KPIData;
  index?: number;
  variant?: 'default' | 'gradient' | 'ai';
}

export const KPICard = ({ data, index = 0, variant = 'default' }: KPICardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[data.icon] || Icons.Activity;
  
  const isPositive = data.changeType === 'increase';
  const isNeutral = data.changeType === 'neutral';
  
  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value;
    if (value >= 100000) {
      return `${data.prefix || ''}${(value / 100000).toFixed(1)}L${data.suffix || ''}`;
    }
    if (value >= 1000) {
      return `${data.prefix || ''}${(value / 1000).toFixed(1)}K${data.suffix || ''}`;
    }
    return `${data.prefix || ''}${value}${data.suffix || ''}`;
  };

  const chartData = data.trend?.map((value, i) => ({ value, index: i })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -2 }}
      className={cn(
        'relative overflow-hidden rounded-xl p-5 border transition-all duration-300',
        variant === 'default' && 'bg-card border-border hover:shadow-soft',
        variant === 'gradient' && 'gradient-primary text-white border-transparent',
        variant === 'ai' && 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 ai-glow',
        'card-hover'
      )}
    >
      {/* Background Pattern */}
      {variant === 'ai' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl ai-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl ai-pulse animation-delay-500" />
        </div>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            variant === 'default' && 'bg-primary/10',
            variant === 'gradient' && 'bg-white/20',
            variant === 'ai' && 'bg-indigo-500/20'
          )}>
            <IconComponent className={cn(
              'w-5 h-5',
              variant === 'default' && 'text-primary',
              variant === 'gradient' && 'text-white',
              variant === 'ai' && 'text-indigo-500'
            )} />
          </div>
          
          {/* Trend Indicator */}
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            isPositive && (variant === 'gradient' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'),
            !isPositive && !isNeutral && (variant === 'gradient' ? 'bg-white/20 text-white' : 'bg-red-500/10 text-red-600 dark:text-red-400'),
            isNeutral && (variant === 'gradient' ? 'bg-white/20 text-white' : 'bg-gray-500/10 text-gray-600 dark:text-gray-400')
          )}>
            {isPositive ? (
              <Icons.TrendingUp className="w-3 h-3" />
            ) : !isNeutral ? (
              <Icons.TrendingDown className="w-3 h-3" />
            ) : (
              <Icons.Minus className="w-3 h-3" />
            )}
            <span>{Math.abs(data.change)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className={cn(
            'text-2xl font-bold',
            variant === 'gradient' && 'text-white'
          )}>
            {formatValue(data.value)}
          </h3>
          <p className={cn(
            'text-sm',
            variant === 'gradient' ? 'text-white/70' : 'text-muted-foreground'
          )}>
            {data.title}
          </p>
        </div>

        {/* Sparkline Chart */}
        {chartData.length > 0 && (
          <div className="mt-4 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={variant === 'gradient' ? 'rgba(255,255,255,0.5)' : 'hsl(var(--primary))'}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};
