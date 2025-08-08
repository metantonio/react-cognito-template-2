# Casino Management

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/pages/casinos/CreateCasino.tsx](/src/pages/casinos/CreateCasino.tsx)
- [src/pages/casinos/ViewCasino.tsx](/src/pages/casinos/ViewCasino.tsx)

</details>



This document covers the casino management functionality within the CasinoVizion administrative panel. The casino management system provides comprehensive CRUD (Create, Read, Update, Delete) operations for casino entities, including detailed information management and related sub-entities like restaurants, promotions, and hotels.

For user access control and authentication, see [Authentication System](./5_Authentication_System.md). For UI component details, see [User Interface Components](./14_User_Interface_Components.md). For casino creation workflows specifically, see [Casino Creation](./23_Casino_Creation.md). For casino viewing and data management, see [Casino Viewing and Management](./24_Casino_Viewing_and_Management.md).

## System Overview

The casino management system consists of two primary components that handle the full lifecycle of casino data within the administrative panel. The system integrates with external APIs for geolocation services and maintains relationships with sub-entities including dining establishments, promotional offers, and accommodation facilities.

```mermaid
graph TB
    subgraph "Casino Management Routes"
        CASINOS["/adminpanel/casinos/*"]
        LIST["CasinoList"]
        CREATE["CreateCasino.tsx"]
        VIEW["ViewCasino.tsx"]
        EDIT["CasinoDetails"]
    end
    
    subgraph "Data Structure"
        FORMDATA["FormData Interface"]
        CASINO["Casino Interface"]
        RESTAURANT["Restaurant Interface"]
        PROMOTION["Promotion Interface"]
        HOTEL["Hotel Interface"]
    end
    
    subgraph "External Services"
        API["Backend API /casinos/create"]
        CASINOSERVICE["getCasinos Service"]
        GMAPS["Google Maps Integration"]
    end
    
    subgraph "UI Components"
        CATDROP["CategorySubcategoryDropdowns"]
        CARDS["Card Components"]
        TABLES["Table Components"]
        FORMS["Form Components"]
    end
    
    CASINOS --> LIST
    CASINOS --> CREATE
    CASINOS --> VIEW
    CASINOS --> EDIT
    
    CREATE --> FORMDATA
    VIEW --> CASINO
    VIEW --> RESTAURANT
    VIEW --> PROMOTION
    VIEW --> HOTEL
    
    CREATE --> API
    VIEW --> CASINOSERVICE
    
    CREATE --> CATDROP
    CREATE --> FORMS
    VIEW --> CARDS
    VIEW --> TABLES
    
    CASINO -.-> GMAPS
```

Sources: [src/pages/casinos/CreateCasino.tsx:1-222](), [src/pages/casinos/ViewCasino.tsx:1-420]()

## Data Model and Interfaces

The casino management system uses several TypeScript interfaces to ensure type safety and data consistency across components.

### Core Casino Data Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `casino_id` | `string \| number` | Yes | Unique identifier |
| `casino_name` | `string` | Yes | Display name |
| `category` | `string` | Yes | Primary classification |
| `subcategories` | `string[]` | No | Secondary classifications |
| `email` | `string` | Yes | Contact email |
| `address` | `string` | No | Primary address |
| `address2` | `string` | No | Secondary address line |
| `address3` | `string` | No | Tertiary address line |
| `latitude` | `number` | No | Geographic coordinate |
| `longitude` | `number` | No | Geographic coordinate |
| `status` | `string` | Yes | Operational status |
| `description` | `string` | No | Detailed description |
| `image` | `string` | No | Image file path |

```mermaid
graph LR
    subgraph "FormData Interface (Creation)"
        NAME["name: string"]
        DESC["description: string"]
        ADDR["address: string"]
        ADDR2["address2: string"]
        ADDR3["address3: string"]
        EMAIL["email: string"]
        IMG["image: string"]
        LAT["latitude: number"]
        LONG["longitude: number"]
        CAT["category: string"]
        SUBCAT["subcategories: string[]"]
        STATUS["status: string"]
    end
    
    subgraph "Casino Interface (Display)"
        CID["casino_id: string | number"]
        CNAME["casino_name: string"]
        CCATEGORY["category: string"]
        CSUBCAT["subcategories: string[]"]
        CIMAGE["image: string"]
        CADDRESS["address: string"]
        CLAT["latitude: number"]
        CLONG["longitude: number"]
        CREATED["created_at: string"]
        CONTACT["Contact: string"]
        CEMAIL["email: string"]
        PHONE["phone: string"]
        CSTATUS["status: string"]
        CDESC["description: string"]
        TIMINGS["timings: string"]
    end
    
    subgraph "Related Entities"
        REST["restaurants: Restaurant[]"]
        PROMO["promotions: Promotion[]"]
        HOTELS["hotels: Hotel[]"]
    end
    
    FormData -.-> Casino
    Casino --> REST
    Casino --> PROMO
    Casino --> HOTELS
```

Sources: [src/pages/casinos/CreateCasino.tsx:15-28](), [src/pages/casinos/ViewCasino.tsx:11-30]()

## Casino Creation Workflow

The `CreateCasino` component provides a comprehensive form interface for adding new casino entities to the system. The component implements client-side validation, file upload handling, and API integration.

### Form Validation and Submission

```mermaid
graph TD
    subgraph "Form State Management"
        FORMDATA["useState<FormData>"]
        IMAGEFILE["useState<File | null>"]
        HANDLEINPUT["handleInput Function"]
        CATCHANGE["handleCategoryChange"]
        SUBCHANGE["handleSubcategoriesChange"]
    end
    
    subgraph "Validation Process"
        REQUIRED["Required Field Check"]
        NAME_VAL["name validation"]
        EMAIL_VAL["email validation"]
        CAT_VAL["category validation"]
        STATUS_VAL["status validation"]
    end
    
    subgraph "API Submission"
        FORMDATA_API["FormData API Object"]
        APPEND["Append Fields and Files"]
        POST["POST /casinos/create"]
        RESPONSE["Success/Error Handling"]
    end
    
    FORMDATA --> HANDLEINPUT
    HANDLEINPUT --> CATCHANGE
    HANDLEINPUT --> SUBCHANGE
    
    HANDLEINPUT --> REQUIRED
    REQUIRED --> NAME_VAL
    REQUIRED --> EMAIL_VAL
    REQUIRED --> CAT_VAL
    REQUIRED --> STATUS_VAL
    
    NAME_VAL --> FORMDATA_API
    EMAIL_VAL --> FORMDATA_API
    CAT_VAL --> FORMDATA_API
    STATUS_VAL --> FORMDATA_API
    IMAGEFILE --> APPEND
    FORMDATA_API --> APPEND
    APPEND --> POST
    POST --> RESPONSE
```

The validation logic ensures all required fields are populated before submission:

- `name`: Casino display name (required)
- `email`: Contact email address (required)  
- `category`: Primary classification (required)
- `status`: Operational status from predefined options (required)

Sources: [src/pages/casinos/CreateCasino.tsx:60-90](), [src/pages/casinos/CreateCasino.tsx:48-58]()

### Category and Subcategory Management

The creation form integrates with the `CategorySubcategoryDropdowns` component to provide hierarchical classification selection. This component maintains the relationship between primary categories and their associated subcategories.

Sources: [src/pages/casinos/CreateCasino.tsx:138-143](), [src/pages/casinos/CreateCasino.tsx:52-58]()

## Casino Viewing and Management

The `ViewCasino` component provides a comprehensive interface for displaying casino information and managing related entities. The component uses a tabbed interface to organize different aspects of casino data.

### Data Fetching and Display

```mermaid
graph TD
    subgraph "Component Lifecycle"
        PARAMS["useParams casinoId"]
        EFFECT["useEffect fetchCasino"]
        LOADING["useState loading"]
        CASINODATA["useState casinoData"]
    end
    
    subgraph "Data Service Layer"
        GETCASINOS["getCasinos Service"]
        FIND["Array.find by casino_id"]
        TRANSFORM["Data Transformation"]
        IMAGEURL["Image URL Construction"]
    end
    
    subgraph "Tab Management"
        ACTIVETAB["useState activeTab"]
        TABCLICK["handleTabClick"]
        SCROLL["Auto-scroll to Section"]
        REFS["useRef for Sections"]
    end
    
    subgraph "Related Data"
        RESTAURANTS["useState restaurants"]
        PROMOTIONS["useState promotions"]
        HOTELS["useState hotels"]
    end
    
    PARAMS --> EFFECT
    EFFECT --> GETCASINOS
    GETCASINOS --> FIND
    FIND --> TRANSFORM
    TRANSFORM --> IMAGEURL
    TRANSFORM --> CASINODATA
    
    TABCLICK --> ACTIVETAB
    ACTIVETAB --> SCROLL
    SCROLL --> REFS
    
    TRANSFORM --> RESTAURANTS
    TRANSFORM --> PROMOTIONS
    TRANSFORM --> HOTELS
```

Sources: [src/pages/casinos/ViewCasino.tsx:67-104](), [src/pages/casinos/ViewCasino.tsx:121-123]()

### Tabbed Interface Architecture

The viewing component implements a dynamic tabbed interface that allows users to navigate between different casino-related data sections:

| Tab | Purpose | Components | Status |
|-----|---------|------------|---------|
| Default | Casino info and location | Cards, Badges | Always visible |
| `restaurants` | Dining establishments | Table, action buttons | Dynamic |
| `promotions` | Marketing campaigns | Table, status badges | Dynamic |
| `hotels` | Accommodation facilities | Table, rating displays | Dynamic |

```mermaid
graph LR
    subgraph "Tab Navigation"
        HEADER["Header Tab Buttons"]
        RESTAURANTS_BTN["Restaurants Button"]
        PROMOTIONS_BTN["Promotions Button"]
        HOTELS_BTN["Hotels Button"]
    end
    
    subgraph "Content Sections"
        INFO["Casino Information Card"]
        LOCATION["Location Card"]
        REST_SECTION["Restaurants Section"]
        PROMO_SECTION["Promotions Section"]
        HOTEL_SECTION["Hotels Section"]
    end
    
    subgraph "Table Components"
        REST_TABLE["Restaurant Table"]
        PROMO_TABLE["Promotion Table"]
        HOTEL_TABLE["Hotel Table"]
    end
    
    RESTAURANTS_BTN --> REST_SECTION
    PROMOTIONS_BTN --> PROMO_SECTION
    HOTELS_BTN --> HOTEL_SECTION
    
    REST_SECTION --> REST_TABLE
    PROMO_SECTION --> PROMO_TABLE
    HOTEL_SECTION --> HOTEL_TABLE
    
    INFO -.-> LOCATION
```

Sources: [src/pages/casinos/ViewCasino.tsx:147-166](), [src/pages/casinos/ViewCasino.tsx:253-414]()

## API Integration

The casino management system integrates with backend services through RESTful API endpoints and service abstractions.

### Environment Configuration

The system uses environment variables to configure API endpoints:

- `VITE_API_BASE`: Base URL for casino management API (defaults to `http://localhost:5000/api/`)

### Service Methods

| Service | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| Create | `POST` | `/casinos/create` | Add new casino |
| Read | `GET` | via `getCasinos()` | Fetch casino data |
| Update | `PUT` | `/casinos/${id}/edit` | Modify casino |
| Delete | `DELETE` | Not implemented | Remove casino |

```mermaid
graph LR
    subgraph "Frontend Components"
        CREATE["CreateCasino"]
        VIEW["ViewCasino"]
        EDIT["CasinoDetails"]
    end
    
    subgraph "Service Layer"
        GETCASINOS["getCasinos()"]
        CREATEAPI["fetch /casinos/create"]
    end
    
    subgraph "Backend Endpoints"
        CREATE_EP["/api/casinos/create"]
        LIST_EP["/api/casinos"]
        EDIT_EP["/api/casinos/:id/edit"]
    end
    
    CREATE --> CREATEAPI
    VIEW --> GETCASINOS
    
    CREATEAPI --> CREATE_EP
    GETCASINOS --> LIST_EP
    EDIT -.-> EDIT_EP
```

Sources: [src/pages/casinos/CreateCasino.tsx:13](), [src/pages/casinos/CreateCasino.tsx:78-81](), [src/pages/casinos/ViewCasino.tsx:9](), [src/pages/casinos/ViewCasino.tsx:71]()

## Related Entity Management

The casino management system provides interfaces for managing related entities including restaurants, promotions, and hotels. These entities are displayed in tabular format with action buttons for CRUD operations.

### Entity Data Structures

Each related entity follows a consistent interface pattern:

- **Restaurant**: `id`, `name`, `cuisine`, `rating`
- **Promotion**: `id`, `title`, `description`, `status` 
- **Hotel**: `id`, `name`, `rooms`, `rating`

The table implementations include edit and delete action buttons, though the actual CRUD functionality for these entities is not yet implemented in the current codebase.

Sources: [src/pages/casinos/ViewCasino.tsx:32-51](), [src/pages/casinos/ViewCasino.tsx:267-410]()