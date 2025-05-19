module.exports = {
  apps: [
    {
      name: "agentkit-launchpad-apis",
      script: "pnpm",
      args: "start",
      cron_restart: "0 */12 * * *",
      watch: false,
      autorestart: true,
    },
  ],
};
