Feature: Detalle de directores
  Como usuario de CINEA
  Quiero consultar la información detallada de un director
  Para conocer sus datos personales, biografía y películas dirigidas

  Scenario: Consultar los detalles de un director
    Given que estoy en el detalle de una película
    And puedo visualizar su director
    When selecciono al director
    Then debería visualizar los detalles del director seleccionado
    And debería visualizar su nombre
    And debería visualizar su fotografía si está disponible
    And debería visualizar su fecha de nacimiento si está disponible
    And debería visualizar su lugar de nacimiento si está disponible
    And debería visualizar su biografía
    And debería visualizar su filmografía

  Scenario: Expandir la biografía de un director
    Given que estoy en el detalle de un director
    And su biografía contiene más de 300 caracteres
    When pulso el botón "Ver más"
    Then debería visualizar la biografía completa
    And debería aparecer el botón "Ver menos"

  Scenario: Contraer la biografía de un director
    Given que estoy en el detalle de un director
    And su biografía está expandida
    When pulso el botón "Ver menos"
    Then debería visualizar la biografía contraída
    And debería aparecer el botón "Ver más"

  Scenario: Consultar un director sin biografía disponible
    Given que estoy en el detalle de un director
    When su biografía está vacía
    Then debería visualizar un mensaje indicando que no hay biografía disponible

  Scenario: Consultar la filmografía de un director
    Given que estoy en el detalle de un director
    When su filmografía está disponible
    Then debería visualizar las películas que ha dirigido
    And no debería visualizar películas en las que únicamente ha desempeñado otras funciones

  Scenario: Seleccionar una película de la filmografía
    Given que estoy en el detalle de un director
    And puedo visualizar su filmografía
    When selecciono una película
    Then debería navegar al detalle de la película seleccionada

  Scenario: Error al cargar los detalles de un director
    Given que selecciono un director
    When ocurre un error en la petición a la API
    Then debería visualizar un mensaje de error

  Scenario: Consultar un director con un identificador inválido
    Given que intento acceder al detalle de un director
    When el identificador del director no es válido
    Then debería visualizar un mensaje de error

  Scenario: Regresar al detalle de la película
    Given que he accedido al detalle de un director desde una película
    When pulso el enlace para regresar
    Then debería regresar al detalle de la película de origen