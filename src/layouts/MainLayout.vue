<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-avatar size="32px">
          <img :src="this.$store.state.global.bot.avatarUrl" />
        </q-avatar>
        <q-toolbar-title v-html="this.$store.state.global.bot.name"> </q-toolbar-title>

        <q-chip clickable>
          <q-avatar size="24px">
            <img :src="this.$store.state.global.user.photoUrl" />
          </q-avatar>
          <span v-html="this.$store.state.global.user.name"></span>
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-white-1">
      <q-scroll-area style="height: calc(100% - 164px); margin-top: 164px; border-right: 1px solid #ddd;">
        <q-list>
          <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
      <q-list class="absolute-top" style="border-bottom: 1px solid #ddd;">
        <q-item v-ripple style="padding: 0 0 20px 0;border-right: 1px solid #ddd;">
          <q-img contain position="0 0" height="60px" src="images/wv_top_small.png"> </q-img>
        </q-item>
        <q-item v-ripple style="padding: 0 0 20px 0;border-right: 1px solid #ddd;">
          <q-item-section side>
            <q-avatar rounded size="48px">
              <img :src="this.$store.state.global.bot.avatarUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="this.$store.state.global.bot.name"></q-item-label>
            <q-item-label overline>Your Digital Buddy!</q-item-label>
            <q-item-label caption lines="1">
              <q-btn key="Personalize" align="left" color="warning" outline no-caps size="sm" label="Personalize" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';

const linksData = [
  {
    title: 'Chat',
    caption: 'Get assistance on your routine tasks',
    icon: 'question_answer',
    link: 'chat',
    color: 'primary'
  },
  {
    title: 'Notifications',
    caption: 'Take a look at and act on your notifications',
    icon: 'notifications',
    link: 'notifications',
    color: 'accent'
  },
  {
    title: 'Settings',
    caption: 'Personalize my behaviour',
    icon: 'settings',
    link: 'settings',
    color: 'secondary'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    };
  },
  created() {
    console.log(this.$store.state.global.bot.avatarUrl);
    console.log(this.$store.state.global.user.photoUrl);
  }
};
</script>
