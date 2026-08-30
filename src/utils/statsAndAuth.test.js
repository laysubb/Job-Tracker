import { describe, it, expect } from 'vitest';

describe('Application Stats & Calculation Rules', () => {
  const mockJobs = [
    { id: '1', status: 'applied' },
    { id: '2', status: 'assessment' },
    { id: '3', status: 'first_interview' },
    { id: '4', status: 'offer' },
    { id: '5', status: 'accepted' },
    { id: '6', status: 'rejected' },
  ];

  it('should accurately calculate total applications', () => {
    expect(mockJobs.length).toBe(6);
  });

  it('should accurately count active in-progress applications', () => {
    const active = mockJobs.filter(j =>
      ['applied', 'assessment', 'first_interview', 'second_interview', 'final_round'].includes(j.status)
    ).length;
    expect(active).toBe(3); // applied, assessment, first_interview
  });

  it('should accurately count offers landed', () => {
    const offers = mockJobs.filter(j => ['offer', 'accepted'].includes(j.status)).length;
    expect(offers).toBe(2);
  });

  it('should calculate offer rate percentage', () => {
    const total = mockJobs.length;
    const offers = mockJobs.filter(j => ['offer', 'accepted'].includes(j.status)).length;
    const rate = Math.round((offers / total) * 100);
    expect(rate).toBe(33); // 2/6 = 33%
  });
});

describe('Authentication Validation Rules', () => {
  it('should enforce password minimum length of 6 characters', () => {
    const isPasswordValid = (pwd) => pwd.length >= 6;
    expect(isPasswordValid('12345')).toBe(false);
    expect(isPasswordValid('123456')).toBe(true);
    expect(isPasswordValid('securePassword123')).toBe(true);
  });

  it('should validate password confirmation matching', () => {
    const doPasswordsMatch = (p1, p2) => p1 === p2;
    expect(doPasswordsMatch('secret123', 'secret123')).toBe(true);
    expect(doPasswordsMatch('secret123', 'different123')).toBe(false);
  });
});
