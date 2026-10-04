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

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
En esta sesión necesito que guardes todos lo prompts que te escriba, incluyendo este, en el archivo `prompts.md`. También tienes que incluir el resultado de cada prompt en la sección `Qué salió` dentro de cada prompt. Fíjate en el archivo, que tiene una cabecera en la que se epxlica cómo rellenarlo.
```

**Qué salió:** funcionó a la primera: borró el ejemplo de la plantilla y registró este prompt como el primero.

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
genera en `docs/verificacion/amj.md` una matriz de trazabilidad de requisitos y tests.

La matriz mapea, scenario a scenario, si el requisito está cubierto por los tests. El formato lo fija esta lección y no es negociable: una fila por scenario y cuatro columnas. Encima, dos números: cuántos scenarios tiene el requisito y cuántos resultaron cubiertos — el primero se anota al empezar, el segundo al terminar.

El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.

Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.

Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.

Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.

Así queda la tabla. Los dos números van encima — el primero antes de empezar, el segundo al terminar
```

**Qué salió:** funcionó a la primera: creó `docs/verificacion/amj.md` con 3 scenarios y 0 cubiertos (2 no cubiertos, 1 «no lo sé»). Alcance limitado a la matriz; no escribí tests ni las tres líneas de la parte B.

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Por cada fila en No cubierto, escribe el test que falta — uno por scenario — siguiendo el estilo de los que ya existen en el proyecto. Sin tocar nada fuera de la carpeta de tests. Cuando los tengas, ejecútalos.
```

**Qué salió:** escribió `backend/tests/functional/tasks/assignee.spec.ts` con dos tests, uno por fila «No cubierto». Ejecutados: 1 en verde (nombre e iniciales) y 1 en rojo (el `assignee` trae `email`). No toqué el código ni aflojé el test.
