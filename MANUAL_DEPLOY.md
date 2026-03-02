# 📖 Manual: Do Google AI Studio para o Mundo (GitHub + Netlify)

Siga este passo a passo sempre que baixar um novo projeto do AI Studio e quiser colocá-lo no seu portfólio.

---

### 1. Preparação (No Google AI Studio)
1.  No Google AI Studio, clique em **"Download Code"**.
2.  Extraia os arquivos em uma pasta no seu computador.
3.  **Dica do Antigravity:** Se você quiser que eu organize os arquivos (separar HTML, CSS e JS), basta me pedir: *"Organize estes arquivos do AI Studio para mim"*.

### 2. Configuração do Repositório (No GitHub)
1.  Acesse seu [GitHub](https://github.com/new).
2.  Crie um **New Repository** (ex: `meu-novo-projeto`).
3.  **Não** adicione README, .gitignore ou licença (deixe-o vazio).
4.  Copie a URL do repositório (ex: `https://github.com/seu-usuario/repo.git`).

### 3. Integração e Envio (No seu Terminal/VS Code)
Abra a pasta do projeto e rode estes comandos (ou peça para eu rodar):

```bash
# Inicializar o Git
git init

# Conectar ao seu GitHub (Cole a URL que você copiou)
git remote add origin https://github.com/seu-usuario/repo.git

# Adicionar todos os arquivos e fazer o primeiro commit
git add .
git commit -m "Primeiro commit: Projeto do AI Studio"

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

### 4. Deploy Automático (No Netlify)
1.  Acesse o [Netlify](https://app.netlify.com/).
2.  Clique em **"Add new site"** > **"Import from Git"**.
3.  Escolha o GitHub e selecione o repositório que você acabou de criar.
4.  **Configurações Importantes:**
    *   **Build Command:** `npm run build` (se for um projeto React/Vite) ou deixe em branco se for apenas HTML puro.
    *   **Publish directory:** `dist` (para Vite) ou `.` (para HTML puro).
5.  Clique em **"Deploy site"**.

### 5. Configurar a Inteligência Artificial (A Chave Gemini)
Se o seu projeto usa o Gemini, ele vai precisar da chave secreta no Netlify:
1.  No painel do seu site no Netlify, vá em **Site Settings** > **Environment variables**.
2.  Clique em **Add a variable**.
3.  Key (Nome): `GEMINI_API_KEY`
4.  Value (Valor): Cole sua chave do [Google AI Studio](https://aistudio.google.com/app/apikey).
5.  **Pronto!** O site vai carregar a IA agora.

---

### 🔄 Como atualizar o site depois?
Sempre que você mudar uma cor, um texto ou uma função no código:
1.  Salve os arquivos.
2.  Rode (ou me peça para rodar):
    ```bash
    git add .
    git commit -m "Descreva aqui o que você mudou"
    git push origin main
    ```
3.  **O Netlify vai detectar o push e atualizar seu site sozinho em segundos!**

---

> [!TIP]
> **Dica de Ouro:** Guarde este manual! Sempre que tiver um projeto novo, você pode simplesmente me dizer: *"Antigravity, siga o passo 3 do meu manual de deploy para este novo projeto"*.
