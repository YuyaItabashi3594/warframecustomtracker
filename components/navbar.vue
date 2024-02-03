<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [{
  name: 'English',
  value: 'en'
},
{
  name: '日本語',
  value: 'jp'
}
]

</script>

<template>
  <div class="flex justify-center items-center gap-4 w-1/3 mx-auto">
    <p class="text-slate-200 text-2xl">Warframe Custom Tracker</p>
    <v-select v-model="locale" class="max-w-40 pt-4" density="comfortable" width="100"
      :items="languages" item-title="name" item-value="value"></v-select>
    
  </div>
</template>