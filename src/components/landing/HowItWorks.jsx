import React from 'react';
import './HowItWorks.css';

const steps = [
    { num: '1', title: 'Type Your Text', desc: 'Paste your essay, letter, or notes into our editor. It supports over 100 languages.' },
    { num: '2', title: 'Customize Style', desc: 'Choose from 12+ handwriting fonts, tweak the ink color, and select your paper background.' },
    { num: '3', title: 'Export & Download', desc: 'Instantly download your realistic handwritten document as a multi-page PDF or high-res PNG.' },
];

export default function HowItWorks() {
    return (
        <section className="how-section" id="how-it-works">
            <div className="how-inner">
                <div className="section-header">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Get your realistic handwriting in 3 simple steps. No signup required.</p>
                </div>
                <div className="how-steps">
                    {steps.map((s, i) => (
                        <div key={i} className="how-step">
                            <div className="step-num">{s.num}</div>
                            <div className="step-body">
                                <h3 className="step-title">{s.title}</h3>
                                <p className="step-desc">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
