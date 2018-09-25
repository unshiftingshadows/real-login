<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar style="min-height: 250px;">
        <q-toolbar-title>
          <img src="https://s3.amazonaws.com/realchurch-promo/logos/logo_church%401x.png" class="xs header-logo" style="margin-top: 20px;" />
          <!-- <div class="q-display-2 xs" style="text-align: center">REAL Builder</div> -->
          <img src="https://s3.amazonaws.com/realchurch-promo/logos/logo_church%401x.png" class="header-logo gt-xs" />
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'DefaultLayout',
  data () {
    return {}
  },
  methods: {
    openURL
  }
}
</script>

<style>

.header-logo {
  width: 100%;
  /* max-width: 150px;
  max-height: 150px; */
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* @media screen and (min-width: 576px) {
  .header-logo {
    max-width: 100%;
  }
} */

@media screen and (min-width: 1200px) {
  .header-logo {
    width: 100%;
    /* max-width: 1190px;
    max-height: 150px; */
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>
