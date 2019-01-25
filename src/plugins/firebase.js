// import something here
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/firestore'

/**
 * Settings for dev firebase instance
 * @const {object}
 */
const devSettings = {
  apiKey: 'AIzaSyAjXGlux1zLL4QfEi4an2-KkIT4F6HxtMc',
  authDomain: 'real-dev-7b60c.firebaseapp.com',
  databaseURL: 'https://real-dev-7b60c.firebaseio.com',
  projectId: 'real-dev-7b60c',
  storageBucket: 'real-dev-7b60c.appspot.com',
  messagingSenderId: '945338183181'
}

/**
 * Settings for production firebase instance
 * @const {object}
 */
const prodSettings = {
  apiKey: 'AIzaSyCAsGVxjcBRsSNlQsymRnzWQAAYqphmmVU',
  authDomain: 'real-45953.firebaseapp.com',
  databaseURL: 'https://real-45953.firebaseio.com',
  projectId: 'real-45953',
  storageBucket: 'real-45953.appspot.com',
  messagingSenderId: '231971009763'
}

/**
 * Main firebase instance
 * @const {firebase.app.App}
 */
const fbapp = firebase.initializeApp(process.env.DEV ? devSettings : prodSettings)

async function checkTempUser (email) {
  try {
    return (await fbapp.firestore().collection('userTemp').doc(email).get()).exists
  } catch (err) {
    console.log(err)
    return false
  }
}

function addUserData (email, name, app, churchid) {
  const addUserDataFunction = fbapp.functions().httpsCallable('user-addUserData')
  return addUserDataFunction({ email, name, app, churchid })
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$firebase = {
    app: fbapp.firebase_,
    auth: fbapp.auth(),
    functions: fbapp.functions().httpsCallable,
    appAuth: fbapp.functions().httpsCallable('user-appAuth'),
    checkTempUser,
    addUserData
  }
}
