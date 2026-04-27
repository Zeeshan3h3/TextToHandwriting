import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './FAQSection.css';

// Static FAQ schema — hardcoded for reliable Googlebot parsing
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Is this text to handwriting converter free to use?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our free handwriting converter is completely free — no subscription, no hidden fees, and no credit card required. You can convert text to handwriting online as many times as you like and download every result without paying a penny. There are no usage limits either, so whether you need one page or twenty, go right ahead."
            }
        },
        {
            "@type": "Question",
            "name": "Can I use this to make my homework look handwritten?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely — using this tool for handwriting for assignments is one of the most popular reasons people visit. Just paste your typed homework or essay, choose a handwriting style, and download it as an image or PDF ready to print. It saves hours compared to writing everything by hand."
            }
        },
        {
            "@type": "Question",
            "name": "How do I convert text to handwriting online with this tool?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "It only takes a few seconds to convert text to handwriting online here. Type or paste your text into the editor, pick a font style, adjust ink color and page settings if you like, then hit the Download button. No software to install — it all runs right in your browser."
            }
        },
        {
            "@type": "Question",
            "name": "Can I download the handwriting as an image?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Once your handwriting is generated, you can download handwriting as image in high-resolution PNG format with a single click. PNG files are print-ready, easy to attach to emails, and can be inserted into Word or Google Docs. We also support multi-page PDF export for longer documents."
            }
        },
        {
            "@type": "Question",
            "name": "Does this text to handwriting tool work on mobile phones?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, the tool is fully responsive and works on smartphones and tablets. You can convert text to handwriting online on any modern mobile browser without needing to install an app. The download button works on iOS and Android too, so you can save the image straight to your camera roll."
            }
        },
        {
            "@type": "Question",
            "name": "What handwriting styles and fonts are available?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer a wide range of styles — from casual everyday handwriting to flowing cursive. Our cursive text generator options include fonts like Dancing Script, Sacramento, Caveat, and Kalam, each giving a different personality to your text. You can also upload your own .ttf or .otf font file if you want output that matches your personal handwriting."
            }
        },
        {
            "@type": "Question",
            "name": "Is the handwriting realistic enough to look human-written?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our handwriting generator is designed to produce realistic handwriting that closely mimics the natural look of pen on paper. You can tweak the messiness level, word spacing, and line height to add the subtle inconsistencies that make handwriting feel authentic. Most users find the output indistinguishable from genuine handwriting at a glance."
            }
        },
        {
            "@type": "Question",
            "name": "Do I need to create an account or sign up?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No account, no signup, no email — nothing. Our free handwriting converter works instantly without any registration. We built it this way intentionally, because nobody should have to create an account just to convert text to handwriting online for a quick task."
            }
        },
        {
            "@type": "Question",
            "name": "Can I use this for school or college assignments without it being detected?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "This tool produces handwriting for assignments that looks visually hand-penned when printed. However, whether using a handwriting generator is appropriate for your institution is entirely your responsibility — always check your school's academic integrity policies. The tool itself generates realistic output that, when printed, appears like standard handwriting on lined paper."
            }
        },
        {
            "@type": "Question",
            "name": "Is this the same as a fake handwriting generator?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "In a sense, yes — a 'fake handwriting' generator is just another name for what this tool does: it converts typed text into something that looks handwritten. Think of it like a font renderer for handwriting styles rather than anything deceptive. Common uses include personal journaling, artistic projects, letter writing, and notes — wherever a handwritten aesthetic is desired without the hand fatigue."
            }
        }
    ]
};

export default function FAQSection() {
    const [openIdx, setOpenIdx] = useState(0);

    const toggle = (i) => setOpenIdx(prev => (prev === i ? -1 : i));

    return (
        <section className="faq-section" id="faq" aria-labelledby="faq-heading">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <div className="faq-inner">
                <h2 id="faq-heading" className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
                    Frequently Asked Questions
                </h2>

                <div className="faq-list">

                    {/* Q1 */}
                    <div className={`faq-item${openIdx === 0 ? ' open' : ''}`} onClick={() => toggle(0)}>
                        <div className="faq-question">
                            <h3>Is this text to handwriting converter free to use?</h3>
                            <span className="faq-toggle">{openIdx === 0 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 0 && (
                            <div className="faq-answer">
                                <p>Yes, our free handwriting converter is completely free — no subscription, no hidden fees, and no credit card required. You can convert text to handwriting online as many times as you like and download every result without paying a penny. There are no usage limits either, so whether you need one page or twenty, go right ahead.</p>
                            </div>
                        )}
                    </div>

                    {/* Q2 */}
                    <div className={`faq-item${openIdx === 1 ? ' open' : ''}`} onClick={() => toggle(1)}>
                        <div className="faq-question">
                            <h3>Can I use this to make my homework look handwritten?</h3>
                            <span className="faq-toggle">{openIdx === 1 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 1 && (
                            <div className="faq-answer">
                                <p>Absolutely — using this tool for handwriting for assignments is one of the most popular reasons people visit. Just paste your typed homework or essay, choose a handwriting style, and download it as an image or PDF ready to print. It saves hours compared to writing everything by hand.</p>
                            </div>
                        )}
                    </div>

                    {/* Q3 */}
                    <div className={`faq-item${openIdx === 2 ? ' open' : ''}`} onClick={() => toggle(2)}>
                        <div className="faq-question">
                            <h3>How do I convert text to handwriting online with this tool?</h3>
                            <span className="faq-toggle">{openIdx === 2 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 2 && (
                            <div className="faq-answer">
                                <p>It only takes a few seconds to convert text to handwriting online here. Type or paste your text into the editor, pick a font style, adjust ink color and page settings if you like, then hit the Download button. No software to install — it all runs right in your browser.</p>
                            </div>
                        )}
                    </div>

                    {/* Q4 */}
                    <div className={`faq-item${openIdx === 3 ? ' open' : ''}`} onClick={() => toggle(3)}>
                        <div className="faq-question">
                            <h3>Can I download the handwriting as an image?</h3>
                            <span className="faq-toggle">{openIdx === 3 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 3 && (
                            <div className="faq-answer">
                                <p>Yes! Once your handwriting is generated, you can download handwriting as image in high-resolution PNG format with a single click. PNG files are print-ready, easy to attach to emails, and can be inserted into Word or Google Docs. We also support multi-page PDF export for longer documents.</p>
                            </div>
                        )}
                    </div>

                    {/* Q5 */}
                    <div className={`faq-item${openIdx === 4 ? ' open' : ''}`} onClick={() => toggle(4)}>
                        <div className="faq-question">
                            <h3>Does this text to handwriting tool work on mobile phones?</h3>
                            <span className="faq-toggle">{openIdx === 4 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 4 && (
                            <div className="faq-answer">
                                <p>Yes, the tool is fully responsive and works on smartphones and tablets. You can convert text to handwriting online on any modern mobile browser without needing to install an app. The download button works on iOS and Android too, so you can save the image straight to your camera roll.</p>
                            </div>
                        )}
                    </div>

                    {/* Q6 */}
                    <div className={`faq-item${openIdx === 5 ? ' open' : ''}`} onClick={() => toggle(5)}>
                        <div className="faq-question">
                            <h3>What handwriting styles and fonts are available?</h3>
                            <span className="faq-toggle">{openIdx === 5 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 5 && (
                            <div className="faq-answer">
                                <p>We offer a wide range of styles — from casual everyday handwriting to flowing cursive. Our cursive text generator options include fonts like Dancing Script, Sacramento, Caveat, and Kalam, each giving a different personality to your text. You can also upload your own .ttf or .otf font file if you want output that matches your personal handwriting.</p>
                            </div>
                        )}
                    </div>

                    {/* Q7 */}
                    <div className={`faq-item${openIdx === 6 ? ' open' : ''}`} onClick={() => toggle(6)}>
                        <div className="faq-question">
                            <h3>Is the handwriting realistic enough to look human-written?</h3>
                            <span className="faq-toggle">{openIdx === 6 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 6 && (
                            <div className="faq-answer">
                                <p>Our handwriting generator is designed to produce realistic handwriting that closely mimics the natural look of pen on paper. You can tweak the messiness level, word spacing, and line height to add the subtle inconsistencies that make handwriting feel authentic. Most users find the output indistinguishable from genuine handwriting at a glance.</p>
                            </div>
                        )}
                    </div>

                    {/* Q8 */}
                    <div className={`faq-item${openIdx === 7 ? ' open' : ''}`} onClick={() => toggle(7)}>
                        <div className="faq-question">
                            <h3>Do I need to create an account or sign up?</h3>
                            <span className="faq-toggle">{openIdx === 7 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 7 && (
                            <div className="faq-answer">
                                <p>No account, no signup, no email — nothing. Our free handwriting converter works instantly without any registration. We built it this way intentionally, because nobody should have to create an account just to convert text to handwriting online for a quick task.</p>
                            </div>
                        )}
                    </div>

                    {/* Q9 */}
                    <div className={`faq-item${openIdx === 8 ? ' open' : ''}`} onClick={() => toggle(8)}>
                        <div className="faq-question">
                            <h3>Can I use this for school or college assignments?</h3>
                            <span className="faq-toggle">{openIdx === 8 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 8 && (
                            <div className="faq-answer">
                                <p>This tool produces handwriting for assignments that looks visually hand-penned when printed. However, whether using a handwriting generator is appropriate for your institution is entirely your responsibility — always check your school's academic integrity policies. The tool itself generates realistic output that, when printed, appears like standard handwriting on lined paper.</p>
                            </div>
                        )}
                    </div>

                    {/* Q10 */}
                    <div className={`faq-item${openIdx === 9 ? ' open' : ''}`} onClick={() => toggle(9)}>
                        <div className="faq-question">
                            <h3>Is this the same as a fake handwriting generator?</h3>
                            <span className="faq-toggle">{openIdx === 9 ? '−' : '+'}</span>
                        </div>
                        {openIdx === 9 && (
                            <div className="faq-answer">
                                <p>In a sense, yes — a "fake handwriting" generator is just another name for what this tool does: it converts typed text into something that looks handwritten. Think of it like a font renderer for handwriting styles rather than anything deceptive. Common uses include personal journaling, artistic projects, letter writing, and notes — wherever a handwritten aesthetic is desired without the hand fatigue.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
