Feature: Valoración de películas
  Como usuario autenticado de CINEA
  Quiero valorar las películas del catálogo
  Para registrar mi opinión sobre las películas

  Scenario: Consultar una valoración existente
    Given que he valorado anteriormente una película
    When accedo al detalle de la película
    Then debería visualizar mi valoración guardada

  Scenario: Consultar una película que no he valorado
    Given que no he valorado anteriormente una película
    When accedo al detalle de la película
    Then debería visualizar las estrellas sin ninguna valoración seleccionada

  Scenario: Valorar una película
    Given que estoy en el detalle de una película
    And no he valorado anteriormente la película
    When selecciono una valoración entre 1 y 10
    Then debería guardarse mi valoración
    And debería visualizar la valoración seleccionada
    And debería recibir una notificación de confirmación

  Scenario: Modificar una valoración existente
    Given que estoy en el detalle de una película
    And he valorado anteriormente la película
    When selecciono una nueva valoración
    Then debería actualizarse mi valoración
    And debería visualizar la nueva valoración
    And debería recibir una notificación de confirmación

  Scenario: Consultar una valoración mientras se está cargando
    Given que accedo al detalle de una película
    When se está consultando mi valoración
    Then debería visualizar un mensaje de carga

  Scenario: Error al consultar una valoración
    Given que accedo al detalle de una película
    When ocurre un error al consultar mi valoración
    Then debería recibir una notificación de error

  Scenario: Error al guardar una valoración
    Given que estoy en el detalle de una película
    And tengo una valoración guardada
    When ocurre un error al guardar una nueva valoración
    Then debería recibir una notificación de error
    And debería mantenerse mi valoración anterior

  Scenario: Evitar guardados simultáneos
    Given que estoy en el detalle de una película
    And se está guardando mi valoración
    When intento realizar una nueva valoración
    Then no debería iniciarse otra petición de guardado

  Scenario: Intentar guardar una valoración inválida
    Given que quiero valorar una película
    When intento guardar una valoración fuera del rango permitido
    Then la valoración debería ser rechazada
    And no debería guardarse en la base de datos

  Scenario: Intentar valorar una película sin autenticación
    Given que no estoy autenticado
    When intento guardar una valoración
    Then la operación debería ser rechazada
    And no debería guardarse en la base de datos