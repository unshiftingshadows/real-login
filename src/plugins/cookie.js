import VueCookie from 'vue-cookie'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VueCookie)
}
