<template>
  <q-page class="q-pa-none">
    <section class="ts-hero">
      <div class="container">
        <div class="controls">
          <q-input
            ref="searchRef"
            v-model="query"
            outlined
            rounded
            debounce="150"
            :placeholder="$t('traffic.search_placeholder')"
            class="search"
            clearable
            clear-icon="close"
            :aria-label="$t('traffic.search_aria')"
          >
            <template #prepend><q-icon name="search" /></template>
            <template #append>
              <span class="kbd-hint">⌘K</span>
            </template>
          </q-input>
          <div class="toolbar">
            <q-btn-toggle
              v-model="filterMode"
              class="segmented"
              no-caps
              size="sm"
              rounded
              unelevated
              :options="[
                { label: $t('traffic.all'), value: 'all', icon: 'grid_view' },
                {
                  label: $t('traffic.bookmarks', { count: bookmarkedCount }),
                  value: 'bookmarks',
                  icon: 'bookmark',
                },
              ]"
            />
            <q-btn
              v-if="bookmarkedCount && filterMode === 'bookmarks'"
              class="clear-btn"
              no-caps
              size="sm"
              rounded
              flat
              icon="delete_sweep"
              :label="$t('traffic.clear')"
              @click="clearBookmarks"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="ts-content">
      <div class="container">
        <div v-for="group in filteredGroups" :key="group.key" class="group">
          <h3 class="group-title">{{ $t('traffic.groups.' + group.key) }}</h3>
          <div class="grid">
            <div
              v-for="item in group.items"
              :key="item.id"
              class="sign-cell"
              :class="{ selected: isSelected(group.key, item.id) }"
              :aria-label="item.title"
              role="button"
              tabindex="0"
              @click="select(group.key, item)"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="sign-img"
                loading="lazy"
              />
              <svg
                v-else
                viewBox="0 0 100 86"
                class="sign-svg"
                aria-hidden="true"
              >
                <polygon
                  points="50,3 97,83 3,83"
                  fill="#fff"
                  stroke="#e11d48"
                  stroke-width="6"
                />
              </svg>
              <q-btn
                class="bookmark-btn"
                round
                dense
                flat
                :icon="isBookmarked(item.id) ? 'bookmark' : 'bookmark_border'"
                :color="isBookmarked(item.id) ? 'amber-10' : 'grey-6'"
                @click.stop="toggleBookmark(item)"
                :aria-label="
                  isBookmarked(item.id)
                    ? 'Verwijder bladwijzer'
                    : 'Voeg toe aan bladwijzers'
                "
              />
              <div v-if="isSelected(group.key, item.id)" class="sign-caption">
                {{ item.title }}
              </div>
              <!-- <q-tooltip>{{ item.title }}</q-tooltip> -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { useFavoriteTrafficSignals } from '../composables/useFavoriteTrafficSignals'
import { Cookies } from 'quasar'

export default defineComponent({
  name: "TrafficSignsPage",
  setup() {
    const query = ref("");
    const searchRef = ref(null);
    const vehicle = ref("all");
    const selectedMap = ref({}); // { [groupKey]: itemId }
    const filterMode = ref("all"); // 'all' | 'bookmarks'
    const bookmarkedIdSet = ref(new Set());
    const STORAGE_KEY = "traffic_sign_bookmarks_v1";

    // Check if user is authenticated
    const isAuthenticated = computed(() => !!Cookies.get('auth_token'))
    
    // Use the favorites composable for backend integration
    const {
      favorites,
      fetchFavorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite: isBackendFavorite,
      loading: favoritesLoading
    } = useFavoriteTrafficSignals()

    // Load images dynamically from src/assets/Waarschuwingsborden (trw1..trw32)
    const warningItems = (() => {
      try {
        const ctx = require.context(
          "../assets/Waarschuwingsborden",
          false,
          /trw\d+\.(webp|png|jpg|jpeg|svg)$/i
        );
        const files = ctx
          .keys()
          .map((k) => ({
            key: k,
            num: Number(k.match(/trw(\d+)/i)?.[1] || 0),
            src: ctx(k),
          }))
          .sort((a, b) => a.num - b.num);
        return files.map((f) => ({
          id: `trw${f.num}`,
          title: `trw${f.num}`,
          vehicle: ["all"],
          image: f.src,
        }));
      } catch (e) {
        return [];
      }
    })();

    const speedItems = (() => {
      try {
        const ctx = require.context(
          "../assets/Snelheidsborden",
          false,
          /trsn\d+\.(webp|png|jpg|jpeg|svg)$/i
        );
        const files = ctx
          .keys()
          .map((k) => ({
            key: k,
            num: Number(k.match(/trsn(\d+)/i)?.[1] || 0),
            src: ctx(k),
          }))
          .sort((a, b) => a.num - b.num);
        return files.map((f) => ({
          id: `trsn${f.num}`,
          title: `trsn${f.num}`,
          vehicle: ["all"],
          image: f.src,
        }));
      } catch (e) {
        return [];
      }
    })();

    const priorityItems = (() => {
      try {
        const ctx = require.context(
          "../assets/Voorrangsborden",
          false,
          /trvo\d+\.(webp|png|jpg|jpeg|svg)$/i
        );
        const files = ctx
          .keys()
          .map((k) => ({
            key: k,
            num: Number(k.match(/trvo(\d+)/i)?.[1] || 0),
            src: ctx(k),
          }))
          .sort((a, b) => a.num - b.num);
        return files.map((f) => ({
          id: `trvo${f.num}`,
          title: `trvo${f.num}`,
          vehicle: ["all"],
          image: f.src,
        }));
      } catch (e) {
        return [];
      }
    })();

    const infoItems = (() => {
      try {
        const ctx = require.context(
          "../assets/Informatieborden",
          false,
          /info\d+\.(webp|png|jpg|jpeg|svg)$/i
        );
        const files = ctx
          .keys()
          .map((k) => ({
            key: k,
            num: Number(k.match(/info(\d+)/i)?.[1] || 0),
            src: ctx(k),
          }))
          .sort((a, b) => a.num - b.num);
        return files.map((f) => ({
          id: `info${f.num}`,
          title: `info${f.num}`,
          vehicle: ["all"],
          image: f.src,
        }));
      } catch (e) {
        return [];
      }
    })();

    const prohibitionItems = (() => {
      try {
        const ctx = require.context(
          "../assets/Geboden en verboden",
          false,
          /geb\d+\.(webp|png|jpg|jpeg|svg)$/i
        );
        const files = ctx
          .keys()
          .map((k) => ({
            key: k,
            num: Number(k.match(/geb(\d+)/i)?.[1] || 0),
            src: ctx(k),
          }))
          .sort((a, b) => a.num - b.num);
        return files.map((f) => ({
          id: `geb${f.num}`,
          title: `geb${f.num}`,
          vehicle: ["all"],
          image: f.src,
        }));
      } catch (e) {
        return [];
      }
    })();

    const directionItems = (() => {
      try {
        const ctx = require.context(
          "../assets/Rijrichtingen",
          false,
          /rij\d+\.(webp|png|jpg|jpeg|svg)$/i
        );
        const files = ctx
          .keys()
          .map((k) => ({
            key: k,
            num: Number(k.match(/rij(\d+)/i)?.[1] || 0),
            src: ctx(k),
          }))
          .sort((a, b) => a.num - b.num);
        return files.map((f) => ({
          id: `rij${f.num}`,
          title: `rij${f.num}`,
          vehicle: ["all"],
          image: f.src,
        }));
      } catch (e) {
        return [];
      }
    })();

    const parkingItems = (() => {
      try {
        const ctx = require.context(
          "../assets/Parkeren",
          false,
          /par\d+\.(webp|png|jpg|jpeg|svg)$/i
        );
        const files = ctx
          .keys()
          .map((k) => ({
            key: k,
            num: Number(k.match(/par(\d+)/i)?.[1] || 0),
            src: ctx(k),
          }))
          .sort((a, b) => a.num - b.num);
        return files.map((f) => ({
          id: `par${f.num}`,
          title: `par${f.num}`,
          vehicle: ["all"],
          image: f.src,
        }));
      } catch (e) {
        return [];
      }
    })();

    const groups = ref([
      { key: "warnings", title: "Waarschuwingsborden", items: warningItems },
      { key: "speed", title: "Snelheidsborden", items: speedItems },
      { key: "priority", title: "Voorrangsborden", items: priorityItems },
      { key: "info", title: "Informatieborden", items: infoItems },
      {
        key: "prohibition",
        title: "Geboden en verboden",
        items: prohibitionItems,
      },
      { key: "direction", title: "Rijrichtingen", items: directionItems },
      { key: "parking", title: "Parkeren", items: parkingItems },
    ]);

    const norm = (s) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

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
            
            // Use backend favorites for authenticated users, localStorage for others
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

    function isBookmarked(id) {
      // Use backend for authenticated users, localStorage for others
      if (isAuthenticated.value) {
        return isBackendFavorite(id)
      }
      return bookmarkedIdSet.value.has(id);
    }
    
    async function toggleBookmark(item) {
      if (isAuthenticated.value) {
        // Use backend API for authenticated users
        try {
          // Find the group this item belongs to
          const group = groups.value.find(g => 
            g.items.some(i => i.id === item.id)
          )
          
          const favoriteData = {
            signalId: item.id,
            signalName: item.title,
            signalType: group?.key || 'unknown',
            signalImageUrl: item.id // Store only the ID, not the full webpack URL
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
        // Use localStorage for unauthenticated users
        const set = new Set(Array.from(bookmarkedIdSet.value));
        if (set.has(item.id)) set.delete(item.id);
        else set.add(item.id);
        bookmarkedIdSet.value = set;
        saveBookmarks();
      }
    }
    
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
    
    // Sync localStorage bookmarks to backend on first login
    async function syncLocalToBackend() {
      if (!isAuthenticated.value || bookmarkedIdSet.value.size === 0) return
      
      const syncKey = 'favorites_synced_v1'
      const alreadySynced = localStorage.getItem(syncKey)
      
      if (alreadySynced) return
      
      try {
        console.log('Syncing local bookmarks to backend...')
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
                  signalImageUrl: item.id // Store only the ID for migration
                })
              } catch (err) {
                // Ignore duplicates (409 conflict)
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
        console.log('Local bookmarks synced successfully!')
      } catch (error) {
        console.error('Failed to sync local favorites to backend:', error)
      }
    }
    
    onMounted(async () => {
      loadBookmarks();
      
      // Load favorites from backend if authenticated
      if (isAuthenticated.value) {
        try {
          await fetchFavorites()
          // Sync localStorage bookmarks to backend (one-time)
          await syncLocalToBackend()
        } catch (error) {
          console.error('Failed to load favorites:', error)
        }
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

    const bookmarkedCount = computed(() => {
      // Use backend count for authenticated users
      if (isAuthenticated.value) {
        return favorites.value.length
      }
      return bookmarkedIdSet.value.size
    });

    // Provide display names for known IDs like trw1 etc.
    const displayNames = {
      trw1: "Waarschuwing rijbaanversmalling",
      trw2: "Let op rollende stenen",
      trw3: "Splitsing autosnelweg",
      trw4: "Einde of smalle vluchtstrook",
      trw5: "Bochtschild",
      trw6: "Spoorwegovergang over 80 meter",
      trw7: "Spoorwegovergang over 160 meter",
      trw8: "Spoorwegovergang over 240 meter",
      trw9: "Slecht wegdek",
      trw10: "Let op overstekend vee",
      trw11: "Vooraanduiding bocht naar rechts",
      trw12: "Vooraanduiding bocht naar links",
      trw13: "Steile helling",
      trw14: "Gevaarlijke daling",
      trw15: "Gevaarlijk kruispunt",
      trw16: "Spoorwegovergang met spoorbomen",
      trw17: "Spoorwegovergang zonder spoorbomen",
      trw18: "Spoorweg overweg met enkel spoor",
      trw19: "Let op slipgevaar",
      trw20: "Slipgevaar met afstand informatie",
      trw21: "Let op kinderen",
      trw22: "Let op voetgangers",
      trw23: "Let op groot wild",
      trw24: "Let op tegenliggers",
      trw25: "Vooraanduiding zijwind",
      trw26: "Kans op file",
      trw27: "Vooraanduiding ongeval",
      trw28: "Let op slecht zicht bij regen sneeuw mist",
      trw29: "Let op drempel",
      trw30: "Let op uitschuifbare paal",
      trw31: "Voorrangsborden",
      trw32: "Waarschuwingsbord",
      trsn1: "Advies snelheid",
      trsn2: "Hectometerbord snelweg",
      trsn3: "Hectometerbord autoweg variant",
      trsn4: "Hectometerbord autoweg",
      trvo1: "Voorrangsweg van één kant",
      trvo2: "Voorrangsweg",
      trvo3: "Voorrangskruispunt",
      trvo4: "Voorrang verlenen",
      trvo5: "Stopbord",
      info1: "Uitwijkroute rechts afslaan",
      info2: "Autosnelweg",
      info3: "Woonerf",
      info4: "Voetpad",
      info5: "Fietspad",
      info6: "Voorwegwijzer langs autosnelweg",
      info7: "Hoge beslissingswijzer langs autosnelweg",
      info8: "Voorwegwijzer langs niet autosnelweg",
      info9: "Wegwijzer met wijknummers binnen en bebouwde kom",
      info10: "Route voor vervoer gevaarlijke stoffen",
      info11: "Voetgangersoversteekplaats",
      info12: "Doodlopende weg",
      info13: "Voorwaarschuwing doodlopende weg links",
      info14: "Voorwaarschuwing doodlopende weg",
      info15: "Aangegeven rijstrook heeft breedte beperking",
      info16: "Vluchthaven",
      info17: "Uitwijkplaats rechts",
      info18: "Fietsstraat",
      info19: "Matrixbord einde aangegeven verboden of adviezen",
      info20: "Matrixbord verdrijfsbord links",
      info21: "Onderbord voor fietsen",
      info22: "Onderbord voor bussen",
      info23: "Onderbord voor vrachtwagens met tijden",
      info24: "Verkeersbrigadier bij zebrapad",
      info25: "Omleidingsroute volgen rechtsaf",
      geb1: "Verbodsborden",
      geb2: "Verboden in te rijden inclusief afgebeelde voertuigen",
      geb3: "Verboden in te rijden met uitzondering",
      geb4: "Verboden voor autos",
      geb5: "Gesloten voor vrachtwagens",
      geb6: "Gesloten verklaring voor traktor, bromfiets en fiets",
      geb7: "Gesloten voor motorfietsen",
      geb8: "Verboden voor autos en motoren",
      geb9: "Verboden voor voetgangers",
      geb10: "Gesloten voor te hoge voertuigen",
      geb11: "Parkeerverbod",
      geb12: "Verboden stil te staan.",
      geb13: "Tegenligger heeft voorrang",
      geb14: "Keerverbod",
      geb15: "Einde aangegeven verboden door verkeersborden",
      rij1: "Éénrichtingsweg",
      rij2: "Éénrichtingsweg rechts",
      rij3: "Inrijden toegestaan",
      rij4: "Passeren aan rechterzijde",
      rij5: "Gebod tot volgen van aangegeven rijrichting",
      rij6: "Gebod tot volgen aangegeven rijrichting",
      rij7: "Bromfietsers moeten wisselen van rijbaan",
      par1: "Parkeergelegenheid laden en lossen",
      par2: "Parkeer en reisvoorziening",

      // Add more mappings as needed: trw2: '...', trsn1: '...'
    };

    // Enhance titles from mapping if present
    groups.value.forEach((g) => {
      g.items.forEach((it) => {
        if (displayNames[it.id]) it.title = displayNames[it.id];
      });
    });

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

<style scoped>
.q-page {
  margin-top: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  border-top: 5px solid #2b3bff;
  padding: 8px 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.ts-hero {
  padding: 36px 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.title {
  font-size: clamp(28px, 3.6vw, 44px);
  font-weight: 900;
  color: #1f1630;
  margin: 0 0 10px;
}
.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.toolbar .segmented {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 2px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}
.toolbar .segmented :deep(.q-btn--standard) {
  border-radius: 999px;
  padding: 2px 10px;
  color: #344256;
}
.toolbar .segmented :deep(.q-btn--active) {
  background: linear-gradient(180deg, #eef3ff, #ffffff);
  box-shadow: 0 4px 14px -8px rgba(16, 24, 40, 0.3);
  color: #0d5be0;
}
.clear-btn {
  border: 1px solid #f2dede;
  color: #b91c1c;
  background: linear-gradient(180deg, #fff, #fff);
  padding: 4px 10px;
}
.clear-btn:hover {
  background: #fff5f5;
}
.search {
  flex: 1 1 200px;
}
.search :deep(.q-field__control) {
  box-shadow: 0 6px 18px -12px rgba(2, 6, 23, 0.35);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.search :deep(.q-field--focused .q-field__control) {
  box-shadow: 0 10px 24px -16px rgba(2, 6, 23, 0.45);
}
.kbd-hint {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-bottom-width: 2px;
  padding: 2px 6px;
  border-radius: 6px;
}
.vehicle-toggle {
  padding: 4px;
  box-shadow: 0 4px 12px -8px rgba(16, 24, 40, 0.2);
}

.ts-content {
  padding: 0;
}
.group {
  margin-bottom: 22px;
}
.group-title {
  font-size: 20px;
  font-weight: bold;
  padding: 0 20px ;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}
.sign-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  padding: 8px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
  border-radius: 12px;
}
.sign-cell.selected {
  background: #ffffff;
  box-shadow: 0 12px 28px -22px rgba(16, 24, 40, 0.5), 0 0 0 2px #2261ff inset;
  transform: translateY(-1px);
}
/* .sign-cell:hover{ box  -shadow:0 12px 28px -22px rgba(16,24,40,.5); transform: translateY(-1px); } */
.sign-img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}
.sign-svg {
  width: 80%;
  height: 80%;
}
.sign-caption {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  background: #fff;
  border-radius: 10px;
  padding: 6px 8px;
  font-weight: 800;
  color: #1f1630;
  font-size: 12px;
  box-shadow: 0 8px 18px -16px rgba(16, 24, 40, 0.45);
}
.bookmark-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.9);
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>


