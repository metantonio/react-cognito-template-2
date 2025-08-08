# Login Flow

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/pages/auth/login.tsx](/src/pages/auth/login.tsx)

</details>



## Purpose and Scope

This document covers the authentication flow for the CasinoVizion administrative panel, specifically focusing on the login process implemented in the React frontend. The login system supports both traditional email/password authentication and OAuth social login through AWS Cognito, with multi-factor authentication capabilities.

For information about user registration and signup processes, see [User Registration](./7_User_Registration.md). For password reset and update functionality, see [Password Management](./8_Password_Management.md). For OAuth provider configuration details, see [OAuth Integration](./9_OAuth_Integration.md).

## Authentication Flow Overview

The login system is implemented as a single-page component that handles multiple authentication scenarios through AWS Amplify Auth integration. The flow supports immediate sign-in, multi-factor authentication challenges, password reset requirements, and OAuth provider redirects.

```mermaid
flowchart TD
    LoginPage["Login Component<br/>(src/pages/auth/login.tsx)"] --> FormSubmit["handleSubmit()"]
    LoginPage --> OAuthRedirect["handleOAuthResponse()"]
    
    FormSubmit --> AmplifySignIn["signIn()<br/>(AWS Amplify)"]
    AmplifySignIn --> AuthResult{Authentication Result}
    
    AuthResult -->|"isSignedIn: true"| Success["Fetch User Data"]
    AuthResult -->|"nextStep required"| NextStep["handleAuthNextStep()"]
    
    Success --> GetCurrentUser["getCurrentUser()"]
    Success --> FetchSession["fetchAuthSession()"]
    Success --> FetchAttributes["fetchUserAttributes()"]
    
    GetCurrentUser --> UserContext["login()<br/>(UserContext)"]
    FetchSession --> UserContext
    FetchAttributes --> UserContext
    
    UserContext --> Navigate["navigate('/adminpanel')"]
    
    NextStep --> MFA["MFA Challenge"]
    NextStep --> PasswordReset["Password Reset Required"]
    NextStep --> SMS["SMS Verification"]
    
    MFA --> UpdatePassword["navigate('/updatepassword')"]
    PasswordReset --> UpdatePassword
    SMS --> ErrorDisplay["Error Display"]
    
    OAuthRedirect --> ParseParams["Parse URL Parameters"]
    ParseParams --> OAuthSuccess["OAuth Success Flow"]
    ParseParams --> OAuthError["OAuth Error Handling"]
```

Sources: [src/pages/auth/login.tsx:44-98](), [src/pages/auth/login.tsx:100-114](), [src/pages/auth/login.tsx:116-161]()

## Form-Based Authentication

The primary authentication method uses a traditional email/password form with validation and error handling. The form component manages local state for user inputs and integrates with AWS Amplify for authentication.

### Form State Management

The login form maintains state for user credentials and UI feedback:

| State Variable | Type | Purpose |
|----------------|------|---------|
| `email` | string | User email input |
| `password` | string | User password input |
| `isLoading` | boolean | Loading state during authentication |
| `error` | string | Error message display |
| `showPassword` | boolean | Password visibility toggle |

### Authentication Process

```mermaid
sequenceDiagram
    participant User
    participant LoginForm as "Login Form"
    participant AmplifyAuth as "AWS Amplify Auth"
    participant UserCtx as "UserContext"
    participant Router as "React Router"
    
    User->>LoginForm: Enter email/password
    User->>LoginForm: Submit form
    LoginForm->>LoginForm: handleSubmit()
    LoginForm->>AmplifyAuth: signIn(username, password)
    
    alt Successful Authentication
        AmplifyAuth-->>LoginForm: {isSignedIn: true}
        LoginForm->>AmplifyAuth: getCurrentUser()
        LoginForm->>AmplifyAuth: fetchAuthSession()
        LoginForm->>AmplifyAuth: fetchUserAttributes()
        LoginForm->>UserCtx: login(user, token, attributes)
        LoginForm->>Router: navigate('/adminpanel')
    else Authentication Challenge
        AmplifyAuth-->>LoginForm: {nextStep: challenge}
        LoginForm->>LoginForm: handleAuthNextStep()
    else Authentication Error
        AmplifyAuth-->>LoginForm: AuthError
        LoginForm->>LoginForm: Display error message
    end
```

The `handleSubmit` function performs credential validation and initiates the AWS Amplify authentication process. It handles the complete authentication flow including token retrieval and user context initialization.

Sources: [src/pages/auth/login.tsx:44-98](), [src/pages/auth/login.tsx:27-37]()

## OAuth Authentication Handling

The login component automatically processes OAuth redirects from social authentication providers (Google, Facebook, Apple) through AWS Cognito's hosted UI. This occurs when users return to the application after completing social authentication.

### OAuth Redirect Processing

```mermaid
flowchart TD
    URLParams["URL Parameters<br/>window.location.search"] --> CheckError{"error or<br/>error_description?"}
    
    CheckError -->|"Yes"| HandleError["Display OAuth Error<br/>Clear URL parameters"]
    CheckError -->|"No"| GetCurrentUser["getCurrentUser()<br/>(Check if authenticated)"]
    
    GetCurrentUser -->|"User found"| FetchTokens["fetchAuthSession()<br/>fetchUserAttributes()"]
    GetCurrentUser -->|"No user"| LogError["Log: No authenticated user"]
    
    FetchTokens --> UpdateContext["login()<br/>(UserContext)"]
    UpdateContext --> ParseState["Parse 'state' parameter"]
    
    ParseState -->|"Valid state"| CustomRedirect["navigate(returnUrl)"]
    ParseState -->|"Invalid/No state"| DefaultRedirect["navigate('/adminpanel')"]
    
    HandleError --> CleanURL["window.history.replaceState()"]
```

The OAuth flow is handled automatically through the `useEffect` hook that runs on component mount, checking for OAuth callback parameters and processing the authentication result.

Sources: [src/pages/auth/login.tsx:116-161]()

## Multi-Factor Authentication and Verification Steps

When AWS Cognito requires additional verification steps, the `handleAuthNextStep` function processes the authentication challenge and routes the user to appropriate flows.

### Authentication Challenge Types

| Challenge Type | Constant | Action |
|----------------|----------|---------|
| New Password Required | `CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED` | Navigate to `/updatepassword` |
| TOTP MFA | `CONFIRM_SIGN_IN_WITH_TOTP_CODE` | Display MFA error (not implemented) |
| SMS MFA | `CONFIRM_SIGN_IN_WITH_SMS_CODE` | Display SMS error (not implemented) |
| Default | Other values | Display generic verification error |

```mermaid
flowchart TD
    AuthChallenge["AuthNextSignInStep"] --> SwitchStep{"nextStep.signInStep"}
    
    SwitchStep -->|"NEW_PASSWORD_REQUIRED"| PasswordUpdate["navigate('/updatepassword')<br/>state: {email}"]
    SwitchStep -->|"TOTP_CODE"| TOTPError["setError('MFA code required')"]
    SwitchStep -->|"SMS_CODE"| SMSError["setError('SMS verification required')"]
    SwitchStep -->|"Default"| GenericError["setError('Additional verification required')"]
```

Sources: [src/pages/auth/login.tsx:100-114]()

## Error Handling and User Feedback

The login component implements comprehensive error handling for various authentication failure scenarios, providing specific user feedback and recovery options.

### Error Classification and Response

```mermaid
flowchart TD
    AuthError["AuthError from AWS Amplify"] --> ErrorType{"authError.name"}
    
    ErrorType -->|"UserNotFoundException"| UserNotFound["Show SignUp Dialog"]
    ErrorType -->|"NotAuthorizedException"| InvalidCreds["Show SignUp Dialog"]
    ErrorType -->|"NewPasswordRequired"| PasswordRequired["navigate('/updatepassword')"]
    ErrorType -->|"Generic Error"| GenericError["Display error message"]
    ErrorType -->|"Unknown"| UnknownError["Display 'Unknown error occurred'"]
    
    UserNotFound --> Dialog["AlertDialog Component<br/>Account not found message"]
    InvalidCreds --> Dialog
    
    PasswordRequired --> UpdatePage["UpdatePassword Page<br/>with email state"]
```

The error handling system distinguishes between different AWS Cognito error types and provides contextual responses. The `showSignUpDialog` state controls the display of an alert dialog for authentication failures.

Sources: [src/pages/auth/login.tsx:83-97](), [src/pages/auth/login.tsx:187-200]()

## Session Management and Navigation

Upon successful authentication, the login component establishes the user session through the UserContext and performs appropriate navigation based on the authentication result and any redirect parameters.

### Session Initialization Flow

The session establishment process involves multiple AWS Amplify calls to gather complete user information:

1. `getCurrentUser()` - Retrieves basic user information
2. `fetchAuthSession()` - Gets authentication tokens including ID token
3. `fetchUserAttributes()` - Fetches user profile attributes
4. `login()` - Updates UserContext with complete user data

### Navigation Logic

```mermaid
flowchart TD
    SuccessAuth["Successful Authentication"] --> TokenCheck{"ID Token exists?"}
    
    TokenCheck -->|"No"| TokenError["Throw: No ID token found"]
    TokenCheck -->|"Yes"| UpdateContext["UserContext.login()"]
    
    UpdateContext --> RedirectCheck{"enableRedirect &&<br/>redirectUrl exists?"}
    
    RedirectCheck -->|"Yes"| BuildRedirectURL["Construct OAuth redirect<br/>with JWT code"]
    RedirectCheck -->|"No"| DefaultNav["navigate('/adminpanel')"]
    
    BuildRedirectURL --> RedirectExternal["External OAuth redirect"]
    
    OAuthCallback["OAuth Callback"] --> StateParam{"state parameter<br/>exists?"}
    StateParam -->|"Yes"| ParseState["JSON.parse(state)"]
    StateParam -->|"No"| DefaultNav
    
    ParseState -->|"Valid"| CustomReturn["navigate(returnUrl)"]
    ParseState -->|"Invalid"| FallbackNav["navigate('/adminpanel/login')"]
```

Sources: [src/pages/auth/login.tsx:59-82](), [src/pages/auth/login.tsx:143-153]()