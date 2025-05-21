# 📁 Pasta `/hooks`

Esta pasta contém os hooks personalizados responsáveis por encapsular a **lógica de controle** de cada componente da interface, separando o comportamento da visualização.

Cada hook implementa o estado, efeitos colaterais e funções de manipulação para um componente específico do hardware ou da interface.

## 🧠 Estrutura Geral

Para cada componente da placa (por exemplo, Neopixel, Buzzers, Display etc), existe um arquivo de hook correspondente com a seguinte responsabilidade:

- Gerenciar o estado interno (ex: cores, ângulos, leituras)
- Controlar interações com o usuário (ex: sliders, seleções)
- Enviar comandos para o backend através de funções auxiliares (normalmente localizadas em `/utils`)
- Manter o código reutilizável e organizado

## 📌 Exemplo: `useNeopixel.ts`

Este hook implementa a lógica para controlar a matriz de LEDs Neopixel.

### Principais responsabilidades:

- Gerenciar a cor RGB do LED selecionado
- Armazenar e atualizar o estado de todos os LEDs da matriz
- Enviar os comandos de configuração para a placa
- Integrar com o controlador (`NeopixelController`) via `sendCommand`

```tsx
const [rgb, setRgb] = useState<RGB>({ r: 0, g: 0, b: 0 });
const [selectedLEDIndex, setSelectedLEDIndex] = useState<number | null>(null);
const [ledColors, setLedColors] = useState<string[]>(Array(totalLEDs).fill('rgb(0, 0, 0)'));
```

Além disso, o hook implementa:

- `updateRgbComponent`: atualiza individualmente R, G ou B
- `handleLEDSelected`: altera o LED selecionado e ajusta os sliders
- `handleClear`: limpa a matriz
- `handleSend`: envia o estado atual para a placa

## 🚀 Expandindo com novos componentes

Para adicionar um novo componente da placa:

1. Crie um novo hook: `use<NovoComponente>.ts`
2. Implemente a lógica de estado e controle necessária
3. Use funções auxiliares de `/utils` para enviar comandos
4. Conecte esse hook na tela correspondente em `/pages/<componente>`

