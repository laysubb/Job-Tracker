import { describe, it, expect } from 'vitest';
import { sortJobsByAppliedDateAsc, formatJobsAsText } from './textExport';

describe('textExport utility', () => {
  it('should sort jobs in ascending order by appliedDate (earlier to latest)', () => {
    const mockJobs = [
      { id: '1', company: 'Google', role: 'SWE', appliedDate: '2026-08-15' },
      { id: '2', company: 'Apple', role: 'iOS Dev', appliedDate: '2026-08-01' },
      { id: '3', company: 'Microsoft', role: 'PM', appliedDate: '2026-08-10' },
    ];

    const sorted = sortJobsByAppliedDateAsc(mockJobs);
    expect(sorted[0].company).toBe('Apple');
    expect(sorted[1].company).toBe('Microsoft');
    expect(sorted[2].company).toBe('Google');
  });

  it('should format jobs correctly with and without links', () => {
    const mockJobs = [
      {
        company: 'Google',
        role: 'SWE II',
        appliedDate: '2026-08-01',
        portalUrl: 'https://careers.google.com/jobs/123'
      },
      {
        company: 'Apple',
        role: 'iOS Engineer',
        appliedDate: '2026-08-05',
        portalUrl: ''
      },
      {
        company: 'Netflix',
        role: 'Frontend Engineer',
        appliedDate: '2026-08-03'
      }
    ];

    const result = formatJobsAsText(mockJobs);
    const expected = [
      '1. Google - SWE II (https://careers.google.com/jobs/123)',
      '2. Netflix - Frontend Engineer',
      '3. Apple - iOS Engineer'
    ].join('\n');

    expect(result).toBe(expected);
  });

  it('should handle empty or null jobs array', () => {
    expect(formatJobsAsText([])).toBe('');
    expect(formatJobsAsText(null)).toBe('');
    expect(formatJobsAsText(undefined)).toBe('');
  });

  it('should handle whitespace in fields gracefully', () => {
    const mockJobs = [
      {
        company: '  Amazon  ',
        role: ' SDE 1 ',
        appliedDate: '2026-08-01',
        portalUrl: '  https://amazon.jobs/456  '
      }
    ];

    const result = formatJobsAsText(mockJobs);
    expect(result).toBe('1. Amazon - SDE 1 (https://amazon.jobs/456)');
  });
});
