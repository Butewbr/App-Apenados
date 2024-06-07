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

Visualizar o mapa da cidade: Permite ao policial visualizar o mapa da cidade de Araranguá ou da região necessária.

Visualizar os dados dos apenados: Permite ao policial acessar todas as informações necessárias dos apenados, assim como o grau de perigo de todos que estão cadastrados no Banco de Dados e visíveis no mapa.

Cadastrar visitas: Permite ao policial marcar a visita a um apenado, assim como uma descrição.


Este diagrama de caso de uso fornece um resumo visual de alto nível das funcionalidades do sistema e de como os diferentes usuários interagem com ele. Embora não esteja no diagrama, a sincronização de dados será possível apenas no quartel da polícia, assim garantindo a segurança dos dados.

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/08924646-aca4-40b5-811f-cae50d03d6bc' style="width: 500px;">
</center>

<small>Figura 1: Diagrama de Caso de Uso.</small>

##	Diagrama de Classe

É uma representação da estrutura e relações das classes que servem de modelo para objetos.

Nosso sistema, terá a classe: Servidor, Policial, Apenado, Aplicativo e Mapa.

**Classe Servidor:** A classe Servidor representa o núcleo central do sistema. Ela mantém uma relação de composição com as classes Policial e Apenado, o que significa que o Servidor é composto por múltiplas instâncias dessas classes.

**Classe Apenados:** A classe Indivíduo representa os dados dos Apenados armazenados e acessados pelo sistema. Assim como a classe Policial, ela possui uma relação de composição com a classe Servidor e uma relação de agregação com a classe Aplicativo.

**Classe Aplicativo:** A classe Aplicativo representa o aplicativo usado pelos policiais de Araranguá. Ela tem relações de agregação com as classes Policial e Apenado, e uma relação de composição com a classe Mapa, indicando que o Aplicativo inclui um objeto da classe Mapa. Além disso, o Aplicativo depende da classe Servidor, significando que ele utiliza o Servidor, mas não o inclui como parte de sua composição.

**Classe Mapa:** A classe Mapa representa a funcionalidade de mapeamento no aplicativo móvel. Ela é parte integrante do Aplicativo, estabelecendo uma relação de composição com essa classe.

<center>
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/e36871b9-1d28-4f75-8e1d-cad1b5226e9f' style="width: 500px;">
</center>

<small>Figura 2: Diagrama de Classe.</small>

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
  <img src='https://github.com/Butewbr/App-Apenados/assets/113950309/18635732-6697-4d0c-8863-8d0a4789095b' style="width: 500px;">
</center>

<small>Figura 3: Modelo de dados.</small>

<hr>

# Tecnologias Utilizadas

O desenvolvimento do projeto envolveu o uso de várias tecnologias modernas e poderosas. Abaixo, é descrito cada uma dessas tecnologias e como elas foram empregadas no projeto:

**PostgreSQL:** Utilizamos o PostgreSQL como banco de dados do servidor. Ele foi escolhido por ser um sistema de gerenciamento de banco de dados relacional robusto e confiável, adequado para armazenar e gerenciar os dados dos apenados e policiais de forma segura e eficiente.

**Flask:** Para o desenvolvimento do backend do servidor, utilizamos o Flask, um framework web leve e flexível em Python. O Flask foi escolhido por sua simplicidade e facilidade de uso, permitindo a rápida implementação das funcionalidades necessárias para o servidor. Com o Flask, conseguimos criar rotas, gerenciar requisições HTTP e interagir com o banco de dados de forma eficiente.

**ReactJS, Material UI e Styled Components:** Para o desenvolvimento frontend, utilizamos o ReactJS como biblioteca JavaScript, o Material UI como framework de design e o Styled Components para estilização. Essas tecnologias foram escolhidas por sua capacidade de criar interfaces de usuário modernas, responsivas e visualmente atraentes.

**MapLibre:** É uma biblioteca de código aberto para incorporar mapas personalizáveis e responsivos, assim nos permitindo implementar as funcionalidades de mapeamento e desempenho. 

**GitHub:** Utilizamos o GitHub para colaboração no desenvolvimento do projeto. O GitHub oferece controle de versão e facilita a colaboração entre os membros da equipe, permitindo que todos trabalhem em conjunto de forma organizada e eficiente. Além disso, o GitHub também foi usado para hospedar o código-fonte do projeto, permitindo que seja acessível e disponível para todos os membros da equipe.

<hr>

# Instruções de execução







