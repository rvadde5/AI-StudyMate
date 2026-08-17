import { Box, Typography, alpha, useTheme } from '@mui/material';

const PageHeader = ({ title, subtitle, action, badge }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      mb={4}
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      gap={2}
    >
      <Box>
        {badge && (
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: '0.1em',
              mb: 0.5,
              display: 'block',
            }}
          >
            {badge}
          </Typography>
        )}
        <Typography
          variant="h4"
          component="h1"
          fontWeight={800}
          sx={{
            background: isDark
              ? 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" mt={0.5} maxWidth={560}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;
