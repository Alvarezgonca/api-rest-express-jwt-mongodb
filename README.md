# API de Autenticação e CRUD com Node.js, MongoDB e JWT

## Descrição
API REST básica para registro de usuários, autenticação e CRUD de tarefas protegidas, usando Node.js, Express, MongoDB (via Docker) e JWT.

---

## Pré-requisitos
- Node.js instalado
- Docker e Docker Compose instalados
- Git instalado (opcional, para versionamento)

---

## Passos para rodar o projeto

### 1. Clonar o repositório
```bash
git clone git@github.com:Alvarezgonca/api-rest-express-jwt-mongodb.git
cd api-rest-express-jwt-mongodb
```


### 2. Instalar dependências do Node.js
```bash
npm install
npm install bcrypt
npm install jsonwebtoken
```

### 3. Subir o MongoDB com Docker Compose
```bash
docker compose up -d
```

### 4. Rodar a API
```bash
node index.js
```
A API estará disponível em http://localhost:3000

---

## Testando a rota de registro

No Insomnia ou Postman:
- Método: POST
- URL: http://localhost:3000/auth/register
- Body (JSON):
```json
{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "suaSenha"
}
```

---

## Estrutura inicial do projeto
- `index.js` — código principal da API
- `docker-compose.yml` — configuração do MongoDB
- `.gitignore` — ignora arquivos/pastas desnecessários (ex: data/, node_modules/)

---

## Observações
- O banco MongoDB é persistido na pasta `data/` (criada pelo Docker Compose)
- Para apagar todos os dados, basta remover a pasta `data/` ou usar `docker compose down -v`
- O registro de usuário já está funcionando e salva a senha criptografada

---

## Próximos passos
- Implementar login e geração de JWT
- Proteger rotas com autenticação
- Criar CRUD de tarefas (todos)
