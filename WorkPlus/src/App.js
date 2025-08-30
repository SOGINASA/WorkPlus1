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
import Leads from '../src/pages/admin/crm/LeadsList';
import Customers from '../src/pages/admin/crm/SalesPipeline';
import Deals from '../src/pages/admin/crm/ClientManagement';
import Conversions from '../src/pages/admin/analytics/ConversionFunnels';
import CohortAnalysis from '../src/pages/admin/analytics/CohortAnalysis';
import GeoAnalysis from '../src/pages/admin/analytics/GeoAnalytics';
import FinanceialReports from '../src/pages/admin/finances/FinancialReports';
import Payments from '../src/pages/admin/finances/Payments';
import Revenue from '../src/pages/admin/finances/Revenue';
import Subs from '../src/pages/admin/finances/Subscriptions';
import GeneralSettings from '../src/pages/admin/settings/GeneralSettings';
import IntegrationSettings from '../src/pages/admin/settings/IntegrationSettings';
import PricingSettings from '../src/pages/admin/settings/PricingSettings';
import UserPermissions from '../src/pages/admin/settings/UserPermissions';
import UserList from '../src/pages/admin/users/UserList';
import EmployerList from '../src/pages/admin/users/EmployerList';
import CandidateList from '../src/pages/admin/users/CandidateList';
import UserProfile from '../src/pages/admin/users/UserProfile';
import SocialManager from '../src/pages/admin/social/SocialManager';
import PostScheduler from '../src/pages/admin/social/PostScheduler';
import SocialAnalytics from '../src/pages/admin/social/SocialAnalytics';
import ContentCalendar from '../src/pages/admin/social/ContentCalendar';
import ReviewQueue from '../src/pages/admin/moderation/ReviewQueue';
import ReportsManagement from '../src/pages/admin/moderation/ReportsManagement';
import ContentModeration from '../src/pages/admin/moderation/ContentModeration';
import JobList from '../src/pages/admin/jobs/JobList';
import JobModeration from '../src/pages/admin/jobs/JobModeration';
import JobAnalytics from '../src/pages/admin/jobs/JobAnalytics';
import JobTemplates from '../src/pages/admin/jobs/JobTemplates';



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
          <Route path="/admin/leads" element={<Leads />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/deals" element={<Deals />} />
          <Route path="/admin/conversions" element={<Conversions />} />
          <Route path="/admin/cohort-analysis" element={<CohortAnalysis />} />
          <Route path="/admin/geo-analysis" element={<GeoAnalysis />} />
          <Route path="/admin/financial-reports" element={<FinanceialReports />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/revenue" element={<Revenue />} />
          <Route path="/admin/subscriptions" element={<Subs />} />
          <Route path="/admin/general-settings" element={<GeneralSettings />} />
          <Route path="/admin/integration-settings" element={<IntegrationSettings />} />
          <Route path="/admin/pricing-settings" element={<PricingSettings />} />
          <Route path="/admin/user-permissions" element={<UserPermissions />} />
          <Route path="users/list" element={<UserList />} />
            <Route path="users/employers" element={<EmployerList />} />
            <Route path="users/candidates" element={<CandidateList />} />
            <Route path="users/profile/:userId" element={<UserProfile />} />
            <Route path="social/manager" element={<SocialManager />} />
            <Route path="social/scheduler" element={<PostScheduler />} />
            <Route path="social/analytics" element={<SocialAnalytics />} />
            <Route path="social/calendar" element={<ContentCalendar />} />
            <Route path="moderation/queue" element={<ReviewQueue />} />
            <Route path="moderation/reports" element={<ReportsManagement />} />
            <Route path="moderation/content" element={<ContentModeration />} />
            <Route path="jobs/list" element={<JobList />} />
            <Route path="jobs/moderation" element={<JobModeration />} />
            <Route path="jobs/analytics" element={<JobAnalytics />} />
            <Route path="jobs/templates" element={<JobTemplates />} />
          
          {/* 404 страница */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;