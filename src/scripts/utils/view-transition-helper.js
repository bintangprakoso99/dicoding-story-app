const ViewTransitionHelper = {
  async transition(callback) {
    if (!document.startViewTransition) {
      callback()
      return
    }

    const transition = document.startViewTransition(callback)
    return transition.finished
  },

  // Custom transitions for specific elements
  async fadeTransition(element, callback) {
    if (!document.startViewTransition) {
      callback()
      return
    }

    element.style.viewTransitionName = "fade-transition"

    const transition = document.startViewTransition(callback)
    return transition.finished
  },

  async slideTransition(element, callback) {
    if (!document.startViewTransition) {
      callback()
      return
    }

    element.style.viewTransitionName = "slide-transition"

    const transition = document.startViewTransition(callback)
    return transition.finished
  },
}

export default ViewTransitionHelper
