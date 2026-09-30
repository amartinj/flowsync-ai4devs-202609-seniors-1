# Cuentas y acceso

## Purpose

Permitir que una persona cree su cuenta en FlowSync, inicie y cierre sesión, y vea su perfil, de forma que solo quien ha demostrado conocer su email y contraseña pueda acceder a las partes privadas de la aplicación.

## Requirements

### Requirement: Registro de cuenta por la API

El sistema SHALL aceptar `POST /api/v1/auth/signup` con un cuerpo JSON que contenga `fullName`, `email`, `password` y `passwordConfirmation`, crear la cuenta y responder `200` con `{ "data": { "user": <usuario>, "token": <token> } }`, dejando a la persona ya autenticada sin necesidad de un inicio de sesión posterior.

#### Scenario: Registro válido

- **WHEN** se envía un registro con `fullName` "Ada Lovelace", un email no registrado, `password` de entre 8 y 32 caracteres y `passwordConfirmation` idéntica
- **THEN** la respuesta es `200` con `data.user` (que contiene `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`) y `data.token`, una cadena opaca que empieza por `oat_`, y la respuesta no incluye la contraseña en ninguna forma

#### Scenario: El token del registro sirve para acceder

- **WHEN** tras un registro correcto se pide el perfil con `Authorization: Bearer <data.token>`
- **THEN** la respuesta es `200` con los datos de la cuenta recién creada

### Requirement: El nombre completo es opcional pero su clave es obligatoria

El sistema SHALL exigir que el cuerpo del registro incluya la clave `fullName`, y SHALL aceptar como valor tanto un texto como `null`. Un texto vacío se trata como `null`.

#### Scenario: Registro con nombre nulo

- **WHEN** se registra una cuenta con `"fullName": null`
- **THEN** la respuesta es `200` y `data.user.fullName` es `null`

#### Scenario: Registro con nombre vacío

- **WHEN** se registra una cuenta con `"fullName": ""`
- **THEN** la respuesta es `200` y `data.user.fullName` es `null`

#### Scenario: Registro sin la clave del nombre

- **WHEN** se envía un registro válido en todo lo demás pero sin la clave `fullName`
- **THEN** la respuesta es `422` con un error de regla `required` sobre el campo `fullName`

### Requirement: Validación de los datos de registro

El sistema SHALL rechazar con `422` y un cuerpo `{ "errors": [ { "message", "rule", "field", "meta"? } ] }` cualquier registro cuyos datos no cumplan estas reglas, informando de todos los campos que fallan a la vez: el email debe tener formato de email y como máximo 254 caracteres; la contraseña y su confirmación deben tener entre 8 y 32 caracteres; la confirmación debe coincidir con la contraseña; los cuatro campos deben estar presentes.

#### Scenario: Cuerpo vacío

- **WHEN** se envía un registro con el cuerpo `{}`
- **THEN** la respuesta es `422` con un error `required` para cada uno de `fullName`, `email`, `password` y `passwordConfirmation`

#### Scenario: Email inválido y contraseña corta

- **WHEN** se envía un registro con `email` "nope" y `password` de 5 caracteres
- **THEN** la respuesta es `422` con un error `email` sobre `email` y un error `minLength` sobre `password` con `meta.min` igual a 8

#### Scenario: Contraseña demasiado larga

- **WHEN** se envía un registro con una contraseña (y su confirmación) de 33 caracteres
- **THEN** la respuesta es `422` con un error `maxLength` con `meta.max` igual a 32, tanto sobre `password` como sobre `passwordConfirmation`

#### Scenario: Confirmación distinta

- **WHEN** se envía un registro con `password` y `passwordConfirmation` válidas pero diferentes
- **THEN** la respuesta es `422` con un error de regla `sameAs` sobre `passwordConfirmation`

### Requirement: Un email solo puede tener una cuenta

El sistema SHALL rechazar el registro de un email que ya pertenece a otra cuenta, comparándolo exactamente tal como se escribió (distingue mayúsculas de minúsculas).

#### Scenario: Email repetido

- **WHEN** se registra un email que ya está registrado exactamente igual
- **THEN** la respuesta es `422` con un error de regla `database.unique` sobre `email`

#### Scenario: Mismo email con distinta capitalización

- **WHEN** existe una cuenta con "Ada@Example.com" y se registra "ada@example.com"
- **THEN** la respuesta es `200` y se crea una segunda cuenta, independiente de la primera

### Requirement: Inicio de sesión por la API

El sistema SHALL aceptar `POST /api/v1/auth/login` con `email` y `password` y, si coinciden con una cuenta, responder `200` con `{ "data": { "user": <usuario>, "token": <token> } }` y un token nuevo.

#### Scenario: Credenciales correctas

- **WHEN** se inicia sesión con el email y la contraseña de una cuenta existente
- **THEN** la respuesta es `200` con los datos de esa cuenta y un token nuevo

#### Scenario: Varios inicios de sesión conviven

- **WHEN** la misma persona inicia sesión dos veces y obtiene dos tokens
- **THEN** los dos tokens son válidos a la vez para acceder al perfil

### Requirement: Las credenciales incorrectas no revelan si la cuenta existe

El sistema SHALL responder igual cuando el email no existe que cuando la contraseña no es la correcta: `400` con `{ "errors": [ { "message": "Invalid user credentials" } ] }`, sin campo asociado.

#### Scenario: Contraseña incorrecta

- **WHEN** se inicia sesión con un email registrado y una contraseña equivocada
- **THEN** la respuesta es `400` con el mensaje "Invalid user credentials"

#### Scenario: Email desconocido

- **WHEN** se inicia sesión con un email que no pertenece a ninguna cuenta
- **THEN** la respuesta es `400` con el mismo cuerpo que ante una contraseña incorrecta

### Requirement: Validación de los datos de inicio de sesión

El sistema SHALL rechazar con `422` un inicio de sesión en el que falte el email o la contraseña, o en el que el email no tenga formato de email o supere los 254 caracteres. Los textos vacíos cuentan como ausentes. La contraseña no tiene límites de longitud en el inicio de sesión.

#### Scenario: Campos vacíos

- **WHEN** se inicia sesión con `"email": ""` y `"password": ""`
- **THEN** la respuesta es `422` con un error `required` sobre `email` y otro sobre `password`

#### Scenario: Email mal formado

- **WHEN** se inicia sesión con `email` "nope"
- **THEN** la respuesta es `422` con un error de regla `email` sobre `email`

### Requirement: Consulta del perfil propio

El sistema SHALL responder a `GET /api/v1/account/profile` con un token válido en la cabecera `Authorization: Bearer` devolviendo `200` y `{ "data": <usuario> }` con los datos de la cuenta dueña del token.

#### Scenario: Perfil con token válido

- **WHEN** se pide el perfil con un token obtenido en un registro o en un inicio de sesión que no se ha cerrado
- **THEN** la respuesta es `200` con `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials` de esa cuenta

### Requirement: Iniciales del usuario

El sistema SHALL devolver en cada usuario un campo `initials` en mayúsculas calculado así: si hay nombre y contiene al menos dos palabras separadas por un espacio, la primera letra de cada una de las dos primeras; si el nombre es una sola palabra, sus dos primeras letras; si no hay nombre, la primera letra de la parte del email antes de la `@` seguida de la primera letra de la parte posterior.

#### Scenario: Nombre de dos palabras

- **WHEN** la cuenta tiene `fullName` "Ada Lovelace"
- **THEN** `initials` es "AL"

#### Scenario: Nombre de una palabra

- **WHEN** la cuenta tiene `fullName` "ada"
- **THEN** `initials` es "AD"

#### Scenario: Sin nombre

- **WHEN** la cuenta no tiene nombre y su email es "spec@example.com"
- **THEN** `initials` es "SE"

### Requirement: Las rutas de cuenta exigen un token válido

El sistema SHALL rechazar cualquier petición a `/api/v1/account/*` que no traiga un token válido, respondiendo `401` con `{ "errors": [ { "message": "Unauthorized access" } ] }`.

#### Scenario: Sin token

- **WHEN** se pide el perfil o se cierra sesión sin cabecera `Authorization`
- **THEN** la respuesta es `401` con el mensaje "Unauthorized access"

#### Scenario: Token inventado

- **WHEN** se pide el perfil con `Authorization: Bearer oat_xxx`
- **THEN** la respuesta es `401` con el mensaje "Unauthorized access"

### Requirement: Cierre de sesión por la API

El sistema SHALL, ante `POST /api/v1/account/logout` con un token válido, invalidar ese token (y solo ese) y responder `200` con `{ "message": "Logged out successfully" }`.

#### Scenario: Cierre de sesión

- **WHEN** se cierra sesión con un token válido
- **THEN** la respuesta es `200` con `{ "message": "Logged out successfully" }` y cualquier petición posterior con ese token recibe `401`

#### Scenario: Cerrar sesión dos veces

- **WHEN** se cierra sesión con un token que ya se usó para cerrar sesión
- **THEN** la respuesta es `401` con el mensaje "Unauthorized access"

#### Scenario: Otras sesiones siguen abiertas

- **WHEN** una persona tiene dos tokens y cierra sesión con uno de ellos
- **THEN** el otro token sigue dando acceso al perfil

### Requirement: Las respuestas de la API son siempre JSON

El sistema SHALL responder en JSON a las rutas de cuentas y acceso, incluidos los errores, aunque la petición pida otro formato.

#### Scenario: Petición que pide HTML

- **WHEN** se pide el perfil sin token y con `Accept: text/html`
- **THEN** la respuesta es `401` con cuerpo JSON `{ "errors": [ { "message": "Unauthorized access" } ] }`

### Requirement: Pantalla de inicio de sesión

La aplicación web SHALL ofrecer en `/login` una pantalla titulada "Inicia sesión" con el texto "Entra con tu cuenta para volver a tus tareas.", campos "Email" y "Contraseña", un botón "Entrar" y un enlace "Crea una" que lleva a `/register`.

#### Scenario: Inicio de sesión correcto

- **WHEN** una persona sin sesión escribe un email y una contraseña correctos y pulsa "Entrar"
- **THEN** el botón muestra "Entrando…" y queda deshabilitado mientras espera, y al terminar la persona llega a su perfil

#### Scenario: Credenciales incorrectas

- **WHEN** una persona escribe un email o una contraseña que no coinciden con ninguna cuenta y pulsa "Entrar"
- **THEN** ve arriba del formulario el aviso "El email o la contraseña no son correctos." y sigue en la pantalla de inicio de sesión

#### Scenario: Email con formato inválido

- **WHEN** una persona escribe "nope" como email y pulsa "Entrar"
- **THEN** ve bajo el campo de email el mensaje "Introduce una dirección de email válida." y no ve aviso general

#### Scenario: Campos vacíos

- **WHEN** una persona pulsa "Entrar" sin rellenar nada
- **THEN** ve "Falta rellenar el email." bajo el email y "Falta rellenar la contraseña." bajo la contraseña; el navegador no bloquea el envío con su propia validación

### Requirement: Pantalla de registro

La aplicación web SHALL ofrecer en `/register` una pantalla titulada "Crea tu cuenta" con los campos "Nombre completo (opcional)", "Email", "Contraseña" (con la pista "Entre 8 y 32 caracteres.") y "Repite la contraseña", un botón "Crear cuenta" y un enlace "Inicia sesión" que lleva a `/login`.

#### Scenario: Registro correcto

- **WHEN** una persona sin sesión rellena email, contraseña válida y su repetición idéntica, y pulsa "Crear cuenta"
- **THEN** el botón muestra "Creando cuenta…" deshabilitado mientras espera, y al terminar la persona llega a su perfil ya con la sesión iniciada

#### Scenario: Nombre en blanco

- **WHEN** una persona deja el nombre vacío o solo con espacios y se registra
- **THEN** la cuenta se crea sin nombre y el perfil muestra "Sin nombre"

#### Scenario: Contraseñas distintas

- **WHEN** una persona escribe dos contraseñas diferentes y pulsa "Crear cuenta"
- **THEN** ve "Las contraseñas no coinciden." bajo "Repite la contraseña" sin que se llegue a enviar nada al servidor

#### Scenario: Email ya registrado

- **WHEN** una persona intenta registrarse con un email que ya tiene cuenta
- **THEN** ve bajo el campo de email "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Contraseña corta

- **WHEN** una persona escribe una contraseña de menos de 8 caracteres (repetida igual) y pulsa "Crear cuenta"
- **THEN** en lugar de la pista ve bajo la contraseña un mensaje que indica que debe tener al menos 8 caracteres

### Requirement: Errores de conexión y del servidor en los formularios

La aplicación web SHALL mostrar un aviso general comprensible cuando el formulario no puede completarse por un fallo que no es de validación.

#### Scenario: Backend inaccesible

- **WHEN** una persona envía el formulario de inicio de sesión o de registro y el servidor no responde
- **THEN** ve el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y el botón vuelve a estar disponible

#### Scenario: Error inesperado del servidor

- **WHEN** el servidor responde con un error que no es de validación, de credenciales ni de autenticación
- **THEN** la persona ve el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Protección de las pantallas privadas

La aplicación web SHALL permitir ver el perfil solo con una sesión válida, y SHALL mandar a quien ya tiene sesión fuera de las pantallas de inicio de sesión y registro.

#### Scenario: Perfil sin sesión

- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es redirigida a `/login`

#### Scenario: Login con sesión

- **WHEN** una persona con sesión abre `/login` o `/register`
- **THEN** es redirigida a `/profile`

#### Scenario: Dirección desconocida

- **WHEN** alguien abre `/` o cualquier dirección que no sea `/login`, `/register` ni `/profile`
- **THEN** es redirigido a `/profile`, y de ahí a `/login` si no tiene sesión

### Requirement: La sesión sobrevive a recargar la página

La aplicación web SHALL recordar la sesión en el navegador tras iniciar sesión o registrarse y, al cargar la página, SHALL comprobar con el servidor que sigue siendo válida antes de dar acceso, mostrando un indicador de carga a pantalla completa mientras lo comprueba.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión iniciada recarga la página del perfil
- **THEN** ve un indicador de carga y después su perfil, sin tener que volver a iniciar sesión

#### Scenario: Sesión que el servidor ya no reconoce

- **WHEN** una persona carga la aplicación con una sesión recordada que el servidor rechaza
- **THEN** llega a la pantalla de inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión." y la sesión recordada se olvida

#### Scenario: Servidor caído al recargar

- **WHEN** una persona carga la aplicación con una sesión recordada y el servidor no responde
- **THEN** llega a la pantalla de inicio de sesión con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.", y la sesión recordada se conserva, de modo que al recargar con el servidor ya disponible vuelve a entrar sin escribir credenciales

#### Scenario: El aviso de sesión perdida cede ante el del intento actual

- **WHEN** la pantalla de inicio de sesión muestra un aviso de sesión perdida y la persona intenta entrar con credenciales incorrectas
- **THEN** el aviso pasa a ser "El email o la contraseña no son correctos."

### Requirement: Pantalla de perfil

La aplicación web SHALL mostrar en `/profile` un círculo con las iniciales de la persona, su nombre (o "Sin nombre" si no tiene), su email, la fecha de alta como "Miembro desde" en formato largo en castellano, y un botón "Cerrar sesión".

#### Scenario: Perfil con nombre

- **WHEN** entra una persona llamada "Ada Lovelace" que se registró el 30 de septiembre de 2026
- **THEN** ve "AL" en el círculo, "Ada Lovelace", su email y "Miembro desde 30 de septiembre de 2026"

#### Scenario: Perfil sin nombre

- **WHEN** entra una persona registrada sin nombre
- **THEN** ve "Sin nombre" en lugar del nombre y, en el círculo, las iniciales derivadas de su email

### Requirement: Cierre de sesión desde la pantalla

La aplicación web SHALL cerrar la sesión en el navegador al pulsar "Cerrar sesión", llevar a la persona a `/login` y pedir al servidor que invalide la sesión; si el servidor falla, la sesión queda cerrada igualmente en el navegador.

#### Scenario: Cerrar sesión

- **WHEN** una persona pulsa "Cerrar sesión" en su perfil
- **THEN** llega a la pantalla de inicio de sesión sin ningún aviso, y al recargar sigue sin sesión

#### Scenario: Cerrar sesión con el servidor caído

- **WHEN** una persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** llega igualmente a la pantalla de inicio de sesión y no ve ningún error

# Parte B
## Cuántos requisitos escribió el agente, y cuántos comprobaste tú abriendo el código
En el tiempo que hay no me da tiempo a comprobar todos los validadores, pero por las pruebas que he hecho, todas las funcionalidades están cubiera

## Las incoherencias que aparecieron al escribirla
* `#### Scenario: Registro sin la clave del nombre` me parece un enunciado confuso. Yo diría sin campo `fullName`
* un mismo email no puede tener más de una cuenta, pero permite distintas capitalizaciones

## Lo que no supiste decidir si era un bug o el contrato
* Se permite un registro con un campo `fullName` vacío o nulo, pero se requiere el campo.

