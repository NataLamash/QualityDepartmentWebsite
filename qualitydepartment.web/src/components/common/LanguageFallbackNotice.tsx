import { Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    hasTranslation: boolean;
}

export default function LanguageFallbackNotice({ hasTranslation }: Props) {
    const { i18n, t } = useTranslation();

    if (i18n.language === 'uk' || hasTranslation) return null;

    return (
        <Box sx={{ mb: 2 }}>
            <Alert severity="info" sx={{ borderRadius: '8px' }}>
                {t('content.noTranslationAlert')}
            </Alert>
        </Box>
    );
}