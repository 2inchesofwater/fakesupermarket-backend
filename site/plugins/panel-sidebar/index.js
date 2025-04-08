(function(){"use strict";function l(n,e,t,i,s,r,o,a){var c=typeof n=="function"?n.options:n;return e&&(c.render=e,c.staticRenderFns=t,c._compiled=!0),{exports:n,options:c}}const d={props:{navigation:{type:Array,default:()=>[]},items:{type:Array,default:()=>[]},defaultView:String},computed:{console:()=>console,window:()=>window},data(){return{items:[],selectedIndex:null,selectedItem:null}},mounted(n){if(new MutationObserver(i=>{for(const s of i)s.type==="childList"&&s.addedNodes.length&&document.querySelectorAll(".k-section").length&&(this.hideAllSections(),this.selectedItem&&this.activateSection(this.selectedItem.view))}).observe(document.body,{childList:!0,subtree:!0}),this.navigation&&this.navigation.length){const i=this.navigation.map((r,o)=>({index:o,name:r.name||`nav-${Date.now()}`,label:r.label||"Untitled",icon:r.icon||"page",view:r.view||null})),s=this.navigation.findIndex(r=>r.view!=="heading");this.items=i,this.selectedIndex=s,this.selectMenuItem(this.selectedIndex)}const t=Array.from(document.querySelectorAll(".k-section"));if(t.forEach(i=>{i.setAttribute("data-tab-controlled","true")}),this.defaultSection){const i=document.querySelector(`.k-section-name-${this.defaultSection}`);i&&(i.style.display="block")}else t.length>0&&(t[0].style.display="block")},methods:{selectMenuItem(n){this.selectedIndex=n,this.items.forEach((e,t)=>{e.isActive=t===n}),this.selectedItem=this.items[n],this.hideAllSections(),this.activateSection(this.selectedItem.view)},hideAllSections(){try{const n=document.querySelectorAll(".k-section");n.length&&n.forEach(e=>{e.hidden=!0})}catch(n){console.error("Error hiding sections:",n)}},activateSection(n){const e=document.querySelector(`.k-section-name-${n}`);e&&e.removeAttribute("hidden")}}};var u=function(){var e=this,t=e._self._c;return t("menu",{staticClass:"k-sidebar",attrs:{role:"navigation"}},[t("ul",{staticClass:"k-sidebar__list",attrs:{role:"menu","aria-orientation":"vertical"}},e._l(e.items,function(i,s){return t("li",{key:s,class:[i.view==="heading"?"k-sidebar-heading-item":"k-sidebar__list-item",e.selectedIndex===s?"k-sidebar__list-item--selected":""],attrs:{role:"presentation"}},[i.view==="heading"?t("div",{staticClass:"k-sidebar-heading",attrs:{role:"presentation"}},[e._v(" "+e._s(i.label)+" ")]):t("a",{staticClass:"k-sidebar__item",attrs:{id:`menuitem_${i.name}`,role:"menuitem","aria-controls":`k-section-name-${i.view}`,"aria-selected":e.selectedIndex===s,tabindex:e.selectedIndex===s?"0":"-1"},on:{click:function(r){return e.selectMenuItem(i.index)}}},[i.icon?t("span",{staticClass:"k-sidebar-tab-icon"},[t("k-icon",{attrs:{type:i.icon}})],1):e._e(),t("span",{staticClass:"k-sidebar-tab-label"},[e._v(e._s(i.label))])])])}),0)])},h=[],f=l(d,u,h);const m=f.exports;window.panel.plugin("2inchesofwater/panel-sidebar",{created(){document.addEventListener("DOMContentLoaded",()=>{this.initializeSidebar()});const n=new MutationObserver(e=>{e.forEach(t=>{t.type==="childList"&&t.addedNodes.length&&this.initializeSidebar()})});setTimeout(()=>{const e=document.querySelector(".k-collection");e&&n.observe(e,{childList:!0,subtree:!0})},300)},sections:{sidebar:m},use:{plugin:function(){const n=document.createElement("style");n.textContent=`
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
      `,document.head.appendChild(n)}},methods:{initializeSidebar(){document.querySelectorAll(".k-section-name-sidebar").forEach(e=>{var r;const t=sidebar.__vue__;if(!t)return;const i=t.items||[];i.forEach(o=>{if(o.view&&o.view!=="heading"){const a=document.querySelector(`.k-section-name-${o.view}`);a&&(a.setAttribute("data-sidebar-section","true"),a.setAttribute("aria-labelledby",`menuitem_${o.name}`))}});const s=((r=t.currentItem)==null?void 0:r.view)||t.defaultView;if(s){let o=!1;if(i.forEach(a=>{if(a.view&&a.view!=="heading"){const c=document.querySelector(`.k-section-name-${a.view}`);c&&(a.view===s?(c.hidden=!1,o=!0):c.hidden=!0)}}),!o){const a=document.querySelector(`.k-section-name-${s}`);a&&(a.hidden=!1)}}else if(i.length>0){const o=i.find(a=>a.view!=="heading");o&&o.view&&t.selectItem(o)}})}}})})();
