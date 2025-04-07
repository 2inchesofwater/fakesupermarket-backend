<template>
  <section class="k-sidebar-section" role="tablist" aria-orientation="vertical">
    <div class="k-sidebar-tabs">
      <ul v-if="items && items.length > 0">
        <li 
          v-for="item in items" 
          :key="item.name"
          :class="{ 
            'k-sidebar-heading-item': item.view === 'heading',
            'k-sidebar-tab-item': item.view !== 'heading'
          }"
        >
          <template v-if="item.view === 'heading'">
            <div class="k-sidebar-heading" role="presentation">
              {{ item.label }}
            </div>
          </template>
          <button 
            v-else 
            class="k-sidebar-tab-button"
            :class="{ 'is-active': currentItem && currentItem.name === item.name }"
            @click="selectItem(item)"
            :id="`tab-${item.name}`"
            :aria-selected="currentItem && currentItem.name === item.name"
            :aria-controls="`panel-${item.view}`"
            role="tab"
            tabindex="0"
            @keydown.space.prevent="selectItem(item)"
            @keydown.enter.prevent="selectItem(item)"
            @keydown.right.prevent="focusNextTab"
            @keydown.left.prevent="focusPreviousTab"
            @keydown.down.prevent="focusNextTab"
            @keydown.up.prevent="focusPreviousTab"
          >
            <span class="k-sidebar-tab-icon" v-if="item.icon">
              <k-icon :type="item.icon" />
            </span>
            <span class="k-sidebar-tab-label">{{ item.label }}</span>
          </button>
        </li>
      </ul>
      <div v-else class="k-sidebar-loading">
        <k-text>Loading navigation items...</k-text>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    navigation: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    defaultView: String
  },
  
  // Add a watcher to handle direct navigation props
  watch: {
    navigation: {
      immediate: true,
      handler(nav) {
        if (nav && nav.length && (!this.items || this.items.length === 0)) {
          console.log('Processing navigation from props', nav);
          // Process navigation if items not provided
          const processedItems = nav.map(item => ({
            name: item.name || `nav-${Date.now()}`,
            label: item.label || 'Untitled',
            icon: item.icon || 'page',
            view: item.view || null
          }));
          this.$set(this, 'items', processedItems);
        }
      }
    }
  },
  data() {
    return {
      currentItem: null,
      currentView: null,
      viewComponents: {},
      $liveRegion: null,
      tabId: `sidebar-${Date.now()}`
    };
  },
  mounted() {
    // Mark other sections for control by this sidebar
    this.$nextTick(() => {
      this.markControlledSections();
      
      // Initialize with a selected tab
      if (this.items && this.items.length > 0) {
        // Find the default or first clickable item
        if (this.defaultView) {
          const defaultItem = this.items.find(item => item.view === this.defaultView);
          if (defaultItem) {
            this.selectItem(defaultItem);
            // Make sure the corresponding section is visible
            this.showSection(defaultItem.view);
            return;
          }
        }
        
        // Select first non-heading item
        const firstClickableItem = this.items.find(item => item.view !== 'heading');
        if (firstClickableItem) {
          this.selectItem(firstClickableItem);
          // Make sure the corresponding section is visible
          this.showSection(firstClickableItem.view);
        }
      }
    });
  },
  methods: {
    selectItem(item) {
      // Skip heading items
      if (item.view === 'heading') {
        return;
      }
      
      this.currentItem = item;
      
      // Announce to screen readers that tab has changed
      this.announceTabChange(item.label);
      
      // Dispatch custom event to show the appropriate section
      this.showSection(item.view);
      
      // Load the corresponding view component (for internal sidebar content)
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
    
    // Mark sections that should be controlled by this sidebar
    markControlledSections() {
      // Find all sections that match our navigation items
      this.items.forEach(item => {
        if (item.view && item.view !== 'heading') {
          const sectionSelector = `.k-section-name-${item.view}`;
          const section = document.querySelector(sectionSelector);
          
          if (section) {
            section.setAttribute('data-sidebar-controlled', 'true');
            console.log(`Marked section ${item.view} as controlled by sidebar`);
          }
        }
      });
      
      // Hide all controlled sections initially
      const sections = document.querySelectorAll('[data-sidebar-controlled="true"]');
      sections.forEach(section => {
        section.classList.remove('is-active');
      });
    },
    
    // Show the selected section and hide others
    showSection(viewName) {
      // Dispatch a custom event to trigger section visibility change
      const event = new CustomEvent('sidebar-tab-changed', {
        detail: {
          viewName: viewName
        },
        bubbles: true
      });
      
      window.dispatchEvent(event);
      console.log(`Dispatched sidebar-tab-changed event for ${viewName}`);
      
      // Also directly manipulate the DOM for immediate effect
      // (this helps during initialization before event listeners are fully set up)
      this.directlyShowSection(viewName);
    },
    
    // Directly manipulate the DOM to show the correct section
    directlyShowSection(viewName) {
      // Hide all controlled sections
      const sections = document.querySelectorAll('[data-sidebar-controlled="true"]');
      sections.forEach(section => {
        section.classList.remove('is-active');
      });
      
      // Show the selected section
      const targetSection = document.querySelector(`.k-section-name-${viewName}`);
      if (targetSection) {
        targetSection.classList.add('is-active');
        console.log(`Directly activated section ${viewName}`);
      }
    },
    
    async loadView(viewName) {
      try {
        console.log('Loading view:', viewName);
        
        // For section views, look for registered sections or components
        if (window.panel?.views?.[viewName]) {
          console.log('Found registered panel view');
          this.currentView = viewName;
          this.viewComponents[viewName] = viewName;
        } else if (this.$root.$options.components[viewName]) {
          console.log('Found global component');
          this.currentView = viewName;
          this.viewComponents[viewName] = viewName;
        } else {
          // Fallback - try to use the name directly
          console.log('Using view name directly');
          this.currentView = viewName;
          this.viewComponents[viewName] = viewName;
        }
      } catch (error) {
        console.error('Error loading view:', error);
        this.$store.dispatch('notification/error', `Could not load view: ${error.message}`);
        this.currentView = null;
      }
    },
    
    // Focus management for tabs (accessibility)
    focusNextTab() {
      const clickableTabs = this.getClickableTabs();
      if (clickableTabs.length === 0) return;
      
      const currentIndex = this.getCurrentTabIndex(clickableTabs);
      const nextIndex = (currentIndex + 1) % clickableTabs.length;
      
      clickableTabs[nextIndex].focus();
    },
    
    focusPreviousTab() {
      const clickableTabs = this.getClickableTabs();
      if (clickableTabs.length === 0) return;
      
      const currentIndex = this.getCurrentTabIndex(clickableTabs);
      const prevIndex = (currentIndex - 1 + clickableTabs.length) % clickableTabs.length;
      
      clickableTabs[prevIndex].focus();
    },
    
    getClickableTabs() {
      return Array.from(this.$el.querySelectorAll('.k-sidebar-tab-button'));
    },
    
    getCurrentTabIndex(tabs) {
      const activeTab = document.activeElement;
      return tabs.indexOf(activeTab);
    },
    
    // Accessibility: Announce tab changes to screen readers
    announceTabChange(tabName) {
      // Create a live region if it doesn't exist
      if (!this.$liveRegion) {
        this.$liveRegion = document.createElement('div');
        this.$liveRegion.setAttribute('aria-live', 'polite');
        this.$liveRegion.setAttribute('class', 'sr-only');
        document.body.appendChild(this.$liveRegion);
      }
      
      // Announce the change
      this.$liveRegion.textContent = `${tabName} tab selected`;
      
      // Clear after announcement
      setTimeout(() => {
        this.$liveRegion.textContent = '';
      }, 1000);
    }
  }
};
</script>

<style>
.k-sidebar-section {
  height: 100%;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

/* Tab list container */
.k-sidebar-tabs {
  border-right: 0;
  width: 100%;
  background-color: var(--color-background);
  max-height: 100%;
  overflow-y: auto;
}

.k-sidebar-tabs ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
}

/* Tab list items */
.k-sidebar-tabs li {
  margin: 0;
  padding: 0;
  list-style: none;
}

.k-sidebar-tab-item {
  margin: 0 0 2px 0;
}

/* Tab buttons - following GOV.UK design patterns */
.k-sidebar-tab-button {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  border: none;
  padding: 0.75rem 1rem;
  background-color: transparent;
  border-left: 4px solid transparent;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.k-sidebar-tab-button:hover {
  background-color: var(--color-background-light);
  border-left-color: var(--color-focus-light);
}

.k-sidebar-tab-button:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: -2px;
  border-left-color: var(--color-focus);
  position: relative;
  z-index: 1;
}

.k-sidebar-tab-button.is-active {
  background-color: var(--color-background-light);
  border-left-color: var(--color-focus);
  font-weight: 600;
}

/* Tab icon and label */
.k-sidebar-tab-icon {
  display: inline-flex;
  margin-right: 0.75rem;
  color: inherit;
}

.k-sidebar-tab-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Category headings */
.k-sidebar-heading-item {
  width: 100%;
  padding: 0 1rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.k-sidebar-heading-item:first-child {
  margin-top: 0;
}

.k-sidebar-heading {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  padding: 0.25rem 0;
}

/* Loading state */
.k-sidebar-loading {
  padding: 1rem;
  color: var(--color-text-light);
  text-align: center;
  font-style: italic;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
</style>