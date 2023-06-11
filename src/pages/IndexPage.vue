<template>
  <q-page class="row items-center justify-evenly">

    <q-input v-model="regattaUuid" label="Regatta Token"/>
    <q-select v-model="target" :options="['start', 'finish']" label="Rolle"/>
    <q-btn @click="getRole">Synchronisieren</q-btn>

    <q-btn @click="$router.replace('/start')">
      Start
    </q-btn>
    <q-btn @click="$router.replace('/finish')">
      Finish
    </q-btn>
  </q-page>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';
import {api} from 'boot/axios'
import {useRegattaStore} from "stores/regatta-store";
import {useRouter} from "vue-router";

const regattaStore = useRegattaStore();
const router = useRouter();
const target: Ref<string> = ref("start")
const regattaUuid : Ref<string> = ref("")

async function getRole(){
  const response = await api.get(`client/${target.value}/${regattaUuid.value}`, {params:{ clientId: regattaStore.session.clientId}});
  console.log(response);
  if (response.status == 200 && response.data.success){
    regattaStore.session.regattaUuid = regattaUuid.value;
    regattaStore.session.target = target.value;

    //@ts-ignore
    await window.clientStorage.update(regattaUuid.value, target.value);
    console.log(regattaUuid.value)
    console.log(target.value)
    regattaStore.regatta = response.data.data;
    console.log(regattaStore.regatta);

    router.push(`/${target.value}`);
  }else {
    console.log("Error happened")
    //ToDo Handle Error
  }
}

</script>
