console.log("Contentview field script loaded!");

panel.plugin('2inchesofwater/contentview-field', {
  fields: {
    contentview: {
      props: {
        label: String,
        name: String,
        text: {
          type: [String, Number, Boolean, Array, Object],
          default: null
        }
      },
      template: /* html */ `
        <k-field :label="label" :name="name" class="k-contentview-field">
          <k-box >
            {{ text }}
          </k-box>
        </k-field>
      `,
      css: `
        .k-contentview-container {
          font-size: var(--text-base);
          line-height: 1.5;
          padding: .75rem 1rem;
          background: var(--color-gray-100);
          border-radius: var(--rounded);
        }
      `
    }
  }
});
