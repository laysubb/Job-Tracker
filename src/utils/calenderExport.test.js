import { describe, it, expect } from 'vitest';
import { getGoogleCalendarUrl } from './calendarExport';

describe('Calendar Export Utility', () => {
  it('should generate a valid Google Calendar URL for a reminder', () => {
    const mockReminder = {
      title: 'Technical Interview',
      company: 'Google',
      date: '2026-09-15',
      time: '14:00',
      durationMinutes: 60,
      locationOrLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Prepare system design'
    };

    const url = getGoogleCalendarUrl(mockReminder);

    expect(url).toContain('calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('Google');
  });
});
