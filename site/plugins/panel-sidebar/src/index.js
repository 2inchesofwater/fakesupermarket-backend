import Sidebar from "./components/sidebar.vue";
import './panel-sidebar.css';
// Register the plugin with Kirby Panel
window.panel.plugin("2inchesofwater/panel-sidebar", {

  sections: {
    sidebar: Sidebar
  },

});