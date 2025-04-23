## 🐘 PostgreSQL + Prisma + Adminer + Google OAuth Setup

This project sets up a fullstack development environment with:

- PostgreSQL (via Docker)
- Adminer UI for DB access
- Prisma ORM
- Google OAuth 2.0 with Arctic
- `pnpm` as the package manager

---

### 📦 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)

---

### 🔧 Install `pnpm`

```bash
npm install -g pnpm
```

---

### 🚀 Getting Started

#### 1. Clone the Repository

```bash
git clone https://github.com/ayushsharma74/google-oauth-nextjs-template
cd google-oauth-nextjs-template
```

#### 2. Start Docker Services

```bash
docker-compose up -d
```

This will start:

- PostgreSQL on `localhost:5432`
- Adminer UI at `http://localhost:8080`

---

### 🌐 Access Adminer UI

Visit [http://localhost:8080](http://localhost:8080)

- **System**: PostgreSQL
- **Server**: `postgres`
- **Username**: `myuser`
- **Password**: `mypassword`
- **Database**: `mydatabase`

---

### ⚙️ Environment Setup

Create a `.env` file:

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase"

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Replace `your-google-client-id` and `your-google-client-secret` with credentials from the [Google Cloud Console](https://console.cloud.google.com/).

---

### 🔐 OAuth Client Configuration

In `lib/google-client.ts`:

```ts
import { Google } from "arctic";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  "http://localhost:3000/api/auth/oauth2callback"
);
```

---

### 🧙 Prisma Setup

#### 1. Install dependencies

```bash
pnpm install
```

#### 2. Define schema in `prisma/schema.prisma` (change it according to your use case)

Example:

```prisma
model User {
  id        String   @id @default(uuid())
  googleid  String   @unique
  username  String?
  sessions  Session[]
}

model Session {
  id        String   @id @default(uuid())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  expiresAt DateTime
}
```

#### 4. Run migrations

```bash
pnpm prisma migrate dev --name init
```

#### 5. Generate Prisma Client

```bash
pnpm prisma generate
```

---

### 🧼 Stopping Services

```bash
docker-compose down
```

To remove volumes (⚠️ deletes data):

```bash
docker-compose down -v
```

---

### 🛠️ Useful Commands

```bash
pnpm dev               # Start development server
pnpm prisma studio     # GUI for DB in browser
pnpm prisma db seed    # Run seed scripts
```
