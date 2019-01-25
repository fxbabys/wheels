export default {
  methods: {
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) name = parent.$options.name
      }

      if (parent) parent.$emit.apply(parent, [eventName].concat(params))
    },
    broadcast (componentName, eventName, params) {
      const _this = this
      this.children.forEach(child => {
        let name = child.$options.name

        if (name === componentName) {
          child.$emit.apply(child, [eventName].concat(params))
        } else {
          _this.apply(child, [componentName, eventName].concat(params))
        }
      })
    }
  }
}