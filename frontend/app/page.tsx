import Link from 'next/link';
import type { Metadata } from 'next';
import FeaturesGrid from '@/components/FeaturesGrid';

export const metadata: Metadata = {
  title: 'DeathLedger — Settle Death Claims Without a Lawyer',
  description:
    'AI-powered auditor that detects name mismatches, generates RBI-compliant claim letters, and helps Indian families navigate death claim settlements for free.',
};

export default function HomePage() {
  return (
    <>
      {/* ===== NAV ===== */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 40px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '-0.02em',
          }}>
            DeathLedger
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <nav style={{ display: 'flex', gap: '28px' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Demo', href: '/audit' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/audit" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
            Start Audit →
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E6EEF8 50%, #F8FAFC 100%)',
        padding: '80px 40px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,61,145,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '24px',
              border: '1px solid rgba(10,61,145,0.2)',
            }}>
              ⚖️ Citing RBI Circular RBI/2025-26/95
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '52px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
            }}>
              Settle Death Claims{' '}
              <span style={{ color: 'var(--color-primary)' }}>Without a Lawyer</span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '480px',
            }}>
              Automatically detect name mismatches, generate claim letters citing RBI 2025-26/95,
              and walk into any bank fully prepared.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/audit" className="btn-primary" style={{
                textDecoration: 'none',
                padding: '14px 28px',
                fontSize: '16px',
                boxShadow: '0 4px 20px rgba(10,61,145,0.25)',
              }}>
                Start Free Audit
              </Link>
              <Link href="/audit" className="btn-ghost" style={{
                textDecoration: 'none',
                padding: '14px 28px',
                fontSize: '16px',
              }}>
                ▶ Watch Demo
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '28px', marginTop: '36px', flexWrap: 'wrap' }}>
              {[
                { value: '4 sec', label: 'Audit time' },
                { value: '₹0', label: 'Legal fees' },
                { value: '15 day', label: 'RBI SLA' },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mockup Dashboard Card */}
          <div style={{ position: 'relative' }}>
            <div className="card-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '20px' }}>🔍</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700 }}>Audit Results</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Sunita Devi • SBI • 2 May 2026</div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  background: 'var(--color-critical-bg)',
                  color: 'var(--color-critical)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: '1px solid var(--color-critical)',
                }}>CRITICAL</div>
              </div>

              {/* Mini stat boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { n: 1, label: 'OK', color: 'var(--color-ok)', bg: 'var(--color-ok-bg)' },
                  { n: 0, label: 'MINOR', color: 'var(--color-minor)', bg: 'var(--color-minor-bg)' },
                  { n: 3, label: 'CRITICAL', color: 'var(--color-critical)', bg: 'var(--color-critical-bg)' },
                ].map((s) => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: s.color }}>{s.n}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: s.color, letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Mini contradiction table */}
              {[
                { docA: 'Death Cert', docB: 'Aadhaar', score: 100, severity: 'OK' as const },
                { docA: 'Death Cert', docB: 'Bank Pass.', score: 62, severity: 'CRITICAL' as const },
                { docA: 'Death Cert', docB: 'PAN Card', score: 78, severity: 'CRITICAL' as const },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 0',
                  borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{ flex: 1, fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.docA}</span>
                    <span style={{ color: 'var(--color-text-muted)', margin: '0 4px' }}>→</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{row.docB}</span>
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '9999px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: row.severity === 'OK' ? 'var(--color-ok-bg)' : 'var(--color-critical-bg)',
                    color: row.severity === 'OK' ? 'var(--color-ok)' : 'var(--color-critical)',
                  }}>
                    {row.score}% {row.severity === 'OK' ? '✅' : '🔴'} {row.severity}
                  </span>
                </div>
              ))}

              {/* Action buttons preview */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <div style={{
                  flex: 1,
                  background: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}>📄 Download Packet</div>
                <div style={{
                  flex: 1,
                  background: '#25D366',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}>📱 WhatsApp</div>
              </div>
            </div>

            {/* Floating badge */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              right: '-14px',
              background: 'var(--color-accent)',
              color: 'white',
              borderRadius: '9999px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(165,0,52,0.3)',
            }}>
              ⚡ 4 seconds
            </div>
          </div>
        </div>
      </section>

      {/* ===== PAIN POINT BANNER ===== */}
      <section style={{
        background: 'linear-gradient(90deg, var(--color-primary) 0%, #1550B0 100%)',
        padding: '28px 40px',
        textAlign: 'center',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '16px',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          <strong style={{ color: 'white' }}>Sunita Devi, 58, Varanasi</strong> visited her SBI branch{' '}
          <strong style={{ color: '#FCD34D' }}>11 times</strong> and spent{' '}
          <strong style={{ color: '#FCD34D' }}>₹43,000</strong> — because 3 documents spelled her husband&apos;s name differently.{' '}
          <strong style={{ color: 'white' }}>DeathLedger catches this in 4 seconds.</strong>
        </p>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="label-caps" style={{ marginBottom: '12px' }}>Why DeathLedger</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
            Everything you need in one place
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            No lawyers. No consultants. Just AI that knows Indian banking law.
          </p>
        </div>

        <FeaturesGrid />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ background: 'var(--color-primary-light)', padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="label-caps" style={{ marginBottom: '12px' }}>The Process</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--color-text-primary)' }}>
              Three steps to claim settlement
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: '0' }}>
            {[
              {
                step: '01',
                icon: '📁',
                title: 'Upload Documents',
                desc: 'Drag and drop your Death Certificate, Aadhaar, PAN, Passbook and any other documents.',
              },
              null, // arrow
              {
                step: '02',
                icon: '🤖',
                title: 'AI Audit',
                desc: 'Our engine detects name mismatches, checks for missing documents, and flags regulatory issues.',
              },
              null, // arrow
              {
                step: '03',
                icon: '⬇️',
                title: 'Download Packet',
                desc: 'Get a complete claim packet: covering letter, contradiction report, affidavit — ready to submit.',
              },
            ].map((item, i) =>
              item === null ? (
                <div key={i} style={{ textAlign: 'center', fontSize: '24px', color: 'var(--color-primary)', opacity: 0.5 }}>→</div>
              ) : (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: 'var(--radius)',
                  padding: '28px 24px',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '9999px',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}>
                    STEP {item.step}
                  </div>
                  <div style={{ fontSize: '40px', marginBottom: '14px', marginTop: '8px' }}>{item.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              )
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/audit" className="btn-primary" style={{
              textDecoration: 'none',
              padding: '16px 40px',
              fontSize: '16px',
              boxShadow: '0 4px 20px rgba(10,61,145,0.25)',
            }}>
              Start Your Audit — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* ===== INSTITUTIONS ===== */}
      <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div className="label-caps" style={{ marginBottom: '24px' }}>Supported Institutions</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { name: 'SBI', fullName: 'State Bank of India', color: '#0A3D91', bg: '#E6EEF8' },
            { name: 'LIC', fullName: 'Life Insurance Corp.', color: '#8B0000', bg: '#FFF0F0' },
            { name: 'HDFC', fullName: 'HDFC Bank', color: '#A50034', bg: '#FFF0F3' },
            { name: 'ICICI', fullName: 'ICICI Bank', color: '#F47920', bg: '#FFF8F0' },
          ].map((inst) => (
            <div
              key={inst.name}
              style={{
                background: inst.bg,
                border: `2px solid ${inst.color}30`,
                borderRadius: 'var(--radius)',
                padding: '20px 28px',
                minWidth: '160px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: inst.color }}>
                {inst.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{inst.fullName}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: 'var(--color-text-primary)',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            color: 'white',
          }}>
            DeathLedger
          </span>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '8px' }}>
          Built for Bharat. Zero legal fees. Zero data sold.
        </p>
        <p style={{ color: '#64748B', fontSize: '12px' }}>
          Cites RBI/2025-26/95 • Banking Regulation Act 1949 • IRDAI Guidelines 2024
        </p>
        <p style={{ color: '#475569', fontSize: '11px', marginTop: '16px' }}>
          DeathLedger is an AI-assisted tool. Always verify legal requirements with a qualified professional.
        </p>
      </footer>
    </>
  );
}
