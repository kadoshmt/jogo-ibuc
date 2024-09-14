FROM node:20-slim

RUN apt update && apt install -y openssl procps

WORKDIR /home/node/jogo-ibuc

# Configurar umask para garantir permissões adequadas ao criar arquivos (leitura e escrita para o grupo)
RUN echo "umask 0002" >> /home/node/.bashrc

USER node

ENV PATH=/home/node/.npm-global/bin:$PATH

CMD tail -f /dev/null
