# Blackjack Training Game

A modern, interactive Blackjack training game built with Next.js, TypeScript, and TailwindCSS. Practice your Blackjack skills while learning card counting in a beautiful, casino-style interface.

## Features

- Full Blackjack gameplay with standard casino rules
- Beautiful card animations and casino-style UI
  - Smooth card dealing animations
  - 3D card flip effects
  - Realistic casino chip design
- Built-in card counting training
  - Running count display
  - True count calculation
  - Count toggle for practice mode
- Realistic betting system
  - Multiple chip denominations
  - Double down support
  - Proper blackjack payouts (3:2)
- Dealer AI
  - Standard casino rules
  - Hits on soft 17
  - Realistic card reveal animations

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blackjack.git
cd blackjack
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Rules

- Dealer must hit on soft 17
- Blackjack pays 3:2
- Double down allowed on any first two cards
- Split and surrender functionality coming soon
- Minimum bet: $5
- Maximum bet: $500

## Technologies Used

- Next.js 14
- TypeScript
- TailwindCSS
- React Context for state management

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Card designs inspired by classic casino decks
- Chip designs based on standard casino chips
- Built with modern web technologies and best practices
