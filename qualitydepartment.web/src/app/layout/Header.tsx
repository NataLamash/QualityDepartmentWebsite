import { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Box, InputBase, Button, Menu, MenuItem,
    Link, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavigationItem {
    pathKey: string;
    path: string;
    hasDropdown?: boolean;
    submenu?: Array<{ key: string; path: string }>;
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '25px',
    border: '1.5px solid #BA0000',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '150px',
        '&:focus-within': { width: '190px' },
    },
    [theme.breakpoints.up('lg')]: {
        width: '180px',
        '&:focus-within': { width: '230px' },
    },
    [theme.breakpoints.up('xl')]: {
        width: '220px',
        '&:focus-within': { width: '270px' },
    },
    transition: 'width 0.25s ease',
    '&:hover': {
        boxShadow: '0 0 10px rgba(186, 0, 0, 0.15)',
    },
}));

export default function Header() {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
    const [accessAnchor, setAccessAnchor] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [qualityAnchor, setQualityAnchor] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const savedFontSize = localStorage.getItem('app_font_size') || '14px';
        document.documentElement.style.fontSize = savedFontSize;
    }, []);

    const handleQualityOpen = (event: React.MouseEvent<HTMLElement>) => {
        setQualityAnchor(event.currentTarget);
    };

    const handleQualityClose = () => {
        setQualityAnchor(null);
    };

    const handleSearchSubmit = () => {
        const trimmed = searchValue.trim();
        if (trimmed.length < 3) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    const menuItems: NavigationItem[] = [
        { pathKey: 'header.home', path: '/' },
        { pathKey: 'header.news', path: '/news' },
        { pathKey: 'header.documents', path: '/archive' },
        { pathKey: 'header.events', path: '/events' },
        {
            pathKey: 'header.qualityEvaluation',
            path: '/quality-evaluation',
            hasDropdown: true,
            submenu: [
                { key: 'header.internalQuality', path: '/quality-evaluation?category=internal' },
                { key: 'header.externalQuality', path: '/quality-evaluation?category=external' }
            ]
        },
        { pathKey: 'header.usefulLinks', path: '/info' },
        { pathKey: 'header.surveys', path: '/surveys' },
    ];

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        setLangAnchor(null);
    };

    const changeFontSize = (size: string) => {
        document.documentElement.style.fontSize = size;
        localStorage.setItem('app_font_size', size);
        setAccessAnchor(null);
    };

    return (
        <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{ borderBottom: '1px solid #eee', bgcolor: '#fff' }}
            role="banner"
        >
            <Toolbar sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: { xs: '10px 15px', md: '10px 16px', lg: '10px 32px' },
                gap: { xs: 2, md: 0 },
                minHeight: 'auto'
            }}>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: { md: 1.5, lg: 2 } }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 1, lg: 2 }, flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <IconButton
                                onClick={() => setMobileOpen(true)}
                                sx={{ display: { xs: 'flex', md: 'none' }, color: '#BA0000', mr: 1 }}
                                aria-label={t('header.menu')}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Box
                                component="img"
                                src="/logo-knu.png"
                                onClick={() => navigate('/')}
                                alt="КНУ Logo"
                                sx={{
                                    height: { xs: 55, md: 62, lg: 75, xl: 85 },
                                    width: 'auto',
                                    cursor: 'pointer'
                                }}
                                role="link"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate('/');
                                    }
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: { md: '0.2rem 0.5rem', lg: '0.4rem 0.8rem', xl: '0.5rem 1.2rem' },
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                flex: 1,
                                minWidth: 0,
                                py: 0.5
                            }}
                            role="navigation"
                            aria-label={t('accessibility.mainNavigation')}
                        >
                            {menuItems.map((item) => {
                                const label = t(item.pathKey);

                                const linkStyles = {
                                    color: '#333',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    fontSize: { md: '0.8rem', lg: '0.88rem', xl: '0.96rem' },
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    position: 'relative',
                                    py: 0.5,
                                    px: { md: 0.6, lg: 0.9, xl: 1.2 },
                                    transition: 'color 0.2s ease',
                                    '&.active': { color: '#BA0000' },
                                    '&:hover': { color: '#BA0000' },
                                    '&.active::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', bgcolor: '#BA0000' },
                                    '&:focus-visible': {
                                        outline: '2px solid #BA0000',
                                        outlineOffset: '2px',
                                        borderRadius: '4px'
                                    }
                                };

                                if (item.hasDropdown) {
                                    return (
                                        <Box
                                            key={item.path}
                                            onMouseEnter={handleQualityOpen}
                                            onMouseLeave={handleQualityClose}
                                            sx={{ display: 'inline-block', position: 'relative', flexShrink: 0 }}
                                        >
                                            <Link
                                                component={NavLink}
                                                to={item.path}
                                                sx={linkStyles}
                                                aria-haspopup="menu"
                                                aria-expanded={Boolean(qualityAnchor)}
                                            >
                                                {label}
                                            </Link>

                                            <Menu
                                                anchorEl={qualityAnchor}
                                                open={Boolean(qualityAnchor)}
                                                onClose={handleQualityClose}
                                                disableAutoFocusItem
                                                slotProps={{
                                                    paper: {
                                                        onMouseEnter: () => setQualityAnchor(qualityAnchor),
                                                        onMouseLeave: handleQualityClose,
                                                        sx: {
                                                            borderRadius: '12px',
                                                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                                            mt: 0.5,
                                                            border: '1px solid #eee'
                                                        }
                                                    }
                                                }}
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                            >
                                                {item.submenu?.map((sub) => (
                                                    <MenuItem
                                                        key={sub.path}
                                                        onClick={() => { handleQualityClose(); navigate(sub.path); }}
                                                        sx={{ fontWeight: 600, fontSize: '0.95rem', px: 3, py: 1, '&:hover': { color: '#BA0000' }, '&:focus-visible': { outline: '2px solid #BA0000' } }}
                                                    >
                                                        {t(sub.key)}
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </Box>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.path}
                                        component={NavLink}
                                        to={item.path}
                                        sx={linkStyles}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, md: 1, lg: 1.3 }, flexShrink: 0, alignSelf: 'center' }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Search role="search" aria-label={t('accessibility.searchForm')}>
                                <InputBase
                                    placeholder={t('header.searchPlaceholder')}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSearchSubmit();
                                        }
                                    }}
                                    sx={{ color: '#333', p: { xs: '4px 8px', lg: '6px 12px' }, fontSize: '0.85rem', flex: 1 }}
                                    inputProps={{
                                        'aria-label': t('header.searchPlaceholder')
                                    }}
                                />
                                <Box
                                    onClick={handleSearchSubmit}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderLeft: '1.5px solid #BA0000',
                                        height: '18px',
                                        px: { xs: 0.8, lg: 1 },
                                        cursor: 'pointer',
                                        '&:focus-visible': {
                                            outline: '2px solid #BA0000'
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleSearchSubmit();
                                        }
                                    }}
                                    aria-label={t('header.search')}
                                >
                                    <SearchIcon sx={{ color: '#BA0000', fontSize: '1rem' }} />
                                </Box>
                            </Search>
                        </Box>

                        <Button
                            onClick={(e) => setLangAnchor(e.currentTarget)}
                            sx={{
                                minWidth: 'auto', color: '#333', fontWeight: 700, borderRadius: '25px', border: '1px solid #eee', px: { xs: 0.8, md: 1.2, lg: 1.5 }, py: 0.6,
                                bgcolor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                whiteSpace: 'nowrap',
                                '&:hover': { borderColor: '#BA0000' },
                                '&:focus-visible': {
                                    outline: '2px solid #BA0000',
                                    outlineOffset: '2px'
                                }
                            }}
                            startIcon={<LanguageIcon sx={{ color: '#BA0000', fontSize: '1.1rem' }} />}
                            aria-label={t('accessibility.languageSelector')}
                            aria-haspopup="menu"
                            aria-expanded={Boolean(langAnchor)}
                        >
                            <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.82rem', fontWeight: 700 }}>
                                {t('header.language')}
                            </Typography>
                        </Button>

                        <IconButton
                            onClick={(e) => setAccessAnchor(e.currentTarget)}
                            sx={{
                                width: { xs: 36, md: 38 }, height: { xs: 36, md: 38 }, borderRadius: '12px', border: '1px solid #eee',
                                bgcolor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                '&:hover': { borderColor: '#BA0000' },
                                '&:focus-visible': {
                                    outline: '2px solid #BA0000',
                                    outlineOffset: '2px'
                                }
                            }}
                            aria-label={t('accessibility.accessibilityMenu')}
                            aria-haspopup="menu"
                            aria-expanded={Boolean(accessAnchor)}
                        >
                            <Box component="img" src="/Helper.png" sx={{ width: 18, height: 18 }} alt="Accessibility" />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%', pb: 1 }}>
                    <Search role="search">
                        <InputBase
                            placeholder={t('header.searchPlaceholder')}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearchSubmit();
                                }
                            }}
                            sx={{ color: '#333', p: '8px 20px', fontSize: '1rem', flex: 1 }}
                            inputProps={{
                                'aria-label': t('header.searchPlaceholder')
                            }}
                        />
                        <IconButton
                            sx={{ p: '10px' }}
                            onClick={handleSearchSubmit}
                            aria-label={t('header.search')}
                        >
                            <SearchIcon sx={{ color: '#BA0000' }} />
                        </IconButton>
                    </Search>
                </Box>
            </Toolbar>

            <Box
                component="img"
                src="/LineBilding.png"
                sx={{ width: '100%', display: 'block', height: 'auto', marginTop: '-10px', position: 'relative', zIndex: 10 }}
                alt=""
                aria-hidden="true"
            />

            <Menu
                anchorEl={langAnchor}
                open={Boolean(langAnchor)}
                onClose={() => setLangAnchor(null)}
                slotProps={{ paper: { sx: { borderRadius: '15px' } } }}
            >
                <MenuItem
                    onClick={() => handleLanguageChange('uk')}
                    sx={{ '&:focus-visible': { outline: '2px solid #BA0000' } }}
                >
                    {t('header.ukrainian')}
                </MenuItem>
                <MenuItem
                    onClick={() => handleLanguageChange('en')}
                    sx={{ '&:focus-visible': { outline: '2px solid #BA0000' } }}
                >
                    {t('header.english')}
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={accessAnchor}
                open={Boolean(accessAnchor)}
                onClose={() => setAccessAnchor(null)}
                slotProps={{ paper: { sx: { borderRadius: '15px', p: 1, minWidth: 200 } } }}
            >
                <Typography variant="overline" sx={{ px: 2, fontWeight: 800, color: '#999' }}>
                    {t('header.viewSite')}
                </Typography>
                <MenuItem
                    onClick={() => changeFontSize('14px')}
                    sx={{ '&:focus-visible': { outline: '2px solid #BA0000' } }}
                >
                    {t('header.standardText')}
                </MenuItem>
                <MenuItem
                    onClick={() => changeFontSize('17px')}
                    sx={{ '&:focus-visible': { outline: '2px solid #BA0000' } }}
                >
                    {t('header.enlargedText')}
                </MenuItem>
                <MenuItem
                    onClick={() => changeFontSize('19px')}
                    sx={{ '&:focus-visible': { outline: '2px solid #BA0000' } }}
                >
                    {t('header.largeText')}
                </MenuItem>
            </Menu>

            <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <Box sx={{ width: 250, p: 2 }} role="navigation" aria-label={t('header.menu')}>
                    <Typography variant="h6" sx={{ color: '#BA0000', fontWeight: 900, mb: 2 }}>
                        {t('header.menu')}
                    </Typography>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        '&.active': { color: '#BA0000', bgcolor: 'rgba(186, 0, 0, 0.08)' },
                                        '&:focus-visible': { outline: '2px solid #BA0000' }
                                    }}
                                >
                                    <ListItemText
                                        primary={t(item.pathKey)}
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