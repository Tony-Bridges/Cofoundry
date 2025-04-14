import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Flag, 
  Flame, 
  Megaphone, 
  MoreHorizontal,
  Globe,
  Users,
  HandHelping,
  BarChart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CommentSection from "./comment-section";
import ShareModal from "./share-modal";

interface PostCardProps {
  post: any; // Ideally this would be more strongly typed
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (post.hasLiked) {
        const res = await apiRequest("DELETE", `/api/posts/${post.id}/likes`);
        return await res.json();
      } else {
        const res = await apiRequest("POST", `/api/posts/${post.id}/likes`);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: post.hasLiked ? "Post unliked" : "Post liked",
        description: post.hasLiked ? "You have removed your like" : "You liked this post",
      });
    },
  });
  
  const handleLikeToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }
    
    likeMutation.mutate();
  };
  
  // Format date
  const formattedDate = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) 
    : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-sm mb-6 overflow-hidden ${
      post.type === 'sos' ? 'border-2 border-red-500' : ''
    }`}>
      <div className="p-4">
        <div className="flex justify-between">
          <Link href={`/profile/${post.user?.username}`}>
            <a className="flex items-center">
              {post.user?.avatar ? (
                <img 
                  src={post.user.avatar} 
                  alt={post.user.displayName} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  {post.user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="ml-3">
                <div className="flex items-center">
                  <div className="font-semibold">{post.user?.displayName}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                    post.user?.userType === 'founder' ? 'bg-blue-100 text-primary' : 
                    post.user?.userType === 'investor' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {post.user?.userType === 'founder' ? 'Founder' : 
                     post.user?.userType === 'investor' ? 'Investor' : 'Startup'}
                  </div>
                </div>
                <div className="text-gray-500 text-xs flex items-center">
                  <span>{formattedDate}</span>
                  <span className="mx-1">•</span>
                  <Globe className="h-3 w-3" />
                </div>
              </div>
            </a>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save Post</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              {user?.id === post.user?.id && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Delete Post</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-3">
          {/* Post Type Badge */}
          {post.type === 'milestone' && (
            <div className="flex items-center mb-3">
              <div className="bg-green-600 text-white p-1 rounded">
                <Flag className="h-4 w-4" />
              </div>
              <div className="ml-2 text-green-600 font-medium">Milestone Reached!</div>
            </div>
          )}
          
          {post.type === 'sos' && (
            <div className="flex items-center mb-3">
              <div className="bg-red-500 text-white p-1 rounded">
                <Flame className="h-4 w-4" />
              </div>
              <div className="ml-2 text-red-500 font-medium">SOS FounderFlare</div>
            </div>
          )}
          
          {post.type === 'launch' && (
            <div className="flex items-center mb-3">
              <div className="bg-orange-500 text-white p-1 rounded">
                <Megaphone className="h-4 w-4" />
              </div>
              <div className="ml-2 text-orange-500 font-medium">Launch Announcement</div>
            </div>
          )}
          
          {/* Post Content */}
          <p className="text-sm">{post.content}</p>
          
          {/* Milestone Details */}
          {post.type === 'milestone' && post.milestoneTitle && (
            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold flex items-center">
                  <BarChart className="text-green-500 mr-2 h-4 w-4" />
                  {post.milestoneTitle}
                </div>
                {post.milestoneDate && (
                  <div className="text-xs text-gray-500">{post.milestoneDate}</div>
                )}
              </div>
            </div>
          )}
          
          {/* SOS Pressure Gauge */}
          {post.type === 'sos' && post.pressureGauge && (
            <div className="mt-4 flex items-center">
              <div className="mr-3 text-sm font-medium">Current Pressure:</div>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-300 to-red-500 rounded-full"
                  style={{ width: `${(post.pressureGauge / 10) * 100}%` }}
                ></div>
              </div>
              <div className="ml-2 text-sm font-bold text-red-500">{post.pressureGauge}/10</div>
            </div>
          )}
          
          {/* Launch Details */}
          {post.type === 'launch' && post.launchTitle && (
            <div className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg">
              <div className="font-bold text-lg">{post.launchTitle}</div>
              {post.launchUrl && (
                <div className="flex items-center mt-4">
                  <Button size="sm" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                    Visit
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Post Stats */}
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <button 
              className={`flex items-center hover:text-primary ${post.hasLiked ? 'text-primary' : ''}`}
              onClick={handleLikeToggle}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${post.hasLiked ? 'fill-primary' : ''}`} />
              <span>{post.likesCount || 0}</span>
            </button>
            <div className="mx-2">•</div>
            <button className="flex items-center hover:text-primary">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.commentsCount || 0} comments</span>
            </button>
          </div>
          <button className="hover:text-primary">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* SOS Help Section */}
      {post.type === 'sos' && (
        <div className="px-4 py-3 bg-red-50 text-sm">
          <div className="flex justify-between items-center">
            <div className="font-medium text-red-500">
              <Users className="h-4 w-4 inline mr-1" />
              {Math.floor(Math.random() * 20) + 1} people are trying to help
            </div>
            <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600">
              <HandHelping className="h-4 w-4 mr-1" />
              Help Out
            </Button>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="border-t px-4 py-3 flex text-sm">
        <button 
          className={`flex items-center justify-center w-1/3 ${
            post.hasLiked ? 'text-primary' : 'text-gray-500 hover:text-primary'
          }`}
          onClick={handleLikeToggle}
        >
          <ThumbsUp className={`h-4 w-4 mr-1 ${post.hasLiked ? 'fill-primary' : ''}`} />
          Like
        </button>
        <button 
          className={`flex items-center justify-center w-1/3 ${
            showComments ? 'text-primary' : 'text-gray-500 hover:text-primary'
          }`}
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className={`h-4 w-4 mr-1 ${showComments ? 'fill-primary' : ''}`} />
          Comment
        </button>
        <ShareModal post={post}>
          <button className="flex items-center justify-center w-1/3 text-gray-500 hover:text-primary">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </button>
        </ShareModal>
      </div>
      
      {/* Comment Section */}
      {showComments && (
        <div className="border-t">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  );
}
