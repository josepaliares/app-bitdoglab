import { toMicropython } from "../json/toMicropython";

export interface GameData {
	isStarted: boolean;
	gameType?: string;
}

export class GameController {
	private sendCommand: (command: string) => Promise<void>;
	private isSetupDone: boolean = false;
	private isGameRunning: boolean = false;

	constructor(sendCommand: (command: string) => Promise<void>) {
		this.sendCommand = sendCommand;
	}

	async setupGame() {
		if (this.isSetupDone) {
			return;
		}

		const setupCommands = [
			"\x03\r\n", // Ctrl+C para parar execução anterior
			"from machine import Pin, PWM, ADC",
			"import neopixel",
			"import time",
			"",
			"# Setup hardware pins",
			"button_a = Pin(15, Pin.IN, Pin.PULL_UP)",
			"button_b = Pin(2, Pin.IN, Pin.PULL_UP)",
			"joystick_button = Pin(14, Pin.IN, Pin.PULL_UP)",
			"adc_vrx = ADC(Pin(26))",
			"adc_vry = ADC(Pin(27))",
			"adc = ADC(Pin(28))",  // Microfone
			"",
			"# Setup NeoPixel",
			"NUM_LEDS = 25",
			"np = neopixel.NeoPixel(Pin(7), NUM_LEDS)",
			"",
			"# Cores",
			"BLACK = (0, 0, 0)",
			"GREEN = (0, 255, 0)",
			"RED = (255, 0, 0)",
			"BLUE = (0, 0, 255)",
			"YELLOW = (255, 255, 0)",
			"cores = [RED, GREEN, BLUE, YELLOW]",
			"indice_cor = 0",
			"",
			"# LED Matrix mapping (5x5)",
			"LED_MATRIX = [",
			"    [0, 1, 2, 3, 4],",
			"    [5, 6, 7, 8, 9],",
			"    [10, 11, 12, 13, 14],",
			"    [15, 16, 17, 18, 19],",
			"    [20, 21, 22, 23, 24]",
			"]",
			"",
			"print('Game hardware inicializado')",
		];

		for (const cmd of setupCommands) {
			await this.sendCommand(cmd);
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		await this.setupGameFunctions();
		this.isSetupDone = true;
	}

	async setupGameFunctions() {
		const functionCommands = [
			"# Game functions",
			"def seta_Esquerda():",
			"    pattern = [0, 1, 6, 11, 16, 21, 22, 17, 12, 7, 2]",
			"    for led in pattern:",
			"        np[led] = GREEN",
			"    np.write()",
			"",
			"def seta_Direita():",
			"    pattern = [4, 3, 8, 13, 18, 23, 22, 17, 12, 7, 2]",
			"    for led in pattern:",
			"        np[led] = GREEN",
			"    np.write()",
			"",
			"def clear_all():",
			"    for i in range(NUM_LEDS):",
			"        np[i] = BLACK",
			"    np.write()",
			"",
			"def xplosion():",
			"    colors = [RED, YELLOW, GREEN, BLUE]",
			"    for _ in range(3):",
			"        for color in colors:",
			"            for i in range(NUM_LEDS):",
			"                np[i] = color",
			"            np.write()",
			"            time.sleep(0.1)",
			"    clear_all()",
			"",
			"def update_oled(messages):",
			"    if isinstance(messages, list):",
			"        for i, msg in enumerate(messages):",
			"            print(f'OLED Line {i}: {msg}')",
			"    else:",
			"        print(f'OLED: {messages}')",
			"",
			"def map_value(value, in_min, in_max, out_min, out_max):",
			"    return max(out_min, min(out_max, int((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)))",
			"",
			"def star_trek_beep():",
			"    print('*BEEP*')",
			"",
			"def vu_meter(adc_value):",
			"    level = map_value(adc_value, 0, 65535, 0, NUM_LEDS)",
			"    clear_all()",
			"    for i in range(level):",
			"        if i < 5:",
			"            np[i] = GREEN",
			"        elif i < 15:",
			"            np[i] = YELLOW",
			"        else:",
			"            np[i] = RED",
			"    np.write()",
			"",
			"print('Game functions definidas')",
		];

		for (const cmd of functionCommands) {
			await this.sendCommand(cmd);
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}

	async startGame() {
		if (this.isGameRunning) {
			console.log("Game já está rodando");
			return;
		}

		const data: GameData = {
			isStarted: true,
			gameType: "interactive"
		};

		const json = JSON.stringify({ game: data }, null, 2);
		console.log("🎮 Iniciando jogo:", json);

		try {
			await this.setupGame();
			this.isGameRunning = true;

			const micropythonCommands = toMicropython(json);

			for (const command of micropythonCommands) {
				await this.sendCommand(command);
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
			console.log("Jogo iniciado com sucesso!");
		} catch (error) {
			console.error("Erro ao iniciar jogo:", error);
			this.isGameRunning = false;
			throw error;
		}
	}

	async stopGame() {
		try {
			await this.sendCommand("\x03\r\n"); // Ctrl+C para parar
			await this.sendCommand("clear_all()");
			await this.sendCommand("print('Jogo parado')");
			this.isGameRunning = false;
			console.log("Jogo parado com sucesso!");
		} catch (error) {
			console.error("Erro ao parar jogo:", error);
			throw error;
		}
	}

	getGameStatus() {
		return {
			isSetupDone: this.isSetupDone,
			isGameRunning: this.isGameRunning
		};
	}

	resetSetup() {
		this.isSetupDone = false;
		this.isGameRunning = false;
	}
}
