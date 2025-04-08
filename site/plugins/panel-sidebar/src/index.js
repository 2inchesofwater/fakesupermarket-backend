import Sidebar from "./components/sidebar.vue";

// Register the plugin with Kirby Panel
window.panel.plugin("2inchesofwater/panel-sidebar", {
  // Log plugin initialization
  created() {
    console.log('Panel sidebar plugin initialized');
    
    // Set up a mutation observer to handle dynamically added sections
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // When new sections are added, check if we need to update visibility
          this.initializeSections();
        }
      });
    });
    
    // Start observing the DOM for section changes
    setTimeout(() => {
      const target = document.querySelector('.k-collection');
      if (target) {
        observer.observe(target, { childList: true, subtree: true });
        // Initialize sections when plugin is created
        this.initializeSections();
      }
    }, 100);
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
          width: 220px !important; /* Force fixed width */
          flex: 0 0 220px !important;
          border-right: 1px solid var(--color-border);
          min-height: 100%;
        }
        
        /* Make the content sections appear next to the sidebar */
        [data-sidebar-controlled="true"] {
          display: none !important;
          position: relative;
          z-index: 1;
          margin-left: 220px !important;
          width: calc(100% - 220px) !important;
          flex: 1 1 auto !important;
        }
        
        /* Show only the active section */
        [data-sidebar-controlled="true"].is-active {
          display: block !important;
        }
        
        /* Make the .k-collection container flex */
        .k-collection {
          display: flex !important;
          position: relative;
        }
      `;
      document.head.appendChild(style);
      
      // Listen for custom events from the sidebar
      window.addEventListener('sidebar-tab-changed', function(event) {
        if (event.detail && event.detail.viewName) {
          const viewName = event.detail.viewName;
          
          // Find all controlled sections
          const sections = document.querySelectorAll('[data-sidebar-controlled="true"]');
          
          // Hide all sections
          sections.forEach(section => {
            section.classList.remove('is-active');
          });
          
          // Show the selected section
          const targetSection = document.querySelector(`.k-section-name-${viewName}`);
          if (targetSection) {
            targetSection.classList.add('is-active');
            console.log(`Activated section: ${viewName}`);
          } else {
            console.log(`Section ${viewName} not found yet, will retry`);
            
            // If the section doesn't exist yet, it might be created later
            // Set up a temporary observer to watch for it
            const tempObserver = new MutationObserver(function(mutations) {
              const newTargetSection = document.querySelector(`.k-section-name-${viewName}`);
              if (newTargetSection) {
                // Mark as controlled and make active
                newTargetSection.setAttribute('data-sidebar-controlled', 'true');
                newTargetSection.classList.add('is-active');
                console.log(`Found and activated section: ${viewName}`);
                tempObserver.disconnect(); // Clean up observer
              }
            });
            
            // Start observing the DOM
            const container = document.querySelector('.k-collection');
            if (container) {
              tempObserver.observe(container, { childList: true, subtree: true });
              // Auto disconnect after a while to prevent memory leaks
              setTimeout(() => tempObserver.disconnect(), 5000);
            }
          }
        }
      });
    }
  },
  
  // Register any standalone views that we want to be able to navigate to
  views: {
    // Basic content view
    'sidebar-content': {
      component: {
        props: {
          content: String
        },
        template: `
          <div class="k-sidebar-content-view">
            <k-text>{{ content || 'Content view' }}</k-text>
          </div>
        `
      }
    },
    
    // A utility component to show a message
    'sidebar-message': {
      component: {
        props: {
          message: {
            type: String,
            default: 'No content to display'
          },
          icon: {
            type: String,
            default: 'info'
          }
        },
        template: `
          <div class="k-sidebar-message-view">
            <k-icon :type="icon" size="large" class="k-sidebar-message-icon" />
            <k-text align="center">{{ message }}</k-text>
          </div>
        `
      }
    }
  },
  
  // Additional utility methods for working with tabs
  methods: {
    /**
     * Get the current tab ID
     * 
     * @param {string} viewName - The name of the view
     * @return {string} The panel ID
     */
    getPanelId(viewName) {
      return `panel-${viewName}`;
    },
    
    /**
     * Check if a view is available in the Kirby Panel
     * 
     * @param {string} viewName - The name of the view
     * @return {boolean} True if the view is available
     */
    hasView(viewName) {
      return Boolean(window.panel?.views?.[viewName]);
    },
    
    /**
     * Initialize section visibility
     * This is called when the plugin is created and when the DOM changes
     */
    initializeSections() {
      console.log('Initializing sections for sidebar');
      
      // Find all controlled sections
      const sections = document.querySelectorAll('[data-sidebar-controlled="true"]');
      
      // If we find controlled sections but none are active, 
      // then we need to activate the default or first one
      const hasActiveSection = Array.from(sections).some(section => 
        section.classList.contains('is-active')
      );
      
      if (sections.length && !hasActiveSection) {
        console.log('No active section found, activating default');
        
        // Find the sidebar section
        const sidebar = document.querySelector('.k-section-name-sidebar');
        if (sidebar) {
          // Try to get the default view name from the sidebar component
          const sidebarComponent = sidebar.__vue__;
          if (sidebarComponent && sidebarComponent.defaultView) {
            // Activate the default view
            const defaultSection = document.querySelector(`.k-section-name-${sidebarComponent.defaultView}`);
            if (defaultSection) {
              defaultSection.classList.add('is-active');
              console.log(`Activated default section: ${sidebarComponent.defaultView}`);
            }
          } else {
            // No default view, so activate the first section
            if (sections[0]) {
              sections[0].classList.add('is-active');
              console.log('Activated first section');
            }
          }
        }
      }
    }
  }
});