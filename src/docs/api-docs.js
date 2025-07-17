/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         Para usar la autenticación:
 *         1. Haz clic en el botón "Authorize" (🔒) en la parte superior
 *         2. En el campo "Value", ingresa SOLO el token JWT (sin "Bearer")
 *         3. Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         4. Haz clic en "Authorize"
 *         5. Cierra el modal
 *         
 *         Para obtener un token:
 *         1. Usa el endpoint POST /api/usuarios/login
 *         2. Copia el token del campo "token" en la respuesta
 *         3. No incluyas "Bearer" al pegar el token en Swagger UI
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar el estado de salud de la API
 *     description: Endpoint para verificar que la API esté funcionando correctamente
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API de Superhéroes funcionando correctamente"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *                 example: "spiderman"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "peter@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "Peter Parker"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Usuario ya existe
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autenticar usuario y obtener token JWT
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usernameOrEmail
 *               - password
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *                 example: "spiderman"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtener perfil del usuario
 *     description: Obtiene la información del perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/usuarios/ranking:
 *   get:
 *     summary: Obtener ranking de usuarios
 *     description: Lista de usuarios ordenados por puntos o actividad
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de usuarios a retornar
 *     responses:
 *       200:
 *         description: Ranking obtenido exitosamente
 */

/**
 * @swagger
 * /api/mascotas:
 *   get:
 *     summary: Obtener todas las mascotas
 *     description: Lista todas las mascotas del usuario autenticado (requiere autenticación)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/mascotas:
 *   post:
 *     summary: Crear una nueva mascota
 *     description: Crea una nueva mascota en el sistema (requiere autenticación)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipo
 *               - poder
 *               - edad
 *               - descripcion
 *               - idLugar
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Luna"
 *                 description: "Nombre de la mascota"
 *               tipo:
 *                 type: string
 *                 example: "Perro"
 *                 description: "Tipo de mascota"
 *               poder:
 *                 type: string
 *                 example: "Volar"
 *                 description: "Poder especial de la mascota"
 *               edad:
 *                 type: number
 *                 example: 3
 *                 description: "Edad de la mascota en años"
 *               descripcion:
 *                 type: string
 *                 example: "Una mascota muy amigable y juguetona"
 *                 description: "Descripción de la mascota"
 *               idLugar:
 *                 type: number
 *                 example: 1
 *                 description: "ID del lugar donde vive la mascota"
 *               personalidad:
 *                 type: string
 *                 enum: ["amigable", "tímido", "agresivo", "juguetón"]
 *                 example: "amigable"
 *                 description: "Personalidad de la mascota (opcional)"
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/mascotas/disponibles:
 *   get:
 *     summary: Obtener mascotas disponibles para adopción
 *     description: Lista mascotas que no han sido adoptadas
 *     tags: [Mascotas]
 *     responses:
 *       200:
 *         description: Mascotas disponibles obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 */

/**
 * @swagger
 * /api/mascotas/{id}:
 *   get:
 *     summary: Obtener mascota por ID
 *     description: Obtiene los detalles de una mascota específica (requiere autenticación y ser propietario)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para ver esta mascota
 *       404:
 *         description: Mascota no encontrada
 */

/**
 * @swagger
 * /api/mascotas/{id}/adoptar:
 *   post:
 *     summary: Adoptar una mascota
 *     description: Asigna una mascota a un superhéroe (requiere autenticación y ser propietario de la mascota)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idHeroe
 *             properties:
 *               idHeroe:
 *                 type: number
 *                 example: 1
 *                 description: "ID numérico del héroe que adoptará la mascota"
 *     responses:
 *       200:
 *         description: Mascota adoptada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para adoptar esta mascota
 *       404:
 *         description: Mascota o héroe no encontrado
 */

/**
 * @swagger
 * /api/mascotas/{id}/alimentar:
 *   post:
 *     summary: Alimentar una mascota
 *     description: Alimenta una mascota para mejorar su estado (requiere autenticación y ser propietario de la mascota)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoAlimento
 *             properties:
 *               tipoAlimento:
 *                 type: string
 *                 enum: ["normal", "premium", "especial"]
 *                 example: "normal"
 *                 description: "Tipo de alimento (normal, premium, especial)"
 *     responses:
 *       200:
 *         description: Mascota alimentada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para alimentar esta mascota
 */

/**
 * @swagger
 * /api/mascotas/{id}/pasear:
 *   post:
 *     summary: Pasear una mascota
 *     description: Pasea una mascota para mejorar su felicidad (requiere autenticación y ser propietario de la mascota)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duracion
 *             properties:
 *               duracion:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 120
 *                 example: 30
 *                 description: "Duración del paseo en minutos (1-120)"
 *     responses:
 *       200:
 *         description: Mascota paseada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para pasear esta mascota
 */

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     summary: Obtener todos los superhéroes
 *     description: Lista todos los superhéroes disponibles
 *     tags: [Superhéroes]
 *     responses:
 *       200:
 *         description: Lista de superhéroes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 */

/**
 * @swagger
 * /api/heroes:
 *   post:
 *     summary: Crear un nuevo superhéroe
 *     description: Crea un nuevo superhéroe en el sistema (requiere autenticación)
 *     tags: [Superhéroes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - alias
 *               - poder
 *               - edad
 *               - ciudad
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Spider-Man"
 *                 description: "Nombre del superhéroe"
 *               alias:
 *                 type: string
 *                 example: "Peter Parker"
 *                 description: "Alias o identidad secreta"
 *               poder:
 *                 type: string
 *                 example: "Sentido arácnido"
 *                 description: "Poder principal del superhéroe"
 *               edad:
 *                 type: number
 *                 example: 25
 *                 description: "Edad del superhéroe"
 *               ciudad:
 *                 type: string
 *                 example: "Nueva York"
 *                 description: "Ciudad donde opera el superhéroe"
 *     responses:
 *       201:
 *         description: Superhéroe creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/heroes/{id}:
 *   get:
 *     summary: Obtener superhéroe por ID
 *     description: Obtiene los detalles de un superhéroe específico (requiere autenticación)
 *     tags: [Superhéroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Superhéroe encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Superhéroe no encontrado
 */

/**
 * @swagger
 * /api/heroes/{id}:
 *   put:
 *     summary: Actualizar superhéroe
 *     description: Actualiza los datos de un superhéroe (requiere autenticación)
 *     tags: [Superhéroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Spider-Man"
 *                 description: "Nombre del superhéroe"
 *               alias:
 *                 type: string
 *                 example: "Peter Parker"
 *                 description: "Alias o identidad secreta"
 *               poder:
 *                 type: string
 *                 example: "Sentido arácnido"
 *                 description: "Poder principal del superhéroe"
 *               edad:
 *                 type: number
 *                 example: 25
 *                 description: "Edad del superhéroe"
 *               ciudad:
 *                 type: string
 *                 example: "Nueva York"
 *                 description: "Ciudad donde opera el superhéroe"
 *     responses:
 *       200:
 *         description: Superhéroe actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Superhéroe no encontrado
 */

/**
 * @swagger
 * /api/heroes/{id}:
 *   delete:
 *     summary: Eliminar superhéroe
 *     description: Elimina un superhéroe del sistema (requiere autenticación)
 *     tags: [Superhéroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Superhéroe eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Superhéroe no encontrado
 */

/**
 * @swagger
 * /api/heroes/ciudad/{ciudad}:
 *   get:
 *     summary: Buscar superhéroes por ciudad
 *     description: Lista superhéroes que operan en una ciudad específica
 *     tags: [Superhéroes]
 *     parameters:
 *       - in: path
 *         name: ciudad
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad
 *     responses:
 *       200:
 *         description: Superhéroes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 */

/**
 * @swagger
 * /api/heroes/{id}/enfrentar:
 *   post:
 *     summary: Enfrentar villano
 *     description: Un superhéroe enfrenta a un villano (requiere autenticación)
 *     tags: [Superhéroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - villano
 *             properties:
 *               villano:
 *                 type: string
 *                 example: "Duende Verde"
 *                 description: Nombre del villano a enfrentar
 *     responses:
 *       200:
 *         description: Enfrentamiento completado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Superhéroe no encontrado
 */

/**
 * @swagger
 * /api/heroes/{id}/asignar-mascota:
 *   post:
 *     summary: Asignar mascota a héroe
 *     description: Asigna automáticamente una mascota disponible a un superhéroe (requiere autenticación)
 *     tags: [Superhéroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Mascota asignada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Superhéroe no encontrado
 *       400:
 *         description: No hay mascotas disponibles
 */

/**
 * @swagger
 * /api/mascotas/{id}/estado:
 *   get:
 *     summary: Verificar estado de salud de mascota
 *     description: Obtiene el estado actual de salud, energía y felicidad de una mascota (requiere autenticación y ser propietario)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Estado de la mascota obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para ver el estado de esta mascota
 *       404:
 *         description: Mascota no encontrada
 */ 