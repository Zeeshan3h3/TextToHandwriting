import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ onGetStarted }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href) => {
        setMenuOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleContactClick = () => {
        setMenuOpen(false);
        window.history.pushState({}, '', '/contact');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    };

    const handleLogoClick = () => {
        if (window.location.pathname !== '/') {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
        window.scrollTo(0, 0);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
            <div className="nav-container">
                <div className="nav-logo" onClick={handleLogoClick}>
                    <img src="/logo.png" alt="TextToHandwriting Logo" className="logo-img" />
                    <span className="logo-text">TextToHandwriting</span>
                </div>

                <div className="nav-links">
                    <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); }}>Features</a>
                    <a href="#how-it-works" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#how-it-works'); }}>How it Works</a>
                    <a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#faq'); }}>FAQ</a>
                    <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); handleContactClick(); }}>Contact</a>
                </div>

                <div className="nav-actions">
                    <button className="btn-get-started" onClick={onGetStarted}>
                        <span>Try it free</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(m => !m)}
                    aria-label="Toggle menu"
                >
                    <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
                    <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
                    <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
                </button>
            </div>

            {/* Mobile dropdown */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <a href="#features" className="mobile-link" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); }}>Features</a>
                <a href="#how-it-works" className="mobile-link" onClick={(e) => { e.preventDefault(); handleNavClick('#how-it-works'); }}>How it Works</a>
                <a href="#faq" className="mobile-link" onClick={(e) => { e.preventDefault(); handleNavClick('#faq'); }}>FAQ</a>
                <a href="#contact" className="mobile-link" onClick={(e) => { e.preventDefault(); handleContactClick(); }}>Contact</a>
                <button className="btn-get-started mobile-cta" onClick={() => { setMenuOpen(false); onGetStarted(); }}>
                    Try it free
                </button>
            </div>
        </nav>
    );
}
