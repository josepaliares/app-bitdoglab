
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
git clone https://github.com/seu-usuario/bitdoglab.git
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
