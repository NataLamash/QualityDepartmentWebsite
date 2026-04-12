import { createTheme } from '@mui/material/styles';

export const universityTheme = createTheme({
    palette: {
        primary: {
            main: '#B80000', 
            contrastText: '#fff',
        },
        background: {
            default: '#ffffff',
            paper: '#f9f9f9',
        },
    },
    typography: {
        fontFamily: "'Montserrat', 'Inter', sans-serif",
        h3: { fontWeight: 700 },
        h6: { fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
});