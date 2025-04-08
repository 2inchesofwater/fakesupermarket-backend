<template>
  <menu class="k-sidebar" role="navigation">
    <h2>Sidebar</h2>
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
    
    watch: {
      navigation: {
        immediate: true,
        handler(nav) {
          if (nav && nav.length && (!this.items || this.items.length === 0)) {
            
            // console.log('Processing navigation from props', nav);
            
            const processedItems = nav.map((item, index) => ({
              index,
              name: item.name || `nav-${Date.now()}`,
              label: item.label || 'Untitled',
              icon: item.icon || 'page',
              view: item.view || null
            }));

            const firstValidIndex = nav.findIndex(item => item.view !== 'heading');

            this.$set(this, 'items', processedItems);
            this.selectedIndex = firstValidIndex !== -1 ? firstValidIndex : 0;
          }
        }
      }
    },

    computed: {
      console: () => console,
      window: () => window,
    },
    created () {
      const sections = Array.from(document.querySelectorAll('.k-section'))
      
      // Mark them as controlled by your tabs
      sections.forEach(section => {
        section.setAttribute('data-tab-controlled', 'true');
        
        // Initially hide all sections
        section.hidden = true;
      });
      
      // Show the default section if specified
      if (this.defaultSection) {
        const defaultSection = document.querySelector(`.k-section-name-${this.defaultSection}`);
        if (defaultSection) {
          defaultSection.style.display = 'block';
        }
      } else if (sections.length > 0) {
        // Otherwise show the first section
        sections[0].style.display = 'block'
      }      
    },
    data () {
      return {
        selectedIndex: null 
      }
    },
    mounted () {
      //this.selectMenuItem(0)
    },
    methods: {
      selectMenuItem (i) {
        console.log(i);
        this.selectedIndex = i

        // loop over all the menu items
        this.items.forEach((item, index) => {
          item.isActive = (index === i)
        })
        const selectedItem = this.items[i];
        console.log('selected: ', selectedItem.view);
        this.activateSection(selectedItem.view);
      },
      activateSection(sectionName) {
        // Hide all sections that should be controlled by tabs
        document.querySelectorAll('.k-sections .k-section').forEach(section => {
          section.hidden = true;
        });
        
        // Show only the target section
        const targetSection = document.querySelector(`.k-section-name-${sectionName}`);
        if (targetSection) {
          targetSection.removeAttribute('hidden');
        }
      }
    }    
  }
</script>