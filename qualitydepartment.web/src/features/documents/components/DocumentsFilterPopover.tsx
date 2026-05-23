import { Box, Button, MenuItem, Popover, TextField, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import type { SortMode, UiCategory } from '../types';
import {
    applyButtonSx,
    popoverContentSx,
    popoverFieldsWrapSx,
    popoverPaperSx,
} from '../document.styles';

interface Props {
    open: boolean;
    anchorEl: HTMLButtonElement | null;
    onClose: () => void;
    onApply: () => void;
    title: string;
    categoryLabel: string;
    dateLabel: string;
    searchLabel: string;
    sortLabel: string;
    applyLabel: string;
    allCategoriesLabel: string;
    newestLabel: string;
    oldestLabel: string;
    azLabel: string;
    zaLabel: string;
    categories: UiCategory[];
    tempCategory: string;
    tempDate: string;
    tempSearch: string;
    tempSort: SortMode;
    onCategoryChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onSearchChange: (value: string) => void;
    onSortChange: (value: SortMode) => void;
    isQualityPage?: boolean; 
}

export default function DocumentsFilterPopover({
    open,
    anchorEl,
    onClose,
    onApply,
    title,
    categoryLabel,
    dateLabel,
    searchLabel,
    sortLabel,
    applyLabel,
    allCategoriesLabel,
    newestLabel,
    oldestLabel,
    azLabel,
    zaLabel,
    categories,
    tempCategory,
    tempDate,
    tempSearch,
    tempSort,
    onCategoryChange,
    onDateChange,
    onSearchChange,
    onSortChange,
    isQualityPage = false, 
}: Props) {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            slotProps={{
                paper: {
                    sx: popoverPaperSx,
                },
            }}
        >
            <Box sx={popoverContentSx}>
                <Typography component="h2" variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                    {title}
                </Typography>

                <Box sx={popoverFieldsWrapSx}>
                    {!isQualityPage && (
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label={categoryLabel}
                            value={tempCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                        >
                            <MenuItem value="all">{allCategoriesLabel}</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.name}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <TextField
                        type="date"
                        fullWidth
                        size="small"
                        label={dateLabel}
                        value={tempDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                            input: { sx: { borderRadius: '12px' } },
                        }}
                    />

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label={sortLabel}
                        value={tempSort}
                        onChange={(e) => onSortChange(e.target.value as SortMode)}
                        slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                    >
                        <MenuItem value="date-desc">{newestLabel}</MenuItem>
                        <MenuItem value="date-asc">{oldestLabel}</MenuItem>
                        <MenuItem value="name-asc">{azLabel}</MenuItem>
                        <MenuItem value="name-desc">{zaLabel}</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        placeholder={searchLabel}
                        value={tempSearch}
                        onChange={(e) => onSearchChange(e.target.value)}
                        slotProps={{
                            input: {
                                sx: { borderRadius: '15px' },
                                startAdornment: (
                                    <SearchRoundedIcon sx={{ color: '#999', mr: 1 }} />
                                ),
                            },
                        }}
                    />
                </Box>
            </Box>

            <Button fullWidth onClick={onApply} variant="contained" sx={applyButtonSx}>
                {applyLabel}
            </Button>
        </Popover>
    );
}