FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

# Les dépendances navigateur servent aux tests Playwright dans le conteneur.
RUN npx --yes playwright@1.65.0 install-deps chromium \
    && rm -rf /var/lib/apt/lists/*

USER node
