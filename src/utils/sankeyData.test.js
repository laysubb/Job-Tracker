import { describe, it, expect } from 'vitest';
import { buildSankeyData } from './sankeyData';

describe('Sankey Diagram Generator', () => {
  it('should return empty nodes and links for empty jobs list', () => {
    const result = buildSankeyData([]);
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
    expect(result.sankeyMaticText).toBe('');
  });

  it('should compute nodes and links correctly from applications', () => {
    const mockJobs = [
      { id: '1', status: 'applied', history: [] },
      { id: '2', status: 'first_interview', history: [{ stage: 'first_interview' }] },
      { id: '3', status: 'offer', history: [{ stage: 'first_interview' }, { stage: 'offer' }] },
      { id: '4', status: 'rejected', history: [{ stage: 'applied' }] },
    ];

    const result = buildSankeyData(mockJobs);

    expect(result.nodes.length).toBeGreaterThan(0);
    expect(result.links.length).toBeGreaterThan(0);
    expect(result.sankeyMaticText).toContain('Applications');
  });
});
