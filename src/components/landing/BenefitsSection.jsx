import React from 'react';
import './BenefitsSection.css';

const benefits = [
    {
        title: 'Perfect for Students',
        desc: 'Convert typed assignments and homework into authentic-looking handwritten notes to save hours of manual writing.',
        image: '🎓'
    },
    {
        title: 'Professional & Creative',
        desc: 'Generate handwritten letters, invitations, and marketing notes that look genuinely personal and human-crafted.',
        image: '✉️'
    }
];

export default function BenefitsSection() {
    return (
        <section className="benefits-section">
            <div className="benefits-inner">
                <div className="benefits-grid">
                    {benefits.map((b, i) => (
                        <div key={i} className="benefit-card">
                            <div className="benefit-emoji">{b.image}</div>
                            <h3 className="benefit-title">{b.title}</h3>
                            <p className="benefit-desc">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
