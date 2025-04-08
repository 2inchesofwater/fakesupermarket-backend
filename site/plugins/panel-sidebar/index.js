(function(){"use strict";function c(o,e,n,i,t,s,r,m){var a=typeof o=="function"?o.options:o;return e&&(a.render=e,a.staticRenderFns=n,a._compiled=!0),{exports:o,options:a}}console.log("things");const l={props:{navigation:{type:Array,default:()=>[]},items:{type:Array,default:()=>[]},defaultView:String}};var d=function(){var e=this,n=e._self._c;return n("section",{staticClass:"k-sidebar-section k-section-name-sidebar",attrs:{role:"navigation"}},[n("ul",{staticClass:"k-sidebar__list test1",attrs:{role:"menu","aria-orientation":"vertical"}},e._l(e.items,function(i){return n("li",{key:i.name,class:[i.view==="heading"?"k-sidebar-heading-item":"k-sidebar__list-item",e.currentItem&&e.currentItem.name===i.name?"k-sidebar__list-item--selected":""],attrs:{role:"presentation"}},[i.view==="heading"?n("div",{staticClass:"k-sidebar-heading",attrs:{role:"presentation"}},[e._v(" "+e._s(i.label)+" ")]):n("a",{staticClass:"k-sidebar__item",attrs:{href:`#${i.view}`,id:`menuitem_${i.name}`,role:"menuitem","aria-controls":i.view,"aria-selected":e.currentItem&&e.currentItem.name===i.name,tabindex:e.currentItem&&e.currentItem.name===i.name?"0":"-1"},on:{click:function(t){return t.preventDefault(),e.selectItem(i)},keydown:[function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"space",32,t.key,[" ","Spacebar"])?null:(t.preventDefault(),e.selectItem(i))},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:(t.preventDefault(),e.selectItem(i))},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"down",40,t.key,["Down","ArrowDown"])?null:(t.preventDefault(),e.focusNextItem.apply(null,arguments))},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"up",38,t.key,["Up","ArrowUp"])?null:(t.preventDefault(),e.focusPreviousItem.apply(null,arguments))}]}},[i.icon?n("span",{staticClass:"k-sidebar-tab-icon"},[n("k-icon",{attrs:{type:i.icon}})],1):e._e(),n("span",{staticClass:"k-sidebar-tab-label"},[e._v(e._s(i.label))])])])}),0)])},u=[],p=c(l,d,u);const f=p.exports;window.panel.plugin("2inchesofwater/panel-sidebar",{created(){console.log("Panel sidebar plugin initialized");const o=new MutationObserver(e=>{e.forEach(n=>{n.type==="childList"&&n.addedNodes.length&&this.initializeSections()})});setTimeout(()=>{const e=document.querySelector(".k-collection");e&&(o.observe(e,{childList:!0,subtree:!0}),this.initializeSections())},100)},sections:{sidebar:f},use:{plugin:function(){const o=document.createElement("style");o.textContent=`
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
      `,document.head.appendChild(o),window.addEventListener("sidebar-tab-changed",function(e){if(e.detail&&e.detail.viewName){const n=e.detail.viewName;document.querySelectorAll('[data-sidebar-controlled="true"]').forEach(s=>{s.classList.remove("is-active")});const t=document.querySelector(`.k-section-name-${n}`);if(t)t.classList.add("is-active"),console.log(`Activated section: ${n}`);else{console.log(`Section ${n} not found yet, will retry`);const s=new MutationObserver(function(m){const a=document.querySelector(`.k-section-name-${n}`);a&&(a.setAttribute("data-sidebar-controlled","true"),a.classList.add("is-active"),console.log(`Found and activated section: ${n}`),s.disconnect())}),r=document.querySelector(".k-collection");r&&(s.observe(r,{childList:!0,subtree:!0}),setTimeout(()=>s.disconnect(),5e3))}}})}},views:{"sidebar-content":{component:{props:{content:String},template:`
          <div class="k-sidebar-content-view">
            <k-text>{{ content || 'Content view' }}</k-text>
          </div>
        `}},"sidebar-message":{component:{props:{message:{type:String,default:"No content to display"},icon:{type:String,default:"info"}},template:`
          <div class="k-sidebar-message-view">
            <k-icon :type="icon" size="large" class="k-sidebar-message-icon" />
            <k-text align="center">{{ message }}</k-text>
          </div>
        `}}},methods:{getPanelId(o){return`panel-${o}`},hasView(o){var e,n;return!!((n=(e=window.panel)==null?void 0:e.views)!=null&&n[o])},initializeSections(){console.log("Initializing sections for sidebar");const o=document.querySelectorAll('[data-sidebar-controlled="true"]'),e=Array.from(o).some(n=>n.classList.contains("is-active"));if(o.length&&!e){console.log("No active section found, activating default");const n=document.querySelector(".k-section-name-sidebar");if(n){const i=n.__vue__;if(i&&i.defaultView){const t=document.querySelector(`.k-section-name-${i.defaultView}`);t&&(t.classList.add("is-active"),console.log(`Activated default section: ${i.defaultView}`))}else o[0]&&(o[0].classList.add("is-active"),console.log("Activated first section"))}}}}})})();
