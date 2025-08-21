'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LIKELIHOOD_OPTIONS, SEVERITY_OPTIONS, getDefaultLikelihood, getDefaultSeverity } from '@/domain/risk-domain';
import type { Risk } from '@/services/risk-service';

interface RiskFormProps {
  onSubmit: (data: { hazard: string; likelihood: number; severity: number }) => void;
  editingRisk?: Risk | null;
  onCancel?: () => void;
}

export function RiskForm({ onSubmit, editingRisk, onCancel }: RiskFormProps) {
  const [hazard, setHazard] = useState(editingRisk?.hazard || '');
  const [likelihood, setLikelihood] = useState<string>(
    editingRisk ? LIKELIHOOD_OPTIONS.find(opt => opt.value === editingRisk.likelihood)?.label || 'Impossible' : 'Impossible'
  );
  const [severity, setSeverity] = useState<string>(
    editingRisk ? SEVERITY_OPTIONS.find(opt => opt.value === editingRisk.severity)?.label || 'Insignificant' : 'Insignificant'
  );

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!hazard.trim()) return;
    
    const likelihoodValue = LIKELIHOOD_OPTIONS.find(opt => opt.label === likelihood)?.value || getDefaultLikelihood();
    const severityValue = SEVERITY_OPTIONS.find(opt => opt.label === severity)?.value || getDefaultSeverity();
    
    onSubmit({
      hazard: hazard.trim(),
      likelihood: likelihoodValue,
      severity: severityValue,
    });
    
    if (!editingRisk) {
      setHazard('');
      setLikelihood('Impossible');
      setSeverity('Insignificant');
    }
  };

  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    } else {
      setHazard('');
      setLikelihood('Impossible');
      setSeverity('Insignificant');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 items-end">
      <div className="col-span-5 space-y-2">
        <Label htmlFor="hazard" className="text-xl font-semibold">
          Hazard
        </Label>
        <Input
          id="hazard"
          value={hazard}
          onChange={(e) => setHazard(e.target.value)}
          placeholder="What could cause harm?"
          className="h-10"
          aria-describedby="hazard-help"
        />
        <p id="hazard-help" className="text-muted-foreground text-sm">
          What could cause harm?
        </p>
      </div>

      <div className="col-span-3 space-y-2">
        <Label htmlFor="likelihood" className="text-xl font-semibold">
          Likelihood
        </Label>
        <Select value={likelihood} onValueChange={setLikelihood}>
          <SelectTrigger id="likelihood" className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(LIKELIHOOD_OPTIONS.map(opt => opt.group))).map(group => (
              <SelectGroup key={group}>
                <SelectLabel>{group}</SelectLabel>
                {LIKELIHOOD_OPTIONS
                  .filter(opt => opt.group === group)
                  .map(option => (
                    <SelectItem key={option.label} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          How likely is it to cause harm?
        </p>
      </div>

      <div className="col-span-3 space-y-2">
        <Label htmlFor="severity" className="text-xl font-semibold">
          Severity
        </Label>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger id="severity" className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(SEVERITY_OPTIONS.map(opt => opt.group))).map(group => (
              <SelectGroup key={group}>
                <SelectLabel>{group}</SelectLabel>
                {SEVERITY_OPTIONS
                  .filter(opt => opt.group === group)
                  .map(option => (
                    <SelectItem key={option.label} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          How severe could the harm be?
        </p>
      </div>

      <div className="col-span-1 flex gap-2">
        <Button 
          type="submit" 
          className="bg-emerald-500 hover:bg-emerald-600 text-white h-10"
        >
          {editingRisk ? 'Save' : 'Calculate'}
        </Button>
        {editingRisk && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="h-10"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
