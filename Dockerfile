# Dockerfile para Node.js + Express + MongoDB (API)
FROM node:18-alpine

# Atualiza os pacotes do sistema para corrigir vulnerabilidades
RUN apk update && apk upgrade --no-cache

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install --production

# Copia o restante do código
COPY . .

# Expõe a porta padrão da API
EXPOSE 3000

# Comando para iniciar a API
CMD ["node", "index.js"]
