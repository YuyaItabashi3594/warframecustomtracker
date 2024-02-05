<script setup>

</script>

<template>
  <v-dialog scrollable width="800">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" v-bind="props">
        About This Site
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="このサイトについて">
        <v-card-subtitle>
          サイトの機能や特徴
        </v-card-subtitle>
        <v-card-text>
          Warframeの仲裁や亀裂といった時限式ミッションを，自分の好みに合わせてカスタマイズして表示することができるサイトです。<br>
          <NuxtLink to="https://docs.warframestat.us/" class="underline mr-1">WarframeStat.us</NuxtLink>のAPIを使用しています。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>