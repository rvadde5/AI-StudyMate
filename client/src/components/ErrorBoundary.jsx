import { Component } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { ErrorOutline, Refresh, Home } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 2,
          }}
          role="alert"
        >
          <Container maxWidth="sm">
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                textAlign: 'center',
                borderRadius: 4,
              }}
            >
              <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Something went wrong
              </Typography>
              <Typography color="text.secondary" mb={3}>
                An unexpected error occurred. You can try again or return to the dashboard.
              </Typography>
              {import.meta.env.DEV && this.state.error && (
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    bgcolor: 'action.hover',
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                    textAlign: 'left',
                    overflow: 'auto',
                  }}
                >
                  {this.state.error.message}
                </Typography>
              )}
              <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={this.handleReset}
                >
                  Try Again
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/dashboard"
                  startIcon={<Home />}
                >
                  Go Home
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
