"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Search, ChevronRight, Play, ArrowRight, FileText, CheckCircle2, AlertCircle, Scale, Globe, Landmark, Clock, Bot, Download, FolderUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC' }}>
      {/* ===== NAV ===== */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#004C8F', // HDFC Blue
        padding: '0 40px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'white', padding: '6px', borderRadius: '4px' }}>
            <Shield size={28} color="#ED232A" strokeWidth={2} /> {/* HDFC Red */}
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '0.5px',
          }}>
            DeathLedger
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <nav style={{ display: 'flex', gap: '28px' }}>
            {[
              { label: 'Personal', href: '#' },
              { label: 'NRI', href: '#' },
              { label: 'SME', href: '#' },
              { label: 'Wholesale', href: '#' },
              { label: 'About Us', href: '#' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: 'rgba(255,255,255,0.9)',
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
          <Link href="/audit" style={{
            background: '#ED232A',
            color: 'white',
            textDecoration: 'none',
            padding: '8px 24px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            LOGIN <ChevronRight size={16} strokeWidth={3} />
          </Link>
        </div>
      </nav>

      <div style={{ background: 'white', padding: '12px 40px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '32px', fontSize: '13px', color: '#475569', fontWeight: 500 }}>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Discover Products <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} /></span>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Need Help <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} /></span>
        <span style={{ cursor: 'pointer' }}>Better Claim Choices®</span>
      </div>

      {/* ===== HERO (Screenshot 3 Style) ===== */}
      <section style={{
        position: 'relative',
        height: '550px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'url("https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1600&auto=format&fit=crop") center/cover',
          zIndex: 0,
        }} />
        {/* Gradient Overlay for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,76,143,0.9) 0%, rgba(0,76,143,0.4) 50%, transparent 100%)',
          zIndex: 1,
        }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '56px',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            Experience Claim Settlement Differently
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            fontWeight: 500,
            lineHeight: 1.5,
          }}>
            Introducing the New DeathLedger AI Auditor.<br />
            Detect name mismatches in seconds.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/audit" style={{
              background: 'white',
              color: '#004C8F',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              Start Free Audit <ChevronRight size={16} strokeWidth={2.5} color="#ED232A" />
            </Link>
            <Link href="#demo" style={{
              background: 'white',
              color: '#004C8F',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              Watch Demo <ChevronRight size={16} strokeWidth={2.5} color="#ED232A" />
            </Link>
          </div>
        </motion.div>

        {/* Floating Search Bar (Ask EVA style) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            width: '80%',
            maxWidth: '800px',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 3,
          }}
        >
          <Bot size={28} color="#004C8F" />
          <input
            type="text"
            placeholder="What are you looking for today? (e.g., Succession Certificate)"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              color: '#1E293B',
              fontWeight: 500,
            }}
          />
          <Search size={24} color="#94A3B8" />
        </motion.div>
      </section>

      {/* ===== BANKING SOLUTIONS / FEATURES (Screenshot 1 Style) ===== */}
      <section style={{ padding: '80px 40px', background: 'white', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: '#1E293B', marginBottom: '24px', fontWeight: 700 }}>
          Banking Solutions tailor-made for you
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', borderBottom: '2px solid #E2E8F0', marginBottom: '40px', paddingBottom: '16px' }}>
          {['Trending', 'Accounts', 'Deposits', 'Cards', 'Loans', 'Insurance'].map((tab, i) => (
            <span key={tab} style={{
              color: i === 0 ? '#004C8F' : '#64748B',
              fontWeight: i === 0 ? 700 : 500,
              fontSize: '16px',
              cursor: 'pointer',
              position: 'relative',
            }}>
              {tab}
              {i === 0 && <div style={{ position: 'absolute', bottom: '-18px', left: 0, right: 0, height: '3px', background: '#004C8F' }} />}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { title: 'Smart Name Matching', desc: 'Detects "Rajesh Kumar" vs "R. Kumar" automatically.', icon: <Search size={32} color="#004C8F" /> },
            { title: 'RBI 2026 Compliant', desc: 'Cites exact circular RBI/2025-26/95 in every letter.', icon: <Scale size={32} color="#004C8F" /> },
            { title: 'One-Click Packet', desc: 'Download a court-ready PDF with checklist & report.', icon: <FileText size={32} color="#004C8F" /> },
            { title: 'Hindi Interface', desc: 'Full UI switch for Tier 2 & 3 families.', icon: <Globe size={32} color="#004C8F" /> },
            { title: 'Institution-Specific', desc: 'Separate checklists for SBI, LIC, HDFC, and ICICI.', icon: <Landmark size={32} color="#004C8F" /> },
            { title: '15-Day SLA Tracker', desc: 'Know exactly when the bank is legally obligated to pay.', icon: <Clock size={32} color="#004C8F" /> },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{feat.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>{feat.title}</h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== DIGITAL SERVICES (Screenshot 2 Style - Bright Yellow Background) ===== */}
      <section style={{
        background: '#FFC107', // Bright Yellow
        padding: '80px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Graphic/Image */}
        <div style={{
          position: 'absolute',
          right: '-5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
        }}>
          <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop" alt="Headphones" style={{ width: '300px', borderRadius: '50%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: '#1E293B', marginBottom: '16px', fontWeight: 800, maxWidth: '500px', lineHeight: 1.1 }}>
            Explore All DeathLedger Digital Services
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '12px 24px', maxWidth: '400px', marginBottom: '48px' }}>
            <input type="text" placeholder="Tell us about your issue" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }} />
            <ArrowRight size={20} color="#94A3B8" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { title: 'Top Online Services', links: ['Update PAN', 'Form 121 (15 G/H)', 'Debit Card Hot-listing'] },
              { title: 'Account Services', links: ['Address Change', 'Nomination', 'Update Enable/Disable AePS'] },
              { title: 'Deposits Services', links: ['FD RD Liquidation', 'FD RD Advice Reissuance', 'Break Deposit'] },
              { title: 'Card Services', links: ['Address Change', 'Email ID Updation', 'Mobile No Updation'] },
            ].map((col, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', marginBottom: '16px' }}>{col.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.links.map(link => (
                    <li key={link} style={{ fontSize: '14px', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>{link}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARIVARTAN STYLE / IMPACT BANNER (Screenshot 4 Style) ===== */}
      <section style={{
        position: 'relative',
        padding: '100px 40px',
        display: 'flex',
        alignItems: 'center',
        background: '#E6EEF8',
        overflow: 'hidden',
      }}>
        {/* Background Image on Left */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '50%',
          background: 'url("https://images.unsplash.com/photo-1604881990409-b9f246db39da?q=80&w=1200&auto=format&fit=crop") center/cover',
          zIndex: 0,
        }} />
        {/* Gradient Blend */}
        <div style={{
          position: 'absolute',
          left: '40%',
          top: 0,
          bottom: 0,
          width: '20%',
          background: 'linear-gradient(90deg, transparent, #E6EEF8)',
          zIndex: 1,
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ width: '50%', paddingLeft: '40px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ background: 'white', padding: '4px', borderRadius: '4px' }}><Shield size={20} color="#ED232A" /></div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#004C8F', letterSpacing: '0.5px' }}>DEATHLEDGER PARIVARTAN</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: '#1E293B', marginBottom: '20px', fontWeight: 800, lineHeight: 1.1 }}>
              Building a better India –<br />one step at a time
            </h2>
            <p style={{ fontSize: '16px', color: '#475569', marginBottom: '40px', lineHeight: 1.6 }}>
              From legal empowerment to financial recovery and everything in between – DeathLedger is transforming India by ensuring rightful heirs get their dues.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              {[
                { number: '12+ lakh', label: 'Households impacted' },
                { number: '10+ crore', label: 'Rupees Recovered' },
                { number: '20+ lakh', label: 'Queries Solved' },
                { number: '9K+', label: 'Villages Covered' },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#004C8F', marginBottom: '4px' }}>{stat.number}</div>
                  <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <Link href="/audit" style={{
              background: '#004C8F',
              color: 'white',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Explore <ChevronRight size={18} strokeWidth={3} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: '#003366',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <Shield size={24} color="white" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'white',
            fontWeight: 800,
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
      </footer>
    </div>
  );
}
