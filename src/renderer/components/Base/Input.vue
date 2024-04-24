<template>
  <input
      class="input"
      :class="{ error: isError }"
      :disabled="disabled"
      v-model="value"
  />
</template>

<script setup lang="ts">
import {defineProps, defineEmits, computed} from 'vue';

const value = defineModel()

const props = defineProps({
  disabled: Boolean,
  isError: Boolean,
});

const emit = defineEmits(['update:modelValue']); // For emitting v-model changes

// In Composition API, we don't need to use ref for props
// Instead, we directly use them from the props object
</script>
