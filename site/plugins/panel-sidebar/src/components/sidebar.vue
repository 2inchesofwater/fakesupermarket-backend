<template>
  <div class="k-sidebar-section">
    <nav class="k-sidebar-tabs">
      <ul>
        <li 
          v-for="item in items" 
          :key="item.name"
          @click="item.view !== 'heading' ? selectItem(item) : null"
          :class="{ 
            'is-active': currentItem && currentItem.name === item.name,
            'is-heading': item.view === 'heading' 
          }"
        >
          <template v-if="item.view === 'heading'">
            <div class="k-sidebar-heading">
              {{ item.label }}
            </div>
          </template>
          <k-button v-else :icon="item.icon" class="k-tab-button">
            {{ item.label }}
          </k-button>
        </li>
      </ul>
    </nav>
    
    <div class="k-sidebar-content">
      <component 
        v-if="currentView" 
        :is="currentView"
        :key="currentItem ? currentItem.name : 'default'"
      />
      <div v-else class="k-sidebar-empty">
        <k-text align="center">Select a navigation item</k-text>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    defaultView: String
  },
  data() {
    return {
      currentItem: null,
      currentView: null,
      viewComponents: {}
    };
  },
  created() {
    // Initialize with default view or first non-heading item
    if (this.items.length > 0) {
      if (this.defaultView) {
        const defaultItem = this.items.find(item => item.view === this.defaultView);
        if (defaultItem) {
          this.selectItem(defaultItem);
        } else {
          // Find first non-heading item
          const firstClickableItem = this.items.find(item => item.view !== 'heading');
          if (firstClickableItem) {
            this.selectItem(firstClickableItem);
          }
        }
      } else {
        // Find first non-heading item
        const firstClickableItem = this.items.find(item => item.view !== 'heading');
        if (firstClickableItem) {
          this.selectItem(firstClickableItem);
        }
      }
    }
  },
  methods: {
    selectItem(item) {
      // Skip heading items
      if (item.view === 'heading') {
        return;
      }
      
      this.currentItem = item;
      
      // Load the corresponding view component
      if (item.view) {
        // Check if we've already loaded this view
        if (this.viewComponents[item.view]) {
          this.currentView = this.viewComponents[item.view];
        } else {
          // Otherwise, load it dynamically
          this.loadView(item.view);
        }
      } else {
        this.currentView = null;
      }
    },
    
    async loadView(viewName) {
      try {
        // Here we would load the view from the Kirby Panel API
        // For simplicity, we're assuming these are registered panel views
        this.currentView = viewName;
        this.viewComponents[viewName] = viewName;
      } catch (error) {
        this.$store.dispatch('notification/error', `Could not load view: ${error.message}`);
        this.currentView = null;
      }
    }
  }
};
</script>

<style>
.k-sidebar-section {
  display: flex;
  height: 100%;
}

.k-sidebar-tabs {
  border-right: 1px solid var(--color-border);
  flex: 0 0 auto;
  width: 220px;
  overflow-y: auto;
}

.k-sidebar-tabs ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.k-sidebar-tabs li {
  border-left: 3px solid transparent;
  cursor: pointer;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
}

.k-sidebar-tabs li.is-active {
  border-left-color: var(--color-focus);
  background-color: var(--color-background-light);
}

.k-tab-button {
  text-align: left;
  width: 100%;
}

.k-sidebar-content {
  flex: 1 1 auto;
  padding: 1.5rem;
  overflow: auto;
}

.k-sidebar-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-light);
}

.k-sidebar-tabs li.is-heading {
  cursor: default;
  margin-top: 1.5rem;
  padding-top: 0;
  padding-bottom: 0.25rem;
}

.k-sidebar-tabs li.is-heading:first-child {
  margin-top: 0;
}

.k-sidebar-heading {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  padding: 0.25rem 0;
}
</style>