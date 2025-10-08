# Integrating Backend Favorites with Traffic Signs Page

This guide shows how to integrate the backend favorites API with your existing Traffic Signs page that currently uses localStorage for bookmarks.

## Current Implementation

Your `TrafficSignsPage.vue` currently uses:
- Local storage for bookmarks (`traffic_sign_bookmarks_v1`)
- Bookmark button on each signal
- Filter to show only bookmarked signals

## Integration Options

### Option 1: Replace localStorage with Backend API

Sync bookmarks to the backend for cross-device access and persistence.

### Option 2: Hybrid Approach

Keep localStorage for unauthenticated users, use backend for authenticated users.

## Implementation - Hybrid Approach (Recommended)

Here's how to modify your `TrafficSignsPage.vue` to use the backend API for authenticated users:

```vue
<script>
import { defineComponent, ref, computed, onMounted, watch, nextTick } from "vue";
import { useFavoriteTrafficSignals } from '../composables/useFavoriteTrafficSignals'
import { Cookies } from 'quasar'

export default defineComponent({
  name: "TrafficSignsPage",
  setup() {
    const query = ref("");
    const searchRef = ref(null);
    const vehicle = ref("all");
    const selectedMap = ref({});
    const filterMode = ref("all");
    const bookmarkedIdSet = ref(new Set());
    const STORAGE_KEY = "traffic_sign_bookmarks_v1";
    
    // NEW: Check if user is authenticated
    const isAuthenticated = computed(() => !!Cookies.get('auth_token'))
    
    // NEW: Use the favorites composable
    const {
      favorites,
      fetchFavorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite: isBackendFavorite,
      loading: favoritesLoading
    } = useFavoriteTrafficSignals()

    // ... your existing image loading code ...

    const groups = ref([
      { key: "warnings", title: "Waarschuwingsborden", items: warningItems },
      { key: "speed", title: "Snelheidsborden", items: speedItems },
      // ... rest of groups ...
    ]);

    const norm = (s) =>
      s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

    const filteredGroups = computed(() => {
      const q = norm(query.value.trim());
      return groups.value
        .map((g) => ({
          ...g,
          items: g.items.filter((it) => {
            const v =
              vehicle.value === "all" ||
              it.vehicle.includes("all") ||
              it.vehicle.includes(vehicle.value);
            const m = q === "" || norm(it.title).includes(q);
            
            // MODIFIED: Use backend favorites for authenticated users
            const b =
              filterMode.value === "all" ||
              (isAuthenticated.value 
                ? isBackendFavorite(it.id) 
                : bookmarkedIdSet.value.has(it.id));
            
            return v && m && b;
          }),
        }))
        .filter((g) => g.items.length);
    });

    function select(groupKey, item) {
      selectedMap.value[groupKey] = item.id;
    }
    
    function isSelected(groupKey, itemId) {
      return selectedMap.value[groupKey] === itemId;
    }

    // MODIFIED: Check bookmarks based on authentication
    function isBookmarked(id) {
      if (isAuthenticated.value) {
        return isBackendFavorite(id)
      }
      return bookmarkedIdSet.value.has(id);
    }
    
    // MODIFIED: Toggle bookmark with backend support
    async function toggleBookmark(item) {
      if (isAuthenticated.value) {
        // Use backend API
        try {
          const favoriteData = {
            signalId: item.id,
            signalName: item.title,
            signalType: groups.value.find(g => 
              g.items.some(i => i.id === item.id)
            )?.key || 'unknown',
            signalImageUrl: item.image || null
          }
          
          if (isBackendFavorite(item.id)) {
            await removeFromFavorites(item.id)
          } else {
            await addToFavorites(favoriteData)
          }
        } catch (error) {
          console.error('Failed to toggle favorite:', error)
        }
      } else {
        // Use localStorage
        const set = new Set(Array.from(bookmarkedIdSet.value));
        if (set.has(item.id)) set.delete(item.id);
        else set.add(item.id);
        bookmarkedIdSet.value = set;
        saveBookmarks();
      }
    }
    
    // MODIFIED: Clear bookmarks with backend support
    async function clearBookmarks() {
      if (isAuthenticated.value) {
        // Clear from backend
        try {
          const favoriteIds = favorites.value.map(f => f.signalId)
          for (const id of favoriteIds) {
            await removeFromFavorites(id)
          }
        } catch (error) {
          console.error('Failed to clear favorites:', error)
        }
      } else {
        // Clear from localStorage
        bookmarkedIdSet.value = new Set();
        saveBookmarks();
      }
    }
    
    function saveBookmarks() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(bookmarkedIdSet.value))
        );
      } catch (e) {}
    }
    
    function loadBookmarks() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        bookmarkedIdSet.value = new Set(Array.isArray(arr) ? arr : []);
      } catch (e) {
        bookmarkedIdSet.value = new Set();
      }
    }
    
    // NEW: Sync localStorage to backend on first login
    async function syncLocalToBackend() {
      if (!isAuthenticated.value || bookmarkedIdSet.value.size === 0) return
      
      const syncKey = 'favorites_synced_v1'
      const alreadySynced = localStorage.getItem(syncKey)
      
      if (alreadySynced) return
      
      try {
        // Upload local bookmarks to backend
        for (const id of bookmarkedIdSet.value) {
          // Find the item details
          for (const group of groups.value) {
            const item = group.items.find(i => i.id === id)
            if (item) {
              try {
                await addToFavorites({
                  signalId: item.id,
                  signalName: item.title,
                  signalType: group.key,
                  signalImageUrl: item.image || null
                })
              } catch (err) {
                // Ignore duplicates
                if (err.response?.status !== 409) {
                  console.error('Failed to sync:', id, err)
                }
              }
              break
            }
          }
        }
        
        // Mark as synced
        localStorage.setItem(syncKey, 'true')
      } catch (error) {
        console.error('Failed to sync local favorites to backend:', error)
      }
    }
    
    onMounted(async () => {
      loadBookmarks();
      
      // NEW: Load favorites from backend if authenticated
      if (isAuthenticated.value) {
        await fetchFavorites()
        await syncLocalToBackend()
      }
      
      // Keyboard shortcut: Cmd/Ctrl+K focuses the search
      window.addEventListener("keydown", (e) => {
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
        if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          nextTick(() => {
            searchRef.value && searchRef.value.focus();
          });
        }
      });
    });

    // MODIFIED: Count bookmarks based on authentication
    const bookmarkedCount = computed(() => {
      if (isAuthenticated.value) {
        return favorites.value.length
      }
      return bookmarkedIdSet.value.size
    });

    // ... rest of your displayNames mapping ...

    return {
      query,
      searchRef,
      vehicle,
      filteredGroups,
      select,
      isSelected,
      filterMode,
      isBookmarked,
      toggleBookmark,
      bookmarkedCount,
      clearBookmarks,
    };
  },
});
</script>
```

## Key Changes

1. **Import the composable**: Added `useFavoriteTrafficSignals` composable
2. **Check authentication**: Use `Cookies.get('auth_token')` to check if user is logged in
3. **Modified `isBookmarked()`**: Returns backend favorite status for authenticated users
4. **Modified `toggleBookmark()`**: Calls backend API for authenticated users
5. **Modified `clearBookmarks()`**: Clears backend favorites for authenticated users
6. **Added `syncLocalToBackend()`**: One-time sync of localStorage bookmarks to backend
7. **Modified `bookmarkedCount`**: Returns backend count for authenticated users

## Benefits

- **For unauthenticated users**: Continue using localStorage (no breaking changes)
- **For authenticated users**: 
  - Bookmarks sync across devices
  - Bookmarks persist even if localStorage is cleared
  - Can access favorites from the dedicated Favorites page
  - One-time migration of existing localStorage bookmarks

## Testing

1. **Test as unauthenticated user**:
   - Bookmarks should work with localStorage as before
   
2. **Test as authenticated user**:
   - New bookmarks should save to backend
   - Bookmarks should load from backend on page load
   - Existing localStorage bookmarks should sync on first login
   
3. **Test cross-device**:
   - Login on device A, add favorite
   - Login on device B, should see the same favorite

## Alternative: Backend Only

If you want to remove localStorage completely and only use the backend:

```javascript
// Simplified version - backend only
function isBookmarked(id) {
  return isBackendFavorite(id);
}

async function toggleBookmark(item) {
  const favoriteData = {
    signalId: item.id,
    signalName: item.title,
    signalType: groups.value.find(g => 
      g.items.some(i => i.id === item.id)
    )?.key || 'unknown',
    signalImageUrl: item.image || null
  }
  
  if (isBackendFavorite(item.id)) {
    await removeFromFavorites(item.id)
  } else {
    await addToFavorites(favoriteData)
  }
}

const bookmarkedCount = computed(() => favorites.value.length);
```

## Next Steps

1. Test the integration with your authentication system
2. Add loading states during API calls
3. Handle offline scenarios (fallback to localStorage)
4. Add sync button to manually sync localStorage to backend
5. Consider adding a migration prompt for existing users

