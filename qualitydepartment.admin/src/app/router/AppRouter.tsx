import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import ProtectedRoute from '../../components/ui/ProtectedRoute';
import LoginPage from '../../features/auth/LoginPage';
import DashboardPage from '../../features/dashboard/DashboardPage';
import NewsAdminPage from '../../features/news/NewsAdminPage';
import DocumentsAdminPage from '../../features/documents/DocumentsAdminPage';
import AdministrationMembersPage from '../../features/administration/AdministrationMembersPage';
import UsefulInformationPage from '../../features/useful-information/UsefulInformationPage';
import CategoriesPage from '../../features/categories/CategoriesPage';
import TagsPage from '../../features/tags/TagsPage';
import SurveysAdminPage from '../../features/surveys/SurveysAdminPage';
import EventsAdminPage from '../../features/events/EventsAdminPage';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/news" element={<NewsAdminPage />} />
                    <Route path="/documents" element={<DocumentsAdminPage />} />
                    <Route path="/administration" element={<AdministrationMembersPage />} />
                    <Route path="/useful-information" element={<UsefulInformationPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/tags" element={<TagsPage />} />
                    <Route path="/surveys" element={<SurveysAdminPage />} />
                    <Route path="/events" element={<EventsAdminPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}