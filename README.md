
# BitDogLab

O BitDogLab é uma plataforma educacional baseada na placa Raspberry Pi Pico, equipada com diversos componentes eletrônicos como botões, buzzers, microfone, LEDs, display e muito mais. Foi desenvolvida com o propósito de ensinar tecnologia de forma lúdica e interativa, despertando o interesse de crianças e jovens pelo universo da programação e eletrônica.
Este aplicativo é uma interface interativa criada com React + Capacitor, que permite aos usuários se conectarem e interagirem diretamente com a placa, facilitando o aprendizado e ampliando as possibilidades de experimentação.

Para mais detalhes sobre o hardware, acesse a [documentação oficial do BitDogLab](https://github.com/bitdoglab/bitdoglab).



## 🛠️ Requisitos

- **Node.js**: `v22.14.0`  
- **npm**: `v10.9.2`  
- **Java JDK** : `v17.0.14`
- **Android Studio**: `2024.3.1.14`

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/datasci4citizens/app-bitdoglab.git
cd bitdoglab
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Adicione a plataforma Android (apenas na primeira vez)

```bash
npx cap add android
```

---

## ⚙️ Desenvolvimento

Sempre que fizer alterações no código, execute:

```bash
npm run build
npx cap sync
```

### 🌐 Rodando na Web

```bash
npm run dev
```

Acesse: [http://localhost:5173/](http://localhost:5173/)

---

## 📱 Rodando no Android

### 1. Instale o Android Studio

Versão recomendada: **`2024.3.1.14`**

### 2. Instale o Java JDK 17

#### 💻 Windows

Você pode instalar via PowerShell:

```powershell
winget install Oracle.JavaRuntimeEnvironment --version 17
```

Ou baixe manualmente:  
👉 https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

#### 🐧 Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

Verifique a instalação com:

```bash
java -version
```

> Certifique-se de que o Java 17 está no PATH. Caso haja múltiplas versões:
>
> ```bash
> sudo update-alternatives --config java
> ```

---

### 3. Configure o JDK no Android Studio (caso necessário)

Se o Android Studio não detectar o JDK 17 corretamente:

1. Vá em `File > Settings` (ou `Ctrl + Alt + S`)
2. Acesse `Build, Execution, Deployment > Build Tools > Gradle`
3. Em **Gradle JDK**, selecione o caminho para o JDK 17 instalado
4. Clique em `Apply` e depois em `OK`

---

### 4. Abra o projeto Android

```bash
npx cap open android
```

- Aguarde o build inicial.
- Você pode rodar o app:
  - No emulador do Android Studio
  - No seu celular conectado por **USB** ou **Wi-Fi** com a **depuração ativada**

---

## Como expandir o app

### Para criar uma nova tela para um componente da placa:

1. **Criar pasta nova na `/pages` com o nome do componente**
   - Adicionar o arquivo da tela `.tsx` com o layout e UI do componente
   - Adicionar arquivo `.tsx` com o fluxograma explicativo da tela

2. **Criar um hook na pasta `/hooks`**
   - Implementar a lógica, estado e handlers para a tela
   - Usar esse hook dentro da tela para conectar UI e lógica

3. **Criar um controlador na pasta `/utils`**
   - Implementar a conversão de dados da interface para JSON
   - Enviar os comandos ao backend para comunicação com a placa

4. **Criar os componentes visuais reutilizáveis na pasta `/components`**
   - Componentes simples para pequenas partes visuais
   - Componentes composites para agrupamentos que serão usados na tela

---

## Onde encontrar mais informações?

- Leia o README específico em cada pasta para detalhes e exemplos:
  - `/pages/README.md` — estrutura e uso das telas
  - `/hooks/README.md` — exemplos e organização dos hooks
  - `/utils/README.md` — controladores e comunicação com o backend/placa
  - `/components/README.md` — como criar componentes folha e composite

---

## Boas práticas

- Separe visual (UI) da lógica usando hooks personalizados
- Mantenha a comunicação com a placa isolada em controladores (`utils`)
- Reutilize componentes React para manter a consistência visual
- Documente sempre cada novo componente e hook para facilitar manutenção

---