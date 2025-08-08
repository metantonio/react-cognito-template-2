# Dependencies and Tech Stack

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [package-lock.json](/package-lock.json)
- [package.json](/package.json)
- [tailwind.config.ts](/tailwind.config.ts)

</details>



This document provides a comprehensive overview of the dependencies and technology stack used in the CasinoVizion administrative panel. It covers the core frameworks, libraries, and tools that power the application's functionality, from the React foundation to AWS authentication and UI components.

For information about environment configuration and AWS setup, see [Environment Configuration](./3_Environment_Configuration.md). For build and deployment procedures, see [Build and Deployment](./27_Build_and_Deployment.md).

## Core Framework & Build System

The application is built on a modern React foundation with Vite as the build tool and TypeScript for type safety.

```mermaid
graph TB
    subgraph "Build System"
        VITE["vite@5.4.1<br/>Main Build Tool"]
        VITEREACT["@vitejs/plugin-react-swc@3.5.0<br/>React SWC Plugin"]
        TS["typescript@5.8.3<br/>Type System"]
    end
    
    subgraph "Core Runtime"
        REACT["react@18.3.1<br/>UI Framework"]
        REACTDOM["react-dom@18.3.1<br/>DOM Renderer"]
        ROUTER["react-router-dom@6.26.2<br/>Client Routing"]
    end
    
    subgraph "Development Tools"
        ESLINT["eslint@9.9.0<br/>Code Linting"]
        CROSSENV["cross-env@7.0.3<br/>Environment Variables"]
        POSTCSS["postcss@8.4.47<br/>CSS Processing"]
    end
    
    VITE --> VITEREACT
    VITE --> TS
    VITEREACT --> REACT
    REACT --> REACTDOM
    REACT --> ROUTER
    VITE --> ESLINT
    VITE --> CROSSENV
    VITE --> POSTCSS
```

**Sources:** [package.json:1-92](), [package.json:6-12]()

| Technology | Version | Purpose |
|------------|---------|---------|
| `react` | 18.3.1 | Core UI framework |
| `vite` | 5.4.1 | Build tool and dev server |
| `typescript` | 5.8.3 | Static type checking |
| `react-router-dom` | 6.26.2 | Client-side routing |

## Authentication & Backend Services

AWS Amplify provides the backbone for authentication and backend services integration.

```mermaid
graph LR
    subgraph "AWS Amplify Stack"
        AMPLIFY["aws-amplify@6.15.3<br/>Main SDK"]
        BACKEND["@aws-amplify/backend@1.16.1<br/>Backend Infrastructure"]
        CLI["@aws-amplify/backend-cli@1.8.0<br/>Development CLI"]
    end
    
    subgraph "Authentication Features"
        COGNITO["AWS Cognito<br/>User Pool"]
        OAUTH["OAuth Providers<br/>Google, Facebook, Apple"]
        MFA["Multi-Factor Auth<br/>SMS, TOTP"]
    end
    
    AMPLIFY --> COGNITO
    AMPLIFY --> OAUTH
    AMPLIFY --> MFA
    BACKEND --> AMPLIFY
    CLI --> BACKEND
```

**Sources:** [package.json:46](), [package.json:71-72]()

The AWS Amplify integration enables:
- User authentication via `aws-amplify` SDK
- Backend infrastructure management through `@aws-amplify/backend`
- Development tooling via `@aws-amplify/backend-cli`

## UI Component Libraries

The application uses a layered approach to UI components, building from low-level primitives to high-level composed components.

```mermaid
graph TB
    subgraph "Foundation Layer"
        TAILWIND["tailwindcss@3.4.11<br/>Utility CSS Framework"]
        ANIMATE["tailwindcss-animate@1.0.7<br/>Animation Utilities"]
        THEMES["next-themes@0.3.0<br/>Theme Management"]
    end
    
    subgraph "Primitive Components"
        RADIX_DIALOG["@radix-ui/react-dialog@1.1.2"]
        RADIX_DROPDOWN["@radix-ui/react-dropdown-menu@2.1.1"]
        RADIX_POPOVER["@radix-ui/react-popover@1.1.1"]
        RADIX_SELECT["@radix-ui/react-select@2.1.1"]
        RADIX_TABS["@radix-ui/react-tabs@1.1.0"]
        RADIX_TOAST["@radix-ui/react-toast@1.2.1"]
    end
    
    subgraph "Enhanced Components"
        PRIMEREACT["primereact@10.9.6<br/>Rich Component Library"]
        CMDK["cmdk@1.0.0<br/>Command Palette"]
        SONNER["sonner@1.5.0<br/>Toast Notifications"]
        VAUL["vaul@0.9.3<br/>Drawer Component"]
    end
    
    subgraph "Utility Libraries"
        CVA["class-variance-authority@0.7.1<br/>Component Variants"]
        CLSX["clsx@2.1.1<br/>Conditional Classes"]
        TWMERGE["tailwind-merge@2.5.2<br/>Class Merging"]
    end
    
    TAILWIND --> RADIX_DIALOG
    TAILWIND --> RADIX_DROPDOWN
    TAILWIND --> RADIX_POPOVER
    TAILWIND --> RADIX_SELECT
    TAILWIND --> RADIX_TABS
    TAILWIND --> RADIX_TOAST
    
    RADIX_DIALOG --> PRIMEREACT
    RADIX_DROPDOWN --> CMDK
    RADIX_TOAST --> SONNER
    
    CVA --> CLSX
    CLSX --> TWMERGE
    TWMERGE --> TAILWIND
```

**Sources:** [package.json:17-43](), [package.json:47-48](), [package.json:60](), [package.json:64](), [package.json:65-67]()

### Radix UI Components

The application extensively uses Radix UI primitives for accessible, unstyled components:

| Component | Version | Usage |
|-----------|---------|-------|
| `@radix-ui/react-dialog` | 1.1.2 | Modal dialogs |
| `@radix-ui/react-dropdown-menu` | 2.1.1 | Dropdown menus |
| `@radix-ui/react-select` | 2.1.1 | Custom select inputs |
| `@radix-ui/react-tabs` | 1.1.0 | Tab navigation |
| `@radix-ui/react-toast` | 1.2.1 | Notification system |

## Styling & Design System

The styling architecture is built on Tailwind CSS with custom design tokens and utilities.

```mermaid
graph TB
    subgraph "Design Tokens"
        COLORS["Brand Colors<br/>navy, maroon, casino"]
        RADIUS["Border Radius<br/>--radius CSS Custom Properties"]
        SPACING["Spacing System<br/>Tailwind Default + Custom"]
    end
    
    subgraph "CSS Architecture"
        TAILWIND_CONFIG["tailwind.config.ts<br/>Main Configuration"]
        AUTOPREFIXER["autoprefixer@10.4.20<br/>CSS Vendor Prefixes"]
        TYPOGRAPHY["@tailwindcss/typography@0.5.15<br/>Prose Styling"]
    end
    
    subgraph "Component Styling"
        CVA_SYSTEM["class-variance-authority<br/>Variant Management"]
        SHADCN["shadcn-ui Pattern<br/>Component Library Approach"]
        ANIMATIONS["tailwindcss-animate<br/>Predefined Animations"]
    end
    
    COLORS --> TAILWIND_CONFIG
    RADIUS --> TAILWIND_CONFIG
    SPACING --> TAILWIND_CONFIG
    
    TAILWIND_CONFIG --> CVA_SYSTEM
    TAILWIND_CONFIG --> ANIMATIONS
    AUTOPREFIXER --> TAILWIND_CONFIG
    TYPOGRAPHY --> TAILWIND_CONFIG
```

**Sources:** [tailwind.config.ts:1-128](), [package.json:74](), [package.json:79](), [package.json:83]()

### Custom Color Palette

The design system includes CasinoVizion brand colors:

| Color | Default Value | Usage |
|-------|---------------|-------|
| `navy` | #13294B | Primary brand color |
| `maroon` | #7D1D28 | Secondary brand color |
| `casino.green` | #1A5935 | Casino-themed accent |
| `casino.gold` | #E0B100 | Casino-themed accent |

**Sources:** [tailwind.config.ts:66-96]()

## Form Handling & Validation

Form management is handled through React Hook Form with Zod schema validation.

```mermaid
graph LR
    subgraph "Form Management"
        RHF["react-hook-form@7.53.0<br/>Form State Management"]
        RESOLVERS["@hookform/resolvers@3.9.0<br/>Validation Integration"]
        ZOD["zod@3.23.8<br/>Schema Validation"]
    end
    
    subgraph "Input Components"
        INPUT_OTP["input-otp@1.2.4<br/>OTP Input Fields"]
        DAY_PICKER["react-day-picker@8.10.1<br/>Date Selection"]
        RADIX_INPUTS["Radix UI Form Primitives<br/>Checkbox, Radio, etc."]
    end
    
    RHF --> RESOLVERS
    RESOLVERS --> ZOD
    RHF --> INPUT_OTP
    RHF --> DAY_PICKER
    RHF --> RADIX_INPUTS
```

**Sources:** [package.json:16](), [package.json:52](), [package.json:58](), [package.json:60](), [package.json:68]()

## Data Management & State

Data fetching and state management use modern React patterns with TanStack Query.

| Library | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | 5.56.2 | Server state management |
| `react-router-dom` | 6.26.2 | Client-side routing |
| React Context | Built-in | Global user state |

**Sources:** [package.json:44](), [package.json:62]()

## External Integrations

The application integrates with external services for enhanced functionality.

```mermaid
graph TB
    subgraph "Google Services"
        GMAPS_LOADER["@googlemaps/js-api-loader@1.16.8<br/>Maps API Integration"]
        GMAPS_TYPES["@types/google.maps@3.58.1<br/>TypeScript Definitions"]
    end
    
    subgraph "Data Visualization"
        RECHARTS["recharts@2.12.7<br/>Chart Library"]
        DATE_FNS["date-fns@3.6.0<br/>Date Utilities"]
    end
    
    subgraph "Interactive Components"
        CAROUSEL["embla-carousel-react@8.3.0<br/>Carousel Component"]
        RESIZABLE["react-resizable-panels@2.1.3<br/>Resizable Layouts"]
    end
    
    GMAPS_LOADER --> GMAPS_TYPES
```

**Sources:** [package.json:15](), [package.json:45](), [package.json:50-51](), [package.json:61](), [package.json:63]()

## Development Tools & Linting

The development environment includes comprehensive tooling for code quality and development experience.

```mermaid
graph TB
    subgraph "Code Quality"
        ESLINT_CORE["eslint@9.9.0<br/>Core Linting"]
        ESLINT_JS["@eslint/js@9.9.0<br/>JavaScript Rules"]
        TS_ESLINT["typescript-eslint@8.0.1<br/>TypeScript Rules"]
        REACT_HOOKS["eslint-plugin-react-hooks@5.1.0-rc.0<br/>React Hooks Rules"]
        REACT_REFRESH["eslint-plugin-react-refresh@0.4.9<br/>Hot Reload Rules"]
    end
    
    subgraph "Development Utilities"
        LOVABLE["lovable-tagger@1.1.7<br/>Code Tagging"]
        GLOBALS["globals@15.9.0<br/>Global Definitions"]
        NODE_TYPES["@types/node@22.5.5<br/>Node.js Types"]
    end
    
    ESLINT_CORE --> ESLINT_JS
    ESLINT_CORE --> TS_ESLINT
    ESLINT_CORE --> REACT_HOOKS
    ESLINT_CORE --> REACT_REFRESH
```

**Sources:** [package.json:69](), [package.json:75-85]()

## Build Scripts & Commands

The application provides several build and development commands:

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `vite` | Start development server |
| `dev` | `vite` | Start development server (alias) |
| `build` | `vite build` | Production build |
| `build:dev` | `vite build --mode development` | Development build |
| `lint` | `eslint .` | Code linting |
| `preview` | `vite preview` | Preview production build |

**Sources:** [package.json:6-12]()