import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 6px var(--shadow);
`;

const Title = styled.h2`
  margin-bottom: 24px;
  color: var(--primary);
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--text-primary);

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 229, 194, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary);
  color: var(--background);
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-variant);
  }

  &:disabled {
    background-color: var(--surface-variant);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error);
  font-size: 14px;
  margin-top: 4px;
  text-align: center;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-secondary);

  a {
    color: var(--primary);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login(username, password);
      // La redirección se maneja en el componente padre o por el enrutador
    } catch (err) {
      setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <Title>Iniciar Sesión</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor='username'>Nombre de usuario</Label>
          <Input
            id='username'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Tu nombre de usuario'
            disabled={isSubmitting}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='password'>Contraseña</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Tu contraseña'
            disabled={isSubmitting}
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
      <LinkText>
        ¿No tienes una cuenta?{' '}
        <a onClick={onToggleForm}>Regístrate aquí</a>
      </LinkText>
    </FormContainer>
  );
};

export default LoginForm;
