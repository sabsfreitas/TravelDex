# TravelDex

TravelDex é uma API para gerenciar registros de cidades visitadas pelos usuários. Permite que usuários adicionem registros com fotos às cidades em suas viagens, consultem cidades registradas e vejam TOP usuário mais ativos e TOP cidades mais populares.

## 🚀 Funcionalidades

- Registro de cidades com upload de imagens
- Consulta de cidades registradas
- Listagem de usuários com mais registros
- Listagem das cidades mais registradas
- Soft Delete de perfil
- API de consulta paginada e ordenada

## 🛠 Tecnologias Utilizadas

- **Node.js** + **Express**
- **Sequelize ORM** 
- **PostgreSQL**
- **Multer**
- **Sharp**
- **JWT**
- **Joi**
- **Cors**

## 📦 Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/sabsfreitas/TravelDex.git
   cd TravelDex
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure o banco de dados no arquivo `.env`:
   ```env
   JWT_SECRET=sua_chave_secreta
   JWT_EXPIRES=1h
   DATABASE_URL=sua_url
   PORT=5000
   ```

4. Execute as migrações:
   ```sh
   npx sequelize-cli db:migrate
   ```

5. Inicie o servidor:
   ```sh
   npm start
   ```

## 🔥 Rotas da API

### 📌 Usuários
- `POST /usuarios/register` - Cria um novo usuário
- `POST /usuarios/auth` - Autentica um usuário
- `GET /usuarios/` - Listagem de usuários cadastrados (Rota protegida)
- `GET /usuarios/profile/:email` - Perfil de um usuário (Rota protegida)
- `POST /usuarios/search` - Procura um usuário (Rota protegida)

### 🌍 Cidades
- `GET /cidades` - Lista todas as cidades (Rota protegida)
- `GET /cidades/:id` - Detalhamento sobre uma cidade (Rota protegida)
- `POST /importar-cidades` - Importa cidades a partir de um JSON

### 📸 Registros
- `POST /registros/:idCidade` - Registra uma cidade para o usuário (Rota protegida)
  - Enviar `multipart/form-data` com a imagem
- `DELETE /registros/:id` - Remove um registro (Rota protegida)
