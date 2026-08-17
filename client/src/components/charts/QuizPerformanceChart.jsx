import { Box, Typography, useTheme, alpha } from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const QuizPerformanceChart = ({ quizzes = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const data = quizzes
    .filter((q) => q.score !== null)
    .slice(0, 6)
    .reverse()
    .map((q, i) => ({
      name: `Q${i + 1}`,
      score: q.score,
      title: q.title?.slice(0, 20) || 'Quiz',
    }));

  if (!data.length) {
    return (
      <Box
        height={240}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Complete quizzes to see performance trends
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 240 }} aria-label="Quiz performance chart">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            domain={[0, 100]}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${alpha(isDark ? '#fff' : '#000', 0.08)}`,
              borderRadius: 12,
            }}
            formatter={(value) => [`${value}%`, 'Score']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.title || ''}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default QuizPerformanceChart;
