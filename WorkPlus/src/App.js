// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../src/components/components1/Layout';

// Import pages
import HomePage from './pages/Home';
import JobsPage from './pages/Jobs';
// import JobDetailPage from './pages/JobDetail';
// import ResumesPage from './pages/Resumes';
// import CreateResumePage from './pages/CreateResume';
// import PostJobPage from './pages/PostJob';
// import DashboardPage from './pages/Dashboard';
// import ProfilePage from './pages/Profile';
// import PricingPage from './pages/Pricing';
// import BlogPage from './pages/Blog';
// import BlogPostPage from './pages/BlogPost';
// import AboutPage from './pages/About';
// import ContactPage from './pages/Contact';
// import LoginPage from './pages/Login';
// import RegisterPage from './pages/Register';
// import NotFoundPage from './pages/NotFound';

// // Company specific pages
// import CompanyProfilePage from './pages/CompanyProfile';
// import CompanyDashboard from './pages/CompanyDashboard';
// import CompanyJobs from './pages/CompanyJobs';
// import CompanyAnalytics from './pages/CompanyAnalytics';

// // User profile pages
// import UserSettings from './pages/UserSettings';
// import UserApplications from './pages/UserApplications';
// import UserResumes from './pages/UserResumes';

// // Admin pages (если планируется админка)
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminUsers from './pages/admin/AdminUsers';
// import AdminJobs from './pages/admin/AdminJobs';
// import AdminCompanies from './pages/admin/AdminCompanies';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Главные страницы */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          
          {/* 404 страница */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;