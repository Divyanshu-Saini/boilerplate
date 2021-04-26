<template>
  <q-item clickable v-ripple :to="link">
    <q-item-section v-if="icon" avatar>
      <q-avatar :color="color" text-color="white" :icon="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption lines="2">
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    color: {
      type: String,
      default: 'primary'
    }
  }
};
</script>
