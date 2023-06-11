<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn @click="$router.replace('/')" flat round dense icon="rowing"/>

        <q-toolbar-title>
          Timing Client
        </q-toolbar-title>

        <q-toolbar-title v-if="regattaStore.regatta.name != ''">
          <q-btn-dropdown
            flat
            :label="regattaStore.regatta.name"
          >
            <q-list>
              <q-item clickable v-close-popup @click="synchronizeRegatta">
                <q-item-section avatar>
                  <q-avatar icon="sync" color="primary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Synchronisieren</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="closeRegatta">
                <q-item-section avatar>
                  <q-avatar icon="close" color="red" text-color="white"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Posten beenden</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-toolbar-title>

        <div>Version {{ clientVersion }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {version} from '../../package.json';
import {ref} from "vue";
import {useRegattaStore} from "stores/regatta-store";
import {api} from "boot/axios";
import {useRouter} from "vue-router";

const clientVersion = ref(version)
const regattaStore = useRegattaStore();
const router = useRouter();

async function synchronize(): Promise<{ success: boolean, message: string }>{

  const response = await api.post(`client/${regattaStore.session.target}/${regattaStore.session.regattaUuid}`, {clientId: regattaStore.session.clientId, regatta: regattaStore.regatta});

  if (response.status == 200 && response.data.success){
    return {success: true, message: response.data.message}
  }else{
    console.log(response)
    return {success: false, message: response.data.messag}
  }
}

async function synchronizeRegatta(){
  const response = await synchronize();

  if (!response.success){
    console.log(response.message);
    //ToDo Show error
  }
}

async function closeRegatta(){
  const result = await synchronize();

  if (!result.success){
    console.log(result.message);
    //ToDo Show error
    return
  }

  const response = await api.delete(`client/${regattaStore.session.target}/${regattaStore.session.regattaUuid}`, {params: {clientId: regattaStore.session.clientId}})
  if (response.status == 200 && response.data.success){
    regattaStore.session.regattaUuid = "";
    regattaStore.session.target = "";
    //@ts-ignore
    await window.clientStorage.update("", "");
    await router.push("/");
  }else {
    console.log(response)
    //ToDo Show errors
  }
}

</script>
