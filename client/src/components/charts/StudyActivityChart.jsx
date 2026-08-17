import { Box, Typography, useTheme, alpha } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const StudyActivityChart = ({ stats }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const data = [
    { name: 'Materials', value: stats?.documents ?? 0, fill: '#6366f1' },
    { name: 'Quizzes', value: stats?.quizzes ?? 0, fill: '#8b5cf6' },
    { name: 'Flashcards', value: stats?.flashcards ?? 0, fill: '#06b6d4' },
    { name: 'Chats', value: stats?.chatMessages ?? 0, fill: '#10b981' },
  ];

  return (
    <Box sx={{ width: '100%', height: 280 }} aria-label="Study activity chart">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={alpha(isDark ? '#fff' : '#000', 0.08)}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${alpha(isDark ? '#fff' : '#000', 0.08)}`,
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            cursor={{ fill: alpha(theme.palette.primary.main, 0.06) }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StudyActivityChart;
