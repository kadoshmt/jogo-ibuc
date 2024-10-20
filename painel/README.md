# NextAdmin - Next.js Admin Dashboard Template and Components

**NextAdmin** is a Free, open-source Next.js admin dashboard toolkit featuring 200+ UI components and templates that come with pre-built elements, components, pages, high-quality design, integrations, and much more to help you create powerful admin dashboards with ease.


[![nextjs admin template](https://cdn.pimjo.com/nextadmin-2.png)](https://nextadmin.co/)


**NextAdmin** provides you with a diverse set of dashboard UI components, elements, examples and pages necessary for creating top-notch admin panels or dashboards with **powerful** features and integrations. Whether you are working on a complex web application or a basic website, **NextAdmin** has got you covered.

### [✨ Visit Website](https://nextadmin.co/)
### [🚀 Live Demo](https://demo.nextadmin.co/)
### [📖 Docs](https://docs.nextadmin.co/)

By leveraging the latest features of **Next.js 14** and key functionalities like **server-side rendering (SSR)**, **static site generation (SSG)**, and seamless **API route integration**, **NextAdmin** ensures optimal performance. With the added benefits of **React 18 advancements** and **TypeScript** reliability, **NextAdmin** is the ultimate choice to kickstart your **Next.js** project efficiently.

## Description

Jogo [IBUC](https://ibuc.online) é um jogo de perguntas e respostas que tem o intuito de ensinar a Bíblia Sagrada para o público infanto-juvenil. Esta é o Painel Administrativo para gerenciar as perguntas do jogo.

## Installation

1. Download/fork/clone the repo and Once you're in the correct directory, it's time to install all the necessary dependencies. You can do this by typing the following command:

```
npm install
```
If you're using **Yarn** as your package manager, the command will be:

```
yarn install
```

2. Okay, you're almost there. Now all you need to do is start the development server. If you're using **npm**, the command is:

```
npm run dev
```
And if you're using **Yarn**, it's:

```
yarn dev
```

And voila! You're now ready to start developing. **Happy coding**!

## Requisitos Funcionais e Não-funcionais

- Autenticação:
  - [x] Criar página de Login por e-mail e senha
  - [x] Criar página de registro (Sign-up)
  - [x] Criar páginas de reset de senha (forgot-password e reset-password)
  - [x] Configurar a estratégia de login social do Google do Passaport
  - [ ] Configurar a estratégia de login social da Microsoft do Passaport
  - [ ] Configurar a estratégia de login social do Facebook Passaport
  - [x] Form de login e senha deve mostrar mensagem de usuário ou senha incorretos
  - [x] Verificar motivo da app redirecionar p/ dashboard quando acessa a home (/), mesmo sem estar logado
  - [ ] Criar os testes de navegação

- Profile
  - [x] Criar uma rota para que o usuárioobtenha seus dados e os edite
  - [x] Criar uma rota para que o usuário redefina sua senha
  - [x] Criar uma rota para que o usuário alterar sua foto de perfil
  - [ ] Criar uma rota para que o usuário apagar sua foto de perfil
  - [x] Criar uma rota para que o usuário possa deletar sua conta e tudo relacionada a ela (usuario, rankings, etc)...
  - [ ] criar uma rota para que o usuário possa alterar o seu username
  - [ ] Verificar erro visual ao excluir conta, onde o usuário digite qq variação diferente de "EXCLUIR"
  - [ ] Rever as regras do campo WhatsApp
  - [ ] Criar os testes de navegação

- Usuários
  - [x] Criar o módulo de usuários do Painel Administrativo
    - [x] Criar o CRUD básico
      - [x] Somente Administradores podem gerenciar usuários
      - [x] Criar rota com paginação de usuários
    - [ ] Rever as regras do campo WhatsApp
    - [ ] Criar os testes de navegação


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
      - [ ] Integrar com rota IA que busca tags sugeridas para a pergunta
      - [ ] Integrar com rota IA que cria uma pergunta e suas respostas
    - [ ] Criar rota para criar perguntas e suas respostas em lote


- Placar:
  - [ ] Criar um Dashboard com o placar dos jogadores

- Configuração:
  - [ ] Criar rora para revalidar o gmail.


- Segurança
  - [ ] Configurar HTTPS no ambiente de produção
  - [x] Utilizar cookies HTTP-only para armazenar o refresh token se possível.
  - [ ] Certificar-se de que todas as rotas sensíveis estão protegidas.


- Componentes
  - [ ] Refatorar componentes Input com if do icon (não manter iput duplicado)
  - [ ] Melhorar o Alert da Exclusão do perfil (usar Modal)
  - [ ] Criar um componente de DataTable


- Outros
  - [ ] Sanitizar e validar todas as entradas e saídas de dados
  - [ ] Aplicar Internacionalização


## Support

Você pode contribuir parao projeto através da chave PIX <b>35864425000123</b> ou através do [PagSeguro](https://pagseguro.uol.com.br/checkout/nc/nl/donation/sender-identification.jhtml?t=9e355ebc4bbb1c1433326954af3fe964c566452b95b21ce6b6df753a307b0f44&e=true).  Se quyiser conhecer o projeto, visite o [nosso site](https://ibuc.online).

## Stay in touch

- Dev - [Janes Roberto](https://www.linkedin.com/in/janes-roberto-da-costa/)
- Website - [https://ibuc.online/](https://ibuc.online/)
