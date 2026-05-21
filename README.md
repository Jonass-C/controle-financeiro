# 💰 Sistema para Controle Financeiro

> Projeto acadêmico para a disciplina de Engenharia de Software I.

### 📌 Escopo do Sistema

O projeto tem como objetivo desenvolver uma aplicação web voltada ao controle financeiro pessoal, permitindo que usuários acompanhem suas receitas e despesas de maneira prática, intuitiva e organizada. O sistema contará com autenticação de usuários, garantindo que cada pessoa tenha acesso apenas aos seus próprios dados financeiros. Entre as principais funcionalidades estão o cadastro e gerenciamento de transações financeiras, categorização de despesas e receitas, visualização de saldo total e análise de informações por meio de dashboards e gráficos simples. A aplicação também buscará facilitar o acompanhamento financeiro diário através de uma interface limpa e acessível.

---

### 👥 Equipe de Desenvolvimento

| Integrante | Papel |
|---|---|
| **Jonas** | Backend Developer |
| **Júlia** | Frontend Developer |
| **André** | Frontend Developer |
| **João Pedro** | Backend Developer |

---

### 💻 Tecnologias Utilizadas

| Categoria | Tecnologias |
|---|---|
| **Backend** | ![Java](https://img.shields.io/badge/Java-%23ED8B00.svg?style=flat&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-%236DB33F.svg?style=flat&logo=springboot&logoColor=white) |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E) ![Thymeleaf](https://img.shields.io/badge/Thymeleaf-005F0F?style=flat&logo=thymeleaf&logoColor=white) |
| **Banco de Dados** | ![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?style=flat&logo=sqlite&logoColor=white) |
| **Versionamento** | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white) |

### Backlog do Produto

| ID | História de Usuário |
|---|---|
| US01 | Como usuário, quero me cadastrar no sistema informando nome, identificador e senha para acessar minha conta. |
| US02 | Como usuário, quero realizar login utilizando identificador e senha para acessar minhas informações financeiras. |
| US03 | Como usuário, quero cadastrar transações financeiras contendo nome, data, valor, categoria e ganhos ou gastos para organizar minhas finanças. |
| US04 | Como usuário, quero adicionar categorias personalizadas durante o cadastro de transações para adaptar o sistema às minhas necessidades. |
| US05 | Como usuário, quero visualizar minhas transações em formato de lista para acompanhar meus registros financeiros. |
| US06 | Como usuário, quero visualizar um resumo financeiro em dashboard para acompanhar meu saldo e estatísticas. |
| US07 | Como usuário, quero editar transações já cadastradas para corrigir informações incorretas. |
| US08 | Como usuário, quero excluir transações cadastradas para remover registros desnecessários. |
| US09 | Como usuário, quero receber confirmação antes de excluir uma transação para evitar exclusões acidentais. |
| US10 | Como usuário, quero visualizar uma mensagem de saudação no cabeçalho com meu nome para personalizar a experiência. |
| US11 | Como usuário, quero realizar logout do sistema para encerrar minha sessão com segurança. |
| US12 | Como usuário, quero que o sistema valide login e cadastro diretamente no banco de dados para garantir autenticidade e persistência das informações. |

---

### Backlog da Sprint

| ID | História da Sprint | Tipo CRUD | Critério de Aceitação |
|---|---|---|---|
| SB01 | Como usuário, quero cadastrar uma nova conta no sistema para acessar a aplicação. | Create | Cadastro salvo corretamente no banco e validação de senha funcionando. |
| SB02 | Como usuário, quero adicionar uma nova transação financeira. | Create | Transação cadastrada com nome, data, valor, categoria e tipo. |
| SB03 | Como usuário, quero editar informações de uma transação existente. | Update | Pop-up abre preenchido e salva alterações corretamente. |
| SB04 | Como usuário, quero excluir uma transação cadastrada. | Delete | Sistema solicita confirmação antes da exclusão e remove o registro do banco. |
| SB05 | Como usuário, quero criar categorias personalizadas durante o cadastro de transações. | Create | Nova categoria aparece disponível após cadastro. |
| SB06 | Como usuário, quero visualizar minhas transações financeiras em lista. | Read | Sistema exibe todas as transações cadastradas do usuário. |
| SB07 | Como usuário, quero visualizar um resumo financeiro em dashboard para acompanhar meu saldo e estatísticas. | Read | Sistema exibe corretamente saldo total, receitas, despesas e estatísticas das transações cadastradas. |
