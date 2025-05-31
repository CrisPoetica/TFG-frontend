import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --background: #121212;
    --surface: #1e1e1e;
    --surface-variant: #2c2c2c;
    --primary: #00e5c2; /* Verde aguamarina */
    --primary-variant: #00b39b;
    --secondary: #006d5b;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --error: #cf6679;
    --success: #00e676;
    --warning: #ffab40;
    --info: #03a9f4;
    --accent-blue: #1e90ff; /* Azul celeste */
    --accent-blue-dark: #0066cc; /* Azul celeste oscuro */
    --border: #3a3a3a;
    --shadow: rgba(0, 0, 0, 0.5);
    --card-bg: #242424;
    --input-bg: #2a2a2a;
    --input-border: #3d3d3d;
    --overlay: rgba(0, 0, 0, 0.7);
    --sidebar-width: 250px;
    --header-height: 60px;
    
    /* Font sizes */
    --font-size-small: 12px;
    --font-size-body: 16px;
    --font-size-large: 18px;
    --font-size-h3: 20px;
    --font-size-h2: 24px;
    --font-size-h1: 32px;
    
    /* Line heights */
    --line-height-normal: 1.5;
    --line-height-heading: 1.3;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Font imports */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap');

  body {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    font-size: var(--font-size-body);
    background-color: var(--background);
    color: var(--text-primary);
    line-height: var(--line-height-normal);
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', 'Avenir', 'Segoe UI', system-ui, sans-serif;
    font-weight: 600;
    line-height: var(--line-height-heading);
  }
  
  h1 {
    font-size: var(--font-size-h1);
  }
  
  h2 {
    font-size: var(--font-size-h2);
  }
  
  h3 {
    font-size: var(--font-size-h3);
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-variant);
    }
  }

  button {
    background-color: var(--primary);
    color: var(--background);
    border: none;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: var(--primary-variant);
    }

    &:active {
      transform: scale(0.98);
    }

    &:disabled {
      background-color: var(--surface-variant);
      color: var(--text-secondary);
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    background-color: var(--input-bg);
    color: var(--text-primary);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 10px 12px;
    font-size: 14px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 2px rgba(0, 229, 194, 0.2);
    }

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: 16px;
    line-height: 1.3;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 16px;
  }

  // Scrollbar styles
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--surface);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--surface-variant);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-variant);
  }
`;

export default GlobalStyles;
