<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
    >

      <template v-slot:before>
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
                    >
                      <q-card>
                        <q-card-section>
                          <q-list>
                            <q-item v-for="(boat, boatIndex) of division.boats" class="q-list--padding">
                              <q-card class="my-card"
                                @dragenter="onDragEnter"
                                @dragleave="onDragLeave"
                                @dragover="onDragOver"
                                @drop="onDrop(raceIndex, divisionIndex, boatIndex, $event)"
                              >
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
                                    <q-input filled v-model="boat.endTime" mask="####/##/## ##:##:##:##"
                                             label="Zielzeit">

                                      <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer"></q-icon>
                                      </template>
                                    </q-input>
                                    <q-btn v-if="!boat.endTime" @click="timeBoat(raceIndex, divisionIndex, boatIndex)">
                                      Time Now
                                    </q-btn>
                                  </div>
                                  <div class="row">
                                    <q-toggle v-model="boat.didNotAttend" label="Nicht am Start erschienen" disable/>
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
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Zeiten</div>
          <div class="q-my-md">
            <q-btn @click="takeTime">Time</q-btn>
            <q-btn @click="resetTimes">Reset</q-btn>
          </div>
          <div>
            <q-timeline color="secondary">
              <q-timeline-entry
                draggable="true"
                @dragstart="onDragStart(time, $event)"
                v-for="time of times"
                :title="new Date(time).toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: '2'})"
              />
            </q-timeline>
          </div>
        </div>
      </template>

    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import {useRegattaStore} from "stores/regatta-store";
import {Ref, ref} from "vue";

const splitterModel = ref(50)

const regattaStore = useRegattaStore();

const times : Ref<Date[]> = ref([]);
const takeTime = () => {
  times.value.push(new Date());
}

const resetTimes = () =>{
  times.value = [];
}

const onDragStart = (date:Date, e:any)=>{
  e.dataTransfer.setData('date', date.toJSON())
}

function onDragEnter (e: any) {
  // don't drop on other draggables
  if (e.target.draggable !== true) {
    e.target.classList.add('drag-enter')
  }
}

function onDragLeave (e:any) {
  e.target.classList.remove('drag-enter')
}

function onDragOver (e:any) {
  e.preventDefault()
}

function onDrop(raceIndex: number, divisionIndex: number, boatIndex: number, e:any){
  e.preventDefault()

  // don't drop on other draggables
  if (e.target.draggable === true) {
    return
  }

  regattaStore.regatta.races[raceIndex].divisions[divisionIndex].boats[boatIndex].endTime = e.dataTransfer.getData('date');
}

const timeBoat = (raceIndex: number, divisionIndex: number, boatIndex: number) => {
  //@ts-ignore
  regattaStore.regatta.races[raceIndex].divisions[divisionIndex].boats[boatIndex].endTime = new Date().toJSON();
}

</script>

<style scoped>

</style>
