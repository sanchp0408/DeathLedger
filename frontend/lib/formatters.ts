export function maskPrivacyData(type: 'aadhaar' | 'pan', value: string): string {
  if (!value) return '';
  
  if (type === 'aadhaar') {
    // Aadhaar format: 1234 5678 9012 -> XXXX XXXX 9012
    const cleaned = value.replace(/\s+/g, '');
    if (cleaned.length !== 12) return value; // If invalid length, just return it
    const last4 = cleaned.slice(-4);
    return `XXXX XXXX ${last4}`;
  }
  
  if (type === 'pan') {
    // PAN format: ABCDE1234F -> XXXXX1234X
    const cleaned = value.trim();
    if (cleaned.length !== 10) return value;
    const first5 = cleaned.slice(0, 5).replace(/./g, 'X');
    const mid4 = cleaned.slice(5, 9);
    const last1 = 'X';
    return `${first5}${mid4}${last1}`;
  }
  
  return value;
}
