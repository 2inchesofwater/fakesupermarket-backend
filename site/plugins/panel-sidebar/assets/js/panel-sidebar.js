// Panel Sidebar Navigation
// Creates a sidebar navigation structure for Kirby Panel

(function() {
  // Run after the panel is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Function to initialize sidebar navigation
    function initSidebars() {
      // Find all sidebar sections
      const sidebarSections = document.querySelectorAll('.panel-sidebar-section');
      
      if (!sidebarSections.length) return;
      
      // Process each sidebar section
      sidebarSections.forEach(function(section) {
        // Create the sidebar navigation container
        const sidebarNav = document.createElement('nav');
        sidebarNav.className = 'panel-sidebar-nav';
        sidebarNav.setAttribute('role', 'navigation');
        sidebarNav.setAttribute('aria-label', 'Sidebar Navigation');
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'panel-sidebar-content';
        
        // Get the form section that contains the fields
        const formSection = section.closest('.k-section');
        if (!formSection) return;
        
        // Extract sidebar items from the structure field
        const structureItems = section.querySelectorAll('.k-structure-item');
        const items = Array.from(structureItems).map(item => {
          // Extract data from structure fields
          const nameField = item.querySelector('[data-field="name"] input');
          const labelField = item.querySelector('[data-field="label"] input');
          const iconField = item.querySelector('[data-field="icon"] input');
          const isGroupField = item.querySelector('[data-field="isGroup"] input[type="checkbox"]');
          const parentField = item.querySelector('[data-field="parent"] input');
          const conditionField = item.querySelector('[data-field="condition"] input');
          const contentField = item.querySelector('[data-field="content"] textarea');
          
          return {
            name: nameField ? nameField.value : '',
            label: labelField ? labelField.value : '',
            icon: iconField ? iconField.value : '',
            isGroup: isGroupField ? isGroupField.checked : false,
            parent: parentField ? parentField.value : '',
            condition: conditionField ? conditionField.value : '',
            content: contentField ? contentField.value : ''
          };
        });
        
        // Create navigation items
        const navList = document.createElement('ul');
        navList.className = 'panel-sidebar-nav-list';
        
        // Track groups for nesting
        const groups = {};
        
        // First pass: create all group containers
        items.filter(item => item.isGroup).forEach(item => {
          const groupItem = document.createElement('li');
          groupItem.className = 'panel-sidebar-group';
          groupItem.dataset.name = item.name;
          
          const groupButton = document.createElement('button');
          groupButton.className = 'panel-sidebar-group-button';
          groupButton.innerHTML = `
            ${item.icon ? `<span class="panel-sidebar-icon">${item.icon}</span>` : ''}
            <span class="panel-sidebar-label">${item.label}</span>
          `;
          groupButton.setAttribute('aria-expanded', 'true');
          groupButton.setAttribute('aria-controls', `group-${item.name}`);
          
          const groupContent = document.createElement('ul');
          groupContent.id = `group-${item.name}`;
          groupContent.className = 'panel-sidebar-group-items';
          
          groupItem.appendChild(groupButton);
          groupItem.appendChild(groupContent);
          navList.appendChild(groupItem);
          
          // Store reference to group content for later
          groups[item.name] = groupContent;
          
          // Create content panel for group header
          if (item.content) {
            createContentPanel(item, contentContainer);
          }
          
          // Add click handler for group toggle
          groupButton.addEventListener('click', function() {
            const isExpanded = groupButton.getAttribute('aria-expanded') === 'true';
            groupButton.setAttribute('aria-expanded', !isExpanded);
            groupContent.classList.toggle('panel-sidebar-collapsed', isExpanded);
          });
        });
        
        // Second pass: add items to their respective groups
        items.filter(item => !item.isGroup).forEach(item => {
          const navItem = document.createElement('li');
          navItem.className = 'panel-sidebar-item';
          navItem.dataset.name = item.name;
          
          const itemButton = document.createElement('button');
          itemButton.className = 'panel-sidebar-item-button';
          itemButton.innerHTML = `
            ${item.icon ? `<span class="panel-sidebar-icon">${item.icon}</span>` : ''}
            <span class="panel-sidebar-label">${item.label}</span>
          `;
          itemButton.setAttribute('aria-controls', `content-${item.name}`);
          
          navItem.appendChild(itemButton);
          
          // Add to parent group if specified, otherwise add to main list
          if (item.parent && groups[item.parent]) {
            groups[item.parent].appendChild(navItem);
          } else {
            navList.appendChild(navItem);
          }
          
          // Create content panel
          createContentPanel(item, contentContainer);
          
          // Add click handler for item
          itemButton.addEventListener('click', function() {
            // Deactivate all buttons
            sidebarNav.querySelectorAll('.panel-sidebar-item-button').forEach(btn => {
              btn.classList.remove('panel-sidebar-active');
              btn.setAttribute('aria-selected', 'false');
            });
            
            // Activate this button
            itemButton.classList.add('panel-sidebar-active');
            itemButton.setAttribute('aria-selected', 'true');
            
            // Hide all content panels
            contentContainer.querySelectorAll('.panel-sidebar-panel').forEach(panel => {
              panel.classList.remove('panel-sidebar-panel-active');
              panel.setAttribute('aria-hidden', 'true');
            });
            
            // Show this panel
            const panel = contentContainer.querySelector(`#content-${item.name}`);
            if (panel) {
              panel.classList.add('panel-sidebar-panel-active');
              panel.setAttribute('aria-hidden', 'false');
            }
          });
        });
        
        sidebarNav.appendChild(navList);
        
        // Create wrapper for sidebar layout
        const sidebarWrapper = document.createElement('div');
        sidebarWrapper.className = 'panel-sidebar-wrapper';
        
        // Replace the original section content with our sidebar layout
        const sectionContent = formSection.querySelector('.k-section-content');
        if (sectionContent) {
          // Move the section content to our wrapper
          sectionContent.parentNode.insertBefore(sidebarWrapper, sectionContent);
          sidebarWrapper.appendChild(sidebarNav);
          sidebarWrapper.appendChild(contentContainer);
          
          // Hide the original structure display
          section.style.display = 'none';
        }
        
        // Activate the first item by default
        const firstItemButton = sidebarNav.querySelector('.panel-sidebar-item-button');
        if (firstItemButton) {
          firstItemButton.click();
        }
      });
    }
    
    // Helper function to create content panels
    function createContentPanel(item, container) {
      const panel = document.createElement('div');
      panel.id = `content-${item.name}`;
      panel.className = 'panel-sidebar-panel';
      panel.setAttribute('aria-hidden', 'true');
      
      // If there's content defined, parse and add it
      if (item.content) {
        try {
          // Here we would ideally parse the YAML and create fields dynamically
          // For now, we'll just display the content as a placeholder
          panel.innerHTML = `<div class="panel-sidebar-panel-content">${item.content}</div>`;
        } catch (e) {
          panel.innerHTML = `<div class="panel-sidebar-panel-error">Error parsing content: ${e.message}</div>`;
        }
      } else {
        panel.innerHTML = `<div class="panel-sidebar-panel-empty">No content defined for this section.</div>`;
      }
      
      container.appendChild(panel);
    }
    
    // Initialize sidebars
    initSidebars();
    
    // Monitor for dynamic content changes
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // Check if any of the added nodes might contain our sections
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.classList && 
                (node.classList.contains('k-panel-view') || 
                 node.classList.contains('k-section'))) {
              setTimeout(initSidebars, 100); // Slight delay to ensure content is ready
              break;
            }
          }
        }
      });
    });
    
    // Start observing the panel content
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();