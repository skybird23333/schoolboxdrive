<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ListFileItem from "./components/Home/ListFileItem.vue";
import UploadFileItem from "./components/Home/UploadFileItem.vue";
import {provide, reactive, ref, watch} from "vue";
import Card from "./components/Base/Card.vue";
import Button from "./components/Base/Button.vue";
import Input from "./components/Base/Input.vue";

interface File {
  uploaded: boolean
  name: string
  url?: string // Only present when uploaded
  fileData?: { // Only present if not uploaded
    filePath: string,
    fileContent: Uint8Array
  },
  size: number
}

const files: File[] = reactive(JSON.parse(localStorage.getItem('files') || '[]'))

const settingsOpened = ref(false)
const tokenGuideOpened = ref(false)

console.log(localStorage.getItem('token'))

const config = reactive<{
  address: string
  token: string
}>({
  address: localStorage.getItem('address') || '',
  token: localStorage.getItem('token') || ''
})

console.log(config.token)

setTimeout(() => {
  config.address = localStorage.getItem('address') || ''
  config.token = localStorage.getItem('token') || ''
}, 10)

const onConfigUpdate = () => {
  localStorage.setItem('address', config.address)
  localStorage.setItem('token', config.token)
}

const onSelectFile = async () => {
  const fileData = await window.electronAPI.selectFile()

  files.push({
    uploaded: false,
    name: fileData.filePath.split('\\').pop() || 'file.txt',
    size: fileData.fileContent.byteLength,
    fileData
  })
}

const onFileUploaded = (fileData: File) => {
  localStorage.setItem('files', JSON.stringify(files))
}

//TODO: Test reactivity?
provide('address', config.address)
provide('token', config.token)

</script>

<template>
  <div class="content-header">
    <h2>Schoolbox Drive</h2>
    <Button type="primary" @click="settingsOpened = !settingsOpened"> Configuration </Button> <- Add config before uploading
    <Card v-if="settingsOpened">
      <h1>Configuration</h1>
      <Card color="red">
        <h2>Warning</h2>
        This tool was created for research and educational purposes.
        Only run this tool on Schoolbox instances where you <b>have been authorized</b> to do so.
      </Card>

      Schoolbox Address <Input placeholder="demo.schoolbox.com.au" v-model="config.address" @input="onConfigUpdate"></Input>
      Token <Input placeholder="eralhnioearhnoi[aehn[oiatehno" v-model="config.token" @input="onConfigUpdate"></Input>
      <Button @click="tokenGuideOpened = !tokenGuideOpened">How do I get a token?</Button>

      <Card v-if="tokenGuideOpened">
      <h3>Getting your token</h3>
        Visit <b>https://{{ config.address || "[YOUR SCHOOLBOX LINK]" }}/user/token</b>. Then copy what's after the word "token", inside quote marks.
        <pre>{"token": "<span style="background: darkgoldenrod">etieqtqeipgpqngrqpgrq....</span>", ....}</pre>
        <b>Your token can be used by someone else to log onto Schoolbox on behalf of you.</b> Do not share it with anyone.
        SchoolboxDrive stores it on your PC the same way your browsers store your credentials.
        <div class="card-footer">
          Reference: https://api.schoolbox.com.au/#get-/user/token
        </div>
      </Card>

    </Card>
    <UploadFileItem @click="onSelectFile" />
  </div>
  <div class="content-content">
    <ListFileItem v-for="file in files" :file-data="file" @onFileUploaded="onFileUploaded" />
  </div>

</template>

<style scoped>

</style>
