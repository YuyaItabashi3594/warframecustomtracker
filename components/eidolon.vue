<script setup>
import { useStorage } from '@vueuse/core'
import { useDateFormat } from '@vueuse/core'

const emit = defineEmits(['eidolon-available'])

const cetusData = ref({})
const failedFetch = ref(false)
const currentTime = ref(new Date())
const isDay = ref(true)
const remainingTime = ref()

const currentPlatform = useStorage('my-platform', {
  name: 'pc',
  icon: 'mdi-laptop',
  url: 'pc'
})


const fetchCetusData = () => {
  fetch('https://api.warframestat.us/' + currentPlatform.value.url + '/cetusCycle')
    .then(response => response.json())
    .then(data => {
      if ('error' in data) {
        failedFetch.value = true
      } else {
        cetusData.value = data
        isDay.value = cetusData.value.isDay
      }
    })
}

const isIsDayChanged = () => {
  const expiry = new Date(cetusData.value.expiry)
  const diff = new Date(expiry - currentTime.value)
  const formattedTime = useDateFormat(diff.getTime(), 'mm:ss')
  remainingTime.value = diff.getUTCHours() + ':' + formattedTime.value
  if (expiry < 0) {
    fetchCetusData()
  }
}

onMounted(() => {
  fetchCetusData()
  setInterval(() => {
    fetchCetusData()
  }, 600000)
  setInterval(() => {
    currentTime.value = new Date()
    isIsDayChanged()
  }, 1000)
})
</script>

<template>
  <v-card class="relative">
    <div :class="isDay?'flex flex-row':'flex flex-col'">
      <v-img :class="isDay ? 'mt-2 ml-2' : 'opacity-70'" :height="isDay ? 150 : ''" :width="isDay ? 150 : ''"
        :src="isDay ? '/Lotus.png' : '/Eidolon.png'">
      </v-img>
      <v-card-title v-if="isDay === false" class="absolute top-0 left-0">
        {{ $t('EidolonAvailable') }} {{ remainingTime }}
      </v-card-title>
      <v-card-text v-else>
        <p>{{ $t('EidolonNotAvailable') }}</p>
        {{ $t('untilEidolon')+' '+remainingTime }}
      </v-card-text>
    </div>
  </v-card>

</template>