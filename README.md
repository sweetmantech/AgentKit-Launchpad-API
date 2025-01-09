# 🚀 AgentKit Launchpad APIs

## 🏁 Getting Started

### 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Install with `npm install -g pnpm`)

### 🛠️ Installation

1. Clone the repository

```bash
git clone [repository-url]
cd recoup-agent-apis
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server

```bash
pnpm start
```

The server will start in development mode with hot-reload enabled.

## 📁 Project Structure

```
.
├── .git/
├── .github/
├── agents/
├── app.js
├── controllers/
├── ecosystem.config.cjs
├── .gitignore
├── instructions.md
├── lib/
├── package.json
├── README.md
├── routes.js
└── pnpm-lock.yaml
```

## Digital Ocean Droplet Setup

### 1. Create and Access Your Droplet

1. Create a new Ubuntu droplet on Digital Ocean
2. Access your droplet via SSH:
   ```bash
   ssh root@your_droplet_ip
   ```

### 2. Install Required Software

1. Install Node Version Manager (nvm):

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   ```

2. Install Node.js 20:

   ```bash
   nvm install 20
   nvm use 20
   ```

3. Install pnpm:

   ```bash
   # Install pnpm globally
   npm install -g pnpm
   ```

4. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

### 3. Configure GitHub Actions

1. Add the following secrets to your GitHub repository:
   - `DROPLET_IP`: Your Digital Ocean droplet's IP address
   - `DROPLET_USER`: Your droplet's username (usually 'root')
   - `DROPLET_PASSWORD`: Your droplet's password

### 4. Verify Installation

Run these commands to verify everything is installed correctly:

```bash
nvm --version
node --version
pnpm --version
pm2 --version
```

Now your Droplet is ready for the CI/CD pipeline to deploy the application.
