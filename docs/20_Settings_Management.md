# Settings Management

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/pages/settings/Settings.tsx](/src/pages/settings/Settings.tsx)

</details>



## Purpose and Scope

The Settings Management system provides centralized configuration for the CasinoVizion administrative panel. This system handles application preferences, user security settings, notification configurations, and system administration options through a tabbed interface. For user authentication flows, see [Authentication System](./5_Authentication_System.md). For user profile management, see [User Profile](./21_User_Profile.md).

## Settings System Architecture

The settings system is implemented as a single-page application component with tab-based navigation, managing both user preferences and system-wide configurations.

```mermaid
graph TB
    SettingsPage["Settings.tsx"]
    SettingsPage --> TabsComponent["Tabs Component"]
    SettingsPage --> SettingsState["Settings State"]
    SettingsPage --> URLParams["URL Search Params"]
    
    TabsComponent --> GeneralTab["General Settings"]
    TabsComponent --> SecurityTab["Reset Password"]
    TabsComponent --> NotificationsTab["Notifications"]
    TabsComponent --> SystemTab["System"]
    
    GeneralTab --> CompanyConfig["Company Configuration"]
    GeneralTab --> TimezoneSelect["Timezone Selection"]
    GeneralTab --> CurrencySelect["Currency Selection"]
    
    SecurityTab --> PasswordForm["Password Form"]
    PasswordForm --> AWSCognito["AWS Cognito updatePassword"]
    
    NotificationsTab --> NotificationSwitches["Notification Switches"]
    NotificationsTab --> EmailFrequency["Email Frequency"]
    
    SystemTab --> MaintenanceMode["Maintenance Mode"]
    SystemTab --> BackupControls["Backup Controls"]
    SystemTab --> APIRateLimit["API Rate Limiting"]
    
    SettingsState --> LocalStorage["Local State Management"]
    URLParams --> TabNavigation["Tab Navigation State"]
```

Sources: [src/pages/settings/Settings.tsx:1-387]()

## Tab-Based Interface Structure

The settings interface uses a four-tab layout with URL-based navigation state management. Each tab handles a specific category of settings with dedicated form controls and validation.

```mermaid
graph LR
    SettingsComponent["Settings Component"] --> TabsList["TabsList"]
    SettingsComponent --> TabsContent["TabsContent Sections"]
    
    TabsList --> GeneralTrigger["TabsTrigger: general"]
    TabsList --> SecurityTrigger["TabsTrigger: security"]
    TabsList --> NotificationsTrigger["TabsTrigger: notifications"]
    TabsList --> SystemTrigger["TabsTrigger: system"]
    
    TabsContent --> GeneralContent["TabsContent: general"]
    TabsContent --> SecurityContent["TabsContent: security"]
    TabsContent --> NotificationsContent["TabsContent: notifications"]
    TabsContent --> SystemContent["TabsContent: system"]
    
    URLSearchParams["useSearchParams"] --> TabState["activeTab state"]
    TabState --> TabNavigation["Tab Navigation Logic"]
```

Sources: [src/pages/settings/Settings.tsx:17-23](), [src/pages/settings/Settings.tsx:137-143]()

The tab navigation is synchronized with URL parameters using React Router's `useSearchParams` hook:

| Tab Value | Display Name | Purpose |
|-----------|--------------|---------|
| `general` | General | Company information, timezone, currency |
| `security` | Reset Password | Password change functionality |
| `notifications` | Notifications | Email and push notification preferences |
| `system` | System | Maintenance mode, backups, API settings |

## General Settings Management

The general settings tab manages company-wide configuration including branding, contact information, and localization preferences.

```mermaid
graph TB
    GeneralSettings["General Settings Card"] --> CompanyBranding["Company Branding"]
    GeneralSettings --> ContactInfo["Contact Information"]
    GeneralSettings --> Localization["Localization Settings"]
    
    CompanyBranding --> AvatarUpload["Avatar/Logo Upload"]
    CompanyBranding --> CompanyNameInput["Company Name Input"]
    
    ContactInfo --> AdminEmailInput["Admin Email Input"]
    
    Localization --> TimezoneSelect["Timezone Select"]
    Localization --> CurrencySelect["Currency Select"]
    
    SettingsState["settings state object"] --> CompanyNameValue["companyName: CasinoVizion"]
    SettingsState --> AdminEmailValue["adminEmail: admin@casinovizion.com"]
    SettingsState --> TimezoneValue["timezone: America/Los_Angeles"]
    SettingsState --> CurrencyValue["currency: USD"]
```

Sources: [src/pages/settings/Settings.tsx:25-34](), [src/pages/settings/Settings.tsx:146-221]()

The settings state is managed through the `handleSettingChange` function which updates the local state object:

```typescript
const handleSettingChange = (key: string, value: string | boolean) => {
  setSettings(prev => ({ ...prev, [key]: value }));
};
```

## Password Reset Functionality

The password reset system integrates with AWS Cognito's authentication service to provide secure password updates with comprehensive validation.

```mermaid
graph TB
    PasswordForm["Password Change Form"] --> OldPasswordInput["Old Password Input"]
    PasswordForm --> NewPasswordInput["New Password Input"]
    PasswordForm --> ConfirmPasswordInput["Confirm Password Input"]
    
    PasswordInputs["Password Inputs"] --> ValidationLogic["Password Validation"]
    ValidationLogic --> LengthCheck["Length >= 8 characters"]
    ValidationLogic --> NumberCheck["Contains number"]
    ValidationLogic --> LowercaseCheck["Contains lowercase"]
    ValidationLogic --> UppercaseCheck["Contains uppercase"]
    ValidationLogic --> SpecialCharCheck["Contains special character"]
    
    ValidationLogic --> MatchCheck["Passwords match validation"]
    
    UpdatePasswordButton["Update Password Button"] --> AWSAmplifyAuth["AWS Amplify updatePassword"]
    AWSAmplifyAuth --> SuccessToast["Success Toast Notification"]
    AWSAmplifyAuth --> ErrorHandling["Error Handling"]
    
    PasswordState["passwords state"] --> OldValue["old: string"]
    PasswordState --> NewValue["new: string"]
    PasswordState --> ConfirmValue["confirm: string"]
```

Sources: [src/pages/settings/Settings.tsx:40-109](), [src/pages/settings/Settings.tsx:224-285]()

The password validation function `validatePassword` enforces AWS Cognito password policy requirements:

| Requirement | Validation Rule |
|-------------|----------------|
| Minimum Length | 8 characters |
| Numbers | At least 1 digit |
| Lowercase | At least 1 lowercase letter |
| Uppercase | At least 1 uppercase letter |
| Special Characters | At least 1 special character or space |

## Notification Preferences

The notification system manages user preferences for receiving alerts and updates through multiple channels.

```mermaid
graph TB
    NotificationSettings["Notification Settings"] --> PushNotifications["Push Notifications Switch"]
    NotificationSettings --> EmailAlerts["Email Alerts Switch"]
    NotificationSettings --> EmailFrequency["Email Frequency Select"]
    
    PushNotifications --> NotificationState["notifications boolean"]
    EmailAlerts --> EmailAlertsState["emailAlerts boolean"]
    
    EmailFrequency --> FrequencyOptions["Frequency Options"]
    FrequencyOptions --> Realtime["realtime"]
    FrequencyOptions --> Hourly["hourly"]
    FrequencyOptions --> Daily["daily"]
    FrequencyOptions --> Weekly["weekly"]
    
    SwitchComponents["Switch Components"] --> HandleSettingChange["handleSettingChange function"]
    HandleSettingChange --> SettingsStateUpdate["Settings State Update"]
```

Sources: [src/pages/settings/Settings.tsx:289-334]()

The notification preferences are controlled through `Switch` components that toggle boolean values in the settings state.

## System Administration Settings

System settings provide administrative controls for maintenance operations, data management, and API configuration.

```mermaid
graph TB
    SystemSettings["System Settings"] --> MaintenanceControl["Maintenance Mode Control"]
    SystemSettings --> BackupManagement["Data Backup Management"]
    SystemSettings --> APIConfiguration["API Rate Limiting"]
    
    MaintenanceControl --> MaintenanceSwitch["Maintenance Mode Switch"]
    MaintenanceSwitch --> MaintenanceModeState["maintenanceMode boolean"]
    
    BackupManagement --> DownloadBackupBtn["Download Backup Button"]
    BackupManagement --> ScheduleBackupBtn["Schedule Backup Button"]
    
    APIConfiguration --> RateLimitSelect["API Rate Limit Select"]
    RateLimitSelect --> RateLimitOptions["Rate Limit Options"]
    RateLimitOptions --> Limit100["100 requests/hour"]
    RateLimitOptions --> Limit500["500 requests/hour"]
    RateLimitOptions --> Limit1000["1000 requests/hour"]
    RateLimitOptions --> Unlimited["Unlimited"]
```

Sources: [src/pages/settings/Settings.tsx:337-379]()

System settings include:

| Setting | Type | Purpose |
|---------|------|---------|
| Maintenance Mode | Boolean Switch | Temporarily disable system access |
| Data Backup | Action Buttons | Manual and scheduled backup operations |
| API Rate Limiting | Select Dropdown | Configure request rate limits |

## State Management and Persistence

The settings system uses local React state management with a centralized save mechanism and toast notifications for user feedback.

```mermaid
graph TB
    SettingsComponent["Settings Component"] --> SettingsState["settings useState"]
    SettingsComponent --> PasswordsState["passwords useState"]
    SettingsComponent --> ErrorState["error useState"]
    
    SettingsState --> SettingsObject["Settings Object"]
    SettingsObject --> CompanyName["companyName"]
    SettingsObject --> AdminEmail["adminEmail"]
    SettingsObject --> Timezone["timezone"]
    SettingsObject --> Currency["currency"]
    SettingsObject --> Notifications["notifications"]
    SettingsObject --> EmailAlerts["emailAlerts"]
    SettingsObject --> TwoFactorAuth["twoFactorAuth"]
    SettingsObject --> MaintenanceMode["maintenanceMode"]
    
    SaveChangesButton["Save Changes Button"] --> HandleSave["handleSave function"]
    HandleSave --> ToastNotification["Toast Success Notification"]
    
    URLSearchParams["useSearchParams"] --> TabState["activeTab state"]
    TabState --> TabPersistence["Tab State Persistence"]
```

Sources: [src/pages/settings/Settings.tsx:16-23](), [src/pages/settings/Settings.tsx:25-34](), [src/pages/settings/Settings.tsx:111-116]()

The settings persistence flow includes:
1. Local state management for immediate UI updates
2. Centralized save function with success feedback
3. URL parameter synchronization for tab navigation
4. Error handling with user-visible error messages

The `handleSave` function currently displays a success toast but would typically integrate with a backend API for persistent storage.