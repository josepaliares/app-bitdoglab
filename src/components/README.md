# 📁 components

A pasta `/components` contém todos os **componentes visuais reutilizáveis** do projeto, organizados de forma a suportar tanto **componentes simples** (como botões, sliders, LEDs) quanto **componentes compostos (composites)** que combinam múltiplos elementos em uma única estrutura visual e funcional.

---

## 📌 Estrutura dos Componentes

- **Simples**: Componentes visuais pequenos e reutilizáveis que representam uma unidade única de UI. Exemplo: `LED.tsx`
- **Compostos**: Componentes que agregam vários elementos simples ou lógicos para formar unidades maiores. Exemplo: `LEDMatrix.tsx`

---

## 📦 Exemplo de Componente Composto

### `LEDMatrix.tsx`

Renderiza uma matriz interativa de LEDs. Pode ser configurada para qualquer número de linhas e colunas. Internamente utiliza o componente `LED`.

### Props:

- `ledsPerCol`: número de LEDs por coluna.
- `ledsPerRow`: número de LEDs por linha.
- `onLEDSelected`: função chamada quando um LED é clicado.
- `ledColors`: array com cores dos LEDs, indexado pelo índice do LED.

---

## 🔁 Composição

Componentes compostos como `LEDMatrix` se beneficiam da composição de React para estruturar logicamente a UI em blocos reutilizáveis. Isso promove **modularidade**, **testabilidade** e **facilidade de expansão**.

---

## 🧱 Como adicionar um novo componente?

Crie um novo arquivo em `/components`, como `NovoComponente.tsx`.
```tsx
import React from 'react';

interface NovoComponenteProps {
  valor: number;
  onChange: (novoValor: number) => void;
  ativo?: boolean;
}

/**
 * NovoComponente - Exemplo de componente reutilizável
 *
 * @param {NovoComponenteProps} props - Propriedades do componente
 * @returns {JSX.Element} - Componente React
 */
const NovoComponente: React.FC<NovoComponenteProps> = ({
  valor,
  onChange,
  ativo = true
}) => {
  const handleClick = () => {
    if (ativo) {
      onChange(valor + 1); // Exemplo simples de interação
    }
  };

  return (
    <div
      className={`p-4 border rounded ${ativo ? 'bg-green-200' : 'bg-gray-200'}`}
      onClick={handleClick}
    >
      <p className="text-lg font-bold">Valor atual: {valor}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Incrementar
      </button>
    </div>
  );
};

export default NovoComponente;
```
Se esse componente agrupar outros componentes, você pode expandi-lo facilmente com
```tsx
import SubComponente from './SubComponente';

...

return (
  <div>
    <SubComponente />
    <OutroComponente />
  </div>
);
```

