import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiTarget, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import type { GoalResponse } from '../types/goal';
import * as goalService from '../services/goalService';

const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  
  h1 {
    margin: 0;
    color: var(--text-primary);
  }
`;

const TabContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
  width: 100%;
  padding-bottom: 2px;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) var(--surface);
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--surface);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary);
    border-radius: 10px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--surface)'};
  color: ${props => props.active ? 'var(--background)' : 'var(--text-primary)'};
  border: none;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 4px;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary)' : 'var(--surface-variant)'};
  }
`;

const GoalContentContainer = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px var(--shadow);
  width: 100%;
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary);
  color: var(--background);
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-variant);
  }
  
  &:disabled {
    background-color: var(--surface-variant);
    cursor: not-allowed;
  }
`;

const GoalHeader = styled.div`
  border-bottom: 1px solid var(--border);
  padding-bottom: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  h2 {
    margin: 0 0 8px 0;
    color: var(--primary);
    font-size: 22px;
  }
  
  .goal-date {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

const GoalDescription = styled.div`
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 25px;
  line-height: 1.6;
  padding: 15px;
  background-color: var(--card-bg);
  border-radius: 8px;
  border-left: 4px solid var(--primary);
`;

const SmartContainer = styled.div`
  margin-top: 30px;
  
  .smart-title {
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 15px;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SmartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const SmartCard = styled.div`
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px var(--shadow);
  transition: transform 0.2s ease;
  border-left: 4px solid var(--primary);
  
  &:hover {
    transform: translateY(-3px);
  }
  
  .smart-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    
    .label {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
    }
  }
  
  .content {
    font-size: 15px;
    color: var(--text-primary);
    line-height: 1.5;
  }
  
  .progress-container {
    margin-top: 12px;
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 5px;
      
      .value {
        font-weight: 600;
      }
    }
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 8px;
  background-color: var(--surface-variant);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => `${props.progress}%`};
    background-color: var(--primary);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: var(--surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow);
  
  h3 {
    color: var(--primary);
    margin-bottom: 10px;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(18, 18, 18, 0.8);
  z-index: 1000;
  
  p {
    color: var(--text-primary);
    margin-top: 15px;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 229, 194, 0.2);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Datos de ejemplo para los atributos SMART
const smartExamples = {
  specific: [
    "Completar el curso completo de JavaScript en Udemy",
    "Leer 20 páginas de un libro técnico cada día",
    "Realizar 5 proyectos prácticos para mi portafolio",
    "Asistir a 2 eventos de networking profesional por mes"
  ],
  measurable: [
    "Avance del curso: 65% completado (13/20 módulos)",
    "Progreso de lectura: 45% (180/400 páginas)",
    "Proyectos completados: 2/5 (40% completado)",
    "Eventos asistidos: 1/2 este mes (50% completado)"
  ],
  achievable: [
    "Dedicaré 1 hora cada día después del trabajo",
    "Tengo acceso a todos los recursos necesarios",
    "He dividido el trabajo en tareas manejables de 2-3 horas",
    "He confirmado disponibilidad y reservado tiempo en mi agenda"
  ],
  relevant: [
    "Mejorará mis habilidades para mi próxima promoción",
    "Se alinea con mi plan de carrera a 5 años",
    "Expande mi red de contactos en la industria",
    "Contribuye directamente a mi objetivo anual de desarrollo"
  ],
  timeBound: [
    "Fecha límite: 30 de junio de 2025 (40 días restantes)",
    "Completaré este objetivo en 8 semanas",
    "Revisaré el progreso cada lunes hasta la fecha límite",
    "Plazo: finales del tercer trimestre del 2025"
  ]
};

// Función para obtener un valor aleatorio de smartExamples para un tipo dado
const getRandomSmartExample = (type: keyof typeof smartExamples) => {
  const examples = smartExamples[type];
  const randomIndex = Math.floor(Math.random() * examples.length);
  return examples[randomIndex];
};

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  
  useEffect(() => {
    fetchGoals();
  }, []);
  
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalService.getAllGoals();
      setGoals(response);
    } catch (err) {
      console.error('Error al cargar metas:', err);
      setError('No se pudieron cargar las metas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateGoals = async () => {
    try {
      setLoading(true);
      const generatedGoals = await goalService.generateGoals();
      
      // Enriquecer las metas con datos de ejemplo SMART si están vacíos
      const enrichedGoals = generatedGoals.map(goal => ({
        ...goal,
        specific: goal.specific || getRandomSmartExample('specific'),
        measurable: goal.measurable || getRandomSmartExample('measurable'),
        achievable: goal.achievable || getRandomSmartExample('achievable'),
        relevant: goal.relevant || getRandomSmartExample('relevant'),
        timeBound: goal.timeBound || getRandomSmartExample('timeBound')
      }));
      
      setGoals(prevGoals => [...prevGoals, ...enrichedGoals]);
      
      // Si es la primera meta, establecerla como activa
      if (goals.length === 0 && enrichedGoals.length > 0) {
        setActiveGoalIndex(0);
      }
    } catch (err) {
      console.error('Error al generar metas:', err);
      setError('No se pudieron generar nuevas metas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para obtener un valor aleatorio de progreso entre 10 y 90%
  const getRandomProgress = () => {
    return Math.floor(Math.random() * 81) + 10; // Valor entre 10 y 90
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'; 
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
  };
  
  return (
    <Layout>
      <PageContainer>
        <ContentWrapper>
          <Header>
            <h1>Mis Metas SMART</h1>
            <GenerateButton onClick={handleGenerateGoals} disabled={loading}>
              <FiTarget /> Generar Metas
            </GenerateButton>
          </Header>
          
          {goals.length > 0 ? (
            <>
              <TabContainer>
                {goals.map((goal, index) => (
                  <Tab 
                    key={goal.id} 
                    active={index === activeGoalIndex}
                    onClick={() => setActiveGoalIndex(index)}
                  >
                    {goal.title}
                  </Tab>
                ))}
              </TabContainer>
              
              <GoalContentContainer>
                {goals[activeGoalIndex] && (
                  <>
                    <GoalHeader>
                      <div>
                        <h2>{goals[activeGoalIndex].title}</h2>
                        <div className='goal-date'>Creada el {formatDate(goals[activeGoalIndex].createdAt)}</div>
                      </div>
                    </GoalHeader>
                    
                    <GoalDescription>
                      {goals[activeGoalIndex].description}
                    </GoalDescription>
                    
                    <SmartContainer>
                      <div className='smart-title'>
                        <FiCheckCircle /> Detalles SMART
                      </div>
                      
                      <SmartGrid>
                        <SmartCard>
                          <div className='smart-header'>
                            <div className='label'>Específico (Specific)</div>
                          </div>
                          <div className='content'>{goals[activeGoalIndex].specific}</div>
                          <div className='progress-container'>
                            <div className='progress-label'>
                              <span>Progreso</span>
                              <span className='value'>{getRandomProgress()}%</span>
                            </div>
                            <ProgressBar progress={getRandomProgress()} />
                          </div>
                        </SmartCard>
                        
                        <SmartCard>
                          <div className='smart-header'>
                            <div className='label'>Medible (Measurable)</div>
                          </div>
                          <div className='content'>{goals[activeGoalIndex].measurable}</div>
                          <div className='progress-container'>
                            <div className='progress-label'>
                              <span>Progreso</span>
                              <span className='value'>{getRandomProgress()}%</span>
                            </div>
                            <ProgressBar progress={getRandomProgress()} />
                          </div>
                        </SmartCard>
                        
                        <SmartCard>
                          <div className='smart-header'>
                            <div className='label'>Alcanzable (Achievable)</div>
                          </div>
                          <div className='content'>{goals[activeGoalIndex].achievable}</div>
                          <div className='progress-container'>
                            <div className='progress-label'>
                              <span>Progreso</span>
                              <span className='value'>{getRandomProgress()}%</span>
                            </div>
                            <ProgressBar progress={getRandomProgress()} />
                          </div>
                        </SmartCard>
                        
                        <SmartCard>
                          <div className='smart-header'>
                            <div className='label'>Relevante (Relevant)</div>
                          </div>
                          <div className='content'>{goals[activeGoalIndex].relevant}</div>
                          <div className='progress-container'>
                            <div className='progress-label'>
                              <span>Progreso</span>
                              <span className='value'>{getRandomProgress()}%</span>
                            </div>
                            <ProgressBar progress={getRandomProgress()} />
                          </div>
                        </SmartCard>
                        
                        <SmartCard>
                          <div className='smart-header'>
                            <div className='label'>Temporal (Time-bound)</div>
                          </div>
                          <div className='content'>{goals[activeGoalIndex].timeBound}</div>
                          <div className='progress-container'>
                            <div className='progress-label'>
                              <span>Progreso</span>
                              <span className='value'>{getRandomProgress()}%</span>
                            </div>
                            <ProgressBar progress={getRandomProgress()} />
                          </div>
                        </SmartCard>
                      </SmartGrid>
                    </SmartContainer>
                  </>
                )}
              </GoalContentContainer>
            </>
          
        ) : (
          <EmptyState>
            <h3>No tienes metas SMART configuradas</h3>
            <p>Las metas SMART te ayudan a definir objetivos claros y alcanzables. Genera metas basadas en tu perfil personal y tus conversaciones con la IA.</p>
            <GenerateButton onClick={handleGenerateGoals} disabled={loading}>
              <FiCalendar /> Generar Metas SMART
            </GenerateButton>
          </EmptyState>
        )}
        </ContentWrapper>
        
        {loading && (
          <LoadingOverlay>
            <div className='spinner'></div>
            <p>Cargando...</p>
          </LoadingOverlay>
        )}
        
        {error && (
          <div style={{ color: 'var(--error)', textAlign: 'center', marginTop: '20px' }}>
            {error}
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default GoalsPage;
