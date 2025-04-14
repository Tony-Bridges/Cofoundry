import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface FeedFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  showLiveFilter?: boolean;
}

export default function FeedFilters({ 
  activeFilter, 
  setActiveFilter, 
  showLiveFilter = false 
}: FeedFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-lg font-semibold">Your Feed</div>
      <div className="flex flex-wrap space-x-1">
        <Button
          variant={activeFilter === "all" ? "default" : "ghost"}
          size="sm"
          className={activeFilter === "all" ? "" : "text-gray-500 hover:bg-gray-100"}
          onClick={() => setActiveFilter("all")}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "founders" ? "default" : "ghost"}
          size="sm"
          className={activeFilter === "founders" ? "" : "text-gray-500 hover:bg-gray-100"}
          onClick={() => setActiveFilter("founders")}
        >
          Founders
        </Button>
        <Button
          variant={activeFilter === "investors" ? "default" : "ghost"}
          size="sm"
          className={activeFilter === "investors" ? "" : "text-gray-500 hover:bg-gray-100"}
          onClick={() => setActiveFilter("investors")}
        >
          Investors
        </Button>
        {showLiveFilter && (
          <Button
            variant={activeFilter === "live" ? "default" : "ghost"}
            size="sm"
            className={`${activeFilter === "live" ? "" : "text-gray-500 hover:bg-gray-100"} ${
              activeFilter === "live" ? "bg-red-500 hover:bg-red-600" : ""
            }`}
            onClick={() => setActiveFilter("live")}
          >
            <Video className="h-4 w-4 mr-1" />
            Live
          </Button>
        )}
      </div>
    </div>
  );
}
