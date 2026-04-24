import { Box, Button, IconButton } from '@mui/material';
import type { ViewMode } from '../types';
import {
    filterButtonSx,
    gridToggleButtonSx,
    gridToggleImageSx,
    rightControlsSx,
    topBarSx,
} from '../document.styles';

interface Props {
    filtersLabel: string;
    viewMode: ViewMode;
    onOpenFilters: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onToggleView: () => void;
    onToggleSort: () => void;
    isAscendingSort: boolean;
}

export default function DocumentsTopBar({
    filtersLabel,
    viewMode,
    onOpenFilters,
    onToggleView,
    onToggleSort,
    isAscendingSort,
}: Props) {
    const isGridActive = viewMode === 'cards';

    return (
        <Box sx={topBarSx}>
            <Button
                variant="outlined"
                onClick={onOpenFilters}
                startIcon={<Box component="img" src="/Filter.png" sx={{ width: 20 }} />}
                sx={filterButtonSx}
            >
                {filtersLabel}
            </Button>

            <Box sx={rightControlsSx}>
                <IconButton
                    onClick={onToggleSort}
                    sx={{
                        transition: '0.3s',
                        transform: isAscendingSort ? 'rotate(180deg)' : 'none',
                    }}
                >
                    <Box component="img" src="/bx_sort.png" sx={{ width: 24 }} />
                </IconButton>

                <Box onClick={onToggleView} sx={gridToggleButtonSx(isGridActive)}>
                    <Box
                        component="img"
                        src="/mdi_grid.png"
                        sx={gridToggleImageSx(isGridActive)}
                    />
                </Box>
            </Box>
        </Box>
    );
}