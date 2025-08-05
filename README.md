# Valorant Comp Randomizer

A Vue.js application that generates random team compositions for Valorant matches.

## Features

- Input 5 player names
- Select which role should be doubled (Duelist, Controller, Initiator, Sentinel, or Random)
- Generate a balanced team composition with one doubled role
- View role distribution summary
- Clean, responsive UI with Valorant-themed styling

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Deploy to GitHub Pages

1. **Set up git (if not already done):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Create a GitHub repository:**
   - Go to [GitHub](https://github.com) and create a new repository named `ValorantCompGenerator`
   - Don't initialize with README, .gitignore, or license (since we already have them)

3. **Connect to GitHub and push:**
   ```bash
   git add .
   git commit -m "Initial commit: Valorant Comp Randomizer"
   git branch -M main
   git remote add origin https://github.com/yourusername/ValorantCompGenerator.git
   git push -u origin main
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Select "gh-pages" branch and "/ (root)" folder
   - Click "Save"

Your app will be available at: `https://yourusername.github.io/ValorantCompGenerator/`

## How to Use

1. Enter the names of 5 players
2. Select which role you want to be doubled in the composition
3. Click "Generate Composition" to see the random role assignments
4. Click "Generate New Composition" to create a new random assignment

## Roles

- **Duelist**: Entry fraggers and aggressive players
- **Controller**: Smoke and map control specialists  
- **Initiator**: Information gathering and team setup
- **Sentinel**: Defensive anchors and site holders

## Tech Stack

- Vue 3
- Vite
- CSS3 with custom styling
- GitHub Pages for deployment
