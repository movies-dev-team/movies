Feature: Detalle de películas
  Como usuario de CINEA
  Quiero consultar la información detallada de una película
  Para conocer su sinopsis, director, ficha técnica, reparto y tráiler

  Scenario: Consultar los detalles de una película
    Given que estoy en el catálogo de películas
    When selecciono una película
    Then debería ver los detalles de la película seleccionada
    And debería visualizar su título
    And debería visualizar su sinopsis
    And debería visualizar su director
    And debería visualizar su ficha técnica
    And debería visualizar su reparto
    And debería visualizar su tráiler

  Scenario: Expandir la sinopsis de una película
    Given que estoy en el detalle de una película
    And su sinopsis contiene más de 150 caracteres
    When pulso el botón "Ver más"
    Then debería visualizar la sinopsis completa
    And debería aparecer el botón "Ver menos"

  Scenario: Contraer la sinopsis de una película
    Given que estoy en el detalle de una película
    And su sinopsis está expandida
    When pulso el botón "Ver menos"
    Then debería visualizar la sinopsis contraída
    And debería aparecer el botón "Ver más"

  Scenario: Visualizar una sinopsis corta
    Given que estoy en el detalle de una película
    When su sinopsis contiene 150 caracteres o menos
    Then debería visualizar la sinopsis
    And no debería aparecer el botón "Ver más"

  Scenario: Consultar los detalles de un actor
    Given que estoy en el detalle de una película
    And puedo visualizar su reparto
    When selecciono un actor
    Then debería navegar a la página de detalle del actor seleccionado

  Scenario: Consultar los detalles del director
    Given que estoy en el detalle de una película
    And puedo visualizar su director
    When selecciono al director
    Then debería navegar a la página de detalle del director

  Scenario: Visualizar el tráiler de una película
    Given que estoy en el detalle de una película
    And la película dispone de un tráiler
    When se carga la información del tráiler
    Then debería poder visualizar el reproductor del tráiler

  Scenario: Consultar una película sin tráiler disponible
    Given que estoy en el detalle de una película
    When no existe un tráiler disponible
    Then no debería visualizar un reproductor de vídeo inválido

  Scenario: Error al cargar los detalles de una película
    Given que selecciono una película del catálogo
    When ocurre un error en la petición a la API
    Then debería visualizar un mensaje de error

  Scenario: Consultar una película con un identificador inválido
    Given que intento acceder al detalle de una película
    When el identificador de la película no es válido
    Then debería visualizar un mensaje de error

  Scenario: Regresar al catálogo de películas
    Given que estoy en el detalle de una película
    When pulso el enlace para regresar al catálogo
    Then debería navegar al catálogo de películas
  
  Scenario: Error al cargar el tráiler de una película
  Given que estoy en el detalle de una película
  When ocurre un error al solicitar el tráiler a la API
  Then debería visualizar un mensaje de error
  And no debería visualizar el reproductor del tráiler
  And debería seguir visualizando los detalles de la película