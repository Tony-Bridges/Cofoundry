import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Image, 
  Video as VideoIcon, 
  Flag, 
  Flame, 
  X, 
  Video,
  Radio 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const postSchema = z.object({
  content: z.string().min(1, "Post content is required"),
  type: z.enum(["regular", "milestone", "sos", "launch", "live"]),
  pressureGauge: z.number().min(1).max(10).optional(),
  milestoneTitle: z.string().optional(),
  milestoneDate: z.string().optional(),
  launchTitle: z.string().optional(),
  launchUrl: z.string().url().optional(),
  mediaUrl: z.string().optional(),
  liveTitle: z.string().optional(),
  liveDescription: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function CreatePost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState<"regular" | "milestone" | "sos" | "launch" | "live">("regular");
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      type: "regular",
      pressureGauge: 5,
    },
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const res = await apiRequest("POST", "/api/posts", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setOpen(false);
      form.reset();
      toast({
        title: "Post created",
        description: "Your post has been shared successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: PostFormValues) {
    createPostMutation.mutate(data);
  }
  
  if (!user) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Input 
                placeholder="Share an update or milestone..." 
                className="bg-gray-100 rounded-full py-2 px-4 cursor-pointer"
                readOnly
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create a post</DialogTitle>
                <DialogDescription>
                  Share your journey with the CoFoundry community
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      type="button"
                      variant={postType === "regular" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPostType("regular");
                        form.setValue("type", "regular");
                      }}
                    >
                      Regular
                    </Button>
                    <Button
                      type="button"
                      variant={postType === "milestone" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPostType("milestone");
                        form.setValue("type", "milestone");
                      }}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Milestone
                    </Button>
                    <Button
                      type="button"
                      variant={postType === "sos" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPostType("sos");
                        form.setValue("type", "sos");
                      }}
                    >
                      <Flame className="h-4 w-4 mr-1" />
                      SOS Flare
                    </Button>
                    <Button
                      type="button"
                      variant={postType === "launch" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPostType("launch");
                        form.setValue("type", "launch");
                      }}
                    >
                      Launch
                    </Button>
                    <Button
                      type="button"
                      variant={postType === "live" ? "default" : "outline"}
                      size="sm"
                      className={postType === "live" ? "bg-red-500 hover:bg-red-600" : ""}
                      onClick={() => {
                        setPostType("live");
                        form.setValue("type", "live");
                      }}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Go Live
                    </Button>
                  </div>
                  
                  {postType !== "live" && (
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="What's on your mind?"
                              className="min-h-32 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {postType === "milestone" && (
                    <>
                      <FormField
                        control={form.control}
                        name="milestoneTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Milestone Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 1,000 Users Milestone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="milestoneDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Achieved</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  {postType === "sos" && (
                    <FormField
                      control={form.control}
                      name="pressureGauge"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Pressure Gauge: {value}/10</FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              defaultValue={[value || 5]}
                              onValueChange={(vals) => onChange(vals[0])}
                              className="py-4"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {postType === "launch" && (
                    <>
                      <FormField
                        control={form.control}
                        name="launchTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Launch Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Launching Our Beta Version" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="launchUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Launch URL (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-product.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {postType === "live" && (
                    <>
                      <FormField
                        control={form.control}
                        name="liveTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stream Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Monthly Demo Day" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="liveDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stream Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what you'll be sharing in your stream..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Announcement (optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add a message to announce your stream..."
                                className="min-h-24 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-sm text-red-800 flex items-center">
                          <Radio className="h-4 w-4 mr-2 text-red-500" />
                          You'll be prompted to grant camera and microphone permissions
                        </p>
                      </div>
                    </>
                  )}
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPostMutation.isPending}
                      className={postType === "live" ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                      {createPostMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {postType === "live" ? "Starting Stream..." : "Posting..."}
                        </>
                      ) : (
                        postType === "live" ? "Go Live" : "Post"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-wrap mt-3 border-t pt-3 text-sm">
          <button className="flex items-center justify-center w-1/5 text-gray-500 hover:text-primary">
            <Image className="h-4 w-4 mr-1" />
            Photo
          </button>
          <button className="flex items-center justify-center w-1/5 text-gray-500 hover:text-primary">
            <VideoIcon className="h-4 w-4 mr-1" />
            Video
          </button>
          <button className="flex items-center justify-center w-1/5 text-gray-500 hover:text-primary">
            <Flag className="h-4 w-4 mr-1" />
            Milestone
          </button>
          <button className="flex items-center justify-center w-1/5 text-gray-500 hover:text-primary">
            <Flame className="h-4 w-4 mr-1" />
            Flare
          </button>
          <button className="flex items-center justify-center w-1/5 text-gray-500 hover:text-red-500">
            <Video className="h-4 w-4 mr-1" />
            Live
          </button>
        </div>
      </div>
    </div>
  );
}
