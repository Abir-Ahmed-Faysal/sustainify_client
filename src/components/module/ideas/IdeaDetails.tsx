"use client";

import { IIdea } from "@/types/idea.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  ThumbsDown,
  ThumbsUp,
  Lock,
  Globe,
  X,
  Briefcase,
  Share2,
} from "lucide-react";
import { isValidImageUrl, getPlaceholderGradient } from "@/lib/imageUtils";
import { useState, useMemo, useEffect } from "react";

interface IdeaDetailsProps {
  idea: IIdea;
  isAuthor: boolean;
  hasUserUpvoted: boolean;
  hasUserDownvoted: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
  onRemoveVote: () => void;
  isFavourited?: boolean;
  userHasAccess?: boolean; // For paid ideas
  onToggleFavourite?: () => void;
  isLoadingVote?: boolean;
  isLoadingFavourite?: boolean;
  hideAuthorInfo?: boolean;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "zoro carbon1":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    Energy:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    Waste: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    Transportation:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    Water: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
    Biodiversity:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  };
  return (
    colors[category] ||
    "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100"
  );
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    APPROVED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    DRAFT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    UNDER_REVIEW:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  };
  return (
    colors[status] ||
    "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100"
  );
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    APPROVED: "Approved",
    DRAFT: "Draft",
    REJECTED: "Rejected",
    UNDER_REVIEW: "Under Review",
  };
  return labels[status] || status;
};

export default function IdeaDetails({
  idea,
  isAuthor,
  hasUserUpvoted,
  hasUserDownvoted,
  onUpvote,
  onDownvote,
  onRemoveVote,
  isFavourited = false,
  onToggleFavourite,
  isLoadingVote = false,
  isLoadingFavourite = false,
  userHasAccess = true,
  hideAuthorInfo = false,
}: IdeaDetailsProps) {
  const placeholderGradient = getPlaceholderGradient(idea.id);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        setCurrentUrl(window.location.href);
      });
    }
  }, []);

  // Collect all images (main cover + attachments)
  const allImages = useMemo(() => {
    const images = [];
    if (idea.image && isValidImageUrl(idea.image)) {
      images.push(idea.image);
    }
    if (idea.attachments && Array.isArray(idea.attachments)) {
      idea.attachments.forEach((url) => {
        if (url && isValidImageUrl(url) && url !== idea.image) {
          images.push(url);
        }
      });
    }
    return images;
  }, [idea.image, idea.attachments]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Derive active image: if selected is invalid, fallback to first image
  const activeImage =
    selectedImage && allImages.includes(selectedImage)
      ? selectedImage
      : allImages[0] || "";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(idea.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Back Button */}
      <Link
        href="/ideas"
        className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-8 w-fit transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Ideas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Images Gallery */}
          <div className="mb-8 space-y-4">
            {activeImage ? (
              <>
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                  <Image
                    src={activeImage}
                    alt={idea.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100%, 768px"
                    className="object-cover transition-all duration-300"
                  />
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 ${
                          activeImage === img
                            ? "border-emerald-500 scale-105 shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${idea.title} - ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div
                className={`w-full h-80 rounded-2xl bg-gradient-to-br ${placeholderGradient} flex items-center justify-center shadow-inner`}
              >
                <Heart className="w-16 h-16 text-emerald-600/30 dark:text-emerald-400/30" />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <Badge
                className={`${getCategoryColor(idea.category.name)} border-none px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider`}
              >
                {idea.category.name}
              </Badge>
              {idea.isPaid && (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100 border-none px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Paid Idea
                </Badge>
              )}
              {isAuthor && (
                <Badge
                  className={`${getStatusColor(idea.status)} border-none px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider`}
                >
                  {getStatusLabel(idea.status)}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {idea.title}
            </h1>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-emerald-500 pl-4">
                The Problem
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {idea.problemStatement}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-l-4 border-emerald-500 pl-4">
                Full Description
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {idea.description}
              </p>
            </section>

            {userHasAccess ? (
              <section className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
                <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Proposed Solution
                </h2>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                  {idea.solution}
                </p>
              </section>
            ) : (
              idea.isPaid && (
                <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                  <Lock className="w-10 h-10 text-slate-400" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">Solution is Locked</h3>
                    <p className="text-slate-500 text-sm max-w-xs">
                      Purchase this high-impact idea to reveal the complete
                      proposed solution and implementation details.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voting Card */}
          <Card className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                    Impact Score
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {idea.positiveRatio}%
                  </p>
                </div>
                <Button
                  onClick={onToggleFavourite}
                  variant="ghost"
                  size="icon"
                  disabled={isLoadingFavourite}
                  className={`rounded-full h-12 w-12 border ${
                    isFavourited
                      ? "bg-red-50 text-red-500 border-red-100 dark:bg-red-900/20 dark:border-red-900/50 hover:bg-red-100"
                      : "text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                  } transition-all`}
                >
                  <Heart
                    className={`size-6 ${isFavourited ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={onUpvote}
                    disabled={isLoadingVote}
                    className={`flex-1 h-12 rounded-2xl gap-2 font-bold transition-all ${
                      hasUserUpvoted
                        ? "bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white"
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    {idea.totalUpVotes}
                  </Button>
                  <Button
                    onClick={onDownvote}
                    disabled={isLoadingVote}
                    className={`flex-1 h-12 rounded-2xl gap-2 font-bold transition-all ${
                      hasUserDownvoted
                        ? "bg-red-600 text-white shadow-lg ring-2 ring-red-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    {idea.totalDownVotes}
                  </Button>
                </div>
                {(hasUserUpvoted || hasUserDownvoted) && (
                  <Button
                    onClick={onRemoveVote}
                    variant="ghost"
                    size="sm"
                    className="w-full text-slate-400 hover:text-red-500 text-xs"
                  >
                    Remove my vote
                  </Button>
                )}
              </div>


              <hr className="border-slate-100 dark:border-slate-800" />

              {!hideAuthorInfo && (
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Contributed by
                  </p>
                  {idea.author ? (
                    <Link
                      href={`/profile/${idea.author.id}`}
                      className="group flex items-center gap-3"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-emerald-500/50 transition-all">
                        <AvatarImage src={idea.author.profile?.avatar} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                          {idea.author.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {idea.author.name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-500">{idea.createdAt}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="group flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-transparent bg-slate-100 dark:bg-slate-900">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">?
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Unknown</p>
                        <p className="text-xs text-slate-500">{idea.createdAt}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {idea.isPaid && idea.price && !userHasAccess && (
                <div className="pt-4">
                  <Button className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 font-extrabold text-lg gap-2 shadow-xl hover:scale-[1.02] transition-transform">
                    Unlock for ${idea.price.toFixed(2)}
                  </Button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-tight">
                    One-time payment for lifetime access
                  </p>
                </div>
              )}

              {/* Social Sharing */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Share2 className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Share this Idea
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center h-10 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </a>
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center h-10 rounded-xl bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all"
                  >
                    <Briefcase className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
