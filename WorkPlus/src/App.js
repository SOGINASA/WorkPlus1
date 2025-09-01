// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/components1/ui/Layout';
import AdminLayout from '../src/components/components1/layout/AdminLayout';
import { AuthProvider, ProtectedRoute } from '../src/components/api/AuthUtils';

// Import public pages
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
import NotFoundPage from './pages/NotFound';

// Admin pages imports
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичные страницы с обычным Layout */}
          <Route path="/*" element={<PublicRoutes />} />
          
          {/* Админские страницы с AdminLayout */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Публичные роуты с обычным Layout
const PublicRoutes = () => {
  return (
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

        {/* 404 для публичных страниц */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

// Админские роуты с AdminLayout
const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Редирект с /admin на дашборд */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="dashboard/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="dashboard/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />

        {/* Jobs */}
        <Route path="jobs/list" element={
          <ProtectedRoute>
            <JobList />
          </ProtectedRoute>
        } />
        <Route path="jobs/moderation" element={
          <ProtectedRoute>
            <JobModeration />
          </ProtectedRoute>
        } />
        <Route path="jobs/analytics" element={
          <ProtectedRoute>
            <JobAnalytics />
          </ProtectedRoute>
        } />
        <Route path="jobs/templates" element={
          <ProtectedRoute>
            <JobTemplates />
          </ProtectedRoute>
        } />

        {/* Users */}
        <Route path="users/list" element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        } />
        <Route path="users/employers" element={
          <ProtectedRoute>
            <EmployerList />
          </ProtectedRoute>
        } />
        <Route path="users/candidates" element={
          <ProtectedRoute>
            <CandidateList />
          </ProtectedRoute>
        } />
        <Route path="users/profiles" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />

        {/* Moderation */}
        <Route path="moderation/queue" element={
          <ProtectedRoute>
            <ReviewQueue />
          </ProtectedRoute>
        } />
        <Route path="moderation/reports" element={
          <ProtectedRoute>
            <ReportsManagement />
          </ProtectedRoute>
        } />
        <Route path="moderation/content" element={
          <ProtectedRoute>
            <ContentModeration />
          </ProtectedRoute>
        } />

        {/* Social */}
        <Route path="social/manager" element={
          <ProtectedRoute>
            <SocialManager />
          </ProtectedRoute>
        } />
        <Route path="social/scheduler" element={
          <ProtectedRoute>
            <PostScheduler />
          </ProtectedRoute>
        } />
        <Route path="social/analytics" element={
          <ProtectedRoute>
            <SocialAnalytics />
          </ProtectedRoute>
        } />
        <Route path="social/calendar" element={
          <ProtectedRoute>
            <ContentCalendar />
          </ProtectedRoute>
        } />

        {/* Finances */}
        <Route path="finances/revenue" element={
          <ProtectedRoute>
            <Revenue />
          </ProtectedRoute>
        } />
        <Route path="finances/subscriptions" element={
          <ProtectedRoute>
            <Subs />
          </ProtectedRoute>
        } />
        <Route path="finances/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />
        <Route path="finances/reports" element={
          <ProtectedRoute>
            <FinanceialReports />
          </ProtectedRoute>
        } />

        {/* CRM */}
        <Route path="crm/leads" element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        } />
        <Route path="crm/pipeline" element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="crm/clients" element={
          <ProtectedRoute>
            <Deals />
          </ProtectedRoute>
        } />

        {/* Settings */}
        <Route path="settings/general" element={
          <ProtectedRoute>
            <GeneralSettings />
          </ProtectedRoute>
        } />
        <Route path="settings/pricing" element={
          <ProtectedRoute>
            <PricingSettings />
          </ProtectedRoute>
        } />
        <Route path="settings/integrations" element={
          <ProtectedRoute>
            <IntegrationSettings />
          </ProtectedRoute>
        } />
        <Route path="settings/permissions" element={
          <ProtectedRoute>
            <UserPermissions />
          </ProtectedRoute>
        } />

        {/* Analytics */}
        <Route path="analytics/funnels" element={
          <ProtectedRoute>
            <Conversions />
          </ProtectedRoute>
        } />
        <Route path="analytics/cohorts" element={
          <ProtectedRoute>
            <CohortAnalysis />
          </ProtectedRoute>
        } />
        <Route path="analytics/geo" element={
          <ProtectedRoute>
            <GeoAnalysis />
          </ProtectedRoute>
        } />

        {/* Админский 404 */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Страница не найдена</h1>
              <p className="text-gray-400 mb-6">Запрашиваемая админская страница не существует.</p>
              <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
              >
                Вернуться на главную админки
              </button>
            </div>
          </div>
        } />
      </Routes>
    </AdminLayout>
  );
};

export default App;