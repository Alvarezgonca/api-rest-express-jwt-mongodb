

# API de Autenticação e CRUD com Node.js, MongoDB e JWT

## Descrição
API REST básica para registro de usuários, autenticação e CRUD de tarefas protegidas, usando Node.js, Express, MongoDB (via Docker) e JWT.

---

## Como rodar o projeto (recomendado: Docker Compose)

### Pré-requisitos
- Docker e Docker Compose instalados
- Git instalado

### Passos
1. **Clone o repositório:**
  ```bash
  git clone git@github.com:Alvarezgonca/api-rest-express-jwt-mongodb.git
  cd api-rest-express-jwt-mongodb
  ```

2. **Configure as variáveis de ambiente:**
  - Copie o arquivo de exemplo:
    ```bash
    cp .env.example .env
    ```
  - Edite o `.env` e defina valores seguros para `JWT_SECRET` e `JWT_REFRESH_SECRET`.

3. **Suba a aplicação (API + MongoDB):**
  ```bash
  docker compose up -d --build
  ```

4. Acesse a API em: http://localhost:3000

---

## Estrutura do projeto
- `index.js` — código principal da API
- `Dockerfile` — build da imagem Node.js
- `docker-compose.yml` — orquestração da API e MongoDB
- `.env.example` — exemplo de variáveis de ambiente
- `.env` — suas variáveis reais (NÃO versionar)
- `.dockerignore`/`.gitignore` — ignora arquivos/pastas desnecessários
- `data/` — persistência do MongoDB (criada automaticamente)

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



### Criar tarefa (todo)
**POST /todos**
URL: http://localhost:3000/todos

No Insomnia/Postman, vá na aba Headers e adicione:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```
Body (JSON):
```json
{
  "title": "Estudar Node.js",
  "done": false
}
```
Resposta esperada:
```json
{
  "_id": "...",
  "title": "Estudar Node.js",
  "done": false,
  "owner": "...",
  "__v": 0
}
```


### Listar tarefas do usuário
**GET /todos**
URL: http://localhost:3000/todos
Headers:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```
Resposta esperada:
```json
[
  {
    "_id": "...",
    "title": "Estudar Node.js",
    "done": false,
    "owner": "...",
    "__v": 0
  }
]
```


### Buscar tarefa específica
**GET /todos/:id**
URL: http://localhost:3000/todos/ID_DA_TAREFA
Headers:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```
Resposta esperada:
```json
{
  "_id": "...",
  "title": "Estudar Node.js",
  "done": false,
  "owner": "...",
  "__v": 0
}
```


### Atualizar tarefa
**PUT /todos/:id**
URL: http://localhost:3000/todos/ID_DA_TAREFA
Headers:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```
Body (JSON):
```json
{
  "title": "Novo título",
  "done": true
}
```
Resposta esperada:
```json
{
  "_id": "...",
  "title": "Novo título",
  "done": true,
  "owner": "...",
  "__v": 0
}
```


### Remover tarefa
**DELETE /todos/:id**
URL: http://localhost:3000/todos/ID_DA_TAREFA
Headers:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```
Resposta esperada:
```json
{
  "message": "Tarefa removida com sucesso"
}
```

---


## Como funciona o middleware de autenticação JWT?

O middleware verifica se o accessToken enviado no header Authorization é válido. Se for, libera o acesso à rota protegida (ex: /me, /todos). Se não for, retorna erro 401. Use sempre o header:
```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```

---


## Observações
- O banco MongoDB é persistido na pasta `data/` (criada pelo Docker Compose)
- Para apagar todos os dados, basta remover a pasta `data/` ou usar `docker compose down -v`
- O registro de usuário já está funcionando e salva a senha criptografada
