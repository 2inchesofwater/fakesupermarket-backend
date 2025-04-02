<template>
  <k-field
    :label="label"
    :help="help"
    class="k-contentview-field"
    :class="extraClass"
  >
    <div class="k-contentview-container">
      <div
        class="k-contentview-text"
        v-html="formattedContent"
      ></div>
    </div>
  </k-field>
</template>

<script>
export default {
  props: {
    label: String,
    help: String,
    value: String,
    formatted: {
      type: Boolean,
      default: true
    },
    class: String
  },
  data() {
    return {
      formattedContent: ''
    };
  },
  computed: {
    extraClass() {
      return this.class ? this.class : '';
    }
  },
  watch: {
    value: {
      handler() {
        this.render();
      },
      immediate: true
    }
  },
  methods: {
    render() {
      if (!this.value) {
        this.formattedContent = '';
        return;
      }

      this.$api.post('fields/contentview/render', {
        content: this.value,
        formatted: this.formatted
      }).then(response => {
        this.formattedContent = response;
      }).catch(error => {
        this.formattedContent = this.formatted ? this.value : this.value;
      });
    }
  }
};
</script>

<style>
.k-contentview-field {
  position: relative;
}

.k-contentview-container {
  font-size: var(--text-base);
  line-height: 1.5;
  padding: .75rem 1rem;
  background: var(--color-gray-100);
  border-radius: var(--rounded);
  overflow-x: auto;
}

.k-contentview-text {
  white-space: pre-wrap;
}

.k-contentview-text p:first-child {
  margin-top: 0;
}

.k-contentview-text p:last-child {
  margin-bottom: 0;
}
</style>