<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Jogo [IBUC](https://ibuc.online) é um jogo de perguntas e respostas que tem o intuito de ensinar a Bíblia Sagrada para o público infanto-juvenil. Esta é a API para gerenciar as perguntas do jogo e os placares dos jogadores.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Requisitos Funcionais e Não-funcionais

- Autenticação:
  - [x] Configurar a estratégia de login e senha do Passaport
  - [x] Adicionar validação dos campos recebidos ao se registrar e fazer login com e-mail e senha
  - [x] Configurar a estratégia de login social do Google do Passaport
  - [ ] Configurar a estratégia de login social da Microsoft do Passaport
  - [ ] Configurar a estratégia de login social do Facebook Passaport
  - [x] Alterar o campo de firstname e lastname do banco para apenas name
  - [x] Não permitir que um usuário se cadastre por mais de 1 método
  - [ ] Quando logado, permitir que o usuário vincule um outro método de login
  - [ ] Criar uma rota que envia uma uma url de reset de senha
  - [ ] Implementar mecanismo de logout via API usando uma blacklist de tokens JWT no REDIS
  - [x] Criar um utilitário para lidar com a criptografia (brcrypt)
  - [x] Criar os testes unitários das estratégias
  - [ ] Criar os testes de integração das estratégias

- Profile
  - [x] Criar uma rota para que o usuário veja obtenha seus dados (/profile)
  - [x] Criar uma rota para que o usuário edite seus dados (/profile/edit)
  - [x] Criar uma rota para que o usuário redefina sua senha (/profile/change-password)
  - [ ] Criar uma rota para que o usuário alterar sua foto de perfil (profile/change-avatar)
  - [x] Criar uma rota para que o usuário possa deletar sua conta e tudo relacionada a ela (usuario, rankings, etc)...
  - [ ] Criar uma rota para que o usuário se cadastrar em newsletter
  - [ ] criar uma rota para que o usuário possa alterar o seu username
  - [ ] Criar todos os testes unitários
  - [ ] Criar testes de integração

- Usuários
  - [x] Criar o módulo de usuários do Painel Administrativo
    - [X] Criar o CRUD básico
      - [x] Somente Administradores podem gerenciar usuários
      - [x] Criar rota com paginação de usuários
    - [ ] Criar todos os testes unitários
    - [ ] Criar testes de integração
    - [ ] Corrigir testes de usuário, que não estão criando o perfil e o teste de findAllAdmin está falhando

- Categorias:
  - [ ] Criar o múdulo de Categorias (Lições e Módulos)
    - [ ] Criar Crud Básico
    - [ ] Categorias são recursivas

- Perguntas e Respostas:
  - [ ] Criar o múdulo de Perguntas e Respostas
    - [ ] CRUD de perguntas
      - [ ] A pergunta terá uma lista de respostas
      - [ ] Cada resposta pode ter um texto alternativo ao errar
      - [ ] Pergunta pode ter tags e níveis
      - [ ] Pergunta pode ter uma dica
      - [ ] Resposta terá sua própria tabela (1:N)
      - [ ] No list, params niveis, tags e qtde

- Sessões:
  - [ ] Criar Tabela de sessões do Jogo
    - [ ] CRUD de sessões

- Placar:
  - [ ] Criar Tabela de Ranking do jogo
    - [ ] Salvar pontuação, tempo em milissegundos e média
    - [ ] Salvar categoria, nível de dificuldade, id do usuário
    - [ ] Visitantes não tem placar

- Save Game:
  - [ ] Criar Tabela para salvar sessão do jogo do usuário logado

- IA:
  - [ ] Criar rota para buscar tags sugeridas para a pergunta (/ia/generate-tags)
  - [ ] Criar rota para criar uma pergunta e suas respostas (/ia/generate-anwsers)
  - [ ] Criar rota para criar perguntas e suas respostas em lote (/ia/generate-anwsers/:amount)


- Segurança
  - [ ] Não exponha o ID do usuário em respostas públicas da API ou logs
  - [ ] Configurar HTTPS no ambiente de produção
  - [ ] Usar o pacote helmet para configurar cabeçalhos HTTP de segurança.
  - [x] Implementar rate limiting para proteger contra ataques de força bruta
  - [ ] Implementar monitoramento e alertas para detectar atividades suspeitas.
  - [ ] Utilizar cookies HTTP-only para armazenar o refresh token se possível.
  - [ ] Implementar proteção contra ataques CSRF se usar cookies.
  - [ ] Certificar-se de que todas as rotas sensíveis estão protegidas com os Guards apropriados.

- Outros
  - [ ] Implementar um gerenciamento adequado de erros e exceções para fornecer feedbacks úteis e seguros aos usuários.
  - [x] Sanitizar e validar todas as entradas e saídas de dados
  - [ ] Proteger o banco de dados com as melhores práticas de segurança, incluindo acesso restrito, criptografia em repouso e backups seguros
  - [ ] Aplicar Internacionalização


## Support

Você pode contribuir parao projeto através da chave PIX <b>35864425000123</b> ou através do [PagSeguro](https://pagseguro.uol.com.br/checkout/nc/nl/donation/sender-identification.jhtml?t=9e355ebc4bbb1c1433326954af3fe964c566452b95b21ce6b6df753a307b0f44&e=true).  Se quyiser conhecer o projeto, visite o [nosso site](https://ibuc.online).

## Stay in touch

- Dev - [Janes Roberto](https://www.linkedin.com/in/janes-roberto-da-costa/)
- Website - [https://ibuc.online/](https://ibuc.online/)

## License

Esta aplicação usa o Nest, licensiado por uma [Licença MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
