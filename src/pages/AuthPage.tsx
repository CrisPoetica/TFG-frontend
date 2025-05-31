import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { FiCheckCircle } from 'react-icons/fi';

// Styled components declared at top level
const AuthPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  background-color: var(--background);
`;

const FormWrapper = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const InfoPanel = styled.div`
  width: 50%;
  background-color: var(--primary);
  color: var(--background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  @media (max-width: 900px) {
    display: none;
  }
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
  }
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  .features {
    margin-top: 2rem;
    .feature {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      svg {
        margin-right: 10px;
        font-size: 1.2rem;
      }
    }
  }
`;

const AuthPage: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { isAuthenticated, firstLogin } = useAuth();

  const toggleForm = () => setIsLoginForm(prev => !prev);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return firstLogin ? <Navigate to="/chat" /> : <Navigate to="/planner" />;
  }

  return (
    <AuthPageContainer>
      <InfoPanel>
        <h1>Bienvenido a LifeBalance</h1>
        <p>
          Tu asistente personal para mejorar tus hábitos, gestionar tus tareas
          y mantener un equilibrio en tu vida diaria.
        </p>
        <div className="features">
          <div className="feature">
            <FiCheckCircle /> Seguimiento de hábitos diarios
          </div>
          <div className="feature">
            <FiCheckCircle /> Gestión de tareas y metas
          </div>
          <div className="feature">
            <FiCheckCircle /> Diario personal con seguimiento de ánimo
          </div>
          <div className="feature">
            <FiCheckCircle /> Asistente IA para ayudarte en tu día a día
          </div>
        </div>
      </InfoPanel>
      <FormWrapper>
        {isLoginForm ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </FormWrapper>
    </AuthPageContainer>
  );
};

export default AuthPage;
