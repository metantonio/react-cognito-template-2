# Getting Started

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [README.md](/README.md)
- [package-lock.json](/package-lock.json)
- [package.json](/package.json)
- [src/.env.example](/src/.env.example)

</details>



This document provides step-by-step instructions for setting up the CasinoVizion administrative panel development environment. It covers installation of dependencies, environment configuration, and initial project setup to get the application running locally.

For information about the authentication system implementation, see [Authentication System](./5_Authentication_System.md). For details about the application architecture and routing, see [Application Architecture](./11_Application_Architecture.md).

## Prerequisites

Before setting up the project, ensure your development environment meets these requirements:

| Requirement | Version | Installation Method |
|-------------|---------|-------------------|
| Node.js | >= 18.19.0 | [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating) |
| npm | Latest | Included with Node.js |
| Git | Latest | Platform-specific installer |

**Development Environment Setup Flow**

```mermaid
graph TD
    START["Start Setup"] --> CHECK_NODE["Check Node.js Version"]
    CHECK_NODE --> CLONE["git clone <YOUR_GIT_URL>"]
    CLONE --> NAVIGATE["cd <YOUR_PROJECT_NAME>"]
    NAVIGATE --> INSTALL_DEPS["npm i"]
    INSTALL_DEPS --> ADD_AMPLIFY["npm add --save-dev @aws-amplify/backend@latest"]
    ADD_AMPLIFY --> ADD_CLI["npm add --save-dev @aws-amplify/backend-cli@latest"]
    ADD_CLI --> ADD_TYPESCRIPT["npm add --save-dev typescript"]
    ADD_TYPESCRIPT --> ADD_CROSSENV["npm install --save-dev cross-env"]
    ADD_CROSSENV --> ADD_PRIME["npm install primereact primeicons"]
    ADD_PRIME --> COPY_ENV["cp ./src/.env.example ./src/.env"]
    COPY_ENV --> CONFIG_ENV["Configure Environment Variables"]
    CONFIG_ENV --> RUN_DEV["npm run dev"]
    RUN_DEV --> SUCCESS["Development Server Running"]
```

Sources: [README.md:12-38](), [package.json:6-12]()

## Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

The project requires several dependency installations in a specific order:

```bash
# Core dependencies
npm i

# AWS Amplify backend tools
npm add --save-dev @aws-amplify/backend@latest @aws-amplify/backend-cli@latest typescript

# Cross-platform environment support
npm install --save-dev cross-env

# PrimeReact UI components
npm install primereact
npm i primeicons
```

**Key Dependencies Overview**

```mermaid
graph TB
    subgraph "Core Framework"
        REACT["react@18.3.1"]
        VITE["vite@5.4.1"]
        TYPESCRIPT["typescript@5.8.3"]
    end
    
    subgraph "Authentication & Backend"
        AMPLIFY["aws-amplify@6.15.3"]
        BACKEND["@aws-amplify/backend@1.16.1"]
        CLI["@aws-amplify/backend-cli@1.8.0"]
    end
    
    subgraph "UI Libraries"
        SHADCN["shadcn-ui components"]
        RADIX["@radix-ui/* components"]
        PRIME["primereact@10.9.6"]
        TAILWIND["tailwindcss@3.4.11"]
    end
    
    subgraph "Routing & Forms"
        ROUTER["react-router-dom@6.26.2"]
        HOOKFORM["react-hook-form@7.53.0"]
        ZOD["zod@3.23.8"]
    end
    
    REACT --> VITE
    AMPLIFY --> BACKEND
    BACKEND --> CLI
    SHADCN --> RADIX
    HOOKFORM --> ZOD
```

Sources: [package.json:14-69](), [README.md:23-28]()

### 3. Environment Configuration

Copy the environment template and configure AWS Cognito settings:

```bash
cp ./src/.env.example ./src/.env
```

Edit the created `.env` file with your AWS Cognito configuration:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API base URL | `http://localhost:5000/api/` |
| `VITE_APP_COGNITO_USER_POOL_ID` | AWS Cognito User Pool ID | `us-east-1_*******` |
| `VITE_APP_COGNITO_CLIENT_ID` | AWS Cognito App Client ID | `*********` |
| `VITE_APP_COGNITO_DOMAIN` | Cognito Hosted UI domain | `us-****-*********.auth.********.amazoncognito.com/` |

Sources: [src/.env.example:1-5](), [README.md:30-33]()

## Project Structure Overview

The application follows a standard React + Vite project structure with specific organization for authentication, components, and pages:

**Core Project Files and Structure**

```mermaid
graph TB
    subgraph "Configuration Files"
        PACKAGE["package.json - Dependencies & Scripts"]
        VITE_CONFIG["vite.config.ts - Build Configuration"]
        TAILWIND["tailwind.config.js - Styling"]
        ENV[".env - Environment Variables"]
    end
    
    subgraph "Source Directory (/src)"
        APP["App.tsx - Main Router & Config"]
        MAIN["main.tsx - Application Entry Point"]
        INDEX["index.css - Global Styles"]
    end
    
    subgraph "Key Directories"
        COMPONENTS["/components - Reusable UI Components"]
        PAGES["/pages - Application Pages"]
        CONTEXTS["/contexts - State Management"]
        SERVICES["/services - API & Auth Services"]
        TYPES["/types - TypeScript Definitions"]
    end
    
    subgraph "Build Output"
        DIST["/dist - Production Build"]
        NODE["/node_modules - Dependencies"]
    end
    
    PACKAGE --> VITE_CONFIG
    ENV --> APP
    APP --> COMPONENTS
    APP --> PAGES
    COMPONENTS --> CONTEXTS
    PAGES --> SERVICES
```

Sources: [package.json:1-92](), [README.md:54-63]()

## Running the Application

### Development Server

Start the development server with hot reloading:

```bash
npm run dev
# or
npm start
```

Both commands execute `vite` and start the development server with auto-reloading.

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start development server |
| `start` | `vite` | Alias for dev command |
| `build` | `vite build` | Production build |
| `build:dev` | `vite build --mode development` | Development build |
| `lint` | `eslint .` | Code linting |
| `preview` | `vite preview` | Preview production build |

**Development Workflow**

```mermaid
graph LR
    DEV_START["npm run dev"] --> VITE["vite server starts"]
    VITE --> PORT["http://localhost:5173"]
    PORT --> HOT_RELOAD["Hot Module Replacement"]
    
    BUILD["npm run build"] --> DIST["dist/ directory"]
    DIST --> PREVIEW["npm run preview"]
    
    LINT["npm run lint"] --> ESLINT["ESLint checks"]
    
    style DEV_START fill:#e1f5fe
    style BUILD fill:#f3e5f5
    style LINT fill:#fff3e0
```

Sources: [package.json:6-12](), [README.md:37]()

## Technology Stack

The project uses a modern React development stack:

**Core Technologies**
- **React 18.3.1**: UI framework with hooks and context
- **TypeScript 5.8.3**: Type-safe JavaScript development  
- **Vite 5.4.1**: Fast build tool and development server
- **Tailwind CSS 3.4.11**: Utility-first CSS framework

**Authentication & Backend**
- **AWS Amplify 6.15.3**: Authentication and backend services
- **AWS Cognito**: User management and OAuth integration

**UI Component Libraries**
- **shadcn-ui**: Accessible component primitives built on Radix UI
- **Radix UI**: Low-level accessible components
- **PrimeReact 10.9.6**: Additional UI components and utilities
- **Lucide React**: Icon library

**Routing & State Management**
- **React Router DOM 6.26.2**: Client-side routing
- **React Context**: Global state management
- **React Hook Form 7.53.0**: Form handling and validation
- **Zod 3.23.8**: Schema validation

Sources: [package.json:14-69](), [README.md:56-62]()

## Next Steps

After successful setup, explore these areas:

1. **Authentication Configuration**: Set up AWS Cognito user pools and configure OAuth providers - see [Environment Configuration](#2.1)
2. **Understanding Dependencies**: Learn about the UI component libraries and their usage - see [Dependencies and Tech Stack](#2.2)  
3. **Application Architecture**: Explore the routing system and component organization - see [Application Architecture](#4)
4. **Authentication System**: Understand login flows and user management - see [Authentication System](#3)

The development server should now be running at `http://localhost:5173` with the CasinoVizion administrative panel ready for development.

Sources: [README.md:1-72](/README.md), [package.json:1-92](/package.json)