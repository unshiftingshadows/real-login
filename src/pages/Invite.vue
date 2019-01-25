<template>
  <q-page padding>
    <q-card class="absolute-center login-card">
      <q-card-title align="center">
        <h4>Welcome to REAL Church!</h4>
        <p>{{ username }} invited you to collaborate with them on a {{ docType }}. Fill out the form below to get started!</p>
      </q-card-title>
      <q-card-main>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-field
              :error="$v.form.email.$error"
              error-label="Please enter a valid email address"
            >
              <q-input
                float-label="Email"
                type="email"
                v-model="form.email"
                @blur="$v.form.email.$touch"
              />
            </q-field>
          </div>
          <div class="col-6">
            <q-input
              float-label="First"
              v-model="form.name.first"
            />
          </div>
          <div class="col-6">
            <q-input
              float-label="Last"
              v-model="form.name.last"
            />
          </div>
          <div class="col-12">
            <q-field
              :error="$v.form.pswd.$error"
              error-label="Passwords must be at least 8 characters"
            >
              <q-input
                float-label="Password"
                type="password"
                v-model="form.pswd"
                @blur="$v.form.pswd.$touch"
                @keyup.enter="register(app)"
              />
            </q-field>
          </div>
        </div>
        <br/>
        <q-btn color="primary" @click="register(app)" label="Register" class="full-width" />
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { Notify, QCard, QCardTitle, QCardMain } from 'quasar'
export default {
  components: {
    QCard,
    QCardTitle,
    QCardMain
  },
  data () {
    return {
      form: {
        email: this.$route.query.e,
        pswd: '',
        name: {
          first: '',
          last: ''
        }
      },
      username: this.$route.query.u,
      docType: this.$route.query.d,
      app: this.$route.query.a,
      apps: {
        message: 8082,
        builder: 8083
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      pswd: {
        required,
        minLength: minLength(8)
      }
    }
  },
  async mounted () {
    if (!(await this.$firebase.checkTempUser(this.$route.query.e))) {
      this.$router.push('/')
    }
    // this.$firebase.auth.onAuthStateChanged((user) => {
    //   console.log('auth state changed')
    //   if (!user) {
    //     console.log('no user')
    //   } else {
    //     this.sendAuth(this.$route.params.app)
    //   }
    // })
  },
  methods: {
    register (app) {
      console.log('login', app)
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Notify.create('Please review fields again.')
        return
      }
      this.$firebase.auth.setPersistence(this.$firebase.app.auth.Auth.Persistence.LOCAL)
        .then(() => {
          console.log('persistence set')
          this.$firebase.auth.createUserWithEmailAndPassword(this.form.email, this.form.pswd)
            .then(async (user) => {
              console.log('logged in', user)
              try {
                await this.$firebase.addUserData(user.user.email, this.form.name, app)
                this.sendAuth(app)
              } catch (err) {
                Notify.create(err.message)
              }
            })
            .catch((err) => {
              Notify.create(err.message)
            })
        })
    },
    sendAuth (app) {
      if (app !== undefined) {
        this.$firebase.appAuth().then((res) => {
          console.log('auth', res)
          this.$cookie.set('realToken', res.data.customToken, { domain: process.env.DEV ? 'localhost' : 'realchurch.app' })
          // openURL(`https://${app}.realchurch.app/login2`)
          // openURL(`http://localhost:8083/login2`)
          var url = process.env.DEV ? `http://localhost:${this.apps[app]}/login2` : `https://${app}.realchurch.app/login2`
          window.open(url, '_self')
        })
      } else {
        console.log('something went wrong...')
      }
    }
  }
}
</script>

<style>

.login-card {
  width: 100%;
}

@media screen and (min-width: 600px) {
  .login-card {
    width: 550px;
    padding: 30px;
  }
}

.forgot-password-modal {
  padding: 30px;
  width: 100%;
  background-color: white;
}

.app-chooser-modal {
  padding: 30px;
  width: 100%;
  background-color: white;
}

@media screen and (min-width: 1200px) {
  .forgot-password-modal {
    min-width: 500px;
    width: 500px;
  }
  .app-chooser-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
