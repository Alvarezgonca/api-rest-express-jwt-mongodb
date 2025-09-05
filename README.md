# API de Autenticação e CRUD com Node.js, MongoDB e JWT

## Descrição
API REST básica para registro de usuários, autenticação e CRUD de tarefas protegidas, usando Node.js, Express, MongoDB (via Docker) e JWT.

---

## Pré-requisitos
- Node.js instalado
- Docker e Docker Compose instalados
- Git instalado (opcional, para versionamento)

---


## Como rodar o projeto

1. **Clonar o repositório**
  ```bash
  git clone git@github.com:Alvarezgonca/api-rest-express-jwt-mongodb.git
  cd api-rest-express-jwt-mongodb
  ```

2. **Instalar dependências**
  ```bash
  npm install
  npm install bcrypt jsonwebtoken dotenv
  ```

3. **Configurar variáveis de ambiente**
  Crie um arquivo `.env` na raiz do projeto com suas próprias chaves seguras:
  ```
  JWT_SECRET=sua_chave_super_secreta_aqui
  JWT_REFRESH_SECRET=sua_chave_refresh_secreta_aqui
  ```
  O pacote `dotenv` carrega automaticamente as variáveis do `.env` para o código Node.js.

4. **Subir o MongoDB com Docker Compose**
  ```bash
  docker compose up -d
  ```

5. **Rodar a API**
  ```bash
  node index.js
  ```

A API estará disponível em http://localhost:3000

---


## Testando a API

Você pode testar as rotas usando Insomnia, Postman ou curl.

### Registro de usuário
**POST /auth/register**
URL: http://localhost:3000/auth/register
Body (JSON):
```json
{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "suaSenha"
}
```
Resposta esperada:
```json
{
  "message": "Usuário registrado com sucesso"
}
```

### Login
**POST /auth/login**
URL: http://localhost:3000/auth/login
Body (JSON):
```json
{
  "email": "seu@email.com",
  "password": "suaSenha"
}
```
Resposta esperada:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "_id": "...",
    "name": "Seu Nome",
    "email": "seu@email.com"
  }
}
```


### Refresh Token
**POST /auth/refresh**
URL: http://localhost:3000/auth/refresh
Body (JSON):
```json
{
  "refreshToken": "..."
}
```
Resposta esperada:
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Dados do usuário autenticado (/me)
**GET /me**
URL: http://localhost:3000/me

No Insomnia/Postman, vá na aba Headers e adicione:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```
O accessToken é obtido no login. Não envie no body!

Resposta esperada:
```json
{
  "_id": "...",
  "name": "Seu Nome",
  "email": "seu@email.com"
}
```

---

## Como funciona o middleware de autenticação JWT?

O middleware verifica se o accessToken enviado no header Authorization é válido. Se for, libera o acesso à rota protegida (ex: /me). Se não for, retorna erro 401. Use sempre o header:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```

---

## Estrutura do projeto
- `index.js` — código principal da API
- `docker-compose.yml` — configuração do MongoDB
- `.gitignore` — ignora arquivos/pastas desnecessários (ex: data/, node_modules/, .env)

---

## Observações
- O banco MongoDB é persistido na pasta `data/` (criada pelo Docker Compose)
- Para apagar todos os dados, basta remover a pasta `data/` ou usar `docker compose down -v`
- O registro de usuário já está funcionando e salva a senha criptografada

---

## Próximos passos
- Criar CRUD de tarefas (todos)
