# 🎮 GameView

> Plataforma web para reviews de jogos, integrando dados da API externa RAWG.

## 🧾 Descrição

O **GameView** é uma plataforma onde usuários podem buscar seus jogos favoritos e escrever reviews sobre eles.  
A aplicação busca informações completas dos jogos por meio da API pública **RAWG**, permitindo ao usuário buscar títulos, visualizar detalhes e contribuir com sua própria avaliação.

---

## 👥 Integrantes da Dupla

- Carlos Eduardo Sielski Urbim - [cesusieh](https://github.com/cesusieh)
- Lucas Antonio Domingues de Souza Oliveira - [LukaxVishh](https://github.com/LukaxVishh)

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem Backend:** C# (.NET 8)
- **Framework Backend:** ASP.NET Core
- **ORM:** Entity Framework Core
- **Frontend:** React.js
- **Autenticação:** JWT (JSON Web Tokens)
- **Banco de Dados:** MySQL
- **API Externa:** [RAWG Video Games Database API](https://rawg.io/apidocs)
- **Versionamento:** Git + GitHub

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [.NET SDK 8.0+](https://dotnet.microsoft.com/en-us/download)
- Node.js 18+
- MySQL instalado
- Git instalado

### Passos

#### 🔧 Backend

```bash
# 1. Clone o repositório
git clone https://github.com/cesusieh/GameView

# 2. Acesse a pasta do backend
cd GameView.API

# 3. Restaure os pacotes
dotnet restore

# 4. Atualize o banco de dados
dotnet ef database update

# 5. Execute a aplicação
dotnet run
```

#### 💻 Frontend

```bash
# 1. Acesse a pasta do frontend
cd GameView.front

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run start
```

---

## 🔑 Variáveis de Ambiente

### Backend `appsettings.Development.json`

```
  "ConnectionStrings": {
    "AppDbConnectionString": "server=; database=GameView; user=; password=;"
  },
  "RawgApiKey":""
```
