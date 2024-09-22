#!/bin/bash

# Navigate to the renderer folder
cd src/renderer || exit

# Create asset directories
mkdir -p assets/images
mkdir -p assets/styles
mkdir -p assets/fonts

# Create component directories
mkdir -p components/common
mkdir -p components/layout
mkdir -p components/forms

# Create page directories
mkdir -p pages/Auth
mkdir -p pages/Dashboard
mkdir -p pages/Tests
mkdir -p pages/Users
mkdir -p pages/Reports

# Create hooks directory
mkdir -p hooks

# Create context directory
mkdir -p context

# Create services directory
mkdir -p services

# Create utils directory
mkdir -p utils

# Create routes directory
mkdir -p routes

# Create main files in the renderer directory
touch App.tsx
touch index.tsx

# Create example files in the directories
# Components
touch components/common/Button.tsx
touch components/common/Modal.tsx
touch components/common/Loader.tsx

touch components/layout/Header.tsx
touch components/layout/Sidebar.tsx
touch components/layout/Footer.tsx

touch components/forms/LoginForm.tsx
touch components/forms/ScreenshotForm.tsx

# Pages
touch pages/Auth/Login.tsx
touch pages/Auth/ForgotPassword.tsx

touch pages/Dashboard/AdminDashboard.tsx
touch pages/Dashboard/INSAAdminDashboard.tsx

touch pages/Tests/TestList.tsx
touch pages/Tests/TestPage.tsx
touch pages/Tests/TestResult.tsx

touch pages/Users/UserList.tsx
touch pages/Users/UserDetail.tsx

touch pages/Reports/ReportList.tsx
touch pages/Reports/ReportDetail.tsx

# Hooks
touch hooks/useIpcRenderer.ts
touch hooks/useAuth.ts

# Context
touch context/AuthContext.tsx
touch context/UserContext.tsx
touch context/TestContext.tsx

# Services
touch services/api.ts
touch services/AuthService.ts
touch services/TestService.ts

# Utils
touch utils/dateUtils.ts
touch utils/validationUtils.ts

# Routes
touch routes/PrivateRoute.tsx
touch routes/AdminRoute.tsx
touch routes/Routes.tsx

echo "Renderer folder structure created successfully!"
