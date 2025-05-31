import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSave, FiBell, FiClock, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import type { UserNotificationSettings, WeekDay, MoodReminderFrequency } from '../types/notification';
import * as notificationService from '../services/notificationService';

const PageContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h1 {
    margin: 0;
    color: var(--text-primary);
  }
`;

const SaveButton = styled.button`
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

const SettingsCard = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  margin-bottom: 20px;
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--text-primary);
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const SettingGroup = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .setting-label {
    display: flex;
    flex-direction: column;
    
    .label {
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    
    .description {
      color: var(--text-secondary);
      font-size: 14px;
    }
  }
  
  .setting-control {
    min-width: 180px;
    
    @media (max-width: 768px) {
      min-width: 120px;
    }
  }
`;

const Toggle = styled.div`
  position: relative;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background-color: var(--surface-variant);
  transition: all 0.3s;
  cursor: pointer;
  
  &.active {
    background-color: var(--primary);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--background);
    transition: all 0.3s;
  }
  
  &.active::after {
    transform: translateX(24px);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--success);
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &.hidden {
    transform: translateY(100px);
    opacity: 0;
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

const ErrorMessage = styled.div`
  color: var(--error);
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
`;

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserNotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUserNotificationSettings();
      setSettings(response);
      setError(null);
    } catch (err) {
      console.error('Error al cargar configuración:', err);
      setError('No se pudo cargar la configuración. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      setLoading(true);
      const updatedSettings = await notificationService.updateNotificationSettings({
        enableDailyReminders: settings.enableDailyReminders,
        reminderTime: settings.reminderTime,
        enableWeeklyReport: settings.enableWeeklyReport,
        weeklyReportDay: settings.weeklyReportDay,
        enableMoodReminders: settings.enableMoodReminders,
        moodReminderFrequency: settings.moodReminderFrequency
      });
      
      setSettings(updatedSettings);
      setError(null);
      setShowSavedNotification(true);
      
      // Auto-hide the saved notification after 3 seconds
      setTimeout(() => {
        setShowSavedNotification(false);
      }, 3000);
    } catch (err) {
      console.error('Error al guardar configuración:', err);
      setError('No se pudo guardar la configuración. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggle = (setting: keyof UserNotificationSettings) => {
    if (!settings) return;
    
    if (typeof settings[setting] === 'boolean') {
      setSettings({
        ...settings,
        [setting]: !settings[setting]
      });
    }
  };
  
  const handleSelectChange = (setting: keyof UserNotificationSettings, value: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  const handleTimeChange = (time: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      reminderTime: time
    });
  };
  
  const weekDayOptions = [
    { value: 'MONDAY', label: 'Lunes' },
    { value: 'TUESDAY', label: 'Martes' },
    { value: 'WEDNESDAY', label: 'Miércoles' },
    { value: 'THURSDAY', label: 'Jueves' },
    { value: 'FRIDAY', label: 'Viernes' },
    { value: 'SATURDAY', label: 'Sábado' },
    { value: 'SUNDAY', label: 'Domingo' }
  ];
  
  const frequencyOptions = [
    { value: 'DAILY', label: 'Diariamente' },
    { value: 'EVERY_OTHER_DAY', label: 'Cada dos días' },
    { value: 'TWICE_A_WEEK', label: 'Dos veces por semana' },
    { value: 'WEEKLY', label: 'Semanalmente' }
  ];
  
  if (!settings && !loading && !error) {
    return null;
  }
  
  return (
    <Layout>
      <PageContainer>
        <Header>
          <h1>Configuración</h1>
          <SaveButton onClick={handleSaveSettings} disabled={loading}>
            <FiSave /> Guardar Cambios
          </SaveButton>
        </Header>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SettingsCard>
          <h2><FiBell /> Notificaciones</h2>
          
          <SettingGroup>
            <SettingRow>
              <div className="setting-label">
                <div className="label">Recordatorios diarios</div>
                <div className="description">Recibe un recordatorio diario para registrar tus tareas y metas</div>
              </div>
              <div className="setting-control">
                <Toggle 
                  className={settings?.enableDailyReminders ? 'active' : ''}
                  onClick={() => handleToggle('enableDailyReminders')}
                />
              </div>
            </SettingRow>
            
            <SettingRow>
              <div className="setting-label">
                <div className="label">Hora del recordatorio</div>
                <div className="description">Establece a qué hora quieres recibir los recordatorios diarios</div>
              </div>
              <div className="setting-control">
                <TimeInput 
                  type="time" 
                  value={settings?.reminderTime || '09:00'}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  disabled={!settings?.enableDailyReminders}
                />
              </div>
            </SettingRow>
          </SettingGroup>
        </SettingsCard>
        
        <SettingsCard>
          <h2><FiCalendar /> Informes Semanales</h2>
          
          <SettingGroup>
            <SettingRow>
              <div className="setting-label">
                <div className="label">Informe semanal</div>
                <div className="description">Recibe un resumen semanal de tu progreso y actividades</div>
              </div>
              <div className="setting-control">
                <Toggle 
                  className={settings?.enableWeeklyReport ? 'active' : ''}
                  onClick={() => handleToggle('enableWeeklyReport')}
                />
              </div>
            </SettingRow>
            
            <SettingRow>
              <div className="setting-label">
                <div className="label">Día de la semana</div>
                <div className="description">Elige qué día de la semana quieres recibir tu informe</div>
              </div>
              <div className="setting-control">
                <Select 
                  value={settings?.weeklyReportDay || 'MONDAY'}
                  onChange={(e) => handleSelectChange('weeklyReportDay', e.target.value as WeekDay)}
                  disabled={!settings?.enableWeeklyReport}
                >
                  {weekDayOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </div>
            </SettingRow>
          </SettingGroup>
        </SettingsCard>
        
        <SettingsCard>
          <h2><FiClock /> Recordatorios de Estado de Ánimo</h2>
          
          <SettingGroup>
            <SettingRow>
              <div className="setting-label">
                <div className="label">Recordatorios de estado de ánimo</div>
                <div className="description">Recibe recordatorios para registrar cómo te sientes</div>
              </div>
              <div className="setting-control">
                <Toggle 
                  className={settings?.enableMoodReminders ? 'active' : ''}
                  onClick={() => handleToggle('enableMoodReminders')}
                />
              </div>
            </SettingRow>
            
            <SettingRow>
              <div className="setting-label">
                <div className="label">Frecuencia</div>
                <div className="description">Establece con qué frecuencia quieres recibir recordatorios</div>
              </div>
              <div className="setting-control">
                <Select 
                  value={settings?.moodReminderFrequency || 'DAILY'}
                  onChange={(e) => handleSelectChange('moodReminderFrequency', e.target.value as MoodReminderFrequency)}
                  disabled={!settings?.enableMoodReminders}
                >
                  {frequencyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </div>
            </SettingRow>
          </SettingGroup>
        </SettingsCard>
        
        {loading && (
          <LoadingOverlay>
            <div className="spinner"></div>
            <p>Cargando...</p>
          </LoadingOverlay>
        )}
        
        <Notification className={showSavedNotification ? '' : 'hidden'}>
          <FiCheckCircle size={18} />
          Configuración guardada con éxito
        </Notification>
      </PageContainer>
    </Layout>
  );
};

export default SettingsPage;
