<template>
  <menu class="k-sidebar" role="navigation">
    <ul class="k-sidebar__list" role="menu" aria-orientation="vertical">
      <li v-for='(item, index) in items'
        :key='index'
        
        :class="[
            item.view === 'heading' ? 'k-sidebar-heading-item' : 'k-sidebar__list-item',
            (selectedIndex === index) ? 'k-sidebar__list-item--selected' : ''
          ]"
          role="presentation">

        <!-- Heading items -->
        <div v-if="item.view === 'heading'" role="presentation" class="k-sidebar-heading">
          {{ item.label }}
        </div>
        <a v-else
           class="k-sidebar__item" 
           :id="`menuitem_${item.name}`" 
           role="menuitem" 
           :aria-controls="`k-section-name-${item.view}`" 
           :aria-selected="selectedIndex === index" 
           :tabindex="selectedIndex === index ? '0' : '-1'"
           @click='selectMenuItem(item.index)'>
          <span class="k-sidebar-tab-icon" v-if="item.icon">
            <k-icon :type="item.icon" />
          </span>
          <span class="k-sidebar-tab-label">{{ item.label }}</span>
        </a>
      </li>
    </ul>
  </menu>  
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
    
    computed: {
      console: () => console,
      window: () => window,
    },

    data () {
      return {
        items: [],
        selectedIndex: null,
        selectedItem: null
      }
    },

    mounted (selectedItem) {
      const container = this.$el.parentElement;
      if (container) {
        // Add a unique class to the container for scoping
        container.classList.add('k-sidebar-parent');
       }

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            // Check if our sections exist now
            const sections = document.querySelectorAll('.k-sidebar-parent .k-section');
            if (sections.length) {
              // console.log(`Sections detected: ${sections.length}`);
              this.hideAllSections();

              if (this.selectedItem) {
                this.activateSection(this.selectedItem.view);
              }
            }
          }
        }
      });
      
      observer.observe(document.body, { 
        childList: true,
        subtree: true 
      });

      // Initialize items from navigation prop
      if (this.navigation && this.navigation.length) {
        const processedItems = this.navigation.map((item, index) => ({
          index,
          name: item.name || `nav-${Date.now()}`,
          label: item.label || 'Untitled',
          icon: item.icon || 'page',
          view: item.view || null
        }));
        
        // Find first non-heading item for default selection
        const firstValidIndex = this.navigation.findIndex(item => item.view !== 'heading');
        
        this.items = processedItems;
        this.selectedIndex = firstValidIndex;
        this.selectMenuItem(this.selectedIndex);
      }

      /* const sections = Array.from(document.querySelectorAll('.k-sidebar-section'))
      
      // Mark them as controlled by your tabs
      sections.forEach(section => {
        section.setAttribute('data-tab-controlled', 'true');
      });
      
      // Show the default section if specified
      if (this.defaultSection) {
        const defaultSection = document.querySelector(`.k-section-name-${this.defaultSection}`);
        if (defaultSection) {
          defaultSection.style.display = 'block';
        }
      } else if (sections.length > 0) {
        sections[0].style.display = 'block'
      }  */     
    },

    methods: {
      selectMenuItem (i) {
        this.selectedIndex = i

        // loop over all the menu items
        this.items.forEach((item, index) => {
          item.isActive = (index === i)
        })
        this.selectedItem = this.items[i];
        //console.log('selected: ', this.selectedItem.view);
        this.hideAllSections();
        this.activateSection(this.selectedItem.view);
      },
      hideAllSections() {
        try {
          const sections = document.querySelectorAll('.k-sidebar-parent .k-section');
          console.log(`Found ${sections.length} sections`);
          if (sections.length) {
            sections.forEach(section => {
              section.hidden = true;
            });
            // console.log(`Hidden ${sections.length} sections`);
          } else {
            // console.log('No sections found to hide');
          }
        } catch (error) {
          console.error('Error hiding sections:', error);
        }
      },
      activateSection(sectionName) {        
        const targetSection = document.querySelector(`.k-section-name-${sectionName}`);
        if (targetSection) {
          targetSection.removeAttribute('hidden');
        }
      }
    }    
  }
</script>