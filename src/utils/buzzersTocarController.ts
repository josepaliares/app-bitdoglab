import { toMicropython } from "../json/toMicropython";

export interface BuzzersData {
  tone: string;
  time: string;
}

export class BuzzersTocarController {
    private sendCommand: (command: string) => Promise<void>;
    
    constructor(sendCommand: (command: string) => Promise<void>) {
        this.sendCommand = sendCommand;
    }
}
