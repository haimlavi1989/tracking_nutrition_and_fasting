import {Diet} from "./Diet";

export class Reminder {

    constructor(
        public id = 0,
        public timeToAlertBeforeNutritionStart = 0,
        public timeToAlertBeforeFastingStart = 0,
    ){}
}
