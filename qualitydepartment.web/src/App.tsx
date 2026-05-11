import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './app/layout/Header'; 
import Footer from './app/layout/Footer';
import HomePage from './features/home/HomePage';
import DocumentPage from './features/documents/DocumentPage';
import NewsPage from './features/news/NewsPage';
import QualityAssessmentPage from './features/info/QualityAssessmentPage';
import NewsDetailsPage from './features/news/NewsDetailsPage';

function App() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/archive" element={<DocumentPage />} />
                    <Route path="/info" element={<QualityAssessmentPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/news/:id" element={<NewsDetailsPage />} />
                </Routes>
            </Box>

            <Footer />
        </Box>
    );
}

export default App;