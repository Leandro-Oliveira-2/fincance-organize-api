# Usar uma imagem oficial do Node.js como base
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Compilar o TypeScript
RUN npm run build

# Expor a porta que a aplicação usará
EXPOSE 3000

# Definir o comando para iniciar a aplicação
CMD ["npm", "start"]
