// lib/isoTimeFormat.js
const isoTimeFormat = (input) => {
  if (input == null) return '';

  // If it's already a Date or an ISO-like string with a 'T', use Date
  if (input instanceof Date || (typeof input === 'string' && /\dT\d/.test(input))) {
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d)) return String(input);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  // Normalize various time-only strings
  let s = String(input).trim().toUpperCase()
    .replace(/\./g, ':')      // "13.30" -> "13:30"
    .replace(/\s+/g, ' ');    // collapse spaces

  // If it's "HHmm" or "Hmm" (e.g., "1330" or "930"), insert a colon
  const compact = s.match(/^(\d{1,2})(\d{2})$/);
  if (compact) s = `${compact[1]}:${compact[2]}`;

  // Match "H:MM" optionally followed by AM/PM
  const m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return String(input);

  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (Number.isNaN(h) || Number.isNaN(min) || h < 0 || h > 23 || min < 0 || min > 59) {
    return String(input);
  }

  const hasAmPm = !!m[3];
  if (hasAmPm) {
    const periodIn = m[3].toUpperCase();
    // Convert 12h input to 24h to normalize
    if (periodIn === 'AM') h = (h === 12 ? 0 : h);
    else h = (h === 12 ? 12 : h + 12);
  }

  // Convert 24h -> 12h for display
  const periodOut = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;

  const pad2 = (n) => String(n).padStart(2, '0');
  return `${pad2(h12)}:${pad2(min)} ${periodOut}`;
};

export default isoTimeFormat;
