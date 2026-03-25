<<<<<<< HEAD
# Connect-4
=======
# Connect-4: Cyberpunk Edition

A beautifully crafted, offline-capable Connect-4 game featuring a neon cyberpunk aesthetic and a challenging Minimax-based AI opponent. 

## 🎮 Overview

This project is a modern reimagining of the classic Connect-4 game, built with React, TypeScript, and Vite. It features smooth animations powered by Framer Motion, a responsive game board, and a custom futuristic UI. You can play against a challenging AI opponent that uses the Minimax algorithm with Alpha-Beta pruning to calculate its moves.

## ✨ Features

- **Minimax AI Opponent:** Play against an intelligent AI that calculates the best possible moves using the Minimax algorithm enhanced with Alpha-Beta pruning.
- **Cyberpunk Aesthetic:** Custom glowing neon UI, circuit board backgrounds, glitch text effects, and a responsive "Robot Mascot" that reacts to the game state.
- **Smooth Animations:** High-quality micro-interactions, piece dropping animations, and win state highlighting using Framer Motion.
- **Offline Capable:** Designed to be fully functional offline, allowing the game to be run directly from the filesystem without a web server or internet connection.
- **Responsive Design:** Playable on both desktop and mobile devices.

## 🛠️ Technology Stack

- **Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, custom CSS (neon glows, scanline effects)
- **Animations:** Framer Motion
- **Fonts:** Orbitron, Rajdhani (self-hosted for offline support)
- **State Management & Routing:** React Query, React Router DOM

## 🚀 Getting Started

### Prerequisites

You will need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd connect-4
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

To run the game locally in development mode:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate an optimized build in the `dist` directory. Due to the offline setup, you can often open the `index.html` file inside the `dist` folder directly in your browser.

## 🧠 Game Logic Details

The game logic separates rendering from state calculation:
- `src/lib/gameLogic.ts`: Contains the core board management, win detection, and the Minimax AI algorithm implementation.
- `src/components/GameBoard.tsx`: Handles user interaction, rendering the grid pieces, and coordinating turns between the human player and the AI.

## 📄 License

This project is open source and available for personal or educational use.
>>>>>>> 94a1b1c (initial commit)
