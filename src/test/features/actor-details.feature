Feature: Detalle de actores
  Como usuario de CINEA
  Quiero consultar la información detallada de un actor
  Para conocer sus datos personales, biografía y filmografía

  Scenario: Consultar los detalles de un actor
    Given que estoy en el detalle de una película
    And puedo visualizar su reparto
    When selecciono un actor
    Then debería visualizar los detalles del actor seleccionado
    And debería visualizar su nombre
    And debería visualizar su fotografía si está disponible
    And debería visualizar su fecha de nacimiento si está disponible
    And debería visualizar su lugar de nacimiento si está disponible
    And debería visualizar su biografía
    And debería visualizar su filmografía

  Scenario: Expandir la biografía de un actor
    Given que estoy en el detalle de un actor
    And su biografía contiene más de 300 caracteres
    When pulso el botón "Ver más"
    Then debería visualizar la biografía completa
    And debería aparecer el botón "Ver menos"

  Scenario: Contraer la biografía de un actor
    Given que estoy en el detalle de un actor
    And su biografía está expandida
    When pulso el botón "Ver menos"
    Then debería visualizar la biografía contraída
    And debería aparecer el botón "Ver más"

  Scenario: Visualizar una biografía corta
    Given que estoy en el detalle de un actor
    When su biografía contiene 300 caracteres o menos
    Then debería visualizar su biografía
    And no debería aparecer el botón "Ver más"

  Scenario: Consultar un actor sin biografía disponible
    Given que estoy en el detalle de un actor
    When su biografía está vacía
    Then debería visualizar un mensaje indicando que no hay biografía disponible

  Scenario: Consultar un actor cuya biografía contiene solo espacios
    Given que estoy en el detalle de un actor
    When su biografía contiene únicamente espacios en blanco
    Then debería visualizar un mensaje indicando que no hay biografía disponible

  Scenario: Consultar un actor con datos personales incompletos
    Given que estoy en el detalle de un actor
    When no están disponibles algunos de sus datos personales
    Then debería visualizar los datos disponibles
    And no debería visualizar información inválida

  Scenario: Consultar la filmografía de un actor
    Given que estoy en el detalle de un actor
    When su filmografía está disponible
    Then debería visualizar las películas en las que ha participado

  Scenario: Seleccionar una película de la filmografía
    Given que estoy en el detalle de un actor
    And puedo visualizar su filmografía
    When selecciono una película
    Then debería navegar al detalle de la película seleccionada

  Scenario: Error al cargar los detalles de un actor
    Given que selecciono un actor
    When ocurre un error en la petición a la API
    Then debería visualizar un mensaje de error

  Scenario: Consultar un actor con un identificador inválido
    Given que intento acceder al detalle de un actor
    When el identificador del actor no es válido
    Then debería visualizar un mensaje de error

  Scenario: Regresar al detalle de la película
    Given que he accedido al detalle de un actor desde una película
    When pulso el enlace para regresar
    Then debería regresar al detalle de la película de origen