export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converte um objeto RGB para uma string no formato 'rgb(r, g, b)'
 * 
 * @param rgb - Objeto contendo valores RGB
 * @returns String formatada como 'rgb(r, g, b)'
 */
export function rgbToString(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Tenta extrair valores RGB de uma string no formato 'rgb(r, g, b)'
 * 
 * @param colorString - String no formato 'rgb(r, g, b)'
 * @returns Objeto RGB ou valores padrão (0,0,0) se a conversão falhar
 */
export function stringToRgb(colorString: string): RGB {
  const defaultRgb: RGB = { r: 0, g: 0, b: 0 };
  
  const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbMatch || rgbMatch.length !== 4) {
    return defaultRgb;
  }
  
  // Utilizamos o operador non-null assertion (!) pois já verificamos que os grupos existem
  // ou fornecemos valores de fallback com ?? para garantir que temos números válidos
  return {
    r: parseInt(rgbMatch[1] ?? '0'),
    g: parseInt(rgbMatch[2] ?? '0'),
    b: parseInt(rgbMatch[3] ?? '0')
  };
}