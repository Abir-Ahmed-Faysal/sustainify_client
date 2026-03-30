"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { toggleFavourite } from "@/services/favourite.service";

interface FavouriteButtonProps {
  ideaId: string;
  isFavourited?: boolean;
  isAuthenticated?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  onToggle?: (isFavourited: boolean) => void;
}

export default function FavouriteButton({
  ideaId,
  isFavourited = false,
  isAuthenticated = false,
  size = "md",
  showLabel = false,
  onToggle,
}: FavouriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFav, setIsFav] = useState(isFavourited);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await toggleFavourite({ ideaId });

      if (response.data) {
        const newStatus =
          response.data.action === "ADDED" ? true : false;
        setIsFav(newStatus);
        onToggle?.(newStatus);
      }
    } catch (err) {
      console.error("Error toggling favourite:", err);
      setError("Failed to update favourite status");
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8 p-0",
    md: "h-10 w-10 p-0",
    lg: "h-12 w-12 p-0",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="relative">
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        variant={isFav ? "default" : "outline"}
        className={`gap-2 ${isFav ? "bg-red-600 hover:bg-red-700 text-white" : ""} ${
          size === "sm" || !showLabel ? sizeClasses[size] : ""
        }`}
        title={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <>
            <Heart
              className={`${iconSizes[size]} ${
                isFav ? "fill-current" : ""
              }`}
            />
            {showLabel && <span>{isFav ? "Saved" : "Save"}</span>}
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1 absolute whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
