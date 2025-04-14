import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import SidebarLeft from "@/components/layout/sidebar-left";
import SidebarRight from "@/components/layout/sidebar-right";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, Globe, Users, Briefcase, Archive, Search, Plus, Filter, MapPin, Clock, Tag, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data for watering holes - in a real application, this would come from the API
const wateringHolesList = [
  {
    id: 1,
    name: "AI Startup Funding Network",
    description: "Network of investors focused on AI startups in early stages",
    industry: "Artificial Intelligence",
    stage: "Seed",
    minInvestment: "$50,000",
    maxInvestment: "$500,000",
    memberCount: 42,
    location: "Global",
    upcoming: "AI Pitch Night - May 15, 2023",
    organizer: {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      title: "Angel Investor & AI Enthusiast"
    },
    tags: ["AI", "Machine Learning", "Seed Stage", "B2B"],
    isExclusive: true
  },
  {
    id: 2, 
    name: "FinTech Future Fund",
    description: "Investors and mentors focused on financial technology innovations",
    industry: "FinTech",
    stage: "Series A",
    minInvestment: "$200,000",
    maxInvestment: "$2,000,000",
    memberCount: 28,
    location: "New York, London, Singapore",
    upcoming: "FinTech Regulatory Workshop - Apr 28, 2023",
    organizer: {
      id: 2,
      name: "Marcus Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "VC Partner at FinTech Capital"
    },
    tags: ["Fintech", "Blockchain", "Series A", "Finance"],
    isExclusive: false
  },
  {
    id: 3,
    name: "Sustainable Future Ventures",
    description: "Coalition of impact investors focused on sustainability and climate tech",
    industry: "CleanTech / Sustainability",
    stage: "Seed to Series B",
    minInvestment: "$100,000",
    maxInvestment: "$5,000,000",
    memberCount: 63,
    location: "Global",
    upcoming: "Climate Tech Summit - Jun 10, 2023",
    organizer: {
      id: 3,
      name: "Eleanor Green",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      title: "Impact Investor & Sustainability Advocate"
    },
    tags: ["Climate Tech", "Sustainability", "Impact Investing", "ESG"],
    isExclusive: false
  },
  {
    id: 4,
    name: "Healthcare Innovation Fund",
    description: "Specialized investors looking for disruptive healthcare solutions",
    industry: "Healthcare / MedTech",
    stage: "Series A to Series C",
    minInvestment: "$500,000",
    maxInvestment: "$10,000,000",
    memberCount: 36,
    location: "Boston, San Francisco, London",
    upcoming: "Healthcare Innovation Conference - May 8, 2023",
    organizer: {
      id: 4,
      name: "Dr. Robert Patel",
      avatar: "https://randomuser.me/api/portraits/men/89.jpg",
      title: "Managing Director, Healthcare Ventures"
    },
    tags: ["Healthcare", "Biotech", "MedTech", "Growth Stage"],
    isExclusive: true
  }
];

export default function WateringHolesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const filteredHoles = wateringHolesList.filter(hole => {
    const matchesSearch = 
      hole.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hole.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hole.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesIndustry = selectedIndustry === "all" || hole.industry.includes(selectedIndustry);
    
    return matchesSearch && matchesIndustry;
  });
  
  const handleJoinHole = (holeId: number, holeName: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join watering holes",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Request sent",
      description: `Your request to join "${holeName}" has been sent to the organizers.`,
    });
  };
  
  const handleCreateHole = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create watering holes",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Watering Hole created",
      description: "Your Investor Watering Hole has been created successfully.",
    });
    setShowCreateModal(false);
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
                <h1 className="text-2xl font-bold">Investor Watering Holes</h1>
                <p className="text-gray-500">Connect with investor groups in your industry</p>
              </div>
              
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Investor Watering Hole</DialogTitle>
                    <DialogDescription>
                      Create a dedicated space for investors with shared interests to connect with founders
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Watering Hole Name</Label>
                      <Input id="name" placeholder="E.g., AI Investment Collective" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe the focus, mission, and criteria of this investor group"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="industry">Industry Focus</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai">AI & Machine Learning</SelectItem>
                            <SelectItem value="fintech">FinTech</SelectItem>
                            <SelectItem value="cleantech">CleanTech</SelectItem>
                            <SelectItem value="health">Healthcare</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="consumer">Consumer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="stage">Investment Stage</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                            <SelectItem value="seed">Seed</SelectItem>
                            <SelectItem value="series-a">Series A</SelectItem>
                            <SelectItem value="series-b">Series B+</SelectItem>
                            <SelectItem value="growth">Growth</SelectItem>
                            <SelectItem value="all">All Stages</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="min-investment">Min Investment</Label>
                        <Input id="min-investment" placeholder="E.g., $50,000" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="max-investment">Max Investment</Label>
                        <Input id="max-investment" placeholder="E.g., $500,000" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="E.g., AI, B2B, Enterprise, SaaS" />
                      <p className="text-xs text-gray-500">Separate tags with commas</p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button onClick={handleCreateHole}>Create Watering Hole</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search watering holes, industries, or topics..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedIndustry === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedIndustry("all")}
                >
                  All
                </Button>
                <Button 
                  variant={selectedIndustry === "AI" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedIndustry("AI")}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  AI
                </Button>
                <Button 
                  variant={selectedIndustry === "FinTech" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedIndustry("FinTech")}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  FinTech
                </Button>
                <Button 
                  variant={selectedIndustry === "CleanTech" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedIndustry("CleanTech")}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  CleanTech
                </Button>
                <Button 
                  variant={selectedIndustry === "Healthcare" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedIndustry("Healthcare")}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Healthcare
                </Button>
              </div>
            </div>
            
            {/* Watering Holes List */}
            <div className="space-y-6">
              {filteredHoles.length > 0 ? (
                filteredHoles.map((hole) => (
                  <Card key={hole.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle>{hole.name}</CardTitle>
                            {hole.isExclusive && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-1">{hole.description}</CardDescription>
                        </div>
                        <Button 
                          variant={hole.isExclusive && !user?.isPremium ? "outline" : "default"}
                          onClick={() => handleJoinHole(hole.id, hole.name)}
                          disabled={hole.isExclusive && !user?.isPremium}
                        >
                          {hole.isExclusive && !user?.isPremium ? "Upgrade to Join" : "Request to Join"}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            Industry
                          </span>
                          <span className="text-sm font-medium">{hole.industry}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Stage
                          </span>
                          <span className="text-sm font-medium">{hole.stage}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Investment
                          </span>
                          <span className="text-sm font-medium">{hole.minInvestment} - {hole.maxInvestment}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Members
                          </span>
                          <span className="text-sm font-medium">{hole.memberCount} investors</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{hole.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{hole.upcoming}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {hole.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t pt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={hole.organizer.avatar} alt={hole.organizer.name} />
                          <AvatarFallback>{hole.organizer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{hole.organizer.name}</div>
                          <div className="text-xs text-gray-500">{hole.organizer.title}</div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Archive className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No watering holes found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search criteria or create a new one</p>
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