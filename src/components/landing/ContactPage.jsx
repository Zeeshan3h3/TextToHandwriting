import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from './Footer';
import './ContactPage.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        bugType: 'bug',
        description: '',
        screenshot: null,
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            screenshot: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                bugType: 'bug',
                description: '',
                screenshot: null,
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        }, 1000);
    };

    return (
        <div className="contact-wrapper">
            <Navbar />
            
            <div className="contact-container">
                {/* Hero Section */}
                <section className="contact-hero">
                    <h1 className="contact-title">Get in Touch</h1>
                    <p className="contact-subtitle">Found a bug? Have a feature request? We'd love to hear from you!</p>
                </section>

                {/* Contact Content */}
                <section className="contact-content">
                    <div className="contact-grid">
                        {/* Contact Information */}
                        <div className="contact-info">
                            <h2>Contact Information</h2>
                            
                            <div className="info-item">
                                <div className="info-icon">📧</div>
                                <div className="info-text">
                                    <h3>Email</h3>
                                    <a href="mailto:mdzeeshan08886@gmail.com">mdzeeshan08886@gmail.com</a>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">🐛</div>
                                <div className="info-text">
                                    <h3>Report a Bug</h3>
                                    <p>Help us improve by reporting any issues you encounter</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">💡</div>
                                <div className="info-text">
                                    <h3>Feature Requests</h3>
                                    <p>Have an idea? We'd love to hear your suggestions</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">⏱️</div>
                                <div className="info-text">
                                    <h3>Response Time</h3>
                                    <p>We aim to respond within 24-48 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* Bug Report Form */}
                        <div className="contact-form-wrapper">
                            <h2>Report an Issue</h2>
                            
                            {submitted && (
                                <div className="success-message">
                                    <span>✓ Thank you! We've received your report. We'll get back to you soon.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bugType">Issue Type *</label>
                                    <select
                                        id="bugType"
                                        name="bugType"
                                        value={formData.bugType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="bug">🐛 Bug Report</option>
                                        <option value="feature">💡 Feature Request</option>
                                        <option value="improvement">✨ Improvement Suggestion</option>
                                        <option value="other">📝 Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Brief summary of your issue"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description *</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Detailed description of the issue or feature request..."
                                        rows="6"
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="screenshot">Attachment (Optional)</label>
                                    <div className="file-input-wrapper">
                                        <input
                                            type="file"
                                            id="screenshot"
                                            name="screenshot"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <span className="file-label">
                                            {formData.screenshot ? formData.screenshot.name : 'Attach a screenshot or image'}
                                        </span>
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Report'}
                                </button>
                            </form>

                            <p className="form-note">
                                All fields marked with * are required. We'll review your report and get back to you as soon as possible.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
