<template>
  <q-page padding>
    <q-card class="absolute-center login-card">
      <q-card-title align="center">
        <h4>Login</h4>
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
                @keyup.enter="login(app)"
              />
            </q-field>
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
                @keyup.enter="login(app)"
              />
            </q-field>
          </div>
        </div>
        <br/>
        <q-btn color="primary" @click="login(app)" label="Login" class="full-width" />
        <q-btn color="negative" outline @click="forgot" label="Forgot Password" class="full-width" style="margin-top: 10px;" />
      </q-card-main>
    </q-card>
    <q-modal v-model="forgotPassword" ref="forgotPasswordModal" content-classes="forgot-password-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="forgotPassword = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Forgot Password</h4>
        </div>
        <div class="col-12">
          <q-field
            :error="$v.form.email.$error"
            error-label="Please enter a valid email address"
          >
            <q-input v-model="form.email" float-label="Email" />
          </q-field>
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="resetPassword">Send Email</q-btn>
        </div>
      </div>
    </q-modal>
    <q-modal v-model="appChooser" ref="appChooserModal" content-classes="app-chooser-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="appChooser = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Which app would you like to access?</h4>
        </div>
        <div class="col-12">
          <q-btn class="full-width" color="primary" @click="openApp('message')">Message</q-btn>
          <q-btn class="full-width" color="primary" @click="openApp('curriculum')">Curriculum</q-btn>
          <q-btn class="full-width" color="primary" @click="openApp('builder')">Builder</q-btn>
        </div>
      </div>
    </q-modal>
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
        email: '',
        pswd: ''
      },
      forgotPassword: false,
      appChooser: false,
      app: this.$route.params.app,
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
  mounted () {
    this.$firebase.auth.onAuthStateChanged((user) => {
      console.log('auth state changed')
      if (!user) {
        console.log('no user')
      } else {
        this.sendAuth(this.$route.params.app)
      }
    })
  },
  methods: {
    login (app) {
      console.log('login', app)
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Notify.create('Please review fields again.')
        return
      }
      this.$firebase.auth.setPersistence(this.$firebase.app.auth.Auth.Persistence.LOCAL)
        .then(() => {
          console.log('persistence set')
          this.$firebase.auth.signInWithEmailAndPassword(this.form.email, this.form.pswd)
            .then((user) => {
              console.log('logged in')
              this.sendAuth(app)
            })
            .catch((err) => {
              Notify.create(err.message)
            })
        })
    },
    sendAuth (app) {
      this.$firebase.appAuth().then((res) => {
        console.log('auth', res)
        this.$cookie.set('realToken', res.data.customToken, { domain: process.env.DEV ? 'localhost' : 'realchurch.app' })
        if (app !== undefined) {
          // openURL(`https://${app}.realchurch.app/login2`)
          // openURL(`http://localhost:8083/login2`)
          var url = process.env.DEV ? `http://localhost:${this.apps[app]}/login2` : `https://${app}.realchurch.app/login2`
          window.open(url, '_self')
        } else {
          this.appChooser = true
        }
      })
    },
    openApp (app) {
      console.log('app', app)
      var url = process.env.DEV ? `http://localhost:${this.apps[app]}/login2` : `https://${app}.realchurch.app/login2`
      // openURL(url)
      window.open(url, '_self')
    },
    forgot () {
      this.$v.form.email.$touch()
      if (this.$v.form.email.$error) {
        this.forgotPassword = true
      } else {
        this.resetPassword()
      }
    },
    resetPassword () {
      this.$firebase.auth.sendPasswordResetEmail(this.form.email, {
        url: 'https://login.realchurch.app'
      }).then(() => {
        this.forgotPassword = false
        Notify.create({
          type: 'positive',
          message: 'Check your email for a link to reset your password',
          position: 'bottom-left'
        })
      }).catch((err) => {
        Notify.create(err.message)
      })
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
