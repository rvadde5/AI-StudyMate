import { Box, Skeleton, Grid, Paper } from '@mui/material';

export const DashboardSkeleton = () => (
  <Box aria-label="Loading dashboard" role="status">
    <Skeleton variant="text" width={200} height={48} sx={{ mb: 1 }} />
    <Skeleton variant="text" width={320} height={24} sx={{ mb: 3 }} />
    <Grid container spacing={3} mb={3}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box display="flex" gap={2}>
              <Skeleton variant="rounded" width={52} height={52} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={36} />
                <Skeleton variant="text" width="80%" />
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
          <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={240} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
          <Skeleton variant="text" width={140} height={32} sx={{ mb: 2 }} />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" height={48} sx={{ mb: 1 }} />
          ))}
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Skeleton variant="rounded" width={60} height={24} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="80%" height={28} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="70%" />
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export const ListSkeleton = ({ rows = 5 }) => (
  <Box aria-label="Loading list" role="status">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 1.5, borderRadius: 2 }} />
    ))}
  </Box>
);

export const ChatSkeleton = () => (
  <Box aria-label="Loading chat" role="status">
    {[1, 2, 3].map((i) => (
      <Box key={i} display="flex" gap={1.5} mb={2} justifyContent={i % 2 ? 'flex-end' : 'flex-start'}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="rounded" width={`${40 + i * 10}%`} height={64} sx={{ borderRadius: 3 }} />
      </Box>
    ))}
  </Box>
);

export default DashboardSkeleton;
