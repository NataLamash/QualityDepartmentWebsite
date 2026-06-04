import { Box, IconButton, Typography } from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { formatDate } from '../utils/documentUtils';
import type { Lang, UiDocument } from '../types';
import {
    listContainerSx,
    listContentSx,
    listDateSx,
    listIconBoxSx,
    listRowSx,
    listTitleSx,
    previewableRowSx,
} from '../document.styles';

interface Props {
    documents: UiDocument[];
    lang: Lang;
    namePlaceholder: string;
    getFullFilePath: (path: string) => string;
    onPreview: (documentItem: UiDocument) => void;
    onDownload: (documentItem: UiDocument) => Promise<void>;
}

export default function DocumentsListView({
    documents,
    lang,
    namePlaceholder,
    onPreview,
    onDownload,
}: Props) {
    return (
        <Box sx={listContainerSx}>
            {documents.map((doc) => (
                <Box
                    key={doc.id}
                    sx={{ ...listRowSx, ...previewableRowSx }}
                    onClick={() => onPreview(doc)}
                >
                    <Box sx={listIconBoxSx}>
                        <DescriptionRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>

                    <Box sx={listContentSx}>
                        <Typography component="p" sx={listTitleSx}>
                            {doc.title || namePlaceholder}
                        </Typography>
                        
                        <Typography component="p" sx={listDateSx}>
                            {formatDate(doc.publishDate, lang)}
                        </Typography>
                    </Box>

                    <IconButton
                        sx={{ color: '#BA0000' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            void onDownload(doc);
                        }}
                    >
                        <DownloadRoundedIcon />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
}