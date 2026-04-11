import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://texttohandwriting.onrender.com';
const OG_IMAGE = `${BASE_URL}/images/og-preview.png`;

export default function SEO({
    title = "Free Text to Handwriting Converter – Download as PNG or PDF | No Watermark",
    description = "Convert typed text to realistic handwriting online for free. Choose handwriting fonts, ink colors, paper styles. Download as PNG or multi-page PDF. No watermark, no signup.",
    keywords = "text to handwriting converter, typed text to handwriting image, handwriting generator no watermark, Hindi text to handwriting online, convert assignment to handwriting, make text look handwritten free, upload own handwriting font online, handwritten notes generator PDF, text to cursive handwriting converter",
    url = `${BASE_URL}/`,
    type = "website",
    image = OG_IMAGE,
    schemaMarkup = null
}) {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Schema Markup */}
            {schemaMarkup && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            )}
        </Helmet>
    );
}
