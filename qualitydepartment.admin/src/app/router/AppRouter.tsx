import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import DashboardPage from '../../features/dashboard/DashboardPage';
import NewsAdminPage from '../../features/news/NewsAdminPage';
import DocumentsAdminPage from '../../features/documents/DocumentsAdminPage';
import AdministrationMembersPage from '../../features/administration/AdministrationMembersPage';
import UsefulInformationPage from '../../features/useful-information/UsefulInformationPage';
import CategoriesPage from '../../features/categories/CategoriesPage';

function LoginPlaceholder() {
    return (
        <div style={{ padding: '24px', fontWeight: 700, fontSize: '24px' }}>
            Login
        </div>
    );
}

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPlaceholder />} />
                <Route path="/news" element={<NewsAdminPage />} />
                <Route path="/documents" element={<DocumentsAdminPage />} />
                <Route path="/administration" element={<AdministrationMembersPage />} />
                <Route path="/useful-information" element={<UsefulInformationPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}