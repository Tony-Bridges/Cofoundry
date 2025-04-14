import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/header";
import SidebarLeft from "@/components/layout/sidebar-left";
import SidebarRight from "@/components/layout/sidebar-right";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  PencilLine, 
  Save, 
  Building,
  Mail,
  Key,
  Smartphone,
  UserPlus,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().max(160).optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  userType: z.string(),
  companyName: z.string().optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  companyRegistrationNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accountType, setAccountType] = useState("personal");
  
  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/user"],
    enabled: !!user,
  });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      username: profile?.username || "",
      bio: profile?.bio || "",
      email: profile?.email || "",
      userType: profile?.userType || "founder",
      companyName: profile?.companyName || "",
      companyWebsite: profile?.companyWebsite || "",
      companyRegistrationNumber: profile?.companyRegistrationNumber || "",
    },
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileFormValues>) => {
      const res = await apiRequest("PATCH", `/api/users/${user!.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }
  
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
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-gray-500">Manage your account preferences and profile</p>
              </div>
            </div>
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="account">
                  <Settings className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information visible to other users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : (
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                          <div className="flex flex-col items-center">
                            <Avatar className="h-24 w-24">
                              <AvatarImage src={profile?.avatar} alt={profile?.displayName} />
                              <AvatarFallback className="text-2xl">
                                {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" className="mt-4">
                              <PencilLine className="h-4 w-4 mr-2" />
                              Change Photo
                            </Button>
                          </div>
                          
                          <div className="space-y-4 flex-1">
                            <div className="grid gap-2">
                              <Label htmlFor="displayName">Display Name</Label>
                              <Input
                                id="displayName"
                                placeholder="Your display name"
                                {...form.register("displayName")}
                              />
                              {form.formState.errors.displayName && (
                                <p className="text-sm text-red-500">{form.formState.errors.displayName.message}</p>
                              )}
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                placeholder="yourusername"
                                {...form.register("username")}
                              />
                              {form.formState.errors.username && (
                                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
                              )}
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...form.register("email")}
                              />
                              {form.formState.errors.email && (
                                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                              )}
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                placeholder="Tell us about yourself in a few words"
                                className="resize-none"
                                {...form.register("bio")}
                              />
                              <p className="text-xs text-gray-500">
                                Brief description for your profile. Maximum 160 characters.
                              </p>
                              {form.formState.errors.bio && (
                                <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="userType">User Type</Label>
                            <Select 
                              onValueChange={(value) => {
                                form.setValue("userType", value);
                                setAccountType(value === "investor" ? "personal" : "business");
                              }}
                              defaultValue={profile?.userType || "founder"}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select user type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="founder">Founder</SelectItem>
                                <SelectItem value="investor">Investor</SelectItem>
                                <SelectItem value="startup">Startup</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {(form.watch("userType") === "founder" || form.watch("userType") === "startup") && (
                            <>
                              <Separator />
                              
                              <div className="grid gap-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium">Company Details</h3>
                                    <p className="text-sm text-gray-500">
                                      Information about your startup or company
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Account Type:</span>
                                    <Select value={accountType} onValueChange={setAccountType}>
                                      <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Account type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="personal">Personal</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                {accountType === "business" && (
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="companyName">Company Name</Label>
                                      <Input
                                        id="companyName"
                                        placeholder="Your company name"
                                        {...form.register("companyName")}
                                      />
                                    </div>
                                    
                                    <div className="grid gap-2">
                                      <Label htmlFor="companyWebsite">Company Website</Label>
                                      <Input
                                        id="companyWebsite"
                                        placeholder="https://example.com"
                                        {...form.register("companyWebsite")}
                                      />
                                      {form.formState.errors.companyWebsite && (
                                        <p className="text-sm text-red-500">{form.formState.errors.companyWebsite.message}</p>
                                      )}
                                    </div>
                                    
                                    <div className="grid gap-2">
                                      <Label htmlFor="companyRegistrationNumber">Company Registration Number</Label>
                                      <Input
                                        id="companyRegistrationNumber"
                                        placeholder="Registration / LLC / CK number"
                                        {...form.register("companyRegistrationNumber")}
                                      />
                                      <p className="text-xs text-gray-500">
                                        The legal registration number of your company based on your location
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={updateProfileMutation.isPending}>
                            {updateProfileMutation.isPending ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Login Information</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Email Address</p>
                              <p className="text-sm text-gray-500">{profile?.email}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Change Email</Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Password</p>
                              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Change Password</Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Connected Accounts</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Twitter</p>
                              <p className="text-sm text-gray-500">Not connected</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">LinkedIn</p>
                              <p className="text-sm text-gray-500">Not connected</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#211F1F] flex items-center justify-center text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">GitHub</p>
                              <p className="text-sm text-gray-500">Not connected</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-red-500">Danger Zone</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                          </div>
                          <Button variant="destructive" size="sm">Delete Account</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Email Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">New followers</p>
                            <p className="text-sm text-gray-500">When someone follows you</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Comments and replies</p>
                            <p className="text-sm text-gray-500">When someone comments on your posts</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Mentions</p>
                            <p className="text-sm text-gray-500">When someone mentions you</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Direct messages</p>
                            <p className="text-sm text-gray-500">When you receive a message</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-gray-500">Weekly digest of platform updates</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Push Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">All mobile push notifications</p>
                            <p className="text-sm text-gray-500">Enable or disable all mobile notifications</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Important updates</p>
                            <p className="text-sm text-gray-500">For critical platform updates</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Privacy Tab */}
              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control your data and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Profile Visibility</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Public profile</p>
                            <p className="text-sm text-gray-500">Make your profile visible to everyone</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Show email address</p>
                            <p className="text-sm text-gray-500">Display your email on your profile</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Show financial information</p>
                            <p className="text-sm text-gray-500">Make financial metrics visible to others</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Data Usage</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Personalization</p>
                            <p className="text-sm text-gray-500">Customize your experience based on your activity</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Analytics</p>
                            <p className="text-sm text-gray-500">Allow anonymous usage data collection</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Billing Tab */}
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription & Billing</CardTitle>
                    <CardDescription>
                      Manage your subscription and payment information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            {profile?.isPremium ? 'Pro Plan' : 'Free Plan'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {profile?.isPremium 
                              ? 'You are currently on the Pro plan with all premium features'
                              : 'You are currently on the Free plan with limited features'}
                          </p>
                        </div>
                        
                        {profile?.isPremium ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                            Pro
                          </Badge>
                        ) : (
                          <Button>Upgrade to Pro</Button>
                        )}
                      </div>
                      
                      {profile?.isPremium && (
                        <div className="mt-4 text-sm text-gray-500">
                          Your subscription will renew on <span className="font-medium">May 15, 2023</span>.
                        </div>
                      )}
                    </div>
                    
                    {profile?.isPremium && (
                      <>
                        <div className="space-y-4">
                          <h3 className="font-medium">Payment Information</h3>
                          
                          <div className="flex justify-between items-center p-4 border rounded-lg">
                            <div className="flex items-center">
                              <div className="h-10 w-14 bg-gray-200 rounded mr-3 flex items-center justify-center text-gray-500">
                                <CreditCard className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-gray-500">Expires 12/2025</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-medium">Billing History</h3>
                          
                          <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                  <td className="px-4 py-3 text-sm text-gray-900">Apr 15, 2023</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">$19.99</td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Paid
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right">
                                    <button className="text-primary hover:underline">Download</button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 text-sm text-gray-900">Mar 15, 2023</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">$19.99</td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Paid
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right">
                                    <button className="text-primary hover:underline">Download</button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="font-medium text-red-500">Cancel Subscription</h3>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-500">You can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
                            </div>
                            <Button variant="outline" className="text-red-500">Cancel Plan</Button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {!profile?.isPremium && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Pro Plan Benefits</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Enhanced Analytics</p>
                              <p className="text-sm text-gray-500">Detailed insights and metrics about your startup's performance</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Promotion Boosts</p>
                              <p className="text-sm text-gray-500">Get your content featured prominently across the platform</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Discovery Algorithm Access</p>
                              <p className="text-sm text-gray-500">Exclusive access to our advanced recommendation algorithm</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Investor Watering Holes</p>
                              <p className="text-sm text-gray-500">Access to exclusive investor groups and networks</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-center">
                          <Button className="w-full sm:w-auto">
                            <Star className="h-4 w-4 mr-2" />
                            Upgrade to Pro for $19.99/month
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Sidebar */}
          <SidebarRight />
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}