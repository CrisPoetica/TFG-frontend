import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiEdit, FiPlus, FiCalendar, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import type { JournalEntryResponse, JournalEntryRequest } from '../types/journal';
import * as journalService from '../services/journalService';

const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
  
  h1 {
    margin: 0 0 20px 0;
    color: var(--text-primary);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--primary);
  color: var(--background);
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  &:hover {
    background-color: var(--primary-variant);
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background-color: var(--surface-variant);
    cursor: not-allowed;
  }
  
  &.delete-btn {
    background-color: var(--error);
    
    &:hover {
      background-color: #ff3b5f;
    }
  }
  
  &.edit-btn {
    background-color: var(--primary);
  }
  
  @media (max-width: 400px) {
    min-width: 100px;
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const JournalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const JournalCard = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px var(--shadow);
  }
  
  .journal-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
    margin-bottom: 15px;
    
    .title-date {
      h3 {
        margin: 0 0 8px 0;
        color: var(--text-primary);
        font-size: 18px;
      }
      
      .date {
        font-size: 12px;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .journal-content {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    text-align: left;
    flex-grow: 1;
  }
  
  .mood {
    display: inline-block;
    padding: 4px 10px;
    background-color: var(--card-bg);
    border-radius: 15px;
    font-size: 12px;
    color: var(--text-secondary);
  }
  
  .card-footer {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 15px;
  }
  
  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 10px;
    
    @media (max-width: 400px) {
      justify-content: center;
      width: 100%;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: var(--surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow);
  max-width: 600px;
  margin: 0 auto;
  
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

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--card-bg);
    color: var(--primary);
  }
  
  &.delete:hover {
    color: var(--error);
  }
`;

const JournalForm = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  margin-bottom: 30px;
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--text-primary);
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  input, textarea, select {
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
    min-height: 150px;
    resize: vertical;
  }
  
  .actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }
  
  .cancel-btn {
    background-color: var(--surface-variant);
    color: var(--text-secondary);
  }
`;

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryResponse | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('NEUTRAL');
  
  useEffect(() => {
    fetchEntries();
  }, []);
  
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await journalService.getAllEntries();
      setEntries(response);
    } catch (err) {
      console.error('Error al cargar entradas de diario:', err);
      setError('No se pudieron cargar las entradas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddEntry = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setMood('NEUTRAL');
    setShowForm(true);
  };
  
  const handleEditEntry = (entry: JournalEntryResponse) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || 'NEUTRAL');
    setShowForm(true);
  };
  
  const handleDeleteEntry = async (entryId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        setLoading(true);
        await journalService.deleteEntry(entryId);
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      } catch (err) {
        console.error('Error al eliminar entrada:', err);
        setError('No se pudo eliminar la entrada. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }
    
    try {
      setLoading(true);
      const entryData: JournalEntryRequest = {
        title,
        content,
        mood
      };
      
      let response: JournalEntryResponse;
      
      if (editingEntry) {
        response = await journalService.updateEntry(editingEntry.id, entryData);
        setEntries(prevEntries => 
          prevEntries.map(entry => 
            entry.id === editingEntry.id ? response : entry
          )
        );
      } else {
        response = await journalService.createEntry(entryData);
        setEntries(prevEntries => [...prevEntries, response]);
      }
      
      setShowForm(false);
      setTitle('');
      setContent('');
      setMood('NEUTRAL');
      setEditingEntry(null);
    } catch (err) {
      console.error('Error al guardar entrada:', err);
      setError('No se pudo guardar la entrada. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'd MMMM yyyy', { locale: es });
  };
  
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'VERY_HAPPY': return '😄';
      case 'HAPPY': return '🙂';
      case 'NEUTRAL': return '😐';
      case 'SAD': return '😔';
      case 'VERY_SAD': return '😢';
      default: return '😐';
    }
  };
  
  const getMoodText = (mood: string) => {
    switch (mood) {
      case 'VERY_HAPPY': return 'Muy feliz';
      case 'HAPPY': return 'Feliz';
      case 'NEUTRAL': return 'Neutral';
      case 'SAD': return 'Triste';
      case 'VERY_SAD': return 'Muy triste';
      default: return 'Neutral';
    }
  };
  
  return (
    <Layout>
      <PageContainer>
        <Header>
          <h1>Mi Diario Personal</h1>
          {!showForm && (
            <ActionButton onClick={handleAddEntry}>
              <FiPlus /> Nueva Entrada
            </ActionButton>
          )}
        </Header>
        
        {error && (
          <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        {showForm && (
          <JournalForm>
            <h2>{editingEntry ? 'Editar Entrada' : 'Nueva Entrada'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Título*</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="¿Qué ocurrió hoy?"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Contenido*</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe aquí tus pensamientos, reflexiones o experiencias..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="mood">¿Cómo te sientes?</label>
                <select
                  id="mood"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                >
                  <option value="VERY_HAPPY">Muy feliz 😄</option>
                  <option value="HAPPY">Feliz 🙂</option>
                  <option value="NEUTRAL">Neutral 😐</option>
                  <option value="SAD">Triste 😔</option>
                  <option value="VERY_SAD">Muy triste 😢</option>
                </select>
              </div>
              
              <div className="actions">
                <ActionButton 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                    setError(null);
                  }}
                >
                  <FiX /> Cancelar
                </ActionButton>
                <ActionButton type="submit">
                  <FiSave /> Guardar
                </ActionButton>
              </div>
            </form>
          </JournalForm>
        )}
        
        {entries.length > 0 ? (
          <JournalGrid>
            {entries.map(entry => (
              <JournalCard key={entry.id}>
                <div className="journal-header">
                  <div className="title-date">
                    <h3>{entry.title}</h3>
                    <div className="date">
                      <FiCalendar size={12} />
                      {formatDate(entry.createdAt)}
                    </div>
                  </div>
                  <div className="actions">
                    <IconButton onClick={() => handleEditEntry(entry)}>
                      <FiEdit />
                    </IconButton>
                    <IconButton className="delete" onClick={() => handleDeleteEntry(entry.id)}>
                      <FiTrash2 />
                    </IconButton>
                  </div>
                </div>
                <div className="journal-content">
                  {entry.content}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
                  {entry.mood && (
                    <div className="mood">
                      {getMoodEmoji(entry.mood)} {getMoodText(entry.mood)}
                    </div>
                  )}
                  <div className="card-actions">
                    <ActionButton 
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEntry(entry);
                      }}
                    >
                      <FiEdit /> Editar
                    </ActionButton>
                    <ActionButton 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEntry(entry.id);
                      }}
                    >
                      <FiTrash2 /> Eliminar
                    </ActionButton>
                  </div>
                </div>
              </JournalCard>
            ))}
          </JournalGrid>
        ) : (
          <EmptyState>
            <h3>No tienes entradas en tu diario</h3>
            <p>Tu diario personal es un espacio para reflexionar sobre tus experiencias, pensamientos y emociones.</p>
            <ActionButton onClick={handleAddEntry}>
              <FiEdit /> Crear Primera Entrada
            </ActionButton>
          </EmptyState>
        )}
        
        {loading && (
          <LoadingOverlay>
            <div className="spinner"></div>
            <p>Cargando...</p>
          </LoadingOverlay>
        )}
      </PageContainer>
    </Layout>
  );
};

export default JournalPage;
