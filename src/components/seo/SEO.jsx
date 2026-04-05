import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
    title = "Free Text to Handwriting Converter Online | Realistic Handwriting Generator",
    description = "Convert typed text into realistic handwriting online for free. Perfect for students, assignments, and notes. Fast, easy, and customizable.",
    keywords = "text to handwriting converter, convert text to handwriting online, handwriting generator free, handwritten notes generator",
    url = "https://texttohandwriting.onrender.com/",
    type = "website",
    schemaMarkup = null
}) {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />

            {/* Schema Markup */}
            {schemaMarkup && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            )}
        </Helmet>
    );
}
