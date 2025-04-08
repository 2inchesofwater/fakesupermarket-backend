(function(){"use strict";function c(t,e,n,s,i,a,r,p){var o=typeof t=="function"?t.options:t;return e&&(o.render=e,o.staticRenderFns=n,o._compiled=!0),{exports:t,options:o}}const l={props:{navigation:{type:Array,default:()=>[]},items:{type:Array,default:()=>[]},defaultView:String},watch:{navigation:{immediate:!0,handler(t){if(t&&t.length&&(!this.items||this.items.length===0)){console.log("Processing navigation from props",t);const e=t.map(n=>({name:n.name||`nav-${Date.now()}`,label:n.label||"Untitled",icon:n.icon||"page",view:n.view||null}));this.$set(this,"items",e)}}}},data(){return{currentItem:null}},mounted(){this.$nextTick(()=>{if(this.initializeSections(),this.items&&this.items.length>0){if(this.defaultView){const e=this.items.find(n=>n.view===this.defaultView);if(e){this.selectItem(e);return}}const t=this.items.find(e=>e.view!=="heading");t&&this.selectItem(t)}})},methods:{selectItem(t){t.view!=="heading"&&(this.currentItem=t,this.showSection(t.view))},initializeSections(){this.items.filter(e=>e.view&&e.view!=="heading").map(e=>e.view).forEach(e=>{const n=document.getElementById(e);n&&(n.hidden=!0,n.setAttribute("aria-labelledby",`menuitem_${e.replace("fields-","")}`))})},showSection(t){document.querySelectorAll(".k-fields-section").forEach(s=>{s.hidden=!0});const n=document.getElementById(t);n&&(n.hidden=!1)},focusNextItem(){const t=this.getMenuItems();if(t.length===0)return;const n=(this.getCurrentMenuItemIndex(t)+1)%t.length;this.focusMenuItem(t[n])},focusPreviousItem(){const t=this.getMenuItems();if(t.length===0)return;const n=(this.getCurrentMenuItemIndex(t)-1+t.length)%t.length;this.focusMenuItem(t[n])},getMenuItems(){return Array.from(this.$el.querySelectorAll(".k-sidebar__item"))},getCurrentMenuItemIndex(t){const e=document.activeElement;return t.indexOf(e)},focusMenuItem(t){t&&t.focus()}}};var d=function(){var e=this,n=e._self._c;return n("section",{staticClass:"k-sidebar-section k-section-name-sidebar",attrs:{role:"navigation"}},[n("ul",{staticClass:"k-sidebar__list test1",attrs:{role:"menu","aria-orientation":"vertical"}},e._l(e.items,function(s){return n("li",{key:s.name,class:[s.view==="heading"?"k-sidebar-heading-item":"k-sidebar__list-item",e.currentItem&&e.currentItem.name===s.name?"k-sidebar__list-item--selected":""],attrs:{role:"presentation"}},[s.view==="heading"?n("div",{staticClass:"k-sidebar-heading",attrs:{role:"presentation"}},[e._v(" "+e._s(s.label)+" ")]):n("a",{staticClass:"k-sidebar__item",attrs:{href:`#${s.view}`,id:`menuitem_${s.name}`,role:"menuitem","aria-controls":s.view,"aria-selected":e.currentItem&&e.currentItem.name===s.name,tabindex:e.currentItem&&e.currentItem.name===s.name?"0":"-1"},on:{click:function(i){return i.preventDefault(),e.selectItem(s)},keydown:[function(i){return!i.type.indexOf("key")&&e._k(i.keyCode,"space",32,i.key,[" ","Spacebar"])?null:(i.preventDefault(),e.selectItem(s))},function(i){return!i.type.indexOf("key")&&e._k(i.keyCode,"enter",13,i.key,"Enter")?null:(i.preventDefault(),e.selectItem(s))},function(i){return!i.type.indexOf("key")&&e._k(i.keyCode,"down",40,i.key,["Down","ArrowDown"])?null:(i.preventDefault(),e.focusNextItem.apply(null,arguments))},function(i){return!i.type.indexOf("key")&&e._k(i.keyCode,"up",38,i.key,["Up","ArrowUp"])?null:(i.preventDefault(),e.focusPreviousItem.apply(null,arguments))}]}},[s.icon?n("span",{staticClass:"k-sidebar-tab-icon"},[n("k-icon",{attrs:{type:s.icon}})],1):e._e(),n("span",{staticClass:"k-sidebar-tab-label"},[e._v(e._s(s.label))])])])}),0)])},u=[],m=c(l,d,u);const f=m.exports;window.panel.plugin("2inchesofwater/panel-sidebar",{created(){console.log("Panel sidebar plugin initialized");const t=new MutationObserver(e=>{e.forEach(n=>{n.type==="childList"&&n.addedNodes.length&&this.initializeSections()})});setTimeout(()=>{const e=document.querySelector(".k-collection");e&&(t.observe(e,{childList:!0,subtree:!0}),this.initializeSections())},100)},sections:{sidebar:f},use:{plugin:function(){const t=document.createElement("style");t.textContent=`
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
      `,document.head.appendChild(t),window.addEventListener("sidebar-tab-changed",function(e){if(e.detail&&e.detail.viewName){const n=e.detail.viewName;document.querySelectorAll('[data-sidebar-controlled="true"]').forEach(a=>{a.classList.remove("is-active")});const i=document.querySelector(`.k-section-name-${n}`);if(i)i.classList.add("is-active"),console.log(`Activated section: ${n}`);else{console.log(`Section ${n} not found yet, will retry`);const a=new MutationObserver(function(p){const o=document.querySelector(`.k-section-name-${n}`);o&&(o.setAttribute("data-sidebar-controlled","true"),o.classList.add("is-active"),console.log(`Found and activated section: ${n}`),a.disconnect())}),r=document.querySelector(".k-collection");r&&(a.observe(r,{childList:!0,subtree:!0}),setTimeout(()=>a.disconnect(),5e3))}}})}},views:{"sidebar-content":{component:{props:{content:String},template:`
          <div class="k-sidebar-content-view">
            <k-text>{{ content || 'Content view' }}</k-text>
          </div>
        `}},"sidebar-message":{component:{props:{message:{type:String,default:"No content to display"},icon:{type:String,default:"info"}},template:`
          <div class="k-sidebar-message-view">
            <k-icon :type="icon" size="large" class="k-sidebar-message-icon" />
            <k-text align="center">{{ message }}</k-text>
          </div>
        `}}},methods:{getPanelId(t){return`panel-${t}`},hasView(t){var e,n;return!!((n=(e=window.panel)==null?void 0:e.views)!=null&&n[t])},initializeSections(){console.log("Initializing sections for sidebar");const t=document.querySelectorAll('[data-sidebar-controlled="true"]'),e=Array.from(t).some(n=>n.classList.contains("is-active"));if(t.length&&!e){console.log("No active section found, activating default");const n=document.querySelector(".k-section-name-sidebar");if(n){const s=n.__vue__;if(s&&s.defaultView){const i=document.querySelector(`.k-section-name-${s.defaultView}`);i&&(i.classList.add("is-active"),console.log(`Activated default section: ${s.defaultView}`))}else t[0]&&(t[0].classList.add("is-active"),console.log("Activated first section"))}}}}})})();
