import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiMessageSquare, 
  FiCalendar, 
  FiTarget, 
  FiRepeat, 
  FiLogOut, 
  FiList, 
  FiBook, 
  FiSmile, 
  FiSettings 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: var(--surface);
  color: var(--text-primary);
  padding: 20px 0;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  box-shadow: 2px 0 5px var(--shadow);
`;

const Logo = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid var(--border);
  
  h1 {
    font-size: 24px;
    margin: 0;
    color: var(--primary);
  }
  
  p {
    font-size: 12px;
    margin: 5px 0 0;
    color: var(--text-secondary);
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const NavSection = styled.div`
  margin-bottom: 15px;
  
  .section-title {
    padding: 0 20px;
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
`;

const NavItem = styled.li`
  margin-bottom: 2px;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: ${props => props.$active ? 'var(--primary)' : 'var(--text-primary)'};
  text-decoration: none;
  transition: all 0.3s ease;
  background-color: ${props => props.$active ? 'var(--primary-light)' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? 'var(--primary)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--primary-light)' : 'var(--surface-variant)'};
    color: var(--primary);
  }
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
`;

const UserInfo = styled.div`
  padding: 20px;
  border-top: 1px solid var(--border);
  margin-top: auto;
  
  .user-name {
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .user-email {
    font-size: 12px;
    color: var(--text-secondary);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  margin-top: 10px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background-color: var(--surface-variant);
    color: var(--error);
  }
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <SidebarContainer>
      <Logo>
        <h1>LifeTrack</h1>
        <p>Tu asistente personal</p>
      </Logo>
      
      <NavMenu>
        <NavSection>
          <div className="section-title">Principal</div>
          <NavItem>
            <NavLink to="/dashboard" $active={isActive('/dashboard')}>
              <FiHome /> Dashboard
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/chat" $active={isActive('/chat')}>
              <FiMessageSquare /> Hablar con IA
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <div className="section-title">Organización</div>
          <NavItem>
            <NavLink to="/tasks" $active={isActive('/tasks')}>
              <FiList /> Tareas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/planner" $active={isActive('/planner')}>
              <FiCalendar /> Planificador
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <div className="section-title">Desarrollo Personal</div>
          <NavItem>
            <NavLink to="/goals" $active={isActive('/goals')}>
              <FiTarget /> Metas SMART
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/habits" $active={isActive('/habits')}>
              <FiRepeat /> Hábitos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/journal" $active={isActive('/journal')}>
              <FiBook /> Diario
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/mood" $active={isActive('/mood')}>
              <FiSmile /> Estado de Ánimo
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <div className="section-title">Configuración</div>
          <NavItem>
            <NavLink to="/settings" $active={isActive('/settings')}>
              <FiSettings /> Preferencias
            </NavLink>
          </NavItem>
        </NavSection>
      </NavMenu>
      
      {user && (
        <UserInfo>
          <div className="user-name">{user.username}</div>
          <div className="user-email">{user.email}</div>
          <LogoutButton onClick={logout}>
            <FiLogOut /> Cerrar sesión
          </LogoutButton>
        </UserInfo>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
