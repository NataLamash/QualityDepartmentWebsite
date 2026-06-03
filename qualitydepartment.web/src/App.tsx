import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './app/layout/Header'; 
import Footer from './app/layout/Footer';
import HomePage from './features/home/HomePage';
import DocumentPage from './features/documents/DocumentPage';
import NewsPage from './features/news/NewsPage';
import ExternalLinkPage from './features/info/ExternalLinkPage';
import NewsDetailsPage from './features/news/NewsDetailsPage';
import SearchPage from './features/search/SearchPage';
import DocumentSearchPreviewPage from './features/search/DocumentSearchPreviewPage';
import SurveysPage from './features/surveys/SurveysPage';
import SurveyDetailsPage from './features/surveys/SurveyDetailsPage';

function App() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/archive" element={<DocumentPage isQualityPage={false} />} />
                    <Route path="/quality-evaluation" element={<DocumentPage isQualityPage={true} />} />
                    <Route path="/info" element={<ExternalLinkPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/documents/:id/preview" element={<DocumentSearchPreviewPage />} />
                    <Route path="/news/:id" element={<NewsDetailsPage />} />
                    <Route path="/surveys" element={<SurveysPage />} />
                    <Route path="/surveys/:id" element={<SurveyDetailsPage />} />
                    <Route path="/events" element={<NewsPage isEventsPage={true} />} />
                    <Route path="/events/:id" element={<NewsDetailsPage />} />
                </Routes>
            </Box>

            <Footer />
        </Box>
    );
}

export default App;