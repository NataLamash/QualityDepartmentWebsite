import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import type { UiDocument } from '../types';
import {
    previewActionsSx,
    previewButtonSx,
    previewDialogPaperSx,
    previewEmptySx,
    previewFrameSx,
    previewHeaderLeftSx,
    previewHeaderSx,
    previewTitleSx,
} from '../document.styles';

interface Props {
    open: boolean;
    documentItem: UiDocument | null;
    fileUrl: string;
    onClose: () => void;
    onDownload: (documentItem: UiDocument) => void;
}

export default function DocumentPreviewDialog({
    open,
    documentItem,
    fileUrl,
    onClose,
    onDownload,
}: Props) {
    const isPdf = fileUrl.toLowerCase().includes('.pdf');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            slotProps={{
                paper: {
                    sx: previewDialogPaperSx,
                },
            }}
        >
            <Box sx={previewHeaderSx}>
                <Box sx={previewHeaderLeftSx}>
                    <Typography component="h2" variant="h6" sx={previewTitleSx}>
                        {documentItem?.title || 'PDF'}
                    </Typography>
                </Box>

                <Box sx={previewActionsSx}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadRoundedIcon />}
                        sx={previewButtonSx}
                        onClick={() => {
                            if (documentItem) {
                                onDownload(documentItem);
                            }
                        }}
                    >
                        Завантажити
                    </Button>

                    <IconButton onClick={onClose}>
                        <CloseRoundedIcon />
                    </IconButton>
                </Box>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {documentItem && fileUrl && isPdf ? (
                    <Box
                        component="iframe"
                        src={`${fileUrl}#toolbar=1&navpanes=0`}
                        title={documentItem.title}
                        sx={previewFrameSx}
                    />
                ) : (
                    <Box sx={previewEmptySx}>
                        <Typography component="p">
                            Перегляд доступний тільки для PDF.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}