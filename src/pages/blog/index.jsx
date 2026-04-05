import React from 'react';
import { Routes, Route } from 'react-router-dom';

const BlogList = React.lazy(() => import('./BlogList'));
const AssignmentBlog = React.lazy(() => import('./articles/TextToHandwritingAssignment'));
const ToolsBlog = React.lazy(() => import('./articles/BestHandwritingGeneratorTools'));
const NotesBlog = React.lazy(() => import('./articles/SaveTimeWritingNotes'));

export default function BlogRoutes() {
    return (
        <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/text-to-handwriting-assignment" element={<AssignmentBlog />} />
            <Route path="/best-handwriting-generator-tools" element={<ToolsBlog />} />
            <Route path="/save-time-writing-notes" element={<NotesBlog />} />
        </Routes>
    );
}
