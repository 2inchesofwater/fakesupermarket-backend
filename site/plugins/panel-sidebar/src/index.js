import Sidebar from "./components/sidebar.vue";

// Register the plugin with Kirby Panel
window.panel.plugin("2inchesofwater/panel-sidebar", {
  created() {
    console.log('Panel sidebar plugin initialized');
    
    // Initialize sections when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeSidebar();
    });
    
    // Set up a mutation observer to handle dynamically added sections
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // When new sections are added, check if we need to update visibility
          this.initializeSidebar();
        }
      });
    });
    
    // Start observing the DOM for section changes
    setTimeout(() => {
      const target = document.querySelector('.k-collection');
      if (target) {
        observer.observe(target, { childList: true, subtree: true });
      }
    }, 300);
  },
  
  sections: {
    sidebar: Sidebar
  },
  
  // Attach global CSS that controls section visibility
  use: {
    plugin: function() {
      // Create global CSS for section visibility management
      const style = document.createElement('style');
      style.textContent = `
        /* Position the sidebar properly */
        .k-section-name-sidebar {
          position: relative;
          z-index: 2;
          width: 33.3333% !important; /* 1/3 wide */
          flex: 0 0 33.3333% !important;
          border-right: 1px solid var(--color-border);
          min-height: 100%;
        }
        
        /* Content sections styling */
        .k-section[data-sidebar-section="true"] {
          width: 66.6666% !important; /* 2/3 wide */
          flex: 0 0 66.6666% !important;
        }
        
        /* Make the .k-collection container flex */
        .k-collection {
          display: flex !important;
          position: relative;
          flex-wrap: wrap;
        }
        
        /* Selected menu item styling */
        .k-sidebar__list-item--selected .k-sidebar__item {
          background-color: var(--color-background-light);
          border-left: 4px solid var(--color-focus);
          font-weight: 600;
        }
        
        /* Menu item hover effect */
        .k-sidebar__item:hover {
          background-color: var(--color-background-light);
          border-left-color: var(--color-focus-light);
        }
      `;
      document.head.appendChild(style);
    }
  },
  
  methods: {
    /**
     * Find the sidebar section and register all related content sections
     */
    initializeSidebar() {
      // Find all sidebar sections
      const sidebarSections = document.querySelectorAll('.k-section-name-sidebar');
      
      sidebarSections.forEach(sidebarSection => {
        // Get the Vue component instance
        const vueInstance = sidebar.__vue__;
        if (!vueInstance) return;
        
        const items = vueInstance.items || [];
        
        // Find all related content sections and mark them
        items.forEach(item => {
          if (item.view && item.view !== 'heading') {
            const contentSection = document.querySelector(`.k-section-name-${item.view}`);
            if (contentSection) {
              contentSection.setAttribute('data-sidebar-section', 'true');
              contentSection.setAttribute('aria-labelledby', `menuitem_${item.name}`);
            }
          }
        });
        
        // If we have a defaultView or current item, show that section
        const viewToShow = vueInstance.currentItem?.view || vueInstance.defaultView;
        
        if (viewToShow) {
          // First ensure all sections are properly initialized
          let hasVisibleSection = false;
          
          items.forEach(item => {
            if (item.view && item.view !== 'heading') {
              const section = document.querySelector(`.k-section-name-${item.view}`);
              if (section) {
                if (item.view === viewToShow) {
                  // Show the active section
                  section.hidden = false;
                  hasVisibleSection = true;
                } else {
                  // Hide other sections
                  section.hidden = true;
                }
              }
            }
          });
          
          // If we didn't find the section to show, look again
          if (!hasVisibleSection) {
            const activeSection = document.querySelector(`.k-section-name-${viewToShow}`);
            if (activeSection) {
              activeSection.hidden = false;
            }
          }
        } else if (items.length > 0) {
          // No default view set, find the first non-heading item
          const firstItem = items.find(item => item.view !== 'heading');
          if (firstItem && firstItem.view) {
            // Select this item in the Vue component
            vueInstance.selectItem(firstItem);
          }
        }
      });
    }
  }
});