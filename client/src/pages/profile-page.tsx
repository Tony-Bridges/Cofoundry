import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/layout/header";
import SidebarLeft from "@/components/layout/sidebar-left";
import SidebarRight from "@/components/layout/sidebar-right";
import MobileNav from "@/components/layout/mobile-nav";
import PostCard from "@/components/posts/post-card";
import ProfileCustomization from "@/components/profile/profile-customization";
import ProfileStyle from "@/components/profile/profile-style";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Users, 
  Star, 
  Flag, 
  Check, 
  X, 
  Plus, 
  Video, 
  Radio 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const { data: profile, isLoading: isProfileLoading } = useQuery<any>({
    queryKey: [`/api/users/${username}`],
    enabled: !!username,
  });
  
  const { data: userPosts = [], isLoading: isPostsLoading } = useQuery<any[]>({
    queryKey: [`/api/users/${username}/posts`],
    enabled: !!username,
  });
  
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      const res = await apiRequest("POST", `/api/users/${profile.id}/follow`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${username}`] });
      toast({
        title: "Success",
        description: `You are now following ${profile?.displayName}`,
      });
    },
  });
  
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      const res = await apiRequest("DELETE", `/api/users/${profile.id}/follow`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${username}`] });
      toast({
        title: "Success",
        description: `You have unfollowed ${profile?.displayName}`,
      });
    },
  });
  
  const handleFollowToggle = () => {
    if (!currentUser) return;
    
    if (profile?.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };
  
  const isLoading = isProfileLoading || isPostsLoading;
  const isOwner = currentUser?.id === profile?.id;
  
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${profile ? `profile-${profile.id}` : ''}`}>
      {profile && (
        <ProfileStyle
          id={profile.id.toString()}
          primaryColor={profile.primaryColor}
          secondaryColor={profile.secondaryColor}
          accentColor={profile.accentColor}
          customCSS={profile.customCSS}
        />
      )}
      <Header />
      
      <main className="pt-16 flex-grow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <SidebarLeft />
          
          {/* Main Content */}
          <div className="w-full md:w-3/5 px-0 md:px-6">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : profile ? (
              <>
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden profile-header">
                  <div 
                    className="h-32" 
                    style={{ 
                      background: profile.coverImage 
                        ? `url(${profile.coverImage}) center/cover no-repeat` 
                        : profile.primaryColor && profile.secondaryColor
                          ? `linear-gradient(to right, ${profile.primaryColor}, ${profile.secondaryColor})`
                          : 'linear-gradient(to right, var(--primary), #3b82f6)'
                    }}
                  ></div>
                  <div className="p-4 relative">
                    <div className="absolute -top-16 left-4">
                      <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden profile-avatar">
                        {profile.logo ? (
                          <img 
                            src={profile.logo} 
                            alt={profile.displayName} 
                            className="h-full w-full object-cover"
                          />
                        ) : profile.avatar ? (
                          <img 
                            src={profile.avatar} 
                            alt={profile.displayName} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                            <Users size={32} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-28 flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                        <div className="flex items-center">
                          <p className="text-gray-500 text-sm">@{profile.username}</p>
                          {profile.userType && (
                            <div className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                              profile.userType === 'founder' ? 'bg-blue-100 text-primary' : 
                              profile.userType === 'investor' ? 'bg-purple-100 text-purple-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)}
                            </div>
                          )}
                          {profile.isPremium && (
                            <div className="ml-2 flex items-center text-xs text-amber-600">
                              <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                              Pro
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isOwner && currentUser && (
                        <Button
                          variant={profile.isFollowing ? "outline" : "default"}
                          className={profile.isFollowing ? "mt-2 md:mt-0" : "mt-2 md:mt-0"}
                          onClick={handleFollowToggle}
                          disabled={followMutation.isPending || unfollowMutation.isPending}
                        >
                          {(followMutation.isPending || unfollowMutation.isPending) ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : profile.isFollowing ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Users className="h-4 w-4 mr-2" />
                          )}
                          {profile.isFollowing ? "Following" : "Follow"}
                        </Button>
                      )}
                    </div>
                    
                    {profile.bio && (
                      <p className="mt-4 text-gray-700">{profile.bio}</p>
                    )}
                    
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-semibold text-primary">{profile.followersCount || 0}</div>
                        <div className="text-sm text-gray-500">Followers</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-semibold text-primary">{profile.followingCount || 0}</div>
                        <div className="text-sm text-gray-500">Following</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-semibold text-primary">{userPosts.filter((p: any) => p.type === 'milestone').length}</div>
                        <div className="text-sm text-gray-500">Milestones</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Profile Content */}
                {isOwner && (
                  <div className="bg-gradient-to-r from-primary to-indigo-600 text-white p-4 mb-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Upgrade to Pro</h3>
                        <p className="text-sm text-blue-100">
                          Unlock premium features to grow your startup faster
                        </p>
                      </div>
                      <Button className="bg-white text-primary hover:bg-blue-50">
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                )}
                
                <Tabs defaultValue="posts" className="mb-6">
                  <TabsList className="w-full grid grid-cols-6">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                    <TabsTrigger value="fundraising">Fundraising</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                    {isOwner && <TabsTrigger value="customize">Customize</TabsTrigger>}
                  </TabsList>
                  
                  <TabsContent value="posts" className="mt-4">
                    {userPosts.length > 0 ? (
                      userPosts.map((post: any) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <p className="text-gray-500">No posts yet.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="milestones" className="mt-4">
                    {userPosts.filter((p: any) => p.type === 'milestone').length > 0 ? (
                      userPosts
                        .filter((p: any) => p.type === 'milestone')
                        .map((post: any) => (
                          <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <p className="text-gray-500">No milestones yet.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="fundraising" className="mt-4">
                    <Card>
                      {isOwner ? (
                        <CardContent className="py-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Fundraising Campaign</h3>
                            <Button size="sm" className="flex items-center gap-1">
                              <Plus className="h-4 w-4" />
                              Create Campaign
                            </Button>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md text-center">
                            <p className="text-gray-500 mb-2">No active fundraising campaigns</p>
                            <p className="text-sm text-gray-500">
                              Start a campaign to raise funds for your startup and share it with potential investors.
                            </p>
                          </div>
                        </CardContent>
                      ) : (
                        <CardContent className="py-8 text-center">
                          <p className="text-gray-500">No fundraising campaigns available.</p>
                        </CardContent>
                      )}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="financials" className="mt-4">
                    <Card>
                      {isOwner ? (
                        <CardContent className="py-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Financial Information</h3>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <Plus className="h-4 w-4" />
                              Add Financials
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="border rounded-md p-4">
                              <h4 className="font-medium mb-2">Capital Expenditures</h4>
                              <Button size="sm" variant="outline" className="w-full justify-start">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Capital Expenditure
                              </Button>
                            </div>
                            
                            <div className="border rounded-md p-4">
                              <h4 className="font-medium mb-2">Revenue Streams</h4>
                              <Button size="sm" variant="outline" className="w-full justify-start">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Revenue Stream
                              </Button>
                            </div>
                            
                            <div className="border rounded-md p-4">
                              <h4 className="font-medium mb-2">Operational Expenses</h4>
                              <Button size="sm" variant="outline" className="w-full justify-start">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Operational Expense
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      ) : (
                        <CardContent className="py-8 text-center">
                          <p className="text-gray-500">Financial information is private.</p>
                        </CardContent>
                      )}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="about" className="mt-4">
                    <Card className="mb-4">
                      <CardContent className="py-6">
                        <h3 className="text-lg font-medium mb-4">About {profile.displayName}</h3>
                        
                        {isOwner && (
                          <div className="bg-gray-50 p-3 rounded-md mb-4">
                            <h4 className="font-medium text-sm mb-2">Introduce yourself</h4>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex items-center">
                                <Video className="h-4 w-4 mr-1 text-red-500" />
                                Add Intro Video
                              </Button>
                              <Button size="sm" variant="outline" className="flex items-center">
                                <Radio className="h-4 w-4 mr-1 text-blue-500" />
                                Add Intro Audio
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {profile.bio ? (
                          <p className="text-gray-700">{profile.bio}</p>
                        ) : (
                          <p className="text-gray-500">No bio provided.</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {profile.userType === 'startup' && (
                      <Card>
                        <CardContent className="py-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Startup Details</h3>
                            {isOwner && (
                              <Button size="sm" variant="outline">
                                Edit Details
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                              <p className="text-gray-700">Not specified</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Founded</h4>
                              <p className="text-gray-700">Not specified</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Team Size</h4>
                              <p className="text-gray-700">Not specified</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Funding Stage</h4>
                              <p className="text-gray-700">Not specified</p>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Legal Information</h3>
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Company Type</h4>
                                <p className="text-gray-700">Not specified</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Registration Number</h4>
                                <p className="text-gray-700">Not specified</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                <p className="text-gray-700">Not specified</p>
                              </div>
                              {isOwner && (
                                <Button className="mt-2" size="sm" variant="outline">
                                  Add Registration Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  {isOwner && (
                    <TabsContent value="customize" className="mt-4">
                      <ProfileCustomization 
                        userId={profile.id}
                        initialData={{
                          primaryColor: profile.primaryColor,
                          secondaryColor: profile.secondaryColor,
                          accentColor: profile.accentColor,
                          logo: profile.logo,
                          coverImage: profile.coverImage,
                          customTheme: profile.customTheme,
                          customCSS: profile.customCSS,
                        }}
                      />
                    </TabsContent>
                  )}
                </Tabs>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">User not found.</p>
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
