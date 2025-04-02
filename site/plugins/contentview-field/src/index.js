import ContentView from "./components/ContentView.vue";

// Register the field component
panel.plugin("dangilmore/contentview-field", {
  fields: {
    contentview: ContentView
  }
});