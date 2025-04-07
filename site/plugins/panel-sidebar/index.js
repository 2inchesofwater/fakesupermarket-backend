console.log("Panel sidebar script loaded!");

panel.plugin('2inchesofwater/panel-sidebar', {
  fields: {
    sidebar: {
      props: {
        label: String,
        name: String,
        value: {
          type: [String, Number, Boolean, Array, Object],
          default: null
        }
      },
      template: /* html */ `
        <k-field :label="label" :name="name" class="k-sidebar">
          <k-box >
            Sidebar
          </k-box>
        </k-field>
      `,
      css: `
        .k-sidebar {
          
        }
      `
    }
  }
});
