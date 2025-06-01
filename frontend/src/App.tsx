import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Inquiry from './pages/Inquiry';
import Footer from './components/Footer';
import Guidelines from './pages/Guidelines';
import CaseDetails from './pages/CaseDetails';
import InquiryDashboard from './pages/InquiryDashboard';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import CaseDetailDashboard from './pages/CaseDetailDashboard';
import Profile from './pages/Profile';
import Service from './pages/Service';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafbfc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/landing" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/inquiry-dashboard" element={<InquiryDashboard />} />
          <Route path="/case-details" element={<CaseDetails />} />
            <Route path="/case-details/:userId" element={<CaseDetails />} />
            <Route path="/case-details/id/:clientCaseId" element={<CaseDetails />} />
            <Route path="/case-detail-dashboard" element={<CaseDetailDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
