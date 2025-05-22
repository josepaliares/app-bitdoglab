# 📁 `/pages` — Telas da Aplicação

A pasta `/pages` contém **todas as telas da aplicação**, organizadas de forma modular para manter a escalabilidade e clareza do projeto.

---

## 🧩 Estrutura

A estrutura desta pasta segue o seguinte padrão:

```
/pages/
  ├── Neopixel/
  │   ├── Neopixel.tsx      # Tela de controle visual do componente Neopixel
  │   └── NeopixelInfo.tsx  # Tela explicativa com o fluxograma do Neopixel
  │   └── RGBInfo.tsx       # Tela interativa sobre como funciona o RGB
  ├── [...] Outros componentes
  ├── SplashScreen.tsx      # Tela de carregamento inicial (loading)
  ├── Welcome.tsx           # Aparece após a splashscreen, leva para a tela Connection
  ├── Connection.tsx        # Onde o usuário se conecta com a placa
  └── Components.tsx        # Onde o usuário seleciona um componente para interagir
  └── NotFound.tsx          # Caso o usuário vá para uma rota que não existe
```

---

## 🧱 Padrão para Componentes da Placa

Cada **componente físico** (como Neopixel, Buzzers, Display, etc.) deve ter sua própria subpasta:

### 📂 `/pages/NomeDoComponente/`

- `NomeDoComponente.tsx`:  
  Tela principal para interação com o componente. Exibe sliders, botões, cores, gráficos, etc.

- `NomeDoComponenteInfo.tsx`:  
  Tela que explica, de forma visual com o componentes FlowDiagram, como a interação com a placa funciona.

NovoComponente.tsx
```tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useConnection } from "../../contexts/ConnectionContext";
import SomeComponent from "@/components/SomeComponent";
import { useNovoComponente } from "@/hooks/useNovoComponente";

export default function NovoComponente() {
  const navigate = useNavigate();
  const { sendCommand } = useConnection();

  // Defina aqui as variáveis e parâmetros específicos do componente
  const parametroX = 10;
  const parametroY = 20;

  // Use o hook personalizado para lógica e estado do componente
  const {
    estado,
    setEstado,
    acao1,
    acao2,
  } = useNovoComponente(sendCommand, parametroX, parametroY);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Novo Componente</h1>

      {/* Renderize seus componentes visuais aqui */}
      <SomeComponent estado={estado} onClick={acao1} />

      {/* Exemplos de botões para ações */}
      <Button onClick={acao1}>Executar Ação 1</Button>
      <Button onClick={acao2} className="ml-2">Executar Ação 2</Button>
    </main>
  );
}
```