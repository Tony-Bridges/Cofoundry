import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

export default function SidebarRight() {
  // Dummy data - this would normally be fetched from the API
  const trendingStartups = [
    { 
      id: 1, 
      name: 'NuroAI', 
      logo: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
      industry: 'AI • Healthcare' 
    },
    { 
      id: 2, 
      name: 'QuantumPay', 
      logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
      industry: 'Fintech • Web3' 
    },
    { 
      id: 3, 
      name: 'EcoSphere', 
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
      industry: 'Sustainability • IoT' 
    }
  ];
  
  const popularTags = [
    'AI', 'SaaS', 'Fintech', 'Web3', 'Sustainability', 
    'Health', 'EdTech', 'RemoteWork'
  ];
  
  return (
    <aside className="hidden md:block w-1/5 pl-6">
      <div className="sticky top-20">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Trending Startups</h3>
            
            {trendingStartups.map((startup, index) => (
              <div 
                key={startup.id} 
                className={`flex items-center py-2 ${
                  index < trendingStartups.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <img 
                  src={startup.logo} 
                  alt={`${startup.name} Logo`} 
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium">{startup.name}</div>
                  <div className="text-xs text-gray-500">{startup.industry}</div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  Follow
                </Button>
              </div>
            ))}
            
            <a href="#" className="block text-center text-primary text-sm mt-3 hover:underline">
              See More
            </a>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Discover by Tag</h3>
            
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-blue-50 hover:bg-blue-100 text-primary border-none">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Community Guidelines</h3>
            <p className="text-sm text-gray-600 mb-3">
              CoFoundry is a space where founders, startups, and investors can build in public.
            </p>
            <ul className="text-xs space-y-1.5 text-gray-600">
              <li className="flex items-center">
                <CheckIcon className="h-3.5 w-3.5 mr-2 text-green-500" />
                Be authentic and transparent
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-3.5 w-3.5 mr-2 text-green-500" />
                Share challenges and wins
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-3.5 w-3.5 mr-2 text-green-500" />
                Ask for help when needed
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-3.5 w-3.5 mr-2 text-green-500" />
                Provide constructive feedback
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
