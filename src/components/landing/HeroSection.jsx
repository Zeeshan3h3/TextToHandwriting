import React from 'react';
import './HeroSection.css';

export default function HeroSection({ onGetStarted }) {
    return (
        <section className="landing-hero">
            <div className="hero-inner">
                <h1 className="hero-title">
                    Free Text to Handwriting Converter
                </h1>
                <p className="hero-social-proof">
                    Used by 10,000+ students worldwide to convert assignments, notes, and letters to handwriting.
                </p>
                <h2 className="hero-subtitle" style={{ fontSize: '1.25rem', fontWeight: 400, marginTop: '1rem', color: '#a0a0c0' }}>
                    Type or paste any text and download it as a realistic handwritten image or PDF — free, no watermark.
                    Perfect for converting assignments, study notes, and letters into authentic-looking handwriting.
                </h2>

                <div className="hero-cta-group">
                    <button className="hero-btn-primary" onClick={onGetStarted}>
                        Generate Now — 100% Free
                    </button>

                    <div className="hero-badges">
                        <span>✓ No Signup</span>
                        <span>✓ No Watermark</span>
                        <span>✓ Instant Download</span>
                        <span>✓ PNG &amp; PDF</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
