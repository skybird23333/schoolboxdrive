<template>
  <div class="card" :class="`${color ? `color-${color}` : ''} ${background ? 'background' : ''}`">
    <div class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color?: 'red' | 'green' | 'blue' | 'yellow'
  background?: boolean
}>()
</script>