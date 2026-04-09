# Frontend API Response Access Patterns - Complete Analysis

## Overview

This document provides a comprehensive analysis of all API calling patterns in the sustainify_client frontend. The httpClient is configured to return `ApiResponse<T>` directly (not wrapped in axios response).

### Core Response Structure
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Pagination
}

// When calling: httpClient.get<T>()
// Returns: Promise<ApiResponse<T>>
// Access: response.data gets you the T
```

---

## 1. SERVICES (/src/services/)

### access.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| checkIdeaAccess | httpClient.get | `ApiResponse<boolean>` | `response.data` | ✅ Correct | PASS |
| getMyAccessibleIdeas | httpClient.get | `ApiResponse<Array<{idea}>>` | `response.data` | ✅ Correct | PASS |
| createCheckoutSession | httpClient.post | `ApiResponse<{url}>` | returns ApiResponse directly | ✅ Correct | PASS |

### auth.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| getNewTokensWithRefreshToken | fetch() + .json() | `{data: TokenResponse}` | `const {data} = await res.json()` | ✅ Correct | PASS |
| getUserInfo | fetch() + .json() | `{data: UserInfo}` | `const {data} = await res.json()` | ✅ Correct | PASS |

### blog.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| getAllBlogs | httpClient.get | `ApiResponse<IBlog[]>` | `response.data` | ✅ Correct | PASS |
| getBlogById | httpClient.get | `ApiResponse<IBlog\|null>` | `response.data` | ✅ Correct | PASS |
| getBlogBySlug | httpClient.get | `ApiResponse<IBlog\|null>` | `response.data` | ✅ Correct | PASS |
| createBlog | httpClient.post | `ApiResponse<IBlog\|null>` | `response.data` | ✅ Correct | PASS |
| updateBlog | httpClient.patch | `ApiResponse<IBlog\|null>` | `response.data` | ✅ Correct | PASS |
| deleteBlog | httpClient.delete | `ApiResponse<{message}>` | `response.data` | ✅ Correct | PASS |

### category.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| getCategories | httpClient.get | Cast as `CategoriesResponse` | `response.data` via cast | ⚠️ Type casting used | PASS |
| prefetchCategories | fetch() | Direct JSON | `res.json()` | ✅ Correct | PASS |
| createCategory | httpClient.post | `ApiResponse<ICategory>` | `response.data` | ✅ Correct | PASS |
| updateCategory | httpClient.patch | `ApiResponse<ICategory>` | `response.data` | ✅ Correct | PASS |

### cloudinary.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| uploadImagesToCloudinary | fetch() | `{files: UploadedImage[]}` | `data.files` | ✅ Correct | PASS |
| deleteImageFromCloudinary | fetch() | `CloudinaryDeleteResponse` | Direct response object | ✅ Correct | PASS |
| deleteImagesFromCloudinary | Promise.all() | Multiple delete calls | Parallel processing | ✅ Correct | PASS |

### comment.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| createComment | httpClient.post | `ApiResponse<IComment>` | returns directly | ✅ Correct | PASS |
| getCommentsByIdeaId | httpClient.get | `ApiResponse<IComment[]>` | returns directly | ✅ Correct | PASS |
| updateComment | httpClient.patch | `ApiResponse<IComment>` | returns directly | ✅ Correct | PASS |
| deleteComment | httpClient.delete | `ApiResponse<any>` | returns directly | ✅ Correct | PASS |

### contact.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| submitContactMessage | httpClient.post | `ApiResponse<ContactResponse>` | returns directly | ✅ Correct | PASS |

### favourite.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| toggleFavourite | httpClient.post | `ApiResponse<IToggleFavouriteResponse>` | returns directly | ✅ Correct | PASS |
| getMyFavourites | httpClient.get | `ApiResponse<IFavourite[]>` | returns directly | ✅ Correct | PASS |

### idea.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| adminDashboardIdeas | fetch() | Directly returns JSON | `res.json()` | ✅ Correct | PASS |
| getPublicIdeas | fetch() | Directly returns JSON | `res.json()` | ✅ Correct | PASS |
| prefetchIdeas | fetch() | Directly returns JSON | `res.json()` | ✅ Correct | PASS |
| getIdeaById | httpClient.get | `ApiResponse<IIdea\|null>` | `response.data` | ✅ Correct | PASS |
| getAdminIdeaById | fetch() | Directly returns JSON | `res.json()` | ✅ Correct | PASS |

### newsletter.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| subscribeNewsletter | httpClient.post | `ApiResponse<{message}>` | returns directly | ✅ Correct | PASS |

### profile.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| getUserProfile | httpClient.get | `ApiResponse<UserProfile>` | `response.data` | ✅ Correct | PASS |
| updateUserProfile | httpClient.patch | `ApiResponse<UserProfile\|null>` | `response.data` | ✅ Correct | PASS |
| prefetchUserProfile | fetch() | Directly returns JSON | `res.json()` | ✅ Correct | PASS |

### stats.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| getStats | httpClient.get | `ApiResponse<DashboardStats\|IMemberStats\|null>` | `response.data` | ✅ Correct | PASS |

### user.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| getPublicUsers | fetch() | Directly returns JSON | `res.json()` | ✅ Correct | PASS |
| getAllUsers | fetch() | Directly returns JSON | `res.json()` | ✅ Correct | PASS |
| getUserById | httpClient.get | `ApiResponse<IUser\|null>` | `response.data` | ✅ Correct | PASS |
| toggleUserStatus | httpClient.patch | `ApiResponse<IUser\|null>` | `response.data` | ✅ Correct | PASS |
| updateUserRole | httpClient.patch | `ApiResponse<IUser\|null>` | `response.data` | ✅ Correct | PASS |

### vote.service.ts
| Function | API Call | Response Type | Access Pattern | TypeScript Typing | Status |
|----------|----------|---------------|-----------------|-------------------|--------|
| toggleVote | httpClient.post | `ApiResponse<VoteResponse\|null>` | `response.data` | ✅ Correct | PASS |

---

## 2. HOOKS (/src/hooks/)

### useUser.ts
| Hook | Query Type | API Call | Response Handling | Status |
|------|-----------|----------|-------------------|--------|
| useUser() | useQuery | getUserInfo() from auth.service | `return await getUserInfo()` | ✅ Correct - returns raw data from service |

**Details:**
- Uses useQuery with queryFn that calls getUserInfo()
- getUserInfo() already returns the data object (not wrapped in ApiResponse)
- Direct assignment to user state
- Type: `User | null`

### useVote.ts
| Hook | Mutation Type | API Call | Response Handling | Status |
|------|--------------|----------|-------------------|--------|
| useVote(ideaId) | useMutation | toggleVote() | Returns ApiResponse, onSuccess checks `response.data` | ✅ Correct |
| useFavourite(ideaId) | useMutation | toggleFavourite() | Returns ApiResponse, onSuccess checks `response.data` | ✅ Correct |

**Details:**
- Both use useMutation pattern
- Services return ApiResponse directly
- onSuccess handlers access `response.data` correctly
- Proper invalidation of query keys

---

## 3. COMPONENTS WITH DIRECT API CALLS or useQuery/useMutation

### /src/components/shared/SearchSuggestions.tsx
| API Call | Type Declaration | Access Pattern | Issue | Status |
|----------|------------------|-----------------|-------|--------|
| api.get() | `api.get<ApiResponse<SearchSuggestion[]>>()` | `response.data?.data` | ❌ **DOUBLE WRAPPING** | **FAIL** |

**Location:** Line 48-56
**Problem:** 
```typescript
// WRONG - Double wrapping
const response = await api.get<ApiResponse<SearchSuggestion[]>>(
  "/ideas/search/suggestions",
  { params: { search: query, limit: 5 } }
);

if (response.data?.data && Array.isArray(response.data.data)) {
  setSuggestions(response.data.data);
}
```

**Root Cause:** 
- Generic type should be just `SearchSuggestion[]`
- httpClient.get() already returns `ApiResponse<SearchSuggestion[]>`
- Specifying `ApiResponse<...>` as the generic double-wraps it

**Fix Required:**
```typescript
// CORRECT
const response = await api.get<SearchSuggestion[]>(
  "/ideas/search/suggestions",
  { params: { search: query, limit: 5 } }
);

if (response.data && Array.isArray(response.data)) {
  setSuggestions(response.data);
}
```

---

### /src/components/module/ideas/RelatedIdeas.tsx
| Query Key | Service Call | Response Handling | Access Pattern | Status |
|-----------|-------------|-------------------|-----------------|--------|
| ["related-ideas", categoryId, currentIdeaId] | prefetchIdeas() | useQuery with data | `data?.data \|\| []` | ✅ Correct |

**Details:**
- Service returns `ApiResponse<IIdea[]>`
- Correctly accesses `data.data` for the ideas array
- Properly filters and slices results

---

### /src/components/module/ideas/IdeasFilters.tsx
| Query/Hook | API Call | Response Handling | Status |
|-----------|----------|-------------------|--------|
| useQuery - authors | getPublicUsers() | `authorsData?.data ?? []` | ✅ Correct |
| useQuery - categories | getCategories() | `categoriesData?.data ?? []` | ✅ Correct |

**Details:**
- Both services return proper ApiResponse objects
- Correct access pattern with optional chaining
- Proper fallback to empty arrays

---

### /src/components/module/ideas/IdeasClient.tsx
| Query Key | Service Call | Response Handling | Access Pattern | Status |
|-----------|-------------|-------------------|-----------------|--------|
| ["ideas", queryParams] | prefetchIdeas() | useQuery | `data?.data \|\| []` and `data?.meta` | ✅ Correct |

**Details:**
- Service returns `ApiResponse<IIdea[]>` with meta
- Correctly destructures both data and meta
- Handles pagination properly

---

### /src/components/module/ideas/IdeaDetailsClient.tsx
| Mutation | Service Call | Response Handling | Access Pattern | Status |
|----------|-------------|-------------------|-----------------|--------|
| getCommentsByIdeaId | httpClient.get | useQuery queryFn | `response.data \|\| []` | ✅ Correct |
| deleteComment | httpClient.delete | useMutation | Direct service return | ✅ Correct |
| createComment/updateComment | httpClient.post/patch | useMutation | Direct service return | ✅ Correct |
| toggleVote | httpClient.post | useMutation onSuccess | Checks `response.success` then `response.data` | ✅ Correct |
| toggleFavourite | httpClient.post | useMutation onSuccess | Checks `response.data` for action | ✅ Correct |

**Details:**
- Properly handles ApiResponse in all mutations
- Correct access patterns throughout
- Proper error handling

---

### /src/components/profile/ProfileContent.tsx
| API Call | Response Handling | Access Pattern | Status |
|----------|-------------------|-----------------|--------|
| updateUserProfile() | Checks `response.data` | `setProfile(response.data)` | ✅ Correct |

**Details:**
- Service returns ApiResponse<UserProfile>
- Correctly accesses the data field
- Proper state update

---

### /src/components/dashboard/DashboardCharts.tsx
| Query | API Call | Response Handling | Access Pattern | Status |
|-------|----------|-------------------|-----------------|--------|
| ["dashboard-stats"] | api.get<StatsData>() | useQuery queryFn | `response.data \|\| {...defaults}` | ✅ Correct |

**Details:**
- Correctly types generic as just StatsData
- Uses response.data for the actual data
- Proper fallback to default stats

---

### /src/components/module/ideas/FavouriteButton.tsx
| API Call | Service Call | Response Handling | Access Pattern | Status |
|----------|-------------|-------------------|-----------------|--------|
| toggleFavourite() | Direct service call | Checks `response.data` | `response.data.action === "ADDED"` | ✅ Correct |

**Details:**
- Service returns ApiResponse<IToggleFavouriteResponse>
- Correctly accesses response.data
- Proper error handling

---

### /src/components/module/home/RecommendationsSection.tsx
| Query | API Call | Response Handling | Access Pattern | Status |
|-------|----------|-------------------|-----------------|--------|
| ["ideas-recommendations"] | api.get<RecommendedIdea[]>() | useQuery queryFn | `response.data \|\| []` | ✅ Correct |

**Details:**
- Generic correctly typed as RecommendedIdea[]
- Uses response.data for array access
- Proper fallback handling

---

### /src/components/module/home/Newsletter.tsx
| API Call | Service Call | Response Handling | Status |
|----------|-------------|-------------------|--------|
| subscribeNewsletter() | Direct service call | Checks `response.success \|\| response.data` | ✅ Correct |

**Details:**
- Service returns ApiResponse<{message}>
- Proper success checking
- Handles 409 conflict status

---

### /src/components/module/idea/EditIdeaForm.tsx
| Mutation | Service Call | Response Handling | Access Pattern | Status |
|----------|-------------|-------------------|-----------------|--------|
| updateIdea() | useMutation | onSuccess checks `data.success` | Direct check of data properties | ✅ Correct |
| changeIdeaStatus() | useMutation | onSuccess checks `data.success` | Direct error handling | ✅ Correct |

**Details:**
- Proper mutation setup
- Correct ApiResponse handling
- Good error rollback logic

---

### /src/components/module/ideas/IdeaCardVote.tsx
| Mutation | Service Call | Response Handling | Status |
|----------|-------------|-------------------|--------|
| toggleVote() | Direct service call | useMutation onSuccess checks `data?.success` | ✅ Correct |

**Details:**
- Service returns ApiResponse directly
- Properly accesses success flag
- Correct promise handling

---

## Summary Statistics

### Total API-calling Code Locations Analyzed: 22

| Category | Count | Passes | Failures |
|----------|-------|--------|----------|
| Services | 14 files | 14 ✅ | 0 ❌ |
| Hooks | 2 files | 2 ✅ | 0 ❌ |
| Components | 11 files | 10 ✅ | 1 ❌ |
| **TOTAL** | **27** | **26 ✅** | **1 ❌** |

---

## Critical Issues Found

### 🔴 CRITICAL - 1 Issue Requiring Immediate Fix

#### Issue #1: SearchSuggestions.tsx - Double Response Wrapping
- **Severity:** CRITICAL
- **File:** `src/components/shared/SearchSuggestions.tsx`
- **Line:** 48-56
- **Type:** Incorrect type generics + double data nesting
- **Current Code:**
  ```typescript
  const response = await api.get<ApiResponse<SearchSuggestion[]>>(
    "/ideas/search/suggestions",
    { params: { search: query, limit: 5 } }
  );
  
  if (response.data?.data && Array.isArray(response.data.data)) {
    setSuggestions(response.data.data);
  }
  ```
- **Why It's Wrong:**
  - httpClient.get() returns `ApiResponse<T>` where T is the generic parameter
  - Passing `ApiResponse<SearchSuggestion[]>` makes it: `ApiResponse<ApiResponse<SearchSuggestion[]>>`
  - This requires `response.data?.data` to access the actual array
  - Works but violates type system intent and is confusing

- **Correct Implementation:**
  ```typescript
  const response = await api.get<SearchSuggestion[]>(
    "/ideas/search/suggestions",
    { params: { search: query, limit: 5 } }
  );
  
  if (response.data && Array.isArray(response.data)) {
    setSuggestions(response.data);
  }
  ```

---

## Best Practices Observed

✅ **Correctly Done Throughout Most of Codebase:**

1. **Service Layer Pattern:**
   - Services properly return `ApiResponse<T>` or raw data
   - httpClient generic type is just the data type, not wrapped in ApiResponse
   - Proper error handling with try-catch blocks

2. **Component/Hook Pattern:**
   - useQuery/useMutation properly handle ApiResponse
   - Components access response.data or response.data.data correctly when needed
   - Good validation of response structure before use

3. **TypeScript:**
   - Strong typing used throughout
   - Proper interface definitions for API responses
   - Type safety maintains consistency

4. **Error Handling:**
   - Services catch and rethrow errors properly
   - Components use error states effectively
   - Proper response validation before data access

---

## Recommendations

### 1. Fix SearchSuggestions.tsx (Priority: HIGH)
Change the generic type from `ApiResponse<SearchSuggestion[]>` to `SearchSuggestion[]` and simplify data access.

### 2. Consider Creating a Type Guard
For cases where response structure needs validation:
```typescript
function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return obj && typeof obj === 'object' && 'success' in obj && 'data' in obj;
}
```

### 3. Standardize Generic Type Declaration
Establish pattern: Only pass the actual data type to httpClient generics, never wrap in ApiResponse.

### 4. Add ESLint Rule (Optional)
Consider a custom eslint rule to prevent double-wrapping of ApiResponse types.

---

## Access Pattern Reference

### Correct Patterns by Call Type:

**httpClient.get/post/patch/delete + useQuery/useMutation:**
```typescript
// Service: returns ApiResponse<T>
export const getItems = async (): Promise<ApiResponse<Item[]>> => {
  return httpClient.get<Item[]>("/items");  // Generic is JUST Item[]
};

// Component: 
const { data } = useQuery({
  queryFn: getItems,
});
const items = data?.data;  // Access via .data
```

**Direct fetch() + .json():**
```typescript
const res = await fetch(url);
const data = await res.json();  // Already has ApiResponse structure
const items = data.data;  // Access via .data
```

**Service returns raw data (auth.service.ts):**
```typescript
export async function getUserInfo() {
  const { data } = await res.json();
  return data;  // Returns unwrapped data
}

// Component:
const user = await getUserInfo();  // No .data needed
```

---

## Test Verification

To verify patterns are working correctly, check:
1. ✅ SearchSuggestions returns correct suggestions in search dropdown
2. ✅ All list pages render data without crashes
3. ✅ Vote/favorite toggles update counts correctly
4. ✅ Form submissions handle responses properly
5. ✅ Error messages display when API fails

---

*Analysis Date: April 9, 2026*
*Frontend: Next.js + React Query (TanStack Query)*
*HTTP Client: Axios with custom wrapper*
