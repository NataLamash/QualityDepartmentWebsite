import { Box, Button, Typography } from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { formatDate } from '../utils/documentUtils';
import type { Lang, UiDocument } from '../types';
import {
    downloadButtonSx,
    gridCardClickableSx,
    gridCardDateSx,
    gridCardIconSx,
    gridCardMetaSx,
    gridCardSx,
    gridCardTitleSx,
    gridContainerSx,
    previewButtonSx,
} from '../document.styles';

interface Props {
    documents: UiDocument[];
    lang: Lang;
    namePlaceholder: string;
    getFullFilePath: (path: string) => string;
    onPreview: (documentItem: UiDocument) => void;
    onDownload: (documentItem: UiDocument) => Promise<void>;
}

export default function DocumentsGridView({
    documents,
    lang,
    namePlaceholder,
    onPreview,
    onDownload,
}: Props) {
    return (
        <Box sx={gridContainerSx}>
            {documents.map((doc) => (
                <Box
                    key={doc.id}
                    sx={{ ...gridCardSx, ...gridCardClickableSx }}
                    onClick={() => onPreview(doc)}
                >
                    <Box sx={gridCardIconSx}>
                        <DescriptionRoundedIcon sx={{ color: '#fff', fontSize: 34 }} />
                    </Box>

                    <Typography component="h3" sx={gridCardTitleSx}>
                        {doc.title || namePlaceholder}
                    </Typography>

                    <Typography component="p" sx={gridCardMetaSx}>
                        {doc.categoryName}
                    </Typography>

                    <Typography component="p" sx={gridCardDateSx}>
                        {formatDate(doc.publishDate, lang)}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            sx={previewButtonSx}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreview(doc);
                            }}
                        >
                            Переглянути
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<DownloadRoundedIcon />}
                            sx={downloadButtonSx}
                            onClick={(e) => {
                                e.stopPropagation();
                                void onDownload(doc);
                            }}
                        >
                            PDF
                        </Button>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}