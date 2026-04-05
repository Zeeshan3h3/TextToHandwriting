import React from 'react';
import './HeroSection.css';

export default function HeroSection({ onGetStarted }) {
    return (
        <section className="landing-hero">
            <div className="hero-inner">
                <h1 className="hero-title">
                    Text to Handwriting Converter
                </h1>
                <h2 className="hero-subtitle" style={{ fontSize: '1.25rem', fontWeight: 400, marginTop: '1rem', color: '#a0a0c0' }}>
                    Convert Text to Realistic Handwriting Online. Transform your digital notes, assignments, and documents into beautiful handwriting.
                    Export as high-resolution PDF or PNG—completely free.
                </h2>

                <div className="hero-cta-group">
                    <button className="hero-btn-primary" onClick={onGetStarted}>
                        Generate Now — 100% Free
                    </button>

                    <div className="hero-badges">
                        <span>✓ No Signup</span>
                        <span>✓ Instant Download</span>
                        <span>✓ 10,000+ Users</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
