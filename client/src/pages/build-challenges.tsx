import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import SidebarLeft from "@/components/layout/sidebar-left";
import SidebarRight from "@/components/layout/sidebar-right";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ThumbsUp, MessageSquare, Share2, Users, Star, Trophy, ChevronRight, Clock, CalendarDays, CheckCircle, LockKeyhole } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data for build-in-public challenges
const challenges = [
  {
    id: 1,
    title: "Share Your MVP Journey",
    description: "Document and share the process of building your minimum viable product. Post screenshots, videos, or written updates throughout the week.",
    duration: "7 days",
    startDate: "Apr 10, 2023",
    endDate: "Apr 17, 2023",
    participants: 78,
    category: "Product Development",
    isActive: true,
    isPremium: false,
    rewards: ["Featured on homepage", "Investor introductions", "User feedback session"],
    prompt: "What's the biggest hurdle you've overcome in building your MVP so far?",
    posts: 28,
    userStatus: "not-joined"
  },
  {
    id: 2,
    title: "Financial Transparency Week",
    description: "Share your startup's financial metrics and learnings. Discuss your burn rate, growth forecasts, and financial challenges.",
    duration: "7 days",
    startDate: "Apr 17, 2023",
    endDate: "Apr 24, 2023",
    participants: 42,
    category: "Finance & Metrics",
    isActive: true,
    isPremium: true,
    rewards: ["Premium account for 1 month", "Feedback from finance experts", "Featured in newsletter"],
    prompt: "What financial metric are you focusing on improving right now?",
    posts: 16,
    userStatus: "not-joined"
  },
  {
    id: 3,
    title: "Customer Acquisition Strategies",
    description: "Document and share how you're acquiring customers. Discuss what's working, what's not, and what you've learned.",
    duration: "14 days",
    startDate: "Apr 24, 2023",
    endDate: "May 8, 2023",
    participants: 65,
    category: "Marketing & Growth",
    isActive: true,
    isPremium: false,
    rewards: ["Growth strategy review", "Featured interview", "Marketing tool credits"],
    prompt: "What's your most effective customer acquisition channel right now?",
    posts: 22,
    userStatus: "not-joined"
  },
  {
    id: 4,
    title: "Pitch Deck Evolution",
    description: "Share iterations of your pitch deck and get feedback from the community. Document how your pitch evolves over time.",
    duration: "10 days",
    startDate: "May 1, 2023",
    endDate: "May 11, 2023",
    participants: 54,
    category: "Fundraising",
    isActive: false,
    isPremium: true,
    rewards: ["Investor pitch session", "Professional pitch deck review", "Featured on investor page"],
    prompt: "What part of your pitch deck gets the most feedback?",
    posts: 0,
    userStatus: "joined",
    progress: 30
  },
  {
    id: 5,
    title: "Team Building & Culture",
    description: "Share how you're building your team and company culture. Discuss hiring practices, remote work strategies, and team dynamics.",
    duration: "7 days",
    startDate: "May 8, 2023",
    endDate: "May 15, 2023",
    participants: 36,
    category: "Team & Culture",
    isActive: false,
    isPremium: false,
    rewards: ["Culture consultation", "Team building workshop", "Featured on culture blog"],
    prompt: "What's your biggest challenge in building team culture?",
    posts: 0,
    userStatus: "not-joined"
  }
];

export default function BuildChallengesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submission, setSubmission] = useState("");
  
  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return challenge.isActive;
    if (activeTab === "joined") return challenge.userStatus === "joined";
    if (activeTab === "premium") return challenge.isPremium;
    return true;
  });
  
  const handleJoinChallenge = (challengeId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join challenges",
        variant: "destructive",
      });
      return;
    }
    
    // For premium challenges, check if user is premium
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge?.isPremium && !user.isPremium) {
      toast({
        title: "Premium challenge",
        description: "Upgrade to Pro to participate in premium challenges",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Challenge joined",
      description: "You have successfully joined the challenge!",
    });
  };
  
  const handleSubmitPost = () => {
    if (!submission.trim()) {
      toast({
        title: "Empty submission",
        description: "Please enter your build-in-public update",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Submission successful",
      description: "Your build-in-public update has been posted.",
    });
    
    setSubmission("");
    setShowSubmissionModal(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="pt-16 flex-grow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <SidebarLeft />
          
          {/* Main Content */}
          <div className="w-full md:w-3/5 px-0 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Build in Public Challenges</h1>
                <p className="text-gray-500">Weekly prompts to help you share your journey transparently</p>
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="joined">My Challenges</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Challenge Cards */}
            <div className="space-y-6">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge) => (
                  <Card key={challenge.id} className={`overflow-hidden ${
                    challenge.userStatus === 'joined' ? 'border-primary/40 shadow-sm' : ''
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle>{challenge.title}</CardTitle>
                            {challenge.isPremium && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                                Premium
                              </Badge>
                            )}
                            {challenge.isActive && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                Active
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-1">{challenge.description}</CardDescription>
                        </div>
                        
                        {challenge.userStatus === 'joined' ? (
                          <Dialog open={showSubmissionModal && selectedChallenge?.id === challenge.id} 
                            onOpenChange={(open) => {
                              setShowSubmissionModal(open);
                              if (open) setSelectedChallenge(challenge);
                            }}>
                            <DialogTrigger asChild>
                              <Button>Post Update</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Post Build-in-Public Update</DialogTitle>
                                <DialogDescription>
                                  Share your progress for the "{challenge.title}" challenge
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="bg-blue-50 p-4 rounded-md">
                                  <h4 className="text-sm font-medium text-blue-700 mb-1">Today's prompt:</h4>
                                  <p className="text-sm text-blue-600">{challenge.prompt}</p>
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="submission">Your update</Label>
                                  <Textarea 
                                    id="submission" 
                                    placeholder="Share your progress, learnings, or challenges..." 
                                    rows={5}
                                    value={submission}
                                    onChange={(e) => setSubmission(e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowSubmissionModal(false)}>Cancel</Button>
                                <Button onClick={handleSubmitPost}>Post Update</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button 
                            variant={challenge.isPremium && !user?.isPremium ? "outline" : "default"}
                            onClick={() => handleJoinChallenge(challenge.id)}
                            disabled={challenge.isPremium && !user?.isPremium}
                          >
                            {challenge.isPremium && !user?.isPremium ? (
                              <>
                                <LockKeyhole className="h-4 w-4 mr-1" />
                                Upgrade to Join
                              </>
                            ) : (
                              "Join Challenge"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Duration
                          </span>
                          <span className="text-sm font-medium">{challenge.duration}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Participants
                          </span>
                          <span className="text-sm font-medium">{challenge.participants} founders</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Dates
                          </span>
                          <span className="text-sm font-medium">{challenge.startDate} - {challenge.endDate}</span>
                        </div>
                      </div>
                      
                      {challenge.userStatus === 'joined' && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Challenge Progress</span>
                            <span className="text-xs text-gray-500">{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Rewards:</h4>
                        <ul className="space-y-1">
                          {challenge.rewards.map((reward, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {reward}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {challenge.posts > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Community Updates</h4>
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                              View All
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {challenge.posts} posts from {challenge.participants} participants
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{Math.floor(Math.random() * 50) + 10}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{Math.floor(Math.random() * 20) + 5}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                        <span>{challenge.participants} participating founders</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No challenges found</h3>
                  <p className="text-gray-500 mt-1">Check back soon for new challenges</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Sidebar */}
          <SidebarRight />
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}