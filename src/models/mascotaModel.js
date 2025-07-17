class Mascota {
    constructor(
        id, 
        nombre, 
        tipo, 
        poder, 
        edad, 
        energia, 
        descripcion, 
        idLugar, 
        adoptadoPor = null,
        // Nuevos atributos
        salud = 100,
        felicidad = 100,
        personalidad = "amigable", // amigable, tímido, agresivo, juguetón
        ultimaAlimentacion = new Date().toISOString(),
        ultimoPaseo = new Date().toISOString(),
        enfermedad = null,
        items = [] // Array de objetos con {id, nombre, tipo, efecto, esPremium}
    ) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.poder = poder;
        this.edad = edad;
        this.energia = energia;
        this.descripcion = descripcion;
        this.idLugar = idLugar;
        this.adoptadoPor = adoptadoPor; // id del héroe o null
        
        // Nuevos atributos
        this.salud = salud;
        this.felicidad = felicidad;
        this.personalidad = personalidad;
        this.ultimaAlimentacion = ultimaAlimentacion;
        this.ultimoPaseo = ultimoPaseo;
        this.enfermedad = enfermedad;
        this.items = items;
    }
}

export default Mascota; 