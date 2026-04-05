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
                    
                    <button 
                        onClick={handleContactClick}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#666688',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontSize: 'clamp(0.8rem, 1.2vw, 0.875rem)',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#a0a0c0'}
                        onMouseLeave={(e) => e.target.style.color = '#666688'}
                    >
                        Contact
                    </button>
                </div>
                <div className="footer-copy">
                    &copy; {new Date().getFullYear()} TextToHandwriting. All rights reserved.
                </div>
                <div className='footer-copy'>Made With Love</div>
            </div>
        </footer>
    );
}
