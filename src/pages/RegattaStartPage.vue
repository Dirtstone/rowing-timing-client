<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          v-for="(race, raceIndex) of regattaStore.regatta.races"
          v-bind="race.number"
          switch-toggle-side
          expand-separator
          :label="'Rennen: ' + String(race.number) + ' ' + race.name"
        >
          <q-card>
            <q-card-section>
              <q-list bordered class="rounded-borders">
                <q-expansion-item
                  v-for="divisionNumber in getNumberOfDivisions(raceIndex)"
                  v-bind="divisionNumber"
                  switch-toggle-side
                  expand-separator
                  :label="'Abteilung: ' + String(divisionNumber)"
                  @dragenter="onDragEnter(raceIndex, divisionNumber, $event)"
                  @dragleave="onDragLeave"
                  @dragover="onDragOver(raceIndex, divisionNumber, $event)"
                  @drop="onDrop(raceIndex, divisionNumber, $event)"
                >
                  <q-btn v-if="race.boats.every((boat) => boat.division == divisionNumber ? boat.startTime == '' : true)"
                         @click="timeDivision(raceIndex, divisionNumber)">Abteilung Start
                  </q-btn>
                  <q-card>
                    <q-card-section>
                      <q-list>
                        <span v-for="(boat, boatIndex) of race.boats">
                          <q-item v-if="boat.division == divisionNumber"
                                  class="q-list--padding" draggable="true"
                                  @dragstart="onDragStart(raceIndex, divisionNumber, boatIndex, $event)">
                            <q-card class="my-card">
                              <q-card-section class="bg-primary text-white">
                                <div class="text-h6">{{ boat.name }}</div>
                                <div class="text-subtitle2 row">
                                  <div style="padding-right: 50px ">
                                    Startnummer: {{ boat.number }}
                                  </div>
                                  <div>
                                    Athleten: {{ boat.athletes.join(", ") }}
                                  </div>
                                </div>
                              </q-card-section>

                              <q-separator/>

                              <q-card-actions>
                                <div class="row">
                                  <q-input filled v-model="boatTimes[raceIndex][boatIndex]">
                                    <template v-slot:append>
                                      <q-icon name="access_time" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                          <q-time
                                            v-model="boatTimes[raceIndex][boatIndex]"
                                            with-seconds
                                            format24h
                                          >
                                            <div class="row items-center justify-end">
                                              <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                          </q-time>
                                        </q-popup-proxy>
                                      </q-icon>
                                    </template>
                                  </q-input>
                                  <q-btn v-if="!boat.startTime" @click="timeBoat(raceIndex, boatIndex)">
                                    Time Now
                                  </q-btn>
                                </div>
                                <div class="row">
                                  <q-toggle v-model="boat.didNotAttend" label="Nicht am Start erschienen"/>
                                  <q-input type="text" v-if="boat.didNotAttend" v-model="boat.reason"
                                           label="Grund für nicht Erscheinen"/>
                                </div>
                              </q-card-actions>
                            </q-card>
                          </q-item>
                        </span>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {useRegattaStore} from "stores/regatta-store";
import {computed, ref, Ref, WritableComputedRef} from "vue";

const regattaStore = useRegattaStore();

const timeBoat = (raceIndex: number, boatIndex: number) => {
  regattaStore.regatta.races[raceIndex].boats[boatIndex].startTime = new Date().toISOString();
}

const timeDivision = (raceIndex: number, divisionIndex: number) => {
  for (const boatIndex in regattaStore.regatta.races[raceIndex].boats) {
    if(regattaStore.regatta.races[raceIndex].boats[boatIndex].division === divisionIndex){
      regattaStore.regatta.races[raceIndex].boats[boatIndex].startTime = new Date().toISOString();
    }
  }
}

const boatTimes: Ref<Array<Array<WritableComputedRef<String>>>> = ref([]);

for (let race of regattaStore.regatta.races){
  let raceTimes: Array<WritableComputedRef<String>> = []
  for (let boat of race.boats){
    raceTimes.push(computed({
      get(): string{
        return boat.startTime ? new Date(Date.parse(boat.startTime)).toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: '2'}): "";
      },
      set(newValue: string):void{
        if (newValue == ""){
          boat.startTime = ""
        }else{
          const newDateNumber = Date.parse(((new Date().toISOString().split("T")[0]) + "T" + newValue).replace(",", "."))
          if (!isNaN(newDateNumber)){
            const newDate = new Date(newDateNumber);
            boat.startTime = newDate.toISOString();
          }else{
            //ToDo Show error message
            //  Actually maybe not. Could work without
          }
        }
      }
    }));
  }
  boatTimes.value.push(raceTimes)
}

const onDragStart = (raceIndex: number, divisionNumber: number, boatIndex: number, e: any) => {
  e.dataTransfer.setData('raceIndex', String(raceIndex));
  e.dataTransfer.setData('divisionNumber', String(divisionNumber));
  e.dataTransfer.setData('boatIndex', String(boatIndex));
}

function onDragEnter(raceIndex: number, divisionNumber: number, e: any) {
  // don't drop on other draggables
  if (e.target.draggable === false && Number(e.dataTransfer.getData('raceIndex')) === raceIndex && divisionNumber !== Number(e.dataTransfer.getData('divisionNumber'))) {
    e.target.classList.add('drag-enter')
  }
}

function onDragLeave(e: any) {
  e.target.classList.remove('drag-enter')
}

function onDragOver(raceIndex: number, divisionIndex: number, e: any) {
  if (Number(e.dataTransfer.getData('raceIndex')) === raceIndex && divisionIndex === Number(e.dataTransfer.getData('divisionIndex'))) {
    e.preventDefault()
  }
}

function onDrop(raceIndex: number, divisionIndex: number, e: any) {
  const sourceDivisionIndex = Number(e.dataTransfer.getData('divisionIndex'));
  const sourceBoatIndex = Number(e.dataTransfer.getData('boatIndex'));
  const sourceRaceIndex = Number(e.dataTransfer.getData('raceIndex'));

  if (raceIndex !== sourceRaceIndex) {
    return;
  }
  if (divisionIndex === sourceDivisionIndex) {
    return;
  }

  e.preventDefault()

  // don't drop on other draggables
  if (e.target.draggable === true) {
    return
  }

  regattaStore.switchDivision(raceIndex, sourceBoatIndex, divisionIndex);
}


function getNumberOfDivisions(raceIndex: number): number {
  let maxDivisions = 1;
  for (const boat of regattaStore.regatta.races[raceIndex].boats) {
    if (maxDivisions < boat.division) {
      maxDivisions = boat.division;
    }
  }
  return maxDivisions
}
</script>

<style scoped>

</style>
