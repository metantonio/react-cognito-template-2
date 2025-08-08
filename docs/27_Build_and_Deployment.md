# Build and Deployment

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [README.md](README.md)
- [package.json](package.json)
- [tailwind.config.ts](tailwind.config.ts)

</details>



This document covers the build configuration, development setup, and deployment procedures for the CasinoVizion administrative panel. It provides technical details on the Vite-based build system, environment configuration, dependency management, and deployment options available through the Lovable platform.

For information about code architecture patterns and development practices, see [Code Architecture Patterns](#8.1). For environment variable configuration specifics, see [Environment Configuration](#2.1).

## Development Environment Setup

The CasinoVizion application uses a modern JavaScript development stack built around Vite, React, and TypeScript. The development environment requires Node.js and npm for package management and build tooling.

### Prerequisites and Installation

The project requires Node.js with npm package manager. The recommended installation method uses nvm (Node Version Manager) for version consistency across development environments.

```mermaid
graph TB
    subgraph "Development Prerequisites"
        NODEJS["Node.js Runtime"]
        NPM["npm Package Manager"]
        NVM["nvm (Recommended)"]
    end
    
    subgraph "Repository Setup"
        CLONE["git clone <YOUR_GIT_URL>"]
        NAVIGATE["cd <YOUR_PROJECT_NAME>"]
        INSTALL["npm i"]
    end
    
    subgraph "Additional Dependencies"
        AMPLIFY["@aws-amplify/backend@latest"]
        AMPLIFYCLI["@aws-amplify/backend-cli@latest"]
        TYPESCRIPT["typescript"]
        CROSSENV["cross-env"]
        PRIMEREACT["primereact"]
        PRIMEICONS["primeicons"]
    end
    
    subgraph "Environment Configuration"
        ENVEXAMPLE[".env.example"]
        ENVFILE[".env"]
        ENVCOPY["cp ./src/.env.example ./src/.env"]
    end
    
    NODEJS --> NPM
    NVM --> NODEJS
    CLONE --> NAVIGATE
    NAVIGATE --> INSTALL
    INSTALL --> AMPLIFY
    INSTALL --> AMPLIFYCLI
    INSTALL --> TYPESCRIPT
    INSTALL --> CROSSENV
    INSTALL --> PRIMEREACT
    INSTALL --> PRIMEICONS
    ENVEXAMPLE --> ENVCOPY
    ENVCOPY --> ENVFILE
```

Sources: [README.md:12-38](), [package.json:70-91]()

### Package Scripts and Development Workflow

The project defines several npm scripts for different development and build scenarios through the `package.json` configuration.

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `vite` | Alias for development server |
| `dev` | `vite` | Start development server with hot reload |
| `build` | `vite build` | Production build |
| `build:dev` | `vite build --mode development` | Development mode build |
| `lint` | `eslint .` | Code linting with ESLint |
| `preview` | `vite preview` | Preview production build locally |

Sources: [package.json:6-12]()

## Build Configuration

### Vite Build System

The application uses Vite as the primary build tool, configured for React with TypeScript support. Vite provides fast development server startup and optimized production builds through ES modules and esbuild.

```mermaid
graph LR
    subgraph "Build Tools"
        VITE["vite"]
        VITEREACT["@vitejs/plugin-react-swc"]
        TYPESCRIPT["typescript"]
        ESLINT["eslint"]
    end
    
    subgraph "Source Processing"
        TSSRC["TypeScript Source"]
        REACTJSX["React JSX/TSX"]
        CSSFILES["CSS/Tailwind Files"]
        ASSETS["Static Assets"]
    end
    
    subgraph "Build Outputs"
        JSBUNDLE["JavaScript Bundle"]
        CSSBUNDLE["CSS Bundle"]
        HTMLENTRY["HTML Entry Point"]
        STATICASSETS["Processed Assets"]
    end
    
    VITE --> VITEREACT
    VITEREACT --> TSSRC
    VITEREACT --> REACTJSX
    VITE --> CSSFILES
    VITE --> ASSETS
    
    TSSRC --> JSBUNDLE
    REACTJSX --> JSBUNDLE
    CSSFILES --> CSSBUNDLE
    ASSETS --> STATICASSETS
    
    JSBUNDLE --> HTMLENTRY
    CSSBUNDLE --> HTMLENTRY
```

Sources: [package.json:78](), [package.json:88-90]()

### TypeScript Configuration

The project includes TypeScript support with strict type checking enabled. TypeScript compilation is handled by Vite during both development and production builds.

### CSS and Styling Build Process

The styling system combines Tailwind CSS with custom theme configuration and CSS-in-JS components from the UI library ecosystem.

```mermaid
graph TB
    subgraph "CSS Build Pipeline"
        TAILWINDCSS["tailwindcss"]
        TAILWINDCONFIG["tailwind.config.ts"]
        POSTCSS["postcss"]
        AUTOPREFIXER["autoprefixer"]
    end
    
    subgraph "Style Sources"
        TAILWINDUTILITIES["Tailwind Utility Classes"]
        CUSTOMTHEME["Custom Theme Variables"]
        COMPONENTSTYLES["Component-specific Styles"]
        BRANDCOLORS["CasinoVizion Brand Colors"]
    end
    
    subgraph "Theme Configuration"
        NAVYCOLORS["navy Color Palette"]
        MAROONCOLORS["maroon Color Palette"]
        CASINOCOLORS["casino.green, casino.gold"]
        SIDEBARCOLORS["sidebar Theme Variables"]
    end
    
    TAILWINDCONFIG --> TAILWINDCSS
    TAILWINDCSS --> POSTCSS
    POSTCSS --> AUTOPREFIXER
    
    CUSTOMTHEME --> NAVYCOLORS
    CUSTOMTHEME --> MAROONCOLORS
    CUSTOMTHEME --> CASINOCOLORS
    CUSTOMTHEME --> SIDEBARCOLORS
    
    TAILWINDUTILITIES --> TAILWINDCSS
    CUSTOMTHEME --> TAILWINDCSS
    COMPONENTSTYLES --> TAILWINDCSS
    BRANDCOLORS --> TAILWINDCSS
```

Sources: [tailwind.config.ts:1-128](), [package.json:74](), [package.json:79](), [package.json:86-87]()

## Dependency Management

### Production Dependencies

The application relies on several key dependency categories for functionality:

| Category | Key Dependencies | Purpose |
|----------|------------------|---------|
| **React Ecosystem** | `react`, `react-dom`, `react-router-dom` | Core framework and routing |
| **UI Components** | `@radix-ui/*`, `primereact`, `lucide-react` | Component libraries and icons |
| **AWS Integration** | `aws-amplify` | Authentication and cloud services |
| **Form Management** | `react-hook-form`, `@hookform/resolvers`, `zod` | Form handling and validation |
| **Styling** | `tailwind-merge`, `class-variance-authority`, `clsx` | CSS utility management |
| **Data Fetching** | `@tanstack/react-query` | Server state management |

Sources: [package.json:14-68]()

### Development Dependencies

Development-time dependencies focus on build tooling, type checking, and code quality:

| Category | Dependencies | Purpose |
|----------|--------------|---------|
| **Build Tools** | `vite`, `@vitejs/plugin-react-swc` | Build system and React plugin |
| **TypeScript** | `typescript`, `@types/*` | Type checking and definitions |
| **AWS Amplify** | `@aws-amplify/backend`, `@aws-amplify/backend-cli` | Backend development tools |
| **Code Quality** | `eslint`, `eslint-plugin-*` | Linting and code standards |
| **Styling Tools** | `tailwindcss`, `postcss`, `autoprefixer` | CSS processing |

Sources: [package.json:70-91]()

## Environment Configuration

### Environment Variables Setup

The application requires environment-specific configuration through `.env` files located in the `src` directory. The setup process involves copying the example configuration and updating values for the target environment.

```mermaid
graph LR
    subgraph "Environment Setup Process"
        ENVEXAMPLE[".env.example"]
        COPYCOMMAND["cp ./src/.env.example ./src/.env"]
        ENVFILE[".env"]
        ENVVARS["Environment Variables"]
    end
    
    subgraph "Configuration Categories"
        COGNITOVARS["VITE_APP_COGNITO_*"]
        APICONFIG["VITE_API_BASE"]
        APPCONFIG["Application Settings"]
        AWSCONFIG["AWS Service Configuration"]
    end
    
    ENVEXAMPLE --> COPYCOMMAND
    COPYCOMMAND --> ENVFILE
    ENVFILE --> ENVVARS
    
    ENVVARS --> COGNITOVARS
    ENVVARS --> APICONFIG
    ENVVARS --> APPCONFIG
    ENVVARS --> AWSCONFIG
```

Sources: [README.md:30-33]()

### Build Mode Configuration

The build system supports multiple build modes through Vite's mode configuration:

- **Development Mode**: `npm run build:dev` - Builds with development optimizations
- **Production Mode**: `npm run build` - Optimized production build with minification

Sources: [package.json:9-10]()

## Build Process

### Development Build Process

The development build process emphasizes fast rebuild times and comprehensive debugging capabilities:

1. **Source Processing**: TypeScript compilation with source maps
2. **Hot Module Replacement**: Live code updates without page refresh
3. **Development Server**: Local server with proxy capabilities for API calls
4. **Asset Processing**: Unminified assets for debugging

### Production Build Process

The production build process optimizes for performance and deployment:

1. **Code Minification**: JavaScript and CSS minification
2. **Tree Shaking**: Unused code elimination
3. **Asset Optimization**: Image and asset compression
4. **Bundle Splitting**: Code splitting for optimal loading

```mermaid
graph TB
    subgraph "Build Process Flow"
        SOURCEFILES["Source Files (src/)"]
        VITECONFIG["Vite Configuration"]
        BUILDCOMMAND["npm run build"]
        DISTOUTPUT["dist/ Output Directory"]
    end
    
    subgraph "Processing Steps"
        TSCOMPILE["TypeScript Compilation"]
        JSXTRANSFORM["JSX Transformation"]
        CSSPROCESS["CSS Processing"]
        ASSETPROCESS["Asset Processing"]
        BUNDLEOPT["Bundle Optimization"]
    end
    
    subgraph "Output Artifacts"
        INDEXHTML["index.html"]
        JSCHUNKS["JavaScript Chunks"]
        CSSSTYLES["CSS Stylesheets"]
        STATICASSETS["Static Assets"]
    end
    
    SOURCEFILES --> BUILDCOMMAND
    VITECONFIG --> BUILDCOMMAND
    BUILDCOMMAND --> TSCOMPILE
    BUILDCOMMAND --> JSXTRANSFORM
    BUILDCOMMAND --> CSSPROCESS
    BUILDCOMMAND --> ASSETPROCESS
    BUILDCOMMAND --> BUNDLEOPT
    
    TSCOMPILE --> JSCHUNKS
    JSXTRANSFORM --> JSCHUNKS
    CSSPROCESS --> CSSSTYLES
    ASSETPROCESS --> STATICASSETS
    BUNDLEOPT --> INDEXHTML
    
    JSCHUNKS --> DISTOUTPUT
    CSSSTYLES --> DISTOUTPUT
    STATICASSETS --> DISTOUTPUT
    INDEXHTML --> DISTOUTPUT
```

Sources: [package.json:9](), [README.md:37]()

## Deployment Options

### Lovable Platform Deployment

The primary deployment method uses the Lovable platform, which provides integrated hosting with custom domain support:

1. **Automatic Deployment**: Git push triggers automatic builds and deployments
2. **Custom Domain**: Connect custom domains through Project > Settings > Domains
3. **Environment Management**: Platform-managed environment variable configuration

### Manual Deployment Process

For alternative deployment targets, the standard process involves:

1. **Build Generation**: `npm run build` creates production-ready artifacts in `dist/`
2. **Static File Hosting**: Deploy contents of `dist/` directory to static hosting service
3. **Environment Configuration**: Configure environment variables on target platform
4. **Domain Configuration**: Set up DNS and SSL certificates as needed

```mermaid
graph LR
    subgraph "Deployment Targets"
        LOVABLE["Lovable Platform"]
        STATICHOST["Static Hosting Services"]
        CDNHOST["CDN Providers"]
        SELFHOST["Self-hosted Infrastructure"]
    end
    
    subgraph "Deployment Process"
        BUILDCMD["npm run build"]
        DISTFILES["dist/ Output"]
        UPLOAD["File Upload/Sync"]
        CONFIGURE["Environment Setup"]
        DOMAIN["Domain Configuration"]
    end
    
    BUILDCMD --> DISTFILES
    DISTFILES --> UPLOAD
    UPLOAD --> CONFIGURE
    CONFIGURE --> DOMAIN
    
    UPLOAD --> LOVABLE
    UPLOAD --> STATICHOST
    UPLOAD --> CDNHOST
    UPLOAD --> SELFHOST
```

Sources: [README.md:64-70]()

### Environment-Specific Deployments

Different deployment environments require appropriate build configurations:

- **Development**: Use `npm run build:dev` for debugging-friendly builds
- **Staging**: Production build with staging environment variables
- **Production**: Optimized production build with production environment variables

Sources: [package.json:10]()