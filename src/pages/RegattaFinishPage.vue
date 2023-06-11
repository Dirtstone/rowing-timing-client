<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      style="height: 700px"
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
                      v-for="divisionNumber in getNumberOfDivisions(raceIndex)"
                      v-bind="divisionNumber"
                      switch-toggle-side
                      expand-separator
                      :label="'Abteilung: ' + String(divisionNumber)"
                    >
                      <q-card>
                        <q-card-section>
                          <q-list>
                            <span v-for="(boat, boatIndex) of race.boats">
                              <q-item  v-if="boat.division == divisionNumber" class="q-list--padding">
                                <q-card class="my-card"
                                        @dragenter="onDragEnter"
                                        @dragleave="onDragLeave"
                                        @dragover="onDragOver"
                                        @drop="onDrop(raceIndex, boatIndex, $event)"
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
                                      <q-btn v-if="!boat.endTime" @click="timeBoat(raceIndex, boatIndex)">
                                        Time Now
                                      </q-btn>
                                    </div>
                                    <div class="row">
                                      <q-toggle v-model="boat.didNotAttend" label="Ziel nicht erreicht"/>
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
import {computed, Ref, ref, WritableComputedRef} from "vue";

const splitterModel = ref(50)

const regattaStore = useRegattaStore();

const times : Ref<Date[]> = ref([]);
const takeTime = () => {
  times.value.push(new Date());
}

const boatTimes: Ref<Array<Array<WritableComputedRef<String>>>> = ref([]);

for (let race of regattaStore.regatta.races){
  let raceTimes: Array<WritableComputedRef<String>> = []
  for (let boat of race.boats){
    raceTimes.push(computed({
      get(): string{
        return boat.endTime ? new Date(boat.endTime).toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: '2'}): "";
      },
      set(newValue: string):void{
        if (newValue == ""){
          boat.endTime = ""
        }else{
          const newDateNumber = Date.parse(((new Date().toISOString().split("T")[0]) + "T" + newValue).replace(",", "."))
          if (!isNaN(newDateNumber)){
            const newDate = new Date(newDateNumber);
            boat.endTime = newDate.toISOString();
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

const resetTimes = () =>{
  times.value = [];
}

const onDragStart = (date:Date, e:any)=>{
  e.dataTransfer.setData('date', date.toISOString())
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

function onDrop(raceIndex: number, boatIndex: number, e:any){
  e.preventDefault()

  // don't drop on other draggables
  if (e.target.draggable === true) {
    return
  }
  regattaStore.regatta.races[raceIndex].boats[boatIndex].endTime = e.dataTransfer.getData('date');
}

const timeBoat = (raceIndex: number, boatIndex: number) => {
  regattaStore.regatta.races[raceIndex].boats[boatIndex].endTime = new Date().toISOString();
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
