import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  ShieldAlert,
  Users,
  Flag,
  MessageSquare,
  Settings,
  Activity,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  Filter,
  Shield
} from "lucide-react";

export default function AdminPanel() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("moderation");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Only admins can access this page
  if (!user || user.role !== "admin") {
    // Redirect non-admins
    navigate("/");
    return null;
  }

  const { data: reportedPosts = [], isLoading: isReportedPostsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/reported-posts"],
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });
  
  const { data: logs = [], isLoading: isLogsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/logs"],
  });

  const filteredReports = reportedPosts.filter((report) => {
    if (filterStatus === "all") return true;
    return report.status === filterStatus;
  });

  const approveReport = (reportId: number) => {
    toast({
      title: "Report approved",
      description: "The content has been removed and the user notified.",
    });
  };

  const rejectReport = (reportId: number) => {
    toast({
      title: "Report rejected",
      description: "The content will remain visible.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="pt-16 flex-grow container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-500">Manage and moderate the CoFoundry platform.</p>
          </div>
          
          <Badge variant="outline" className="flex items-center px-3 py-1">
            <Shield className="h-4 w-4 mr-1 text-primary" />
            Admin Access
          </Badge>
        </div>
        
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="moderation" className="flex items-center">
              <ShieldAlert className="h-4 w-4 mr-2" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>
          
          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Content Moderation</h2>
                  
                  <div className="flex gap-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="filter-status">Status</Label>
                      <Select 
                        value={filterStatus} 
                        onValueChange={(value) => setFilterStatus(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Reports</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button variant="outline" size="sm" className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>
                
                {isReportedPostsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-12 border rounded-md bg-gray-50">
                    <Flag className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700">No reports found</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {filterStatus === "all" 
                        ? "There are no content reports at the moment." 
                        : `No reports with status "${filterStatus}" found.`}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Content Type</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">#{report.id}</TableCell>
                          <TableCell>{report.contentType}</TableCell>
                          <TableCell>{report.reportedBy}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.status === "pending" ? "outline" :
                                report.status === "approved" ? "default" : "secondary"
                              }
                              className={
                                report.status === "pending" ? "text-yellow-600 bg-yellow-50" :
                                report.status === "approved" ? "bg-green-100 text-green-800" :
                                "bg-red-100 text-red-800"
                              }
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(`/post/${report.contentId}`, '_blank')}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => approveReport(report.id)}
                                disabled={report.status !== "pending"}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => rejectReport(report.id)}
                                disabled={report.status !== "pending"}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search users" className="pl-10 w-[250px]" />
                    </div>
                    
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                {isUsersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 border rounded-md bg-gray-50">
                    <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700">No users found</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">#1</TableCell>
                        <TableCell>johndoe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Founder
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>April 10, 2023</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-yellow-600">
                              <ShieldAlert className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#2</TableCell>
                        <TableCell>sarahparker</TableCell>
                        <TableCell>sarah@example.com</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            Investor
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>June 5, 2023</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-yellow-600">
                              <ShieldAlert className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Tab */}
          <TabsContent value="system">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <Switch id="maintenance-mode" />
                      </div>
                      <p className="text-sm text-gray-500">
                        When enabled, the site will show a maintenance page to all users except admins.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="user-registration">User Registration</Label>
                        <Switch id="user-registration" defaultChecked />
                      </div>
                      <p className="text-sm text-gray-500">
                        Allow new users to register on the platform.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="automatic-moderation">Automatic Content Moderation</Label>
                        <Switch id="automatic-moderation" defaultChecked />
                      </div>
                      <p className="text-sm text-gray-500">
                        Automatically flag potentially inappropriate content for review.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="debug-mode">Debug Mode</Label>
                        <Switch id="debug-mode" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Enable detailed error logs and debug information.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="text-lg font-medium mb-4">API Keys</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="stripe-key">Stripe API Key</Label>
                    <div className="relative">
                      <Input id="stripe-key" type="password" value="sk_****************************************" readOnly />
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1"
                        onClick={() => {
                          toast({
                            title: "API Key Copied",
                            description: "The API key has been copied to your clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="aws-key">AWS API Key</Label>
                    <div className="relative">
                      <Input id="aws-key" type="password" value="AKIA************************" readOnly />
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1"
                        onClick={() => {
                          toast({
                            title: "API Key Copied",
                            description: "The API key has been copied to your clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="mr-2">Save Changes</Button>
                  <Button variant="outline">Reset</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">System Health</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">API Status</h3>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <p className="text-sm text-gray-600">API is responding with an average latency of 120ms</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Database</h3>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Connection pool: 5/20 active connections</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Storage</h3>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Warning</Badge>
                      </div>
                      <p className="text-sm text-gray-600">85% of allocated storage is used (8.5/10GB)</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    View Detailed Health Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">System Logs</h2>
                  
                  <div className="flex gap-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="log-level">Level</Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select log level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button variant="outline" size="sm" className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>
                
                {isLogsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="bg-black rounded-md p-4 font-mono text-sm text-white overflow-auto max-h-[500px]">
                    <div className="text-green-400">[INFO] [2025-04-14 09:32:45] User login successful: john_doe</div>
                    <div className="text-green-400">[INFO] [2025-04-14 09:33:12] Post created with ID: 423</div>
                    <div className="text-yellow-400">[WARN] [2025-04-14 09:35:27] Rate limit approached for IP: 192.168.1.105</div>
                    <div className="text-green-400">[INFO] [2025-04-14 09:40:18] Payment successful for subscription: pro_monthly, user: sarah_parker</div>
                    <div className="text-red-400">[ERROR] [2025-04-14 09:42:53] Failed to connect to external API: timeout after 5000ms</div>
                    <div className="text-green-400">[INFO] [2025-04-14 09:45:01] Comment added to post ID: 418</div>
                    <div className="text-yellow-400">[WARN] [2025-04-14 09:47:23] Content potentially violating community guidelines, ID: post_419</div>
                    <div className="text-green-400">[INFO] [2025-04-14 09:50:12] User registration completed: new_founder_2025</div>
                    <div className="text-green-400">[INFO] [2025-04-14 09:53:45] Campaign created with target: $50,000, user: tech_startup</div>
                    <div className="text-red-400">[ERROR] [2025-04-14 09:55:17] Database query timeout: SELECT * FROM users WHERE email LIKE '%example%'</div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">Download Logs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}