# Routing and Navigation

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/App.tsx](/src/App.tsx)

</details>



This document covers the routing and navigation system in the CasinoVizion administrative panel. It explains how React Router is configured, how routes are protected with permission-based access control, and how the layout system adapts based on the current route context.

For information about authentication flows and user management, see [Authentication System](./5_Authentication_System.md). For details about user permissions and role management, see [User Context and State Management](./13_User_Context_and_State_Management.md).

## Route Structure Overview

The application uses React Router with a hierarchical route structure that separates authentication routes from protected administrative routes. The routing logic is centralized in the main App component and uses different layouts based on the route context.

### Route Hierarchy

```mermaid
graph TD
    ROOT["/"]
    REDIRECT["Navigate to /adminpanel/login"]
    
    subgraph "Authentication Routes"
        LOGIN["/adminpanel/login"]
        SIGNUP["/adminpanel/login/signup"]
        UPDATE["/updatepassword"]
    end
    
    subgraph "Protected Admin Routes"
        ADMIN["/adminpanel"]
        CASINOS["/adminpanel/casinos"]
        CREATE["/adminpanel/casinos/create"]
        DETAILS["/adminpanel/casinos/:casinoId"]
        VIEW["/adminpanel/casinos/:casinoId/view"]
        USERS["/adminpanel/users"]
        ANALYTICS["/adminpanel/analytics"]
        SETTINGS["/adminpanel/settings"]
    end
    
    CATCHALL["/* (NotFound)"]
    
    ROOT --> REDIRECT
    REDIRECT --> LOGIN
    
    LOGIN --> ADMIN
    ADMIN --> CASINOS
    CASINOS --> CREATE
    CASINOS --> DETAILS
    DETAILS --> VIEW
    ADMIN --> USERS
    ADMIN --> ANALYTICS
    ADMIN --> SETTINGS
```

Sources: [src/App.tsx:62-108]()

### Layout Selection Logic

The application dynamically selects layouts based on the current route path using location-based conditional rendering:

```mermaid
graph LR
    LOCATION["useLocation()"]
    CHECK["isAuthRoute check"]
    AUTH_LAYOUT["AuthLayout"]
    DASH_LAYOUT["DashboardLayout"]
    
    LOCATION --> CHECK
    CHECK -->|"startsWith('/adminpanel/login') || === '/updatepassword'"| AUTH_LAYOUT
    CHECK -->|"else"| DASH_LAYOUT
    
    AUTH_LAYOUT --> LOGIN_ROUTES["Login, Signup, UpdatePassword"]
    DASH_LAYOUT --> PROTECTED_ROUTES["All /adminpanel/* routes"]
```

Sources: [src/App.tsx:35-39]()

## Protected Routes and Permissions

All administrative routes are wrapped with the `ProtectedRoute` component that enforces permission-based access control. The system uses three main permission levels that correspond to different user roles.

### Permission-Based Route Protection

```mermaid
graph TD
    subgraph "Permission Levels"
        VIEW_ALL["view_all"]
        USER_MGMT["add_edit_delete_users"]
        EDIT_PROFILE["edit_profile"]
    end
    
    subgraph "Protected Routes with view_all"
        INDEX["/adminpanel → Index"]
        CASINO_LIST["/adminpanel/casinos → CasinoList"]
        CASINO_CREATE["/adminpanel/casinos/create → CreateCasino"]
        CASINO_DETAILS["/adminpanel/casinos/:casinoId → CasinoDetails"]
        CASINO_VIEW["/adminpanel/casinos/:casinoId/view → ViewCasino"]
        ANALYTICS_PAGE["/adminpanel/analytics → Analytics"]
    end
    
    subgraph "Protected Routes with add_edit_delete_users"
        USERS_PAGE["/adminpanel/users → Users"]
    end
    
    subgraph "Protected Routes with edit_profile"
        SETTINGS_PAGE["/adminpanel/settings → Settings"]
    end
    
    VIEW_ALL --> INDEX
    VIEW_ALL --> CASINO_LIST
    VIEW_ALL --> CASINO_CREATE
    VIEW_ALL --> CASINO_DETAILS
    VIEW_ALL --> CASINO_VIEW
    VIEW_ALL --> ANALYTICS_PAGE
    
    USER_MGMT --> USERS_PAGE
    EDIT_PROFILE --> SETTINGS_PAGE
```

Sources: [src/App.tsx:66-105]()

### Route Protection Implementation

Each protected route follows this pattern where the `ProtectedRoute` component wraps the target page component:

| Route Path | Component | Required Permission |
|------------|-----------|-------------------|
| `/adminpanel` | `Index` | `view_all` |
| `/adminpanel/casinos` | `CasinoList` | `view_all` |
| `/adminpanel/casinos/create` | `CreateCasino` | `view_all` |
| `/adminpanel/casinos/:casinoId` | `CasinoDetails` | `view_all` |
| `/adminpanel/casinos/:casinoId/view` | `ViewCasino` | `view_all` |
| `/adminpanel/users` | `Users` | `add_edit_delete_users` |
| `/adminpanel/analytics` | `Analytics` | `view_all` |
| `/adminpanel/settings` | `Settings` | `edit_profile` |

Sources: [src/App.tsx:66-105]()

## Layout System Architecture

The application uses a dual-layout system that provides different UI structures for authentication and administrative contexts.

### Layout Component Selection

```mermaid
graph TB
    APP_CONTENT["AppContent Component"]
    LOCATION_CHECK["Location Path Check"]
    
    subgraph "AuthLayout Context"
        AUTH_ROUTES["Login Routes"]
        AUTH_UI["Simplified Auth UI"]
        NO_SIDEBAR["No Sidebar"]
    end
    
    subgraph "DashboardLayout Context"
        ADMIN_ROUTES["Protected Admin Routes"]
        FULL_UI["Full Dashboard UI"]
        SIDEBAR["Sidebar Navigation"]
    end
    
    APP_CONTENT --> LOCATION_CHECK
    LOCATION_CHECK -->|"/adminpanel/login or /updatepassword"| AUTH_ROUTES
    LOCATION_CHECK -->|"All other routes"| ADMIN_ROUTES
    
    AUTH_ROUTES --> AUTH_UI
    AUTH_ROUTES --> NO_SIDEBAR
    
    ADMIN_ROUTES --> FULL_UI
    ADMIN_ROUTES --> SIDEBAR
```

Sources: [src/App.tsx:35-39](), [src/App.tsx:25-27]()

## Route Configuration Details

### Environment-Based Redirects

The AWS Cognito OAuth configuration includes environment-specific redirect URLs that support both development and production environments:

- Development: `http://localhost:3000/adminpanel/login`
- Production: `${window.location.origin}/login`

Sources: [src/App.tsx:40-56]()

### Default Route Behavior

The root path (`/`) automatically redirects to `/adminpanel/login` using React Router's `Navigate` component with the `replace` prop to avoid adding unnecessary history entries.

Sources: [src/App.tsx:63]()

### Error Handling

All unmatched routes are handled by a catch-all route that renders the `NotFound` component, providing a consistent error experience.

Sources: [src/App.tsx:107]()

## Navigation Context and Providers

The routing system is wrapped within multiple context providers that enable global state management and UI functionality:

### Provider Hierarchy

```mermaid
graph TD
    QUERY_CLIENT["QueryClientProvider"]
    USER_PROVIDER["UserProvider"]
    TOOLTIP_PROVIDER["TooltipProvider"]
    BROWSER_ROUTER["BrowserRouter"]
    SIDEBAR_PROVIDER["SidebarProvider"]
    APP_CONTENT["AppContent"]
    
    QUERY_CLIENT --> USER_PROVIDER
    USER_PROVIDER --> TOOLTIP_PROVIDER
    TOOLTIP_PROVIDER --> BROWSER_ROUTER
    BROWSER_ROUTER --> SIDEBAR_PROVIDER
    SIDEBAR_PROVIDER --> APP_CONTENT
    
    APP_CONTENT --> ROUTES["Route Components"]
```

This provider hierarchy ensures that routing components have access to user context, query capabilities, and UI state management throughout the application.

Sources: [src/App.tsx:113-127]()