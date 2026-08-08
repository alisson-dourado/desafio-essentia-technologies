# TechX Task Manager

Aplicação fullstack de gerenciamento de tarefas desenvolvida como parte do desafio técnico da Essentia Group.

A aplicação permite que usuários autenticados criem, listem, editem, concluam, reabram e excluam tarefas. Também mantém um histórico adicional das tarefas utilizando MongoDB.

## Tecnologias utilizadas

### Frontend

- Angular 21
- TypeScript
- Angular Signals
- Reactive Forms
- RxJS

### Backend

- Node.js
- NestJS
- TypeScript
- TypeORM
- JWT
- Mongoose

### Bancos de dados

- MySQL 8 — banco principal e fonte de verdade das tarefas
- MongoDB 8 — armazenamento do histórico e informações adicionais das tarefas

### Infraestrutura

- Docker Compose

---

## Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

- Node.js 22 ou superior
- npm
- Docker
- Docker Compose

## Configuração e execução

### 1. Clone o repositório

```bash
git clone git@github.com:alisson-dourado/desafio-essentia-technologies.git
cd desafio-essentia-technologies
```

### 2. Inicie os bancos de dados

O MySQL e o MongoDB são executados através do Docker Compose.

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Para verificar se os containers estão em execução:

```bash
docker compose ps
```

Por padrão, os serviços estarão disponíveis em:

- MySQL: `localhost:3307`
- MongoDB: `localhost:27017`

### 3. Configure o backend

Entre no diretório do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

O arquivo `.env` deve possuir uma configuração semelhante a:

```env
PORT=3003

DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=essentia
DB_PASSWORD=essentia
DB_DATABASE=essentia_tasks

MONGO_URI=mongodb://localhost:27017/essentia_task_history

JWT_SECRET=change-me

FRONTEND_URL=http://localhost:4200

SEED_USER_EMAIL=admin@essentia.local
SEED_USER_PASSWORD=admin123
```

Para desenvolvimento local, recomenda-se substituir `JWT_SECRET` por um valor aleatório. Por exemplo:

```bash
openssl rand -base64 32
```

### 4. Crie o usuário inicial

Com os bancos em execução, rode o seed:

```bash
npm run seed
```

O seed é idempotente, portanto pode ser executado novamente sem criar usuários duplicados.

Com a configuração padrão do `.env.example`, as credenciais são:

```text
E-mail: admin@essentia.local
Senha: admin123
```

Essas credenciais são destinadas exclusivamente ao ambiente local do desafio.

### 5. Execute o backend

```bash
npm run start:dev
```

A API ficará disponível em:

```text
http://localhost:3003
```

### 6. Configure e execute o frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:4200
```

A URL da API utilizada pelo frontend está configurada em:

```text
src/environments/environment.ts
```

Por padrão:

```ts
export const environment = {
  apiUrl: 'http://localhost:3003',
};
```

### 7. Acesse a aplicação

Abra no navegador:

```text
http://localhost:4200
```

E utilize as credenciais criadas pelo seed:

```text
E-mail: admin@essentia.local
Senha: admin123
```

## Comandos de validação

### Backend

```bash
cd backend
npm run build
npm run lint
```

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

## Encerrando os serviços

Para parar os containers:

```bash
docker compose down
```

Para também remover os volumes e os dados locais dos bancos:

```bash
docker compose down -v
```