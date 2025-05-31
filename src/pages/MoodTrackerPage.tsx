import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiCalendar, FiPlusCircle, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import type { MoodEntryResponse, MoodEntryRequest, MoodType } from '../types/mood';
import * as moodService from '../services/moodService';

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
  
  .header-actions {
    display: flex;
    gap: 12px;
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
  
  &.secondary {
    background-color: var(--surface-variant);
    color: var(--text-secondary);
  }
`;

const CalendarSection = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  margin-bottom: 30px;
`;

const MonthNavigator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    font-size: 18px;
    color: var(--text-primary);
  }
  
  .month-actions {
    display: flex;
    gap: 8px;
  }
  
  button {
    background-color: var(--surface-variant);
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    color: var(--text-secondary);
    cursor: pointer;
    
    &:hover {
      background-color: var(--card-bg);
      color: var(--primary);
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  
  .weekday-header {
    text-align: center;
    font-weight: 600;
    color: var(--text-secondary);
    padding: 8px 0;
    font-size: 14px;
  }
`;

const DayCell = styled.div<{ $isCurrentMonth: boolean; $hasEntry: boolean; $mood?: string }>`
  aspect-ratio: 1;
  background-color: ${props => props.$hasEntry ? 'var(--card-bg)' : 'var(--background)'};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: 1px solid ${props => props.$hasEntry ? 'var(--primary-light)' : 'var(--border)'};
  opacity: ${props => props.$isCurrentMonth ? 1 : 0.5};
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
  }
  
  .day-number {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.$isCurrentMonth ? 'var(--text-primary)' : 'var(--text-secondary)'};
  }
  
  .mood-indicator {
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60%;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => {
      if (!props.$hasEntry) return 'transparent';
      switch (props.$mood) {
        case 'VERY_HAPPY': return '#4CAF50';
        case 'HAPPY': return '#8BC34A';
        case 'NEUTRAL': return '#FFC107';
        case 'SAD': return '#FF9800';
        case 'VERY_SAD': return '#F44336';
        default: return 'var(--primary)';
      }
    }};
  }
`;

const SummarySection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SummaryCard = styled.div`
  flex: 1;
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  
  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--text-primary);
    font-size: 16px;
  }
  
  .summary-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 10px;
  }
  
  .summary-subtext {
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .mood-distribution {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 15px;
  }
  
  .mood-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .mood-emoji {
      font-size: 16px;
      width: 24px;
    }
    
    .bar-container {
      flex: 1;
      height: 8px;
      background-color: var(--card-bg);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .bar-fill {
      height: 100%;
      border-radius: 4px;
    }
    
    .very-happy { background-color: #4CAF50; }
    .happy { background-color: #8BC34A; }
    .neutral { background-color: #FFC107; }
    .sad { background-color: #FF9800; }
    .very-sad { background-color: #F44336; }
    
    .percentage {
      width: 40px;
      font-size: 12px;
      color: var(--text-secondary);
      text-align: right;
    }
  }
`;

const MoodForm = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  margin-bottom: 30px;
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .close-button {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 18px;
      padding: 5px;
      
      &:hover {
        color: var(--primary);
      }
    }
  }
  
  .form-date {
    margin-bottom: 20px;
    font-size: 16px;
    color: var(--text-secondary);
  }
  
  .mood-selection {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
    @media (max-width: 640px) {
      flex-wrap: wrap;
      gap: 10px;
    }
  }
  
  .mood-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 15px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    
    &:hover {
      background-color: var(--card-bg);
    }
    
    &.selected {
      border-color: var(--primary);
      background-color: var(--primary-light);
    }
    
    .mood-emoji {
      font-size: 24px;
    }
    
    .mood-label {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  textarea {
    width: 100%;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid var(--border);
    background-color: var(--input-bg);
    color: var(--text-primary);
    min-height: 100px;
    resize: vertical;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
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

const MoodTrackerPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType>('NEUTRAL');
  const [notes, setNotes] = useState('');
  const [editingEntry, setEditingEntry] = useState<MoodEntryResponse | null>(null);
  
  // Calculate the start and end dates for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get all dates for the calendar grid
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  useEffect(() => {
    fetchMoodEntries();
  }, [currentDate]);
  
  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      const formattedStart = format(monthStart, 'yyyy-MM-dd');
      const formattedEnd = format(monthEnd, 'yyyy-MM-dd');
      
      const entries = await moodService.getMoodEntriesByDateRange(formattedStart, formattedEnd);
      setMoodEntries(entries);
    } catch (err) {
      console.error('Error al cargar entradas de u00e1nimo:', err);
      setError('No se pudieron cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  const handleDayClick = async (day: Date) => {
    setSelectedDate(day);
    
    // Check if there's an existing entry for this day
    const formattedDate = format(day, 'yyyy-MM-dd');
    const existingEntry = moodEntries.find(entry => {
      const entryDate = entry.date.split('T')[0]; // Handle potential time portion
      return entryDate === formattedDate;
    });
    
    if (existingEntry) {
      setEditingEntry(existingEntry);
      setSelectedMood(existingEntry.mood);
      setNotes(existingEntry.notes || '');
    } else {
      setEditingEntry(null);
      setSelectedMood('NEUTRAL');
      setNotes('');
    }
    
    setShowForm(true);
  };
  
  const handleSubmit = async () => {
    if (!selectedDate) return;
    
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const moodData: MoodEntryRequest = {
        date: formattedDate,
        mood: selectedMood,
        notes: notes.trim() || undefined
      };
      
      let updatedEntry;
      
      if (editingEntry) {
        // Update existing entry
        updatedEntry = await moodService.updateMoodEntry(editingEntry.id, moodData);
        setMoodEntries(prev => prev.map(entry => 
          entry.id === editingEntry.id ? updatedEntry : entry
        ));
      } else {
        // Create new entry
        updatedEntry = await moodService.createMoodEntry(moodData);
        setMoodEntries(prev => [...prev, updatedEntry]);
      }
      
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error al guardar entrada de u00e1nimo:', err);
      setError('No se pudo guardar la entrada. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const getEntryForDate = (date: Date): MoodEntryResponse | undefined => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return moodEntries.find(entry => {
      const entryDate = entry.date.split('T')[0]; // Handle potential time portion
      return entryDate === formattedDate;
    });
  };
  
  // Calculate summary statistics for mood entries
  const calculateSummary = () => {
    if (moodEntries.length === 0) {
      return {
        averageMood: 0,
        moodCounts: {},
        totalEntries: 0
      };
    }
    
    const moodValues = {
      'VERY_HAPPY': 5,
      'HAPPY': 4,
      'NEUTRAL': 3,
      'SAD': 2,
      'VERY_SAD': 1
    };
    
    const moodCounts: Record<MoodType, number> = {
      'VERY_HAPPY': 0,
      'HAPPY': 0,
      'NEUTRAL': 0,
      'SAD': 0,
      'VERY_SAD': 0
    };
    
    let totalMoodValue = 0;
    
    moodEntries.forEach(entry => {
      totalMoodValue += moodValues[entry.mood as keyof typeof moodValues];
      moodCounts[entry.mood as MoodType]++;
    });
    
    return {
      averageMood: totalMoodValue / moodEntries.length,
      moodCounts,
      totalEntries: moodEntries.length
    };
  };
  
  const summary = calculateSummary();
  
  const getMoodEmoji = (mood: MoodType): string => {
    switch (mood) {
      case 'VERY_HAPPY': return '😄';
      case 'HAPPY': return '🙂';
      case 'NEUTRAL': return '😐';
      case 'SAD': return '😔';
      case 'VERY_SAD': return '😢';
    }
  };
  
  const getMoodText = (mood: MoodType): string => {
    switch (mood) {
      case 'VERY_HAPPY': return 'Muy feliz';
      case 'HAPPY': return 'Feliz';
      case 'NEUTRAL': return 'Neutral';
      case 'SAD': return 'Triste';
      case 'VERY_SAD': return 'Muy triste';
    }
  };
  
  const getMoodValue = (mood: MoodType): number => {
    switch (mood) {
      case 'VERY_HAPPY': return 5;
      case 'HAPPY': return 4;
      case 'NEUTRAL': return 3;
      case 'SAD': return 2;
      case 'VERY_SAD': return 1;
    }
  };
  
  const getMoodClassname = (mood: MoodType): string => {
    switch (mood) {
      case 'VERY_HAPPY': return 'very-happy';
      case 'HAPPY': return 'happy';
      case 'NEUTRAL': return 'neutral';
      case 'SAD': return 'sad';
      case 'VERY_SAD': return 'very-sad';
    }
  };
  
  const getAverageMoodText = (value: number): string => {
    if (value === 0) return 'Sin datos';
    if (value >= 4.5) return 'Excelente';
    if (value >= 3.5) return 'Bueno';
    if (value >= 2.5) return 'Neutral';
    if (value >= 1.5) return 'Bajo';
    return 'Muy bajo';
  };
  
  const renderWeekdayHeaders = () => {
    const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return weekdays.map(day => (
      <div key={day} className="weekday-header">{day}</div>
    ));
  };
  
  const renderCalendarGrid = () => {
    const startDay = new Date(monthStart);
    
    // Adjust to Monday (1) as first day of week (ISO standard)
    let dayOfWeek = startDay.getDay() || 7; // Convert Sunday (0) to 7
    startDay.setDate(startDay.getDate() - (dayOfWeek - 1));
    
    const days = [];
    
    // Add weekday headers
    days.push(...renderWeekdayHeaders());
    
    // Generate 6 weeks (42 days) to ensure we have enough cells
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDay);
      currentDay.setDate(startDay.getDate() + i);
      
      const isCurrentMonth = currentDay.getMonth() === currentDate.getMonth();
      const entry = getEntryForDate(currentDay);
      const hasEntry = !!entry;
      
      days.push(
        <DayCell 
          key={`day-${i}`}
          onClick={() => handleDayClick(currentDay)}
          $isCurrentMonth={isCurrentMonth}
          $hasEntry={hasEntry}
          $mood={entry?.mood}
        >
          <div className="day-number">{format(currentDay, 'd')}</div>
          {hasEntry && (
            <div className="mood-indicator">
              {getMoodEmoji(entry.mood)}
            </div>
          )}
        </DayCell>
      );
    }
    
    return days;
  };
  
  return (
    <Layout>
      <PageContainer>
        <ContentWrapper>
        <Header>
          <h1>Seguimiento de Ánimo</h1>
        </Header>
        
        {error && (
          <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        <SummarySection>
          <SummaryCard>
            <h3>Ánimo Promedio</h3>
            <div className="summary-value">
              {summary.averageMood.toFixed(1)}
            </div>
            <div className="summary-subtext">
              {getAverageMoodText(summary.averageMood)}
            </div>
          </SummaryCard>
          
          <SummaryCard>
            <h3>Registros</h3>
            <div className="summary-value">
              {summary.totalEntries}
            </div>
            <div className="summary-subtext">
              {summary.totalEntries === 1 
                ? '1 día registrado' 
                : `${summary.totalEntries} días registrados`} este mes
            </div>
          </SummaryCard>
          
          <SummaryCard>
            <h3>Distribución de Estados</h3>
            <div className="mood-distribution">
              {Object.entries(summary.moodCounts).length > 0 ? (
                ['VERY_HAPPY', 'HAPPY', 'NEUTRAL', 'SAD', 'VERY_SAD'].map((mood) => {
                  const count = summary.moodCounts[mood as MoodType] || 0;
                  const percentage = summary.totalEntries > 0 
                    ? Math.round((count / summary.totalEntries) * 100) 
                    : 0;
                  
                  return (
                    <div key={mood} className="mood-bar">
                      <span className="mood-emoji">{getMoodEmoji(mood as MoodType)}</span>
                      <div className="bar-container">
                        <div 
                          className={`bar-fill ${getMoodClassname(mood as MoodType)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="percentage">{percentage}%</span>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  No hay datos para mostrar
                </div>
              )}
            </div>
          </SummaryCard>
        </SummarySection>
        
        <CalendarSection>
          <MonthNavigator>
            <button onClick={handlePrevMonth}>&larr; Mes anterior</button>
            <h2>{format(currentDate, 'MMMM yyyy', { locale: es })}</h2>
            <button onClick={handleNextMonth}>Mes siguiente &rarr;</button>
          </MonthNavigator>
          
          <CalendarGrid>
            {renderCalendarGrid()}
          </CalendarGrid>
        </CalendarSection>
        
        {showForm && selectedDate && (
          <MoodForm>
            <h2>
              Registro de Ánimo
              <button className="close-button" onClick={() => setShowForm(false)}>
                <FiX />
              </button>
            </h2>
            
            <div className="form-date">
              <FiCalendar style={{ marginRight: '8px' }} />
              {format(selectedDate, 'd MMMM yyyy', { locale: es })}
            </div>
            
            <div className="mood-selection">
              {(['VERY_HAPPY', 'HAPPY', 'NEUTRAL', 'SAD', 'VERY_SAD'] as MoodType[]).map((mood) => (
                <div 
                  key={mood}
                  className={`mood-option ${selectedMood === mood ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  <div className="mood-emoji">{getMoodEmoji(mood)}</div>
                  <div className="mood-label">{getMoodText(mood)}</div>
                </div>
              ))}
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notas (opcional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="¿Cuáles son tus pensamientos hoy? ¿Qué te hace sentir así?"
              />
            </div>
            
            <div className="form-actions">
              <ActionButton className="secondary" onClick={() => setShowForm(false)}>
                <FiX /> Cancelar
              </ActionButton>
              <ActionButton onClick={handleSubmit}>
                <FiCheck /> Guardar
              </ActionButton>
            </div>
          </MoodForm>
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

export default MoodTrackerPage;