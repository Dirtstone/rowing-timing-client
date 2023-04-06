import {defineStore} from 'pinia';
import {reactive, Ref, ref} from "vue";

export const useRegattaStore = defineStore('regatta', () => {
  const regatta = reactive({
    races: [
      {
        number: 1,
        name: "Jungen 4+ 14 Jahre",
        divisions: [
          {
            number: 1,
            boats: [
              {
                number: 1, //Needs to be unique and identifiable
                name: "Ruderklub Normannia Braunschweig",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 2, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 3, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 4, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 5, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 6, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              }
            ]
          },
          {
            number: 2,
            boats: [
              {
                number: 7, //Needs to be unique and identifiable
                name: "Ruderklub Normannia Braunschweig",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 8, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 9, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 10, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 11, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              },
              {
                number: 12, //Needs to be unique and identifiable
                name: "Ruderklub Otterndorf",
                athletes: [
                  "Malte Meiners",
                  "Felix Vollbrecht",
                  "Jan-Hinnerk Blanke",
                  "Ole Blanke"
                ],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",
              }
            ]
          }
        ]
      },
      {
        name: "Mädchen 4+ 14 Jahre",
        number: 2,
        divisions: [
          {
            number: 1,
            boats: [
              {
                number: 1,
                name: "asv",
                athletes: [],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: "",

              },
              {
                number: 2,
                name: "asv",
                athletes: [],
                startTime: undefined,
                endTime: undefined,
                didNotAttend: false,
                reason: ""
              }
            ]
          }
        ]
      }
    ]
  });

  function switchDivision(raceIndex: number, targetDivisionIndex: number, sourceDivisionIndex: number, boatIndex:number){
    const changingBoat = regatta.races[raceIndex].divisions[sourceDivisionIndex].boats.splice(boatIndex, 1)[0];
    regatta.races[raceIndex].divisions[targetDivisionIndex].boats.push(changingBoat);
  }

  return {regatta, switchDivision}
});

type Regatta = {
  races: {
    number: number,
    name: string,
    divisions: {
      number: number,
      boats: {
        number: number,
        name: string,
        athletes: string[],
        startTime: Date | undefined,
        endTime: Date | undefined,
        didNotAttend: boolean,
        reason: string
      }[]
    }[]
  }[]
}



