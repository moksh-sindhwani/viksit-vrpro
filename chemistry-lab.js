// Advanced Chemistry Lab VR Interactions
class ChemistryLabVR {
    constructor() {
        this.experimentState = {
            currentStep: 1,
            totalSteps: 7,
            temperature: 25, // Celsius
            concentration: 0,
            isHeating: false,
            isStirring: false,
            crystalsFormed: false,
            solutionVolume: 100, // mL
            timeElapsed: 0,
            crystalCount: 0,
            safetyScore: 100
        };
        
        this.animations = {
            heating: null,
            stirring: null,
            crystallization: null
        };
        
        this.sounds = {
            bubbling: null,
            stirring: null,
            crystallization: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAudio();
        this.startPerformanceMonitoring();
        this.setupAccessibility();
        this.initializePhysics();
    }

    setupEventListeners() {
        // Advanced VR interactions
        this.setupVRControllers();
        this.setupGazeTracking();
        this.setupHandTracking();
        this.setupVoiceCommands();
        
        // Equipment interactions
        this.setupEquipmentPhysics();
        this.setupTemperatureControls();
        this.setupMeasurementTools();
    }

    setupVRControllers() {
        document.addEventListener('DOMContentLoaded', () => {
            const scene = document.querySelector('#vrScene');
            
            // Left controller for tool selection
            const leftController = document.createElement('a-entity');
            leftController.setAttribute('id', 'leftController');
            leftController.setAttribute('hand-controls', 'hand: left; handModelStyle: lowPoly; color: #00ff88');
            leftController.setAttribute('laser-controls', 'hand: left');
            leftController.setAttribute('raycaster', 'objects: .clickable; far: 5');
            scene.appendChild(leftController);
            
            // Right controller for interaction
            const rightController = document.createElement('a-entity');
            rightController.setAttribute('id', 'rightController');
            rightController.setAttribute('hand-controls', 'hand: right; handModelStyle: lowPoly; color: #00ff88');
            rightController.setAttribute('laser-controls', 'hand: right');
            rightController.setAttribute('raycaster', 'objects: .clickable; far: 5');
            scene.appendChild(rightController);
            
            // Controller event listeners
            leftController.addEventListener('triggerdown', this.handleControllerTrigger.bind(this));
            rightController.addEventListener('triggerdown', this.handleControllerTrigger.bind(this));
        });
    }

    handleControllerTrigger(event) {
        const intersectedEl = event.detail.intersectedEl;
        if (intersectedEl) {
            this.interactWithObject(intersectedEl);
        }
    }

    setupGazeTracking() {
        const camera = document.querySelector('a-camera');
        if (camera) {
            camera.setAttribute('raycaster', 'objects: .gazeable; far: 10');
            camera.addEventListener('raycaster-intersection', (event) => {
                this.handleGazeIntersection(event.detail.intersections[0]);
            });
        }
    }

    handleGazeIntersection(intersection) {
        if (intersection && intersection.object.el.classList.contains('gazeable')) {
            this.showObjectInfo(intersection.object.el);
        }
    }

    setupHandTracking() {
        // Hand tracking for precise manipulations
        if ('XRHand' in window) {
            const scene = document.querySelector('#vrScene');
            
            // Add hand tracking components
            const handLeft = document.createElement('a-entity');
            handLeft.setAttribute('hand-tracking-controls', 'hand: left');
            handLeft.setAttribute('id', 'leftHand');
            scene.appendChild(handLeft);
            
            const handRight = document.createElement('a-entity');
            handRight.setAttribute('hand-tracking-controls', 'hand: right');
            handRight.setAttribute('id', 'rightHand');
            scene.appendChild(handRight);
        }
    }

    setupVoiceCommands() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                this.processVoiceCommand(command);
            };
            
            // Start voice recognition
            this.recognition.start();
        }
    }

    processVoiceCommand(command) {
        const commands = {
            'start experiment': () => this.startExperiment(),
            'heat solution': () => this.heatSolution(),
            'stir solution': () => this.stirSolution(),
            'stop heating': () => this.stopHeating(),
            'next step': () => this.nextStep(),
            'reset experiment': () => this.resetExperiment(),
            'show temperature': () => this.announceTemperature(),
            'safety check': () => this.performSafetyCheck()
        };
        
        for (const [voiceCommand, action] of Object.entries(commands)) {
            if (command.includes(voiceCommand)) {
                action();
                this.speak(`Executing ${voiceCommand}`);
                break;
            }
        }
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    setupEquipmentPhysics() {
        // Add physics to equipment for realistic interactions
        const equipment = document.querySelectorAll('.clickable');
        equipment.forEach(item => {
            item.setAttribute('physics-body', 'type: static');
            item.setAttribute('collision-filter', 'group: equipment; collidesWith: hand');
        });
    }

    initializePhysics() {
        const scene = document.querySelector('#vrScene');
        if (scene) {
            scene.setAttribute('physics', 'driver: cannon; gravity: -9.8');
        }
    }

    setupTemperatureControls() {
        this.temperatureInterval = setInterval(() => {
            this.updateTemperature();
        }, 1000);
    }

    updateTemperature() {
        if (this.experimentState.isHeating) {
            if (this.experimentState.temperature < 100) {
                this.experimentState.temperature += 2;
                this.updateTemperatureDisplay();
                this.checkBoilingPoint();
            }
        } else {
            if (this.experimentState.temperature > 25) {
                this.experimentState.temperature -= 1;
                this.updateTemperatureDisplay();
                this.checkCrystallizationTemp();
            }
        }
    }

    updateTemperatureDisplay() {
        const tempDisplay = document.getElementById('temperatureDisplay');
        if (tempDisplay) {
            tempDisplay.textContent = `${this.experimentState.temperature}°C`;
            tempDisplay.className = this.getTemperatureClass();
        }
        
        // Update solution appearance based on temperature
        this.updateSolutionAppearance();
    }

    getTemperatureClass() {
        const temp = this.experimentState.temperature;
        if (temp < 30) return 'temperature-cold';
        if (temp < 60) return 'temperature-warm';
        if (temp < 90) return 'temperature-hot';
        return 'temperature-boiling';
    }

    updateSolutionAppearance() {
        const solution = document.querySelector('#solution');
        if (solution) {
            const temp = this.experimentState.temperature;
            const hue = Math.max(240 - (temp - 25) * 2, 180); // Blue to purple as temperature increases
            solution.setAttribute('color', `hsl(${hue}, 70%, 50%)`);
            
            if (temp > 80) {
                this.createSteamEffect();
            }
        }
    }

    createSteamEffect() {
        const steamParticles = document.querySelector('#steamParticles');
        if (!steamParticles) {
            const steam = document.createElement('a-entity');
            steam.setAttribute('id', 'steamParticles');
            steam.setAttribute('position', '-1.5 1.6 -3');
            steam.setAttribute('particle-system', {
                preset: 'snow',
                particleCount: 100,
                color: '#ffffff',
                size: 0.1,
                velocityValue: '0 2 0',
                velocitySpread: '1 0 1',
                accelerationValue: '0 1 0'
            });
            document.querySelector('#vrScene').appendChild(steam);
        }
    }

    checkBoilingPoint() {
        if (this.experimentState.temperature >= 100) {
            this.createBubblingEffect();
            this.playSound('bubbling');
        }
    }

    checkCrystallizationTemp() {
        if (this.experimentState.temperature <= 40 && this.experimentState.concentration > 70) {
            this.startCrystallization();
        }
    }

    createBubblingEffect() {
        const solution = document.querySelector('#solution');
        if (solution) {
            // Create bubbles
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.createBubble();
                }, i * 200);
            }
        }
    }

    createBubble() {
        const bubble = document.createElement('a-sphere');
        const x = -1.5 + (Math.random() - 0.5) * 0.3;
        const z = -3 + (Math.random() - 0.5) * 0.3;
        
        bubble.setAttribute('position', `${x} 1.1 ${z}`);
        bubble.setAttribute('radius', '0.02');
        bubble.setAttribute('color', '#87CEEB');
        bubble.setAttribute('material', 'opacity: 0.6; transparent: true');
        bubble.setAttribute('animation', {
            property: 'position',
            to: `${x} 1.8 ${z}`,
            dur: 1000,
            easing: 'easeOutQuad'
        });
        bubble.setAttribute('animation__fade', {
            property: 'material.opacity',
            to: 0,
            dur: 1000,
            easing: 'easeOutQuad'
        });
        
        document.querySelector('#vrScene').appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, 1000);
    }

    startCrystallization() {
        if (!this.experimentState.crystalsFormed) {
            this.experimentState.crystalsFormed = true;
            this.animateCrystalFormation();
            this.playSound('crystallization');
            this.updateProgress();
        }
    }

    animateCrystalFormation() {
        const crystalPositions = [
            { x: 0.4, y: 1.25, z: -2.5 },
            { x: 0.6, y: 1.25, z: -2.4 },
            { x: 0.5, y: 1.25, z: -2.6 },
            { x: 0.3, y: 1.25, z: -2.7 },
            { x: 0.7, y: 1.25, z: -2.3 }
        ];
        
        crystalPositions.forEach((pos, index) => {
            setTimeout(() => {
                this.createCrystal(pos, index);
            }, index * 500);
        });
    }

    createCrystal(position, index) {
        const crystal = document.createElement('a-box');
        crystal.setAttribute('id', `dynamic-crystal-${index}`);
        crystal.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        crystal.setAttribute('width', 0.05 + Math.random() * 0.03);
        crystal.setAttribute('height', 0.04 + Math.random() * 0.04);
        crystal.setAttribute('depth', 0.05 + Math.random() * 0.02);
        crystal.setAttribute('color', '#4169E1');
        crystal.setAttribute('material', {
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0
        });
        crystal.setAttribute('rotation', `${Math.random() * 360} ${Math.random() * 360} ${Math.random() * 360}`);
        
        // Formation animation
        crystal.setAttribute('animation', {
            property: 'material.opacity',
            from: 0,
            to: 1,
            dur: 1000,
            easing: 'easeOutBack'
        });
        crystal.setAttribute('animation__scale', {
            property: 'scale',
            from: '0 0 0',
            to: '1 1 1',
            dur: 1000,
            easing: 'easeOutBack'
        });
        
        // Continuous sparkle effect
        crystal.setAttribute('animation__sparkle', {
            property: 'rotation',
            to: `${Math.random() * 360} ${Math.random() * 360} ${Math.random() * 360}`,
            dur: 3000,
            loop: true,
            easing: 'linear'
        });
        
        document.querySelector('#vrScene').appendChild(crystal);
        this.experimentState.crystalCount++;
        
        // Add click interaction for crystal examination
        crystal.classList.add('clickable');
        crystal.addEventListener('click', () => {
            this.examineCrystal(crystal, index);
        });
    }

    examineCrystal(crystal, index) {
        const info = {
            size: crystal.getAttribute('width'),
            structure: 'Triclinic',
            composition: 'CuSO₄·5H₂O',
            formation_time: `${(index + 1) * 0.5} minutes`,
            quality: this.calculateCrystalQuality()
        };
        
        this.showCrystalAnalysis(info);
        this.highlightCrystal(crystal);
    }

    calculateCrystalQuality() {
        const factors = {
            temperature_control: this.experimentState.temperature <= 45 ? 1 : 0.8,
            stirring_consistency: this.experimentState.isStirring ? 1 : 0.9,
            cooling_rate: 0.95, // Assume good cooling rate
            solution_purity: 0.98
        };
        
        const quality = Object.values(factors).reduce((a, b) => a * b, 1) * 100;
        return Math.round(quality);
    }

    showCrystalAnalysis(info) {
        const analysisPanel = document.createElement('div');
        analysisPanel.className = 'crystal-analysis-panel';
        analysisPanel.innerHTML = `
            <h3>Crystal Analysis</h3>
            <div class="analysis-item">
                <strong>Size:</strong> ${parseFloat(info.size).toFixed(2)} cm
            </div>
            <div class="analysis-item">
                <strong>Structure:</strong> ${info.structure}
            </div>
            <div class="analysis-item">
                <strong>Composition:</strong> <span class="chemical-formula">${info.composition}</span>
            </div>
            <div class="analysis-item">
                <strong>Formation Time:</strong> ${info.formation_time}
            </div>
            <div class="analysis-item">
                <strong>Quality Score:</strong> <span class="quality-score">${info.quality}%</span>
            </div>
            <button onclick="this.parentElement.remove()">Close Analysis</button>
        `;
        
        document.body.appendChild(analysisPanel);
        
        setTimeout(() => {
            analysisPanel.remove();
        }, 10000);
    }

    highlightCrystal(crystal) {
        const originalColor = crystal.getAttribute('color');
        crystal.setAttribute('color', '#00ff88');
        crystal.setAttribute('animation__highlight', {
            property: 'scale',
            from: '1 1 1',
            to: '1.2 1.2 1.2',
            dur: 500,
            dir: 'alternate',
            loop: 2
        });
        
        setTimeout(() => {
            crystal.setAttribute('color', originalColor);
        }, 1000);
    }

    initializeAudio() {
        // Create spatial audio for immersive experience
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sounds = {
            bubbling: this.createSpatialAudio('bubbling', -1.5, 1.3, -3),
            stirring: this.createSpatialAudio('stirring', 1.5, 1.3, -3),
            crystallization: this.createSpatialAudio('crystallization', 0.5, 1.2, -2.5),
            heating: this.createSpatialAudio('heating', 0, 1.2, -3)
        };
    }

    createSpatialAudio(type, x, y, z) {
        const audio = document.createElement('a-sound');
        audio.setAttribute('position', `${x} ${y} ${z}`);
        audio.setAttribute('volume', '0.5');
        audio.setAttribute('autoplay', 'false');
        audio.setAttribute('loop', 'true');
        
        // Set appropriate sound source based on type
        const soundSources = {
            bubbling: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+H5w2AcBiuJ0fPThTMGKHrJ7t+SPgo8lNvv12IcBzSE0fPRizAGlNquu2UYCDWZ2uLDdiMFJ3nH7dyFQQgWYrzp7KNTFQpGn+H1xF4cBSqF0PPNFQgZaLzp7KNTFQpGn+H1xF4cBSqF0PPNFQgZaLzp7KNTFQpGn+H1xF4cBSqF0PPNFQgZaLzp7KNTFQpGn+H1xF4cBSqF0PPNFQgZaLzp7KNTFQpGn+H1xF4cBSqF0PPNeyAFKH7L5t2OQQoVXrXm66pVFApHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEGJX/M5N2PQgoTYLXj7aVXFQpHn+D2w2AbBSuF0PLShzEG',
            stirring: 'data:audio/wav;base64,similar_base64_for_stirring',
            crystallization: 'data:audio/wav;base64,similar_base64_for_crystallization',
            heating: 'data:audio/wav;base64,similar_base64_for_heating'
        };
        
        audio.setAttribute('src', soundSources[type] || soundSources.bubbling);
        document.querySelector('#vrScene').appendChild(audio);
        
        return audio;
    }

    playSound(soundType) {
        if (this.sounds[soundType]) {
            this.sounds[soundType].components.sound.playSound();
        }
    }

    stopSound(soundType) {
        if (this.sounds[soundType]) {
            this.sounds[soundType].components.sound.stopSound();
        }
    }

    setupMeasurementTools() {
        this.createVirtualThermometer();
        this.createVirtualpHMeter();
        this.createVirtualScale();
    }

    createVirtualThermometer() {
        const thermometer = document.createElement('div');
        thermometer.id = 'virtualThermometer';
        thermometer.className = 'measurement-tool';
        thermometer.innerHTML = `
            <div class="tool-header">🌡️ Digital Thermometer</div>
            <div class="measurement-display">
                <span id="temperatureReading">${this.experimentState.temperature}</span>
                <span class="measurement-unit">°C</span>
            </div>
            <div class="measurement-accuracy">±0.1°C</div>
        `;
        
        document.querySelector('.lab-panel').appendChild(thermometer);
    }

    createVirtualpHMeter() {
        const phMeter = document.createElement('div');
        phMeter.id = 'virtualpHMeter';
        phMeter.className = 'measurement-tool';
        phMeter.innerHTML = `
            <div class="tool-header">🧪 pH Meter</div>
            <div class="measurement-display">
                <span id="pHReading">3.8</span>
                <span class="measurement-unit">pH</span>
            </div>
            <div class="measurement-accuracy">±0.01 pH</div>
        `;
        
        document.querySelector('.lab-panel').appendChild(phMeter);
    }

    createVirtualScale() {
        const scale = document.createElement('div');
        scale.id = 'virtualScale';
        scale.className = 'measurement-tool';
        scale.innerHTML = `
            <div class="tool-header">⚖️ Analytical Balance</div>
            <div class="measurement-display">
                <span id="massReading">25.64</span>
                <span class="measurement-unit">g</span>
            </div>
            <div class="measurement-accuracy">±0.01g</div>
        `;
        
        document.querySelector('.lab-panel').appendChild(scale);
    }

    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
        
        // Screen reader support
        this.addARIALabels();
        
        // High contrast mode detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
        
        // Reduced motion detection
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    handleKeyboardInput(event) {
        const keyActions = {
            'Space': () => this.startExperiment(),
            'KeyH': () => this.heatSolution(),
            'KeyS': () => this.stirSolution(),
            'KeyC': () => this.coolSolution(),
            'KeyR': () => this.resetExperiment(),
            'Escape': () => this.pauseExperiment(),
            'ArrowRight': () => this.nextStep(),
            'ArrowLeft': () => this.previousStep()
        };
        
        if (keyActions[event.code]) {
            event.preventDefault();
            keyActions[event.code]();
        }
    }

    addARIALabels() {
        const ariaLabels = {
            '#startExperiment': 'Start the copper sulphate crystallization experiment',
            '#heatSolution': 'Heat the copper sulphate solution using Bunsen burner',
            '#stirSolution': 'Stir the solution to ensure complete dissolution',
            '#coolSolution': 'Cool the solution to begin crystallization process',
            '#nextStep': 'Proceed to the next step in the experiment'
        };
        
        Object.entries(ariaLabels).forEach(([selector, label]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('aria-label', label);
                element.setAttribute('role', 'button');
            }
        });
    }

    startPerformanceMonitoring() {
        this.performanceMonitor = setInterval(() => {
            this.checkVRPerformance();
            this.optimizeRendering();
        }, 2000);
    }

    checkVRPerformance() {
        const scene = document.querySelector('#vrScene');
        if (scene && scene.renderer) {
            const fps = Math.round(1000 / scene.renderer.info.render.frame);
            const drawCalls = scene.renderer.info.render.calls;
            
            if (fps < 60) {
                this.optimizePerformance();
            }
            
            console.log(`VR Performance: ${fps} FPS, ${drawCalls} draw calls`);
        }
    }

    optimizePerformance() {
        // Reduce particle effects if performance is poor
        const particles = document.querySelectorAll('[particle-system]');
        particles.forEach(particle => {
            const currentCount = particle.getAttribute('particle-system').particleCount;
            if (currentCount > 50) {
                particle.setAttribute('particle-system', 
                    `particleCount: ${Math.floor(currentCount * 0.7)}`);
            }
        });
        
        // Reduce animation complexity
        const animations = document.querySelectorAll('[animation]');
        animations.forEach(anim => {
            const duration = parseInt(anim.getAttribute('animation').dur);
            if (duration < 1000) {
                anim.setAttribute('animation', 
                    anim.getAttribute('animation').replace(/dur: \d+/, 'dur: 1000'));
            }
        });
    }

    optimizeRendering() {
        const scene = document.querySelector('#vrScene');
        if (scene) {
            // Enable frustum culling
            scene.setAttribute('renderer', 'antialias: true; logarithmicDepthBuffer: true');
            
            // Optimize shadows
            scene.setAttribute('shadow', 'type: pcfsoft; autoUpdate: true');
        }
    }

    // Advanced experiment features
    calculateSolubility(temperature) {
        // Copper sulphate solubility curve approximation
        return 14.3 + 0.5 * temperature + 0.002 * Math.pow(temperature, 2);
    }

    predictCrystalSize(coolingRate, concentration) {
        // Simplified crystal size prediction
        const baseSize = 0.05;
        const rateMultiplier = Math.max(0.5, 2 - coolingRate);
        const concMultiplier = Math.min(2, concentration / 80);
        
        return baseSize * rateMultiplier * concMultiplier;
    }

    generateLabReport() {
        const report = {
            experiment: 'Copper Sulphate Crystallization',
            date: new Date().toLocaleDateString(),
            duration: `${Math.floor(this.experimentState.timeElapsed / 60)} minutes`,
            maxTemperature: `${Math.max(...this.temperatureHistory)}°C`,
            crystalsFormed: this.experimentState.crystalCount,
            avgCrystalSize: this.calculateAverageCrystalSize(),
            efficiency: this.calculateExperimentEfficiency(),
            safetyScore: this.experimentState.safetyScore,
            observations: this.collectObservations()
        };
        
        this.displayLabReport(report);
        return report;
    }

    calculateAverageCrystalSize() {
        const crystals = document.querySelectorAll('[id^="dynamic-crystal-"]');
        if (crystals.length === 0) return 0;
        
        let totalSize = 0;
        crystals.forEach(crystal => {
            totalSize += parseFloat(crystal.getAttribute('width'));
        });
        
        return (totalSize / crystals.length).toFixed(3);
    }

    calculateExperimentEfficiency() {
        const factors = {
            temperatureControl: this.experimentState.temperature <= 100 ? 100 : 90,
            timingAccuracy: 95, // Based on step completion timing
            crystalFormation: this.experimentState.crystalsFormed ? 100 : 0,
            safetyCompliance: this.experimentState.safetyScore
        };
        
        return Math.round(Object.values(factors).reduce((a, b) => a + b) / 4);
    }

    collectObservations() {
        return [
            `Solution heated to ${this.experimentState.temperature}°C`,
            `${this.experimentState.crystalCount} crystals formed during cooling`,
            `Average crystal size: ${this.calculateAverageCrystalSize()}cm`,
            `Crystallization process completed successfully`
        ];
    }

    displayLabReport(report) {
        const reportPanel = document.createElement('div');
        reportPanel.className = 'lab-report-panel';
        reportPanel.innerHTML = `
            <div class="report-header">
                <h2>Laboratory Report</h2>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">×</button>
            </div>
            <div class="report-content">
                <div class="report-section">
                    <h3>Experiment Details</h3>
                    <p><strong>Name:</strong> ${report.experiment}</p>
                    <p><strong>Date:</strong> ${report.date}</p>
                    <p><strong>Duration:</strong> ${report.duration}</p>
                </div>
                <div class="report-section">
                    <h3>Results</h3>
                    <p><strong>Max Temperature:</strong> ${report.maxTemperature}</p>
                    <p><strong>Crystals Formed:</strong> ${report.crystalsFormed}</p>
                    <p><strong>Average Crystal Size:</strong> ${report.avgCrystalSize}cm</p>
                    <p><strong>Efficiency:</strong> ${report.efficiency}%</p>
                    <p><strong>Safety Score:</strong> ${report.safetyScore}%</p>
                </div>
                <div class="report-section">
                    <h3>Observations</h3>
                    <ul>
                        ${report.observations.map(obs => `<li>${obs}</li>`).join('')}
                    </ul>
                </div>
                <div class="report-actions">
                    <button onclick="window.print()">Print Report</button>
                    <button onclick="chemLab.downloadReport(${JSON.stringify(report)})">Download PDF</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reportPanel);
    }

    downloadReport(report) {
        // Create downloadable PDF report
        const reportText = `
LABORATORY REPORT
=================

Experiment: ${report.experiment}
Date: ${report.date}
Duration: ${report.duration}

RESULTS
-------
Max Temperature: ${report.maxTemperature}
Crystals Formed: ${report.crystalsFormed}
Average Crystal Size: ${report.avgCrystalSize}cm
Efficiency: ${report.efficiency}%
Safety Score: ${report.safetyScore}%

OBSERVATIONS
------------
${report.observations.join('\n')}

Generated by ViksitVR Chemistry Lab
        `;
        
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chemistry_Lab_Report_${report.date.replace(/\//g, '-')}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Cleanup and disposal
    destroy() {
        // Clear intervals
        if (this.temperatureInterval) clearInterval(this.temperatureInterval);
        if (this.performanceMonitor) clearInterval(this.performanceMonitor);
        
        // Stop voice recognition
        if (this.recognition) this.recognition.stop();
        
        // Clean up audio context
        if (this.audioContext) this.audioContext.close();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardInput);
        
        console.log('Chemistry Lab VR instance destroyed');
    }
}

// Initialize the Chemistry Lab VR when DOM is loaded
let chemLab;
document.addEventListener('DOMContentLoaded', () => {
    chemLab = new ChemistryLabVR();
});

// Export for global access
window.ChemistryLabVR = ChemistryLabVR;
