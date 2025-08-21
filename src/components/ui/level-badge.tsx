import { Badge } from '@/components/ui/badge';
import type { RiskLevel } from '@/domain/risk-domain';

interface LevelBadgeProps {
  level: RiskLevel;
  className?: string;
}

const levelStyles: Record<RiskLevel, string> = {
  Low: 'bg-green-100 text-green-800 border-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  High: 'bg-orange-100 text-orange-800 border-orange-300',
  Critical: 'bg-red-100 text-red-800 border-red-300',
};

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${levelStyles[level]} ${className || ''}`}
    >
      {level}
    </Badge>
  );
}
