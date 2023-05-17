import {defineStore} from 'pinia';
import {reactive, Ref, ref} from "vue";

export const useRegattaStore = defineStore('regatta', () => {
  const session = reactive({clientId: "", regattaUuid: "", target: ""})
  const regatta = reactive({
    name: "Test Regatta",
    races: []
  }) as Regatta;

  function switchDivision(raceIndex: number, boatIndex:number, targetDivisionIndex: number){
    regatta.races[raceIndex].boats[boatIndex].division = targetDivisionIndex;
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
      startTime: Date | undefined,
      endTime: Date | undefined,
      didNotAttend: boolean,
      reason: string,
      division: number,
    }[]
  }[]
}




