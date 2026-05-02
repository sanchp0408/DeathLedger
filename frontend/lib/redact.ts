// Aadhaar and PAN masking utilities

export function maskAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\s/g, '');
  if (cleaned.length < 4) return 'XXXX XXXX XXXX';
  const last4 = cleaned.slice(-4);
  return `XXXX XXXX ${last4}`;
}

export function maskPAN(pan: string): string {
  if (!pan || pan.length !== 10) return 'XXXXXXXXXX';
  return `XXXXX${pan.slice(5, 9)}${pan.slice(9)}`;
}

export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return 'XXXXXXXX';
  return `XXXXXX${cleaned.slice(-4)}`;
}

// Apply masking at render time — never store raw values
export function sanitizeForDisplay(text: string): string {
  // Mask Aadhaar patterns: 12-digit numbers
  text = text.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, (match) => maskAadhaar(match));
  // Mask PAN patterns: 5 alpha + 4 digit + 1 alpha
  text = text.replace(/\b[A-Z]{5}\d{4}[A-Z]\b/g, (match) => maskPAN(match));
  return text;
}
