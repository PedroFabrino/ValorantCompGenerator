# Valorant Comp Randomizer

[![Test and Deploy](https://github.com/PedroFabrino/ValorantCompGenerator/actions/workflows/deploy.yml/badge.svg)](https://github.com/PedroFabrino/ValorantCompGenerator/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/PedroFabrino/ValorantCompGenerator/branch/main/graph/badge.svg)](https://codecov.io/gh/PedroFabrino/ValorantCompGenerator)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://pedrofabrino.github.io/ValorantCompGenerator/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-58%20passing-brightgreen)](https://github.com/PedroFabrino/ValorantCompGenerator/actions)

A Vue.js application that generates random team compositions for Valorant matches.

## Features

- Input 5 player names
- Select which role should be doubled (Duelist, Controller, Initiator, Sentinel, or Random)
- Role history tracking to reduce repetitive role assignments
- Three agent selection modes:
  - No agents assigned
  - Random agent assignment
  - Lock specific agents before generation
- Generate a balanced team composition with one doubled role
- View role distribution summary
- Clean, responsive UI with Valorant-themed styling

## 📊 Project Status

| Metric | Status |
|--------|--------|
| **Build Status** | [![Test and Deploy](https://github.com/PedroFabrino/ValorantCompGenerator/actions/workflows/deploy.yml/badge.svg)](https://github.com/PedroFabrino/ValorantCompGenerator/actions/workflows/deploy.yml) |
| **Test Coverage** | [![codecov](https://codecov.io/gh/PedroFabrino/ValorantCompGenerator/branch/main/graph/badge.svg)](https://codecov.io/gh/PedroFabrino/ValorantCompGenerator) |
| **Live Demo** | [![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://pedrofabrino.github.io/ValorantCompGenerator/) |
| **Tests Passing** | ![Tests](https://img.shields.io/badge/Tests-58%20passing-brightgreen) |
| **Code Quality** | ![Coverage](https://img.shields.io/badge/Coverage-95.84%25-brightgreen) |

## CI/CD Pipeline

This project uses GitHub Actions for automated testing and deployment:

### Automated Workflow
- **On Push to Any Branch**: Runs comprehensive test suite
- **On Push to Main**: Runs tests → Builds → Deploys to GitHub Pages
- **On Pull Request**: Runs tests to ensure code quality before merging
- **Test Coverage**: Automatically generates and uploads coverage reports
- **Deployment**: Only deploys from main branch if all tests pass

### Workflow Status
Check the [Actions tab](../../actions) to see the status of builds and deployments.

## Testing

The project includes comprehensive unit and integration tests:

### Run Tests
```bash
# Run all tests
npm run test

# Run tests with coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

### Test Coverage
Current test coverage: **95.84%** overall
- **58 tests** covering all core functionality
- Unit tests for randomization algorithms
- Integration tests for Vue components
- Data validation tests for agent roster

### Test Structure
- `src/test/gameLogic.test.js` - Core randomization and assignment logic
- `src/test/agents.test.js` - Agent data and role validation
- `src/test/App.test.js` - Full component integration tests

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

4. **Automatic Deployment:**
   After pushing to the main branch, GitHub Actions will automatically:
   - Run all tests to ensure code quality
   - Build the application for production
   - Deploy to GitHub Pages (if tests pass)
   
   **Manual Deployment (Optional):**
   You can also deploy manually using:
   ```bash
   npm run deploy
   ```
   
   **Note**: Both automated and manual deployment will fail if any tests fail, ensuring only tested code reaches production.

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
