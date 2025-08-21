'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LevelBadge } from '@/components/ui/level-badge';
import { Pencil, Trash2 } from 'lucide-react';
import type { Risk } from '@/services/risk-service';

interface RiskTableProps {
  risks: Risk[];
  onEdit: (risk: Risk) => void;
  onDelete: (id: string) => void;
  onFilter: (q: string, level: string) => void;
}

export function RiskTable({ risks, onEdit, onDelete, onFilter }: RiskTableProps) {
  const [filterQ, setFilterQ] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const handleApplyFilters = (): void => {
    onFilter(filterQ, filterLevel);
  };

  const handleResetFilters = (): void => {
    setFilterQ('');
    setFilterLevel('all');
    onFilter('', 'all');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="filter-q" className="sr-only">Search hazards</Label>
          <Input
            id="filter-q"
            placeholder="Search hazards..."
            value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="w-48">
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
                         <SelectContent>
               <SelectItem value="all">All levels</SelectItem>
               <SelectItem value="Low">Low</SelectItem>
               <SelectItem value="Medium">Medium</SelectItem>
               <SelectItem value="High">High</SelectItem>
               <SelectItem value="Critical">Critical</SelectItem>
             </SelectContent>
          </Select>
        </div>
        <Button onClick={handleApplyFilters} variant="outline">
          Apply
        </Button>
        <Button onClick={handleResetFilters} variant="ghost">
          Reset
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hazard</TableHead>
              <TableHead>Likelihood</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No risks found
                </TableCell>
              </TableRow>
            ) : (
              risks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-medium">{risk.hazard}</TableCell>
                  <TableCell>{risk.likelihood}</TableCell>
                  <TableCell>{risk.severity}</TableCell>
                  <TableCell className="font-semibold">{risk.score}</TableCell>
                  <TableCell>
                    <LevelBadge level={risk.level as any} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(risk)}
                        aria-label={`Edit ${risk.hazard}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${risk.hazard}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Risk</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{risk.hazard}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(risk.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
