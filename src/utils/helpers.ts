export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 0) totalMinutes = 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Social': return 'bg-rose-500 text-rose-50';
    case 'Entertainment': return 'bg-amber-500 text-amber-50';
    case 'Productivity': return 'bg-emerald-500 text-emerald-50';
    case 'Games': return 'bg-indigo-500 text-indigo-50';
    case 'Reading': return 'bg-sky-500 text-sky-50';
    case 'Utilities': return 'bg-slate-500 text-slate-50';
    default: return 'bg-slate-500 text-slate-50';
  }
}

export function getProgressColorClass(percentage: number): {
  bar: string;
  badge: string;
  text: string;
} {
  if (percentage >= 100) {
    return {
      bar: 'bg-red-500',
      badge: 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      text: 'text-red-600 dark:text-red-400',
    };
  }
  if (percentage >= 80) {
    return {
      bar: 'bg-amber-500',
      badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400',
    };
  }
  return {
    bar: 'bg-indigo-600',
    badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    text: 'text-slate-700 dark:text-slate-300',
  };
}
