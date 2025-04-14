import Header from "@/components/layout/header";
import SidebarLeft from "@/components/layout/sidebar-left";
import SidebarRight from "@/components/layout/sidebar-right";
import MobileNav from "@/components/layout/mobile-nav";
import CreatePost from "@/components/posts/create-post";
import FeedFilters from "@/components/posts/feed-filters";
import PostCard from "@/components/posts/post-card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, UserPlus, Video } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [postsPage, setPostsPage] = useState(1);
  const postsPerPage = 5;
  
  const { data: posts = [], isLoading, isFetching } = useQuery<any[]>({
    queryKey: ["/api/posts", { limit: postsPerPage * postsPage }],
  });
  
  // Filter posts based on the active filter
  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "founders") return post.user?.userType === "founder";
    if (activeFilter === "investors") return post.user?.userType === "investor";
    if (activeFilter === "live") return post.type === "live";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="pt-16 flex-grow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <SidebarLeft />
          
          {/* Main Content / Feed */}
          <div className="w-full md:w-3/5 px-0 md:px-6">
            {!user && (
              <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
                <div className="text-center py-4">
                  <h2 className="text-xl font-bold mb-2">Welcome to CoFoundry</h2>
                  <p className="text-gray-600 mb-4">
                    Join the community of founders, startups, and investors building in public.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Link href="/auth">
                      <Button className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Log In
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button variant="outline" className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {user && <CreatePost />}
            
            {/* Live Streams Section */}
            {activeFilter === "all" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Live Streams</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="overflow-hidden">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        LIVE
                      </div>
                      <img 
                        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=250&q=80" 
                        alt="Live Pitch Event"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium">Demo Day: AI Startups Pitch</h4>
                      <p className="text-xs text-gray-500 mt-1">Sarah Chen • 45 viewers</p>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        LIVE
                      </div>
                      <img 
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=250&q=80" 
                        alt="Founder AMA"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium">Founder AMA: Scaling Challenges</h4>
                      <p className="text-xs text-gray-500 mt-1">Michael Wong • 27 viewers</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveFilter("live")}
                    className="text-primary"
                  >
                    <Video className="h-4 w-4 mr-1" />
                    View All Live Streams
                  </Button>
                </div>
              </div>
            )}
            
            <FeedFilters 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              showLiveFilter={true}
            />
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <>
                {filteredPosts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {filteredPosts.length >= postsPerPage * postsPage && (
                  <div className="text-center py-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setPostsPage(p => p + 1)}
                      disabled={isFetching}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No posts to display.</p>
                {user && (
                  <p className="text-sm mt-2">
                    Be the first to share an update or milestone!
                  </p>
                )}
                {!user && activeFilter === "live" && (
                  <p className="text-sm mt-2">
                    No live streams available right now. Check back later!
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <SidebarRight />
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
