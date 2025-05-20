export { toMicropython }

function parse(json: string): [string, object[]] {
	const parsed: { string: unknown } = JSON.parse(json);
	const app: string = Object.keys(parsed)[0] as string;
	const instructions: object[] = Object.values(parsed)[0] as object[];
	return [app, instructions];
}

function micropython(app: string, instructions: object[]): string[] {
	switch (app) {
		case 'neopixel':
			return interpreterNeopixel(instructions as { pos: string, cor: string }[]);
		default: // isso será retirado após todos os apps serem feitos
			return ["em contrução..."]
	}
}

function toMicropython(json: string): string[] {
	const params: [string, object[]] = parse(json);
	return micropython(params[0], params[1]);
}

function interpreterNeopixel(instructions: { pos: string, cor: string }[]): string[] {
	function transformNumber(num: number): number {
		const swapMap: Record<number, number> = {
			5: 9, 9: 5,
			6: 8, 8: 6,
			15: 19, 19: 15,
			16: 18, 18: 16
		};

		return swapMap[num] ?? num;
	}
	const res: string[] = [];
	instructions.forEach(dict => {
		const rgbMatch: string[] = dict.cor.match(/\d+/g) as string[];
		const rgb: string = rgbMatch.join(', ');
		const pos: number = transformNumber(24 - parseInt(dict.pos));
		res.push(`np[` + pos + `] = (${rgb})`);
	});
	res.push(`np.write()`);
	return res;
}
