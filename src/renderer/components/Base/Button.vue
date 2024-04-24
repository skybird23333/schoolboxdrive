<template>
  <button class="button" :class="type" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { type, disabled } = defineProps({
  type: {
    default: ''
  },
  disabled: {
    type: Boolean
  }
})
</script>