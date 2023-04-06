<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn @click="$router.replace('/')" flat round dense icon="rowing"/>

        <q-toolbar-title>
          Timing Client
        </q-toolbar-title>

        <div>Version {{ $q.version }}</div>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
//ToDo Add current version
</script>
