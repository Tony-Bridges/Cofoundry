import { Link, useLocation } from "wouter";
import { Home, Compass, Bell, User, Plus, Video, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-10">
      <Link href="/">
        <div className={`flex flex-col items-center justify-center px-3 py-1 ${
          location === '/' ? 'text-primary' : 'text-gray-500'
        }`}>
          <Home className="text-lg" />
          <span className="text-xs mt-1">Home</span>
        </div>
      </Link>
      
      <div className="flex flex-col items-center justify-center text-gray-500 px-3 py-1">
        <Compass className="text-lg" />
        <span className="text-xs mt-1">Discover</span>
      </div>
      
      {user ? (
        <div className="flex flex-col items-center justify-center text-gray-500 px-3 py-1">
          <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white">
            <Plus />
          </div>
        </div>
      ) : (
        <Link href="/auth">
          <div className="flex flex-col items-center justify-center text-primary px-3 py-1">
            <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white">
              <LogIn className="h-6 w-6" />
            </div>
          </div>
        </Link>
      )}
      
      <div className="flex flex-col items-center justify-center text-red-500 px-3 py-1">
        <Video className="text-lg" />
        <span className="text-xs mt-1">Live</span>
      </div>
      
      {user ? (
        <Link href={`/profile/${user.username}`}>
          <div className={`flex flex-col items-center justify-center px-3 py-1 ${
            location.startsWith('/profile') ? 'text-primary' : 'text-gray-500'
          }`}>
            <User className="text-lg" />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      ) : (
        <Link href="/auth">
          <div className={`flex flex-col items-center justify-center px-3 py-1 ${
            location.startsWith('/auth') ? 'text-primary' : 'text-gray-500'
          }`}>
            <User className="text-lg" />
            <span className="text-xs mt-1">Sign Up</span>
          </div>
        </Link>
      )}
    </nav>
  );
}
