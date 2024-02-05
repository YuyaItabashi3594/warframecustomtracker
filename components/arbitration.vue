<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const currentPlatform = ref(
  {
    name: 'pc',
    icon: 'mdi-laptop',
    url: 'pc'
  }
)

const arbitrationData = ref({})
const failedFetch = ref(false)
const successfulFetch = ref(false)

const node = ref('')

const matchNode = (str) => {
  const match = str.match(/(\w+)\s\((\w+)\)/);
  if (match) {
    const firstPart = match[1];
    const secondPart = match[2];
    return [firstPart, secondPart]
  }
}

onMounted(() => {
  const storedValue = localStorage.getItem('my-platform') || 'pc'
  if (storedValue) {
    currentPlatform.value = JSON.parse(storedValue)
  }
  fetch('https://api.warframestat.us/' + currentPlatform.value.url + '/arbitration')
    .then(response => response.json())
    .then(data => {
      if ('error' in data) {
        failedFetch.value = true
      } else {
        arbitrationData.value = data
        successfulFetch.value = true
        node.value = matchNode(arbitrationData.value.node);
      }
    })
})

watch(locale, () => {
  const str = arbitrationData.value.node;
  node.value = matchNode(str);
})

</script>

<template>
  <v-card>
    <v-img height="100" src="/ArbitarIconGrey.png">
      <v-card-title>Arbitration</v-card-title>
    </v-img>
    <div v-if="successfulFetch" class="flex items-center">
      <v-img height="150" :src="arbitrationData.enemy + '.png'">
      </v-img>
      <v-card variant="flat">
        <v-card-title>{{ node[0] + '(' + $t(node[1]) + ')' }}</v-card-title>
        <v-card-text>
          {{ arbitrationData.type }}
        </v-card-text>
      </v-card>
    </div>
    <div v-else-if="failedFetch">
      <div class="flex items-center mr-4">
        <v-img height="200" src="/Lotus.png"></v-img>
        <v-card variant="flat">
          <v-card-title>Failed to fetch data</v-card-title>
          <v-card-text>
            Please try again later
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-card>
</template>