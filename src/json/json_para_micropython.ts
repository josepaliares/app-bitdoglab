function parse(json: string): [string, object[]] {
	const parseado: { string: unknown } = JSON.parse(json);
	const app: string = Object.keys(parseado)[0] as string;
	const instrucoes: object[] = Object.values(parseado)[0] as object[];
	return [app, instrucoes];
}

function micropython(app: string, instrucoes: object[]): string[] {
	switch (app) {
		case 'neopixel':
			return parseNeopixel(instrucoes as { id: string, cor: string }[]);
		default: // isso será retirado após todos os apps serem feitos
			return ["em contrução..."]
	}
}

function parseNeopixel(instrucoes: { id: string, cor: string }[]): string[] {
	const res: string[] = [];
	instrucoes.forEach(dict => {
		const rgbMatch: string[] = dict.cor.match(/\d+/g) as string[];
		const rgb: string = rgbMatch.join(', ');
		res.push(`np[${dict.id}] = (${rgb})`);
	});
	res.push(`np.write()`);
	return res;
}

function toMicropython(json: string): string[] {
	const params: [string, object[]] = parse(json);
	return micropython(params[0], params[1]);
}

export { toMicropython }
