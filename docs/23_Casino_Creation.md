# Casino Creation

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/CategorySubcategoryDropdowns.tsx](/src/components/CategorySubcategoryDropdowns.tsx)
- [src/pages/casinos/CreateCasino.tsx](/src/pages/casinos/CreateCasino.tsx)

</details>



This document covers the casino creation functionality within the CasinoVizion administrative panel. It details the form-based interface, validation system, and category management components used to add new casino entries to the system.

For information about viewing and managing existing casinos, see [Casino Viewing and Management](./24_Casino_Viewing_and_Management.md). For general information about the casino management module, see [Casino Management](./22_Casino_Management.md).

## Overview

The casino creation system provides a comprehensive form interface allowing administrators to add new casino entries with detailed information including location data, categorization, and operational status. The creation process is implemented as a single-page form with real-time validation and category-based organization.

```mermaid
graph TB
    subgraph "Casino Creation Flow"
        START["User clicks Create Casino"]
        FORM["CreateCasino Component"]
        VALIDATE["Form Validation"]
        SUBMIT["API Submission"]
        SUCCESS["Success Toast & Navigation"]
        ERROR["Error Toast"]
    end
    
    subgraph "Form Components"
        BASIC["Basic Information Fields"]
        CATEGORY["CategorySubcategoryDropdowns"]
        ADDRESS["Address Fields"]
        STATUS["Status Selection"]
    end
    
    subgraph "Backend Integration"
        API["POST /casinos/create"]
        FORMDATA["FormData with File Upload"]
    end
    
    START --> FORM
    FORM --> BASIC
    FORM --> CATEGORY
    FORM --> ADDRESS
    FORM --> STATUS
    
    BASIC --> VALIDATE
    CATEGORY --> VALIDATE
    ADDRESS --> VALIDATE
    STATUS --> VALIDATE
    
    VALIDATE --> SUBMIT
    SUBMIT --> FORMDATA
    FORMDATA --> API
    
    API --> SUCCESS
    API --> ERROR
    
    SUCCESS --> END["Navigate to Casino List"]
    ERROR --> FORM
```

Sources: [src/pages/casinos/CreateCasino.tsx:1-222]()

## Form Structure and Components

The `CreateCasino` component implements a comprehensive form interface with multiple sections for different types of casino information. The form uses controlled components with a centralized state management pattern.

### Core Form Data Structure

The form manages a `FormData` interface containing all casino properties:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Casino display name |
| `description` | string | No | Detailed casino description |
| `address`, `address2`, `address3` | string | No | Multi-line address fields |
| `email` | string | Yes | Contact email address |
| `image` | string | No | Image URL or file reference |
| `latitude`, `longitude` | number | No | Geographic coordinates |
| `category` | string | Yes | Primary category code |
| `subcategories` | string[] | No | Array of subcategory codes |
| `status` | string | Yes | Operational status |

The form state is managed through the `handleInput` function which provides type-safe updates to the form data structure at [src/pages/casinos/CreateCasino.tsx:48-50]().

### Form Layout and UI Components

The creation interface uses a card-based layout with the main form content organized in a responsive grid:

```mermaid
graph TB
    subgraph "CreateCasino Layout"
        HEADER["Header with Navigation & Actions"]
        MAIN["Main Content Area"]
    end
    
    subgraph "Header Components"
        BACK["ArrowLeft Button"]
        TITLE["Page Title & Description"]
        ACTIONS["Cancel & Create Buttons"]
    end
    
    subgraph "Main Form Card"
        CARD["Card Component"]
        CARDHEADER["CardHeader with Title"]
        CARDCONTENT["CardContent with Form Fields"]
    end
    
    subgraph "Form Field Groups"
        NAME["Casino Name Input"]
        CATEGORIES["CategorySubcategoryDropdowns"]
        STATUS_SELECT["Status Select"]
        DESC["Description Textarea"]
        ADDRESSES["Address Line Inputs"]
        EMAIL["Email Input"]
    end
    
    HEADER --> BACK
    HEADER --> TITLE
    HEADER --> ACTIONS
    
    MAIN --> CARD
    CARD --> CARDHEADER
    CARD --> CARDCONTENT
    
    CARDCONTENT --> NAME
    CARDCONTENT --> CATEGORIES
    CARDCONTENT --> STATUS_SELECT
    CARDCONTENT --> DESC
    CARDCONTENT --> ADDRESSES
    CARDCONTENT --> EMAIL
```

Sources: [src/pages/casinos/CreateCasino.tsx:92-218]()

## Category and Subcategory Selection System

The category selection functionality is implemented through the `CategorySubcategoryDropdowns` component, which provides a hierarchical selection interface with dependent dropdown behavior.

### Component Architecture

```mermaid
graph TB
    subgraph "CategorySubcategoryDropdowns Component"
        COMPONENT["CategorySubcategoryDropdowns"]
        STATE["Component State"]
        EFFECTS["useEffect Hooks"]
        HANDLERS["Event Handlers"]
    end
    
    subgraph "State Management"
        CATEGORIES["categories: Category[]"]
        SUBCATEGORIES["subcategories: Subcategory[]"]
        LOADING["loading: boolean"]
    end
    
    subgraph "External Services"
        GETCAT["getCategories()"]
        GETSUB["listSubcategoriesByCategoryId()"]
    end
    
    subgraph "UI Components"
        CATSELECT["Category Select"]
        SUBMULTI["Subcategory MultiSelect"]
        BADGES["Selected Items Display"]
    end
    
    COMPONENT --> STATE
    COMPONENT --> EFFECTS
    COMPONENT --> HANDLERS
    
    STATE --> CATEGORIES
    STATE --> SUBCATEGORIES
    STATE --> LOADING
    
    EFFECTS --> GETCAT
    EFFECTS --> GETSUB
    
    HANDLERS --> CATSELECT
    HANDLERS --> SUBMULTI
    HANDLERS --> BADGES
```

### Data Flow and Service Integration

The component follows a two-stage loading pattern where categories are loaded on mount, and subcategories are loaded when a category is selected:

1. **Initial Load**: Categories are fetched using `getCategories()` service at [src/components/CategorySubcategoryDropdowns.tsx:47-63]()
2. **Category Selection**: When a category is selected, subcategories are loaded using `listSubcategoriesByCategoryId()` at [src/components/CategorySubcategoryDropdowns.tsx:66-112]()
3. **Data Transformation**: API responses are transformed from `ApiSelectOption` format to internal `Category`/`Subcategory` interfaces

### Subcategory Multi-Selection

The subcategory selection uses PrimeReact's `MultiSelect` component with extensive customization:

- **Search Functionality**: Built-in filtering with placeholder text
- **Visual Feedback**: Selected items displayed as badges below the dropdown
- **Validation**: Invalid selections are filtered when category changes
- **Loading States**: Disabled state with loading indicator during API calls

The styling configuration at [src/components/CategorySubcategoryDropdowns.tsx:213-281]() provides custom theming to match the application's design system.

Sources: [src/components/CategorySubcategoryDropdowns.tsx:1-315]()

## Validation and Submission Process

### Form Validation

The casino creation form implements client-side validation checking for required fields before submission:

```mermaid
graph TD
    subgraph "Validation Flow"
        SUBMIT["handleSave Triggered"]
        CHECK["Required Field Check"]
        VALID["Validation Passed"]
        INVALID["Show Error Toast"]
    end
    
    subgraph "Required Fields"
        NAME_REQ["formData.name"]
        EMAIL_REQ["formData.email"]
        CATEGORY_REQ["formData.category"]
        STATUS_REQ["formData.status"]
    end
    
    subgraph "Submission Process"
        FORMDATA_BUILD["Build FormData Object"]
        API_CALL["POST Request to API"]
        SUCCESS_HANDLE["Success Toast & Navigation"]
        ERROR_HANDLE["Error Toast"]
    end
    
    SUBMIT --> CHECK
    CHECK --> NAME_REQ
    CHECK --> EMAIL_REQ
    CHECK --> CATEGORY_REQ
    CHECK --> STATUS_REQ
    
    NAME_REQ --> VALID
    EMAIL_REQ --> VALID
    CATEGORY_REQ --> VALID
    STATUS_REQ --> VALID
    
    CHECK --> INVALID
    INVALID --> END_INVALID["Return Early"]
    
    VALID --> FORMDATA_BUILD
    FORMDATA_BUILD --> API_CALL
    API_CALL --> SUCCESS_HANDLE
    API_CALL --> ERROR_HANDLE
```

The validation logic at [src/pages/casinos/CreateCasino.tsx:61-64]() ensures that critical fields are populated before allowing submission.

### API Integration

The submission process constructs a `FormData` object to support file uploads and array data:

1. **Data Serialization**: Form fields are serialized with special handling for arrays and file uploads at [src/pages/casinos/CreateCasino.tsx:67-76]()
2. **API Endpoint**: Data is submitted to `${API_BASE}casinos/create` via POST request
3. **Response Handling**: Success results in navigation to the casino list, while errors display toast notifications

The API base URL is configurable through the `VITE_API_BASE` environment variable, providing flexibility for different deployment environments.

Sources: [src/pages/casinos/CreateCasino.tsx:60-90]()

## User Experience Features

### Navigation and Actions

The interface provides clear navigation controls:
- **Back Navigation**: Arrow button and cancel option return to casino list
- **Save Action**: Primary button triggers validation and submission
- **Breadcrumb Context**: Header clearly indicates the current action

### Real-time Feedback

The system provides immediate feedback through:
- **Toast Notifications**: Success and error messages using the toast hook
- **Loading States**: Visual indicators during category/subcategory loading
- **Form Validation**: Immediate validation feedback on required fields
- **Badge Display**: Real-time visualization of selected subcategories

### Responsive Design

The form layout adapts to different screen sizes using Tailwind CSS responsive classes, ensuring usability across desktop and mobile devices.

Sources: [src/pages/casinos/CreateCasino.tsx:94-118](), [src/components/CategorySubcategoryDropdowns.tsx:162-311]()