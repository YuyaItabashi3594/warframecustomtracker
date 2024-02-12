<script setup>
import { useStorage } from '@vueuse/core'

const emit =defineEmits(['preferred-fissure-changed'])

const currentPlatform = ref(
  {
    name: 'pc',
    icon: 'mdi-laptop',
    url: 'pc'
  }
)

const fissureData = ref({})
const failedFetch = ref(false)

const relicTypes = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem']
const missionTypes = ['Exterminate', 'Capture', 'Rescue', 'Sabotage', 'Mobile Defense', 'Defense', 'Survival', 'Interception', 'Spy', 'Hijack', 'Infested Salvage', 'Disruption', 'Excavation']
const missionLevels = ['Normal', 'Steel Path', 'Void Storm']

const selectedFissureRelicType = useStorage('selected-fissure-relic-type', ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem'])
const selectedFissureMissionType = useStorage('selected-fissure-mission-type', ['Exterminate', 'Capture', 'Rescue', 'Sabotage', 'Mobile Defense', 'Defense', 'Survival', 'Interception', 'Spy', 'Hijack', 'Infested Salvage', 'Disruption', 'Excavation'])
const selectedFissureMissionLevel = useStorage('selected-fissure-mission-level', ['Normal', 'Steel Path', 'Void Storm'])

const preferredFissure = computed(() => {
  if (!fissureData.value.length) {
    console.log('No data')
    return []
  } 
  else {
    const data = fissureData.value.filter(fissure => {
      return selectedFissureRelicType.value.some(relic => fissure.tier.includes(relic)) && selectedFissureMissionType.value.some(mission => fissure.missionType.includes(mission)) && selectedFissureMissionLevel.value.some(level => isSelectedLevelMatch(fissure, level))
    })
    data.sort((a,b) => {
      if (a.isStorm !== b.isStorm) {
        return a.isStorm ? 1 : -1;
      }
      if (a.isHard !== b.isHard) {
        return a.isHard ? 1 : -1;
      }
      if (relicTypes.indexOf(a.tier) !== relicTypes.indexOf(b.tier)) {
        return relicTypes.indexOf(a.tier) - relicTypes.indexOf(b.tier);
      }
      return 0;
    })
    console.log(data)
    return data
  }
})

const isSelectedLevelMatch = (fissure, level) => {
  if (level === 'Normal') {
    return fissure.isHard === false && fissure.isStorm === false
  } else if (level === 'Steel Path') {
    return fissure.isHard === true && fissure.isStorm === false
  } else if (level === 'Void Storm') {
    return fissure.isHard === false && fissure.isStorm === true
  }
}

const levelName = (fissure) => {
  if (fissure.isHard === false && fissure.isStorm === false) {
    return 'Normal'
  } else if (fissure.isHard === true && fissure.isStorm === false) {
    return 'Steel Path'
  } else if (fissure.isHard === false && fissure.isStorm === true) {
    return 'Void Storm'
  }
}

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
        fissureData.value.forEach(fissure => {
          fissure.missionType = removeDarkSector(fissure.missionType)
        })
        console.log(fissureData.value)
      }
    })
})

watch(preferredFissure, () => {
  emit('preferred-fissure-changed',preferredFissure.value.length)
})

</script>

<template>
  <v-card>
    <v-img height="100" src="/Lith.png">
      <v-card-title>Void Fissure</v-card-title>
    </v-img>
    <div class="flex flex-col mt-2">
      <v-select v-model="selectedFissureRelicType" label="Relic" :items="relicTypes" multiple>
        <template v-slot:selection="{ item, index }">
          <v-chip>
            <span>{{ item.title }}</span>
          </v-chip>
        </template>
      </v-select>
      <v-select v-model="selectedFissureMissionType" label="Mission" :items="missionTypes" multiple>
        <template v-slot:selection="{ item, index }">
          <v-chip>
            <span>{{ item.title }}</span>
          </v-chip>
        </template>
      </v-select>
      <v-select v-model="selectedFissureMissionLevel" label="Level" :items="missionLevels" multiple>
        <template v-slot:selection="{ item, index }">
          <v-chip>
            <span>{{ item.title }}</span>
          </v-chip>
        </template>
      </v-select>
    </div>
  </v-card>
  <v-table fixed-header height="500px">
    <thead>
      <tr>
        <th class="text-left w-32">Level</th>
        <th class="text-center">Relic</th>
        <th class="text-left">Mission</th>
        <th class="text-left">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="fissure in preferredFissure" :key="fissure.id">
        <td>{{ levelName(fissure) }}</td>
        <td>
          <v-img :src="`/${fissure.tier}.png`" height="50" />
        </td>
        <td>{{ fissure.missionType }}</td>
        <td>{{ fissure.eta }}</td>
      </tr>
    </tbody>
  </v-table>
</template>