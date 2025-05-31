import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, parseISO, isBefore, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiPlus, FiCheck, FiTrash2, FiCalendar, FiClock, FiFilter, FiList, FiTag } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import type { TaskResponse } from '../types/task';
import * as taskService from '../services/taskService';

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
  margin-bottom: 30px;
  width: 100%;
  
  h1 {
    margin: 0;
    color: var(--text-primary);
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

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: var(--surface);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px var(--shadow);
  
  .filters-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    
    .filters-group {
      width: 100%;
      justify-content: space-between;
    }
  }
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${props => props.$active ? 'var(--primary-light)' : 'var(--card-bg)'};
  color: ${props => props.$active ? 'var(--primary)' : 'var(--text-secondary)'};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--primary-light)' : 'var(--surface-variant)'};
  }
  
  svg {
    font-size: 16px;
  }
`;

const TasksContainer = styled.div`
  margin-bottom: 30px;
`;

const TaskItem = styled.div<{ $completed?: boolean; $overdue?: boolean }>`
  display: flex;
  align-items: center;
  background-color: var(--surface);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px var(--shadow);
  transition: all 0.2s ease;
  border-left: 4px solid ${props => {
    if (props.$completed) return 'var(--success)';
    if (props.$overdue) return 'var(--error)';
    return 'var(--primary)';
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow);
  }
  
  .checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 2px solid ${props => props.$completed ? 'var(--success)' : 'var(--border)'};
    background-color: ${props => props.$completed ? 'var(--success)' : 'transparent'};
    color: var(--background);
    margin-right: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: ${props => props.$completed ? 'var(--success)' : 'var(--primary)'};
    }
  }
  
  .task-content {
    flex: 1;
    
    .task-title {
      color: var(--text-primary);
      font-weight: ${props => props.$completed ? '400' : '600'};
      font-size: 16px;
      margin-bottom: 4px;
      text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
    }
    
    .task-description {
      color: var(--text-secondary);
      font-size: 14px;
      margin-bottom: 8px;
      text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
    }
    
    .task-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      color: ${props => props.$overdue ? 'var(--error)' : 'var(--text-secondary)'};
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
  
  .task-actions {
    display: flex;
    align-items: center;
    
    button {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 18px;
      cursor: pointer;
      padding: 6px;
      border-radius: 4px;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--card-bg);
        color: var(--primary);
      }
      
      &.delete:hover {
        color: var(--error);
      }
    }
  }
`;

const TaskForm = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  margin-bottom: 30px;
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--text-primary);
  }
  
  .form-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .form-group {
    flex: 1;
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--border);
    background-color: var(--input-bg);
    color: var(--text-primary);
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }
  
  .cancel-btn {
    background-color: var(--surface-variant);
    color: var(--text-secondary);
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

type FilterType = 'all' | 'pending' | 'completed';
type SortType = 'dueDate' | 'createdAt';

const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  
  // Filter and sort states
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getAllTasksForUser();
      setTasks(response);
      setError(null);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      setError('No se pudieron cargar las tareas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      setError('El título de la tarea es obligatorio');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const taskData = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        dueDate: newTaskDueDate || undefined,
        completed: false
      };
      
      const createdTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, createdTask]);
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error al crear tarea:', err);
      setError('No se pudo crear la tarea. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTaskCompletion = async (taskId: number, currentStatus: boolean) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(taskId, !currentStatus);
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
    } catch (err) {
      console.error('Error al actualizar estado de tarea:', err);
      setError('No se pudo actualizar el estado de la tarea. Por favor, intenta de nuevo.');
    }
  };
  
  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        setIsLoading(true);
        await taskService.deleteTask(taskId);
        setTasks(prev => prev.filter(task => task.id !== taskId));
      } catch (err) {
        console.error('Error al eliminar tarea:', err);
        setError('No se pudo eliminar la tarea. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    return !task.completed; // 'pending'
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      // Si no hay fecha de vencimiento, ordenar al final
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else { // 'createdAt'
      // Si no hay fecha de creación, ordenar al final
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      // parseISO ya maneja strings, por lo que no necesitamos hacer cast
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return 'Hoy';
      }
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString; // Devuelve el string original si no se puede parsear
    }
  };
  
  const isTaskOverdue = (task: TaskResponse) => {
    // Si no hay dueDate o ya está completada, nunca está vencida
    if (!task.dueDate || task.completed) return false;
    
    try {
      // parseISO sólo con un string válido
      const dueDate = parseISO(task.dueDate as string);
      // y compara Dates directamente
      return isBefore(dueDate, new Date()) && !isToday(dueDate);
    } catch (error) {
      console.error('Error al comprobar si la tarea está vencida:', error);
      return false;
    }
  };
  
  return (
    <Layout>
      <PageContainer>
        <ContentWrapper>
        <Header>
          <h1>Mis Tareas</h1>
          <ActionButton onClick={() => setShowAddForm(!showAddForm)}>
            <FiPlus /> Añadir Tarea
          </ActionButton>
        </Header>
        
        {error && (
          <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        {showAddForm && (
          <TaskForm>
            <h2>Nueva Tarea</h2>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label htmlFor="title">Título*</label>
                <input
                  type="text"
                  id="title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="¿Qué necesitas hacer?"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description">Descripción (opcional)</label>
                  <textarea
                    id="description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Añade detalles adicionales..."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="dueDate">Fecha límite (opcional)</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <ActionButton 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTaskTitle('');
                    setNewTaskDescription('');
                    setNewTaskDueDate('');
                    setError(null);
                  }}
                >
                  Cancelar
                </ActionButton>
                <ActionButton type="submit">
                  Guardar Tarea
                </ActionButton>
              </div>
            </form>
          </TaskForm>
        )}
        
        <FiltersContainer>
          <div className="filters-group">
            <FilterButton 
              $active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              <FiList /> Todas
            </FilterButton>
            <FilterButton 
              $active={filter === 'pending'} 
              onClick={() => setFilter('pending')}
            >
              <FiClock /> Pendientes
            </FilterButton>
            <FilterButton 
              $active={filter === 'completed'} 
              onClick={() => setFilter('completed')}
            >
              <FiCheck /> Completadas
            </FilterButton>
          </div>
          
          <div className="filters-group">
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              <FiFilter /> Ordenar por:
            </span>
            <FilterButton 
              $active={sortBy === 'dueDate'} 
              onClick={() => setSortBy('dueDate')}
            >
              Fecha límite
            </FilterButton>
            <FilterButton 
              $active={sortBy === 'createdAt'} 
              onClick={() => setSortBy('createdAt')}
            >
              Fecha creación
            </FilterButton>
          </div>
        </FiltersContainer>
        
        <TasksContainer>
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskItem 
                key={task.id} 
                $completed={task.completed}
                $overdue={isTaskOverdue(task)}
              >
                <div 
                  className="checkbox" 
                  onClick={() => toggleTaskCompletion(task.id, task.completed)}
                >
                  {task.completed && <FiCheck />}
                </div>
                
                <div className="task-content">
                  <div className="task-title">{task.title || task.description}</div>
                  {task.title && task.description && (
                    <div className="task-description">{task.description}</div>
                  )}
                  
                  <div className="task-meta">
                    {task.createdAt ? (
                      <div className="meta-item">
                        <FiCalendar size={12} />
                        Creada: {format(parseISO(task.createdAt), 'dd/MM/yyyy', { locale: es })}
                      </div>
                    ) : task.dayOfWeek ? (
                      <div className="meta-item">
                        <FiCalendar size={12} />
                        Día: {task.dayOfWeek}
                      </div>
                    ) : null}
                    
                    {task.type && (
                      <div className="meta-item">
                        <FiTag size={12} />
                        Tipo: {task.type}
                      </div>
                    )}
                    
                    {task.dueDate && (
                      <div className="meta-item">
                        <FiClock size={12} />
                        Vence: {formatDateDisplay(task.dueDate)}
                        {isTaskOverdue(task) && ' (Vencida)'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="task-actions">
                  <button className="delete" onClick={() => handleDeleteTask(task.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </TaskItem>
            ))
          ) : (
            <EmptyState>
              <h3>No hay tareas que mostrar</h3>
              {filter !== 'all' ? (
                <p>No hay tareas que coincidan con el filtro seleccionado.</p>
              ) : (
                <p>Comienza añadiendo tu primera tarea para organizarte mejor.</p>
              )}
              {filter !== 'all' && (
                <ActionButton onClick={() => setFilter('all')}>
                  Ver todas las tareas
                </ActionButton>
              )}
            </EmptyState>
          )}
        </TasksContainer>
        
        {isLoading && (
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

export default MyTasksPage;
