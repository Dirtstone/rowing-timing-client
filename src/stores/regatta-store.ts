import {defineStore} from 'pinia';
import {reactive, Ref, ref, watch} from "vue";

export const useRegattaStore = defineStore('regatta', () => {
  const session = ref({clientId: "", regattaUuid: "", target: ""});
  const regatta = ref({
    name: "Test Regatta",
    races: []
  }) as Ref<Regatta>;

  function updateRegatta(newRegatta: Regatta){
    regatta.value = newRegatta
  }

  function switchDivision(raceIndex: number, boatIndex:number, targetDivisionIndex: number){
    regatta.value.races[raceIndex].boats[boatIndex].division = targetDivisionIndex;
  }

  return {regatta, session, switchDivision}
});

type Regatta = {
  name: string,
  races: {
    number: number,
    name: string,
    boats: {
      number: number,
      name: string,
      athletes: string[],
      startTime: string,
      endTime: string,
      didNotAttend: boolean,
      reason: string,
      division: number,
    }[]
  }[]
}




