# 🏛️ Stoic Mentor - AI Companion

A philosophical reflection platform powered by Artificial Intelligence that allows users to engage in dialogues with the great masters of Stoicism: **Marcus Aurelius, Seneca, and Epictetus**. The system doesn't just mimic their voices; it applies the "Dichotomy of Control" and virtue-based logic to every interaction.

![Version](https://img.shields.io/badge/version-1.0.0-gold)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Cloud-orange?style=for-the-badge)

---

## 🌟 Key Features

- **Distinct AI Personalities:**
  - **Marcus Aurelius:** Solemn, rational, and paternal wisdom.
  - **Seneca:** Practical advice delivered as short epistles.
  - **Epictetus:** Blunt, rigorous, and strictly focused on mental discipline.
- **Multi-language Architecture:** Full support for both English and Spanish (UI & AI responses).
- **Obsidian Design (Dark Mode):** A minimalist interface inspired by marble and volcanic stone textures.
- **Advanced Prompt Engineering:** Utilizes *Few-Shot* prompting and *System Constraints* to ensure concise and powerful responses.
- **Meditative UX:** A custom loading screen featuring random Stoic quotes to encourage reflection while the server synchronizes the "Logos".

## 🛠️ Tech Stack

### Frontend
- **React 18 + TypeScript:** Strict typing for enhanced maintainability and scalability.
- **Tailwind CSS:** Responsive design and state-based transitions for Dark Mode.
- **Custom Hooks:** Decoupled chat logic to ensure UI components remain "pure" and testable.

### Backend
- **Node.js + Express:** Robust API for message orchestration.
- **Groq SDK:** Ultra-low latency inference using the **Llama 3.3 70B** model.
- **Axios:** Asynchronous request management with comprehensive error handling.

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/stoic-mentor.git](https://github.com/your-username/stoic-mentor.git)
   cd stoic-mentor