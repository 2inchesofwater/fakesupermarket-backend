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
  console.log('things');
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
  }
}
</script>