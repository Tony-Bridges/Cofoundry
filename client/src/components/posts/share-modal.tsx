import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Twitter, Facebook, Linkedin, Mail, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  post: {
    id: number;
    content: string;
    user?: {
      displayName?: string;
      username?: string;
    };
  };
  children: React.ReactNode;
}

export default function ShareModal({ post, children }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const postUrl = `${baseUrl}/post/${post.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast({
      title: "Link copied",
      description: "Post link has been copied to your clipboard",
    });
  };
  
  const handleShare = (platform: string) => {
    let shareUrl = "";
    const text = `Check out this post from ${post.user?.displayName || 'a user'} on CoFoundry:`;
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent('Shared post from CoFoundry')}&body=${encodeURIComponent(`${text}\n\n${postUrl}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>
            Share this post with your network or copy the link
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="social" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={() => handleShare("email")}
              >
                <Mail className="h-4 w-4 text-gray-500" />
                Email
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={postUrl}
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Post preview:</p>
              <Textarea
                readOnly
                value={`${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`}
                className="resize-none"
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCopyLink}>
            <Link className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}