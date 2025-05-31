import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import type { MessageResponse, ConversationResponse } from '../types/ai';
import * as aiService from '../services/aiService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Contenedor de la página centrado
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;

// Contenedor del chat con margen automático para centrar
const ChatContainer = styled.div`
  margin: 0 auto;
  height: calc(100vh - var(--header-height) - 40px);
  display: flex;
  flex-direction: column;
  background-color: var(--surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px var(--shadow);
  width: 100%;
  max-width: 800px;
  border: 1px solid var(--border);
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  background-color: var(--surface-variant);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  
  h2 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    
    span {
      color: var(--primary);
      margin-left: 8px;
    }
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${props => props.isUser ? 'var(--primary)' : 'var(--card-bg)'};
  color: ${props => props.isUser ? 'var(--background)' : 'var(--text-primary)'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  position: relative;
  
  .message-time {
    font-size: 11px;
    color: ${props => props.isUser ? 'rgba(0, 0, 0, 0.5)' : 'var(--text-secondary)'};
    margin-top: 5px;
    text-align: right;
  }
`;

const InputArea = styled.div`
  padding: 15px;
  background-color: var(--surface-variant);
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border-radius: 24px;
  border: none;
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary);
  }
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  
  &:hover {
    background-color: var(--primary-variant);
  }
  
  &:disabled {
    background-color: var(--surface);
    color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 30px;
  margin: 20px auto;
  max-width: 600px;
  background-color: var(--card-bg);
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  
  h3 {
    color: var(--primary);
    margin-bottom: 10px;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

const FirstLoginMessage = styled(WelcomeMessage)`
  border-left: 4px solid var(--warning);
  
  h3 {
    color: var(--warning);
  }
`;

const ChatPage: React.FC = () => {
  const { firstLogin } = useAuth(); // Quitamos user porque no se usa (corrige lint error)
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        
        // Intentar cargar una conversación existente del localStorage
        const savedConversationId = localStorage.getItem('currentConversationId');
        
        if (savedConversationId) {
          try {
            // Recuperar conversación existente
            const existingConversation = await aiService.getConversation(parseInt(savedConversationId));
            setConversation(existingConversation);
          } catch (loadError) {
            console.error('Error al cargar conversación existente:', loadError);
            // Si no se puede cargar la conversación existente, crear una nueva
            createNewConversation();
          }
        } else {
          // No hay conversación guardada, crear una nueva
          createNewConversation();
        }
      } catch (error) {
        setError('Error al inicializar el chat');
        console.error('Error inicializando chat:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeChat();
  }, [firstLogin]);
  
  // Función para crear una nueva conversación
  const createNewConversation = async () => {
    try {
      // Intentar crear una conversación con el backend
      const newConversation = await aiService.startConversation();
      setConversation(newConversation);
      // Guardar el ID de la conversación en localStorage
      localStorage.setItem('currentConversationId', newConversation.id.toString());
      
      // Si es la primera vez que el usuario inicia sesión, enviar un mensaje de bienvenida
      if (firstLogin) {
        const welcomeMsg = { content: '¡Hola! Soy tu asistente personal. Me gustaría conocerte mejor para ayudarte a establecer hábitos y metas. ¿Podrías contarme un poco sobre ti, tus objetivos personales, y en qué áreas te gustaría mejorar?' };
        await aiService.sendMessage(newConversation.id, welcomeMsg);
        
        // Recargar la conversación para obtener el mensaje de bienvenida
        const updatedConv = await aiService.getConversation(newConversation.id);
        setConversation(updatedConv);
      }
      
    } catch (err) {
      console.error('Error al inicializar el chat:', err);
      
      // Si hay un error 403, creamos una conversación local simulada
      // Esto permite a nuevos usuarios usar el chat aún cuando el backend no esté disponible
      const axiosError = err as any;
      if (axiosError && axiosError.response && axiosError.response.status === 403) {
        console.log('Creando conversación local simulada para nuevo usuario');
        
        // Crear una conversación simulada conforme al tipo ConversationResponse
        const mockConversation: ConversationResponse = {
          id: 0, // ID temporal
          startedAt: new Date().toISOString(),
          messages: []
        };
        
        if (firstLogin) {
          // Añadir mensaje de bienvenida local conforme al tipo MessageResponse
          mockConversation.messages.push({
            id: 1,
            sender: 'ASSISTANT',
            content: '¡Hola! Soy tu asistente personal. Me gustaría conocerte mejor para ayudarte a establecer hábitos y metas. ¿Podrías contarme un poco sobre ti, tus objetivos personales, y en qué áreas te gustaría mejorar?',
            sentAt: new Date().toISOString()
          });
        }
        
        setConversation(mockConversation);
        // No guardamos ID en localStorage porque es una conversación temporal
      } else {
        // Otro tipo de error
        setError('No se pudo iniciar la conversación. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Desplazar automáticamente al último mensaje cuando llegan nuevos mensajes
  // Desplazar automáticamente al último mensaje cuando cambia la conversación
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !conversation) return;
    
    try {
      setLoading(true);
      setIsAiThinking(true);
      
      // Crear mensaje del usuario
      const userMsg: MessageResponse = {
        id: Date.now(), // ID temporal para UI
        sender: 'USER',
        content: message,
        sentAt: new Date().toISOString()
      };
      
      // Actualizar UI inmediatamente añadiendo el mensaje del usuario
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, userMsg]
        };
      });
      
      // Limpiar input
      setMessage('');
      
      // Si estamos en modo offline (conversación simulada con id=0)
      if (conversation.id === 0) {
        // Simular delay para mejor UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Crear respuesta simulada
        const aiMsg: MessageResponse = {
          id: Date.now() + 1,
          sender: 'ASSISTANT',
          content: 'Lo siento, estoy en modo offline. No puedo procesar tu solicitud en este momento. Por favor, intenta más tarde cuando la conexión con el servidor se restablezca.',
          sentAt: new Date().toISOString()
        };
        
        // Actualizar conversación simulada
        setConversation(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, aiMsg]
          };
        });
      } else {
        // Modo normal: enviar mensaje al servicio de IA
        await aiService.sendMessage(conversation.id, { content: message });
        
        // Obtener la conversación actualizada con la respuesta de la IA
        const updatedConversation = await aiService.getConversation(conversation.id);
        setConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError('No se pudo enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setIsAiThinking(false);
      setLoading(false);
    }
  };
  
  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };
  
  return (
    <Layout>
      <PageWrapper>
        <ChatContainer>
        <ChatHeader>
          <h2>
            Chat con IA <span>u2022</span> {conversation && format(new Date(conversation.startedAt), 'dd/MM/yyyy', { locale: es })}
          </h2>
        </ChatHeader>
        
        <ChatMessages>
          {firstLogin && (
            <FirstLoginMessage>
              <h3>¡Bienvenido/a por primera vez!</h3>
              <p>
                Para empezar a usar esta aplicación, necesitamos conocerte un poco.
                Conversa con la IA para que pueda ayudarte a establecer hábitos y metas 
                personalizadas segu00fan tus necesidades y objetivos.
              </p>
            </FirstLoginMessage>
          )}
          
          {!conversation?.messages.length && !firstLogin && (
            <WelcomeMessage>
              <h3>u00a1Bienvenido/a al Chat con IA!</h3>
              <p>
                Aquu00ed puedes conversar con tu asistente personal para recibir ayuda
                con la planificaciu00f3n de tu semana, establecer hu00e1bitos saludables,
                definir metas SMART, o cualquier otra pregunta que tengas.
              </p>
            </WelcomeMessage>
          )}
          
          {conversation?.messages.map((msg) => (
            <Message key={msg.id} isUser={msg.sender === 'USER'}>
              {msg.content}
              <div className='message-time'>{formatMessageTime(msg.sentAt)}</div>
            </Message>
          ))}
          
          {error && (
            <Message isUser={false}>
              <div style={{ color: 'var(--error)' }}>{error}</div>
            </Message>
          )}
          
          <div ref={messagesEndRef} />
        </ChatMessages>
        
        <InputArea>
          <Input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Escribe un mensaje...'
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={loading || isAiThinking}
          />
          <SendButton 
            onClick={handleSendMessage} 
            disabled={loading || isAiThinking || !message.trim()}
          >
            <FiSend />
          </SendButton>
        </InputArea>
        </ChatContainer>
      </PageWrapper>
    </Layout>
  );
};

export default ChatPage;
