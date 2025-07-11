// src/components/layouts/DashboardLayout.jsx
import { AppSidebar } from "./AppSidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
