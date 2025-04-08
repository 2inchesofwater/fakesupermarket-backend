<script>
  export default {

  data () {
    return {
      selectedIndex: 0, // the index of the selected tab,
    }
  },

  mounted () {
    this.selectItem(0)
  },
  methods: {
    selectItem (i) {
      this.selectedIndex = i

      // loop over all the tabs
      this.items.forEach((item, index) => {
        item.isActive = (index === i)
      })
    }
  }
}
</script>
