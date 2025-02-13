# Blackjack Trainer

A modern, interactive Blackjack training application built with Next.js, TypeScript, and TailwindCSS. Learn perfect basic strategy and card counting through engaging gameplay and real-time feedback.

## Features

### Current Features
- Interactive Blackjack gameplay
- Realistic chip betting system
- Beautiful card animations
- Multiple game actions (Hit, Stand, Double)
- Running count tracking
- True count calculation
- Proper game flow management

### Coming Soon
- Basic strategy training
- Card counting practice
- Split functionality
- Insurance options
- Performance tracking
- Achievement system

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context
- **Development**: 
  - ESLint
  - Prettier
  - Jest (coming soon)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blackjack.git
```

2. Install dependencies:
```bash
cd blackjack
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
blackjack/
├── app/
│   ├── components/
│   │   ├── game/
│   │   │   ├── Card.tsx
│   │   │   ├── Hand.tsx
│   │   │   ├── DealerHand.tsx
│   │   │   ├── PlayerHand.tsx
│   │   │   ├── GameBoard.tsx
│   │   │   └── GameControls.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── context/
│   │   │   └── GameContext.tsx
│   │   ├── types/
│   │   │   └── game.ts
│   │   └── utils/
│   │       └── gameUtils.ts
│   ├── layout.tsx
│   └── page.tsx
├── public/
└── styles/
    └── globals.css
```

## Development Status

### Completed
- Project setup and infrastructure
- Core game components
- State management system
- Basic gameplay mechanics

### In Progress
- Core game flow implementation
- Dealer play logic
- Win/loss determination
- Payout system

### Upcoming
- Basic strategy engine
- Card counting features
- Game animations
- Settings system

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Card designs inspired by classic casino decks
- Betting system based on standard casino rules
- Basic strategy rules from proven mathematical models

## Contact

For questions or feedback, please open an issue or contact the maintainers.
