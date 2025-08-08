# Code Architecture Patterns

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/App.tsx](/src/App.tsx)
- [src/contexts/AuthService.ts](/src/contexts/AuthService.ts)
- [src/contexts/UserContext.tsx](/src/contexts/UserContext.tsx)

</details>



This document describes the common architectural patterns used throughout the CasinoVizion codebase. These patterns provide consistent approaches to authentication, state management, component design, and application structure. For specific implementation details of the authentication system, see [Authentication System](./5_Authentication_System.md). For UI component patterns, see [User Interface Components](./14_User_Interface_Components.md).

## Context Provider Pattern

The application uses React Context extensively for global state management, particularly for user authentication and authorization state.

### UserContext Implementation

The `UserContext` follows a standard provider pattern with typed interfaces and custom hooks for type-safe access.

```mermaid
graph TD
    subgraph "UserContext Pattern"
        UserProvider["UserProvider"]
        UserContext["UserContext"]
        useUser["useUser()"]
        
        subgraph "State Management"
            userState["user: User | null"]
            tokenState["token: string | null"]
            isLoadingState["isLoading: boolean"]
            isAuthenticatedState["isAuthenticated: boolean"]
        end
        
        subgraph "Authentication Actions"
            login["login()"]
            logout["logout()"]
            updateUser["updateUser()"]
            hasPermission["hasPermission()"]
            refreshToken["refreshToken()"]
            validateToken["validateToken()"]
        end
    end
    
    UserProvider --> UserContext
    UserContext --> useUser
    UserProvider --> userState
    UserProvider --> tokenState
    UserProvider --> isLoadingState
    UserProvider --> isAuthenticatedState
    UserProvider --> login
    UserProvider --> logout
    UserProvider --> updateUser
    UserProvider --> hasPermission
    UserProvider --> refreshToken
    UserProvider --> validateToken
```

The pattern includes:
- **Context Creation**: [src/contexts/UserContext.tsx:49]() creates the context with undefined default
- **Provider Component**: [src/contexts/UserContext.tsx:82-208]() wraps children with context value
- **Custom Hook**: [src/contexts/UserContext.tsx:211-217]() provides type-safe access with error handling
- **Type Safety**: [src/contexts/UserContext.tsx:20-31]() defines comprehensive interface for context value

**Sources:** [src/contexts/UserContext.tsx:1-217](), [src/App.tsx:115]()

## Service Layer Pattern

The application abstracts external dependencies through service layers, particularly for AWS Amplify authentication.

### AuthService Implementation

The `authService` provides a clean abstraction over AWS Amplify authentication functions:

```mermaid
graph LR
    subgraph "Service Layer Pattern"
        authService["authService"]
        
        subgraph "AWS Amplify Functions"
            getCurrentUser["getCurrentUser()"]
            signOut["signOut()"]
            fetchAuthSession["fetchAuthSession()"]
            fetchUserAttributes["fetchUserAttributes()"]
        end
        
        subgraph "Service Methods"
            getCurrentUserMethod["getCurrentUser()"]
            getSessionMethod["getSession()"]
            signOutMethod["signOut()"]
            refreshSessionMethod["refreshSession()"]
            getAttributesMethod["getAttributes()"]
        end
    end
    
    authService --> getCurrentUserMethod
    authService --> getSessionMethod
    authService --> signOutMethod
    authService --> refreshSessionMethod
    authService --> getAttributesMethod
    
    getCurrentUserMethod --> getCurrentUser
    getCurrentUserMethod --> fetchUserAttributes
    getSessionMethod --> fetchAuthSession
    signOutMethod --> signOut
    refreshSessionMethod --> fetchAuthSession
    getAttributesMethod --> fetchUserAttributes
```

Key characteristics:
- **Error Handling**: Each method includes try-catch blocks with console logging
- **Return Consistency**: Methods return null on error for consistent error handling
- **Async/Await**: All methods use async/await pattern for clean promise handling
- **Single Responsibility**: Each method has a focused purpose

**Sources:** [src/contexts/AuthService.ts:1-62]()

## Authentication & Authorization Patterns

### Role-Based Permission System

The application implements a role-based access control system with granular permissions:

```mermaid
graph TD
    subgraph "Permission System"
        UserRole["UserRole: 'admin' | 'developer' | 'guest'"]
        hasPermission["hasPermission(permission: string)"]
        
        subgraph "Permission Matrix"
            adminPerms["admin: ['view_all', 'add_edit_delete_users', 'add_edit_records', 'delete_records', 'edit_profile']"]
            devPerms["developer: ['view_all', 'add_edit_records', 'delete_records', 'edit_profile']"]
            guestPerms["guest: ['view_all', 'add_edit_records', 'edit_profile']"]
        end
        
        subgraph "Usage in Components"
            ProtectedRoute["ProtectedRoute"]
            hasPermissionCheck["hasPermission() calls"]
        end
    end
    
    UserRole --> hasPermission
    hasPermission --> adminPerms
    hasPermission --> devPerms
    hasPermission --> guestPerms
    hasPermission --> ProtectedRoute
    hasPermission --> hasPermissionCheck
```

Permission checking pattern:
- **Type Safety**: [src/contexts/UserContext.tsx:5]() defines UserRole as string literal union
- **Permission Map**: [src/contexts/UserContext.tsx:158-162]() maps roles to permission arrays
- **Permission Validation**: [src/contexts/UserContext.tsx:155-165]() checks user role against required permission

**Sources:** [src/contexts/UserContext.tsx:5](), [src/contexts/UserContext.tsx:155-165]()

### User Mapping Pattern

The application transforms AWS Cognito user data into application-specific user objects:

```mermaid
graph LR
    subgraph "User Mapping Pattern"
        CognitoUser["AuthUser (AWS Cognito)"]
        UserAttributes["FetchUserAttributesOutput"]
        Session["Session with tokens"]
        
        mapCognitoUserToAppUser["mapCognitoUserToAppUser()"]
        AppUser["User (Application)"]
        
        subgraph "Mapping Logic"
            extractId["Extract cognitoUser.username → id"]
            extractEmail["Extract signInDetails.loginId → email"]
            extractRole["Extract cognito:groups[0] → role"]
            extractNames["Extract given_name, family_name"]
        end
    end
    
    CognitoUser --> mapCognitoUserToAppUser
    UserAttributes --> mapCognitoUserToAppUser
    Session --> mapCognitoUserToAppUser
    
    mapCognitoUserToAppUser --> extractId
    mapCognitoUserToAppUser --> extractEmail
    mapCognitoUserToAppUser --> extractRole
    mapCognitoUserToAppUser --> extractNames
    
    mapCognitoUserToAppUser --> AppUser
```

**Sources:** [src/contexts/UserContext.tsx:88-107]()

## Route Protection Pattern

The application uses a consistent pattern for protecting routes based on user permissions:

### ProtectedRoute Component Usage

```mermaid
graph TD
    subgraph "Route Protection Pattern"
        BrowserRouter["BrowserRouter"]
        Routes["Routes"]
        
        subgraph "Protected Routes"
            indexRoute["/adminpanel → ProtectedRoute permission='view_all'"]
            casinosRoute["/adminpanel/casinos → ProtectedRoute permission='view_all'"]
            usersRoute["/adminpanel/users → ProtectedRoute permission='add_edit_delete_users'"]
            settingsRoute["/adminpanel/settings → ProtectedRoute permission='edit_profile'"]
        end
        
        subgraph "Auth Routes (Unprotected)"
            loginRoute["/adminpanel/login → Login"]
            updatePasswordRoute["/updatepassword → UpdatePassword"]
        end
        
        ProtectedRoute["ProtectedRoute Component"]
        hasPermission["hasPermission() check"]
    end
    
    BrowserRouter --> Routes
    Routes --> indexRoute
    Routes --> casinosRoute
    Routes --> usersRoute
    Routes --> settingsRoute
    Routes --> loginRoute
    Routes --> updatePasswordRoute
    
    indexRoute --> ProtectedRoute
    casinosRoute --> ProtectedRoute
    usersRoute --> ProtectedRoute
    settingsRoute --> ProtectedRoute
    
    ProtectedRoute --> hasPermission
```

Protection patterns:
- **Declarative Protection**: Each route declares required permission as prop
- **Permission Granularity**: Different routes require different permissions
- **Fallback Behavior**: Unauthenticated users redirected to login

**Sources:** [src/App.tsx:66-105]()

## State Management Patterns

### Provider Composition Pattern

The application composes multiple providers to create a comprehensive application context:

```mermaid
graph TD
    subgraph "Provider Composition"
        App["App Component"]
        QueryClientProvider["QueryClientProvider"]
        UserProvider["UserProvider"]
        TooltipProvider["TooltipProvider"]
        BrowserRouter["BrowserRouter"]
        SidebarProvider["SidebarProvider"]
        
        AppContent["AppContent"]
    end
    
    App --> QueryClientProvider
    QueryClientProvider --> UserProvider
    UserProvider --> TooltipProvider
    TooltipProvider --> BrowserRouter
    BrowserRouter --> SidebarProvider
    SidebarProvider --> AppContent
```

Each provider serves a specific purpose:
- **QueryClientProvider**: React Query for server state management
- **UserProvider**: User authentication and authorization state
- **TooltipProvider**: UI tooltip functionality
- **SidebarProvider**: Sidebar state management

**Sources:** [src/App.tsx:113-127]()

### Loading State Pattern

The UserContext implements a comprehensive loading state pattern:

| State | Purpose | Initial Value |
|-------|---------|---------------|
| `isLoading` | Indicates user data fetch in progress | `true` |
| `isAuthenticated` | Tracks authentication status | `false` |
| `user` | Current user object | `mockUsers.guest` |
| `token` | Authentication token | `null` |

Loading flow:
1. **Initial Load**: [src/contexts/UserContext.tsx:188-190]() triggers `loadUser()` on mount
2. **Loading State**: [src/contexts/UserContext.tsx:110]() sets loading to true
3. **User Fetch**: [src/contexts/UserContext.tsx:113-121]() attempts to get current user
4. **State Update**: [src/contexts/UserContext.tsx:117-120]() updates user, token, and auth status
5. **Loading Complete**: [src/contexts/UserContext.tsx:125]() sets loading to false

**Sources:** [src/contexts/UserContext.tsx:82-127](), [src/contexts/UserContext.tsx:188-190]()

## Layout Selection Pattern

The application dynamically selects layouts based on the current route:

### Dynamic Layout Selection

```mermaid
graph LR
    subgraph "Layout Selection Pattern"
        AppContent["AppContent Component"]
        useLocation["useLocation()"]
        isAuthRoute["isAuthRoute calculation"]
        
        subgraph "Layout Decision"
            authCheck["pathname.startsWith('/adminpanel/login') || pathname === '/updatepassword'"]
            AuthLayout["AuthLayout"]
            DashboardLayout["DashboardLayout"]
        end
        
        subgraph "Route Types"
            loginRoutes["/adminpanel/login, /updatepassword"]
            dashboardRoutes["/adminpanel/*"]
        end
    end
    
    AppContent --> useLocation
    useLocation --> isAuthRoute
    isAuthRoute --> authCheck
    
    authCheck --> AuthLayout
    authCheck --> DashboardLayout
    
    loginRoutes --> AuthLayout
    dashboardRoutes --> DashboardLayout
```

Pattern implementation:
- **Route Detection**: [src/App.tsx:37]() determines if current path is auth-related
- **Layout Selection**: [src/App.tsx:39]() selects appropriate layout component
- **Conditional Rendering**: [src/App.tsx:61]() renders selected layout with children

**Sources:** [src/App.tsx:35-39](), [src/App.tsx:61]()

## Configuration Pattern

### Environment-Based Configuration

The application uses environment variables for external service configuration:

```mermaid
graph TD
    subgraph "Configuration Pattern"
        envVars["Environment Variables"]
        amplifyConfig["amplifyConfig object"]
        
        subgraph "Cognito Configuration"
            userPoolId["VITE_APP_COGNITO_USER_POOL_ID"]
            clientId["VITE_APP_COGNITO_CLIENT_ID"]
            domain["VITE_APP_COGNITO_DOMAIN"]
        end
        
        subgraph "OAuth Configuration"
            scopes["scopes: ['email', 'profile', 'openid']"]
            redirectSignIn["redirectSignIn URLs"]
            redirectSignOut["redirectSignOut URLs"]
            responseType["responseType: 'code'"]
        end
        
        AmplifyConfig["Amplify.configure()"]
    end
    
    envVars --> userPoolId
    envVars --> clientId
    envVars --> domain
    
    userPoolId --> amplifyConfig
    clientId --> amplifyConfig
    domain --> amplifyConfig
    
    amplifyConfig --> scopes
    amplifyConfig --> redirectSignIn
    amplifyConfig --> redirectSignOut
    amplifyConfig --> responseType
    
    amplifyConfig --> AmplifyConfig
```

Configuration characteristics:
- **Environment Variables**: [src/App.tsx:31-33]() imports configuration from environment
- **Type Safety**: Configuration object follows `ResourcesConfig` interface
- **OAuth Setup**: [src/App.tsx:45-53]() configures OAuth providers and redirect URLs
- **Runtime Configuration**: [src/App.tsx:58]() configures Amplify at application startup

**Sources:** [src/App.tsx:31-58]()