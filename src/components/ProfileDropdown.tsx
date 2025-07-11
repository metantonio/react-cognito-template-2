import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Lock } from "lucide-react";
import { useUser, UserRole } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleRoleSwitch = (role: UserRole) => {
    // Mock role switching for demo purposes
    const mockUsers = {
      admin: { id: '1', username: 'Admin User', email: 'admin@casinovizion.com', role: 'admin' as UserRole },
      developer: { id: '2', username: 'Dev User', email: 'developer@casinovizion.com', role: 'developer' as UserRole },
      guest: { id: '3', username: 'Guest User', email: 'guest@casinovizion.com', role: 'guest' as UserRole }
    };
    
    // For demo, we'll update the user context
    window.location.reload(); // Simple way to simulate role change
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'developer': return 'bg-blue-100 text-blue-800';
      case 'guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-navy-100 text-navy-600">
              {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-navy-100 text-navy-600">
                  {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{user.username}</p>
                <p className="text-xs leading-none text-gray-600 mt-1">{user.email}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoleBadgeColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {user.role === 'admin' && (
          <>
          {/* Demo role switching */}
          <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider">
            Switch Role
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleRoleSwitch('admin')} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Admin</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleSwitch('developer')} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Developer</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleSwitch('guest')} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Guest</span>
          </DropdownMenuItem>
        </>
      )}
            
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/adminpanel/settings?tab=security")}
        >
          <Lock className="mr-2 h-4 w-4" />
          <span>Reset Password</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-red-600"
          onClick={() => navigate("/adminpanel/login")}
          >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
