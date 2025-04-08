<template>
  <section class="k-sidebar-section k-section-name-sidebar" role="navigation">
    <ul class="k-sidebar__list test1" role="menu" aria-orientation="vertical">
      <li v-for="item in items" :key="item.name" 
          :class="[
            item.view === 'heading' ? 'k-sidebar-heading-item' : 'k-sidebar__list-item',
            (currentItem && currentItem.name === item.name) ? 'k-sidebar__list-item--selected' : ''
          ]"
          role="presentation">
        
        <!-- Heading items -->
        <div v-if="item.view === 'heading'" role="presentation" class="k-sidebar-heading">
          {{ item.label }}
        </div>
        
        <!-- Menu items -->
        <a v-else
           class="k-sidebar__item" 
           :href="`#${item.view}`" 
           :id="`menuitem_${item.name}`" 
           role="menuitem" 
           :aria-controls="item.view" 
           :aria-selected="currentItem && currentItem.name === item.name" 
           :tabindex="currentItem && currentItem.name === item.name ? '0' : '-1'"
           @click.prevent="selectItem(item)"
           @keydown.space.prevent="selectItem(item)"
           @keydown.enter.prevent="selectItem(item)"
           @keydown.down.prevent="focusNextItem"
           @keydown.up.prevent="focusPreviousItem">
          <span class="k-sidebar-tab-icon" v-if="item.icon">
            <k-icon :type="item.icon" />
          </span>
          <span class="k-sidebar-tab-label">{{ item.label }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  console.log('Inside the script section');
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
  
  watch: {
    navigation: {
      immediate: true,
      handler(nav) {
        if (nav && nav.length && (!this.items || this.items.length === 0)) {
          console.log('Processing navigation from props', nav);
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
      currentItem: null
    };
  },
  
  mounted() {

    this.$nextTick(() => {
      this.initializeSections();
      
      if (this.items && this.items.length > 0) {
        // Find the default or first clickable item
        if (this.defaultView) {
          const defaultItem = this.items.find(item => item.view === this.defaultView);
          if (defaultItem) {
            this.selectItem(defaultItem);
            return;
          }
        }
        
        // Select first non-heading item
        const firstClickableItem = this.items.find(item => item.view !== 'heading');
        if (firstClickableItem) {
          this.selectItem(firstClickableItem);
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
      
      // Show the corresponding section
      this.showSection(item.view);
    },
    
    initializeSections() {
      const sectionIds = this.items
        .filter(item => item.view && item.view !== 'heading')
        .map(item => item.view);
      
      // Find all sections that match our navigation items
      sectionIds.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          // Hide all sections initially
          section.hidden = true;
          section.setAttribute('aria-labelledby', `menuitem_${sectionId.replace('fields-', '')}`);
        }
      });
    },
    
    showSection(sectionId) {
      // Find all section elements
      const sectionElements = document.querySelectorAll('.k-fields-section');
      
      // Hide all sections
      sectionElements.forEach(section => {
        section.hidden = true;
      });
      
      // Show the selected section
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.hidden = false;
      }
    },
    
    focusNextItem() {
      const menuItems = this.getMenuItems();
      if (menuItems.length === 0) return;
      
      const currentIndex = this.getCurrentMenuItemIndex(menuItems);
      const nextIndex = (currentIndex + 1) % menuItems.length;
      
      this.focusMenuItem(menuItems[nextIndex]);
    },
    
    focusPreviousItem() {
      const menuItems = this.getMenuItems();
      if (menuItems.length === 0) return;
      
      const currentIndex = this.getCurrentMenuItemIndex(menuItems);
      const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
      
      this.focusMenuItem(menuItems[prevIndex]);
    },
    
    getMenuItems() {
      return Array.from(this.$el.querySelectorAll('.k-sidebar__item'));
    },
    
    getCurrentMenuItemIndex(menuItems) {
      const activeItem = document.activeElement;
      return menuItems.indexOf(activeItem);
    },
    
    focusMenuItem(menuItem) {
      if (menuItem) {
        menuItem.focus();
      }
    }
