Proyecto TFG - Asistente Personal
Descripción
Este proyecto es una aplicación web para la gestión personal que incluye múltiples funcionalidades como seguimiento de hábitos, gestión de tareas, diario personal, seguimiento del estado de ánimo, planificador, chat con IA y establecimiento de objetivos.

Requisitos previos
Node.js (v18.0.0 o superior)

npm (v9.0.0 o superior)

Instalación
Clona el repositorio:

bash
Copiar
Editar
git clone https://github.com/CrisPoetica/TFG-frontend.git
cd TFG-frontend
Instala las dependencias:

bash
Copiar
Editar
npm install
Ejecución
Modo desarrollo
Para ejecutar la aplicación en modo desarrollo:

bash
Copiar
Editar
npm run dev
Esto iniciará el servidor de desarrollo en http://localhost:5173.

Construcción para producción
Para construir la aplicación para producción:

bash
Copiar
Editar
npm run build
Vista previa de la versión de producción
Para previsualizar la versión de producción:

bash
Copiar
Editar
npm run preview
Características principales
Dashboard: Resumen de actividades y estado general.

Gestión de tareas: Crear, editar, eliminar y marcar tareas como completadas.

Seguimiento de hábitos: Crear y dar seguimiento a hábitos diarios.

Diario personal: Registrar entradas de diario con formato enriquecido.

Seguimiento del estado de ánimo: Registrar y visualizar el estado de ánimo diario.

Establecimiento de objetivos: Definir y dar seguimiento a objetivos a corto, medio y largo plazo.

Planificador: Organizar actividades en un calendario.

Chat con IA: Asistente de IA para ayuda personal.

Configuración personalizada: Opciones de notificación y preferencias.

Tecnologías utilizadas
React 18

TypeScript

Vite

Chakra UI

React Router

Axios

Context API para la gestión de estado

Backend
La aplicación se conecta a un backend Spring Boot que proporciona API REST para la persistencia de datos. El backend se ejecuta en http://localhost:8080 por defecto.

Autora
Cristina Fuster - Trabajo de Fin de Grado