<script setup>
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'

const { locale } = useI18n()
if(locale.value.includes('ja')){
  locale.value = 'jp'
}else{
  locale.value = 'en'
}

const currentPlatform = useStorage('my-platform', {
  name: 'pc',
  icon: 'mdi-laptop',
  url: 'pc'
})

const languages = [{
  name: 'English',
  value: 'en'
},
{
  name: '日本語',
  value: 'jp'
}
]

const isUpdatedFromLocalStorage = ref(false)

const selectPlatform = (newPlatform) => {
  currentPlatform.value = newPlatform
}

onMounted(() => {
  const storedValue = localStorage.getItem('currentPlatform');
  if (storedValue) {
    currentPlatform.value = JSON.parse(storedValue);
  }
  isUpdatedFromLocalStorage.value = true
});

</script>

<template>
  <div class="flex justify-center items-center gap-4 w-1/2 mx-auto">
    <p class="text-slate-200 text-xl">Warframe Custom Tracker</p>
    <v-select v-model="locale" class="min-w-32 pt-4" density="comfortable" width="100" :items="languages"
      item-title="name" item-value="value">
    </v-select>
    <v-select v-model="currentPlatform" class="max-w-32 min-w-20 pt-4" density="comfortable" width="100"
      :items="platform">
      <template v-slot:selection>
        <v-icon v-if="isUpdatedFromLocalStorage">{{ currentPlatform.icon }}</v-icon>
      </template>
      <template v-slot:item="{ item, index }">
        <v-list-item @click="selectPlatform(item.value)">
          <v-icon>{{ item.value.icon }}</v-icon>
          <span class="ml-1">{{ item.value.name }}</span>
        </v-list-item>
      </template>
    </v-select>
    <AboutModal />
  </div>
  <div class="flex grid-cols-4">

  </div>
</template>