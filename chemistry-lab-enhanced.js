// Enhanced VR Chemistry Lab - Dynamic Experiments for Class 10th & 11th
class ChemistryLab {
    constructor() {
        this.currentExperiment = 'copper-sulphate';
        this.experimentStep = 1;
        this.totalSteps = 7;
        this.isHeating = false;
        this.isStirring = false;
        this.isDragging = false;
        this.currentDraggedElement = null;
        this.experiments = this.initializeExperiments();
        this.sounds = {};
        this.effects = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupPhysics();
        this.loadExperiment(this.currentExperiment);
        this.setupSounds();
        this.setupParticleEffects();
        this.hideLoadingScreen();
    }

    initializeExperiments() {
        return {
            'copper-sulphate': {
                title: 'Copper Sulphate Crystallization',
                class: '10th',
                description: 'Prepare beautiful blue crystals of copper sulphate through controlled crystallization',
                steps: [
                    'Prepare copper sulphate solution in beaker',
                    'Heat the solution using Bunsen burner',
                    'Stir continuously to dissolve crystals completely',
                    'Create saturated solution by continued heating',
                    'Remove from heat source',
                    'Pour into crystallization dish',
                    'Observe crystal formation during cooling'
                ],
                equipment: ['beaker', 'bunsen-burner', 'stirring-rod', 'crystal-dish', 'thermometer'],
                chemicals: ['copper-sulphate', 'distilled-water'],
                safety: ['Wear safety goggles', 'Handle hot equipment carefully', 'Avoid skin contact with chemicals']
            },
            'acid-base': {
                title: 'Acid-Base Titration',
                class: '11th',
                description: 'Determine unknown concentration using standardized acid/base solutions',
                steps: [
                    'Fill burette with standard NaOH solution',
                    'Add unknown HCl solution to conical flask',
                    'Add 2-3 drops of phenolphthalein indicator',
                    'Start titration by adding NaOH dropwise',
                    'Swirl flask continuously during addition',
                    'Stop at first permanent pink color',
                    'Record burette reading and calculate concentration'
                ],
                equipment: ['burette', 'conical-flask', 'pipette', 'measuring-cylinder', 'burette-stand'],
                chemicals: ['sodium-hydroxide', 'hydrochloric-acid', 'phenolphthalein'],
                safety: ['Handle acids and bases carefully', 'Use fume hood', 'Neutralize spills immediately']
            },
            'hydrogen-gas': {
                title: 'Hydrogen Gas Evolution',
                class: '10th',
                description: 'Generate hydrogen gas through metal-acid reaction',
                steps: [
                    'Set up gas collection apparatus',
                    'Add zinc granules to conical flask',
                    'Pour dilute HCl through thistle funnel',
                    'Observe vigorous effervescence',
                    'Collect gas in inverted test tube',
                    'Test collected gas with burning splint',
                    'Observe characteristic pop sound'
                ],
                equipment: ['conical-flask', 'thistle-funnel', 'gas-jar', 'pneumatic-trough', 'test-tube'],
                chemicals: ['zinc-granules', 'hydrochloric-acid'],
                safety: ['Work in ventilated area', 'Keep flames away during collection', 'Handle acids carefully']
            },
            'soap-making': {
                title: 'Soap Making (Saponification)',
                class: '10th',
                description: 'Prepare soap through saponification reaction',
                steps: [
                    'Heat coconut oil in beaker using water bath',
                    'Add calculated amount of NaOH solution slowly',
                    'Stir mixture continuously while heating',
                    'Continue until mixture thickens (saponification)',
                    'Add salt solution to precipitate soap',
                    'Filter and wash the soap curds',
                    'Test soap with litmus paper'
                ],
                equipment: ['beaker', 'water-bath', 'stirring-rod', 'filter-paper', 'funnel'],
                chemicals: ['coconut-oil', 'sodium-hydroxide', 'sodium-chloride'],
                safety: ['Handle NaOH with extreme care', 'Use tongs for hot equipment', 'Avoid contact with skin']
            },
            'flame-test': {
                title: 'Flame Test Analysis',
                class: '11th',
                description: 'Identify metal ions based on characteristic flame colors',
                steps: [
                    'Clean platinum wire in HCl solution',
                    'Dip wire in unknown salt solution',
                    'Hold wire in non-luminous Bunsen flame',
                    'Observe characteristic flame color',
                    'Record color and identify metal ion',
                    'Repeat with different salt solutions',
                    'Compare results with standard flame colors'
                ],
                equipment: ['platinum-wire', 'bunsen-burner', 'test-tubes', 'dropper'],
                chemicals: ['metal-chlorides', 'hydrochloric-acid'],
                safety: ['Use safety goggles', 'Handle hot wire carefully', 'Work in ventilated area']
            },
            'ph-indicator': {
                title: 'Natural pH Indicators',
                class: '10th',
                description: 'Prepare and test natural indicators from plant extracts',
                steps: [
                    'Extract red cabbage juice by boiling',
                    'Filter and cool the extract',
                    'Test with known acids and bases',
                    'Record color changes observed',
                    'Prepare indicator chart',
                    'Test unknown solutions',
                    'Determine pH range using color chart'
                ],
                equipment: ['beaker', 'funnel', 'filter-paper', 'test-tubes', 'dropper'],
                chemicals: ['red-cabbage', 'various-acids', 'various-bases'],
                safety: ['Handle hot solutions carefully', 'Avoid tasting any chemicals', 'Use clean equipment']
            },
            'electrochemical': {
                title: 'Electrochemical Cell',
                class: '11th',
                description: 'Construct and study galvanic cell reactions',
                steps: [
                    'Set up zinc and copper electrodes',
                    'Prepare ZnSO₄ and CuSO₄ solutions',
                    'Connect electrodes with salt bridge',
                    'Measure cell potential with voltmeter',
                    'Observe electrode reactions',
                    'Record voltage changes over time',
                    'Identify anode and cathode reactions'
                ],
                equipment: ['electrodes', 'beakers', 'salt-bridge', 'voltmeter', 'connecting-wires'],
                chemicals: ['zinc-sulphate', 'copper-sulphate', 'potassium-chloride'],
                safety: ['Handle electrical equipment carefully', 'Avoid short circuits', 'Use insulated wires']
            },
            'organic-compound': {
                title: 'Organic Compound Detection',
                class: '11th',
                description: 'Detect presence of functional groups in organic compounds',
                steps: [
                    'Perform unsaturation test with Br₂ water',
                    'Test for alcohols using Lucas reagent',
                    'Detect aldehydes with Tollens reagent',
                    'Test for phenols using FeCl₃',
                    'Identify carboxylic acids with NaHCO₃',
                    'Perform ester test with NaOH',
                    'Record all positive and negative results'
                ],
                equipment: ['test-tubes', 'dropper', 'water-bath', 'test-tube-holder'],
                chemicals: ['bromine-water', 'lucas-reagent', 'tollens-reagent', 'ferric-chloride'],
                safety: ['Work in fume hood', 'Handle reagents carefully', 'Dispose waste properly']
            }
        };
    }

    setupEventListeners() {
        // Experiment selection
        document.querySelectorAll('.experiment-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectExperiment(card.dataset.experiment);
            });
        });

        // Responsive design listeners
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Touch events for mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    setupDragAndDrop() {
        const scene = document.querySelector('#vrScene');
        
        // Enhanced drag and drop with physics
        scene.addEventListener('mousedown', this.startDrag.bind(this));
        scene.addEventListener('mousemove', this.performDrag.bind(this));
        scene.addEventListener('mouseup', this.endDrag.bind(this));

        // VR hand interactions
        scene.addEventListener('gripdown', this.startVRGrab.bind(this));
        scene.addEventListener('gripup', this.endVRGrab.bind(this));

        // Enhanced collision detection
        scene.addEventListener('collisions', this.handleCollisions.bind(this));
    }

    setupPhysics() {
        // Initialize cannon.js physics world
        const scene = document.querySelector('#vrScene');
        
        // Add realistic physics behaviors
        this.setupRealisticInteractions();
        this.setupFluidDynamics();
        this.setupThermalEffects();
    }

    setupRealisticInteractions() {
        // Beaker to burner interaction
        this.setupBeakerBurnerInteraction();
        
        // Stirring mechanics
        this.setupStirringMechanics();
        
        // Pouring mechanics
        this.setupPouringMechanics();
        
        // Temperature effects
        this.setupTemperatureEffects();
    }

    setupBeakerBurnerInteraction() {
        const beaker = document.querySelector('#beaker');
        const bunsen = document.querySelector('#bunsen-burner');
        
        if (beaker && bunsen) {
            beaker.addEventListener('collision', (e) => {
                if (e.detail.target === bunsen) {
                    this.placeBeakerOnBurner();
                }
            });
        }
    }

    placeBeakerOnBurner() {
        const beaker = document.querySelector('#beaker-container');
        const bunsen = document.querySelector('#bunsen-container');
        
        if (beaker && bunsen) {
            // Animate beaker to perfect position on burner
            const bunsenPos = bunsen.getAttribute('position');
            const targetPos = {
                x: bunsenPos.x,
                y: bunsenPos.y + 0.4,
                z: bunsenPos.z
            };
            
            beaker.setAttribute('animation', `
                property: position; 
                to: ${targetPos.x} ${targetPos.y} ${targetPos.z}; 
                dur: 1000; 
                easing: easeInOutQuart
            `);
            
            // Add satisfying placement sound
            this.playSound('glass-clink');
            
            // Visual feedback
            this.addGlowEffect(bunsen);
            this.showTooltip('Perfect! Beaker placed on burner. Ready to heat!');
            
            // Enable heating controls
            document.getElementById('heatSolution').disabled = false;
        }
    }

    setupStirringMechanics() {
        const stirrer = document.querySelector('#stirring-rod');
        const beaker = document.querySelector('#beaker');
        
        if (stirrer && beaker) {
            stirrer.addEventListener('collision', (e) => {
                if (e.detail.target === beaker) {
                    this.startRealisticStirring();
                }
            });
        }
    }

    startRealisticStirring() {
        if (this.isStirring) return;
        
        this.isStirring = true;
        const stirrer = document.querySelector('#stirring-rod');
        const solution = document.querySelector('#solution');
        
        // Realistic stirring animation
        stirrer.setAttribute('animation__stir', `
            property: rotation; 
            from: 0 0 90; 
            to: 0 0 810; 
            dur: 3000; 
            loop: true; 
            easing: linear
        `);
        
        // Solution swirling effect
        if (solution) {
            solution.setAttribute('animation__swirl', `
                property: rotation; 
                from: 0 0 0; 
                to: 0 360 0; 
                dur: 2000; 
                loop: true; 
                easing: linear
            `);
            
            // Add ripple effect
            this.createRippleEffect(solution);
        }
        
        // Sound effects
        this.playSound('stirring-sound');
        
        // Visual feedback
        this.showTooltip('Stirring solution... Watch the motion!');
        
        // Auto-stop after realistic duration
        setTimeout(() => {
            this.stopStirring();
        }, 10000);
    }

    stopStirring() {
        this.isStirring = false;
        const stirrer = document.querySelector('#stirring-rod');
        const solution = document.querySelector('#solution');
        
        stirrer.removeAttribute('animation__stir');
        if (solution) {
            solution.removeAttribute('animation__swirl');
        }
        
        this.stopSound('stirring-sound');
        this.showTooltip('Stirring complete! Solution is well mixed.');
    }

    createRippleEffect(element) {
        // Add dynamic ripple particles
        for (let i = 0; i < 5; i++) {
            const ripple = document.createElement('a-ring');
            ripple.setAttribute('position', '0 0.1 0');
            ripple.setAttribute('radius-inner', '0.1');
            ripple.setAttribute('radius-outer', '0.2');
            ripple.setAttribute('color', '#ffffff');
            ripple.setAttribute('opacity', '0.3');
            ripple.setAttribute('animation', `
                property: scale; 
                from: 1 1 1; 
                to: 3 3 3; 
                dur: 2000; 
                delay: ${i * 400};
                easing: easeOutQuad
            `);
            ripple.setAttribute('animation__fade', `
                property: opacity; 
                from: 0.3; 
                to: 0; 
                dur: 2000; 
                delay: ${i * 400}
            `);
            
            element.appendChild(ripple);
            
            // Remove after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 2000 + (i * 400));
        }
    }

    setupPouringMechanics() {
        // Implement realistic pouring between containers
        const containers = document.querySelectorAll('.draggable');
        
        containers.forEach(container => {
            container.addEventListener('tilt', (e) => {
                if (e.detail.angle > 45) {
                    this.startPouring(container);
                }
            });
        });
    }

    startPouring(fromContainer) {
        const targetContainer = this.findNearestContainer(fromContainer);
        
        if (targetContainer) {
            this.createPouringStream(fromContainer, targetContainer);
            this.playSound('liquid-pour');
            this.showTooltip('Pouring liquid... Watch the stream!');
        }
    }

    createPouringStream(from, to) {
        // Create visual pouring effect with particles
        const stream = document.createElement('a-entity');
        stream.setAttribute('id', 'pouring-stream');
        
        // Add multiple liquid particles
        for (let i = 0; i < 20; i++) {
            const drop = document.createElement('a-sphere');
            drop.setAttribute('radius', '0.02');
            drop.setAttribute('color', '#4169E1');
            drop.setAttribute('position', `0 ${-i * 0.1} 0`);
            drop.setAttribute('animation', `
                property: position; 
                from: 0 0 0; 
                to: 0 -2 0; 
                dur: 1000; 
                delay: ${i * 50};
                easing: easeInQuad
            `);
            
            stream.appendChild(drop);
        }
        
        from.appendChild(stream);
        
        // Remove after pouring complete
        setTimeout(() => {
            if (stream.parentNode) {
                stream.parentNode.removeChild(stream);
            }
        }, 2000);
    }

    selectExperiment(experimentId) {
        // Remove active class from all cards
        document.querySelectorAll('.experiment-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to selected card
        document.querySelector(`[data-experiment="${experimentId}"]`).classList.add('active');
        
        this.currentExperiment = experimentId;
        this.loadExperiment(experimentId);
        this.resetExperimentState();
    }

    loadExperiment(experimentId) {
        const experiment = this.experiments[experimentId];
        if (!experiment) return;
        
        // Update UI with experiment details
        this.updateExperimentUI(experiment);
        
        // Configure VR scene for experiment
        this.configureVRScene(experiment);
        
        // Setup experiment-specific interactions
        this.setupExperimentInteractions(experiment);
        
        this.showTooltip(`Loaded: ${experiment.title}`);
    }

    updateExperimentUI(experiment) {
        // Update procedure steps
        const stepsContainer = document.querySelector('#procedureSteps');
        if (stepsContainer) {
            stepsContainer.innerHTML = '';
            
            experiment.steps.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.className = `step-item ${index === 0 ? 'active' : ''}`;
                stepElement.dataset.step = index + 1;
                stepElement.innerHTML = `
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <div class="step-title">${step}</div>
                        <div class="step-description">Follow this step carefully</div>
                    </div>
                `;
                stepsContainer.appendChild(stepElement);
            });
        }
        
        // Update equipment list
        this.updateEquipmentList(experiment.equipment);
        
        // Update safety information
        this.updateSafetyInfo(experiment.safety);
        
        // Update theory section
        this.updateTheorySection(experiment);
    }

    updateEquipmentList(equipment) {
        const equipmentGrid = document.querySelector('.equipment-grid');
        if (equipmentGrid) {
            equipmentGrid.innerHTML = '';
            
            const equipmentIcons = {
                'beaker': '🧪',
                'bunsen-burner': '🔥',
                'stirring-rod': '🥄',
                'crystal-dish': '🍽️',
                'thermometer': '🌡️',
                'burette': '📏',
                'conical-flask': '⚗️',
                'pipette': '💧',
                'test-tube': '🧪',
                'measuring-cylinder': '📐'
            };
            
            equipment.forEach(item => {
                const equipmentElement = document.createElement('div');
                equipmentElement.className = 'equipment-item';
                equipmentElement.dataset.equipment = item;
                equipmentElement.innerHTML = `
                    <span class="equipment-icon">${equipmentIcons[item] || '🔬'}</span>
                    <div class="equipment-name">${item.replace('-', ' ').toUpperCase()}</div>
                `;
                equipmentGrid.appendChild(equipmentElement);
            });
        }
    }

    configureVRScene(experiment) {
        // Hide all equipment first
        this.hideAllEquipment();
        
        // Show only required equipment for this experiment
        experiment.equipment.forEach(equipmentId => {
            this.showEquipment(equipmentId);
        });
        
        // Position equipment optimally for the experiment
        this.arrangeEquipment(experiment.equipment);
    }

    hideAllEquipment() {
        const allEquipment = document.querySelectorAll('.draggable, .lab-equipment');
        allEquipment.forEach(item => {
            item.setAttribute('visible', 'false');
        });
    }

    showEquipment(equipmentId) {
        const equipment = document.querySelector(`#${equipmentId}`);
        if (equipment) {
            equipment.setAttribute('visible', 'true');
            
            // Add entrance animation
            equipment.setAttribute('animation__appear', `
                property: scale; 
                from: 0 0 0; 
                to: 1 1 1; 
                dur: 800; 
                easing: easeOutBack
            `);
        }
    }

    arrangeEquipment(equipmentList) {
        // Optimal positioning based on experiment workflow
        const positions = this.getOptimalPositions(equipmentList);
        
        equipmentList.forEach((item, index) => {
            const equipment = document.querySelector(`#${item}`);
            if (equipment && positions[index]) {
                equipment.setAttribute('animation__position', `
                    property: position; 
                    to: ${positions[index].x} ${positions[index].y} ${positions[index].z}; 
                    dur: 1500; 
                    easing: easeInOutQuart
                `);
            }
        });
    }

    getOptimalPositions(equipmentList) {
        // Return optimal positions based on experiment type
        const basePositions = [
            { x: -2, y: 1.6, z: -3 },    // Primary container
            { x: 0, y: 1.2, z: -3 },     // Heat source
            { x: 2, y: 1.4, z: -3 },     // Tools
            { x: 1, y: 1.2, z: -2.5 },   // Secondary container
            { x: -1, y: 1.4, z: -2.5 },  // Measuring tools
        ];
        
        return basePositions.slice(0, equipmentList.length);
    }

    setupSounds() {
        this.sounds = {
            'bubbling-sound': document.querySelector('#bubbling-sound'),
            'glass-clink': document.querySelector('#glass-clink'),
            'stirring-sound': document.querySelector('#stirring-sound')
        };
    }

    playSound(soundId) {
        if (this.sounds[soundId]) {
            this.sounds[soundId].currentTime = 0;
            this.sounds[soundId].play().catch(e => console.log('Audio play failed:', e));
        }
    }

    stopSound(soundId) {
        if (this.sounds[soundId]) {
            this.sounds[soundId].pause();
        }
    }

    setupParticleEffects() {
        // Initialize particle systems for various effects
        this.effects = {
            steam: this.createSteamEffect(),
            bubbles: this.createBubbleEffect(),
            smoke: this.createSmokeEffect(),
            sparkles: this.createSparkleEffect()
        };
    }

    createSteamEffect() {
        // Steam particles for heating
        return {
            particles: [],
            emit: (position) => {
                for (let i = 0; i < 10; i++) {
                    const particle = document.createElement('a-sphere');
                    particle.setAttribute('radius', '0.02');
                    particle.setAttribute('color', '#ffffff');
                    particle.setAttribute('opacity', '0.6');
                    particle.setAttribute('position', position);
                    particle.setAttribute('animation', `
                        property: position; 
                        from: ${position}; 
                        to: ${position.x} ${position.y + 1} ${position.z}; 
                        dur: 3000; 
                        delay: ${i * 200};
                        easing: easeOutQuad
                    `);
                    particle.setAttribute('animation__fade', `
                        property: opacity; 
                        from: 0.6; 
                        to: 0; 
                        dur: 3000; 
                        delay: ${i * 200}
                    `);
                    
                    document.querySelector('#vrScene').appendChild(particle);
                    
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 3000 + (i * 200));
                }
            }
        };
    }

    createBubbleEffect() {
        // Bubble effect for chemical reactions
        return {
            emit: (container) => {
                const bubbleInterval = setInterval(() => {
                    if (!this.isHeating) {
                        clearInterval(bubbleInterval);
                        return;
                    }
                    
                    const bubble = document.createElement('a-sphere');
                    bubble.setAttribute('radius', '0.01');
                    bubble.setAttribute('color', '#ffffff');
                    bubble.setAttribute('opacity', '0.8');
                    
                    const startPos = container.getAttribute('position');
                    bubble.setAttribute('position', `${startPos.x} ${startPos.y} ${startPos.z}`);
                    bubble.setAttribute('animation', `
                        property: position; 
                        to: ${startPos.x + (Math.random() - 0.5) * 0.2} ${startPos.y + 0.3} ${startPos.z + (Math.random() - 0.5) * 0.2}; 
                        dur: 1000; 
                        easing: easeOutQuad
                    `);
                    bubble.setAttribute('animation__fade', `
                        property: opacity; 
                        from: 0.8; 
                        to: 0; 
                        dur: 1000
                    `);
                    
                    container.appendChild(bubble);
                    
                    setTimeout(() => {
                        if (bubble.parentNode) {
                            bubble.parentNode.removeChild(bubble);
                        }
                    }, 1000);
                }, 200);
            }
        };
    }

    // Mobile touch handling
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.lastTouch = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now()
            };
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (this.isDragging && this.currentDraggedElement) {
            this.updateDragPosition(e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    handleTouchEnd(e) {
        if (this.lastTouch && Date.now() - this.lastTouch.time < 300) {
            // Handle tap
            this.handleTap(this.lastTouch.x, this.lastTouch.y);
        }
        this.endDrag();
    }

    handleResize() {
        // Responsive layout adjustments
        const container = document.querySelector('.lab-container');
        const panel = document.querySelector('.lab-panel');
        const selector = document.querySelector('.experiment-selector');
        
        if (window.innerWidth < 768) {
            container.style.flexDirection = 'column';
            panel.style.width = '100%';
            panel.style.height = '40vh';
            selector.style.position = 'relative';
            selector.style.width = '100%';
        } else {
            container.style.flexDirection = 'row';
            panel.style.width = '350px';
            panel.style.height = 'calc(100vh - 80px)';
            selector.style.position = 'fixed';
            selector.style.width = '300px';
        }
    }

    // Utility methods
    showTooltip(message, duration = 5000) {
        let tooltip = document.getElementById('lab-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'lab-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 255, 136, 0.95);
                color: #000;
                padding: 1rem 2rem;
                border-radius: 25px;
                font-weight: bold;
                z-index: 10001;
                max-width: 80%;
                text-align: center;
                box-shadow: 0 5px 25px rgba(0, 255, 136, 0.3);
                animation: slideDown 0.3s ease-out;
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = message;
        tooltip.style.display = 'block';
        
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = setTimeout(() => {
            tooltip.style.display = 'none';
        }, duration);
    }

    addGlowEffect(element) {
        element.classList.add('glow');
        setTimeout(() => {
            element.classList.remove('glow');
        }, 3000);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 2000);
    }

    resetExperimentState() {
        this.experimentStep = 1;
        this.isHeating = false;
        this.isStirring = false;
        this.isDragging = false;
        
        // Reset all visual states
        this.resetVisualStates();
        
        // Update UI
        this.updateProgress();
        this.updateStepHighlight();
    }

    resetVisualStates() {
        // Reset all animations and effects
        document.querySelectorAll('.heating-effect, .stirring-effect, .bubbling-effect').forEach(el => {
            el.classList.remove('heating-effect', 'stirring-effect', 'bubbling-effect');
        });
        
        // Hide all crystals
        document.querySelectorAll('[id^="crystal-"]').forEach(crystal => {
            crystal.setAttribute('visible', 'false');
        });
        
        // Reset flame
        const flame = document.querySelector('#flame');
        if (flame) flame.setAttribute('visible', 'false');
    }

    updateProgress() {
        const progress = ((this.experimentStep - 1) / this.totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) {
            progressText.textContent = `Step ${this.experimentStep - 1} of ${this.totalSteps} completed (${Math.round(progress)}%)`;
        }
    }

    updateStepHighlight() {
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.remove('active', 'completed');
            if (index + 1 === this.experimentStep) {
                item.classList.add('active');
            } else if (index + 1 < this.experimentStep) {
                item.classList.add('completed');
            }
        });
    }
}

// Initialize the enhanced chemistry lab
window.addEventListener('load', () => {
    window.chemistryLab = new ChemistryLab();
});

// Export for global access
window.ChemistryLab = ChemistryLab;
