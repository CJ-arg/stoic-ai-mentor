# 🏛️ Mentor Estoico - AI Companion

Una plataforma de reflexión filosófica impulsada por Inteligencia Artificial que permite dialogar con los grandes maestros del estoicismo (**Marco Aurelio, Séneca y Epicteto**). El sistema no solo imita sus voces, sino que aplica los principios de la dicotomía del control y la virtud en cada respuesta.

![Versión](https://img.shields.io/badge/version-1.0.0-gold)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Cloud-orange?style=for-the-badge)

---

## 🌟 Características Principales

- **Personalidades Diferenciadas:** - **Marco Aurelio:** Sabiduría paternal y solemne.
  - **Séneca:** Consejos prácticos y directos en formato de epístola.
  - **Epicteto:** Riguroso, breve y enfocado en la disciplina mental.
- **Arquitectura Multilenguaje:** Soporte completo para Español e Inglés (UI e IA).
- **Diseño Obsidian (Dark Mode):** Interfaz minimalista inspirada en mármol y piedra volcánica.
- **Prompt Engineering Avanzado:** Uso de técnicas *Few-Shot* y *System Constraints* para garantizar respuestas breves y potentes.
- **UX de Meditación:** Pantalla de carga con citas aleatorias para fomentar la reflexión mientras el servidor sincroniza el "Logos".

## 🛠️ Stack Tecnológico

### Frontend
- **React 18 + TypeScript:** Tipado estricto para una mayor mantenibilidad.
- **Tailwind CSS:** Diseño responsivo y transiciones de estado para el Modo Oscuro.
- **Custom Hooks:** Lógica de chat desacoplada de la UI para facilitar el testing.

### Backend
- **Node.js + Express:** API robusta para la orquestación de mensajes.
- **Groq SDK:** Inferencia de ultra-baja latencia utilizando el modelo **Llama 3.3 70B**.
- **Axios:** Gestión de peticiones asíncronas con manejo de errores.

## 🚀 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/mentor-estoico.git](https://github.com/tu-usuario/mentor-estoico.git)
   cd mentor-estoico