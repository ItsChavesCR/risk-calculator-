'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { RiskForm } from '@/components/risk-form';
import { RiskMatrix } from '@/components/risk-matrix';
import { RiskTable } from '@/components/risk-table';
import { LevelBadge } from '@/components/ui/level-badge';
import { exportRisksToCSV, downloadCSV } from '@/utils/csv';
import type { Risk } from '@/services/risk-service';

export default function RiskCalculatorPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [filteredRisks, setFilteredRisks] = useState<Risk[]>([]);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [lastCalculatedRisk, setLastCalculatedRisk] = useState<Risk | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load risks on component mount
  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async (q = '', level = ''): Promise<void> => {
    try {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (level) params.append('level', level);
      
      const response = await fetch(`/api/risks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch risks');
      
      const data = await response.json();
      setRisks(data);
      setFilteredRisks(data);
    } catch (error) {
      console.error('Error fetching risks:', error);
      toast.error('Failed to load risks');
    }
  };

  const handleSubmit = async (data: { hazard: string; likelihood: number; severity: number }): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (editingRisk) {
        // Update existing risk
        const response = await fetch(`/api/risks/${editingRisk.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to update risk');
        
        const updatedRisk = await response.json();
        setRisks(prev => prev.map(r => r.id === updatedRisk.id ? updatedRisk : r));
        setFilteredRisks(prev => prev.map(r => r.id === updatedRisk.id ? updatedRisk : r));
        setEditingRisk(null);
        toast.success('Risk updated successfully');
      } else {
        // Create new risk
        const response = await fetch('/api/risks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to create risk');
        
        const newRisk = await response.json();
        setRisks(prev => [newRisk, ...prev]);
        setFilteredRisks(prev => [newRisk, ...prev]);
        setLastCalculatedRisk(newRisk);
        toast.success('Risk calculated and saved');
      }
    } catch (error) {
      console.error('Error saving risk:', error);
      toast.error('Failed to save risk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (risk: Risk): void => {
    setEditingRisk(risk);
  };

  const handleCancelEdit = (): void => {
    setEditingRisk(null);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/risks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete risk');
      
      setRisks(prev => prev.filter(r => r.id !== id));
      setFilteredRisks(prev => prev.filter(r => r.id !== id));
      setEditingRisk(null);
      toast.success('Risk deleted successfully');
    } catch (error) {
      console.error('Error deleting risk:', error);
      toast.error('Failed to delete risk');
    }
  };

  const handleFilter = (q: string, level: string): void => {
    setFilteredRisks(risks.filter(risk => {
      const matchesQuery = !q || risk.hazard.toLowerCase().includes(q.toLowerCase());
      const matchesLevel = level === 'all' || !level || risk.level === level;
      return matchesQuery && matchesLevel;
    }));
  };

  const handleExportCSV = (): void => {
    const csvContent = exportRisksToCSV(filteredRisks);
    downloadCSV(csvContent, 'risks.csv');
    toast.success('CSV exported successfully');
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Risk Calculator</h1>
            <p className="text-muted-foreground mt-2">
              Assess and manage risks with likelihood and severity analysis
            </p>
          </div>
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Risk Form */}
        <Card>
          <CardHeader>
            <CardTitle>Calculate Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskForm
              onSubmit={handleSubmit}
              editingRisk={editingRisk}
              onCancel={handleCancelEdit}
            />
          </CardContent>
        </Card>

        {/* Last Calculated Risk Result */}
        {lastCalculatedRisk && !editingRisk && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-emerald-800">Risk Calculated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-6xl font-bold text-emerald-600">
                  {lastCalculatedRisk.score}
                </div>
                <div className="space-y-2">
                  <LevelBadge level={lastCalculatedRisk.level as any} className="text-lg px-4 py-2" />
                  <p className="text-emerald-700">
                    L×S = {lastCalculatedRisk.likelihood}×{lastCalculatedRisk.severity}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Risk Matrix */}
        <Card>
          <CardContent className="pt-6">
            <RiskMatrix risks={filteredRisks} />
          </CardContent>
        </Card>

        <Separator />

        {/* Risk Table */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Register</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskTable
              risks={filteredRisks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFilter={handleFilter}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
