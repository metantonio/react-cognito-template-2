# Authentication System

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
- [src/contexts/AuthService.ts](src/contexts/AuthService.ts)
- [src/pages/auth/login.tsx](src/pages/auth/login.tsx)

</details>



This document covers the comprehensive authentication system implemented in the CasinoVizion administrative panel. The system provides secure user authentication through AWS Cognito, supporting both traditional email/password login and OAuth social providers (Google, Facebook, Apple). It includes JWT token management, role-based access control, and multi-factor authentication capabilities.

For information about route protection and authorization, see [Application Architecture](./11_Application_Architecture.md). For details about user interface components used in authentication, see [User Interface Components](./14_User_Interface_Components.md).

## System Architecture

The authentication system follows a layered architecture with clear separation between presentation, business logic, and external service integration:

```mermaid
graph TB
    subgraph "Presentation_Layer" ["Presentation Layer"]
        LoginPage["Login"]
        SignupPage["Signup"]
        UpdatePasswordPage["UpdatePassword"]
        OAuthButtons["OAuth_Buttons"]
    end
    
    subgraph "State_Management" ["State Management Layer"]
        UserContext["UserContext"]
        AuthContext["AuthContext"]
    end
    
    subgraph "Service_Layer" ["Service Layer"]
        AuthService["authService"]
        AmplifyAuth["AWS_Amplify_Auth"]
    end
    
    subgraph "External_Services" ["External Services"]
        CognitoUserPool["Cognito_User_Pool"]
        GoogleOAuth["Google_OAuth"]
        FacebookOAuth["Facebook_OAuth"]
        AppleOAuth["Apple_OAuth"]
    end
    
    LoginPage --> UserContext
    SignupPage --> UserContext
    UpdatePasswordPage --> AuthContext
    OAuthButtons --> AmplifyAuth
    
    UserContext --> AuthService
    AuthContext --> AmplifyAuth
    
    AuthService --> AmplifyAuth
    AmplifyAuth --> CognitoUserPool
    AmplifyAuth --> GoogleOAuth
    AmplifyAuth --> FacebookOAuth
    AmplifyAuth --> AppleOAuth
```

Sources: [src/pages/auth/login.tsx:1-333](), [src/contexts/AuthContext.tsx:1-201](), [src/contexts/AuthService.ts:1-62]()

## Core Components and Code Entities

The authentication system consists of several key components that work together to provide a complete authentication solution:

```mermaid
graph TD
    subgraph "React_Components" ["React Components"]
        Login_tsx["Login<br/>/pages/auth/login.tsx"]
        Signup_tsx["Signup<br/>/pages/auth/signup.tsx"]
        UpdatePassword_tsx["UpdatePassword<br/>/pages/auth/updatepassword.tsx"]
    end
    
    subgraph "Context_Providers" ["Context Providers"]
        UserContext_tsx["UserContext<br/>/contexts/UserContext"]
        AuthContext_tsx["AuthContext<br/>/contexts/AuthContext.tsx"]
    end
    
    subgraph "Services" ["Service Layer"]
        authService_ts["authService<br/>/contexts/AuthService.ts"]
    end
    
    subgraph "AWS_Amplify_Functions" ["AWS Amplify Functions"]
        signIn["signIn"]
        signOut["signOut"]
        getCurrentUser["getCurrentUser"]
        fetchAuthSession["fetchAuthSession"]
        fetchUserAttributes["fetchUserAttributes"]
        confirmSignIn["confirmSignIn"]
    end
    
    subgraph "State_Management" ["State Management"]
        user_state["user: AuthUser | null"]
        token_state["token: string | null"]
        isAuthenticated_state["isAuthenticated: boolean"]
        isLoading_state["isLoading: boolean"]
    end
    
    Login_tsx --> UserContext_tsx
    Login_tsx --> signIn
    Login_tsx --> getCurrentUser
    Login_tsx --> fetchAuthSession
    Login_tsx --> fetchUserAttributes
    
    AuthContext_tsx --> signOut
    AuthContext_tsx --> getCurrentUser
    AuthContext_tsx --> fetchAuthSession
    
    authService_ts --> getCurrentUser
    authService_ts --> fetchUserAttributes
    authService_ts --> fetchAuthSession
    authService_ts --> signOut
    
    UserContext_tsx --> user_state
    AuthContext_tsx --> token_state
    AuthContext_tsx --> isAuthenticated_state
    AuthContext_tsx --> isLoading_state
```

Sources: [src/pages/auth/login.tsx:8-10](), [src/contexts/AuthContext.tsx:1-8](), [src/contexts/AuthService.ts:1-2]()

## Authentication Flows

### Primary Login Flow

The main authentication flow handles credential validation, session management, and various authentication scenarios:

```mermaid
sequenceDiagram
    participant User
    participant Login_Component
    participant UserContext
    participant AWS_Amplify
    participant Cognito_User_Pool
    
    User->>Login_Component: "Enter credentials"
    Login_Component->>Login_Component: "handleSubmit()"
    Login_Component->>AWS_Amplify: "signIn(username, password)"
    AWS_Amplify->>Cognito_User_Pool: "Authenticate user"
    
    alt Authentication Success
        Cognito_User_Pool->>AWS_Amplify: "AuthSignInResult"
        AWS_Amplify->>Login_Component: "isSignedIn: true"
        Login_Component->>AWS_Amplify: "getCurrentUser()"
        Login_Component->>AWS_Amplify: "fetchAuthSession()"
        Login_Component->>AWS_Amplify: "fetchUserAttributes()"
        Login_Component->>UserContext: "login(user, token, attributes)"
        UserContext->>Login_Component: "Success"
        Login_Component->>User: "Navigate to /adminpanel"
    else Authentication Failure
        Cognito_User_Pool->>AWS_Amplify: "AuthError"
        AWS_Amplify->>Login_Component: "Error details"
        Login_Component->>Login_Component: "handleAuthError()"
        Login_Component->>User: "Display error message"
    else MFA Required
        Cognito_User_Pool->>AWS_Amplify: "NextStep: MFA"
        AWS_Amplify->>Login_Component: "nextStep.signInStep"
        Login_Component->>Login_Component: "handleAuthNextStep()"
        Login_Component->>User: "Redirect to MFA flow"
    end
```

Sources: [src/pages/auth/login.tsx:44-98](), [src/pages/auth/login.tsx:100-114]()

### OAuth Authentication Flow

The system supports OAuth authentication through multiple providers with automatic redirect handling:

```mermaid
sequenceDiagram
    participant User
    participant Login_Component
    participant AWS_Amplify
    participant OAuth_Provider
    participant Cognito_Hosted_UI
    
    User->>Login_Component: "Click OAuth button"
    Login_Component->>AWS_Amplify: "signInWithRedirect(provider)"
    AWS_Amplify->>Cognito_Hosted_UI: "Redirect to hosted UI"
    Cognito_Hosted_UI->>OAuth_Provider: "OAuth authorization"
    OAuth_Provider->>User: "User consent"
    User->>OAuth_Provider: "Grant permission"
    OAuth_Provider->>Cognito_Hosted_UI: "Authorization code"
    Cognito_Hosted_UI->>Login_Component: "Redirect with tokens"
    
    Login_Component->>Login_Component: "handleOAuthResponse()"
    Login_Component->>AWS_Amplify: "getCurrentUser()"
    Login_Component->>AWS_Amplify: "fetchAuthSession()"
    Login_Component->>AWS_Amplify: "fetchUserAttributes()"
    Login_Component->>UserContext: "login(user, token, attributes)"
    Login_Component->>User: "Navigate to dashboard"
```

Sources: [src/pages/auth/login.tsx:116-161]()

### Token Management and Session Validation

The authentication system implements comprehensive token management with automatic refresh and validation:

```mermaid
graph TD
    subgraph "Token_Lifecycle" ["Token Lifecycle Management"]
        CheckAuthState["checkAuthState()"]
        ValidateToken["validateToken()"]
        RefreshToken["refreshToken()"]
        CheckAuthentication["checkAuthentication()"]
    end
    
    subgraph "Session_Operations" ["Session Operations"]
        FetchAuthSession["fetchAuthSession()"]
        GetCurrentUser["getCurrentUser()"]
        ForceRefresh["fetchAuthSession({forceRefresh: true})"]
    end
    
    subgraph "State_Updates" ["State Updates"]
        SetUser["setUser(user)"]
        SetToken["setToken(token)"]
        SetAuthenticated["setIsAuthenticated(true)"]
        ClearState["Clear all auth state"]
    end
    
    CheckAuthState --> GetCurrentUser
    CheckAuthState --> FetchAuthSession
    CheckAuthState --> SetUser
    CheckAuthState --> SetToken
    CheckAuthState --> SetAuthenticated
    
    ValidateToken --> FetchAuthSession
    ValidateToken --> GetCurrentUser
    ValidateToken --> ClearState
    
    RefreshToken --> ForceRefresh
    RefreshToken --> SetToken
    
    CheckAuthentication --> GetCurrentUser
    CheckAuthentication --> FetchAuthSession
    CheckAuthentication --> SetUser
    CheckAuthentication --> SetToken
```

Sources: [src/contexts/AuthContext.tsx:44-70](), [src/contexts/AuthContext.tsx:105-129](), [src/contexts/AuthContext.tsx:165-178]()

## AWS Cognito Integration

The system integrates deeply with AWS Cognito for identity management, using the AWS Amplify Auth library as the primary interface:

| Function | Purpose | Source File | Usage |
|----------|---------|-------------|-------|
| `signIn` | Authenticate user credentials | login.tsx | Primary login flow |
| `confirmSignIn` | Handle MFA confirmation | login.tsx | Multi-factor authentication |
| `getCurrentUser` | Get authenticated user info | Multiple | Session validation |
| `fetchAuthSession` | Retrieve current session tokens | Multiple | Token management |
| `fetchUserAttributes` | Get user profile attributes | Multiple | User information |
| `signOut` | End user session | AuthContext.tsx | Logout functionality |

### Authentication Error Handling

The system implements comprehensive error handling for various authentication scenarios:

```mermaid
graph TD
    subgraph "Error_Types" ["Authentication Error Types"]
        UserNotFound["UserNotFoundException"]
        NotAuthorized["NotAuthorizedException"]
        NewPasswordRequired["NewPasswordRequired"]
        MFARequired["MFA_Required"]
        OAuthError["OAuth_Error"]
        TokenExpired["Token_Expired"]
    end
    
    subgraph "Error_Handlers" ["Error Handling Logic"]
        ShowSignUpDialog["Show signup dialog"]
        RedirectToUpdatePassword["Navigate to /updatepassword"]
        HandleMFAFlow["Handle MFA flow"]
        ShowOAuthError["Display OAuth error"]
        RefreshSession["Refresh token"]
        ClearAuthState["Clear authentication state"]
    end
    
    UserNotFound --> ShowSignUpDialog
    NotAuthorized --> ShowSignUpDialog
    NewPasswordRequired --> RedirectToUpdatePassword
    MFARequired --> HandleMFAFlow
    OAuthError --> ShowOAuthError
    TokenExpired --> RefreshSession
    TokenExpired --> ClearAuthState
```

Sources: [src/pages/auth/login.tsx:83-97](), [src/pages/auth/login.tsx:100-114](), [src/pages/auth/login.tsx:116-130]()

## State Management Architecture

The authentication system uses React Context for global state management, providing a clean separation between authentication logic and UI components:

### AuthContext State Structure

| State Property | Type | Purpose |
|----------------|------|---------|
| `user` | `AuthUser \| null` | Current authenticated user |
| `token` | `string \| null` | JWT ID token |
| `isLoading` | `boolean` | Authentication check in progress |
| `shown` | `boolean` | User interface display state |
| `isAuthenticated` | `boolean` | Authentication status |
| `userAttributes` | `FetchUserAttributesOutput` | User profile attributes |

### Context Methods

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| `login` | `user`, `token`, `attributes` | `Promise<boolean>` | Set authenticated state |
| `logout` | None | `Promise<boolean>` | Clear authentication |
| `validateToken` | None | `Promise<boolean>` | Check token validity |
| `refreshToken` | None | `Promise<string \| null>` | Refresh session token |
| `checkAuthState` | None | `Promise<void>` | Initial auth check |
| `checkAuthentication` | None | `Promise<void>` | Validate current auth |

Sources: [src/contexts/AuthContext.tsx:10-23](), [src/contexts/AuthContext.tsx:131-142](), [src/contexts/AuthContext.tsx:144-163]()

## Service Layer Abstraction

The `authService` provides a clean abstraction over AWS Amplify authentication functions, centralizing common operations and error handling:

```mermaid
graph LR
    subgraph "AuthService_Methods" ["authService Methods"]
        getCurrentUser_service["getCurrentUser()"]
        getAttributes_service["getAttributes()"]
        getSession_service["getSession()"]
        signOut_service["signOut()"]
        refreshSession_service["refreshSession()"]
    end
    
    subgraph "AWS_Amplify_Functions" ["Underlying Amplify Functions"]
        getCurrentUser_amplify["getCurrentUser()"]
        fetchUserAttributes_amplify["fetchUserAttributes()"]
        fetchAuthSession_amplify["fetchAuthSession()"]
        signOut_amplify["signOut()"]
        fetchAuthSession_refresh["fetchAuthSession({forceRefresh: true})"]
    end
    
    getCurrentUser_service --> getCurrentUser_amplify
    getCurrentUser_service --> fetchUserAttributes_amplify
    getAttributes_service --> fetchUserAttributes_amplify
    getSession_service --> fetchAuthSession_amplify
    signOut_service --> signOut_amplify
    refreshSession_service --> fetchAuthSession_refresh
```

Sources: [src/contexts/AuthService.ts:3-62]()