import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import PlannerPage from './pages/PlannerPage';
import HabitsPage from './pages/HabitsPage';
import GoalsPage from './pages/GoalsPage';
import JournalPage from './pages/JournalPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import MyTasksPage from './pages/MyTasksPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import GlobalStyles from './styles/GlobalStyles';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
          <Route path="/chat" element={<PrivateRoute element={<ChatPage />} />} />
          <Route path="/planner" element={<PrivateRoute element={<PlannerPage />} />} />
          <Route path="/tasks" element={<PrivateRoute element={<MyTasksPage />} />} />
          <Route path="/habits" element={<PrivateRoute element={<HabitsPage />} />} />
          <Route path="/goals" element={<PrivateRoute element={<GoalsPage />} />} />
          <Route path="/journal" element={<PrivateRoute element={<JournalPage />} />} />
          <Route path="/mood" element={<PrivateRoute element={<MoodTrackerPage />} />} />
          <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
