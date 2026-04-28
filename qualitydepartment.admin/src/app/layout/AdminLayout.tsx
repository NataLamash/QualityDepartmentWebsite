import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f6f6f6' }}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <AdminSidebar />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <AdminHeader />

                <Box
                    component="main"
                    sx={{
                        px: { xs: 2, md: 4 },
                        pb: 4,
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}