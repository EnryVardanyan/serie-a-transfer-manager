# Serie A Transfer Manager

A React football manager game focused on Serie A career mode, squad building, transfers, and season simulation.

## Overview

Serie A Transfer Manager lets you choose a Serie A club, build a squad, sign players from the transfer market, and play through a multi-season career.

The project is built as a browser game with React and Vite. It uses local game data for clubs, players, transfer values, ratings, fixtures, form, fatigue, injuries, suspensions, and league standings.

## Features

- Choose a playable Serie A club
- Build and manage a Starting XI
- Sign players from a rotating transfer market
- Track club budget, matchday income, and result rewards
- Play a full 38-match league season
- Continue a career across 3 seasons
- Earn prize money based on final league position
- Simulate matches using team rating, form, fatigue, home advantage, and squad availability
- Handle injuries and suspensions for user and opponent squads
- View league table, top scorers, assists, and WhoScored-style ratings
- Use emergency position cover when a natural player is unavailable

## Tech Stack

- React
- Vite
- JavaScript
- CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/        UI panels for club, squad, market, season, and standings
  data/              Serie A clubs, players, opponents, and game config
  App.jsx            Main career state and match simulation logic
  App.css            Main game styling
```

## Current Scope

The game currently runs fully in the browser. Career progress is session-based and not yet saved permanently after refresh.

Planned improvements:

- Save career progress with localStorage
- Add player growth and decline between seasons
- Add a finance screen
- Add transfer history
- Add cup competitions
- Add end-of-season awards

