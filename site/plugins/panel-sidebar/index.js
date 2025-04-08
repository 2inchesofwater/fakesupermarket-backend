(function(){"use strict";function a(t,e,i,n,o,s,c,l){var r=typeof t=="function"?t.options:t;return e&&(r.render=e,r.staticRenderFns=i,r._compiled=!0),{exports:t,options:r}}const d={props:{navigation:{type:Array,default:()=>[]},items:{type:Array,default:()=>[]},defaultView:String},computed:{console:()=>console,window:()=>window},data(){return{items:[],selectedIndex:null,selectedItem:null}},mounted(t){if(console.log("All current sections in DOM:",document.querySelectorAll("section")),new MutationObserver(n=>{for(const o of n)if(o.type==="childList"&&o.addedNodes.length){const s=document.querySelectorAll(".k-section");s.length&&(console.log(`Sections detected: ${s.length}`),this.hideAllSections(),this.selectedItem&&this.activateSection(this.selectedItem.view))}}).observe(document.body,{childList:!0,subtree:!0}),this.navigation&&this.navigation.length){const n=this.navigation.map((s,c)=>({index:c,name:s.name||`nav-${Date.now()}`,label:s.label||"Untitled",icon:s.icon||"page",view:s.view||null})),o=this.navigation.findIndex(s=>s.view!=="heading");this.items=n,this.selectedIndex=o,this.selectMenuItem(this.selectedIndex)}const i=Array.from(document.querySelectorAll(".k-section"));if(i.forEach(n=>{n.setAttribute("data-tab-controlled","true")}),this.defaultSection){const n=document.querySelector(`.k-section-name-${this.defaultSection}`);n&&(n.style.display="block")}else i.length>0&&(i[0].style.display="block")},methods:{selectMenuItem(t){this.selectedIndex=t,this.items.forEach((e,i)=>{e.isActive=i===t}),this.selectedItem=this.items[t],console.log("selected: ",this.selectedItem.view),this.hideAllSections(),this.activateSection(this.selectedItem.view)},hideAllSections(){try{const t=document.querySelectorAll(".k-section");console.log(`Found ${t.length} sections`),t.length?(t.forEach(e=>{e.hidden=!0}),console.log(`Hidden ${t.length} sections`)):console.log("No sections found to hide")}catch(t){console.error("Error hiding sections:",t)}},activateSection(t){console.log("Activate: ",t);const e=document.querySelector(`.k-section-name-${t}`);e&&e.removeAttribute("hidden")}}};var u=function(){var e=this,i=e._self._c;return i("menu",{staticClass:"k-sidebar",attrs:{role:"navigation"}},[i("h2",[e._v("Sidebar")]),i("ul",{staticClass:"k-sidebar__list",attrs:{role:"menu","aria-orientation":"vertical"}},e._l(e.items,function(n,o){return i("li",{key:o,class:[n.view==="heading"?"k-sidebar-heading-item":"k-sidebar__list-item",e.selectedIndex===o?"k-sidebar__list-item--selected":""],attrs:{role:"presentation"}},[n.view==="heading"?i("div",{staticClass:"k-sidebar-heading",attrs:{role:"presentation"}},[e._v(" "+e._s(n.label)+" ")]):i("a",{staticClass:"k-sidebar__item",attrs:{id:`menuitem_${n.name}`,role:"menuitem","aria-controls":`k-section-name-${n.view}`,"aria-selected":e.selectedIndex===o,tabindex:e.selectedIndex===o?"0":"-1"},on:{click:function(s){return e.selectMenuItem(n.index)}}},[n.icon?i("span",{staticClass:"k-sidebar-tab-icon"},[i("k-icon",{attrs:{type:n.icon}})],1):e._e(),i("span",{staticClass:"k-sidebar-tab-label"},[e._v(e._s(n.label))])])])}),0)])},h=[],f=a(d,u,h);const m=f.exports;window.panel.plugin("2inchesofwater/panel-sidebar",{created(){console.log("Panel sidebar plugin initialized"),document.addEventListener("DOMContentLoaded",()=>{this.initializeSidebar()});const t=new MutationObserver(e=>{e.forEach(i=>{i.type==="childList"&&i.addedNodes.length&&this.initializeSidebar()})});setTimeout(()=>{const e=document.querySelector(".k-collection");e&&t.observe(e,{childList:!0,subtree:!0})},300)},sections:{sidebar:m},use:{plugin:function(){const t=document.createElement("style");t.textContent=`
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
      `,document.head.appendChild(t)}},methods:{initializeSidebar(){document.querySelectorAll(".k-section-name-sidebar").forEach(e=>{var s;const i=sidebar.__vue__;if(!i)return;const n=i.items||[];n.forEach(c=>{if(c.view&&c.view!=="heading"){const l=document.querySelector(`.k-section-name-${c.view}`);l&&(l.setAttribute("data-sidebar-section","true"),l.setAttribute("aria-labelledby",`menuitem_${c.name}`))}});const o=((s=i.currentItem)==null?void 0:s.view)||i.defaultView;if(o){let c=!1;if(n.forEach(l=>{if(l.view&&l.view!=="heading"){const r=document.querySelector(`.k-section-name-${l.view}`);r&&(l.view===o?(r.hidden=!1,c=!0):r.hidden=!0)}}),!c){const l=document.querySelector(`.k-section-name-${o}`);l&&(l.hidden=!1)}}else if(n.length>0){const c=n.find(l=>l.view!=="heading");c&&c.view&&i.selectItem(c)}})}}})})();
