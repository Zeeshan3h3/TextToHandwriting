import React from 'react';
import './HeroSection.css';

export default function HeroSection({ onGetStarted }) {
    return (
        <section className="landing-hero">
            <div className="hero-inner">
                <h1 className="hero-title">
                    Convert Text to Handwriting in Seconds
                </h1>
                <p className="hero-subtitle">
                    Transform your digital notes, assignments, and documents into realistic, beautiful handwriting.
                    Export as high-resolution PDF or PNG—completely free.
                </p>

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
