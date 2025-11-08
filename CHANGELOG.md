# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-11-08

### Added
- Complete CLI foundation with commander.js
- HomeAssistant REST API client library
- Output formatting utilities (tables, JSON, spinners)
- Info command (connection, areas, domains)
- Entities command (list, get, call services)
- Lights command (full control with batch operations)
- Config command (show, reload, validate)
- Automation command (list, enable/disable, trigger)
- Adaptive lighting command (status, config, simulate)
- Comprehensive README with agent usage guide
- Input validation and error handling
- Support for color temperature in Kelvin
- RGB color support
- Transition support for smooth changes
- Dry-run mode for batch operations
- JSON output for all commands

### Features
- 🏠 Complete HomeAssistant control
- 🤖 Agent-friendly design
- 📊 Rich output formatting
- 🎨 Adaptive lighting simulation
- ⚡ Batch operations with safety
- 🔒 Input validation
- 📝 Comprehensive documentation

### Commands
- `ha info` - Instance information
- `ha entities` - Entity management
- `ha lights` - Light control
- `ha config` - Configuration management
- `ha automation` - Automation control
- `ha adaptive` - Adaptive lighting

### Safety Features
- Dry-run mode for batch operations
- Input validation for all parameters
- Clear error messages
- Connection testing

### Documentation
- Complete README with examples
- Agent usage guide
- Troubleshooting section
- API reference

## [1.1.0] - 2024-11-08

### Added - Enhancements
- Scene management commands (list, activate, create)
- State monitoring and watch mode for real-time changes
- Script execution support (list, run, stop)
- Advanced query capabilities (find, count, stats)
- Complex filtering by attributes
- Statistics dashboard command
- Pattern matching for entity discovery

### Features
- 🎬 Scene creation from current state
- 👁️ Real-time entity monitoring
- 📜 Script execution with variables
- 🔍 Advanced entity queries
- 📊 Comprehensive statistics

### New Commands
- `ha scenes` - Scene management
- `ha scripts` - Script execution
- `ha watch` - Real-time monitoring
- `ha query` - Advanced queries and stats

### Improvements
- Better filtering across all commands
- Enhanced agent usage patterns
- More examples and documentation
- Comprehensive statistics view
