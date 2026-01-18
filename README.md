# Api Restful desenvolvida com Node.js e Typescript.
Calcula intervalos entre prêmios consecutivos do mesmo produtor, trazendo a informação do menor e do maior intervalo.

## Exemplo de cálculo:
O produtor queganhou prêmios em 1990 e 1991 terá o intervalo de 1 ano. (1991 -1990 = 1).




## Pré-requisitos:
* Node.js 18.0.0 ou superior.

* npm 9.0.0 ou superior.

## Instalação:
* Clone o repositório:

**git clone https://github.com/joaowalter/movie-challenge.git**

* Instale as dependências:

**npm install**

* Verifique se o arquivo csv está presente na raiz, e com o nome correto:

**"Movielist.csv"**





## Execução:
* modo desenvolvedor com reload automático com nodemon:

**npm run dev**

* modo de produção com build:

**npm run build**

* isso vai criar a pasta /dist com o js compilado, após isso:

**npm start**





## Testes:
* Executar testes em modo "watch", observa mudança em arquivos e executa novamente os testes automaticamente:

**npm run test:watch**

* Executar testes com cobertura, isso vai gerar um relatório de cobertura dos testes:

**npm run test:coverage**

* Executar todos os testes sem "watch":

**npm test**



## Endpoints/Api:
* GET "/api/awards/award-intervals"

Retorna os intervalos mínimo e máximo entre prêmios consecutivos por produtor.

**Exemplo de response 200:**

```json
{
  "min": [
    {
      "producer": "Jerry Bruckheimer",
      "interval": 1,
      "previousWin": 2000,
      "followingWin": 2001
    }
  ],
  "max": [
    {
      "producer": "Steven Spielberg",
      "interval": 13,
      "previousWin": 2003,
      "followingWin": 2016
    }
  ]
}
```


**Descrição:**
**min[]:** Array de intervalos mínimos
**max[]:** Array de intervalos máximos
**producer:** Nome do produtor
**interval:** Diferença em anos entre os prêmios
**previousWin:** Ano do prêmio anterior
**followingWin:** Ano do prêmio seguinte



* GET "/health"

Endpoint de health check para monitoramento.

Exemplo com response 200:

```json
{
  "status": "ok",
  "timestamp": "2026-01-18T15:45:06.916Z"
}
```

* GET "/"

Endpoint raiz com informações da API.

Exemplo com response 200:

```json
{
  "message": "API de intervalos de prêmios de filmes",
  "routes": [
    {
      "path": "/api/awards/award-intervals",
      "method": "GET",
      "description": "Retorna os intervalos de prêmios de filmes"
    },
    {
      "path": "/health",
      "method": "GET",
      "description": "Retorna o status da API"
    }
  ]
}
```





## Dinâmica da aplicação:
- Carrega o arquivo Csv ao iniciar a aplicação.
- Faz o parsing de produtores múltiplos de um mesmo filme.
- Normaliza nomes.
- Acha os dados de filme de menor e maior intervalo, e retorna tudo em um único endpoint.




## Tecnologias do projeto:
- Node.js: melhor opção para operações assíncronas.
- TypeScript: Organização, estrura e legibilidade dos dados.
- Express: Simples e suficiente para o que a aplicação precisa, com midllewares e Rest (Nível 2 de Richardson).
- csv-parse: Biblioteca mais robusta e confiável para manipular arquivos csv.
- Jest / TsJest: biblioteca completa para rodar e produzir testes com suporte a ts com compilação leve e performance ótima.
- supertest: biblioteca que permite realizar testes Http sem o servidor estar rodando, e funciona muito bem com Jest.


## Arquitetura:
Preferi usar a arquitetura de camadas para poder separar as responsabilidades.
Poderia ser feito de uma maneira mais "Monolito", e conforme a complexidade e escala, ir separando isso posteriormente.

Como está funciona assim: Controllers/Routes -> Services -> Repositories -> DataLoader.

Controllers/Routes: Recebe as requisições e retorna reposta em json.  
Services: Cálculos, regras e filtros.  
Repositories: Acessa dados da memória e filtragem.  
DataLoader: Carrega os dados do csv, faz parsing e normaliza valores, popula repositórios.  

