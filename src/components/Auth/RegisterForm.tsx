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

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones bu00e1sicas
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await register(username, email, password);
      // Mostrar mensaje de u00e9xito
      alert('Registro exitoso. Por favor, inicia sesión para continuar.');
      // Redireccionar al login
      onToggleForm();
    } catch (err) {
      setError('Error al registrar el usuario. Intenta con otro nombre de usuario o correo.');
      console.error('Register error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <Title>Crear Cuenta</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor='username'>Nombre de usuario</Label>
          <Input
            id='username'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Elige un nombre de usuario'
            disabled={isSubmitting}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='email'>Correo electru00f3nico</Label>
          <Input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='tu@email.com'
            disabled={isSubmitting}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='password'>Contraseu00f1a</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Crea una contraseu00f1a'
            disabled={isSubmitting}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='confirmPassword'>Confirmar Contraseña</Label>
          <Input
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Repite tu contraseu00f1a'
            disabled={isSubmitting}
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
        </Button>
      </form>
      <LinkText>
        ¿Ya tienes una cuenta?{' '}
        <a onClick={onToggleForm}>Inicia sesión aquí</a>
      </LinkText>
    </FormContainer>
  );
};

export default RegisterForm;
