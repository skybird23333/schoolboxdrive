<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import Card from "../Base/Card.vue";

const props = defineProps({
  // Define any props here
});

const emit = defineEmits(['cardClicked']);

const handleClick = () => {
  emit('cardClicked');
};
</script>

<template>
  <Card @click="handleClick">
    <slot></slot>
  </Card>
</template>

<style scoped>
.card:hover {
  /* Card styles here */
  cursor: pointer;
}
</style>