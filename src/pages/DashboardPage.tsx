import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import {
  FiCheckSquare,
  FiCalendar,
  FiMessageSquare,
  FiTarget,
  FiRepeat,
  FiBook,
  FiSmile,
  FiSettings,
  FiChevronRight,
  FiSun
} from 'react-icons/fi';

const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, var(--accent-blue-dark) 0%, #004080 100%);
  border-radius: 12px;
  padding: 30px;
  color: white;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  h1 {
    margin: 0 0 12px 0;
    font-weight: 600;
    letter-spacing: -0.5px;
  }
  
  p {
    margin: 0;
    opacity: 0.95;
    max-width: 80%;
    line-height: var(--line-height-normal);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: var(--surface);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  display: flex;
  flex-direction: column;
  
  .stat-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    svg {
      color: var(--primary);
      margin-right: 10px;
    }
    
    h3 {
      margin: 0;
      font-size: var(--font-size-small);
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 5px;
  }
  
  .stat-description {
    font-size: var(--font-size-small);
    color: var(--text-secondary);
  }
`;

const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SectionCard = styled.div`
  background-color: var(--surface);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px var(--shadow);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .icon-container {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--card-bg);
      
      svg {
        color: var(--primary);
        font-size: 24px;
      }
    }
    
    .action-icon {
      color: var(--text-secondary);
    }
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: var(--text-primary);
  }
  
  p {
    margin: 0;
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
  }
`;

const PrimaryButton = styled.button`
  background-color: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  letter-spacing: 0.3px;
  
  &:hover {
    background-color: var(--accent-blue-dark);
  }
`;

const MotivationSection = styled.div`
  background-color: var(--surface);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px var(--shadow);
  margin-bottom: 30px;
  text-align: center;
  
  h2 {
    margin: 0 0 15px 0;
    color: var(--text-primary);
  }
  
  .quote {
    font-style: italic;
    color: var(--text-secondary);
    margin-bottom: 20px;
    font-size: var(--font-size-large);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: var(--line-height-normal);
  }
  
  .author {
    font-weight: 600;
    color: var(--primary);
  }
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [timeOfDay, setTimeOfDay] = useState('');
  
  // Determinar la hora del día para el saludo
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Buenos días');
    else if (hour < 20) setTimeOfDay('Buenas tardes');
    else setTimeOfDay('Buenas noches');
  }, []);
  
  // Simular citas motivacionales
  useEffect(() => {
    const quotes = [
      { text: 'El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.', author: 'Proverbio Chino' },
      { text: 'No midas tu progreso con la vara de los demás. Mide tu progreso con tu propia vara de ayer.', author: 'Jordan Peterson' },
      { text: 'Nunca es demasiado tarde para ser lo que podrías haber sido.', author: 'George Eliot' },
      { text: 'La única manera de hacer un gran trabajo es amar lo que haces.', author: 'Steve Jobs' },
      { text: 'El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor para continuar.', author: 'Winston Churchill' }
    ];
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);
  
  // Datos simulados para estadísticas
  const stats = [
    { icon: <FiCheckSquare size={24} />, title: 'Tareas Completadas', value: '12', description: 'en los últimos 7 días' },
    { icon: <FiRepeat size={24} />, title: 'Hábitos Activos', value: '5', description: 'seguimiento constante' },
    { icon: <FiTarget size={24} />, title: 'Metas en Progreso', value: '3', description: 'en camino a completarse' },
    { icon: <FiCalendar size={24} />, title: 'Días Registrados', value: '15', description: 'de uso consistente' }
  ];
  
  // Datos para las secciones
  const sections = [
    {
      icon: <FiCheckSquare size={24} />,
      title: 'Mis Tareas',
      description: 'Administra tus tareas diarias, establece prioridades y marca las completadas.',
      path: '/tasks'
    },
    {
      icon: <FiCalendar size={24} />,
      title: 'Planificador',
      description: 'Visualiza tu semana y organiza tus actividades de manera eficiente.',
      path: '/planner'
    },
    {
      icon: <FiRepeat size={24} />,
      title: 'Hábitos',
      description: 'Crea y da seguimiento a tus hábitos diarios para mejorar tu estilo de vida.',
      path: '/habits'
    },
    {
      icon: <FiTarget size={24} />,
      title: 'Metas SMART',
      description: 'Establece metas específicas, medibles, alcanzables, relevantes y temporales.',
      path: '/goals'
    },
    {
      icon: <FiBook size={24} />,
      title: 'Diario Personal',
      description: 'Registra tus pensamientos, ideas y reflexiones diarias.',
      path: '/journal'
    },
    {
      icon: <FiSmile size={24} />,
      title: 'Seguimiento de Ánimo',
      description: 'Monitorea tu estado de ánimo y emociones a lo largo del tiempo.',
      path: '/mood'
    },
    {
      icon: <FiMessageSquare size={24} />,
      title: 'Chat con IA',
      description: 'Conversa con nuestra IA asistente para obtener orientación y sugerencias.',
      path: '/chat'
    },
    {
      icon: <FiSettings size={24} />,
      title: 'Configuración',
      description: 'Personaliza tu experiencia y ajusta tus preferencias.',
      path: '/settings'
    }
  ];
  
  return (
    <Layout>
      <PageContainer>
        <ContentWrapper>
          <WelcomeSection>
            <h1>{timeOfDay}, {user?.username || 'Usuario'}!</h1>
            <p>Bienvenido de nuevo a tu asistente personal. ¿Qué te gustaría hacer hoy?</p>
            <PrimaryButton onClick={() => navigate('/chat')}>
              <FiMessageSquare /> Conversar con la IA
            </PrimaryButton>
          </WelcomeSection>
          
          <StatsSection>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <div className="stat-header">
                  {stat.icon}
                  <h3>{stat.title}</h3>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-description">{stat.description}</div>
              </StatCard>
            ))}
          </StatsSection>
          
          <h2>Mis Herramientas</h2>
          <SectionsGrid>
            {sections.map((section, index) => (
              <SectionCard 
                key={index}
                onClick={() => navigate(section.path)}
              >
                <div className="card-header">
                  <div className="icon-container">
                    {section.icon}
                  </div>
                  <FiChevronRight className="action-icon" size={20} />
                </div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </SectionCard>
            ))}
          </SectionsGrid>
          
          <MotivationSection>
            <FiSun size={32} color="var(--primary)" style={{ marginBottom: '10px' }} />
            <h2>Pensamiento del día</h2>
            <div className="quote">"{quote.text}"</div>
            <div className="author">— {quote.author}</div>
          </MotivationSection>
        </ContentWrapper>
      </PageContainer>
    </Layout>
  );
};

export default DashboardPage;
