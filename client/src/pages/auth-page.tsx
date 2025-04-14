import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Rocket, CheckCircle, Lock, AtSign, User, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  userType: z.enum(["founder", "investor", "startup"], {
    required_error: "Please select a user type",
  }),
});

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
      email: "",
      userType: "founder",
    },
  });
  
  // Redirect if user is already logged in
  // This needs to be after the hook declarations to avoid React errors
  if (user) {
    navigate("/");
    return null;
  }

  function onLoginSubmit(data: z.infer<typeof loginSchema>) {
    loginMutation.mutate(data);
  }

  function onRegisterSubmit(data: z.infer<typeof registerSchema>) {
    registerMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="w-full md:w-1/2 px-4 py-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-accent">Co</span>
              <span className="text-primary">Foundry</span>
            </h1>
            <p className="text-gray-500 mt-2">Build loud. Build proud. Build together.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input placeholder="Enter your username" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="password" placeholder="Enter your password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input placeholder="Enter your full name" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input placeholder="Choose a username" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="email" placeholder="Enter your email" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="password" placeholder="Create a password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>I am a...</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="founder" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Founder
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="startup" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Startup
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="investor" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Investor
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="max-w-lg mx-auto my-auto p-12">
          <h2 className="text-4xl font-bold mb-6">Join the CoFoundry community</h2>
          <p className="text-lg mb-8">
            A transparent, community-first space where startup founders, builders, and investors connect, collaborate, and grow — publicly.
          </p>
          
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-0">
              <CardContent className="flex items-start p-4">
                <Rocket className="h-12 w-12 mr-4 text-accent" />
                <div>
                  <h3 className="text-xl font-semibold">Build in Public</h3>
                  <p className="text-white/80">Share your journey, milestones, and challenges with the community</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-0">
              <CardContent className="flex items-start p-4">
                <Building className="h-12 w-12 mr-4 text-accent" />
                <div>
                  <h3 className="text-xl font-semibold">Connect with Investors</h3>
                  <p className="text-white/80">Get discovered by investors looking for their next opportunity</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-0">
              <CardContent className="flex items-start p-4">
                <CheckCircle className="h-12 w-12 mr-4 text-accent" />
                <div>
                  <h3 className="text-xl font-semibold">Track Milestones</h3>
                  <p className="text-white/80">Celebrate achievements and keep stakeholders updated on your progress</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
