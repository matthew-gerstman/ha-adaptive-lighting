# Home Assistant Adaptive Lighting

TypeScript-based adaptive lighting automation for Home Assistant using Digital Alchemy.

## Features

- 🌅 HomeKit-style circadian rhythm color temperature
- 🎨 Smooth transitions throughout the day
- 🛡️ Manual override detection and respect
- 🌙 Sleep mode support
- 🏠 Per-room/per-light configuration
- 📝 Type-safe entity management

## Setup

1. Clone this repository
2. Install dependencies: `yarn install`
3. Copy `.env.example` to `.env`
4. Add your Home Assistant URL and Long-Lived Access Token
5. Run `npx type-writer` to generate types from your HA setup
6. Start dev server: `yarn dev`

## Configuration

Edit `src/services/adaptive-lighting.ts` to customize:
- Color temperature curves
- Transition speeds
- Sleep mode settings
- Which lights to control

## Architecture

Built with [Digital Alchemy](https://docs.digital-alchemy.app) framework:
- Type-safe Home Assistant integration
- Modular service architecture
- Live reload during development
- Testable automation logic

## License

MIT
