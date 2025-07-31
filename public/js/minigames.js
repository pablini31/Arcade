// 🎮 Sistema de Minijuegos para PetVenture
class MinigameManager {
    constructor() {
        this.currentGame = null;
        this.isPlaying = false;
        this.scores = JSON.parse(localStorage.getItem('petventure_scores') || '{}');
        this.achievements = JSON.parse(localStorage.getItem('petventure_achievements') || '[]');
        this.gameContainer = null;
        
        this.init();
    }
    
    init() {
        this.createGameContainer();
        this.setupGameButtons();
        ConfigUtils.log('info', 'MinigameManager inicializado');
    }
    
    createGameContainer() {
        // Crear contenedor principal de minijuegos
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'minigame-container';
        this.gameContainer.className = 'minigame-container hidden';
        this.gameContainer.innerHTML = `
            <div class="minigame-overlay">
                <div class="minigame-modal">
                    <div class="minigame-header">
                        <h2 id="minigame-title">Minijuego</h2>
                        <button id="close-minigame" class="close-btn">×</button>
                    </div>
                    <div class="minigame-content" id="minigame-content">
                        <!-- Contenido del juego se carga aquí -->
                    </div>
                    <div class="minigame-footer" id="minigame-footer">
                        <!-- Botones y puntuación -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.gameContainer);
        
        // Configurar evento de cerrar
        document.getElementById('close-minigame').addEventListener('click', () => {
            this.closeGame();
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPlaying) {
                this.closeGame();
            }
        });
    }
    
    setupGameButtons() {
        // Usar delegación de eventos para máxima compatibilidad
        document.addEventListener('click', (e) => {
            if (e.target.closest('#memory-game-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.startMemoryGame();
            } else if (e.target.closest('#reaction-game-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.startReactionGame();
            } else if (e.target.closest('#puzzle-game-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.startPuzzleGame();
            }
        });
    }
    
    // 🧠 JUEGO DE MEMORIA
    async startMemoryGame() {
        const currentPet = petManager.getCurrentPet();
        if (!currentPet) {
            uiManager.showWarning('¡Selecciona una mascota para jugar con ella! 🐾');
            return;
        }
        
        if (currentPet.energia < 5) {
            uiManager.showInfo('Tu mascota está un poco cansada, pero puede jugar');
        }
        
        this.currentGame = 'memory';
        this.isPlaying = true;
        this.showGame('🧠 Juego de Memoria', this.createMemoryGameContent());
        
        // Añadir efectos de partículas al iniciar
        if (typeof effectsManager !== 'undefined') {
            effectsManager.createParticles(document.querySelector('.minigame-modal'), 'memory', 20);
        }
    }
    
    createMemoryGameContent() {
        const sequence = [];
        const playerSequence = [];
        let level = 1;
        let isPlayerTurn = false;
        let currentStep = 0;
        
        const colors = ['red', 'blue', 'green', 'yellow'];
        
        const content = `
            <div class="memory-game">
                <div class="memory-info">
                    <div class="memory-level">Nivel: <span id="memory-level">1</span></div>
                    <div class="memory-score">Puntuación: <span id="memory-score">0</span></div>
                </div>
                <div class="memory-buttons">
                    ${colors.map(color => `
                        <button class="memory-btn memory-${color}" data-color="${color}">
                            <i class="fas fa-circle"></i>
                        </button>
                    `).join('')}
                </div>
                <div class="memory-status">
                    <div id="memory-status">¡Memoriza la secuencia!</div>
                    <button id="start-memory" class="start-btn">Comenzar</button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.setupMemoryGame(sequence, playerSequence, level, isPlayerTurn, currentStep, colors);
        }, 100);
        
        return content;
    }
    
    setupMemoryGame(sequence, playerSequence, level, isPlayerTurn, currentStep, colors) {
        const statusEl = document.getElementById('memory-status');
        const levelEl = document.getElementById('memory-level');
        const scoreEl = document.getElementById('memory-score');
        const startBtn = document.getElementById('start-memory');
        const buttons = document.querySelectorAll('.memory-btn');
        
        let score = 0;
        
        const playSequence = () => {
            isPlayerTurn = false;
            currentStep = 0;
            statusEl.textContent = 'Observa la secuencia...';
            
            buttons.forEach(btn => btn.disabled = true);
            
            const playNext = (index) => {
                if (index >= sequence.length) {
                    isPlayerTurn = true;
                    statusEl.textContent = 'Tu turno - Repite la secuencia';
                    buttons.forEach(btn => btn.disabled = false);
                    return;
                }
                
                setTimeout(() => {
                    const color = sequence[index];
                    const btn = document.querySelector(`[data-color="${color}"]`);
                    btn.classList.add('active');
                    
                    // Efecto de sonido visual
                    this.createSoundEffect(btn, color);
                    
                    setTimeout(() => {
                        btn.classList.remove('active');
                        playNext(index + 1);
                    }, 600);
                }, 800);
            };
            
            playNext(0);
        };
        
        const nextLevel = () => {
            level++;
            levelEl.textContent = level;
            score += level * 10;
            scoreEl.textContent = score;
            
            // Agregar nuevo color a la secuencia
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            sequence.push(randomColor);
            playerSequence.length = 0;
            currentStep = 0;
            
            statusEl.textContent = `¡Nivel ${level}! Preparándose...`;
            
            setTimeout(() => {
                playSequence();
            }, 1500);
        };
        
        const gameOver = async () => {
            isPlayerTurn = false;
            buttons.forEach(btn => btn.disabled = true);
            
            const finalScore = score;
            statusEl.textContent = `¡Juego terminado! Puntuación: ${finalScore}`;
            
            // Calcular recompensas
            let rewards = { felicidad: 0, energia: -10, salud: 0 };
            
            if (level >= 1 && level <= 3) {
                rewards = { felicidad: 5, energia: -2, salud: 0 };
            } else if (level >= 4 && level <= 6) {
                rewards = { felicidad: 10, energia: -3, salud: 0 };
            } else if (level >= 7) {
                rewards = { felicidad: 20, energia: -5, salud: 5 };
            }
            
            // Mostrar recompensas
            const rewardsText = this.formatRewards(rewards);
            statusEl.innerHTML = `¡Juego terminado!<br>Puntuación: ${finalScore}<br>${rewardsText}`;
            
            // Aplicar recompensas a la mascota
            await this.applyGameRewards(rewards, `Juego de memoria completado - Nivel ${level}`);
            
            // Guardar puntuación
            this.saveScore('memory', finalScore, level);
            
            // Botón para jugar de nuevo
            const footer = document.getElementById('minigame-footer');
            footer.innerHTML = `
                <button id="play-again-memory" class="action-btn">Jugar de Nuevo</button>
                <button id="close-game" class="secondary-btn">Cerrar</button>
            `;
            
            document.getElementById('play-again-memory').addEventListener('click', () => {
                this.startMemoryGame();
            });
            
            document.getElementById('close-game').addEventListener('click', () => {
                this.closeGame();
            });
        };
        
        // Configurar botones de colores
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isPlayerTurn) return;
                
                const color = btn.dataset.color;
                playerSequence.push(color);
                
                // Efecto visual
                btn.classList.add('active');
                this.createSoundEffect(btn, color);
                
                setTimeout(() => {
                    btn.classList.remove('active');
                }, 200);
                
                // Verificar respuesta
                if (playerSequence[currentStep] !== sequence[currentStep]) {
                    gameOver();
                    return;
                }
                
                currentStep++;
                
                // Secuencia completada correctamente
                if (currentStep >= sequence.length) {
                    setTimeout(() => {
                        nextLevel();
                    }, 1000);
                }
            });
        });
        
        // Comenzar juego
        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            sequence.push(colors[Math.floor(Math.random() * colors.length)]);
            playSequence();
        });
    }
    
    // ⚡ JUEGO DE REACCIÓN RÁPIDA
    async startReactionGame() {
        const currentPet = petManager.getCurrentPet();
        if (!currentPet) {
            uiManager.showWarning('¡Selecciona una mascota para jugar con ella! 🐾');
            return;
        }
        
        if (currentPet.energia < 3) {
            uiManager.showInfo('Tu mascota está cansada, pero puede jugar un rato');
        }
        
        this.currentGame = 'reaction';
        this.isPlaying = true;
        this.showGame('⚡ Reacción Rápida', this.createReactionGameContent());
    }
    
    createReactionGameContent() {
        const content = `
            <div class="reaction-game">
                <div class="reaction-info">
                    <div class="reaction-score">Puntuación: <span id="reaction-score">0</span></div>
                    <div class="reaction-time">Tiempo: <span id="reaction-time">30</span>s</div>
                    <div class="reaction-combo">Combo: <span id="reaction-combo">0</span></div>
                </div>
                <div class="reaction-arena" id="reaction-arena">
                    <div class="reaction-instructions">
                        <h3>¡Atrapa los objetos buenos!</h3>
                        <div class="reaction-legend">
                            <div class="legend-item good">
                                <i class="fas fa-heart"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-bone"></i>
                                <span>Buenos (+puntos)</span>
                            </div>
                            <div class="legend-item bad">
                                <i class="fas fa-bomb"></i>
                                <i class="fas fa-skull"></i>
                                <span>Malos (-puntos)</span>
                            </div>
                        </div>
                        <button id="start-reaction" class="start-btn">¡Comenzar!</button>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.setupReactionGame();
        }, 100);
        
        return content;
    }
    
    setupReactionGame() {
        const arena = document.getElementById('reaction-arena');
        const scoreEl = document.getElementById('reaction-score');
        const timeEl = document.getElementById('reaction-time');
        const comboEl = document.getElementById('reaction-combo');
        const startBtn = document.getElementById('start-reaction');
        
        let score = 0;
        let timeLeft = 30;
        let combo = 0;
        let gameActive = false;
        let spawnInterval;
        let gameTimer;
        
        const goodItems = [
            { icon: 'fas fa-heart', color: '#ef4444', points: 5 },
            { icon: 'fas fa-star', color: '#fbbf24', points: 3 },
            { icon: 'fas fa-bone', color: '#f3f4f6', points: 4 },
            { icon: 'fas fa-apple-alt', color: '#10b981', points: 3 },
            { icon: 'fas fa-gem', color: '#8b5cf6', points: 8 }
        ];
        
        const badItems = [
            { icon: 'fas fa-bomb', color: '#1f2937', points: -10 },
            { icon: 'fas fa-skull', color: '#374151', points: -8 }
        ];
        
        const spawnItem = () => {
            if (!gameActive) return;
            
            // 70% probabilidad de objeto bueno
            const isGood = Math.random() < 0.7;
            const items = isGood ? goodItems : badItems;
            const item = items[Math.floor(Math.random() * items.length)];
            
            const itemEl = document.createElement('div');
            itemEl.className = `reaction-item ${isGood ? 'good-item' : 'bad-item'}`;
            itemEl.innerHTML = `<i class="${item.icon}"></i>`;
            itemEl.style.color = item.color;
            itemEl.style.left = Math.random() * (arena.offsetWidth - 50) + 'px';
            itemEl.style.top = Math.random() * (arena.offsetHeight - 50) + 'px';
            
            // Añadir efecto de aparición
            itemEl.style.transform = 'scale(0)';
            itemEl.style.transition = 'transform 0.3s ease';
            
            arena.appendChild(itemEl);
            
            // Animar aparición
            setTimeout(() => {
                itemEl.style.transform = 'scale(1)';
            }, 10);
            
            // Configurar click
            itemEl.addEventListener('click', () => {
                if (!gameActive) return;
                
                const points = item.points;
                score += points;
                
                if (points > 0) {
                    combo++;
                    // Bonus por combo
                    if (combo >= 5) {
                        score += Math.floor(combo / 5) * 2;
                        this.createComboEffect(itemEl, combo);
                    }
                } else {
                    combo = 0;
                    this.createNegativeEffect(itemEl);
                }
                
                scoreEl.textContent = score;
                comboEl.textContent = combo;
                
                // Efecto de click
                this.createClickEffect(itemEl, points > 0);
                itemEl.remove();
            });
            
            // Remover automáticamente después de 3 segundos
            setTimeout(() => {
                if (itemEl.parentNode) {
                    itemEl.remove();
                    if (isGood) {
                        combo = Math.max(0, combo - 1);
                        comboEl.textContent = combo;
                    }
                }
            }, 3000);
        };
        
        const startGame = () => {
            gameActive = true;
            arena.innerHTML = '';
            
            // Timer del juego
            gameTimer = setInterval(() => {
                timeLeft--;
                timeEl.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
            
            // Spawn de objetos
            spawnInterval = setInterval(spawnItem, 800);
        };
        
        const endGame = async () => {
            gameActive = false;
            clearInterval(gameTimer);
            clearInterval(spawnInterval);
            
            // Limpiar arena
            arena.innerHTML = '';
            
            const finalScore = score;
            
            // Calcular recompensas basadas en puntuación
            let rewards = { felicidad: 0, energia: -5, salud: 0 };
            
            if (finalScore <= 10) {
                rewards = { felicidad: 0, energia: -5, salud: 0 };
            } else if (finalScore <= 20) {
                rewards = { felicidad: 10, energia: 0, salud: 0 };
            } else if (finalScore <= 30) {
                rewards = { felicidad: 15, energia: 5, salud: 0 };
            } else {
                rewards = { felicidad: 25, energia: 10, salud: 5 };
            }
            
            // Mostrar resultados
            arena.innerHTML = `
                <div class="reaction-results">
                    <h3>¡Juego Terminado!</h3>
                    <div class="final-score">Puntuación Final: ${finalScore}</div>
                    <div class="rewards-info">${this.formatRewards(rewards)}</div>
                </div>
            `;
            
            // Aplicar recompensas
            await this.applyGameRewards(rewards, `Reacción rápida - ${finalScore} puntos`);
            
            // Guardar puntuación
            this.saveScore('reaction', finalScore, Math.floor(finalScore / 10));
            
            // Botones finales
            const footer = document.getElementById('minigame-footer');
            footer.innerHTML = `
                <button id="play-again-reaction" class="action-btn">Jugar de Nuevo</button>
                <button id="close-game" class="secondary-btn">Cerrar</button>
            `;
            
            document.getElementById('play-again-reaction').addEventListener('click', () => {
                this.startReactionGame();
            });
            
            document.getElementById('close-game').addEventListener('click', () => {
                this.closeGame();
            });
        };
        
        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            startGame();
        });
    }
    
    // 🧩 PUZZLE DESLIZANTE
    async startPuzzleGame() {
        const currentPet = petManager.getCurrentPet();
        if (!currentPet) {
            uiManager.showWarning('¡Selecciona una mascota para jugar con ella! 🐾');
            return;
        }
        
        if (currentPet.energia < 3) {
            uiManager.showInfo('Tu mascota está cansada, pero puede intentar el puzzle');
        }
        
        this.currentGame = 'puzzle';
        this.isPlaying = true;
        this.showGame('🧩 Puzzle Deslizante', this.createPuzzleGameContent());
    }
    
    createPuzzleGameContent() {
        // Obtener imagen de la mascota actual
        const currentPet = petManager.getCurrentPet();
        const petImage = this.getPetImageUrl(currentPet);
        
        const content = `
            <div class="puzzle-game">
                <div class="puzzle-info">
                    <div class="puzzle-timer">Tiempo: <span id="puzzle-time">120</span>s</div>
                    <div class="puzzle-moves">Movimientos: <span id="puzzle-moves">0</span></div>
                </div>
                <div class="puzzle-container">
                    <div class="puzzle-preview" id="puzzle-preview">
                        <img src="${petImage}" alt="Imagen original" crossorigin="anonymous">
                        <div class="preview-label">Imagen Original</div>
                    </div>
                    <div class="puzzle-board" id="puzzle-board">
                        <!-- Piezas del puzzle se generan aquí -->
                    </div>
                </div>
                <div class="puzzle-controls">
                    <button id="start-puzzle" class="start-btn">Comenzar Puzzle</button>
                    <button id="shuffle-puzzle" class="secondary-btn" style="display:none;">Mezclar</button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.setupPuzzleGame(petImage);
        }, 100);
        
        return content;
    }
    
    setupPuzzleGame(imageUrl) {
        const board = document.getElementById('puzzle-board');
        const timeEl = document.getElementById('puzzle-time');
        const movesEl = document.getElementById('puzzle-moves');
        const startBtn = document.getElementById('start-puzzle');
        const shuffleBtn = document.getElementById('shuffle-puzzle');
        
        let timeLeft = 120;
        let moves = 0;
        let gameActive = false;
        let gameTimer;
        
        // Estado del puzzle (3x3)
        let puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 = espacio vacío
        const solvedState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        
        // Funciones auxiliares
        const getPossibleMoves = (emptyIndex) => {
            const row = Math.floor(emptyIndex / 3);
            const col = emptyIndex % 3;
            const moves = [];
            
            if (row > 0) moves.push(emptyIndex - 3); // Arriba
            if (row < 2) moves.push(emptyIndex + 3); // Abajo
            if (col > 0) moves.push(emptyIndex - 1); // Izquierda
            if (col < 2) moves.push(emptyIndex + 1); // Derecha
            
            return moves;
        };
        
        const isPuzzleSolved = (state) => {
            return state.every((piece, index) => piece === solvedState[index]);
        };
        
        const canMovePiece = (pieceIndex, emptyIndex) => {
            const pieceRow = Math.floor(pieceIndex / 3);
            const pieceCol = pieceIndex % 3;
            const emptyRow = Math.floor(emptyIndex / 3);
            const emptyCol = emptyIndex % 3;
            
            const rowDiff = Math.abs(pieceRow - emptyRow);
            const colDiff = Math.abs(pieceCol - emptyCol);
            
            return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
        };
        
        const createBoard = () => {
            board.innerHTML = '';
            board.className = 'puzzle-board';
            
            puzzleState.forEach((piece, index) => {
                const pieceEl = document.createElement('div');
                pieceEl.className = 'puzzle-piece';
                
                if (piece === 0) {
                    pieceEl.classList.add('empty');
                } else {
                    // Usar la imagen real de la mascota
                    pieceEl.style.backgroundImage = `url(${imageUrl})`;
                    pieceEl.style.backgroundSize = '300px 300px';
                    // Calcular posición del background directamente
                    const row = Math.floor((piece - 1) / 3);
                    const col = (piece - 1) % 3;
                    const x = col * 100;
                    const y = row * 100;
                    pieceEl.style.backgroundPosition = `-${x}px -${y}px`;
                    pieceEl.style.border = '2px solid var(--success-color)';
                    pieceEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                    
                    // Agregar número pequeño en la esquina para ayudar
                    const numberLabel = document.createElement('span');
                    numberLabel.textContent = piece;
                    numberLabel.style.cssText = `
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        background: rgba(0,0,0,0.7);
                        color: white;
                        padding: 2px 4px;
                        border-radius: 3px;
                        font-size: 0.7rem;
                        font-weight: bold;
                    `;
                    pieceEl.appendChild(numberLabel);
                    
                    pieceEl.addEventListener('click', () => movePiece(index));
                }
                
                board.appendChild(pieceEl);
            });
        };
        
        const getPiecePosition = (piece) => {
            const row = Math.floor((piece - 1) / 3);
            const col = (piece - 1) % 3;
            const pieceSize = 100; // Cada pieza es 100px
            return `${-col * pieceSize}px ${-row * pieceSize}px`;
        };
        
        const movePiece = (index) => {
            if (!gameActive) return;
            
            const emptyIndex = puzzleState.indexOf(0);
            const canMove = canMovePiece(index, emptyIndex);
            
            if (canMove) {
                // Intercambiar piezas
                [puzzleState[index], puzzleState[emptyIndex]] = [puzzleState[emptyIndex], puzzleState[index]];
                moves++;
                movesEl.textContent = moves;
                
                // Actualizar tablero
                createBoard();
                
                // Efecto de movimiento
                const pieceEl = board.children[index];
                if (pieceEl) {
                    pieceEl.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        pieceEl.style.transform = 'scale(1)';
                    }, 150);
                }
                
                // Verificar si está resuelto
                if (isPuzzleSolved(puzzleState)) {
                    endGame(true);
                }
            }
        };
        
        const shufflePuzzle = () => {
            // Mezclar puzzle de manera válida
            for (let i = 0; i < 1000; i++) {
                const emptyIndex = puzzleState.indexOf(0);
                const possibleMoves = getPossibleMoves(emptyIndex);
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                [puzzleState[emptyIndex], puzzleState[randomMove]] = [puzzleState[randomMove], puzzleState[emptyIndex]];
            }
            
            createBoard();
        };
        
        const startGame = () => {
            gameActive = true;
            moves = 0;
            movesEl.textContent = moves;
            
            shufflePuzzle();
            
            startBtn.style.display = 'none';
            shuffleBtn.style.display = 'inline-block';
            
            // Timer del juego
            gameTimer = setInterval(() => {
                timeLeft--;
                timeEl.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    endGame(false);
                }
            }, 1000);
        };
        
        const endGame = async (completed) => {
            gameActive = false;
            clearInterval(gameTimer);
            
            const timeTaken = 120 - timeLeft;
            let rewards = { felicidad: 0, energia: -8, salud: 0 };
            let message = '';
            
            if (completed) {
                if (timeTaken < 60) {
                    rewards = { felicidad: 30, energia: -8, salud: 10 };
                    message = '¡Excelente! Completado en menos de 1 minuto';
                } else if (timeTaken < 120) {
                    rewards = { felicidad: 20, energia: -8, salud: 5 };
                    message = '¡Bien hecho! Puzzle completado';
                }
            } else {
                message = 'Tiempo agotado. ¡Inténtalo de nuevo!';
            }
            
            // Mostrar resultados
            board.innerHTML = `
                <div class="puzzle-results">
                    <h3>${completed ? '¡Puzzle Completado!' : 'Tiempo Agotado'}</h3>
                    <div class="result-stats">
                        <div>Tiempo: ${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</div>
                        <div>Movimientos: ${moves}</div>
                    </div>
                    <div class="result-message">${message}</div>
                    <div class="rewards-info">${this.formatRewards(rewards)}</div>
                </div>
            `;
            
            // Aplicar recompensas
            if (completed) {
                await this.applyGameRewards(rewards, `Puzzle completado - ${moves} movimientos`);
                this.saveScore('puzzle', timeTaken, completed ? 1 : 0);
            }
            
            // Botones finales
            const footer = document.getElementById('minigame-footer');
            footer.innerHTML = `
                <button id="play-again-puzzle" class="action-btn">Jugar de Nuevo</button>
                <button id="close-game" class="secondary-btn">Cerrar</button>
            `;
            
            document.getElementById('play-again-puzzle').addEventListener('click', () => {
                this.startPuzzleGame();
            });
            
            document.getElementById('close-game').addEventListener('click', () => {
                this.closeGame();
            });
        };
        
        // Configurar eventos
        startBtn.addEventListener('click', startGame);
        shuffleBtn.addEventListener('click', shufflePuzzle);
        
        // Crear tablero inicial
        createBoard();
    }
    
    // Obtener URL de imagen real de mascota
    getPetImageUrl(pet) {
        if (!pet) return 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=face';
        
        // Imágenes reales basadas en el tipo de mascota
        const petImages = {
            'perro': [
                'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop&crop=face'
            ],
            'gato': [
                'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300&h=300&fit=crop&crop=face'
            ],
            'conejo': [
                'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1606425271394-c3ca9aa1cd93?w=300&h=300&fit=crop&crop=face'
            ],
            'hamster': [
                'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=300&h=300&fit=crop&crop=face'
            ],
            'pajaro': [
                'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&h=300&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?w=300&h=300&fit=crop&crop=face'
            ]
        };
        
        const petType = pet.tipo?.toLowerCase() || 'perro';
        const images = petImages[petType] || petImages['perro'];
        
        // Seleccionar imagen basada en el ID de la mascota para consistencia
        const imageIndex = pet.id ? pet.id.toString().charCodeAt(0) % images.length : 0;
        return images[imageIndex];
    }
    
    // Utilidades del puzzle
    canMovePiece(pieceIndex, emptyIndex) {
        const pieceRow = Math.floor(pieceIndex / 3);
        const pieceCol = pieceIndex % 3;
        const emptyRow = Math.floor(emptyIndex / 3);
        const emptyCol = emptyIndex % 3;
        
        const rowDiff = Math.abs(pieceRow - emptyRow);
        const colDiff = Math.abs(pieceCol - emptyCol);
        
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    getPossibleMoves(emptyIndex) {
        const moves = [];
        const row = Math.floor(emptyIndex / 3);
        const col = emptyIndex % 3;
        
        // Arriba, abajo, izquierda, derecha
        if (row > 0) moves.push(emptyIndex - 3);
        if (row < 2) moves.push(emptyIndex + 3);
        if (col > 0) moves.push(emptyIndex - 1);
        if (col < 2) moves.push(emptyIndex + 1);
        
        return moves;
    }
    
    isPuzzleSolved(puzzleState) {
        const solvedState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        return puzzleState.every((piece, index) => piece === solvedState[index]);
    }
    
    // Efectos visuales
    createSoundEffect(element, color) {
        element.style.boxShadow = `0 0 20px var(--${color === 'red' ? 'danger' : color === 'blue' ? 'primary' : color === 'green' ? 'success' : 'warning'}-color)`;
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 300);
    }
    
    createClickEffect(element, isPositive) {
        const effect = document.createElement('div');
        effect.className = `click-effect ${isPositive ? 'positive' : 'negative'}`;
        effect.textContent = isPositive ? '+' : '-';
        
        const rect = element.getBoundingClientRect();
        effect.style.left = rect.left + rect.width / 2 + 'px';
        effect.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1000);
    }
    
    createComboEffect(element, combo) {
        const effect = document.createElement('div');
        effect.className = 'combo-effect';
        effect.textContent = `COMBO x${combo}!`;
        
        const rect = element.getBoundingClientRect();
        effect.style.left = rect.left + 'px';
        effect.style.top = rect.top - 30 + 'px';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1500);
    }
    
    createNegativeEffect(element) {
        element.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            element.style.filter = '';
        }, 500);
    }
    
    createMoveEffect(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Aplicar recompensas del juego
    async applyGameRewards(rewards, action) {
        try {
            const currentPet = petManager.getCurrentPet();
            if (!currentPet) return;
            
            // Aplicar cambios localmente para feedback inmediato
            if (rewards.felicidad !== 0) {
                currentPet.felicidad = Math.max(0, Math.min(100, currentPet.felicidad + rewards.felicidad));
            }
            if (rewards.energia !== 0) {
                currentPet.energia = Math.max(0, Math.min(100, currentPet.energia + rewards.energia));
            }
            if (rewards.salud !== 0) {
                currentPet.salud = Math.max(0, Math.min(100, currentPet.salud + rewards.salud));
            }
            
            // Actualizar UI inmediatamente
            uiManager.updatePetDisplay(currentPet);
            
            // Llamar al endpoint correspondiente para persistir cambios
            let endpoint = '';
            let body = {};
            
            if (rewards.felicidad > 0 || rewards.energia < 0) {
                // Usar endpoint de pasear para felicidad
                endpoint = `/api/mascotas/${currentPet.id}/pasear`;
                body = { duracion: Math.abs(rewards.energia) * 2 }; // Convertir energía en duración
            } else if (rewards.salud > 0) {
                // Usar endpoint de curar si hay problemas de salud
                endpoint = `/api/mascotas/${currentPet.id}/alimentar`;
                body = { tipoAlimento: 'premium' };
            } else {
                // Usar endpoint de alimentar por defecto
                endpoint = `/api/mascotas/${currentPet.id}/alimentar`;
                body = { tipoAlimento: 'normal' };
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authManager.getToken()}`
                },
                body: JSON.stringify(body)
            });
            
            if (response.ok) {
                const result = await response.json();
                // Actualizar con datos del servidor
                petManager.updateCurrentPet(result.mascota);
                uiManager.updatePetDisplay(result.mascota);
                
                // Mostrar mensaje de éxito
                uiManager.showSuccess(`¡${action} - Tu mascota está más feliz! 🎉`);
                
                // Efectos visuales
                if (typeof effectsManager !== 'undefined') {
                    effectsManager.createParticles(document.querySelector('.pet-display'), 'success', 15);
                }
            }
            
        } catch (error) {
            ConfigUtils.log('error', 'Error aplicando recompensas del juego', error);
            uiManager.showWarning('No se pudieron guardar las recompensas, pero tu mascota disfrutó el juego');
        }
    }
    
    // Utilidades
    formatRewards(rewards) {
        const parts = [];
        if (rewards.felicidad !== 0) {
            parts.push(`Felicidad: ${rewards.felicidad > 0 ? '+' : ''}${rewards.felicidad}`);
        }
        if (rewards.energia !== 0) {
            parts.push(`Energía: ${rewards.energia > 0 ? '+' : ''}${rewards.energia}`);
        }
        if (rewards.salud !== 0) {
            parts.push(`Salud: ${rewards.salud > 0 ? '+' : ''}${rewards.salud}`);
        }
        return parts.join(' | ');
    }
    
    saveScore(gameType, score, level) {
        if (!this.scores[gameType]) {
            this.scores[gameType] = { best: 0, total: 0, games: 0 };
        }
        
        this.scores[gameType].best = Math.max(this.scores[gameType].best, score);
        this.scores[gameType].total += score;
        this.scores[gameType].games++;
        
        localStorage.setItem('petventure_scores', JSON.stringify(this.scores));
        
        // Verificar logros
        this.checkAchievements(gameType, score, level);
    }
    
    checkAchievements(gameType, score, level) {
        const achievements = [
            {
                id: 'first_game',
                name: 'Primer Juego',
                description: 'Completar tu primer minijuego',
                condition: () => true
            },
            {
                id: 'memory_master',
                name: 'Maestro de la Memoria',
                description: 'Alcanzar nivel 7 en el juego de memoria',
                condition: () => gameType === 'memory' && level >= 7
            },
            {
                id: 'reaction_speed',
                name: 'Velocidad de Reacción',
                description: 'Conseguir 30+ puntos en reacción rápida',
                condition: () => gameType === 'reaction' && score >= 30
            },
            {
                id: 'puzzle_expert',
                name: 'Experto en Puzzles',
                description: 'Completar un puzzle en menos de 60 segundos',
                condition: () => gameType === 'puzzle' && score < 60 && level === 1
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.achievements.includes(achievement.id) && achievement.condition()) {
                this.achievements.push(achievement.id);
                localStorage.setItem('petventure_achievements', JSON.stringify(this.achievements));
                this.showAchievement(achievement);
            }
        });
    }
    
    showAchievement(achievement) {
        uiManager.showSuccess(`🏆 ¡Logro desbloqueado!: ${achievement.name}`);
        
        // Efectos especiales para logros
        if (typeof effectsManager !== 'undefined') {
            effectsManager.createParticles(document.body, 'achievement', 30);
        }
        
        // Trigger efecto de celebración en el fondo
        if (window.dynamicBackgroundManager) {
            window.dynamicBackgroundManager.triggerSpecialEffect('celebration');
        }
    }
    
    showGame(title, content) {
        const titleEl = document.getElementById('minigame-title');
        const contentEl = document.getElementById('minigame-content');
        const footerEl = document.getElementById('minigame-footer');
        
        titleEl.textContent = title;
        contentEl.innerHTML = content;
        footerEl.innerHTML = '';
        
        this.gameContainer.classList.remove('hidden');
        
        // Efecto de entrada
        const modal = this.gameContainer.querySelector('.minigame-modal');
        modal.style.transform = 'scale(0.8)';
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.transform = 'scale(1)';
            modal.style.opacity = '1';
            modal.style.transition = 'all 0.3s ease';
        }, 10);
    }
    
    closeGame() {
        this.isPlaying = false;
        this.currentGame = null;
        
        const modal = this.gameContainer.querySelector('.minigame-modal');
        modal.style.transform = 'scale(0.8)';
        modal.style.opacity = '0';
        
        setTimeout(() => {
            this.gameContainer.classList.add('hidden');
        }, 300);
    }
    
    getStats() {
        return {
            scores: this.scores,
            achievements: this.achievements,
            totalGames: Object.values(this.scores).reduce((sum, game) => sum + game.games, 0)
        };
    }
}

// Instancia global
const minigameManager = new MinigameManager(); 