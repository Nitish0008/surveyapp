import { Navigate, Route, Routes } from 'react-router-dom';
import PortalLayout from '../layouts/PortalLayout';
import HouseholdCensusWizardPage from '../pages/Census/HouseholdCensusWizardPage';
import ModulePlaceholderPage from '../pages/ComingSoon/ModulePlaceholderPage';
import OperatorDashboardPage from '../pages/Dashboard/OperatorDashboardPage';
import HouseholdListPage from '../pages/Households/HouseholdListPage';
import LivestockRecordsPage from '../pages/Livestock/LivestockRecordsPage';
import LoginPage from '../pages/Login/LoginPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, getDefaultRouteForRole } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole()} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PortalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<OperatorDashboardPage />} />

        {/* Multi-Step Household & Livestock Registration Workflow */}
        <Route
          path="households/new"
          element={<HouseholdCensusWizardPage key="new" mode="new" />}
        />
        <Route
          path="households/resume/:hhid"
          element={<HouseholdCensusWizardPage mode="resume" />}
        />
        <Route
          path="households/view/:hhid"
          element={<HouseholdCensusWizardPage mode="view" />}
        />

        {/* Listings */}
        <Route path="households" element={<HouseholdListPage />} />
        <Route path="livestock/entry" element={<Navigate to="/households/new" replace />} />
        <Route path="livestock/records" element={<LivestockRecordsPage />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />

        {/* Admin & Analytical Modules */}
        <Route
          path="masters/geography"
          element={
            <ModulePlaceholderPage
              title="Geographical Master Data"
              description="Manage Districts, Subdivisions/Blocks, Circles, Gram Panchayats/Municipalities, and Villages/Wards."
            />
          }
        />
        <Route
          path="masters/livestock"
          element={
            <ModulePlaceholderPage
              title="Livestock Master Data"
              description="Manage Species, Species Codes, Breed Types, Breeds, Breed Codes, Age Groups, Sex, Purpose, and Protection Statuses."
            />
          }
        />
        <Route
          path="users"
          element={
            <ModulePlaceholderPage
              title="User Management"
              description="Create departmental users, assign roles and district jurisdictions, activate/deactivate accounts, and reset passwords."
            />
          }
        />
        <Route
          path="reports"
          element={
            <ModulePlaceholderPage
              title="Reports & Analytics"
              description="District-wise, village-wise, species-wise, and breed-wise reports with Excel/CSV and PDF export."
            />
          }
        />
        <Route
          path="activity-logs"
          element={
            <ModulePlaceholderPage
              title="Activity Logs"
              description="Audit trail of user logins, household registrations, and census record modifications."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

