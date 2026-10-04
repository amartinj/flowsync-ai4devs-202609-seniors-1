# Matriz de trazabilidad: «Lo que cada tarea muestra de su responsable»

Spec: `openspec/specs/tasks/spec.md`

- Scenarios del requisito: **3**
- Scenarios cubiertos: **0**

| Scenario | Test que lo cubre | Estado | Qué faltó para decidirlo |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es "Ada Lovelace", su `assignee` trae el nombre y las iniciales | — | No cubierto | |
| Al obtener cualquier tarea, suelta o en la lista, su `assignee` no incluye el email ni otro dato de acceso | — | No cubierto | |
| Si el responsable se registró sin nombre, su nombre llega nulo y sus iniciales siguen llegando | `un nombre de dos palabras da la inicial de cada una`, `sin nombre, las iniciales salen del email` (`auth/initials.spec.ts`) | No lo sé | Comprueban las iniciales en la respuesta del login, no el `assignee` de una tarea, ni que el nombre llegue nulo |
