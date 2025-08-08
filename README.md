# Welcome to your Lovable project

## Documentation

- [Overview](/docs/1_Overview.md)
- [Getting Started](/docs/2_Getting_Started.md)
- [Environment Configuration](/docs/3_Environment_Configuration.md)
- [Dependencies and Tech Stack](/docs/4_Dependencies_and_Tech_Stack.md)
- [Authentication System](/docs/5_Authentication_System.md)
- [Login](/docs/6_Login_Flow.md)
- [User Registration](/docs/7_User_Registration.md)
- [Password Management](/docs/8_Password_Management.md)
- [OAuth Integration](/docs/9_OAuth_Integration.md)
- [Authentication](/docs/10_Authentication_Services.md)
- [Architecture](/docs/11_Application_Architecture.md)
- [Routing and Navigation](/docs/12_Routing_and_Navigation.md)
- [User Context and State Management](/docs/13_User_Context_and_State_Management.md)
- [User Interface](/docs/14_User_Interface_Components.md)
- [Design System](/docs/15_Design_System.md)
- [Core UI Components](/docs/16_Core_UI_Components.md)
- [App Components](/docs/17_Application_Components.md)
- [Dashboard and Administration](/docs/18_Dashboard_and_Administration.md)
- [Dashboard Overview](/docs/19_Dashboard_Overview.md)
- [Settings Management](/docs/20_Settings_Management.md)
- [User Profile](/docs/21_User_Profile.md)
- [Casino Management](/docs/22_Casino_Management.md)
- [Casino Viewwing](/docs/24_Casino_Viewing_and_Management.md)
- [Development Guide](/docs/25_Development_Guide.md)
- [Code Architecture Patterns](/docs/26_Code_Architecture_Patterns.md)
- [Build and Deployment](/docs/27_Build_and_Deployment.md)

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i
npm add --save-dev @aws-amplify/backend@latest @aws-amplify/backend-cli@latest typescript
npm install --save-dev cross-env
npm install primereact
npm i primeicons

#Step 4: Navigate to the src folder, and create the .env file from the .env.example:
```bash
cp ./src/.env.example ./src/.env
```


# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

a