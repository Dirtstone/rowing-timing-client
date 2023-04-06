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
                  v-for="(division, divisionIndex) of race.divisions"
                  v-bind="division.number"
                  switch-toggle-side
                  expand-separator
                  :label="'Abteilung: ' + String(division.number)"
                  @dragenter="onDragEnter(raceIndex, divisionIndex, $event)"
                  @dragleave="onDragLeave"
                  @dragover="onDragOver(raceIndex, divisionIndex, $event)"
                  @drop="onDrop(raceIndex, divisionIndex, $event)"
                >
                  <q-btn v-if="division.boats.every((boat) => !boat.startTime)"
                         @click="timeDivision(raceIndex, divisionIndex)">Abteilung Start
                  </q-btn>
                  <q-card>
                    <q-card-section>
                      <q-list>
                        <q-item v-for="(boat, boatIndex) of division.boats" class="q-list--padding" draggable="true"
                                @dragstart="onDragStart(raceIndex, divisionIndex, boatIndex, $event)">
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
                                <q-input filled v-model="boat.startTime" mask="####/##/## ##:##:##:##"
                                         label="Startzeit">

                                  <template v-slot:append>
                                    <q-icon name="access_time" class="cursor-pointer"></q-icon>
                                  </template>
                                </q-input>
                                <q-btn v-if="!boat.startTime" @click="timeBoat(raceIndex, divisionIndex, boatIndex)">
                                  Time Now
                                </q-btn>
                              </div>
                              <div class="row">
                                <q-toggle v-model="boat.didNotAttend" label="Nicht am Start erschienen"/>
                                <q-input type="text" v-if="boat.didNotAttend" v-model="boat.reason"
                                         label="Grund für Nicht Erscheinen"/>
                              </div>
                            </q-card-actions>
                          </q-card>
                        </q-item>
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

const regattaStore = useRegattaStore();
const timeBoat = (raceIndex: number, divisionIndex: number, boatIndex: number) => {
  //@ts-ignore
  regattaStore.regatta.races[raceIndex].divisions[divisionIndex].boats[boatIndex].startTime = new Date().toJSON();
  console.log(new Date().toJSON());
}

const timeDivision = (raceIndex: number, divisionIndex: number) => {
  for (const boatIndex in regattaStore.regatta.races[raceIndex].divisions[divisionIndex].boats) {
    //@ts-ignore
    regattaStore.regatta.races[raceIndex].divisions[divisionIndex].boats[boatIndex].startTime = new Date().toJSON();
  }
}


const onDragStart = (raceIndex: number, divisionIndex: number, boatIndex: number, e: any) => {
  e.dataTransfer.setData('raceIndex', String(raceIndex));
  e.dataTransfer.setData('divisionIndex', String(divisionIndex));
  e.dataTransfer.setData('boatIndex', String(boatIndex));
}

function onDragEnter(raceIndex: number, divisionIndex: number, e: any) {
  // don't drop on other draggables
  if (e.target.draggable === false && Number(e.dataTransfer.getData('raceIndex')) === raceIndex && divisionIndex !== Number(e.dataTransfer.getData('divisionIndex'))) {
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

  if (raceIndex !== sourceRaceIndex){
    return;
  }
  if (divisionIndex === sourceDivisionIndex){
    return;
  }

  e.preventDefault()

  // don't drop on other draggables
  if (e.target.draggable === true) {
    return
  }



  regattaStore.switchDivision(raceIndex, divisionIndex, sourceDivisionIndex, sourceBoatIndex);
}


</script>

<style scoped>

</style>
