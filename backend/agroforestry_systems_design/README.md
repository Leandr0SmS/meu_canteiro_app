# Agroforestry Systems Design

Projeto para o desenvolvimento de sistemas agroflorestais (SAFs), que realiza o planejamento automatizado de canteiros a partir das espécies fornecidas, respeitando critérios de luminosidade, estratificação e espaçamento entre plantas.

## Arquitetura

![Arquitetura Meu Canteiro SAF](https://github.com/Leandr0SmS/mvp_canteiroSAF_frontend/blob/main/resources/images/Meu_canteiro_Flowchart.png)

- Meu Canteiro Front: [https://github.com/Leandr0SmS/mvp_canteiroSAF_frontend](https://github.com/Leandr0SmS/mvp_canteiroSAF_frontend)
- Meu Canteiro API: [https://github.com/Leandr0SmS/mvp_canteiroSAF_API](https://github.com/Leandr0SmS/mvp_canteiroSAF_API)
- Agroforestry Systems Design API: [https://github.com/Leandr0SmS/agroforestry_systems_design](https://github.com/Leandr0SmS/agroforestry_systems_design)

## Funcionalidades

A API oferece recursos para o gerenciamento e organização de canteiros agroflorestais. Entre as principais funcionalidades:

- Cadastro, exclusão e edição de canteiros no banco de dados;
- Distribuição automatizada de plantas em canteiros SAF, com agrupamento por estrato;

## Como Executar

Você pode executar a aplicação de duas formas:

- [Execução local com Python](#execução-local-com-python)
- [Execução com Docker](#execução-com-docker)

### Execução Local com Python

1. Certifique-se de que o [Python 3.8+](https://www.python.org/) está instalado no sistema.
2. Crie um ambiente virtual isolado:

3. Criar e ativar um ambiente virtual:

   ```bash
   python -m venv env
   source env/bin/activate  # Linux/macOS
   .\env\Scripts\activate   # Windows

4. Instalar dependências:

   ```bash
   (env)$ pip install -r requirements.txt

5. Executar a aplicação Flask:

   ```bash
   (env)$ flask run --host 0.0.0.0 --port 5001

A API estará disponível em: [http://localhost:5001](http://localhost:5001)

### Execução com Docker

>Inicie primeiro a API [puc_rio-mvp_1-back_end](https://github.com/Leandr0SmS/puc_rio-mvp_1-back_end)

1. Verifique se o [Docker Engine](https://docs.docker.com/engine/) está instalado e em execução.

2. No diretório do projeto, execute o comando abaixo para construir a imagem Docker:

   ```Docker CLI
   docker build -t agroforestry_systems_design .


3. Execute o container (certifique-se de que a rede `canteiro_network` já existe ou a crie):

   ```Docker CLI
   docker run --name agroforestry_systems_design --network canteiro_network -p 5001:5001 agroforestry_systems_design


>[documentação do docker](https://docs.docker.com/engine/reference/run/).

## Autor

[Leandro Simões](https://github.com/Leandr0SmS)

## Licença

The MIT License (MIT)
Copyright © 2025 Leandro Simões

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Inspirações

- [PUC-Rio](https://www.puc-rio.br/index.html)
- [CodeCademy](https://www.codecademy.com/)
- [FreeCodeCamp](https://www.freecodecamp.org/learn/)
- [Cepeas](https://www.cepeas.org/)
- [Agenda Gotsch](https://agendagotsch.com/)
