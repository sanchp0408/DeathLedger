import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior Indian banking legal expert specialising in death claim settlements under RBI regulations. You have deep expertise in the Banking Regulation Act 1949, RBI Master Directions on Customer Service, and IRDAI regulations.

Your task is to write a formal, authoritative covering letter on behalf of a deceased person's family member (the claimant) to be submitted to a bank or insurance company along with their death claim documents.

The letter MUST:
1. Be addressed to "The Branch Manager" or "The Claims Officer" of the specified institution
2. Cite RBI Circular RBI/2025-26/95 (October 28, 2025) — specifically referencing the "Simplified Procedure" (Annex I-B) if claim amount is under ₹15 Lakhs
3. Address all detected name mismatches as "clerical inconsistencies" — use the exact phrase "orthographic variation" or "typographical abbreviation" to describe initial-vs-full-name discrepancies
4. If nominee exists: Cite Section 45ZA and 45ZC of the Banking Regulation Act, 1949, explicitly stating that demand for Succession Certificate or Indemnity Bond is not legally permissible
5. Reference the 15-working-day settlement obligation under RBI directions and the interest liability for delay
6. Use formal legal English. Structure with numbered paragraphs.
7. End with: "This letter is prepared with the assistance of AI-based regulatory compliance tool DeathLedger and reflects current RBI/IRDAI regulatory positions as of 2026."

Output ONLY the letter text. Do not include explanations, preamble, or markdown formatting outside the letter content.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      claimantName,
      deceasedName,
      institution,
      accountNo,
      mismatches,
      nomineeExists,
      claimAmount,
    } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const mismatchDesc = (mismatches || [])
      .map((m: { docA: string; nameA: string; docB: string; nameB: string; severity: string }) =>
        `- "${m.nameA}" (${m.docA}) vs "${m.nameB}" (${m.docB}) — Severity: ${m.severity}`
      )
      .join('\n');

    const userMessage = `Generate a formal claim letter for:
- Claimant: ${claimantName}
- Deceased: ${deceasedName}
- Institution: ${institution}
- Account/Policy: ${accountNo || 'Not specified'}
- Claim Amount: ₹${claimAmount?.toLocaleString('en-IN') || 'Not specified'}
- Nominee exists: ${nomineeExists ? 'Yes' : 'No'}

Detected name mismatches:
${mismatchDesc || 'No mismatches detected'}

${claimAmount && claimAmount < 1500000 ? 'IMPORTANT: Claim is under ₹15L — apply Simplified Procedure under RBI/2025-26/95 Annex I-B.' : ''}
${nomineeExists ? 'IMPORTANT: Nominee exists — cite Section 45ZA and 45ZC to protect against illegal demands.' : ''}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const letterText = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ letter: letterText });
  } catch (error) {
    console.error('Letter generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate letter' },
      { status: 500 }
    );
  }
}
