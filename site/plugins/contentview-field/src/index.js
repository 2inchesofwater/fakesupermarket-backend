import ContentView from "./components/ContentView.vue";

// Register the field component
panel.plugin("2inchesofwater/contentview-field", {
  fields: {
    contentview: ContentView
  }
});