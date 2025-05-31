import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, addDays, parseISO, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiPlus, FiCheckCircle, FiCircle, FiRefreshCw } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import type { PlanResponse, TaskResponse } from '../types/plan';
import * as planService from '../services/planService';

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
  
  h1 {
    margin: 0;
    color: var(--text-primary);
  }
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

const WeekInfo = styled.div`
  background-color: var(--card-bg);
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  
  h3 {
    color: var(--primary);
    margin: 0 0 10px 0;
    font-size: 16px;
  }
  
  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 14px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  width: 100%;
  
  &::-webkit-scrollbar {
    height: 5px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary);
    border-radius: 10px;
  }
`;

const DayTab = styled.button<{ isActive: boolean }>`
  padding: 12px 20px;
  background-color: ${props => props.isActive ? 'var(--primary)' : 'transparent'};
  color: ${props => props.isActive ? 'var(--background)' : 'var(--text-primary)'};
  border: none;
  border-bottom: ${props => props.isActive ? '3px solid var(--primary)' : '3px solid transparent'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-right: 4px;
  
  &:hover {
    background-color: ${props => props.isActive ? 'var(--primary)' : 'var(--card-bg)'};
  }
  
  .day-name {
    margin-bottom: 4px;
    font-size: 16px;
  }
  
  .day-date {
    font-size: 12px;
    opacity: 0.8;
    font-weight: normal;
  }
`;

const DayContent = styled.div`
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  width: 100%;
  
  .day-title {
    font-size: 20px;
    color: var(--primary);
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border);
  }
  
  .tasks {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

const Task = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background-color: var(--surface);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .task-check {
    cursor: pointer;
    color: var(--primary);
    font-size: 20px;
    min-width: 24px;
    margin-top: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  .task-content {
    flex: 1;
    
    .task-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
      text-decoration: ${props => props.className?.includes('completed') ? 'line-through' : 'none'};
      opacity: ${props => props.className?.includes('completed') ? 0.7 : 1};
    }
    
    .task-description {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
      text-decoration: ${props => props.className?.includes('completed') ? 'line-through' : 'none'};
      opacity: ${props => props.className?.includes('completed') ? 0.7 : 1};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: var(--card-bg);
  border-radius: 8px;
  
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
  position: absolute;
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

const PlannerPage: React.FC = () => {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string>('Lunes');
  
  // Cargar el plan actual al montar el componente
  useEffect(() => {
    loadCurrentPlan();
  }, []);
  
  const loadCurrentPlan = async () => {
    try {
      setLoading(true);
      
      // Comprobar si hay un ID de plan guardado en localStorage
      const savedPlanId = localStorage.getItem('currentPlanId');
      
      if (savedPlanId) {
        try {
          // Intentar cargar el plan con el ID guardado
          const planId = parseInt(savedPlanId);
          const tasks = await planService.getPlanTasks(planId);
          
          // Recrear el objeto del plan con las tareas recuperadas
          const weekStart = localStorage.getItem('currentPlanWeekStart') || format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
          const planData: PlanResponse = {
            id: planId,
            weekStart,
            tasks
          };
          
          setPlan(planData);
          console.log('Plan recuperado de localStorage con ID:', planId);
          return; // Salir si se recuperó con éxito
        } catch (localErr) {
          console.warn('Error al recuperar plan desde localStorage:', localErr);
          // Continuar para intentar obtener el plan actual del backend
        }
      }
      
      // Si no hay plan guardado o falló la recuperación, intentar obtener el plan actual del backend
      const currentPlan = await planService.getCurrentPlan();
      setPlan(currentPlan);
      
      // Guardar el ID del plan y la fecha de inicio en localStorage para futuras sesiones
      localStorage.setItem('currentPlanId', currentPlan.id.toString());
      localStorage.setItem('currentPlanWeekStart', currentPlan.weekStart);
      console.log('Plan obtenido del backend y guardado en localStorage:', currentPlan.id);
      
    } catch (err) {
      console.error('Error al cargar el plan:', err);
      setError('No se pudo cargar el plan actual. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const newPlan = await planService.createPlan(weekStart);
      setPlan(newPlan);
      
      // Guardar el nuevo plan en localStorage
      localStorage.setItem('currentPlanId', newPlan.id.toString());
      localStorage.setItem('currentPlanWeekStart', newPlan.weekStart);
      console.log('Nuevo plan generado y guardado en localStorage:', newPlan.id);
    } catch (err) {
      console.error('Error al generar el plan:', err);
      setError('No se pudo generar un nuevo plan. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleTask = async (planId: number, taskId: number, completed: boolean) => {
    try {
      setLoading(true);
      await planService.toggleTask(planId, taskId, !completed);
      
      // Actualizar el estado local para una respuesta instanátnea
      setPlan(prevPlan => {
        if (!prevPlan) return null;
        
        const updatedPlan = {
          ...prevPlan,
          tasks: prevPlan.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !completed } : task
          )
        };
        
        return updatedPlan;
      });
    } catch (err) {
      console.error('Error al cambiar el estado de la tarea:', err);
      setError('No se pudo actualizar la tarea. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  // Agrupar tareas por día de la semana
  const getTasksByDay = () => {
    if (!plan) return {};
    
    // Inicializar el objeto con los días en español como claves
    const tasksByDay: { [key: string]: TaskResponse[] } = {
      'Lunes': [],
      'Martes': [],
      'Miércoles': [],
      'Jueves': [],
      'Viernes': [],
      'Sábado': [],
      'Domingo': []
    };
    
    // Agrupar las tareas según el día de la semana que viene del backend
    plan.tasks.forEach(task => {
      if (tasksByDay[task.dayOfWeek]) {
        tasksByDay[task.dayOfWeek].push(task);
      } else {
        console.warn(`Día no reconocido: ${task.dayOfWeek}`);
      }
    });
    
    return tasksByDay;
  };
  
  // No necesitamos traducir, ya que los días ya vienen en español
  const translateDay = (day: string) => {
    // Simplemente devolvemos el día tal como viene
    return day;
  };
  
  // Obtener fecha para cada día basado en la fecha de inicio de la semana
  const getDateForDay = (day: string) => {
    if (!plan) return '';
    
    const weekStart = parseISO(plan.weekStart);
    // Mapeo de días en español a índices
    const dayToIndex: { [key: string]: number } = {
      'Lunes': 0,
      'Martes': 1,
      'Miércoles': 2,
      'Jueves': 3,
      'Viernes': 4,
      'Sábado': 5,
      'Domingo': 6
    };
    
    const dayIndex = dayToIndex[day];
    if (dayIndex === undefined) return '';
    
    return format(addDays(weekStart, dayIndex), 'dd/MM', { locale: es });
  };
  
  const tasksByDay = getTasksByDay();
  
  return (
    <Layout>
      <PageContainer>
        <ContentWrapper>
        <Header>
          <h1>Planificador Semanal</h1>
          <GenerateButton onClick={handleGeneratePlan} disabled={loading}>
            <FiRefreshCw /> Generar Plan
          </GenerateButton>
        </Header>
        
        {plan && (
          <WeekInfo>
            <h3>Plan para la semana del {format(parseISO(plan.weekStart), 'dd/MM/yyyy', { locale: es })}</h3>
            <p>Organiza tu semana de manera eficiente con estas tareas generadas por IA según tus objetivos y hábitos.</p>
          </WeekInfo>
        )}
        
        {plan ? (
          <>
            <TabsContainer>
              {Object.keys(tasksByDay).map((day) => (
                <DayTab 
                  key={day}
                  isActive={activeDay === day}
                  onClick={() => setActiveDay(day)}
                >
                  <span className='day-name'>{translateDay(day)}</span>
                  <span className='day-date'>{getDateForDay(day)}</span>
                </DayTab>
              ))}
            </TabsContainer>
            
            <DayContent>
              <h2 className='day-title'>{translateDay(activeDay)} {getDateForDay(activeDay)}</h2>
              <div className='tasks'>
                {tasksByDay[activeDay]?.length > 0 ? (
                  tasksByDay[activeDay].map((task) => (
                    <Task key={task.id} className={task.completed ? 'completed' : ''}>
                      <div 
                        className='task-check' 
                        onClick={() => handleToggleTask(plan.id, task.id, task.completed)}
                      >
                        {task.completed ? <FiCheckCircle /> : <FiCircle />}
                      </div>
                      <div className='task-content'>
                        <div className='task-title'>{task.type}</div>
                        <div className='task-description'>{task.description}</div>
                      </div>
                    </Task>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px', fontSize: '16px' }}>
                    No hay tareas para este día
                  </div>
                )}
              </div>
            </DayContent>
          </>
        ) : (
          <EmptyState>
            <h3>No hay un plan activo</h3>
            <p>Genera un nuevo plan para la semana haciendo clic en el botón "Generar Plan".</p>
            <GenerateButton onClick={handleGeneratePlan} disabled={loading}>
              <FiPlus /> Crear Plan Semanal
            </GenerateButton>
          </EmptyState>
        )}
        
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
        </ContentWrapper>
      </PageContainer>
    </Layout>
  );
};

export default PlannerPage;
