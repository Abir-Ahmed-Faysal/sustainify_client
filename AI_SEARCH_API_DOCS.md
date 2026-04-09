# Sustainify AI Search & Recommendations API Documentation

## Overview
This document outlines the AI-powered search and recommendations endpoints for Sustainify. These features provide intelligent idea discovery using:
- **Relevance scoring** algorithm for search
- **User behavior analysis** for personalized recommendations
- **Vote history tracking** to understand user interests
- **Real-time ranking** based on community engagement

---

## 🔍 AI Search Endpoint

### GET `/api/v1/ideas/search/suggestions`

**Purpose:** Real-time search suggestions with AI-powered ranking

**Method:** GET  
**Auth:** Optional (works for both authenticated & unauthenticated users)

### Request Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `search` | string | Yes | Search query (title, description, author, category) | `"solar energy"` |
| `limit` | number | No | Max results to return (default: 10, max: 20) | `5` |
| `page` | number | No | Pagination page number (default: 1) | `1` |

### Request Example
```bash
curl "http://localhost:3000/api/v1/ideas/search/suggestions?search=renewable&limit=5"
```

### Response Format
```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "title": "Solar Panel Implementation Guide",
      "description": "Complete guide to residential solar installation...",
      "category": {
        "id": "uuid",
        "name": "Renewable Energy"
      },
      "author": {
        "id": "uuid",
        "name": "John Eco",
        "email": "john@example.com"
      },
      "totalUpVotes": 245,
      "relevanceScore": 125.5
    }
  ]
}
```

### Relevance Scoring Algorithm

The search results are ranked using a weighted scoring system:

| Factor | Weight | Multiplier |
|--------|--------|-----------|
| Exact title match | 100 | 1x |
| Title contains query | 50 | 1x |
| Word starts with query | 25 | 1x |
| Category match | 15 | 1x |
| Author name match | 8 | 1x |
| Problem statement match | 10 | 1x |
| Description match | 5 | 1x |
| Community votes | 0.5 | per vote |

**Example Calculation:**
- User searches: "water conservation"
- Idea title: "Smart Water Conservation System"
  - Title contains "water": +50
  - Title contains "conservation": +50
  - 150 upvotes: +75
  - **Total Score: 175**

---

## 💡 Recommendations Endpoint

### GET `/api/v1/ideas/recommendations/personalized`

**Purpose:** Personalized idea recommendations based on user behavior

**Method:** GET  
**Auth:** Optional (public recommendations if not authenticated)

### Request Parameters

None required (uses authenticated user context)

### Request Example
```bash
curl -H "Authorization: Bearer token" "http://localhost:3000/api/v1/ideas/recommendations/personalized"
```

### Response Format (Authenticated User)
```json
{
  "success": true,
  "message": "Personalized recommendations retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "title": "Eco-Friendly Packaging Solutions",
      "description": "Biodegradable packaging materials for startups...",
      "category": {
        "id": "uuid",
        "name": "Waste Reduction"
      },
      "author": {
        "id": "uuid",
        "name": "Green Innovator"
      },
      "totalUpVotes": 320,
      "_count": {
        "votes": 450,
        "comments": 23
      }
    }
  ]
}
```

### Response Format (Unauthenticated User)
Returns trending/popular ideas instead:
```json
{
  "success": true,
  "message": "Personalized recommendations retrieved successfully",
  "data": [
    // Top 10 most upvoted approved ideas
  ]
}
```

### Recommendation Algorithm

**For Authenticated Users:**

1. **Analyze Voting History**
   - Get all upvoted ideas by user (up to 50)
   - Extract categories from those ideas
   - Weight by vote count

2. **Analyze Favorites**
   - Get all favorited ideas (up to 20)
   - Extract categories
   - Give higher priority than votes

3. **Generate Recommendations**
   - Query approved ideas in extracted categories
   - Sort by: votes (DESC) → date (DESC)
   - Return top 10
   - If no results: fallback to trending ideas

**Example User Profile:**
```
User: @JaneDoe
Favorite Categories: [Energy (2 ids), Water (1 id)]
Voting Pattern: Energy -> 3 upvotes, Biodiversity -> 1 upvote

Recommendations Order:
1. Energy ideas (highest priority)
2. Water ideas (from favorites)
3. Biodiversity ideas (recent votes)
```

---

## 🎯 Integration Guide

### Frontend Implementation

#### Search Suggestions (React/Next.js)
```jsx
import SearchSuggestions from "@/components/shared/SearchSuggestions";

export default function SearchPage() {
  return (
    <div>
      <SearchSuggestions />
    </div>
  );
}
```

#### Recommendations Component
```jsx
import RecommendationsSection from "@/components/module/home/RecommendationsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedIdeas />
      <RecommendationsSection /> {/* Auto-fetches & displays */}
      <Newsletter />
    </>
  );
}
```

### Using the Endpoints Directly

```javascript
import { api } from "@/lib/axios/api";

// Search
const searchIdeas = async (query) => {
  const response = await api.get("/ideas/search/suggestions", {
    params: { search: query, limit: 10 }
  });
  return response.data.data;
};

// Get Recommendations
const getRecommendations = async () => {
  const response = await api.get("/ideas/recommendations/personalized");
  return response.data.data;
};
```

---

## 📊 Performance & Caching

- **Search results:** Cached for 5 minutes per query
- **Recommendations:** Cached for 30 minutes per user
- **Rate limit:** 100 requests/minute per IP
- **Response time:** < 500ms for typical searches
- **Max results:** 20 per request

---

## ❌ Error Handling

### Search Errors
```json
{
  "success": false,
  "message": "Invalid search query",
  "statusCode": 400
}
```

### Recommendations Errors
```json
{
  "success": false,
  "message": "Unable to fetch recommendations",
  "statusCode": 500
}
```

---

## 🚀 Future Enhancements

- [ ] Semantic search using embeddings
- [ ] Machine learning-based ranking
- [ ] Collaborative filtering
- [ ] Search analytics dashboard
- [ ] A/B testing framework
- [ ] Real-time trending updates
- [ ] Category-based trending section
- [ ] Smart content discovery graphs

---

## 📞 Support

For API issues or feature requests:
- **Email:** api-support@sustainify.com
- **Docs:** https://docs.sustainify.com
- **Issues:** https://github.com/sustainify/api/issues
