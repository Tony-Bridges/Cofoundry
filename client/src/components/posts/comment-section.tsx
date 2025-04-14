import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { Link } from "wouter";

interface CommentSectionProps {
  postId: number;
  initialVisible?: boolean;
}

export default function CommentSection({ postId, initialVisible = false }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [comment, setComment] = useState("");

  const { data: comments = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/posts/${postId}/comments`],
    enabled: isVisible,
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/posts/${postId}/comments`, { content });
      return await res.json();
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Comment added",
        description: "Your comment has been added to the post",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add comment",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    commentMutation.mutate(comment);
  };

  if (!isVisible) return null;

  return (
    <div className="px-4 pb-4">
      {/* Comment input */}
      <div className="flex gap-3 mb-4">
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.displayName} 
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Textarea 
            placeholder="Write a comment..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[60px] resize-none"
            disabled={commentMutation.isPending}
          />
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={handleSubmitComment}
              disabled={commentMutation.isPending || !comment.trim()}
            >
              {commentMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Post
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link href={`/profile/${comment.user?.username}`}>
                <a className="flex-shrink-0">
                  {comment.user?.avatar ? (
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.displayName} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                      {comment.user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </a>
              </Link>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <Link href={`/profile/${comment.user?.username}`}>
                    <a className="font-semibold text-sm hover:underline">{comment.user?.displayName}</a>
                  </Link>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1 pl-2">
                  {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}