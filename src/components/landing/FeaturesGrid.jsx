import React from 'react';
import './FeaturesGrid.css';

const features = [
    { icon: '✍️', title: '12+ Handwriting Fonts', desc: 'Choose from a variety of cursive, neat, and messy handwriting styles.' },
    { icon: '📝', title: 'Multiple Paper Types', desc: 'College ruled, graph, dotted, cornell, or blank paper backgrounds.' },
    { icon: '🎨', title: 'Custom Ink Colors', desc: 'Blue, black, red, or pick any custom hex color for your pen.' },
    { icon: '📥', title: 'PDF & PNG Export', desc: 'Download multi-page PDFs or high-resolution 300 DPI PNG images.' },
    { icon: '🎭', title: 'Realistic Effects', desc: 'Add subtle shadows, scanner effects, and natural ink variations.' },
    { icon: '⬆️', title: 'Upload Your Own', desc: 'Upload your own custom TTF/OTF fonts and paper backgrounds.' },
];

export default function FeaturesGrid() {
    return (
        <section className="features-section" id="features">
            <div className="features-inner">
                <div className="section-header">
                    <h2 className="section-title">Everything You Need</h2>
                    <p className="section-subtitle">
                        A complete suite of tools to make your text look authentically handwritten.
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon">{f.icon}</div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
