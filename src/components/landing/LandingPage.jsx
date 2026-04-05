import React from 'react';
import HeroSection from './HeroSection';
import FeaturesGrid from './FeaturesGrid';
import HowItWorks from './HowItWorks';
import BenefitsSection from './BenefitsSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import Navbar from '../common/Navbar';

export default function LandingPage({ onGetStarted, children }) {
    return (
        <div className="landing-wrapper" style={{ width: '100%', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <Navbar onGetStarted={onGetStarted} />
            <HeroSection onGetStarted={onGetStarted} />

            {/* Live Demo Section */}
            <section id="live-demo" style={{ width: '100%', minHeight: '100vh', background: '#0f0f1a' }}>
                {children}
            </section>

            <FeaturesGrid />
            <HowItWorks />
            <BenefitsSection />
            <FAQSection />
            <Footer />
        </div>
    );
}
