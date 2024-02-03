<script setup>

</script>

<template>
  <v-dialog
      v-model="dialog"
      scrollable
      width="auto"
    >
    <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
        >
          Open Dialog
        </v-btn>
    </template>
    
  </v-dialog> 
</template>