# Proyecto n1 - Clientes WEB
## 1. Descripción General
El objetivo de este proyecto es desarrollar una aplicación web de página única (SPA) que permita a un estudiante **armar su horario académico** a partir de un catálogo de materias y secciones provisto por el profesor. La aplicación se ejecuta íntegramente en el navegador (Client-Side), sin servidor y sin persistencia de datos.
El usuario selecciona las materias que desea cursar y la aplicación **detecta los choques de horario**, **genera todas las combinaciones válidas de secciones** y las presenta en una **rejilla semanal**. Las combinaciones pueden filtrarse según preferencias y ordenarse por criterios de conveniencia. El flujo termina con la elección de un horario definitivo y una vista de resumen imprimible.
Además del catálogo provisto, la aplicación permite **registrar materias manuales** durante la sesión mediante un formulario validado.

## Características Principales

**Catálogo de Materias:**
  * Búsqueda en tiempo real por nombre o código de asignatura.
  * Filtrado dinámico por trimestre (1 al 5).
  * Contador interactivo de Unidades de Crédito (UC seleccionadas / límite de 28).

**Selección e Incripción Provisoria:**
  * Vista en cuadrícula (*grid*) adaptable con información detallada de cada materia.
  * Opción para retirar materias y ajustar la selección en tiempo real.

**Registro Manual de Secciones:**
  * Formulario validado para agregar asignaturas y secciones personalizadas durante la sesión.

**Generador y Detección de Choques:**
  * Detección automática de solapamientos e incompatibilidades de horario.
  * Algoritmo de combinación de secciones sin solapamiento.
  * Filtros por preferencias del estudiante (priorizar clases en la mañana, en la tarde o tolerancia a huecos/ventanas).

**Resumen y Horario Definitivo:**
  * Matriz visual en rejilla semanal del horario seleccionado.
  * Función de impresión limpia y adaptable para el comprobante definitivo.

## Estructura del Proyecto

```text
/
├── css/
│   └── styles.css       # Estilos globales, variables CSS (:root) y layouts
│   ├── print.js          # Estilo general de las bases de la pagina
├── data/
│   ├── bloques.js          # Definición de estructuras de bloques y días
│   └── materias.js         # Catálogo base de asignaturas, UC y secciones
├── js/
│   ├── main.js             # Controlador de vistas y eventos globales
│   ├── catalogo.js         # Renderizado y filtros del catálogo
│   ├── seleccion.js        # Manejo de materias seleccionadas y contador de UC
│   ├── manual.js           # Validación y registro de secciones manuales
│   ├── generador.js        # Detección de choques y combinaciones automáticas
│   ├── horario.js          # Renderizado de la rejilla semanal
│   └── tiempo.js           # Utilidades para el manejo de bloques horarios
├── index.html              # Estructura principal SPA (Single Page Application)
└── README.md
