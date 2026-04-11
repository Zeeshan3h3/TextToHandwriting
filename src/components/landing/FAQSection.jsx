import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './FAQSection.css';

const faqs = [
    {
        q: 'Is this text to handwriting converter completely free?',
        a: 'Yes! Our handwriting generator is 100% free with no watermark — you can generate and download unlimited handwritten documents without any hidden fees, subscriptions, or signup required.'
    },
    {
        q: 'Can I download my handwriting as a PDF?',
        a: 'Absolutely. We support high-quality multi-page PDF exports — making it the best handwritten notes generator PDF tool available. You can also download single-page high-resolution PNG images (up to 300 DPI).'
    },
    {
        q: 'Do I need to create an account?',
        a: 'No signup or login is required. We respect your privacy, and all processing is done locally in your browser. Just type, customise, and download.'
    },
    {
        q: 'Can I upload my own handwriting font online?',
        a: 'Yes. If you have a custom .ttf or .otf font file of your own handwriting, you can upload your own handwriting font online directly into the tool. This makes your output uniquely yours and indistinguishable from real handwriting.'
    },
    {
        q: 'Does it support Hindi text to handwriting?',
        a: 'Yes, we support Hindi text to handwriting online via the Kruti-dev font. For best results, use phonetic transliteration or the Kruti-dev keyboard layout. Note: standard Unicode Devanagari may not render correctly with this legacy font.'
    },
    {
        q: 'Can I use this to convert my assignment to handwriting?',
        a: 'Absolutely — this is one of the most popular use cases. Simply paste your typed assignment text, select a handwriting style, adjust messiness and spacing, and download as PDF to print or submit digitally. Thousands of students use our tool to convert assignment to handwriting every day.'
    },
    {
        q: 'How do I make text look handwritten for free?',
        a: 'Use our free online converter: paste your typed text, pick a cursive or casual font, adjust ink color (blue, black, red pen), set paper type, and click Download. It is the fastest way to make text look handwritten free — no software to install.'
    },
    {
        q: 'What is the best text to cursive handwriting converter?',
        a: 'Our tool offers multiple cursive fonts including Dancing Script, Sacramento, and Caveat for a text to cursive handwriting converter effect. You can also adjust letter spacing, messiness, and line height for maximum realism.'
    },
    {
        q: 'Are the documents saved on your servers?',
        a: 'No. Everything runs client-side in your browser. We do not store your text, fonts, or generated images on our servers. Your content stays private.'
    }
];

export default function FAQSection() {
    const [openIdx, setOpenIdx] = useState(0);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return (
        <section className="faq-section" id="faq">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>
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
