module.exports = {
  apps: [
    {
      name: "karaokly",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/srv/md0/alexradu/websites/karaokly",
      env: {
        NODE_ENV: "production",
        PORT: 4005,
      },
    },
  ],
}
