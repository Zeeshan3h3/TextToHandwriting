import React, { useState } from 'react';
import './FAQSection.css';

const faqs = [
    { q: 'Is this text to handwriting converter completely free?', a: 'Yes! Our tool is 100% free to use. You can generate and download unlimited handwritten documents without any hidden fees or watermarks.' },
    { q: 'Can I download my handwriting as a PDF?', a: 'Absolutely. We support high-quality multi-page PDF exports, as well as single-page high-resolution PNG images (up to 300 DPI).' },
    { q: 'Do I need to create an account?', a: 'No signup or login is required. We respect your privacy, and all processing is done locally in your browser.' },
    { q: 'Can I upload my own handwriting font?', a: 'Yes, if you have a custom .ttf or .otf font file of your own handwriting, you can upload it directly into the tool.' },
    { q: 'Are the documents saved on your servers?', a: 'No. Everything runs client-side in your browser. We do not store your text, fonts, or generated images on our servers.' }
];

export default function FAQSection() {
    const [openIdx, setOpenIdx] = useState(0);

    return (
        <section className="faq-section" id="faq">
            <div className="faq-inner">
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
                    Frequently Asked Questions
                </h2>
                <div className="faq-list">
                    {faqs.map((faq, i) => {
                        const isOpen = openIdx === i;
                        return (
                            <div key={i} className={`faq-item ${isOpen ? 'open' : ''}`} onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                                <div className="faq-question">
                                    <span>{faq.q}</span>
                                    <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                                </div>
                                {isOpen && <div className="faq-answer">{faq.a}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
