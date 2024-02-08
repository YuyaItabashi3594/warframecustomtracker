<script setup>

const preferredArbitrationMissionCount = ref(0)
const preferredFissureMissionCount = ref(0)
const preferredMissionCount = computed(() => preferredArbitrationMissionCount.value)

const changeArbitrationCount = (count) => {
  preferredArbitrationMissionCount.value = count
}

const changeFissureCount = (count) => {
  preferredFissureMissionCount.value = count
}

const titleCount = computed(() => 
  preferredMissionCount.value == 0 ? 'No quests available,Tenno.' : `You have ${preferredMissionCount.value} quests`
);

useHead({
  title: () => titleCount.value
})

</script>

<template>
  <div>
    <Navbar />
    <div class="grid grid-cols-4 mx-10 gap-4">
      <Arbitration @preferred-arbitration="changeArbitrationCount" />
      <Fissure />
    </div>
  </div>
</template>

<style>
body {
  background-color: #000000c0;
  width: 100%;
  min-width: 1080px;
}
</style>