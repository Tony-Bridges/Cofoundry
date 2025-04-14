import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building, 
  BarChart, 
  Bookmark,
  Flame,
  Rocket,
  BellRing,
  Users,
  Video,
  Compass,
  Info
} from "lucide-react";

export default function SidebarLeft() {
  const { user } = useAuth();
  
  return (
    <aside className="hidden md:block w-1/5 pr-6">
      <div className="sticky top-20">
        {user && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{user.displayName}</h3>
                  <p className="text-sm text-gray-500">{user.userType === 'founder' ? 'Founder' : user.userType === 'investor' ? 'Investor' : 'Startup'}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-semibold text-primary">0</div>
                  <div>Connections</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-semibold text-primary">0</div>
                  <div>Followers</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-semibold text-primary">0</div>
                  <div>Milestones</div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100">
              <Link href={`/profile/${user.username}`}>
                <div className="block px-4 py-3 hover:bg-gray-50 text-sm">
                  <User className="inline-block h-4 w-4 mr-3 text-gray-400" />
                  My Profile
                </div>
              </Link>
              <div className="block px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer">
                <Building className="inline-block h-4 w-4 mr-3 text-gray-400" />
                My Startup
              </div>
              <div className="block px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer">
                <BarChart className="inline-block h-4 w-4 mr-3 text-gray-400" />
                Dashboard
              </div>
              <div className="block px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer">
                <Bookmark className="inline-block h-4 w-4 mr-3 text-gray-400" />
                Saved
              </div>
            </div>
          </div>
        )}
        
        {!user && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Browse as Guest</h3>
              <p className="text-sm text-gray-500 mb-3">
                Discover the latest from the startup community without signing up.
              </p>
              <Link href="/auth">
                <Button className="w-full" size="sm">
                  Sign up to engage
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h3 className="font-semibold px-4 pt-3 pb-1">Explore</h3>
          
          <div className="flex items-center px-4 py-3 hover:bg-gray-50 border-l-4 border-primary cursor-pointer">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">FounderFlares</div>
              <div className="text-xs text-gray-500">SOS & Live Streams</div>
            </div>
          </div>
          
          <div className="flex items-center px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              <Video className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-medium">Live Streams</div>
              <div className="text-xs text-gray-500">Watch founders live</div>
            </div>
          </div>
          
          <div className="flex items-center px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Rocket className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium">BuildPublic</div>
              <div className="text-xs text-gray-500">Share your journey</div>
            </div>
          </div>
          
          <div className="flex items-center px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer">
            <div className="bg-orange-100 rounded-full p-2 mr-3">
              <BellRing className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <div className="text-sm font-medium">Launch Corner</div>
              <div className="text-xs text-gray-500">Announce & Feedback</div>
            </div>
          </div>
          
          <div className="flex items-center px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium">Connect</div>
              <div className="text-xs text-gray-500">Find co-founders</div>
            </div>
          </div>
          
          {!user && (
            <>
              <div className="flex items-center px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer">
                <div className="bg-yellow-100 rounded-full p-2 mr-3">
                  <Compass className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Discover</div>
                  <div className="text-xs text-gray-500">Browse startups</div>
                </div>
              </div>
              
              <div className="flex items-center px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <Info className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">About</div>
                  <div className="text-xs text-gray-500">How CoFoundry works</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
