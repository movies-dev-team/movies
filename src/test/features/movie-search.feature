Feature: Búsqueda de películas
  Como usuario de CINÉA
  Quiero buscar películas por su título
  Para encontrar películas que me interesen

  Scenario: Buscar una película por su título
    Given que estoy en el catálogo de películas
    When escribo "Interstellar" en el buscador
    And envío la búsqueda
    Then debería ver los resultados relacionados con "Interstellar"

  Scenario: Buscar una película ignorando mayúsculas y minúsculas
    Given que estoy en el catálogo de películas
    When escribo "BATMAN" en el buscador
    And envío la búsqueda
    Then debería encontrar películas relacionadas con "Batman"

  Scenario: Buscar una película ignorando acentos
    Given que estoy en el catálogo de películas
    When escribo "Amelie" en el buscador
    And envío la búsqueda
    Then debería encontrar películas cuyo título contenga "Amélie"

  Scenario: Buscar con espacios al principio y al final
    Given que estoy en el catálogo de películas
    When escribo "  Interstellar  " en el buscador
    And envío la búsqueda
    Then la búsqueda debería ejecutarse sin espacios innecesarios

  Scenario: Enviar una búsqueda vacía
    Given que estoy en el catálogo de películas
    When envío el buscador vacío
    Then no debería realizar ninguna petición de búsqueda
    And debería limpiar los resultados de búsqueda

  Scenario: Mostrar un mensaje cuando no hay resultados
    Given que estoy en el catálogo de películas
    When busco una película que no tiene resultados
    Then debería mostrarse un estado sin resultados

  Scenario: Mostrar un error si falla la búsqueda
    Given que estoy en el catálogo de películas
    When la petición de búsqueda falla
    Then debería mostrarse un mensaje de error

  Scenario: Cargar más resultados de búsqueda
    Given que he realizado una búsqueda con varias páginas de resultados
    When solicito cargar más películas
    Then deberían añadirse los siguientes resultados
    And no deberían reemplazarse los resultados anteriores

  Scenario: No cargar más resultados cuando no hay más páginas
    Given que he realizado una búsqueda en la última página
    When solicito cargar más películas
    Then no debería realizarse otra petición

  Scenario: Filtrar los resultados por género
    Given que he realizado una búsqueda de películas
    When selecciono un género
    Then debería ver únicamente películas de ese género

  Scenario: Filtrar los resultados por puntuación
    Given que he realizado una búsqueda de películas
    When establezco una puntuación mínima o máxima
    Then deberían mostrarse únicamente películas dentro del rango seleccionado