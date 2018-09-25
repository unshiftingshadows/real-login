import axios from 'axios'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
  // Vue.https.headers.common['Access-Control-Allow-Origin'] = '*'
  // Vue.https.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
  // Vue.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*')
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  //   next()
  // })
}
