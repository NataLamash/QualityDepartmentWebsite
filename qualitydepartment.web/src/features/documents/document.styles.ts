export const pageContainerSx = {
    py: { xs: 4, md: 6 },
};

export const filterPaperSx = {
    p: { xs: 2, md: 3 },
    borderRadius: 4,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
};

export const cardsGridSx = {
    display: 'grid',
    gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, minmax(0, 1fr))',
        lg: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 3,
};

export const iconsGridSx = {
    display: 'grid',
    gridTemplateColumns: {
        xs: 'repeat(2, minmax(0, 1fr))',
        sm: 'repeat(3, minmax(0, 1fr))',
        md: 'repeat(4, minmax(0, 1fr))',
        lg: 'repeat(6, minmax(0, 1fr))',
    },
    gap: 2,
};

export const emptyStateSx = {
    p: 6,
    textAlign: 'center',
    borderRadius: 4,
    border: '1px solid',
    borderColor: 'divider',
};

export const documentCardSx = {
    height: '100%',
    borderRadius: 4,
    border: '1px solid',
    borderColor: 'divider',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
    },
};

export const documentIconPaperSx = {
    p: 2,
    borderRadius: 4,
    border: '1px solid',
    borderColor: 'divider',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3,
    },
};

export const documentPreviewBoxSx = {
    width: 56,
    height: 56,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'primary.light',
    color: 'primary.contrastText',
};

export const iconPreviewBoxSx = {
    width: 72,
    height: 72,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'primary.light',
    color: 'primary.contrastText',
};

export const clampedDescriptionSx = {
    minHeight: 60,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
};

export const clampedTitleSx = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: 42,
};

export const pageTitleSx = {
    fontWeight: 800,
    mb: { xs: 4, md: 8 },
    fontSize: { xs: '2.5rem', md: '3.75rem' },
};

export const topBarSx = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    mb: 6,
    gap: 2,
    borderBottom: '1px solid #E5A3A3',
    pb: 2,
};

export const filterButtonSx = {
    borderRadius: '20px',
    borderColor: '#BA0000',
    color: '#BA0000',
    textTransform: 'none',
    px: 3,
    fontWeight: 600,
    '&:hover': {
        borderColor: '#900000',
        bgcolor: 'rgba(186,0,0,0.05)',
    },
};

export const rightControlsSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
};

export const gridToggleButtonSx = (active: boolean) => ({
    bgcolor: active ? '#BA0000' : '#fff',
    p: 1,
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    transition: '0.3s',
    border: '1px solid',
    borderColor: active ? '#BA0000' : '#E5E5E5',
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
});

export const gridToggleImageSx = (active: boolean) => ({
    width: 24,
    height: 24,
    filter: active ? 'brightness(0) invert(1)' : 'none',
});

export const errorTextSx = {
    textAlign: 'center',
    color: '#BA0000',
    fontWeight: 700,
};

export const emptyTextSx = {
    textAlign: 'center',
    color: '#444',
    fontWeight: 600,
    py: 10,
};

export const listContainerSx = {
    display: 'flex',
    flexDirection: 'column',
};

export const listRowSx = {
    display: 'grid',
    gridTemplateColumns: { xs: '56px 1fr 40px', md: '72px 1fr 56px' },
    alignItems: 'center',
    gap: 2,
    py: 2,
    px: { xs: 1, md: 3 },
    borderBottom: '1px solid #E5A3A3',
};

export const listIconBoxSx = {
    width: { xs: 40, md: 48 },
    height: { xs: 40, md: 48 },
    borderRadius: '8px',
    bgcolor: '#BA0000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const listContentSx = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'flex-start', md: 'center' },
    justifyContent: 'space-between',
    gap: 1.5,
    minWidth: 0,
};

export const listTitleSx = {
    fontWeight: 700,
    color: '#1A1A1A',
    fontSize: { xs: '0.95rem', md: '1rem' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: { xs: '100%', md: '75%' },
};

export const listDateSx = {
    color: '#777',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
};

export const gridContainerSx = {
    display: 'grid',
    gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
    },
    gap: 4,
};

export const gridCardSx = {
    borderRadius: '28px',
    border: '1px solid #E8E8E8',
    bgcolor: '#fff',
    p: 3,
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: '0.3s',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    },
};

export const gridCardIconSx = {
    width: 64,
    height: 64,
    borderRadius: '18px',
    bgcolor: '#BA0000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 2,
};

export const gridCardTitleSx = {
    fontWeight: 800,
    fontSize: '1.1rem',
    color: '#1A1A1A',
    mb: 1.5,
    minHeight: '52px',
};

export const gridCardMetaSx = {
    color: '#7A7A7A',
    fontSize: '0.95rem',
    mb: 1.5,
};

export const gridCardDateSx = {
    color: '#7A7A7A',
    fontSize: '0.9rem',
    mb: 2.5,
};

export const downloadButtonSx = {
    borderRadius: '24px',
    borderColor: '#BA0000',
    color: '#BA0000',
    textTransform: 'none',
    fontWeight: 700,
    px: 2.5,
    '&:hover': {
        borderColor: '#900000',
        bgcolor: 'rgba(186,0,0,0.05)',
    },
};

export const loadMoreWrapSx = {
    display: 'flex',
    justifyContent: 'center',
    mt: 8,
};

export const loadMoreButtonSx = {
    borderRadius: '30px',
    px: 5,
    py: 1.5,
    borderColor: '#BA0000',
    color: '#BA0000',
    fontWeight: 800,
    textTransform: 'none',
    '&:hover': {
        borderColor: '#900000',
        bgcolor: 'rgba(186,0,0,0.05)',
    },
};

export const popoverPaperSx = {
    borderRadius: '24px',
    width: { xs: '90vw', sm: '360px' },
    mt: 1,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    overflow: 'hidden',
};

export const popoverContentSx = {
    p: 4,
};

export const popoverFieldsWrapSx = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
};

export const applyButtonSx = {
    bgcolor: '#BA0000',
    py: 2.2,
    borderRadius: '0 0 24px 24px',
    fontWeight: 800,
    '&:hover': { bgcolor: '#900000' },
};

export const previewDialogPaperSx = {
    borderRadius: '24px',
    overflow: 'hidden',
};

export const previewHeaderSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    px: { xs: 2, md: 3 },
    py: 2,
    borderBottom: '1px solid #E5A3A3',
};

export const previewHeaderLeftSx = {
    minWidth: 0,
    flex: 1,
};

export const previewTitleSx = {
    fontWeight: 800,
    color: '#1A1A1A',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

export const previewActionsSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexShrink: 0,
};

export const previewFrameSx = {
    width: '100%',
    height: { xs: '60vh', md: '78vh' },
    border: 'none',
    display: 'block',
    bgcolor: '#fff',
};

export const previewEmptySx = {
    p: 6,
    textAlign: 'center',
    color: '#666',
};

export const previewButtonSx = {
    borderRadius: '20px',
    borderColor: '#BA0000',
    color: '#BA0000',
    textTransform: 'none',
    fontWeight: 700,
    '&:hover': {
        borderColor: '#900000',
        bgcolor: 'rgba(186,0,0,0.05)',
    },
};

export const previewableRowSx = {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
        bgcolor: 'rgba(186,0,0,0.03)',
    },
};

export const gridCardClickableSx = {
    cursor: 'pointer',
};