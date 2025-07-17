# Sistema de Items para Mascotas

## Descripción General

El sistema de items permite equipar a las mascotas con accesorios que mejoran sus estadísticas y les otorgan habilidades especiales. Cada mascota puede tener un item por tipo de equipamiento.

## Tipos de Items

### Categorías de Equipamiento
- **cabeza**: Sombreros, coronas, cascos
- **ojos**: Gafas de sol, gafas especiales
- **cuello**: Collares básicos y mágicos
- **espalda**: Capas, alas

### Tipos de Items
- **Gratuitos (free)**: Items básicos disponibles para todos
- **Premium**: Items especiales con efectos más potentes

## Catálogo de Items

### Items Gratuitos
1. **Sombrero básico** (cabeza)
   - Efecto: +5 felicidad
   - Descripción: Un sombrero simple que hace feliz a tu mascota

2. **Gafas de sol** (ojos)
   - Efecto: +3 felicidad, +2 energía
   - Descripción: Gafas que protegen del sol y dan energía

3. **Collar básico** (cuello)
   - Efecto: +5 salud
   - Descripción: Un collar que mejora la salud

4. **Capa de superhéroe** (espalda)
   - Efecto: +8 felicidad, +5 salud
   - Descripción: Una capa que hace sentir especial a tu mascota

### Items Premium
5. **Corona dorada** (cabeza)
   - Efecto: +15 felicidad, +10 salud, +10 energía
   - Descripción: Una corona real que mejora todas las estadísticas

6. **Alas de ángel** (espalda)
   - Efecto: +20 energía, +10 felicidad
   - Descripción: Alas mágicas que dan mucha energía

7. **Collar de protección** (cuello)
   - Efecto: +15 salud, inmunidad a resfriados
   - Descripción: Un collar mágico que protege de enfermedades

8. **Gafas de visión nocturna** (ojos)
   - Efecto: +10 energía, +5 felicidad, visión nocturna
   - Descripción: Gafas especiales para ver en la oscuridad

9. **Casco de batalla** (cabeza)
   - Efecto: +20 salud, protección
   - Descripción: Un casco que protege de daños

10. **Collar de telepatía** (cuello)
    - Efecto: +12 felicidad, telepatía
    - Descripción: Un collar que permite comunicación telepática

## Endpoints de la API

### 1. Listar Items Disponibles
```
GET /api/mascotas/items
```

**Parámetros de consulta:**
- `tipo=free` - Solo items gratuitos
- `tipo=premium` - Solo items premium
- `tipo=cabeza` - Solo items de cabeza
- `tipo=ojos` - Solo items de ojos
- `tipo=cuello` - Solo items de cuello
- `tipo=espalda` - Solo items de espalda

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Sombrero básico",
    "tipo": "cabeza",
    "esPremium": false,
    "descripcion": "Un sombrero simple que hace feliz a tu mascota",
    "efecto": {
      "felicidad": 5
    }
  }
]
```

### 2. Equipar Item a una Mascota
```
POST /api/mascotas/:id/items
```

**Body:**
```json
{
  "itemId": 1
}
```

**Ejemplo de respuesta:**
```json
{
  "mensaje": "Item añadido a Ace con éxito",
  "mascota": {
    "id": 2,
    "nombre": "Ace",
    "items": [
      {
        "id": 1,
        "nombre": "Sombrero básico",
        "tipo": "cabeza",
        "esPremium": false,
        "descripcion": "Un sombrero simple que hace feliz a tu mascota"
      }
    ],
    "felicidad": 105
  },
  "mensajeAdicional": "¡Sombrero básico ha sido equipado! Efectos aplicados: {\"felicidad\":5}"
}
```

### 3. Quitar Item de una Mascota
```
DELETE /api/mascotas/:id/items/:itemId
```

**Ejemplo de respuesta:**
```json
{
  "mensaje": "Item eliminado de Ace con éxito",
  "mascota": {
    "id": 2,
    "nombre": "Ace",
    "items": [],
    "felicidad": 100
  },
  "mensajeAdicional": "¡Sombrero básico ha sido removido! Efectos revertidos."
}
```

## Reglas del Sistema

### 1. Limitación por Tipo
- Una mascota solo puede tener **un item por tipo** de equipamiento
- Si intentas equipar un item del mismo tipo, recibirás un error

### 2. Aplicación de Efectos
- Los efectos se aplican **automáticamente** al equipar el item
- Los efectos se **revierte** al quitar el item
- Las estadísticas no pueden superar 100 ni bajar de 0

### 3. Inmunidades
- Algunos items otorgan **inmunidad temporal** a enfermedades
- Las inmunidades duran **24 horas** desde que se equipa el item
- Se revierten automáticamente al quitar el item

### 4. Efectos Especiales
- **Protección**: Reduce el daño recibido
- **Visión nocturna**: Permite ver en la oscuridad
- **Telepatía**: Permite comunicación telepática

## Ejemplos de Uso

### Equipar un Sombrero a Ace
```bash
curl -X POST http://localhost:3000/api/mascotas/2/items \
  -H "Content-Type: application/json" \
  -d '{"itemId": 1}'
```

### Ver Items Disponibles (Solo Gratuitos)
```bash
curl "http://localhost:3000/api/mascotas/items?tipo=free"
```

### Quitar un Item
```bash
curl -X DELETE http://localhost:3000/api/mascotas/2/items/1
```

### Ver Estado de una Mascota con Items
```bash
curl http://localhost:3000/api/mascotas/2/estado
```

## Consejos de Uso

1. **Combina Items**: Usa diferentes tipos de items para maximizar los beneficios
2. **Considera la Personalidad**: Algunos items pueden afectar la personalidad de la mascota
3. **Mantén Equilibrio**: No sobrecargues una estadística, distribuye los beneficios
4. **Usa Inmunidades**: Los items con inmunidad son útiles para prevenir enfermedades
5. **Experimenta**: Prueba diferentes combinaciones de items para encontrar la mejor

## Errores Comunes

- **Item no encontrado**: Verifica que el `itemId` existe en el catálogo
- **Tipo duplicado**: No puedes equipar dos items del mismo tipo
- **Mascota no encontrada**: Verifica que el ID de la mascota sea correcto
- **Item no equipado**: No puedes quitar un item que no está equipado 