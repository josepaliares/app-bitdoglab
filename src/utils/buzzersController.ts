import { toMicropython } from "../json/toMicropython";

export interface BuzzersData {
	isPressed: boolean;
	frequency?: number;
	duration?: number;
}

export class BuzzersController {
	private sendCommand: (command: string) => Promise<void>;
	private isSetupDone: boolean = false;

	constructor(sendCommand: (command: string) => Promise<void>) {
		this.sendCommand = sendCommand;
	}

	async setupBuzzer() {
		if (this.isSetupDone) {
			return;
		}

		const setupCommands = [
			"\x03\r\n", // Ctrl+C para parar execução anterior
			"from machine import Pin, PWM",
			"import time",
			"buzzer = PWM(Pin(21))",
			"buzzerAux = PWM(Pin(8))",
			"print('Buzzers inicializado')",
		];

		for (const cmd of setupCommands) {
			await this.sendCommand(cmd);
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		this.isSetupDone = true;
	}

	async startBuzzer(frequency: number) {
		const data: BuzzersData = {
			isPressed: true,
			frequency: Number(frequency.toFixed(0))
		};

		const json = JSON.stringify({ buzzer: data }, null, 2);
		console.log("🎵 Iniciando buzzer:", json);

		try {
			await this.setupBuzzer();
			const micropythonCommands = toMicropython(json);

			for (const command of micropythonCommands) {
				await this.sendCommand(command);
				await new Promise((resolve) => setTimeout(resolve, 50));
			}
			console.log("Buzzer iniciado com sucesso!");
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
		console.log("Parando buzzer:", json);

		try {
			const micropythonCommands = toMicropython(json);

			for (const command of micropythonCommands) {
				await this.sendCommand(command);
				await new Promise((resolve) => setTimeout(resolve, 50));
			}
			console.log("Buzzer parado com sucesso!");
		} catch (error) {
			console.error("Erro ao parar buzzer:", error);
			throw error;
		}
	}

	resetSetup() {
		this.isSetupDone = false;
	}
}