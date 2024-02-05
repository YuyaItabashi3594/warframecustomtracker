<script setup>

const currentPlatform = ref(
  {
    name: 'pc',
    icon: 'mdi-laptop',
    url: 'pc'
  }
)

const fissureData = ref({})
const failedFetch = ref(false)

onMounted(() => {
  const storedValue = localStorage.getItem('my-platform') || 'pc'
  if (storedValue) {
    currentPlatform.value = JSON.parse(storedValue)
  }
  fetch('https://api.warframestat.us/' + currentPlatform.value.url + '/fissures')
    .then(response => response.json())
    .then(data => {
      if ('error' in data) {
        failedFetch.value = true
      } else {
        fissureData.value = data
      }
    })
})
</script>

<template>
  <v-card>
    <v-img height="200" src="/LithRelicIntact.png">
      <v-card-title>Void Fissure</v-card-title>
    </v-img>
  </v-card>
</template>