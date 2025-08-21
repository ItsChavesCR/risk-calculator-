import type { Risk } from '@/services/risk-service';

/**
 * Converts risk data to CSV format
 */
export function exportRisksToCSV(risks: Risk[]): string {
  const headers = ['Hazard', 'Likelihood', 'Severity', 'Score', 'Level', 'CreatedAt'];
  
  const rows = risks.map(risk => [
    escapeCSVField(risk.hazard),
    risk.likelihood.toString(),
    risk.severity.toString(),
    risk.score.toString(),
    risk.level,
    risk.createdAt.toISOString().split('T')[0], // Date only
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Escapes CSV fields that contain commas or quotes
 */
function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Triggers CSV download in the browser
 */
export function downloadCSV(csvContent: string, filename: string = 'risks.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
