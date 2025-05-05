# 🔥 FURIA Project Echo

Projeto web completo desenvolvido para fãs da equipe de Counter-Strike da FURIA, como parte do desafio técnico para a vaga de Assistente/Estagiário de Engenharia de Software na FURIA Tech, através da plataforma 99jobs.

---

## 📌 Sobre o Projeto

FURIA Project Echo oferece uma plataforma interativa que conecta os fãs, promove interações ao vivo, oferece personalização avançada de perfis, métricas detalhadas de engajamento e um robusto sistema de gamificação com prêmios para incentivar interações contínuas.

---

## 🛠️ Stack Tecnológica

* **Frontend:** React, TypeScript, Tailwind CSS, Firebase Auth, Botpress Cloud, Recharts, Lucide Icons, @emoji-mart/react
* **Backend:** Node.js, Express, TypeScript, MySQL
* **Serviços e Infraestrutura:** Botpress Cloud, Firebase Authentication, Vercel, Render/Railway

---

## 🚀 Funcionalidades Implementadas

### 💬 Fan Thread Chat

* Chat estilo WhatsApp, em tempo real.
* Mensagens próprias alinhadas à direita, outras à esquerda.
* Reações às mensagens (like/dislike).
* Threads aninhadas com contagem visual de respostas.
* Integração completa com emoji picker.
* Avatares carregados diretamente do backend.

### 🤖 Chatbot com Botpress Cloud

* Utilização da plataforma Botpress Cloud para prover respostas automáticas contextuais.
* Base de conhecimento integrada com conteúdo atualizado sobre a equipe FURIA.
* Interação fluida e respostas rápidas com alto grau de precisão e relevância.
* Personalização do widget de chat com a identidade visual da FURIA.

### 📊 Dashboard Administrativo

* Painel completo com métricas em tempo real:

  * Usuários, posts, likes, posts mais curtidos, hashtags populares.
  * Distribuição demográfica por idade e estado.
  * Streaks e gráficos de atividades com Recharts.
* Layout impactante em dark mode com interatividade aprimorada.

### 🎨 Interface e UX

* Carousel dinâmico de notícias com banners navegáveis.
* Cabeçalho personalizado seguindo identidade visual oficial da FURIA.
* Ícone flutuante personalizado com logo da pantera FURIA.
* Responsividade completa com estilização detalhada usando Tailwind CSS.

### 🔐 Autenticação e Perfis

* Login via Google com Firebase Auth.
* Criação automática e gerenciamento completo de perfis no backend.
* Informações detalhadas do usuário: nickname, avatar, bio, cidade, nascimento, CPF e CEP.
* Progresso visual de completude do perfil com design inspirado na FURIA Store.

### 🏅 Sistema de Premiações

* Prêmios personalizados por engajamento e completude do perfil.
* Integração backend para exibição dinâmica e real.

### 📈 Métricas Pessoais

* Página dedicada exibindo métricas individuais detalhadas.
* Estatísticas de posts, likes, atividade contínua, entre outros.

---

## 📁 Estrutura Completa do Projeto

### Backend

* **Controllers:** Admin, Awards, Messages, Metrics, Users.
* **Middleware:** Validação de permissões administrativas.
* **Models:** Gestão de dados administrativos, prêmios, mensagens e usuários.
* **Rotas e Tipos:** Rotas REST com tipagem rigorosa em TypeScript.
* **Utilitários:** Validação de CPF e gerenciamento de emails administrativos.

### Frontend

* **Componentes:** FanThreadChat, Header, MessageBubble, ReplyBubble, Carousel.
* **Contexto:** Gestão da autenticação persistente.
* **Serviços:** Comunicação completa e estruturada com backend.
* **Tipos:** Definições claras para Awards, Metrics, Messages e ProfileData.
* **Páginas:** Estrutura robusta de rotas internas protegidas para perfil e dashboard.

---

## 🔄 Evolução do Projeto

* Setup inicial com Express e React, evoluindo para integração robusta com Botpress Cloud.
* Autenticação segura e escalável com Firebase Auth.
* Backend consistente com Node.js, Express e MySQL.
* Implementação detalhada de métricas reais e dashboard administrativo completo.
* Constantes refinamentos de interface, experiência do usuário e responsividade.

---

## 🎯 Próximas Implementações

* Recursos adicionais de segurança e autenticação.
* Expansão do sistema de gamificação.

---

## 📌 Como Executar Localmente

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Configuração

Siga `.env.example` para configuração adequada de variáveis ambiente.

---

## 📬 Contato e Links Úteis

* **LinkedIn:** [Ivanilson Ferreira](https://www.linkedin.com/in/ivanilson-ferreira/)
* **GitHub:** [IvanFerroli](https://github.com/IvanFerroli/IvanFerroli)

---

## 🤝 Como Contribuir

Faça um fork do repositório, crie sua branch de feature e submeta um pull request detalhado.

---

## 📜 Licença

Este projeto utiliza a licença MIT. Consulte [LICENSE](LICENSE) para mais detalhes.