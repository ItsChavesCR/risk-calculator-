'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { computeLevel } from '@/domain/risk-domain';
import type { Risk } from '@/services/risk-service';

interface RiskMatrixProps {
  risks: Risk[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const getRiskCount = (likelihood: number, severity: number): number => {
    return risks.filter(risk => risk.likelihood === likelihood && risk.severity === severity).length;
  };

  const getLevelColor = (score: number): string => {
    const level = computeLevel(score);
    switch (level) {
      case 'Low':
        return 'bg-green-100 hover:bg-green-200';
      case 'Medium':
        return 'bg-yellow-100 hover:bg-yellow-200';
      case 'High':
        return 'bg-orange-100 hover:bg-orange-200';
      case 'Critical':
        return 'bg-red-100 hover:bg-red-200';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  const likelihoodLabels = ['1', '2', '3', '4', '5'];
  const severityLabels = ['1', '2', '3', '4', '5'];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Risk Matrix</h2>
      <div className="grid grid-cols-6 gap-1">
        {/* Header row */}
        <div className="text-center font-semibold p-2">Likelihood</div>
        {severityLabels.map(severity => (
          <div key={severity} className="text-center font-semibold p-2">
            Severity {severity}
          </div>
        ))}
        
        {/* Matrix rows */}
        {likelihoodLabels.map(likelihood => (
          <div key={likelihood} className="contents">
            <div className="text-center font-semibold p-2 flex items-center justify-center">
              {likelihood}
            </div>
            {severityLabels.map(severity => {
              const score = parseInt(likelihood) * parseInt(severity);
              const count = getRiskCount(parseInt(likelihood), parseInt(severity));
              const level = computeLevel(score);
              
              return (
                <TooltipProvider key={severity}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`h-16 w-full ${getLevelColor(score)} border border-gray-300`}
                        aria-label={`Likelihood ${likelihood}, Severity ${severity}, Score ${score}, Count ${count}`}
                      >
                        <div className="text-center">
                          <div className="font-semibold">{score}</div>
                          {count > 0 && (
                            <div className="text-sm text-gray-600">({count})</div>
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Score: {score}</p>
                      <p>Level: {level}</p>
                      <p>Risks: {count}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
