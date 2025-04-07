console.log("Panel sidebar script loaded!");

import SidebarSection from './components/sidebar.vue';

panel.plugin('2inchesofwater/panel-sidebar', {
  sections: {
    sidebar: SidebarSection
  },
  
  // Register any standalone views that we want to be able to navigate to
  views: {
    // Example custom view
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
    }
  },
  
  created(Vue) {
    // Add support for the special 'heading' view type in the navigation
    Vue.component('k-sidebar-section', {
      extends: SidebarSection,
      methods: {
        // We don't need to modify any methods here since we've already 
        // updated the SidebarSection component to handle 'heading' items
      }
    });
  }
});
