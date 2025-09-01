// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../src/components/components1/Layout';
import { AuthProvider, ProtectedRoute } from '../src/components/api/AuthUtils';

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
import Notifications from './pages/Notifications'
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
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Публичные страницы */}
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/jobdetail" element={<JobDetail/>} />
            <Route path="/notifications" element={<Notifications/>} />
            {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}

            {/* Защищенные страницы для пользователей */}
            <Route path="/resume-dashboard" element={
              <ProtectedRoute>
                <ResumeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-resume" element={
              <ProtectedRoute>
                <CreateResume />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/create-job" element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            } />

            {/* Защищенные админские страницы */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/admin/leads" element={
              <ProtectedRoute>
                <Leads />
              </ProtectedRoute>
            } />
            <Route path="/admin/customers" element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            } />
            <Route path="/admin/deals" element={
              <ProtectedRoute>
                <Deals />
              </ProtectedRoute>
            } />
            <Route path="/admin/conversions" element={
              <ProtectedRoute>
                <Conversions />
              </ProtectedRoute>
            } />
            <Route path="/admin/cohort-analysis" element={
              <ProtectedRoute>
                <CohortAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/admin/geo-analysis" element={
              <ProtectedRoute>
                <GeoAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/admin/financial-reports" element={
              <ProtectedRoute>
                <FinanceialReports />
              </ProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/admin/revenue" element={
              <ProtectedRoute>
                <Revenue />
              </ProtectedRoute>
            } />
            <Route path="/admin/subscriptions" element={
              <ProtectedRoute>
                <Subs />
              </ProtectedRoute>
            } />
            <Route path="/admin/general-settings" element={
              <ProtectedRoute>
                <GeneralSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/integration-settings" element={
              <ProtectedRoute>
                <IntegrationSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/pricing-settings" element={
              <ProtectedRoute>
                <PricingSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/user-permissions" element={
              <ProtectedRoute>
                <UserPermissions />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/list" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/employers" element={
              <ProtectedRoute>
                <EmployerList />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/candidates" element={
              <ProtectedRoute>
                <CandidateList />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/profile/:userId" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin/social/manager" element={
              <ProtectedRoute>
                <SocialManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/social/scheduler" element={
              <ProtectedRoute>
                <PostScheduler />
              </ProtectedRoute>
            } />
            <Route path="/admin/social/analytics" element={
              <ProtectedRoute>
                <SocialAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/social/calendar" element={
              <ProtectedRoute>
                <ContentCalendar />
              </ProtectedRoute>
            } />
            <Route path="/admin/moderation/queue" element={
              <ProtectedRoute>
                <ReviewQueue />
              </ProtectedRoute>
            } />
            <Route path="/admin/moderation/reports" element={
              <ProtectedRoute>
                <ReportsManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/moderation/content" element={
              <ProtectedRoute>
                <ContentModeration />
              </ProtectedRoute>
            } />
            <Route path="/admin/jobs/list" element={
              <ProtectedRoute>
                <JobList />
              </ProtectedRoute>
            } />
            <Route path="/admin/jobs/moderation" element={
              <ProtectedRoute>
                <JobModeration />
              </ProtectedRoute>
            } />
            <Route path="/admin/jobs/analytics" element={
              <ProtectedRoute>
                <JobAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/jobs/templates" element={
              <ProtectedRoute>
                <JobTemplates />
              </ProtectedRoute>
            } />
          
            {/* 404 страница */}
            <Route path="*" element={<NotFoundPage />} /> 
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;