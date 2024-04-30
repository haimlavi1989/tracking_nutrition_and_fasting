
export class Diet {

    constructor(
        public id: string = '',
        public startTime: Date = new Date(),
        public endTime: Date = new Date(),
        public foodList: string[] = [],
        public reminderId: string = '',
        public weight = 0,
    ){}
}
