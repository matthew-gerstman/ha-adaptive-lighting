# Contributing to HomeAssistant CLI

Thank you for your interest in contributing! This is a personal project, but suggestions and improvements are welcome.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/matthew-gerstman/ha-adaptive-lighting.git
cd ha-adaptive-lighting

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your HomeAssistant details

# Run in development mode
npm run dev
```

## Project Structure

```
src/
├── cli/           # CLI commands and utilities
│   ├── commands/  # Command implementations
│   └── utils/     # CLI utilities
└── lib/           # Core library
    ├── ha-api.ts  # HomeAssistant API
    ├── types.ts   # TypeScript types
    └── validators.ts # Input validation
```

## Code Style

- Use TypeScript strict mode
- Follow existing patterns
- Add validation for user inputs
- Include error handling
- Support JSON output for all commands

## Testing

Before submitting changes:

1. Test all commands work
2. Verify help text is accurate
3. Check JSON output is valid
4. Test error cases
5. Update README if needed

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Questions?

Open an issue on GitHub.
