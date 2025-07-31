// Sistema de Gestión de Mascotas para PetVenture
class PetManager {
    constructor() {
        this.pets = [];
        this.currentPet = null;
        this.updateInterval = null;
        
        ConfigUtils.log('info', 'PetManager inicializado');
    }
    
    // Cargar mascotas del usuario
    async loadPets() {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', 'Cargando mascotas del usuario');
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PETS), {
                headers: authManager.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al cargar mascotas');
            }
            
            this.pets = data;
            
            ConfigUtils.log('info', `Mascotas cargadas: ${this.pets.length}`);
            
            return this.pets;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al cargar mascotas', error);
            throw error;
        }
    }
    
    // Crear nueva mascota
    async createPet(petData) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', 'Creando nueva mascota', petData);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.CREATE_PET), {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify(petData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al crear mascota');
            }
            
            // Agregar la nueva mascota a la lista
            this.pets.push(data);
            
            ConfigUtils.log('info', 'Mascota creada exitosamente', { petId: data.id, name: data.nombre });
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al crear mascota', error);
            throw error;
        }
    }
    
    // Obtener mascota por ID
    async getPetById(petId) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PET_BY_ID(petId)), {
                headers: authManager.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener mascota');
            }
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al obtener mascota', error);
            throw error;
        }
    }
    
    // Alimentar mascota
    async feedPet(petId, foodType = 'normal') {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', `Alimentando mascota ${petId} con ${foodType}`);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.FEED_PET(petId)), {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ tipoAlimento: foodType })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al alimentar mascota');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            ConfigUtils.log('info', 'Mascota alimentada exitosamente', {
                petId,
                foodType,
                newStats: {
                    health: data.mascota.salud,
                    energy: data.mascota.energia,
                    happiness: data.mascota.felicidad
                }
            });
            
            // Debug logs removed for production
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al alimentar mascota', error);
            throw error;
        }
    }
    
    // Pasear mascota
    async walkPet(petId, duration = 30) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', `Paseando mascota ${petId} por ${duration} minutos`);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.WALK_PET(petId)), {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ duracion: duration })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al pasear mascota');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            ConfigUtils.log('info', 'Mascota paseada exitosamente', {
                petId,
                duration,
                newStats: {
                    health: data.mascota.salud,
                    energy: data.mascota.energia,
                    happiness: data.mascota.felicidad
                }
            });
            
            // Debug logs removed for production
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al pasear mascota', error);
            throw error;
        }
    }
    
    // Curar mascota
    async curePet(petId, medicine) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', `Curando mascota ${petId} con ${medicine}`);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.CURE_PET(petId)), {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ medicamento: medicine })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al curar mascota');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            ConfigUtils.log('info', 'Mascota curada exitosamente', {
                petId,
                medicine,
                newStats: {
                    health: data.mascota.salud,
                    energy: data.mascota.energia,
                    happiness: data.mascota.felicidad
                }
            });
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al curar mascota', error);
            throw error;
        }
    }
    
    // Cambiar personalidad de la mascota
    async changePersonality(petId, personality) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', `Cambiando personalidad de mascota ${petId} a ${personality}`);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PET_PERSONALITY(petId)), {
                method: 'PUT',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ personalidad: personality })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al cambiar personalidad');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            ConfigUtils.log('info', 'Personalidad cambiada exitosamente', {
                petId,
                personality,
                newPersonality: data.mascota.personalidad
            });
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al cambiar personalidad', error);
            throw error;
        }
    }
    
    // Agregar item a mascota
    async addItemToPet(petId, item) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', `Agregando item a mascota ${petId}`, item);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PET_ITEMS(petId)), {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ item })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al agregar item');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            ConfigUtils.log('info', 'Item agregado exitosamente', {
                petId,
                item,
                newItems: data.mascota.items.length
            });
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al agregar item', error);
            throw error;
        }
    }
    
    // Quitar item de mascota
    async removeItemFromPet(petId, itemId) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', `Quitando item ${itemId} de mascota ${petId}`);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PET_ITEMS_REMOVE(petId, itemId)), {
                method: 'DELETE',
                headers: authManager.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al quitar item');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            ConfigUtils.log('info', 'Item quitado exitosamente', {
                petId,
                itemId,
                newItems: data.mascota.items.length
            });
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al quitar item', error);
            throw error;
        }
    }
    
    // Verificar estado de la mascota
    async checkPetStatus(petId) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PET_STATUS(petId)), {
                headers: authManager.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al verificar estado');
            }
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al verificar estado', error);
            throw error;
        }
    }
    
    // Actualizar estado de la mascota
    async updatePetStatus(petId) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PET_UPDATE_STATUS(petId)), {
                method: 'POST',
                headers: authManager.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar estado');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al actualizar estado', error);
            throw error;
        }
    }
    
    // Simular enfermedad (para pruebas)
    async makePetSick(petId, illness) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            ConfigUtils.log('info', `Haciendo enfermar mascota ${petId} con ${illness}`);
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PET_SICK(petId)), {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ enfermedad: illness })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al hacer enfermar mascota');
            }
            
            // Actualizar la mascota en la lista local
            this.updatePetInList(data.mascota);
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al hacer enfermar mascota', error);
            throw error;
        }
    }
    
    // Actualizar mascota en la lista local
    updatePetInList(updatedPet) {
        if (!updatedPet || !updatedPet.id) {
            console.warn('updatePetInList: Invalid pet data provided');
            return;
        }
        
        const index = this.pets.findIndex(pet => pet.id === updatedPet.id);
        if (index !== -1) {
            this.pets[index] = updatedPet;
            
            // Si es la mascota actual, actualizarla también
            if (this.currentPet && this.currentPet.id === updatedPet.id) {
                this.currentPet = updatedPet;
                // Debug info removed for production
            }
        } else {
            console.warn('Pet not found in list for update:', updatedPet.id);
        }
    }
    
    // Seleccionar mascota
    selectPet(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) {
            ConfigUtils.log('warn', 'Mascota no encontrada', { petId });
            return;
        }
        
        this.currentPet = pet;
        this.saveCurrentPet();
        
        ConfigUtils.log('info', 'Mascota seleccionada', { pet: pet.nombre });
        
        // Actualizar interfaz
        uiManager.updatePetDisplay(pet);
        uiManager.updatePetStats(pet);
        
        // Inicializar animaciones realistas
        if (typeof petAnimationManager !== 'undefined') {
            petAnimationManager.setPet(pet);
            ConfigUtils.log('info', 'Animaciones realistas activadas para', pet.nombre);
        }
        
        // Mostrar información de controles
        this.showControlsInfo();
        
        return pet;
    }
    
    // Obtener mascota actual
    getCurrentPet() {
        return this.currentPet;
    }
    
    // Obtener todas las mascotas
    getAllPets() {
        return this.pets;
    }
    
    // Obtener mascota por ID de la lista local
    getPetByIdLocal(petId) {
        return this.pets.find(pet => pet.id === petId);
    }
    
    // Iniciar actualización automática
    startAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(async () => {
            if (this.currentPet) {
                try {
                    await this.updatePetStatus(this.currentPet.id);
                    ConfigUtils.log('debug', 'Estado de mascota actualizado automáticamente');
                } catch (error) {
                    ConfigUtils.log('error', 'Error en actualización automática', error);
                }
            }
        }, CONFIG.GAME.UPDATE_INTERVAL);
        
        ConfigUtils.log('info', 'Actualización automática iniciada');
    }
    
    // Detener actualización automática
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            ConfigUtils.log('info', 'Actualización automática detenida');
        }
    }
    
    // Calcular estado general de la mascota
    calculatePetStatus(pet) {
        const health = pet.salud || 0;
        const energy = pet.energia || 0;
        const happiness = pet.felicidad || 0;
        
        const average = (health + energy + happiness) / 3;
        
        if (average >= 80) return 'excellent';
        if (average >= 60) return 'good';
        if (average >= 40) return 'fair';
        if (average >= 20) return 'poor';
        return 'critical';
    }
    
    // Obtener emoji de la mascota según su tipo
    getPetEmoji(pet) {
        const petType = pet.tipo?.toLowerCase();
        return CONFIG.GAME.PET_TYPES[petType]?.emoji || '🐾';
    }
    
    // Obtener información del tipo de mascota
    getPetTypeInfo(pet) {
        const petType = pet.tipo?.toLowerCase();
        return CONFIG.GAME.PET_TYPES[petType] || null;
    }
    
    // Obtener información del poder de la mascota
    getPetPowerInfo(pet) {
        const power = pet.poder?.toLowerCase();
        return CONFIG.GAME.POWERS[power] || null;
    }
    
    // Obtener información de la personalidad
    getPersonalityInfo(personality) {
        return CONFIG.GAME.PERSONALITIES[personality] || null;
    }
    
    // Verificar si la mascota está enferma
    isPetSick(pet) {
        return pet.enfermedad !== null && pet.enfermedad !== undefined;
    }
    
    // Verificar si la mascota necesita atención (más tolerante como Pou)
    needsAttention(pet) {
        const health = pet.salud || 0;
        const energy = pet.energia || 0;
        const happiness = pet.felicidad || 0;
        
        // Niveles más bajos para considerar que necesita atención - como Pou
        return health < 10 || energy < 10 || happiness < 10 || this.isPetSick(pet);
    }
    
    // Obtener recomendaciones para la mascota
    getPetRecommendations(pet) {
        const recommendations = [];
        
        if (pet.salud < 30) {
            recommendations.push('Tu mascota necesita atención médica urgente');
        } else if (pet.salud < 50) {
            recommendations.push('Considera darle medicamentos para mejorar su salud');
        }
        
        if (pet.energia < 20) {
            recommendations.push('Tu mascota está muy cansada, déjala descansar');
        } else if (pet.energia < 50) {
            recommendations.push('Alimenta a tu mascota para recuperar energía');
        }
        
        if (pet.felicidad < 25) {
            recommendations.push('Tu mascota está muy triste, llévala de paseo');
        } else if (pet.felicidad < 50) {
            recommendations.push('Juega con tu mascota para aumentar su felicidad');
        }
        
        if (this.isPetSick(pet)) {
            const enfermedadNombre = pet.enfermedad?.nombre || 'una enfermedad';
            recommendations.push(`Tu mascota está enferma de ${enfermedadNombre}, cúrala pronto`);
        }
        
        return recommendations;
    }

    // Mostrar información de controles
    showControlsInfo() {
        if (typeof uiManager !== 'undefined') {
            uiManager.showInfo(`
                🎮 Controles de ${this.currentPet.nombre}:<br>
                <strong>Teclado:</strong><br>
                • F - Alimentar 🍎<br>
                • P - Jugar ⚽<br>
                • W - Pasear 🚶<br>
                • H - Hacer feliz ❤️<br>
                • S - Dormir 💤<br>
                • Espacio - Interacción aleatoria ✨<br><br>
                <strong>Mouse:</strong><br>
                • Click en mascota - Interacción ❤️<br>
                • Hover - Efecto de proximidad ✨
            `, 8000);
        }
    }

    // Alimentar mascota
    async feedPet() {
        if (!this.currentPet) {
            throw new Error('No hay mascota seleccionada');
        }
        
        try {
            const response = await fetch(ConfigUtils.getApiUrl(`/api/mascotas/${this.currentPet.id}/alimentar`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authManager.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al alimentar la mascota');
            }
            
            // Actualizar mascota
            this.currentPet = { ...this.currentPet, ...data.mascota };
            this.saveCurrentPet();
            
            // Activar animación de comer
            if (typeof petAnimationManager !== 'undefined') {
                petAnimationManager.triggerAnimation('eating');
            }
            
            ConfigUtils.log('info', 'Mascota alimentada', { pet: this.currentPet.nombre });
            
            return {
                success: true,
                pet: this.currentPet,
                message: data.message
            };
            
        } catch (error) {
            ConfigUtils.log('error', 'Error alimentando mascota', error);
            throw error;
        }
    }
    
    // Pasear mascota
    async walkPet() {
        if (!this.currentPet) {
            throw new Error('No hay mascota seleccionada');
        }
        
        try {
            const response = await fetch(ConfigUtils.getApiUrl(`/api/mascotas/${this.currentPet.id}/pasear`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authManager.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al pasear la mascota');
            }
            
            // Actualizar mascota
            this.currentPet = { ...this.currentPet, ...data.mascota };
            this.saveCurrentPet();
            
            // Activar animación de caminar
            if (typeof petAnimationManager !== 'undefined') {
                petAnimationManager.triggerAnimation('walking');
            }
            
            ConfigUtils.log('info', 'Mascota paseada', { pet: this.currentPet.nombre });
            
            return {
                success: true,
                pet: this.currentPet,
                message: data.message
            };
            
        } catch (error) {
            ConfigUtils.log('error', 'Error paseando mascota', error);
            throw error;
        }
    }
    
    // Curar mascota
    async healPet() {
        if (!this.currentPet) {
            throw new Error('No hay mascota seleccionada');
        }
        
        try {
            const response = await fetch(ConfigUtils.getApiUrl(`/api/mascotas/${this.currentPet.id}/curar`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authManager.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al curar la mascota');
            }
            
            // Actualizar mascota
            this.currentPet = { ...this.currentPet, ...data.mascota };
            this.saveCurrentPet();
            
            // Activar animación de curación (happy)
            if (typeof petAnimationManager !== 'undefined') {
                petAnimationManager.triggerAnimation('happy');
            }
            
            ConfigUtils.log('info', 'Mascota curada', { pet: this.currentPet.nombre });
            
            return {
                success: true,
                pet: this.currentPet,
                message: data.message
            };
            
        } catch (error) {
            ConfigUtils.log('error', 'Error curando mascota', error);
            throw error;
        }
    }

    // Usar item en mascota
    async useItem(petId, itemId) {
        try {
            if (!authManager.isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(`/api/mascotas/${petId}/items/${itemId}`), {
                method: 'DELETE',
                headers: authManager.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al usar item');
            }
            
            // Recargar datos de la mascota
            await this.loadPets();
            
            ConfigUtils.log('info', 'Item usado exitosamente', { petId, itemId, effect: data.effect });
            
            return data;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al usar item', error);
            throw error;
        }
    }
    
    // Guardar mascota actual en localStorage (FUNCIÓN FALTANTE)
    saveCurrentPet() {
        try {
            if (this.currentPet) {
                localStorage.setItem('petventure_current_pet', JSON.stringify(this.currentPet));
                console.log('✅ Mascota actual guardada:', this.currentPet.nombre);
            }
        } catch (error) {
            console.warn('⚠️ Error guardando mascota actual:', error);
        }
    }
    
    // Cargar mascota actual desde localStorage
    loadCurrentPet() {
        try {
            const savedPet = localStorage.getItem('petventure_current_pet');
            if (savedPet) {
                this.currentPet = JSON.parse(savedPet);
                console.log('📋 Mascota actual cargada:', this.currentPet.nombre);
                return this.currentPet;
            }
        } catch (error) {
            console.warn('⚠️ Error cargando mascota actual:', error);
        }
        return null;
    }
}

// Instancia global del PetManager
const petManager = new PetManager();

// Utilidades de mascotas
const PetUtils = {
    // Validar datos de mascota
    validatePetData: (petData) => {
        const errors = [];
        
        if (!petData.nombre || petData.nombre.trim() === '') {
            errors.push('El nombre de la mascota es requerido');
        }
        
        if (!petData.tipo || petData.tipo.trim() === '') {
            errors.push('El tipo de mascota es requerido');
        }
        
        if (!petData.poder || petData.poder.trim() === '') {
            errors.push('El poder de la mascota es requerido');
        }
        
        if (petData.edad === undefined || petData.edad === null) {
            errors.push('La edad de la mascota es requerida');
        } else if (petData.edad < 0 || petData.edad > 20) {
            errors.push('La edad debe estar entre 0 y 20 años');
        }
        
        if (!petData.descripcion || petData.descripcion.trim() === '') {
            errors.push('La descripción de la mascota es requerida');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    
    // Formatear edad de la mascota
    formatAge: (age) => {
        if (age === 0) return 'Recién nacido';
        if (age === 1) return '1 año';
        return `${age} años`;
    },
    
    // Formatear fecha
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Calcular tiempo transcurrido
    getTimeAgo: (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
        return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PetManager, PetUtils, petManager };
} 