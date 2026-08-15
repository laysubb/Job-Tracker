/**
 * Formats a Date object or ISO string to ICS format: YYYYMMDDTHHmmssZ
 */
export function formatIcsDate(dateObj) {
  const pad = (num) => String(num).padStart(2, '0');
  const year = dateObj.getUTCFullYear();
  const month = pad(dateObj.getUTCMonth() + 1);
  const day = pad(dateObj.getUTCDate());
  const hours = pad(dateObj.getUTCHours());
  const minutes = pad(dateObj.getUTCMinutes());
  const seconds = pad(dateObj.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Creates an ICS event text snippet
 */
export function createIcsEventString({
  id,
  title,
  company,
  role,
  date, // "YYYY-MM-DD"
  time = "10:00", // "HH:MM"
  durationMinutes = 60,
  type = "Interview",
  locationOrLink = "",
  notes = "",
}) {
  // Parse date and time
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const startFormatted = formatIcsDate(startDate);
  const endFormatted = formatIcsDate(endDate);
  const nowFormatted = formatIcsDate(new Date());

  const eventUid = `${id || Math.random().toString(36).substring(2)}@careerpulse.jobtracker`;
  const summary = `[${type}] ${company ? `${company} - ` : ''}${title || role || 'Job Deadline'}`;
  const description = `Role: ${role || 'N/A'}\\nCompany: ${company || 'N/A'}\\nType: ${type}\\n${locationOrLink ? `Meeting Link / Portal: ${locationOrLink}\\n` : ''}${notes ? `Notes: ${notes}\\n` : ''}Managed with CareerPulse Job Tracker`;

  return [
    'BEGIN:VEVENT',
    `UID:${eventUid}`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${summary.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${description.replace(/,/g, '\\,')}`,
    locationOrLink ? `LOCATION:${locationOrLink.replace(/,/g, '\\,')}` : `LOCATION:${company || 'Online'}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${summary.replace(/,/g, '\\,')}`,
    'END:VALARM',
    'END:VEVENT'
  ].join('\r\n');
}

/**
 * Downloads a single event as an .ics file
 */
export function downloadEventIcs(event) {
  const eventContent = createIcsEventString(event);
  const icsFile = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CareerPulse//Job Tracker Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    eventContent,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsFile], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const sanitizedTitle = (event.title || event.company || 'reminder').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  link.href = url;
  link.setAttribute('download', `${sanitizedTitle}_reminder.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads multiple reminders into one .ics file
 */
export function downloadBulkIcs(reminders) {
  if (!reminders || reminders.length === 0) return;

  const eventStrings = reminders.map(r => createIcsEventString(r)).join('\r\n');
  const icsFile = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CareerPulse//Job Tracker Bulk Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Job Hunting Tracker Reminders',
    'X-WR-TIMEZONE:Asia/Kuala_Lumpur',
    eventStrings,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsFile], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `job_tracker_all_deadlines.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates direct Google Calendar Web Link (1-click add to Google Calendar)
 */
export function getGoogleCalendarUrl(event) {
  const [year, month, day] = (event.date || '2026-08-01').split('-').map(Number);
  const [hours, minutes] = (event.time || '10:00').split(':').map(Number);
  const duration = event.durationMinutes || 60;

  const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

  const startFormatted = formatIcsDate(startDate);
  const endFormatted = formatIcsDate(endDate);

  const title = `[${event.type || 'Interview'}] ${event.company ? `${event.company} - ` : ''}${event.title || event.role || 'Job Deadline'}`;
  const details = `Role: ${event.role || 'N/A'}\nCompany: ${event.company || 'N/A'}\nType: ${event.type || 'Interview'}\n${event.locationOrLink ? `Meeting Link / Portal: ${event.locationOrLink}\n` : ''}${event.notes ? `Notes: ${event.notes}\n` : ''}Managed with CareerPulse Job Tracker`;
  const location = event.locationOrLink || event.company || 'Online';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startFormatted}/${endFormatted}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
