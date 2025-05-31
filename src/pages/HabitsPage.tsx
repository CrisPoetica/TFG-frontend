import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, parseISO, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiPlus, FiCheckCircle, FiCircle, FiEdit, FiTrash2, FiCalendar, FiTarget, FiRepeat } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import type { HabitResponse, HabitLogResponse, CreateHabitRequest, LogHabitRequest } from '../types/habit';
import * as habitService from '../services/habitService';

const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
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

const ActionButton = styled.button`
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

const GenerateButton = styled(ActionButton)`
  background-color: var(--primary-variant);
  
  &:hover {
    background-color: var(--primary);
  }
`;

const HabitDetailContainer = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px var(--shadow);
  margin-bottom: 30px;
  width: 100%;
`;

const HabitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
`;

const HabitCard = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px var(--shadow);
    border-left: 3px solid var(--primary);
  }
  
  .habit-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
    
    h3 {
      margin: 0;
      color: var(--primary);
      font-size: 18px;
    }
    
    .habit-actions {
      display: flex;
      gap: 8px;
      
      button {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        
        &:hover {
          background-color: var(--surface-variant);
          color: var(--primary);
        }
      }
    }
  }
  
  .habit-description {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 15px;
    line-height: 1.5;
  }
  
  .habit-frequency {
    font-size: 12px;
    color: var(--text-secondary);
    background-color: var(--card-bg);
    border-radius: 4px;
    padding: 4px 8px;
    display: inline-block;
    margin-bottom: 15px;
  }
  
  .habit-tracker {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    margin-top: 15px;
  }
`;

const DayCircle = styled.div<{ completed: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.completed ? 'var(--primary)' : 'var(--card-bg)'};
  color: ${props => props.completed ? 'var(--background)' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.completed ? 'var(--primary-variant)' : 'var(--surface-variant)'};
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 25px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 15px var(--shadow);
  
  h2 {
    color: var(--primary);
    margin-top: 0;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 10px 12px;
      border-radius: 4px;
      background-color: var(--input-bg);
      border: 1px solid var(--input-border);
      color: var(--text-primary);
      
      &:focus {
        border-color: var(--primary);
        outline: none;
      }
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    
    button {
      padding: 10px 16px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.cancel {
        background-color: transparent;
        border: 1px solid var(--border);
        color: var(--text-secondary);
        
        &:hover {
          background-color: var(--surface-variant);
        }
      }
      
      &.save {
        background-color: var(--primary);
        color: var(--background);
        border: none;
        
        &:hover {
          background-color: var(--primary-variant);
        }
        
        &:disabled {
          background-color: var(--surface-variant);
          cursor: not-allowed;
        }
      }
    }
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

interface HabitFormData {
  name: string;
  description: string;
  frequency: string;
}

interface CompletedDays {
  [habitId: number]: {
    [date: string]: boolean;
  }
}

const HabitsPage: React.FC = () => {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitResponse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeHabitIndex, setActiveHabitIndex] = useState(0);
  const [completedDays, setCompletedDays] = useState<CompletedDays>({});
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    frequency: 'DAILY'
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const response = await habitService.getAllHabits();
      if (response && Array.isArray(response)) {
        setHabits(response);
      } else {
        console.error('La respuesta no es un array:', response);
        setHabits([]);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = () => {
    setSelectedHabit(null);
    setFormData({
      name: '',
      description: '',
      frequency: 'DAILY'
    });
    setShowAddModal(true);
  };

  const handleEditHabit = (habit: HabitResponse) => {
    setSelectedHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency || 'DAILY'
    });
    setShowEditModal(true);
  };

  const handleDeleteHabit = async (habitId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      setLoading(true);
      try {
        await habitService.deleteHabit(habitId);
        setHabits(habits.filter(h => h.id !== habitId));
      } catch (error) {
        console.error('Error deleting habit:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveHabit = async () => {
    setLoading(true);
    try {
      if (selectedHabit) {
        const updatedHabit = await habitService.updateHabit(selectedHabit.id, formData);
        setHabits(habits.map(h => h.id === selectedHabit.id ? updatedHabit : h));
        setShowEditModal(false);
      } else {
        const newHabit = await habitService.createHabit(formData);
        setHabits([...habits, newHabit]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabitLog = async (habit: HabitResponse, date: string) => {
    try {
      // Actualización del estado local para mantener la UI responsiva
      setCompletedDays(prev => {
        const habitDays = prev[habit.id] || {};
        const newValue = !habitDays[date]; // Invertir el estado actual
        
        return {
          ...prev,
          [habit.id]: {
            ...habitDays,
            [date]: newValue
          }
        };
      });
      
      // En una implementación real, aquí llamaríamos a una API
      console.log(`Marcando hábito ${habit.id} como ${!completedDays[habit.id]?.[date] ? 'completado' : 'no completado'} para la fecha ${date}`);
      
      // Simulamos una llamada a la API
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error al actualizar el registro del hábito:', error);
      setLoading(false);
    }
  };

  const handleGenerateHabits = async () => {
    try {
      setLoading(true);
      const generatedHabits = await habitService.generateHabits();
      
      // Actualizar el estado con los nuevos hábitos generados
      if (generatedHabits && generatedHabits.length > 0) {
        setHabits(prevHabits => [...prevHabits, ...generatedHabits]);

        // Si es el primer hábito, establécelo como activo
        if (habits.length === 0) {
          setActiveHabitIndex(0);
        }
        
        // Mostrar mensaje de éxito
        setError(null);
      } else {
        setError('No se pudieron generar nuevos hábitos. El servicio no devolvió datos.');
      }
    } catch (err) {
      console.error('Error al generar hábitos:', err);
      setError('No se pudieron generar nuevos hábitos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <ContentWrapper>
          <Header>
            <h1>Mis Hábitos</h1>
            <ButtonsContainer>
              <GenerateButton onClick={handleGenerateHabits} disabled={loading}>
                <FiTarget /> Generar Hábitos
              </GenerateButton>
              <ActionButton onClick={() => setShowAddModal(true)}>
                <FiPlus /> Crear Hábito
              </ActionButton>
            </ButtonsContainer>
          </Header>
          
          {habits.length > 0 ? (
            <>
              <TabContainer>
                {habits.map((habit, index) => (
                  <Tab 
                    key={habit.id} 
                    active={index === activeHabitIndex}
                    onClick={() => setActiveHabitIndex(index)}
                  >
                    {habit.name}
                  </Tab>
                ))}
              </TabContainer>

              <HabitDetailContainer>
                {habits[activeHabitIndex] && (
                  <>
                    <div className='habit-header' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h2 style={{ margin: 0, color: 'var(--primary)' }}>{habits[activeHabitIndex].name}</h2>
                      <div className='habit-actions' style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleEditHabit(habits[activeHabitIndex])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                          <FiEdit size={20} />
                        </button>
                        <button onClick={() => handleDeleteHabit(habits[activeHabitIndex].id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className='habit-description' style={{ marginBottom: '30px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {habits[activeHabitIndex].description}
                    </div>
                    
                    <div style={{ marginTop: '20px' }}>
                      <h3>Seguimiento de los últimos 7 días</h3>
                      <div className='habit-tracker' style={{ display: 'flex', gap: '15px', marginTop: '15px', justifyContent: 'space-between' }}>
                        {Array.from({ length: 7 }).map((_, i) => {
                          const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
                          const dateFormatted = format(subDays(new Date(), 6 - i), 'dd/MM', { locale: es });
                          const habit = habits[activeHabitIndex];
                          const completed = completedDays[habit.id]?.[date] || false;
                          
                          return (
                            <div key={i} style={{ textAlign: 'center' }}>
                              <div style={{ marginBottom: '5px', fontSize: '12px' }}>{dateFormatted}</div>
                              <div 
                                style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  borderRadius: '50%', 
                                  backgroundColor: completed ? 'var(--primary)' : 'var(--card-bg)', 
                                  color: completed ? 'var(--background)' : 'var(--text-secondary)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleToggleHabitLog(habits[activeHabitIndex], date)}
                              >
                                {completed ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </HabitDetailContainer>

              <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Todos mis hábitos</h3>
              <HabitsGrid>
                {habits.map((habit, index) => (
                  <HabitCard 
                    key={habit.id} 
                    style={{ 
                      cursor: 'pointer', 
                      border: index === activeHabitIndex ? '2px solid var(--primary)' : 'none',
                      transform: index === activeHabitIndex ? 'translateY(-3px)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setActiveHabitIndex(index)}
                  >
                    <div className='habit-header'>
                      <h3>{habit.name}</h3>
                      <div className='habit-actions'>
                        <button onClick={(e) => { e.stopPropagation(); handleEditHabit(habit); }}>
                          <FiEdit size={18} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteHabit(habit.id); }}>
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className='habit-description'>{habit.description}</div>
                  </HabitCard>
                ))}
              </HabitsGrid>
            </>
          ) : (
            <EmptyState>
              <h3>No tienes hábitos configurados</h3>
              <p>Crea tu primer hábito para comenzar a mejorar tu rutina diaria</p>
              <ActionButton onClick={handleAddHabit}>
                <FiPlus /> Crear Hábito
              </ActionButton>
            </EmptyState>
          )}
          
          {showAddModal && (
            <Modal>
              <ModalContent>
                <h2>Nuevo Hábito</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Beber agua"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe tu hábito y por qué es importante para ti"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="frequency">Frecuencia</label>
                  <select
                    id="frequency"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  >
                    <option value="DAILY">Diario</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="MONTHLY">Mensual</option>
                  </select>
                </div>
                
                <div className="modal-footer">
                  <button 
                    className="cancel" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="save" 
                    onClick={handleSaveHabit}
                    disabled={!formData.name.trim()}
                  >
                    Crear
                  </button>
                </div>
              </ModalContent>
            </Modal>
          )}
          
          {loading && (
            <LoadingOverlay>
              <div className="spinner"></div>
              <p>Cargando...</p>
            </LoadingOverlay>
          )}
        {showEditModal && (
          <Modal>
            <ModalContent>
              <h2>Editar Hábito</h2>
              
              <div className="form-group">
                <label htmlFor="edit-name">Nombre</label>
                <input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Beber agua"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-description">Descripción</label>
                <textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe tu hábito y por qué es importante para ti"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-frequency">Frecuencia</label>
                <select
                  id="edit-frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                >
                  <option value="DAILY">Diario</option>
                  <option value="WEEKLY">Semanal</option>
                  <option value="MONTHLY">Mensual</option>
                </select>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="save" 
                  onClick={handleSaveHabit}
                  disabled={!formData.name.trim()}
                >
                  Actualizar
                </button>
              </div>
            </ModalContent>
          </Modal>
        )}
        
        {loading && (
          <LoadingOverlay>
            <div className="spinner"></div>
            <p>Cargando...</p>
          </LoadingOverlay>
        )}
        </ContentWrapper>
      </PageContainer>
    </Layout>
  );
};

export default HabitsPage;
