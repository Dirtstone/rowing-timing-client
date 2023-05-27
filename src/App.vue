<template>
  <router-view />
</template>

<script setup lang="ts">
import {useRegattaStore} from "stores/regatta-store";
import {onMounted, reactive, Ref, ref} from 'vue'
import {useRouter} from "vue-router";

const hasTarget: Ref<boolean> = ref(false)

const regattaStore = useRegattaStore();
const router = useRouter();

// this subscription will be kept even after the component is unmounted
regattaStore.$subscribe(()=>{
  //@ts-ignore
  window.staticStore.save(JSON.stringify(regattaStore.regatta))
}, { detached: true })

onMounted(async ()=>{
  //@ts-ignore
  const session = JSON.parse(await window.clientStorage.load())
  console.log(session)
  regattaStore.session = reactive(session);

  if (session.target == "" && session.regattaUuid == ""){
    hasTarget.value = false;
  }else {
    //@ts-ignore
    const staticStore = reactive(JSON.parse(await window.staticStore.load()));
    console.log(staticStore)
    console.log("Loaded Static Store")
    regattaStore.regatta = staticStore;

    await router.push(`/${session.target}`)
  }
})

</script>
