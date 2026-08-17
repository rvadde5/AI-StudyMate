import { Box, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatCard = ({ label, value, icon, color, trend, delay = 0 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1px solid ${alpha(color, isDark ? 0.2 : 0.12)}`,
          boxShadow: isDark
            ? `0 8px 32px ${alpha(color, 0.12)}`
            : `0 8px 32px ${alpha(color, 0.08)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.5)})`,
          },
        }}
      >
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(color, isDark ? 0.15 : 0.1),
              color,
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 2,
                bgcolor: alpha(trend >= 0 ? '#10b981' : '#ef4444', 0.12),
                color: trend >= 0 ? '#10b981' : '#ef4444',
              }}
            >
              {trend >= 0 ? (
                <TrendingUpIcon sx={{ fontSize: 16 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16 }} />
              )}
              <Typography variant="caption" fontWeight={700}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
          {value ?? 0}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500} mt={0.5}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default StatCard;
