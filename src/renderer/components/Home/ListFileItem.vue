<script setup lang="ts">

import Card from "../Base/Card.vue";
import BaseItem from "./BaseItem.vue";
import {inject, provide, ref} from "vue";
import Button from "../Base/Button.vue";
import { defineProps } from "vue";
import ClickToCopyComponent from "../Base/ClickToCopyComponent.vue";

const props = defineProps<{
  fileData: {
    uploaded: boolean
    name: string
    url?: string // Only present when uploaded
    fileData?: { // Only present if not uploaded
      filePath: string,
      fileContent: Uint8Array
    },
    size: number
  }
}>()

const { uploaded, fileData, name } = props.fileData

const status = ref<'toBeUploaded' | 'uploading' | 'available' | 'processing' | 'errored'>(uploaded ? 'available' : 'toBeUploaded')
const progress = ref(0)

const emit = defineEmits<{
  onFileUploaded: [data: any]
}>()

const address = inject('address')
const token = inject('token')

const onUploadFile = () => {
  if(!fileData) return
  if(uploaded || status.value !== 'toBeUploaded') return
  const blob = new Blob([fileData.fileContent], { type: 'application/octet-stream' })
  const formData = new FormData();
  formData.append('upload', blob, fileData.filePath.split('\\').pop())

  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'https://' + address + '/storage/asyncUpload.php');
  xhr.setRequestHeader('Authorization', `Bearer ${token}`)

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      console.log(`Upload progress: ${percentComplete}%`);
      if(percentComplete == 100) status.value = 'processing'
      progress.value = percentComplete
    }
  };

  xhr.onerror = (error) => {
    console.error('Error uploading file:', error);
    status.value = 'errored'
  };

// Step 4: Send the FormData using XMLHttpRequest
  xhr.send(formData);
  status.value = 'uploading'

// You can also handle the response after the upload completes
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('File uploaded successfully!');
      status.value = 'available'
      const response = JSON.parse(xhr.responseText)
      props.fileData.url = address + response.meta.file._links.fetch
      props.fileData.fileData = undefined
      props.fileData.uploaded = true
      emit('onFileUploaded', props.fileData)
    } else {
      console.error('Failed to upload file:', xhr.statusText);
      console.error(xhr.responseText)
      status.value = 'errored'
    }
  };
}

defineExpose({
  onUploadFile,
  status
})

</script>

<template>
  <div v-if="status == 'toBeUploaded'">
    <Card color="blue">
      <b>{{ name }}</b> <span style="color:var(--foreground-secondary)">To be uploaded</span>
      <Button type="primary" @click="onUploadFile"> Upload! </Button>
    </Card>
  </div>
  <div v-if="status == 'uploading'">
    <Card color="blue">
      <b>{{ name }}</b> <span style="color:var(--foreground-secondary)">Uploading...</span>
      <div class="prog-container">
        <div class="prog-content" :style="`width: ${progress}%`" />
      </div>
    </Card>
  </div>
  <div v-if="status == 'processing'">
    <Card color="blue">
      <b>{{ name }}</b> <span style="color:var(--foreground-secondary)">Processing...</span>
      <div class="prog-container">
        <div class="prog-content indeterminate" :style="`width: ${100}%`" />
      </div>
    </Card>
  </div>
  <div v-if="status == 'available'">
    <Card color="green">
      <b>{{ name }}</b> <ClickToCopyComponent :value="props.fileData.url" />
    </Card>
  </div>
  <div v-if="status == 'errored'">
    <Card color="red">
      <b>{{ name }}</b> <span style="color:var(--foreground-secondary)">Could not upload :(</span>
      <Button @click="status = 'toBeUploaded'">Reupload</Button>
      <code>Press ctrl + shift + I and view Console for more information.</code>
    </Card>
  </div>
</template>

<style scoped>

</style>