(function(){"use strict";function l(t,e,i,n,a,c,s,o){var r=typeof t=="function"?t.options:t;return e&&(r.render=e,r.staticRenderFns=i,r._compiled=!0),{exports:t,options:r}}const d={props:{navigation:{type:Array,default:()=>[]},items:{type:Array,default:()=>[]},defaultView:String},watch:{navigation:{immediate:!0,handler(t){if(t&&t.length&&(!this.items||this.items.length===0)){const e=t.map((n,a)=>({index:a,name:n.name||`nav-${Date.now()}`,label:n.label||"Untitled",icon:n.icon||"page",view:n.view||null})),i=t.findIndex(n=>n.view!=="heading");this.$set(this,"items",e),this.selectedIndex=i!==-1?i:0}}}},computed:{console:()=>console,window:()=>window},created(){const t=Array.from(document.querySelectorAll(".k-section"));if(t.forEach(e=>{e.setAttribute("data-tab-controlled","true"),e.hidden=!0}),this.defaultSection){const e=document.querySelector(`.k-section-name-${this.defaultSection}`);e&&(e.style.display="block")}else t.length>0&&(t[0].style.display="block")},data(){return{selectedIndex:null}},mounted(){},methods:{selectMenuItem(t){console.log(t),this.selectedIndex=t,this.items.forEach((i,n)=>{i.isActive=n===t});const e=this.items[t];console.log("selected: ",e.index),this.activateSection(e.view)},activateSection(t){document.querySelectorAll(".k-sections .k-section").forEach(i=>{i.hidden=!0});const e=document.querySelector(`.k-section-name-${t}`);e&&e.removeAttribute("hidden")}}};var u=function(){var e=this,i=e._self._c;return i("menu",{staticClass:"k-sidebar",attrs:{role:"navigation"}},[i("h2",[e._v("Sidebar")]),i("ul",{staticClass:"k-sidebar__list",attrs:{role:"menu","aria-orientation":"vertical"}},e._l(e.items,function(n,a){return i("li",{key:a,class:[n.view==="heading"?"k-sidebar-heading-item":"k-sidebar__list-item",e.selectedIndex===a?"k-sidebar__list-item--selected":""],attrs:{role:"presentation"}},[n.view==="heading"?i("div",{staticClass:"k-sidebar-heading",attrs:{role:"presentation"}},[e._v(" "+e._s(n.label)+" ")]):i("a",{staticClass:"k-sidebar__item",attrs:{id:`menuitem_${n.name}`,role:"menuitem","aria-controls":`k-section-name-${n.view}`,"aria-selected":e.selectedIndex===a,tabindex:e.selectedIndex===a?"0":"-1"},on:{click:function(c){return e.selectMenuItem(n.index)}}},[n.icon?i("span",{staticClass:"k-sidebar-tab-icon"},[i("k-icon",{attrs:{type:n.icon}})],1):e._e(),i("span",{staticClass:"k-sidebar-tab-label"},[e._v(e._s(n.label))])])])}),0)])},f=[],h=l(d,u,f);const m=h.exports;window.panel.plugin("2inchesofwater/panel-sidebar",{created(){console.log("Panel sidebar plugin initialized"),document.addEventListener("DOMContentLoaded",()=>{this.initializeSidebar()});const t=new MutationObserver(e=>{e.forEach(i=>{i.type==="childList"&&i.addedNodes.length&&this.initializeSidebar()})});setTimeout(()=>{const e=document.querySelector(".k-collection");e&&t.observe(e,{childList:!0,subtree:!0})},300)},sections:{sidebar:m},use:{plugin:function(){const t=document.createElement("style");t.textContent=`
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
      `,document.head.appendChild(t)}},methods:{initializeSidebar(){document.querySelectorAll(".k-section-name-sidebar").forEach(e=>{var c;const i=sidebar.__vue__;if(!i)return;const n=i.items||[];n.forEach(s=>{if(s.view&&s.view!=="heading"){const o=document.querySelector(`.k-section-name-${s.view}`);o&&(o.setAttribute("data-sidebar-section","true"),o.setAttribute("aria-labelledby",`menuitem_${s.name}`))}});const a=((c=i.currentItem)==null?void 0:c.view)||i.defaultView;if(a){let s=!1;if(n.forEach(o=>{if(o.view&&o.view!=="heading"){const r=document.querySelector(`.k-section-name-${o.view}`);r&&(o.view===a?(r.hidden=!1,s=!0):r.hidden=!0)}}),!s){const o=document.querySelector(`.k-section-name-${a}`);o&&(o.hidden=!1)}}else if(n.length>0){const s=n.find(o=>o.view!=="heading");s&&s.view&&i.selectItem(s)}})}}})})();
