import React from 'react';
import './Footer.css';

export default function Footer() {
    const handleContactClick = () => {
        window.history.pushState({}, '', '/contact');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
    };

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">TextToHandwriting</div>
                <p className="footer-tagline">Convert digital text to realistic handwriting notes instantly.</p>
                <div className="footer-links">
                    
                    <a href="#" onClick={(e) => { e.preventDefault(); handleContactClick(); }}>Contact</a>
                </div>
                <div className="footer-copy">
                    &copy; {new Date().getFullYear()} TextToHandwriting. All rights reserved.
                </div>
                <div className='footer-copy'>Made With Love</div>
            </div>
        </footer>
    );
}
