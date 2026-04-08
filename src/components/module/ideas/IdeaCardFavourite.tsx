"use client";

import { useState, useEffect } from "react";
import FavouriteButton from "./FavouriteButton";
import { getUserInfo } from "@/services/auth.service";

interface IdeaCardFavouriteProps {
  ideaId: string;
  onToggle?: (isFavourited: boolean) => void;
}

export default function IdeaCardFavourite({ 
  ideaId, 
  onToggle 
}: IdeaCardFavouriteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const user = await getUserInfo();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <FavouriteButton
      ideaId={ideaId}
      isAuthenticated={isAuthenticated}
      size="sm"
      onToggle={onToggle}
    />
  );
}
