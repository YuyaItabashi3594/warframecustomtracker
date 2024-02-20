<script setup>
import { useStorage } from '@vueuse/core'
import { useDateFormat } from '@vueuse/core'

const emit = defineEmits(['preferred-arbitration-changed'])

const currentPlatform = useStorage('my-platform', {
  name: 'pc',
  icon: 'mdi-laptop',
  url: 'pc'
})

const arbitrationData = ref({})
const failedFetch = ref(false)
const isExpired = ref(false)
const successfulFetch = ref(false)

const currentTime = ref(new Date())
const expireTime = ref()
const diff = ref()

const node = ref('')

const matchNode = (str) => {
  const match = str.match(/(\w+)\s\((\w+)\)/);
  if (match) {
    const firstPart = match[1];
    const secondPart = match[2];
    return [firstPart, secondPart]
  }
}

const enemyTypes = ['Grineer', 'Corpus', 'Infested', 'Orokin']
const missions = ['Defense', 'Survival', 'Excavation', 'Interception', 'Defection', 'Infested Salvage', 'Disruption']

const selectedArbitrationEnemyType = useStorage('selected-arbitration-enemy-type', ['Grineer', 'Corpus', 'Infested', 'Orokin'])
const selectedArbitrationMission = useStorage('selected-arbitration-mission', ['Defense', 'Survival', 'Excavation', 'Interception', 'Defection', 'Infested Salvage', 'Disruption'])

const isPreferredArbitrationAvailable = computed(() => {
  if (!arbitrationData.value.enemy || !arbitrationData.value.type) {
    return false
  }
  return selectedArbitrationEnemyType.value.some(type => arbitrationData.value.enemy.includes(type)) && selectedArbitrationMission.value.some(mission => arbitrationData.value.type.includes(mission))
})

const remainingTimer = ref()

const fetchArbitrationData = () => {
  fetch('https://api.warframestat.us/' + currentPlatform.value.url + '/arbitration')
    .then(response => response.json())
    .then(data => {
      if ('error' in data) {
        failedFetch.value = true
      } else {
        arbitrationData.value = data
        successfulFetch.value = true
        node.value = matchNode(arbitrationData.value.node);
        arbitrationData.value.type = removeDarkSector(arbitrationData.value.type);
        currentTime.value = new Date()
        expireTime.value = new Date(arbitrationData.value.expiry)
        diff.value = expireTime.value - currentTime.value
      }
    })
}

onMounted(() => {
  fetchArbitrationData()
  setInterval(() => {
    diff.value = diff.value - 1000
    if (diff.value < 0) {
      remainingTimer.value = 'Expired'
      isExpired.value = true
    } else {
      remainingTimer.value = useDateFormat(diff.value, 'mm:ss')
    }
  }, 1000)
  setInterval(() => {
    fetchArbitrationData()
  }, 600000)
}
)

watch(failedFetch, () => {
  console.log('failed')
  var intervalId
  if (failedFetch.value === true) {
    intervalId = setInterval(() => {
      fetchArbitrationData()
    }, 60000)
  } else {
    if (intervalId) {
      clearInterval(intervalId)
    }
  }
})

watch(isExpired, () => {
  console.log('expired')
  var intervalId
  if (isExpired.value === true) {
    intervalId = setInterval(() => {
      fetchArbitrationData()
    }, 60000)
  } else {
    if (intervalId) {
      clearInterval(intervalId)
      console.log('cleared')
    }
  }
})


watch(isPreferredArbitrationAvailable, () => {
  if (isPreferredArbitrationAvailable.value === true) {
    emit('preferred-arbitration-changed', 1)
  } else {
    emit('preferred-arbitration-changed', 0)
  }
})

</script>

<template>
  <v-card>
    <v-img class="mt-2" height="100" src="/ArbitarIconGrey.png">
      <v-card-title>{{ $t('Arbitration') }}</v-card-title>
    </v-img>
    <v-expansion-panels class="mb-2">
      <v-expansion-panel title="Setting">
        <template v-slot:text>
          <div class="flex flex-col mt-2">
            <v-select v-model="selectedArbitrationEnemyType" :label="$t('Enemy')" :items="enemyTypes" multiple>
              <template v-slot:selection="{ item, index }">
                <v-chip>
                  <span>{{ $t(item.title) }}</span>
                </v-chip>
              </template>
            </v-select>
            <v-select v-model="selectedArbitrationMission" :label="$t('Mission')" :items="missions" multiple>
              <template v-slot:selection="{ item, index }">
                <v-chip>
                  <span>{{ $t(item.title) }}</span>
                </v-chip>
              </template>
            </v-select>
          </div>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-if="successfulFetch && isPreferredArbitrationAvailable" class="grid grid-cols-2">
      <v-img height="150" :src="arbitrationData.enemy + '.png'">
      </v-img>
      <v-card variant="flat">
        <v-card-title>{{ $t(arbitrationData.type) }}</v-card-title>
        <v-card-text>
          {{ node[0] + '(' + $t(node[1]) + ')' }}
        </v-card-text>
        <v-card-title>
          {{ remainingTimer }}
        </v-card-title>
      </v-card>
    </div>
    <div v-else-if="failedFetch">
      <div class="flex items-center ml-4">
        <v-img height="150" src="/Lotus.png"></v-img>
        <v-card variant="flat">
          <v-card-title>Failed to fetch data</v-card-title>
          <v-card-text>
            This API is unstable,so try again later,Tenno.
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div v-else>
      <NoPreferredMission></NoPreferredMission>
    </div>
  </v-card>
</template>