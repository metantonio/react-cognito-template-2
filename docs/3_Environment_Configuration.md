# Environment Configuration

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/.env.example](/src/.env.example)
- [src/App.tsx](/src/App.tsx)

</details>



This document covers the environment variable setup and configuration required to run the CasinoVizion administrative panel. It explains how to configure AWS Cognito authentication, API endpoints, and other environment-specific settings.

For information about the overall authentication system architecture, see [Authentication System](./3_Environment_Configuration.md). For details about the build and deployment process, see [Build and Deployment](./27_Build_and_Deployment.md).

## Purpose and Scope

The CasinoVizion application requires specific environment variables to connect to AWS Cognito for authentication and external APIs for casino data management. This configuration enables the application to operate in different environments (development, staging, production) with appropriate service endpoints and credentials.

## Environment Variables Overview

The application uses Vite's environment variable system, which requires variables to be prefixed with `VITE_` to be accessible in the client-side code. All configuration is managed through environment variables for security and flexibility across deployment environments.

### Required Environment Variables

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_API_BASE` | Backend API base URL | `http://localhost:5000/api/` |
| `VITE_APP_COGNITO_USER_POOL_ID` | AWS Cognito User Pool identifier | `us-east-1_*******` |
| `VITE_APP_COGNITO_CLIENT_ID` | AWS Cognito App Client ID | `*********` |
| `VITE_APP_COGNITO_DOMAIN` | AWS Cognito hosted UI domain | `us-****-*********.auth.********.amazoncognito.com/` |

Sources: [src/.env.example:1-4]()

## AWS Cognito Configuration Flow

```mermaid
graph TD
    ENV_FILE[".env file"] --> ENV_VARS["Environment Variables<br/>VITE_APP_COGNITO_*"]
    ENV_VARS --> APP_IMPORT["App.tsx imports<br/>import.meta.env"]
    APP_IMPORT --> AMPLIFY_CONFIG["amplifyConfig object<br/>ResourcesConfig"]
    AMPLIFY_CONFIG --> AMPLIFY_CONFIGURE["Amplify.configure()"]
    AMPLIFY_CONFIGURE --> AUTH_SYSTEM["Authentication System"]
    
    subgraph "Cognito Configuration"
        USER_POOL_ID["userPoolId"]
        CLIENT_ID["userPoolClientId"] 
        OAUTH_DOMAIN["oauth.domain"]
        OAUTH_SCOPES["oauth.scopes"]
        REDIRECT_SIGNIN["redirectSignIn"]
        REDIRECT_SIGNOUT["redirectSignOut"]
    end
    
    AMPLIFY_CONFIG --> USER_POOL_ID
    AMPLIFY_CONFIG --> CLIENT_ID
    AMPLIFY_CONFIG --> OAUTH_DOMAIN
    AMPLIFY_CONFIG --> OAUTH_SCOPES
    AMPLIFY_CONFIG --> REDIRECT_SIGNIN
    AMPLIFY_CONFIG --> REDIRECT_SIGNOUT
```

Sources: [src/App.tsx:31-58]()

## Environment Variable Usage in Code

The application imports environment variables using Vite's `import.meta.env` interface and transforms them into AWS Amplify configuration:

```typescript
// Environment variable imports
const REACT_APP_COGNITO_USER_POOL_ID = import.meta.env.VITE_APP_COGNITO_USER_POOL_ID;
const REACT_APP_COGNITO_CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
const REACT_APP_COGNITO_DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN;
```

These variables are then used to construct the `amplifyConfig` object that configures AWS Amplify authentication services.

Sources: [src/App.tsx:31-33]()

## AWS Amplify Configuration Structure

```mermaid
graph LR
    subgraph "Environment Variables"
        POOL_ID["VITE_APP_COGNITO_USER_POOL_ID"]
        CLIENT_ID["VITE_APP_COGNITO_CLIENT_ID"]
        DOMAIN["VITE_APP_COGNITO_DOMAIN"]
    end
    
    subgraph "amplifyConfig.Auth.Cognito"
        CONFIG_POOL["userPoolId"]
        CONFIG_CLIENT["userPoolClientId"]
        CONFIG_OAUTH["loginWith.oauth"]
    end
    
    subgraph "OAuth Configuration"
        OAUTH_DOMAIN["domain"]
        OAUTH_SCOPES["scopes: ['email', 'profile', 'openid']"]
        REDIRECT_IN["redirectSignIn"]
        REDIRECT_OUT["redirectSignOut"]
        RESPONSE_TYPE["responseType: 'code'"]
    end
    
    POOL_ID --> CONFIG_POOL
    CLIENT_ID --> CONFIG_CLIENT
    DOMAIN --> CONFIG_OAUTH
    
    CONFIG_OAUTH --> OAUTH_DOMAIN
    CONFIG_OAUTH --> OAUTH_SCOPES
    CONFIG_OAUTH --> REDIRECT_IN
    CONFIG_OAUTH --> REDIRECT_OUT
    CONFIG_OAUTH --> RESPONSE_TYPE
```

Sources: [src/App.tsx:40-56]()

## OAuth Redirect Configuration

The application configures OAuth redirect URLs dynamically based on the current environment:

- **Sign-in redirects**: `[window.location.origin + '/login', 'http://localhost:3000/adminpanel/login']`
- **Sign-out redirects**: `[window.location.origin + '/login', 'http://localhost:3000/adminpanel/login']`

This configuration supports both production deployments (using `window.location.origin`) and local development (hardcoded localhost URL).

Sources: [src/App.tsx:49-50]()

## API Base URL Configuration

The `VITE_API_BASE` environment variable configures the backend API endpoint for casino data operations. This variable is used throughout the application to make HTTP requests to the casino management backend.

```mermaid
graph TD
    API_BASE_VAR["VITE_API_BASE"] --> CASINO_API["Casino Management API"]
    CASINO_API --> CASINO_LIST["CasinoList component"]
    CASINO_API --> CASINO_DETAILS["CasinoDetails component"]
    CASINO_API --> CREATE_CASINO["CreateCasino component"]
    CASINO_API --> VIEW_CASINO["ViewCasino component"]
    
    subgraph "API Endpoints"
        GET_CASINOS["/casinos"]
        POST_CASINOS["/casinos"]
        PUT_CASINOS["/casinos/:id"]
        DELETE_CASINOS["/casinos/:id"]
    end
    
    CASINO_API --> GET_CASINOS
    CASINO_API --> POST_CASINOS
    CASINO_API --> PUT_CASINOS
    CASINO_API --> DELETE_CASINOS
```

Sources: [src/.env.example:1]()

## Local Development Setup

1. **Create environment file**: Copy `src/.env.example` to `src/.env` in the src folder
2. **Configure AWS Cognito**: Replace placeholder values with actual AWS Cognito User Pool details
3. **Set API endpoint**: Configure `VITE_API_BASE` to point to your local or remote backend API
4. **Verify configuration**: Ensure all required environment variables are set before starting the application

The application will fail to authenticate properly if any of the AWS Cognito environment variables are missing or incorrect.

Sources: [src/.env.example:1-4]()

## Environment Variable Validation

The application uses fallback empty strings for missing environment variables, but AWS Amplify will fail to initialize properly without valid values:

```typescript
userPoolId: REACT_APP_COGNITO_USER_POOL_ID || '',
userPoolClientId: REACT_APP_COGNITO_CLIENT_ID || '',
// ...
domain: REACT_APP_COGNITO_DOMAIN || '',
```

This pattern prevents runtime errors but requires proper configuration for functional authentication.

Sources: [src/App.tsx:43-47]()