# CDC File Renamer

A desktop application for renaming CDC (Change Data Capture) files by replacing timestamps in filenames.

## Features

- Select source and target directories via native file dialogs
- Preview filename changes before applying
- Pattern-based CDC timestamp detection and replacement using regex
- Dark/light theme with persistent preferences
- Responsive design with smooth animations

## Technology Stack

- **Framework**: Electron with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom styling
- **Building**: Webpack
- **Packaging**: Electron Builder & Forge

## Development Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v7 or later)
- Git

### Installation

1. Clone the repository:

    git clone https://github.com/your-org/cdc-file-renamer.git
    cd cdc-file-renamer

2. Install dependencies:

    npm install

3. Start the development server:

    npm start

### Development Scripts

- `npm start` - Start the application in development mode
- `npm run dev` - Start the application with hot reloading
- `npm run build` - Build the application for production
- `npm run package` - Package the application (without installers)
- `npm run make` - Create installers for the application
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

    cdc-file-renamer/
    ├── assets/                  # Application assets
    │   ├── icons/               # Application icons
    │   └── ...
    ├── dist/                    # Build output
    ├── src/                     # Source code
    │   ├── components/          # React components
    │   ├── contexts/            # React contexts
    │   ├── services/            # Service classes
    │   ├── types/               # TypeScript type definitions
    │   ├── utils/               # Utility functions
    │   ├── app.tsx              # Main React component
    │   ├── index.tsx            # React entry point
    │   ├── main.ts              # Electron main process
    │   └── preload.ts           # Electron preload script
    ├── styles/                  # CSS styles
    └── ...

## PowerShell Integration

The application uses PowerShell scripts to interact with the file system. These scripts are executed from the main Electron process using Node's child_process module.

For security reasons, PowerShell scripts are sanitized before execution to prevent command injection and other security issues. See `src/utils/ScriptSanitizer.ts` for implementation details.

## Building for Production

To build the application for production:

1. Ensure all dependencies are installed:

    npm install

2. Build the application:

    npm run build

3. Package the application:

    npm run package

4. Create installers:

    npm run make

Built packages will be available in the `release` directory.

## Security Considerations

- PowerShell scripts are sanitized before execution
- Content Security Policy is implemented
- No remote code execution is permitted
- File system operations are limited to user-selected directories

## Error Handling and Logging

The application includes comprehensive error handling and logging:

- React ErrorBoundary component catches and handles React errors
- LoggerService provides consistent logging throughout the application
- Global error handlers catch uncaught exceptions and promise rejections

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- KG|iQ for providing the branding and requirements
- Electron team for the excellent framework
- React team for the front-end library