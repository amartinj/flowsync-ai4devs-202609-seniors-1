# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Para toda la conversación, cada prompt que te vaya pidiendo lo escribes en `prompts.md` respetando el formato que ya tiene el archivo. Empieza a incluir desde este mismo. El propio archivo tiene instrucciones y un ejemplo (puedes borrarlo) para que sepas qué formato usar.
```

**Qué salió:** funcionó a la primera; borró el ejemplo y registró este prompt.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Vamos a generar la spec del proyecto, de lo que el proyecto hace a día de hoy, a partir del análisis del código. Esta spec se guardará en `docs/spec-viva/amj.md`.

El formato es el siguiente, y no es negociable:
* Arriba, un ## Purpose de una o dos frases: para qué existe esta capability.
* Debajo, ## Requirements, y colgando de él ### Requirement: en los que el sistema SHALL hacer algo.
* Bajo cada requisito, al menos un #### Scenario: de cuatro almohadillas, con dos viñetas: **WHEN** y **THEN**. No hay casilla para el GIVEN: la precondición se mete dentro del WHEN.
* En castellano, salvo las mayúsculas de la RFC.

Hay tres reglas duras acerca de cómo escribir la documentación:
1. Nada de ADDED, MODIFIED ni REMOVED. Eso es el vocabulario de un delta, y esto no es un delta: es la verdad actual del sistema. Si tu archivo tiene una de esas secciones, has escrito otra cosa.
2. Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
3. No toques el código. Ni siquiera para arreglar lo que encuentres
```

**Qué salió:** escribió la spec, pero además commiteó, hizo push e intentó abrir un PR sin que se lo pidiera (siguiendo las reglas de proceso del CLAUDE.md).

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa las instrsucciones que te di en el prompt anterior. La tarea era sencilla: Escribir el spec de lo que el proyecto hace. No hablé de commits, ni de push, ni PR ni nada. Céntrate en lo que se te ha pedido expresamente y deshaz lo que no se ha pedido.
```
