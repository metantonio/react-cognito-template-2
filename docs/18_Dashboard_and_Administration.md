# Dashboard and Administration

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/pages/Index.tsx](/src/pages/Index.tsx)
- [src/pages/settings/Settings.tsx](/src/pages/settings/Settings.tsx)

</details>



This document covers the main administrative interface of the CasinoVizion system, including the dashboard overview page and system settings management. The dashboard provides role-based summary metrics and quick access to primary functions, while the settings system handles system configuration, user preferences, and administrative controls.

For authentication-related user management, see [Authentication System](./5_Authentication_System.md). For specific casino management functionality, see [Casino Management](./22_Casino_Management.md). For UI components used throughout these interfaces, see [User Interface Components](./14_User_Interface_Components.md).

## Dashboard Overview

The main dashboard serves as the primary landing page for authenticated users, providing a role-based overview of system metrics and quick access to key functionality.

### Dashboard Architecture

```mermaid
graph TB
    subgraph "Index Component"
        INDEX[Index.tsx]
        CARDS[Card Grid System]
        ACTIONS[Quick Actions]
        ACTIVITY[Recent Activity]
    end
    
    subgraph "Permission System"
        USERCTX[UserContext]
        ROLEGUARD[RoleGuard]
        PERMISSIONS[Permission Definitions]
    end
    
    subgraph "UI Components"
        PROFILE[ProfileDropdown]
        SIDEBAR[SidebarTrigger]
        CARDCOMP[Card Components]
    end
    
    subgraph "Data Display"
        METRICS[Metric Cards]
        NAVIGATION[Quick Navigation]
        UPDATES[Activity Feed]
    end
    
    INDEX --> CARDS
    INDEX --> ACTIONS
    INDEX --> ACTIVITY
    
    CARDS --> USERCTX
    ACTIONS --> ROLEGUARD
    ACTIVITY --> ROLEGUARD
    
    USERCTX --> PERMISSIONS
    ROLEGUARD --> PERMISSIONS
    
    INDEX --> PROFILE
    INDEX --> SIDEBAR
    CARDS --> CARDCOMP
    
    CARDS --> METRICS
    ACTIONS --> NAVIGATION
    ACTIVITY --> UPDATES
```

Sources: [src/pages/Index.tsx:1-218]()

### Role-Based Card System

The dashboard displays different metric cards based on user permissions. The system defines cards with associated permissions and filters them based on the current user's role.

| Card Type | Metric | Permission Required | Available Roles |
|-----------|--------|-------------------|-----------------|
| Total Casinos | Building count | `view_all` | admin, developer, guest |
| Total Hotels | Hotel count | `view_all` | admin, developer, guest |
| Total Restaurants | Restaurant count | `view_all` | admin, developer, guest |
| Active Customers | User count | `add_edit_delete_users` | admin only |

The permission filtering logic is implemented in [src/pages/Index.tsx:77-86](), where cards are filtered based on role-specific permission arrays.

### Quick Actions System

The dashboard provides contextual quick actions that adapt to user permissions:

```mermaid
graph LR
    subgraph "Quick Actions Card"
        QUICKCARD[Quick Actions CardContent]
        CASINO_LINK[Casino Management Link]
        USER_LINK[User Management Link]
    end
    
    subgraph "Permission Checks"
        ALWAYS[Always Visible]
        GUARD[RoleGuard Component]
    end
    
    subgraph "Target Pages"
        CASINO_PAGE["/adminpanel/casinos"]
        USER_PAGE["/adminpanel/users"]
    end
    
    QUICKCARD --> CASINO_LINK
    QUICKCARD --> USER_LINK
    
    CASINO_LINK --> ALWAYS
    USER_LINK --> GUARD
    
    CASINO_LINK --> CASINO_PAGE
    USER_LINK --> USER_PAGE
    
    GUARD --> USER_PAGE
```

Sources: [src/pages/Index.tsx:148-176]()

## Settings Management

The settings system provides a comprehensive interface for system configuration, security settings, notifications, and administrative controls through a tabbed interface.

### Settings Architecture

```mermaid
graph TB
    subgraph "Settings Component"
        SETTINGS[Settings.tsx]
        TABS[Tab System]
        STATE[Settings State]
    end
    
    subgraph "Tab Components"
        GENERAL[General Tab]
        SECURITY[Security Tab]
        NOTIFICATIONS[Notifications Tab]
        SYSTEM[System Tab]
    end
    
    subgraph "External Services"
        AMPLIFY[AWS Amplify Auth]
        TOAST[Toast Notifications]
        SEARCHPARAMS[URL Search Params]
    end
    
    subgraph "Form Components"
        INPUTS[Input Components]
        SELECTS[Select Components]
        SWITCHES[Switch Components]
        BUTTONS[Button Components]
    end
    
    SETTINGS --> TABS
    SETTINGS --> STATE
    
    TABS --> GENERAL
    TABS --> SECURITY
    TABS --> NOTIFICATIONS
    TABS --> SYSTEM
    
    SECURITY --> AMPLIFY
    SETTINGS --> TOAST
    TABS --> SEARCHPARAMS
    
    GENERAL --> INPUTS
    GENERAL --> SELECTS
    NOTIFICATIONS --> SWITCHES
    SYSTEM --> SWITCHES
    SECURITY --> BUTTONS
```

Sources: [src/pages/settings/Settings.tsx:1-387]()

### Settings Categories

#### General Settings
Manages basic system configuration including company information, timezone, and currency settings. The general tab includes:

- Company logo upload functionality
- Company name configuration [src/pages/settings/Settings.tsx:169-175]()
- Admin email settings [src/pages/settings/Settings.tsx:177-185]()
- Timezone selection from predefined options [src/pages/settings/Settings.tsx:189-202]()
- Default currency configuration [src/pages/settings/Settings.tsx:204-218]()

#### Security Settings
Handles password management with comprehensive validation:

```mermaid
graph TD
    subgraph "Password Reset Flow"
        FORM[Password Form]
        VALIDATION[Password Validation]
        UPDATE[AWS Amplify Update]
        SUCCESS[Success Notification]
    end
    
    subgraph "Validation Rules"
        LENGTH[Min 8 Characters]
        NUMERIC[Contains Number]
        LOWER[Contains Lowercase]
        UPPER[Contains Uppercase]
        SPECIAL[Contains Special Character]
    end
    
    subgraph "State Management"
        PASSWORDS[Password State Object]
        ERROR[Error State]
        FIELDS[Form Fields]
    end
    
    FORM --> VALIDATION
    VALIDATION --> UPDATE
    UPDATE --> SUCCESS
    
    VALIDATION --> LENGTH
    VALIDATION --> NUMERIC
    VALIDATION --> LOWER
    VALIDATION --> UPPER
    VALIDATION --> SPECIAL
    
    FORM --> PASSWORDS
    VALIDATION --> ERROR
    PASSWORDS --> FIELDS
```

The password validation function [src/pages/settings/Settings.tsx:57-86]() enforces security requirements and provides specific error messages for each failed rule.

Sources: [src/pages/settings/Settings.tsx:40-109]()

#### Notification Settings
Configures system notification preferences:

- Push notifications toggle [src/pages/settings/Settings.tsx:296-305]()
- Email alerts configuration [src/pages/settings/Settings.tsx:307-316]()
- Email frequency selection [src/pages/settings/Settings.tsx:318-331]()

#### System Settings
Provides administrative controls for system-wide settings:

- Maintenance mode toggle [src/pages/settings/Settings.tsx:344-353]()
- Data backup controls [src/pages/settings/Settings.tsx:355-361]()
- API rate limiting configuration [src/pages/settings/Settings.tsx:363-376]()

### URL-Based Tab Navigation

The settings system supports deep linking to specific tabs through URL search parameters [src/pages/settings/Settings.tsx:17-23](), allowing direct navigation to specific configuration sections.

## Permission-Based Content Display

Both dashboard and administrative interfaces implement role-based content filtering through the permission system:

```mermaid
graph TB
    subgraph "User Roles"
        ADMIN[admin]
        DEVELOPER[developer]
        GUEST[guest]
    end
    
    subgraph "Permission Definitions"
        VIEW_ALL[view_all]
        USER_MGMT[add_edit_delete_users]
        EDIT_PROFILE[edit_profile]
    end
    
    subgraph "Content Access"
        METRICS[Dashboard Metrics]
        USER_ACTIONS[User Management]
        SETTINGS_ACCESS[Settings Access]
    end
    
    ADMIN --> VIEW_ALL
    ADMIN --> USER_MGMT
    ADMIN --> EDIT_PROFILE
    
    DEVELOPER --> VIEW_ALL
    GUEST --> VIEW_ALL
    
    VIEW_ALL --> METRICS
    USER_MGMT --> USER_ACTIONS
    EDIT_PROFILE --> SETTINGS_ACCESS
```

Sources: [src/pages/Index.tsx:80-85]()

## Integration Points

The dashboard and administration system integrates with several other system components:

- **User Context**: Provides current user information and role-based permissions [src/pages/Index.tsx:11]()
- **Profile Dropdown**: Accessible from dashboard header for account management [src/pages/Index.tsx:109]()
- **AWS Amplify**: Handles password updates in security settings [src/pages/settings/Settings.tsx:14]()
- **Toast System**: Provides user feedback for settings changes [src/pages/settings/Settings.tsx:13]()
- **React Router**: Enables navigation between dashboard sections and external pages [src/pages/Index.tsx:5]()

Sources: [src/pages/Index.tsx:1-218](), [src/pages/settings/Settings.tsx:1-387]()