import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
    palette: {
        primary: {
            main: '#B80000',
            contrastText: '#fff',
        },
        background: {
            default: '#f6f6f6',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: "'Montserrat', 'Inter', sans-serif",
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        button: {
            textTransform: 'none',
            fontWeight: 700,
        },
    },
    shape: {
        borderRadius: 16,
    },
});