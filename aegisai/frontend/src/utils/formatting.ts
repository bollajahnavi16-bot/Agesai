export const formatBytes = (bytes: number = 0, decimals = 1) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'high':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'medium':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'low':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
