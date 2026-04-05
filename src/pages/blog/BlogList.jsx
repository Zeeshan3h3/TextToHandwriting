import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/landing/Footer';
import SEO from '../../components/seo/SEO';

const blogPosts = [
    {
        title: "How to Convert Text to Handwriting for Your Assignments in 2026",
        slug: "/blog/text-to-handwriting-assignment",
        excerpt: "Learn how to save hours on manual writing by converting your typed text into realistic handwriting. Perfect for students looking for an edge.",
        date: "April 5, 2026"
    },
    {
        title: "The Best Handwriting Generator Tools for Students",
        slug: "/blog/best-handwriting-generator-tools",
        excerpt: "We review the top handwriting generator tools online and explain why realistic customization is critical for academic success.",
        date: "April 2, 2026"
    },
    {
        title: "How to Save Time Writing Notes Using AI and Text Converters",
        slug: "/blog/save-time-writing-notes",
        excerpt: "Discover productivity hacks for students. Combine AI note-taking and our text to handwriting converter to study smarter, not harder.",
        date: "March 28, 2026"
    }
];

export default function BlogList() {
    return (
        <div style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', color: '#e0e0ff', fontFamily: "'Inter', sans-serif" }}>
            <SEO
                title="Blog | Text to Handwriting Converter for Students"
                description="Read our latest tips, guides, and tutorials on converting text to realistic handwriting for assignments and notes."
                url="https://texttohandwriting.onrender.com/blog"
            />
            <Navbar onGetStarted={() => window.location.href = '/'} />

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 20px 60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
                    Handwriting & Productivity Blog
                </h1>
                <p style={{ fontSize: '1.2rem', textAlign: 'center', color: '#a0a0c0', marginBottom: '60px' }}>
                    Discover guides, reviews, and tips on how to <Link to="/" style={{ color: '#6c63ff' }}>convert text to handwriting online</Link> to ace your assignments.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {blogPosts.map((post, idx) => (
                        <article key={idx} style={{ backgroundColor: '#1e1e2e', padding: '30px', borderRadius: '12px', border: '1px solid #2a2a4a' }}>
                            <span style={{ fontSize: '0.9rem', color: '#6c63ff', fontWeight: 600 }}>{post.date}</span>
                            <h2 style={{ fontSize: '1.8rem', marginTop: '10px', marginBottom: '15px' }}>
                                <Link to={post.slug} style={{ color: '#e0e0ff', textDecoration: 'none' }}>
                                    {post.title}
                                </Link>
                            </h2>
                            <p style={{ color: '#a0a0c0', lineHeight: 1.6, marginBottom: '20px' }}>
                                {post.excerpt}
                            </p>
                            <Link to={post.slug} style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>
                                Read more →
                            </Link>
                        </article>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
