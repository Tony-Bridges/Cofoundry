import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Compass, 
  Bell, 
  MessageSquare, 
  Plus, 
  User, 
  LogOut, 
  Settings, 
  Search,
  Video,
  UserPlus,
  LogIn
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm fixed w-full z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-primary font-bold text-2xl">
            <span className="text-accent">Co</span>Foundry
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search startups, founders, ideas..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full w-64 text-sm"
            />
          </div>
          
          <nav className="flex space-x-1">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-md ${location === '/' ? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Compass className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md text-gray-700 hover:bg-gray-100 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!user}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md text-gray-700 hover:bg-gray-100 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!user}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-md text-red-500 hover:bg-red-50"
            >
              <Video className="h-5 w-5" />
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center">
          {user ? (
            <>
              <Button variant="default" size="sm" className="hidden md:flex items-center mr-3">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="h-8 w-8 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center p-2">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary rounded-full flex items-center justify-center text-white">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href={`/profile/${user.username}`}>
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center">
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="default" size="sm" className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Sign Up</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
