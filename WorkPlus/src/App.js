// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../src/components/components1/Layout';

// Import pages
import HomePage from './pages/Home';
import JobsPage from './pages/Jobs';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResumeDashboard from './pages/ResumeDashboard';
import CreateResume from './pages/CreateResume';
import LoginForm from '../src/components/auth/LoginForm'
import RegisterForm from '../src/components/auth/RegisterForm'
import Profile from '../src/components/auth/ProfileForm'
import JobDetail from './pages/JobDetail'
import CreateJob from './pages/CreateJobPage'
// import ResetPasswordPage from '../src/components/auth/Resetpassword';


// Admin
import AdminDashboard from '../src/pages/admin/dashboard/Dashboard';
import Analytics from '../src/pages/admin/dashboard/Analytics';
import Reports from '../src/pages/admin/dashboard/Reports';




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
import NotFoundPage from './pages/NotFound';

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/resume-dashboard" element={<ResumeDashboard />} />
          <Route path="/create-resume" element={<CreateResume />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobdetail" element={<JobDetail/>} />
          <Route path="/create-job" element={<CreateJob/>} />
          {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}


          {/* Админка */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/reports" element={<Reports />} />
          
          {/* 404 страница */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;