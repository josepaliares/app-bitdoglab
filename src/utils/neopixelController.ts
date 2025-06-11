import { toMicropython } from "../json/toMicropython";

export interface NeopixelData {
	pos: string;
	cor: string;
}

export class NeopixelController {
	private sendCommand: (command: string) => Promise<void>;
	constructor(sendCommand: (command: string) => Promise<void>) {
		this.sendCommand = sendCommand;
	}

	async setupNeopixel() {
		const setupCommands = [
			"\x03\r\n",
			"from machine import Pin",
			"import neopixel",
			"np = neopixel.NeoPixel(Pin(7), 25)",
			"print('NeoPixel inicializado')",
		];

		for (const cmd of setupCommands) {
			await this.sendCommand(cmd);
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	async sendLEDConfigurations(data: NeopixelData[]) {
		const json = JSON.stringify({ neopixel: data }, null, 3);

<<<<<<< HEAD
    leds.forEach((svg) => {
      const pos = svg.getAttribute("id");
      const ledRect = svg.querySelector("#led");

      if (ledRect && ledRect.getAttribute("text") == "on") {
        const cor = ledRect.getAttribute("fill");
        dados.push({ pos: pos!, cor: cor! });
      }
    });
=======
		try {
			// Initial setup
			await this.setupNeopixel();
>>>>>>> eb3e676e86b6b349858e36578b295fd3bdd6bbd3

			// Send LED commands
			const micropythonCommands = toMicropython(json);
			for (const command of micropythonCommands) {
				await this.sendCommand(command);
				await new Promise((resolve) => setTimeout(resolve, 50));
			}

			console.log("Commands sent successfully!");
		} catch (error) {
			console.error("Error sending commands:", error);
			throw error;
		}
	}
}
