# API Superhéroes - Endpoints para Postman

**URL Base:** `http://localhost:3000`

## 🦸‍♂️ ENDPOINTS DE HÉROES

### 1. Obtener todos los héroes
```
GET /api/heroes
```

### 2. Obtener héroe por ID
```
GET /api/heroes/:id
```

### 3. Crear nuevo héroe
```
POST /api/heroes
Content-Type: application/json

{
  "name": "Peter Parker",
  "alias": "Spider-Man",
  "powers": ["trepar paredes", "sentido arácnido"],
  "team": "Avengers"
}
```

### 4. Actualizar héroe
```
PUT /api/heroes/:id
Content-Type: application/json

{
  "name": "Peter Parker",
  "alias": "Spider-Man",
  "powers": ["trepar paredes", "sentido arácnido", "telarañas"],
  "team": "Avengers"
}
```

### 5. Eliminar héroe
```
DELETE /api/heroes/:id
```

## 🐾 ENDPOINTS DE MASCOTAS

### 1. Obtener todas las mascotas
```
GET /api/mascotas
```

### 2. Obtener mascotas disponibles (no adoptadas)
```
GET /api/mascotas/disponibles
```

### 3. Obtener mascota por ID
```
GET /api/mascotas/:id
```

### 4. Crear nueva mascota
```
POST /api/mascotas
Content-Type: application/json

{
  "nombre": "Luna",
  "tipo": "gato",
  "edad": 2,
  "personalidad": "amigable"
}
```

### 5. Actualizar mascota
```
PUT /api/mascotas/:id
Content-Type: application/json

{
  "nombre": "Luna",
  "tipo": "gato",
  "edad": 3,
  "personalidad": "juguetón"
}
```

### 6. Eliminar mascota
```
DELETE /api/mascotas/:id
```

### 7. Obtener mascotas de un héroe
```
GET /api/mascotas/heroe/:idHeroe
```

### 8. Adoptar mascota específica
```
POST /api/mascotas/:id/adoptar
Content-Type: application/json

{
  "idHeroe": 1
}
```

### 9. Adoptar mascota aleatoria
```
POST /api/mascotas/adoptar/aleatorio
Content-Type: application/json

{
  "idHeroe": 1
}
```

## 🍽️ ENDPOINTS DE CUIDADO DE MASCOTAS

### 10. Alimentar mascota
```
POST /api/mascotas/:id/alimentar
Content-Type: application/json

{
  "tipoAlimento": "normal"
}
```
**Tipos de alimento disponibles:** `normal`, `premium`, `especial`

### 11. Pasear mascota
```
POST /api/mascotas/:id/pasear
Content-Type: application/json

{
  "duracion": 30
}
```
**duración en minutos**

### 12. Verificar estado de mascota
```
GET /api/mascotas/:id/estado
```

### 13. Curar enfermedad
```
POST /api/mascotas/:id/curar
Content-Type: application/json

{
  "medicamento": "vitaminaC"
}
```
**Medicamentos disponibles:** `vitaminaC`, `antibiotico`, `antidepresivo`, `medicamentoGeneral`

### 14. Simular enfermedad (para pruebas)
```
POST /api/mascotas/:id/enfermar
Content-Type: application/json

{
  "enfermedad": "resfriado"
}
```
**Enfermedades disponibles:** `resfriado`, `estomacal`, `tristeza`

## 🎁 ENDPOINTS DE ITEMS

### 15. Obtener items disponibles
```
GET /api/mascotas/items
```

### 16. Obtener items por tipo
```
GET /api/mascotas/items?tipo=premium
```

### 17. Añadir item a mascota
```
POST /api/mascotas/:id/items
Content-Type: application/json

{
  "itemId": 1
}
```

### 18. Quitar item de mascota
```
DELETE /api/mascotas/:id/items/:itemId
```

## 🎭 ENDPOINTS DE PERSONALIDAD

### 19. Cambiar personalidad
```
PUT /api/mascotas/:id/personalidad
Content-Type: application/json

{
  "personalidad": "juguetón"
}
```
**Personalidades válidas:** `amigable`, `tímido`, `agresivo`, `juguetón`

## 🔧 ENDPOINTS DE DEBUGGING

### 20. Forzar actualización de estado
```
POST /api/mascotas/:id/actualizar-estado
```

### 21. Debug mascotas disponibles
```
GET /api/debug/disponibles
```

## 📋 EJEMPLOS DE PRUEBAS EN POSTMAN

### Flujo básico de adopción:
1. `GET /api/heroes` - Ver héroes disponibles
2. `GET /api/mascotas/disponibles` - Ver mascotas disponibles
3. `POST /api/mascotas/adoptar/aleatorio` - Adoptar mascota aleatoria
4. `GET /api/mascotas/:id/estado` - Verificar estado inicial
5. `POST /api/mascotas/:id/alimentar` - Alimentar mascota
6. `POST /api/mascotas/:id/pasear` - Pasear mascota
7. `GET /api/mascotas/:id/estado` - Verificar estado final

### Flujo de enfermedad y curación:
1. `POST /api/mascotas/:id/enfermar` - Enfermar mascota
2. `GET /api/mascotas/:id/estado` - Verificar enfermedad
3. `POST /api/mascotas/:id/curar` - Curar mascota
4. `GET /api/mascotas/:id/estado` - Verificar curación

## ⚠️ NOTAS IMPORTANTES

- **Puerto:** La API corre en el puerto 3000
- **CORS:** Habilitado para todas las origenes
- **Logging:** Todos los requests se loguean en consola
- **Validaciones:** Los endpoints incluyen validaciones completas
- **Errores:** Respuestas de error incluyen sugerencias útiles

## 🎯 ENDPOINTS MÁS ÚTILES PARA PRUEBAS

1. **`GET /api/mascotas/disponibles`** - Ver mascotas para adoptar
2. **`POST /api/mascotas/adoptar/aleatorio`** - Adopción rápida
3. **`GET /api/mascotas/:id/estado`** - Estado completo de mascota
4. **`POST /api/mascotas/:id/alimentar`** - Alimentar mascota
5. **`POST /api/mascotas/:id/pasear`** - Pasear mascota
6. **`POST /api/mascotas/:id/enfermar`** - Simular enfermedad
7. **`POST /api/mascotas/:id/curar`** - Curar enfermedad 