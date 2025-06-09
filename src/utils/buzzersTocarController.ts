import { toMicropython } from "../json/toMicropython";

export interface BuzzersData {
	isPressed: boolean;
	frequency?: number;
	duration?: number;
}

export class BuzzersTocarController {
	private sendCommand: (command: string) => Promise<void>;

	constructor(sendCommand: (command: string) => Promise<void>) {
		this.sendCommand = sendCommand;
	}

	async setupBuzzer() {
		const setupCommands = [
			"\x03\r\n",
			"from machine import Pin, PWM",
			"import time",
			"buzzer = PWM(Pin(8))",  // Using GPIO8 for Buzzer
			"print('Buzzer inicializado')",
		];

		for (const cmd of setupCommands) {
			await this.sendCommand(cmd);
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	async startBuzzer(frequency: number) {
		const data: BuzzersData = {
			isPressed: true,
			frequency: Number(frequency.toFixed(0))
		};

		const json = JSON.stringify({ buzzer: data }, null, 2);
		console.log(json);

		try {
			await this.setupBuzzer();
			const micropythonCommands = toMicropython(json);

			for (const command of micropythonCommands) {
				await this.sendCommand(command);
				await new Promise((resolve) => setTimeout(resolve, 50));
			}
			console.log("Comandos enviados com sucesso!");
		} catch (error) {
			console.error("Erro ao iniciar buzzer:", error);
			throw error;
		}
	}

	async stopBuzzer(duration: number) {
		const data: BuzzersData = {
			isPressed: false,
			duration: duration
		};

		const json = JSON.stringify({ buzzer: data }, null, 2);
		console.log(json);

		try {
			await this.setupBuzzer();
			const micropythonCommands = toMicropython(json);

			for (const command of micropythonCommands) {
				await this.sendCommand(command);
				await new Promise((resolve) => setTimeout(resolve, 50));
			}
			console.log("Comandos enviados com sucesso!");
		} catch (error) {
			console.error("Erro ao parar buzzer:", error);
			throw error;
		}
	}
}
