/**
 * Sorts jobs by appliedDate in ascending order (earliest applied to latest applied).
 * Falls back to created_at or empty string if appliedDate is absent.
 */
export function sortJobsByAppliedDateAsc(jobs = []) {
  return [...jobs].sort((a, b) => {
    const dateA = a?.appliedDate || (a?.created_at ? a.created_at.split('T')[0] : '') || '';
    const dateB = b?.appliedDate || (b?.created_at ? b.created_at.split('T')[0] : '') || '';

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateA.localeCompare(dateB);
  });
}

/**
 * Formats a list of jobs into ordered plain text format in ascending order (earlier to latest):
 * 1. Company - Job Title (link to job (if have))
 * 2. Company2 - Job Title
 *
 * @param {Array} jobs - Array of job objects
 * @returns {string} Formatted text
 */
export function formatJobsAsText(jobs = []) {
  if (!jobs || jobs.length === 0) {
    return '';
  }

  const sortedJobs = sortJobsByAppliedDateAsc(jobs);

  return sortedJobs
    .map((job, index) => {
      const company = job?.company?.trim() || 'Untitled Company';
      const role = job?.role?.trim() || 'Untitled Role';
      const link = job?.portalUrl?.trim();

      if (link) {
        return `${index + 1}. ${company} - ${role} (${link})`;
      }
      return `${index + 1}. ${company} - ${role}`;
    })
    .join('\n');
}

/**
 * Trigger download of plain text file
 */
export function downloadTextFile(content, filename) {
  const dateStr = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `careerpulse_jobs_${dateStr}.txt`;
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
