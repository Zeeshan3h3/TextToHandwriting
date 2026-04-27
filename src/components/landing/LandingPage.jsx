import React from 'react';
import HeroSection from './HeroSection';
import FeaturesGrid from './FeaturesGrid';
import HowItWorks from './HowItWorks';
import BenefitsSection from './BenefitsSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import Navbar from '../common/Navbar';
import SEOContent from './SEOContent';
import SEO from '../seo/SEO';

const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Text to Handwriting Converter",
    "url": "https://texttohandwriting.onrender.com/",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    "description": "Free text to handwriting generator. Convert typed text into realistic handwriting for student notes, assignments, and projects. Download as PNG or multi-page PDF. No watermark, no signup.",
    "audience": {
        "@type": "Audience",
        "audienceType": "Students, Teachers, Writers"
    },
    "featureList": [
        "Multiple handwriting fonts",
        "Hindi font support",
        "Custom font upload",
        "Multi-page PDF export",
        "PNG download",
        "No watermark",
        "No signup required",
        "Dark mode",
        "Ink color selection",
        "Paper line toggle",
        "300 DPI high-resolution output"
    ]
};


export default function LandingPage({ onGetStarted, children }) {
    return (
        <div className="landing-wrapper" style={{ width: '100%', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <SEO schemaMarkup={webAppSchema} />
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
            <SEOContent />
            <Footer />
        </div>
    );
}
