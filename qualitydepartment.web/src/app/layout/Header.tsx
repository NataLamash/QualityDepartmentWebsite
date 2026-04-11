import { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Box, InputBase, Button, Menu, MenuItem,
    Link, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '25px',
    border: '1px solid #BA0000',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '280px', 
    },
    transition: '0.3s',
    '&:hover': {
        boxShadow: '0 0 10px rgba(186, 0, 0, 0.15)',
    },
}));

export default function Header() {
    const { i18n } = useTranslation();
    const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
    const [accessAnchor, setAccessAnchor] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { ua: 'Головна', en: 'Home', path: '/' },
        { ua: 'Новини', en: 'News', path: '/news' },
        { ua: 'Архів', en: 'Archive', path: '/archive' },
        { ua: 'Посилання', en: 'Links', path: '/links' },
        { ua: 'Опитування', en: 'Surveys', path: '/surveys' },
    ];

    useEffect(() => {
        document.documentElement.style.fontSize = '14px';
    }, []);

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        setLangAnchor(null);
    };

    const changeFontSize = (size: string) => {
        document.documentElement.style.fontSize = size;
        setAccessAnchor(null);
    };

    return (
        <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee', bgcolor: '#fff' }}>
            <Toolbar sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: { xs: '10px 15px', md: '10px 40px' },
                gap: { xs: 2, md: 0 },
                minHeight: 'auto'
            }}>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2, lg: 4 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                onClick={() => setMobileOpen(true)}
                                sx={{ display: { xs: 'flex', md: 'none' }, color: '#BA0000' }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Box
                                component="img"
                                src="/logo-knu.png"
                                sx={{ height: { xs: 70, md: 110 }, width: 'auto', cursor: 'pointer' }}
                            />
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { md: 1.5, lg: 3 } }}>
                            {menuItems.map((item) => (
                                <Link
                                    key={item.ua}
                                    component={NavLink}
                                    to={item.path}
                                    sx={{
                                        color: '#333', fontWeight: 700, textDecoration: 'none', fontSize: '1.05rem',
                                        position: 'relative', '&.active': { color: '#BA0000' },
                                        '&:hover': { color: '#BA0000' },
                                        '&.active::after': { content: '""', position: 'absolute', bottom: -5, left: 0, width: '100%', height: '2px', bgcolor: '#BA0000' }
                                    }}
                                >
                                    {i18n.language === 'en' ? item.en : item.ua}
                                </Link>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Search>
                                <InputBase
                                    placeholder={i18n.language === 'en' ? 'Search' : 'Пошук'}
                                    sx={{ color: '#333', p: '6px 15px', fontSize: '0.9rem', flex: 1 }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '1.5px solid #BA0000', height: '20px', px: 1, cursor: 'pointer' }}>
                                    <SearchIcon sx={{ color: '#BA0000', fontSize: '1.1rem' }} />
                                </Box>
                            </Search>
                        </Box>

                        <Button
                            onClick={(e) => setLangAnchor(e.currentTarget)}
                            sx={{
                                minWidth: 'auto', color: '#333', fontWeight: 600, borderRadius: '25px', border: '1px solid #eee', px: { xs: 1, md: 2 }, py: 0.8,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)', '&:hover': { borderColor: '#BA0000' }
                            }}
                            startIcon={<LanguageIcon sx={{ color: '#BA0000' }} />}
                        >
                            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {i18n.language === 'en' ? 'Eng' : 'Укр'}
                            </Typography>
                        </Button>

                        <IconButton
                            onClick={(e) => setAccessAnchor(e.currentTarget)}
                            sx={{
                                width: 40, height: 40, borderRadius: '12px', border: '1px solid #eee',
                                bgcolor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                '&:hover': { borderColor: '#BA0000' }
                            }}
                        >
                            <Box component="img" src="/Helper.png" sx={{ width: 20, height: 20 }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%', pb: 1 }}>
                    <Search>
                        <InputBase
                            placeholder={i18n.language === 'en' ? 'Search' : 'Пошук'}
                            sx={{ color: '#333', p: '8px 20px', fontSize: '1rem', flex: 1 }}
                        />
                        <IconButton sx={{ p: '10px' }}>
                            <SearchIcon sx={{ color: '#BA0000' }} />
                        </IconButton>
                    </Search>
                </Box>
            </Toolbar>

            <Box
                component="img"
                src="/LineBilding.png"
                sx={{ width: '100%', display: 'block', height: 'auto', marginTop: '-10px', position: 'relative', zIndex: 10 }}
            />

            <Menu
                anchorEl={langAnchor}
                open={Boolean(langAnchor)}
                onClose={() => setLangAnchor(null)}
                slotProps={{ paper: { sx: { borderRadius: '15px' } } }}
            >
                <MenuItem onClick={() => handleLanguageChange('ua')}>Українська</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
            </Menu>

            <Menu
                anchorEl={accessAnchor}
                open={Boolean(accessAnchor)}
                onClose={() => setAccessAnchor(null)}
                slotProps={{ paper: { sx: { borderRadius: '15px', p: 1, minWidth: 200 } } }}
            >
                <Typography variant="overline" sx={{ px: 2, fontWeight: 800, color: '#999' }}>Вигляд сайту</Typography>
                <MenuItem onClick={() => changeFontSize('14px')}>Стандартний текст</MenuItem>
                <MenuItem onClick={() => changeFontSize('18px')}>Збільшений текст</MenuItem>
                <MenuItem onClick={() => changeFontSize('20px')}>Дуже великий текст</MenuItem>
            </Menu>

            <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <Box sx={{ width: 250, p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#BA0000', fontWeight: 900, mb: 2 }}>МЕНЮ</Typography>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.ua} disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        '&.active': { color: '#BA0000', bgcolor: 'rgba(186, 0, 0, 0.08)' }
                                    }}
                                >
                                    <ListItemText
                                        primary={i18n.language === 'en' ? item.en : item.ua}
                                        slotProps={{ primary: { sx: { fontWeight: 700 } } }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

        </AppBar>
    );
}