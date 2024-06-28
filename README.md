# Ronda Penal - Versão 2024

# Introdução

 Este relatório aborda o processo de desenvolvimento de um sistema de gerenciamento de apenados, projetado para atender às necessidades operacionais dos policiais da cidade de Araranguá. O sistema foi concebido para oferecer uma plataforma eficiente para o registro, monitoramento e administração de informações cruciais relacionadas aos apenados em liberdade condicional.
 
 A necessidade de um sistema integrado surgiu da demanda por uma abordagem mais eficaz e automatizada na gestão de dados relevantes para as atividades policiais. Através deste sistema, os policiais podem acessar informações atualizadas sobre apenados, visualizar mapas com a localização dos mesmos e registrar visitas de forma organizada e segura.
 
 A proposta de solução geral para o sistema de gerenciamento de apenados visa oferecer uma solução abrangente e eficiente para atender às demandas operacionais das forças policiais. Para isso, será desenvolvido um aplicativo móvel para uso dos policiais da viatura, onde será possível registrar as visitas e acessar o mapa da cidade. Nesse mapa, será possível visualizar a localização dos apenados, juntamente com seu grau de perigo.
 
 O aplicativo contará com autenticação e não terá acesso à internet, sendo abastecido com informações de um servidor localizado no quartel da polícia, onde será possível incluir, excluir e atualizar os dados de policiais e apenados. Como o aplicativo não terá acesso à internet, os dados serão atualizados apenas quando a viatura retornar ao quartel, garantindo assim a segurança e robustez do sistema como um todo.

<hr>

# Requisitos do Sistema

## Requisitos Funcionais

**RF_01** -	O sistema deve permitir que os policiais se autentiquem com suas credenciais de usuário para acessar as informações disponíveis.

**RF_02**	- O sistema deve permitir que os policiais cadastrem e visualizem as informações das pessoas em liberdade condicional.

**RF_03**	- O sistema deve sincronizar as informações cadastradas no servidor com o aplicativo móvel no quartel da polícia.

**RF_04**	- O aplicativo deve permitir que os policiais visualizem um mapa da região que mostre a localização dos apenados.

**RF_05**	- O aplicativo deve permitir que os policiais visualizem o perfil do apenado cadastrado, quando clicarem nele e mostre o grau de perigo do apenado.

**RF_06**	- O aplicativo deve permitir que os policiais registrem as visitas aos apenados.

## Requisitos Não-Funcionais

**RNF_01** -	O sistema deve garantir a segurança dos dados dos apenados, permitindo acesso apenas aos policiais autenticados.

**RNF_02**	- A interface do sistema deve ser intuitiva e de fácil uso, garantindo que os usuários possam realizar suas tarefas de forma eficiente.

**RNF_03**	- O sistema deve ser compatível com diferentes dispositivos e navegadores, garantindo uma experiência consistente para todos os usuários.

**RNF_04**	- O sistema deve ser escalável para permitir um crescimento dados no futuro.

**RNF_05** - O sistema deve ser estável para estar disponível todos os dias da semana, pois os policiais podem precisar a qualquer momento.

## Regras de Negócio

**RN_01**	- O aplicativo deve garantir que os dados sejam sincronizados com o servidor para sempre manter as informações atualizadas.

**RN_02**	- Os dados devem ser atualizados apenas no quartel da polícia de Araranguá.

**RN_03**	- Para garantir a segurança de dados, o sistema deve permitir que apenas policias autorizados e administradores tenham acesso as informações dos apenados.

<hr>

# Diagramas

## Diagrama de Caso de Uso

O diagrama de caso de uso representa as funcionalidades do sistema e como ele interage com diferentes tipos de usuários, neste caso, o Administrador e o Policial. 

**Servidor**

O Servidor é a parte central do sistema, sendo acessado principalmente pelo Administrador, que possui as seguintes funcionalidades:

Cadastrar Apenado: Permite ao Administrador adicionar um novo apenado ao sistema, inserindo os detalhes ao perfil do mesmo.

Cadastrar Policial: Permite ao Administrador adicionar um novo policial ao sistema, fornecendo as informações necessárias.

Gerenciar os Dados: Permite ao Administrador gerenciar os dados dos apenados e policiais, assim, visualizando, editando e excluindo registros.

**Aplicativo**

O aplicativo é a parte utilizada principalmente pelos policias de Araranguá, que possui as seguintes funcionalidades:

Autenticar o Usuário: Permite ao policial se autenticar no sistema, garantindo que apenas usuários autorizados possam acessar as informações.

Visualizar o Perfil dos Apenados: Permite ao policial acessar todas as informações necessárias dos apenados, assim como o grau de perigo de cada um.

Registrar Visitas: Permite ao policial marcar a visita a um apenado, incluindo uma descrição detalhada.

Sincronizar Informações com o Servidor: Permite ao policial sincronizar os dados coletados no campo com o servidor quando retornam ao quartel.

Este diagrama de caso de uso fornece um resumo visual de alto nível das funcionalidades do sistema e de como os diferentes usuários interagem com ele. Embora não esteja no diagrama, a sincronização de dados será possível apenas no quartel da polícia, garantindo a segurança dos dados.

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/d172e92c-d8f2-4159-a2f7-1ee32698a0b0' style="width: 500px;">
</center>

<small>Figura 1: Diagrama de Caso de Uso.</small>

## Protótipos de Telas

1. Login Servidor

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/40efcadf-cfbb-4b86-b303-1d2fb4209022' style="width: 500px;">
</center>

<small>Figura 3: Tela de Login do Servidor.</small>

2. Banco de Apenados

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/5873ed15-6b21-4526-b8be-9e712c7b65b9' style="width: 500px;">
</center>

<small>Figura 4: Tela de Banco de Apenados.</small>

3. Perfil do Apenado

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/398efcb7-e82e-433b-b963-8161e9384fbb' style="width: 500px;">
</center>

<small>Figura 5: Tela de Perfil do Apenado.</small>

4. Cadastro de Apenado

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/a39f4f57-66b7-4a62-b781-baf9e2aa77bb' style="width: 500px;">
</center>

<small>Figura 6: Tela de Cadastro de Apenado.</small>

5. Cadastro de Policial

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/8a9ebec0-cc3e-4332-9776-62d1242eb506' style="width: 500px;">
</center>

<small>Figura 7: Tela de Cadastro de Policial.</small>

6. Login no Aplicativo Mobile

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/5d0c8332-4f12-43e3-8f2e-f61ddc24dd8f' style="width: 250px;">
</center>

<small>Figura 8: Tela de Login no Aplicativo Mobile.</small>

## Diagrama de Classe

O diagrama de classe é uma representação da estrutura e das relações das classes que servem de modelo para os objetos no sistema. Ele mostra as diferentes classes, seus atributos, métodos e as interações entre elas.

**Classe Servidor:** A classe **Servidor** representa o núcleo central do sistema. Ela é responsável por gerenciar as operações principais, como login, adição e edição de apenados e policiais. Esta classe mantém uma relação de composição com as classes **Policial** e **Apenado**, o que significa que o **Servidor** é composto por múltiplas instâncias dessas classes.

**Classe Policial:** A classe **Policial** representa os dados dos policiais que interagem com o sistema. Ela possui atributos como nome, CPF, ID, senha e cargo. A relação de composição com a classe **Servidor** indica que os policiais são gerenciados centralmente pelo servidor.

**Classe Apenado:** A classe **Apenado** representa os dados dos indivíduos em liberdade condicional armazenados e acessados pelo sistema. Ela possui atributos como nome, CPF, endereço, telefone, crime, artigo penal, data penal e periculosidade. Esta classe possui uma relação de composição com a classe **Servidor** e uma relação de agregação com a classe **Aplicativo**, indicando que os apenados são gerenciados pelo servidor e acessados pelo aplicativo.

**Classe Aplicativo:** A classe **Aplicativo** representa o aplicativo usado pelos policiais de Araranguá. Ela é responsável por funcionalidades como autenticação do usuário, sincronização de dados, exibição de informações dos apenados, mapeamento e registro de visitas. O **Aplicativo** tem relações de agregação com as classes **Policial** e **Apenado**, e uma relação de composição com a classe **Mapa**, indicando que o **Aplicativo** inclui um objeto da classe **Mapa**. Além disso, o **Aplicativo** depende da classe **Servidor**, significando que ele utiliza o **Servidor**, mas não o inclui como parte de sua composição.

**Classe Mapa:** A classe **Mapa** representa a funcionalidade de mapeamento no aplicativo móvel. Ela possui atributos como localização e descrição, e é parte integrante do **Aplicativo**, estabelecendo uma relação de composição com essa classe.

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/e36871b9-1d28-4f75-8e1d-cad1b5226e9f' style="width: 500px;">
</center>

<small>Figura 9: Diagrama de Classe.</small>

## Modelo de Dados

O modelo de dados é uma representação visual dos elementos e suas conexões. As nossas entidades são Pessoa, Policial, Endereco, ArtigoPenal. Crime, Apenado e Visita. Assim, conseguindo que nosso sistema funcione de maneira eficiente.

**Pessoa:** A entidade Pessoa é um componente essencial do nosso modelo de dados. Ela representa tanto os policiais quanto os indivíduos no sistema, contendo informações como nome e CPF.

**Policial:** A entidade Policial representa os policiais no sistema. Cada policial é identificado por uma matrícula única e está associado a um CPF de uma Pessoa. Além disso, a entidade armazena a senha e o telefone do policial.

**Endereco:** A entidade Endereco representa os endereços dos indivíduos no sistema. Ela inclui informações detalhadas como rua, número, complemento, CEP, estado e município.

**ArtigoPenal:** A entidade ArtigoPenal representa diferentes artigos penais que podem ser associados a crimes. Cada artigo penal tem uma descrição detalhada.

**Crime:** A entidade Crime está diretamente relacionada à entidade ArtigoPenal. Um Crime é um registro de um ato ilegal cometido por um indivíduo, incluindo a data do ocorrido e uma descrição, e está associado a um artigo penal específico.

**Apenado:** A entidade Apenado representa os indivíduos que foram condenados por crimes. Cada apenado está associado a um endereço e a um crime, e possui um CPF que referência uma Pessoa. A entidade também inclui informações sobre a relevância do caso e a data de término da pena.

**Visita:** A entidade Visita mantém o registro de todas as visitas feitas pelos policiais aos apenados. Inclui observações feitas durante a visita, e está associada a um endereço, um policial e um apenado.

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/19c3f30d-76c2-4519-8e9b-84429fc5b8d3' style="width: 500px;">
</center>

<small>Figura 10: Modelo de dados.</small>

<hr>

# Requisitos de Hardware

O diagrama de hardware apresentado ilustra a arquitetura do sistema de gerenciamento de apenados, destacando a interação entre os diferentes componentes. No lado esquerdo, temos os dispositivos dos policiais (smartphones e computadores), que se conectam ao servidor central localizado no quartel da polícia. Este servidor central é responsável por gerenciar os dados, como cadastro de apenados e policiais, e sincronizar informações com os dispositivos móveis. A comunicação entre os dispositivos dos policiais e o servidor é bidirecional, garantindo que os dados sejam atualizados no quartel. Além disso, na parte inferior, os serviços de registro de visitas e notificações são destacados, demonstrando como os policiais podem registrar visitas e receber alertas diretamente em seus dispositivos móveis. Este modelo garante uma gestão eficiente e segura das informações dos apenados, atendendo às necessidades operacionais das forças policiais de Araranguá.

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/c3d7f868-0886-47c9-89be-4baded54f768' style="width: 500px;">
</center>

<small>Figura 11: Requisitos de Hardware.</small>

<hr>

# Tecnologias Utilizadas

O desenvolvimento do projeto envolveu o uso de várias tecnologias , abaixo, é descrito cada uma dessas tecnologias e como elas foram empregadas no projeto:

**PostgreSQL:** Utilizamos o PostgreSQL como banco de dados do servidor. Ele foi escolhido por ser um sistema de gerenciamento de banco de dados relacional robusto e confiável, adequado para armazenar e gerenciar os dados dos apenados e policiais de forma segura e eficiente.

**Flask:** Para o desenvolvimento do backend do servidor, utilizamos o Flask, um framework web leve e flexível em Python. O Flask foi escolhido por sua simplicidade e facilidade de uso, permitindo a rápida implementação das funcionalidades necessárias para o servidor. Com o Flask, conseguimos criar rotas, gerenciar requisições HTTP e interagir com o banco de dados de forma eficiente.

**Node.js:** Também utilizamos Node.js para o desenvolvimento do backend, especialmente para a criação de APIs robustas e eficientes. O Node.js foi escolhido pela sua alta performance e capacidade de lidar com um grande número de requisições simultâneas, além de ser uma excelente escolha para desenvolvimento de aplicações em tempo real.

**ReactJS:** Para a construção da interface do usuário, utilizamos ReactJS, uma biblioteca JavaScript popular que facilita a criação de componentes reutilizáveis e a gestão eficiente do estado da aplicação. ReactJS foi escolhido por sua flexibilidade e ampla adoção na indústria.

**JavaScript, Material UI e Styled Components:** Para o desenvolvimento frontend, utilizamos JavaScript como linguagem principal, o Material UI como framework de design e o Styled Components para estilização. Essas tecnologias foram escolhidas por sua capacidade de criar interfaces de usuário modernas, responsivas e visualmente atraentes.

**MapLibre:** É uma biblioteca de código aberto para incorporar mapas personalizáveis e responsivos, permitindo implementar funcionalidades de mapeamento de alto desempenho.

**GitHub:** Utilizamos o GitHub para colaboração no desenvolvimento do projeto. O GitHub oferece controle de versão e facilita a colaboração entre os membros da equipe, permitindo que todos trabalhem em conjunto de forma organizada e eficiente. Além disso, o GitHub também foi usado para hospedar o código-fonte do projeto, tornando-o acessível e disponível para todos os membros da equipe.

<hr>

# Possíveis Erros

Bom, como possíveis erros, podemos citar:

**Erro de Conexão:** Pode ocorrer um erro de execução do Aplicativo Mobile, este erro, pode ser causado por uma versão desatualizada das tecnologias utilizadas, portanto, é importante utilizar as seguintes versões:

  ```
  "react": "18.3.1",
  "Node.js": "18.20.3",
  "Java": "1.8.0_401",
  "PostgreSQL": "16.2",
  ```

Caso ainda não funcione, outra alternativa é instalar a extensão do React Native Tools no Visual Studio Code, que pode ser encontrada no link: [msjsdiag.vscode-react-native](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native)

Após a instalação, basta apertar em `ctrl + shift + d`, alterar o start debugging para `Debug Android Hermes` e clicar em `F5`. Isso deve resolver o problema de execução do aplicativo.

<hr>

# Conclusão

### Conclusão

Ao longo do desenvolvimento deste projeto, adquirimos um conhecimento valioso sobre diversas tecnologias que contribuíram significativamente para nossa experiência. Utilizamos Flask para o backend, ReactJS para o aplicativo móvel, GitHub para a colaboração no desenvolvimento do projeto, e Scrum para o gerenciamento de projetos. Assim, a integração dessas tecnologias nos permitiu criar uma solução eficiente e segura.

Compreendemos profundamente a importância de desenvolver uma plataforma que não só atenda às necessidades operacionais dos policiais da cidade de Araranguá, mas que também garanta a segurança e a integridade dos dados. Logo, a utilização de PostgreSQL como banco de dados e Node.js para a criação de APIs foi crucial para o sucesso do projeto. Além disso, a implementação de tecnologias como MapLibre para mapeamento e Material UI junto com Styled Components para estilização nos permitiu criar uma interface de usuário moderna e intuitiva.

Por fim, entendemos que o aplicativo ainda pode ser melhorado e expandido para atender a uma variedade de necessidades operacionais. Podemos citar, por exemplo adicionar funcionalidades como:

- Uma tela de listagem de PMs;
- Notificação ao se aproximar de um Apenado que não foi visitado;
- Um botão para o PM escolher o raio desejado para buscar os Apenados no mapa;
- Um alerta do tipo toast para informar que o usuário falhou em algum processo ou que obteve sucesso ao fazer um cadastro.

<hr>

# Instruções de execução

- Clonar o repositório com o Git Bash:

  ```bash
  git clone https://github.com/Butewbr/App-Apenados
  ```

- Entrar no diretório do projeto:

  ```bash
  cd 2023
  ```

- Instalar as dependencias:

  ```bash
  Yarnn install
  ```

- Rodar o Aplicativo:

  ```bash
  npm run app:start
  ```
- Rodar o Servidor:

  Para rodar o servidor no _Linux_, acesse o diretório base do projeto e rode o comando

  ```bash
  ./run.sh
  ```

  Para o Windows, basta rodar os seguintes comandos em sequência:

  ```bash
  docker compose build

  docker compose up
  ```
