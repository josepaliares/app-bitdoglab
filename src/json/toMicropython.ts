export { toMicropython }

function parse(json: string): [string, unknown] {
	const parsed: { string: unknown } = JSON.parse(json);
	const app: string = Object.keys(parsed)[0] as string;
	const instructions: unknown = Object.values(parsed)[0];
	return [app, instructions];
}

function micropython(app: string, instructions: unknown): string[] {
	switch (app) {
		case 'neopixel':
			return interpreterNeopixel(instructions as { pos: string, cor: string }[]);
		case 'ledRGB':
			return interpreterLedRGB(instructions as string);
		default: // isso será retirado após todos os apps serem feitos
			return ["em contrução..."]
	}
}

function toMicropython(json: string): string[] {
	const params: [string, unknown] = parse(json);
	return micropython(params[0], params[1]);
}

function interpreterNeopixel(instructions: { pos: string, cor: string }[]): string[] {
	function transformNumber(num: number): number {
		const swapMap: Record<number, number> = {
			0: 4, 4: 0,
			1: 3, 3: 1,
			10: 14, 14: 10,
			11: 13, 13: 11,
			20: 24, 24: 20,
			21: 23, 23: 21
		};

		return swapMap[num] ?? num;
	}
	const res: string[] = [];
	instructions.forEach(dict => {
		const rgbMatch: string[] = dict.cor.match(/\d+/g) as string[];
		const rgb: string = rgbMatch.join(', ');
		const pos: number = transformNumber(parseInt(dict.pos));
		res.push(`np[` + pos + `] = (${rgb})`);
	});
	res.push(`np.write()`);
	return res;
}

function interpreterLedRGB(instructions: string): string[] {
	const res: string[] = [];
	const rgbMatch: string[] = instructions.match(/\d+/g) as string[];
	const corR: number = parseInt(rgbMatch.at(0) as string) << 8;
	const corG: number = parseInt(rgbMatch.at(1) as string) << 8;
	const corB: number = parseInt(rgbMatch.at(2) as string) << 8;
	res.push(`pwmR.duty_u16(${corR})`);
	res.push(`pwmG.duty_u16(${corG})`);
	res.push(`pwmB.duty_u16(${corB})`);
	return res;
}
