import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 20px;
  overflow-y: auto;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Si no está autenticado, no mostrar la barra lateral
  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <LayoutContainer>
      <Sidebar />
      <Content>{children}</Content>
    </LayoutContainer>
  );
};

export default Layout;
