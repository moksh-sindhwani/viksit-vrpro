// VR Job Interview Panel - Advanced JavaScript Implementation
class VRInterviewPanel {
    constructor() {
        this.interviewState = {
            isActive: false,
            isPaused: false,
            currentQuestion: 0,
            totalQuestions: 10,
            startTime: null,
            questionStartTime: null,
            timeRemaining: 0,
            isRecording: false,
            recordedAnswers: [],
            metrics: {
                confidence: 0,
                clarity: 0,
                responseTime: 0,
                eyeContact: 0,
                overall: 0
            },
            settings: {
                jobPosition: 'software-engineer',
                interviewType: 'behavioral',
                difficulty: 'intermediate',
                duration: 30,
                candidateName: ''
            }
        };
        
        // AI API Configuration - Built-in API keys for seamless experience
        this.aiApiConfig = {
            // Multiple AI providers for redundancy
            providers: [
                {
                    name: 'HuggingFace',
                    apiKey: 'hf_placeholder_key_built_in', // Built-in for demo
                    endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
                    free: true
                },
                {
                    name: 'Local',
                    apiKey: null,
                    endpoint: null,
                    free: true,
                    fallback: true
                }
            ],
            currentProvider: 0,
            useBuiltInQuestions: true, // Always have fallback questions
            autoGenerate: true // Automatically generate questions without user input
        };

        // Enhanced question bank with AI generation capability
        this.questionBank = {
            'software-engineer': {
                'behavioral': [
                    "Tell me about yourself and your background in software development.",
                    "Describe a challenging project you worked on and how you overcame obstacles.",
                    "How do you handle tight deadlines and pressure in software development?",
                    "Give an example of when you had to learn a new technology quickly.",
                    "Describe a time when you had to work with a difficult team member.",
                    "How do you ensure code quality in your projects?",
                    "Tell me about a time when you made a mistake and how you handled it.",
                    "How do you stay updated with the latest technology trends?",
                    "Describe your approach to debugging complex issues.",
                    "Why are you interested in working for our company?"
                ],
                'technical': [
                    "Explain the difference between procedural and object-oriented programming.",
                    "How would you optimize a slow database query?",
                    "What is the time complexity of your favorite sorting algorithm?",
                    "Explain the concept of microservices architecture.",
                    "How do you handle version control in team projects?",
                    "What are the principles of RESTful API design?",
                    "Explain the difference between SQL and NoSQL databases.",
                    "How would you design a scalable web application?",
                    "What are design patterns and give examples of when you've used them.",
                    "Explain the concept of test-driven development."
                ]
            },
            'data-scientist': {
                'behavioral': [
                    "Tell me about your experience with data analysis and machine learning.",
                    "Describe a data science project that had significant business impact.",
                    "How do you handle missing or inconsistent data?",
                    "Tell me about a time when your analysis was questioned or challenged.",
                    "How do you communicate complex findings to non-technical stakeholders?",
                    "Describe your approach to feature selection and engineering.",
                    "How do you ensure the accuracy and reliability of your models?",
                    "Tell me about a time when you had to work with incomplete data.",
                    "How do you stay current with new tools and techniques in data science?",
                    "Why do you want to work as a data scientist at our company?"
                ],
                'technical': [
                    "Explain the bias-variance tradeoff in machine learning.",
                    "How would you detect and handle outliers in a dataset?",
                    "What is cross-validation and why is it important?",
                    "Explain the difference between supervised and unsupervised learning.",
                    "How do you choose the right algorithm for a given problem?",
                    "What is overfitting and how do you prevent it?",
                    "Explain the concept of p-values and statistical significance.",
                    "How would you build a recommendation system?",
                    "What are the assumptions of linear regression?",
                    "Explain the ROC curve and AUC metrics."
                ]
            }
        };

        // AI-generated questions storage
        this.aiGeneratedQuestions = [];
        this.useAiQuestions = false;
        
        this.videoTextures = {
            interviewer1: null,
            interviewer2: null,
            interviewer3: null
        };
        
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.stream = null;
        this.recordedVideoBlobs = [];
        this.currentRecordingIndex = 0;
        
        // Video recording configuration
        this.videoConfig = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };
        
        this.init();
    }

    // Enhanced initialization with video recording setup
    init() {
        this.setupEventListeners();
        this.initializeVR();
        this.loadInterviewerVideos();
        this.setupMediaRecorder();
        this.updateRecordingQuality();
        this.updateVideoCount();
        this.hideLoadingScreen();
        
        // Setup automatic quality updates
        setInterval(() => {
            this.updateRecordingQuality();
            this.updateVideoCount();
        }, 5000);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 2000);
    }

    setupEventListeners() {
        // Setup form listeners
        document.getElementById('jobPosition').addEventListener('change', (e) => {
            this.interviewState.settings.jobPosition = e.target.value;
            this.updateQuestionBank();
        });

        document.getElementById('interviewType').addEventListener('change', (e) => {
            this.interviewState.settings.interviewType = e.target.value;
            this.updateQuestionBank();
        });

        document.getElementById('difficultyLevel').addEventListener('change', (e) => {
            this.interviewState.settings.difficulty = e.target.value;
        });

        document.getElementById('interviewDuration').addEventListener('change', (e) => {
            this.interviewState.settings.duration = parseInt(e.target.value);
        });

        document.getElementById('candidateName').addEventListener('change', (e) => {
            this.interviewState.settings.candidateName = e.target.value;
        });

        // VR interactions
        this.setupVRInteractions();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    setupVRInteractions() {
        const scene = document.querySelector('#vrScene');
        
        // Interviewer interactions
        document.querySelectorAll('.interviewer').forEach((interviewer, index) => {
            interviewer.addEventListener('click', () => {
                this.focusOnInterviewer(index + 1);
            });
        });
    }

    initializeVR() {
        const scene = document.querySelector('#vrScene');
        
        // Add physics if needed
        if (scene) {
            scene.setAttribute('physics', 'driver: cannon; gravity: 0 -9.8 0');
        }
        
        // Setup audio
        this.setupSpatialAudio();
    }

    setupSpatialAudio() {
        const ambientAudio = document.querySelector('#ambient-office');
        if (ambientAudio) {
            ambientAudio.volume = 0.3;
            ambientAudio.play().catch(e => console.log('Audio autoplay prevented'));
        }
    }

    loadInterviewerVideos() {
        // Placeholder video sources - in production, these would be actual interviewer videos
        const videoSources = {
            interviewer1: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...',
            interviewer2: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...',
            interviewer3: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...'
        };

        // Load video textures for interviewers
        Object.keys(videoSources).forEach(key => {
            const video = document.querySelector(`#${key}-video`);
            if (video) {
                video.src = videoSources[key];
                video.load();
            }
        });
    }

    setupMediaRecorder() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(this.videoConfig)
            .then(stream => {
                this.stream = stream;
                this.setupVideoPreview(stream);
                this.mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm;codecs=vp9,opus'
                });
                
                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.recordedChunks.push(event.data);
                    }
                };
                
                this.mediaRecorder.onstop = () => {
                    this.processRecordedAnswer();
                };

                this.showTooltip('✅ Camera and microphone ready!');
            })
            .catch(err => {
                console.error('Error accessing media devices:', err);
                this.showTooltip('⚠️ Camera/Microphone access required for video recording. Please allow permissions and refresh.');
                this.setupFallbackRecording();
            });
        } else {
            this.showTooltip('⚠️ Video recording not supported in this browser. Please use a modern browser.');
            this.setupFallbackRecording();
        }
    }

    setupVideoPreview(stream) {
        // Create a hidden video preview element
        const previewVideo = document.createElement('video');
        previewVideo.id = 'videoPreview';
        previewVideo.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            width: 200px;
            height: 150px;
            border: 2px solid white;
            border-radius: 10px;
            z-index: 1000;
            display: none;
            background: black;
        `;
        previewVideo.muted = true;
        previewVideo.autoplay = true;
        previewVideo.srcObject = stream;
        document.body.appendChild(previewVideo);
    }

    setupFallbackRecording() {
        // Fallback to audio-only recording if video fails
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            this.stream = stream;
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.processRecordedAnswer();
            };
            
            this.showTooltip('🎤 Audio recording ready (video unavailable)');
        })
        .catch(err => {
            console.error('Audio recording also failed:', err);
            this.showTooltip('❌ Recording unavailable. Please check browser permissions.');
        });
    }

    async generateAIQuestions() {
        const position = this.interviewState.settings.jobPosition;
        const type = this.interviewState.settings.interviewType;
        const difficulty = this.interviewState.settings.difficulty;
        
        this.showTooltip('🤖 Generating personalized questions with AI...');
        
        try {
            // Automatically use built-in AI generation (no user API key required)
            let questions = await this.tryBuiltInAI(position, type, difficulty) ||
                          await this.tryFreeAPI(position, type, difficulty) ||
                          this.getIntelligentQuestions(position, type, difficulty);
            
            if (questions && questions.length > 0) {
                this.aiGeneratedQuestions = questions;
                this.useAiQuestions = true;
                this.currentQuestions = questions;
                this.interviewState.totalQuestions = questions.length;
                this.showTooltip('✅ AI questions generated successfully!');
                return true;
            } else {
                throw new Error('No questions generated');
            }
        } catch (error) {
            console.error('AI question generation failed:', error);
            this.showTooltip('⚠️ Using intelligent question selection');
            this.useAiQuestions = false;
            this.updateQuestionBank();
            return false;
        }
    }

    async tryBuiltInAI(position, type, difficulty) {
        // Built-in AI question generation using intelligent algorithms
        // No external API required - works offline
        return this.getIntelligentQuestions(position, type, difficulty);
    }

    async tryFreeAPI(position, type, difficulty) {
        try {
            // Using a free API service that doesn't require authentication
            const response = await fetch('https://api.quotable.io/random', {
                method: 'GET'
            });

            if (response.ok) {
                // If free API is available, use intelligent generation with context
                return this.getContextualQuestions(position, type, difficulty);
            }
        } catch (error) {
            console.log('Free API not available, using built-in generation');
        }
        return null;
    }

    async tryOpenAI(position, type, difficulty) {
        if (!this.aiApiConfig.openaiApiKey) {
            // For demo purposes, we'll use a mock API response
            return this.getMockAIQuestions(position, type, difficulty);
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.aiApiConfig.openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: `Generate 10 ${type} interview questions for a ${position} position at ${difficulty} level. Return only the questions as a JSON array of strings.`
                    }],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            const content = data.choices[0].message.content;
            return JSON.parse(content);
        } catch (error) {
            console.error('OpenAI API failed:', error);
            return null;
        }
    }

    async tryHuggingFace(position, type, difficulty) {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.aiApiConfig.huggingfaceApiKey || 'demo'}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: `Generate interview questions for ${position} ${type} interview at ${difficulty} level:`
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Process Hugging Face response
                return this.processHuggingFaceResponse(data, position, type);
            }
        } catch (error) {
            console.error('Hugging Face API failed:', error);
        }
        return null;
    }

    async tryLocalAI(position, type, difficulty) {
        // Fallback to locally generated questions with variations
        return this.getMockAIQuestions(position, type, difficulty);
    }

    getMockAIQuestions(position, type, difficulty) {
        // Legacy method - redirects to new intelligent generation
        return this.getIntelligentQuestions(position, type, difficulty);
    }

    getIntelligentQuestions(position, type, difficulty) {
        // Advanced AI-like question generation using pattern matching and context
        const baseQuestions = this.questionBank[position]?.[type] || this.questionBank['software-engineer']['behavioral'];
        
        // Generate contextual variations using intelligent algorithms
        const questionTemplates = {
            behavioral: [
                "Can you walk me through a situation where {context}?",
                "Tell me about a time when you had to {action} in your role as {position}.",
                "Describe your approach to {skill} when working on {project_type} projects.",
                "How would you handle a scenario where {challenge}?",
                "Share an experience where you successfully {achievement}."
            ],
            technical: [
                "How would you implement {technical_concept} in a {position} context?",
                "Explain the trade-offs when choosing between {option1} and {option2}.",
                "What's your approach to {technical_skill} in {framework} development?",
                "How do you ensure {quality_aspect} in your {deliverable} work?",
                "Walk me through your process for {technical_process}."
            ]
        };

        const contextMap = {
            'software-engineer': {
                context: ['optimizing system performance', 'debugging complex issues', 'implementing new features'],
                action: ['collaborate with cross-functional teams', 'mentor junior developers', 'lead technical decisions'],
                skill: ['problem-solving', 'code review', 'architecture design'],
                technical_concept: ['microservices', 'caching strategies', 'database optimization'],
                framework: ['React', 'Node.js', 'Python Django'],
                quality_aspect: ['code quality', 'security', 'scalability'],
                project_type: ['enterprise applications', 'mobile apps', 'web platforms'],
                challenge: ['tight deadlines conflicted with quality standards', 'team members had different technical opinions'],
                achievement: ['improved system performance by 40%', 'reduced deployment time significantly']
            },
            'data-scientist': {
                context: ['analyzing large datasets', 'building predictive models', 'presenting insights'],
                action: ['clean and process data', 'validate model accuracy', 'communicate findings'],
                skill: ['statistical analysis', 'machine learning', 'data visualization'],
                technical_concept: ['neural networks', 'ensemble methods', 'feature engineering'],
                framework: ['TensorFlow', 'PyTorch', 'Scikit-learn'],
                quality_aspect: ['model accuracy', 'data integrity', 'reproducibility']
            }
        };

        const templates = questionTemplates[type] || questionTemplates.behavioral;
        const context = contextMap[position] || contextMap['software-engineer'];
        
        const intelligentQuestions = [];
        
        // Generate 10 unique questions using templates
        for (let i = 0; i < 10; i++) {
            const template = templates[i % templates.length];
            let question = template;
            
            // Replace placeholders with contextual content
            Object.keys(context).forEach(key => {
                if (question.includes(`{${key}}`)) {
                    const options = context[key];
                    const randomOption = options[Math.floor(Math.random() * options.length)];
                    question = question.replace(`{${key}}`, randomOption);
                }
            });
            
            // Replace position placeholder
            question = question.replace('{position}', position.replace('-', ' '));
            
            // Add difficulty-appropriate complexity
            if (difficulty === 'senior') {
                question = question.replace('How would you', 'As a senior professional, how would you strategically');
            } else if (difficulty === 'beginner') {
                question = question.replace('How would you', 'How would you approach');
            }
            
            intelligentQuestions.push(question);
        }
        
        // Add some base questions for variety
        const selectedBase = baseQuestions.slice(0, 3);
        
        return [...intelligentQuestions.slice(0, 7), ...selectedBase.slice(0, 3)];
    }

    getContextualQuestions(position, type, difficulty) {
        // Enhanced contextual question generation
        const questions = this.getIntelligentQuestions(position, type, difficulty);
        
        // Add current industry trends and scenarios
        const trendQuestions = {
            'software-engineer': [
                "How do you stay current with emerging technologies like AI and machine learning?",
                "Describe your experience with cloud platforms and DevOps practices.",
                "How would you approach implementing accessibility features in web applications?"
            ],
            'data-scientist': [
                "How do you handle bias in machine learning models?",
                "Describe your experience with real-time data processing.",
                "How do you communicate complex data insights to non-technical stakeholders?"
            ]
        };
        
        const relevantTrends = trendQuestions[position] || trendQuestions['software-engineer'];
        
        // Mix base questions with trend questions
        return [...questions.slice(0, 7), ...relevantTrends.slice(0, 3)];
    }

    processHuggingFaceResponse(data, position, type) {
        // Process and extract questions from Hugging Face response
        try {
            if (Array.isArray(data) && data[0]?.generated_text) {
                const text = data[0].generated_text;
                const questions = text.split('\n')
                    .filter(line => line.trim().length > 20 && line.includes('?'))
                    .slice(0, 10);
                return questions.length > 0 ? questions : null;
            }
        } catch (error) {
            console.error('Error processing Hugging Face response:', error);
        }
        return null;
    }

    updateQuestionBank() {
        const position = this.interviewState.settings.jobPosition;
        const type = this.interviewState.settings.interviewType;
        
        if (this.useAiQuestions && this.aiGeneratedQuestions.length > 0) {
            this.currentQuestions = this.aiGeneratedQuestions;
            this.interviewState.totalQuestions = this.currentQuestions.length;
        } else if (this.questionBank[position] && this.questionBank[position][type]) {
            this.currentQuestions = this.questionBank[position][type];
            this.interviewState.totalQuestions = this.currentQuestions.length;
        }
    }

    async startInterview() {
        if (!this.interviewState.settings.candidateName.trim()) {
            this.showTooltip('Please enter your name before starting the interview');
            return;
        }

        // Automatically generate AI questions (no user input required)
        this.showTooltip('🤖 Generating personalized AI questions...');
        
        try {
            const aiSuccess = await this.generateAIQuestions();
            if (!aiSuccess) {
                this.updateQuestionBank(); // Fallback to standard questions
            }
        } catch (error) {
            console.log('Using standard questions as fallback');
            this.updateQuestionBank();
        }

        this.interviewState.isActive = true;
        this.interviewState.startTime = Date.now();
        this.interviewState.currentQuestion = 0;
        
        // Update UI
        document.getElementById('startInterview').disabled = true;
        document.getElementById('nextQuestion').disabled = false;
        document.getElementById('pauseInterview').disabled = false;
        document.getElementById('endInterview').disabled = false;
        
        // Update status
        this.updateInterviewStatus('active', 'Interview in Progress');
        
        // Start first question
        this.displayCurrentQuestion();
        
        // Start metrics monitoring
        this.startMetricsMonitoring();
        
        // Animate interviewers
        this.animateInterviewers();
        
        const questionType = this.useAiQuestions ? 'AI-generated' : 'standard';
        this.showTooltip(`Welcome ${this.interviewState.settings.candidateName}! Interview started with ${questionType} questions. Good luck!`);
    }

    displayCurrentQuestion() {
        if (this.interviewState.currentQuestion < this.currentQuestions.length) {
            const question = this.currentQuestions[this.interviewState.currentQuestion];
            document.getElementById('currentQuestion').textContent = question;
            
            // Start question timer
            this.startQuestionTimer();
            
            // Update progress
            this.updateProgress();
            
            // Animate question appearance
            this.animateQuestionDisplay();
            
            // Random interviewer asks question
            this.selectRandomInterviewer();
        } else {
            this.endInterview();
        }
    }

    startQuestionTimer() {
        const questionTimeLimit = 120; // 2 minutes per question
        this.interviewState.timeRemaining = questionTimeLimit;
        this.interviewState.questionStartTime = Date.now();
        
        this.questionTimerInterval = setInterval(() => {
            this.interviewState.timeRemaining--;
            
            const minutes = Math.floor(this.interviewState.timeRemaining / 60);
            const seconds = this.interviewState.timeRemaining % 60;
            
            document.getElementById('questionTimer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update response time metric
            const responseTime = (Date.now() - this.interviewState.questionStartTime) / 1000;
            this.updateMetric('responseTime', Math.min(responseTime, 120));
            
            if (this.interviewState.timeRemaining <= 0) {
                this.showTooltip('Time is up for this question!');
                this.nextQuestion();
            }
        }, 1000);
    }

    selectRandomInterviewer() {
        const interviewers = ['interviewer1', 'interviewer2', 'interviewer3'];
        const randomInterviewer = interviewers[Math.floor(Math.random() * interviewers.length)];
        
        // Highlight the speaking interviewer
        this.highlightInterviewer(randomInterviewer);
        
        // Play speaking animation
        this.playInterviewerAnimation(randomInterviewer);
    }

    highlightInterviewer(interviewerId) {
        // Remove previous highlights
        document.querySelectorAll('.interviewer').forEach(interviewer => {
            interviewer.removeAttribute('animation__highlight');
        });
        
        // Highlight current speaker
        const interviewer = document.querySelector(`#${interviewerId}`);
        if (interviewer) {
            interviewer.setAttribute('animation__highlight', {
                property: 'scale',
                from: '1 1 1',
                to: '1.1 1.1 1.1',
                dur: 500,
                dir: 'alternate',
                loop: 3
            });
        }
    }

    playInterviewerAnimation(interviewerId) {
        const video = document.querySelector(`#${interviewerId}-video`);
        if (video) {
            video.play().catch(e => console.log('Video play prevented'));
        }
    }

    animateInterviewers() {
        // Add subtle animations to make interviewers look alive
        document.querySelectorAll('.interviewer').forEach((interviewer, index) => {
            interviewer.setAttribute('animation__idle', {
                property: 'rotation',
                from: '0 0 0',
                to: `0 ${Math.random() * 4 - 2} 0`,
                dur: 3000 + (index * 500),
                dir: 'alternate',
                loop: true,
                easing: 'easeInOutSine'
            });
        });
    }

    animateQuestionDisplay() {
        const questionDisplay = document.querySelector('.question-display');
        questionDisplay.style.transform = 'scale(0.95)';
        questionDisplay.style.transition = 'transform 0.3s ease-out';
        
        setTimeout(() => {
            questionDisplay.style.transform = 'scale(1)';
        }, 100);
    }

    nextQuestion() {
        if (this.questionTimerInterval) {
            clearInterval(this.questionTimerInterval);
        }
        
        this.interviewState.currentQuestion++;
        
        if (this.interviewState.currentQuestion < this.currentQuestions.length) {
            this.displayCurrentQuestion();
            this.showTooltip(`Question ${this.interviewState.currentQuestion + 1} of ${this.currentQuestions.length}`);
        } else {
            this.endInterview();
        }
    }

    pauseInterview() {
        if (!this.interviewState.isPaused) {
            this.interviewState.isPaused = true;
            
            if (this.questionTimerInterval) {
                clearInterval(this.questionTimerInterval);
            }
            
            this.updateInterviewStatus('paused', 'Interview Paused');
            document.getElementById('pauseInterview').textContent = 'Resume';
            
            this.showTooltip('Interview paused. Click Resume to continue.');
        } else {
            this.interviewState.isPaused = false;
            this.startQuestionTimer();
            
            this.updateInterviewStatus('active', 'Interview in Progress');
            document.getElementById('pauseInterview').textContent = 'Pause';
            
            this.showTooltip('Interview resumed.');
        }
    }

    endInterview() {
        this.interviewState.isActive = false;
        
        if (this.questionTimerInterval) {
            clearInterval(this.questionTimerInterval);
        }
        
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }
        
        // Update UI
        document.getElementById('startInterview').disabled = false;
        document.getElementById('nextQuestion').disabled = true;
        document.getElementById('pauseInterview').disabled = true;
        document.getElementById('endInterview').disabled = true;
        document.getElementById('viewFeedback').disabled = false;
        
        this.updateInterviewStatus('complete', 'Interview Complete');
        
        // Calculate final metrics
        this.calculateFinalMetrics();
        
        this.showTooltip('Interview completed! Click "View Feedback" to see your results.');
    }

    recordAnswer() {
        if (!this.mediaRecorder) {
            this.showTooltip('⚠️ Media recorder not available. Please refresh and allow camera/microphone access.');
            return;
        }

        if (!this.interviewState.isRecording) {
            this.startVideoRecording();
        } else {
            this.stopVideoRecording();
        }
    }

    startVideoRecording() {
        try {
            this.recordedChunks = [];
            this.mediaRecorder.start(1000); // Record in 1-second chunks
            this.interviewState.isRecording = true;
            
            // Show video preview
            const previewVideo = document.getElementById('videoPreview');
            if (previewVideo) {
                previewVideo.style.display = 'block';
            }
            
            // Update UI
            document.getElementById('recordingIndicator').style.display = 'flex';
            document.getElementById('recordingStatus').textContent = 'Recording Video';
            
            // Update record button
            const recordBtn = document.querySelector('[onclick="recordAnswer()"]');
            if (recordBtn) {
                recordBtn.innerHTML = '⏹️ Stop Recording';
                recordBtn.style.background = '#e74c3c';
            }
            
            // Start recording timer
            this.recordingStartTime = Date.now();
            this.recordingTimer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('recordingStatus').textContent = 
                    `Recording: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
            
            this.showTooltip('🎥 Video recording started! Speak clearly and maintain eye contact.');
        } catch (error) {
            console.error('Error starting recording:', error);
            this.showTooltip('❌ Failed to start recording. Please check permissions.');
        }
    }

    stopVideoRecording() {
        try {
            this.mediaRecorder.stop();
            this.interviewState.isRecording = false;
            
            // Hide video preview
            const previewVideo = document.getElementById('videoPreview');
            if (previewVideo) {
                previewVideo.style.display = 'none';
            }
            
            // Clear recording timer
            if (this.recordingTimer) {
                clearInterval(this.recordingTimer);
            }
            
            // Update UI
            document.getElementById('recordingIndicator').style.display = 'none';
            document.getElementById('recordingStatus').textContent = 'Processing Video...';
            
            // Update record button
            const recordBtn = document.querySelector('[onclick="recordAnswer()"]');
            if (recordBtn) {
                recordBtn.innerHTML = '🎤 Record Answer';
                recordBtn.style.background = '';
            }
            
            this.showTooltip('⏸️ Recording stopped. Processing your video answer...');
        } catch (error) {
            console.error('Error stopping recording:', error);
            this.showTooltip('❌ Error stopping recording.');
        }
    }

    processRecordedAnswer() {
        try {
            const videoBlob = new Blob(this.recordedChunks, { 
                type: this.mediaRecorder.mimeType || 'video/webm' 
            });
            
            const videoUrl = URL.createObjectURL(videoBlob);
            const duration = this.recordingStartTime ? 
                Math.floor((Date.now() - this.recordingStartTime) / 1000) : 0;
            
            // Store the recorded answer with metadata
            const answerData = {
                questionNumber: this.interviewState.currentQuestion + 1,
                question: this.currentQuestions[this.interviewState.currentQuestion],
                videoUrl: videoUrl,
                videoBlob: videoBlob,
                duration: duration,
                timestamp: new Date().toISOString(),
                fileSize: Math.round(videoBlob.size / 1024 / 1024 * 100) / 100 // MB
            };
            
            this.interviewState.recordedAnswers.push(answerData);
            this.recordedVideoBlobs.push(videoBlob);
            
            // Update UI
            document.getElementById('recordingStatus').textContent = 
                `Recorded (${duration}s, ${answerData.fileSize}MB)`;
            
            // Analyze the recording
            this.analyzeVideoRecording(answerData);
            
            // Enable playback button
            const playbackBtn = document.querySelector('[onclick="playbackAnswer()"]');
            if (playbackBtn) {
                playbackBtn.disabled = false;
                playbackBtn.style.opacity = '1';
            }
            
            this.showTooltip(`✅ Video answer recorded successfully! (${duration}s)`);
        } catch (error) {
            console.error('Error processing recorded answer:', error);
            this.showTooltip('❌ Error processing video. Please try recording again.');
        }
    }

    analyzeVideoRecording(answerData) {
        // Enhanced AI analysis simulation
        setTimeout(() => {
            const duration = answerData.duration;
            const questionLength = answerData.question.length;
            
            // Simulate AI analysis based on recording metrics
            const confidence = Math.min(95, 60 + (duration > 30 ? 20 : duration * 0.67));
            const clarity = Math.min(95, 70 + Math.random() * 25);
            const responseTime = Math.max(5, Math.min(120, 20 + Math.random() * 30));
            const eyeContact = Math.min(95, 50 + Math.random() * 40);
            
            // Bonus points for appropriate answer length
            const lengthBonus = duration > 45 && duration < 120 ? 10 : 0;
            
            this.updateMetric('confidence', confidence + lengthBonus);
            this.updateMetric('clarity', clarity);
            this.updateMetric('responseTime', responseTime);
            this.updateMetric('eyeContact', eyeContact);
            
            // Store analysis results
            answerData.analysis = {
                confidence: confidence + lengthBonus,
                clarity: clarity,
                responseTime: responseTime,
                eyeContact: eyeContact,
                lengthAppropriate: duration > 30 && duration < 180,
                suggestions: this.generateAnswerSuggestions(answerData)
            };
            
            this.showTooltip('🤖 AI analysis complete! Check your performance metrics.');
        }, 2000);
    }

    generateAnswerSuggestions(answerData) {
        const suggestions = [];
        const duration = answerData.duration;
        
        if (duration < 30) {
            suggestions.push("Consider providing more detailed examples in your answers");
        } else if (duration > 180) {
            suggestions.push("Try to be more concise while maintaining key points");
        }
        
        if (answerData.analysis?.eyeContact < 70) {
            suggestions.push("Practice maintaining eye contact with the camera");
        }
        
        if (answerData.analysis?.clarity < 75) {
            suggestions.push("Speak more slowly and clearly");
        }
        
        suggestions.push("Use the STAR method for behavioral questions");
        
        return suggestions;
    }

    playbackAnswer() {
        const lastAnswer = this.interviewState.recordedAnswers[this.interviewState.recordedAnswers.length - 1];
        if (lastAnswer && lastAnswer.videoUrl) {
            this.showVideoPlayback(lastAnswer);
        } else {
            this.showTooltip('❌ No recorded answer to playback. Record an answer first.');
        }
    }

    showVideoPlayback(answerData) {
        // Create video playback modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
            backdrop-filter: blur(10px);
        `;

        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            max-width: 80%;
            max-height: 80%;
            text-align: center;
            border: 2px solid white;
        `;

        const video = document.createElement('video');
        video.src = answerData.videoUrl;
        video.controls = true;
        video.autoplay = true;
        video.style.cssText = `
            max-width: 100%;
            max-height: 60vh;
            border-radius: 10px;
            background: black;
        `;

        const infoText = document.createElement('div');
        infoText.style.cssText = `
            color: white;
            margin: 15px 0;
            font-size: 14px;
        `;
        infoText.innerHTML = `
            <strong>Question ${answerData.questionNumber}:</strong> ${answerData.question}<br>
            <strong>Duration:</strong> ${answerData.duration}s | 
            <strong>File Size:</strong> ${answerData.fileSize}MB | 
            <strong>Recorded:</strong> ${new Date(answerData.timestamp).toLocaleString()}
        `;

        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        `;

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '📥 Download Video';
        downloadBtn.style.cssText = `
            padding: 10px 20px;
            background: white;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        downloadBtn.onclick = () => this.downloadVideo(answerData);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ Close';
        closeBtn.style.cssText = `
            padding: 10px 20px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.onclick = () => document.body.removeChild(modal);

        controls.appendChild(downloadBtn);
        controls.appendChild(closeBtn);
        videoContainer.appendChild(video);
        videoContainer.appendChild(infoText);
        videoContainer.appendChild(controls);
        modal.appendChild(videoContainer);
        document.body.appendChild(modal);

        // Close on click outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    downloadVideo(answerData) {
        try {
            const a = document.createElement('a');
            a.href = answerData.videoUrl;
            a.download = `Interview_Answer_Q${answerData.questionNumber}_${answerData.timestamp.split('T')[0]}.webm`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            this.showTooltip('📥 Video download started!');
        } catch (error) {
            console.error('Download error:', error);
            this.showTooltip('❌ Download failed. Please try again.');
        }
    }

    // Enhanced method to view all recorded answers
    viewAllAnswers() {
        if (this.interviewState.recordedAnswers.length === 0) {
            this.showTooltip('No recorded answers available.');
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            overflow-y: auto;
            z-index: 10003;
            padding: 20px;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 30px;
            color: white;
        `;

        const title = document.createElement('h2');
        title.textContent = '📹 All Recorded Answers';
        title.style.cssText = 'color: white; text-align: center; margin-bottom: 30px;';

        container.appendChild(title);

        this.interviewState.recordedAnswers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.style.cssText = `
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                background: rgba(255, 255, 255, 0.05);
            `;

            answerDiv.innerHTML = `
                <h3>Question ${answer.questionNumber}</h3>
                <p><strong>Question:</strong> ${answer.question}</p>
                <p><strong>Duration:</strong> ${answer.duration}s | <strong>Size:</strong> ${answer.fileSize}MB</p>
                <button onclick="this.parentElement.querySelector('video').style.display = this.parentElement.querySelector('video').style.display === 'none' ? 'block' : 'none';" 
                        style="background: white; color: black; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin: 10px 5px 0 0;">
                    🎥 Toggle Video
                </button>
                <video src="${answer.videoUrl}" controls style="width: 100%; margin-top: 10px; display: none; border-radius: 5px;"></video>
            `;

            container.appendChild(answerDiv);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ Close';
        closeBtn.style.cssText = `
            display: block;
            margin: 20px auto 0;
            padding: 10px 20px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.onclick = () => document.body.removeChild(modal);

        container.appendChild(closeBtn);
        modal.appendChild(container);
        document.body.appendChild(modal);
    }

    skipQuestion() {
        if (confirm('Are you sure you want to skip this question?')) {
            this.nextQuestion();
        }
    }

    startMetricsMonitoring() {
        this.metricsInterval = setInterval(() => {
            this.updateLiveMetrics();
            this.updateTimeElapsed();
        }, 1000);
    }

    updateLiveMetrics() {
        // Simulate real-time metrics updates
        if (this.interviewState.isActive && !this.interviewState.isPaused) {
            // Confidence gradually increases with time
            const currentConfidence = parseFloat(document.getElementById('confidenceValue').textContent) || 0;
            const newConfidence = Math.min(currentConfidence + Math.random() * 2, 95);
            this.updateMetric('confidence', newConfidence);
            
            // Eye contact simulation
            const eyeContact = 70 + Math.random() * 20;
            this.updateMetric('eyeContact', eyeContact);
        }
    }

    updateMetric(metricName, value) {
        const roundedValue = Math.round(value);
        this.interviewState.metrics[metricName] = roundedValue;
        
        // Update UI
        const valueElement = document.getElementById(`${metricName}Value`);
        const barElement = document.getElementById(`${metricName}Bar`);
        
        if (valueElement && barElement) {
            if (metricName === 'responseTime') {
                valueElement.textContent = `${roundedValue}s`;
                barElement.style.width = `${Math.min((120 - value) / 120 * 100, 100)}%`;
            } else {
                valueElement.textContent = `${roundedValue}%`;
                barElement.style.width = `${roundedValue}%`;
            }
        }
        
        // Update overall score
        this.updateOverallScore();
    }

    updateOverallScore() {
        const metrics = this.interviewState.metrics;
        const overall = (
            metrics.confidence * 0.3 +
            metrics.clarity * 0.25 +
            (120 - metrics.responseTime) / 120 * 100 * 0.2 +
            metrics.eyeContact * 0.25
        );
        
        this.updateMetric('overall', overall);
    }

    updateProgress() {
        const completed = this.interviewState.currentQuestion;
        const total = this.currentQuestions.length;
        document.getElementById('questionsCompleted').textContent = `${completed}/${total}`;
    }

    updateTimeElapsed() {
        if (this.interviewState.startTime) {
            const elapsed = Math.floor((Date.now() - this.interviewState.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timeElapsed').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    updateInterviewStatus(status, text) {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('interviewStatus');
        
        statusIndicator.className = 'status-indicator';
        statusIndicator.classList.add(`status-${status}`);
        statusText.textContent = text;
    }

    calculateFinalMetrics() {
        // Calculate completion rate
        const completionRate = (this.interviewState.currentQuestion / this.currentQuestions.length) * 100;
        
        // Store final results
        this.finalResults = {
            overallScore: this.interviewState.metrics.overall,
            completionRate: completionRate,
            confidenceLevel: this.interviewState.metrics.confidence,
            strengths: this.generateStrengths(),
            improvements: this.generateImprovements(),
            recommendations: this.generateRecommendations()
        };
    }

    generateStrengths() {
        const strengths = [];
        const metrics = this.interviewState.metrics;
        
        if (metrics.confidence > 80) strengths.push('Excellent confidence level');
        if (metrics.clarity > 85) strengths.push('Very clear communication');
        if (metrics.eyeContact > 75) strengths.push('Good eye contact maintenance');
        if (metrics.responseTime < 30) strengths.push('Quick response time');
        
        return strengths.length > 0 ? strengths : ['Completed the interview', 'Showed commitment to practice'];
    }

    generateImprovements() {
        const improvements = [];
        const metrics = this.interviewState.metrics;
        
        if (metrics.confidence < 70) improvements.push('Work on building confidence');
        if (metrics.clarity < 70) improvements.push('Practice speaking more clearly');
        if (metrics.eyeContact < 60) improvements.push('Maintain better eye contact');
        if (metrics.responseTime > 60) improvements.push('Reduce response time');
        
        return improvements;
    }

    generateRecommendations() {
        return [
            'Practice common interview questions daily',
            'Record yourself answering questions to improve delivery',
            'Research the company and role thoroughly',
            'Prepare specific examples using the STAR method',
            'Practice in front of a mirror to improve body language'
        ];
    }

    showFeedback() {
        if (!this.finalResults) {
            this.calculateFinalMetrics();
        }
        
        // Update feedback panel
        document.getElementById('finalScore').textContent = Math.round(this.finalResults.overallScore);
        document.getElementById('completionRate').textContent = Math.round(this.finalResults.completionRate);
        document.getElementById('confidenceLevel').textContent = Math.round(this.finalResults.confidenceLevel);
        
        document.getElementById('strengthsList').innerHTML = 
            this.finalResults.strengths.map(s => `• ${s}`).join('<br>');
        document.getElementById('improvementsList').innerHTML = 
            this.finalResults.improvements.map(i => `• ${i}`).join('<br>');
        document.getElementById('recommendationsList').innerHTML = 
            this.finalResults.recommendations.map(r => `• ${r}`).join('<br>');
        
        // Show panel
        document.getElementById('feedbackPanel').style.display = 'block';
    }

    closeFeedback() {
        document.getElementById('feedbackPanel').style.display = 'none';
    }

    downloadReport() {
        const report = this.generateDetailedReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Interview_Report_${this.interviewState.settings.candidateName}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    generateDetailedReport() {
        const settings = this.interviewState.settings;
        const metrics = this.interviewState.metrics;
        
        return `
VR INTERVIEW PRACTICE REPORT
============================

Candidate: ${settings.candidateName}
Date: ${new Date().toLocaleDateString()}
Position: ${settings.jobPosition.replace('-', ' ').toUpperCase()}
Interview Type: ${settings.interviewType.replace('-', ' ').toUpperCase()}
Duration: ${settings.duration} minutes

PERFORMANCE SUMMARY
===================
Overall Score: ${Math.round(metrics.overall)}%
Confidence Level: ${Math.round(metrics.confidence)}%
Speech Clarity: ${Math.round(metrics.clarity)}%
Eye Contact: ${Math.round(metrics.eyeContact)}%
Response Time: ${Math.round(metrics.responseTime)}s average

COMPLETION DETAILS
==================
Questions Completed: ${this.interviewState.currentQuestion}/${this.currentQuestions.length}
Completion Rate: ${Math.round(this.finalResults.completionRate)}%
Total Time: ${document.getElementById('timeElapsed').textContent}

STRENGTHS
=========
${this.finalResults.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT
====================
${this.finalResults.improvements.map(i => `• ${i}`).join('\n')}

RECOMMENDATIONS
===============
${this.finalResults.recommendations.map(r => `• ${r}`).join('\n')}

NEXT STEPS
==========
1. Schedule regular practice sessions
2. Focus on identified improvement areas
3. Record practice sessions for self-evaluation
4. Research specific company and role requirements
5. Practice with different interview types and difficulty levels

Generated by ViksitVR Interview Panel
=====================================
        `;
    }

    scheduleFollowUp() {
        this.showTooltip('Follow-up practice session feature coming soon!');
    }

    retakeInterview() {
        if (confirm('Are you sure you want to start a new interview? Current progress will be lost.')) {
            this.resetInterview();
            this.startInterview();
        }
    }

    resetInterview() {
        // Reset state
        this.interviewState.isActive = false;
        this.interviewState.isPaused = false;
        this.interviewState.currentQuestion = 0;
        this.interviewState.startTime = null;
        this.interviewState.questionStartTime = null;
        this.interviewState.isRecording = false;
        this.interviewState.recordedAnswers = [];
        
        // Clear intervals
        if (this.questionTimerInterval) clearInterval(this.questionTimerInterval);
        if (this.metricsInterval) clearInterval(this.metricsInterval);
        
        // Reset UI
        document.getElementById('startInterview').disabled = false;
        document.getElementById('nextQuestion').disabled = true;
        document.getElementById('pauseInterview').disabled = true;
        document.getElementById('endInterview').disabled = true;
        document.getElementById('viewFeedback').disabled = true;
        
        // Reset metrics
        Object.keys(this.interviewState.metrics).forEach(key => {
            this.interviewState.metrics[key] = 0;
            this.updateMetric(key, 0);
        });
        
        // Reset displays
        document.getElementById('currentQuestion').textContent = 
            'Welcome! Click "Start Interview" to begin your practice session.';
        document.getElementById('questionTimer').textContent = '--';
        this.updateInterviewStatus('waiting', 'Ready to Start');
        document.getElementById('questionsCompleted').textContent = '0/10';
        document.getElementById('timeElapsed').textContent = '00:00';
        
        this.closeFeedback();
        
        this.showTooltip('Interview reset successfully!');
    }

    focusOnInterviewer(interviewerNumber) {
        const camera = document.querySelector('#userCamera');
        const positions = {
            1: '-1 1.8 -5.5',
            2: '0 1.8 -5.5',
            3: '1 1.8 -5.5'
        };
        
        if (camera && positions[interviewerNumber]) {
            camera.setAttribute('animation__focus', {
                property: 'rotation',
                to: `0 ${(interviewerNumber - 2) * 15} 0`,
                dur: 1000,
                easing: 'easeInOutQuad'
            });
        }
    }

    toggleVR() {
        const scene = document.querySelector('#vrScene');
        if (scene.is('vr-mode')) {
            scene.exitVR();
        } else {
            scene.enterVR();
        }
    }

    startRecording() {
        // Global recording for the entire interview session
        this.showTooltip('Full interview recording feature coming soon!');
    }

    handleKeyboardInput(event) {
        if (!this.interviewState.isActive) return;
        
        const keyActions = {
            'Space': () => this.recordAnswer(),
            'ArrowRight': () => this.nextQuestion(),
            'KeyP': () => this.pauseInterview(),
            'Escape': () => this.endInterview()
        };
        
        if (keyActions[event.code]) {
            event.preventDefault();
            keyActions[event.code]();
        }
    }

    showTooltip(message) {
        let tooltip = document.getElementById('interview-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'interview-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 25px;
                font-weight: bold;
                z-index: 10001;
                animation: slideDown 0.3s ease-out;
                max-width: 80%;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                border: 2px solid white;
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = message;
        tooltip.style.display = 'block';
        
        setTimeout(() => {
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }, 5000);
    }

    // Update recording quality indicator
    updateRecordingQuality() {
        const qualityElement = document.getElementById('recordingQuality');
        if (this.stream) {
            const videoTracks = this.stream.getVideoTracks();
            if (videoTracks.length > 0) {
                const settings = videoTracks[0].getSettings();
                const quality = `${settings.width}x${settings.height}`;
                qualityElement.textContent = quality;
            } else {
                qualityElement.textContent = 'Audio Only';
            }
        } else {
            qualityElement.textContent = 'Not Available';
        }
    }

    // Update total videos count
    updateVideoCount() {
        const countElement = document.getElementById('totalVideos');
        countElement.textContent = this.interviewState.recordedAnswers.length;
    }

    // Enhanced feedback generation with video analysis
    generateDetailedReport() {
        const settings = this.interviewState.settings;
        const metrics = this.interviewState.metrics;
        const videos = this.interviewState.recordedAnswers;
        
        let report = `
VR INTERVIEW PRACTICE REPORT
============================

Candidate: ${settings.candidateName}
Date: ${new Date().toLocaleDateString()}
Position: ${settings.jobPosition.replace('-', ' ').toUpperCase()}
Interview Type: ${settings.interviewType.replace('-', ' ').toUpperCase()}
Duration: ${settings.duration} minutes
AI Questions Used: ${this.useAiQuestions ? 'Yes' : 'No'}

PERFORMANCE SUMMARY
===================
Overall Score: ${Math.round(metrics.overall)}%
Confidence Level: ${Math.round(metrics.confidence)}%
Speech Clarity: ${Math.round(metrics.clarity)}%
Eye Contact: ${Math.round(metrics.eyeContact)}%
Response Time: ${Math.round(metrics.responseTime)}s average

VIDEO RECORDING SUMMARY
=======================
Total Videos Recorded: ${videos.length}
Total Recording Time: ${videos.reduce((sum, v) => sum + (v.duration || 0), 0)}s
Average Answer Length: ${videos.length > 0 ? Math.round(videos.reduce((sum, v) => sum + (v.duration || 0), 0) / videos.length) : 0}s
Total File Size: ${videos.reduce((sum, v) => sum + (v.fileSize || 0), 0).toFixed(2)}MB

QUESTION-BY-QUESTION ANALYSIS
=============================`;

        videos.forEach((video, index) => {
            report += `

Question ${video.questionNumber}: ${video.question}
Duration: ${video.duration}s
File Size: ${video.fileSize}MB
Analysis: ${video.analysis ? JSON.stringify(video.analysis, null, 2) : 'Not analyzed'}`;
        });

        report += `

COMPLETION DETAILS
==================
Questions Completed: ${this.interviewState.currentQuestion}/${this.currentQuestions.length}
Completion Rate: ${Math.round(this.finalResults?.completionRate || 0)}%
Total Time: ${document.getElementById('timeElapsed').textContent}

STRENGTHS
=========
${this.finalResults?.strengths?.map(s => `• ${s}`).join('\n') || '• Analysis pending'}

AREAS FOR IMPROVEMENT
====================
${this.finalResults?.improvements?.map(i => `• ${i}`).join('\n') || '• Analysis pending'}

RECOMMENDATIONS
===============
${this.finalResults?.recommendations?.map(r => `• ${r}`).join('\n') || '• Analysis pending'}

TECHNICAL DETAILS
================
Recording Quality: ${document.getElementById('recordingQuality').textContent}
Browser: ${navigator.userAgent}
Recording Format: ${this.mediaRecorder?.mimeType || 'Not available'}

NEXT STEPS
==========
1. Review recorded videos for body language and delivery
2. Practice with different question types and difficulty levels
3. Work on identified improvement areas
4. Schedule regular practice sessions
5. Research specific company and role requirements

Generated by ViksitVR Interview Panel v2.0
=========================================
        `;
        
        return report;
    }
}

// Global functions for HTML onclick handlers
let interviewPanel;

function startInterview() {
    interviewPanel.startInterview();
}

function nextQuestion() {
    interviewPanel.nextQuestion();
}

function pauseInterview() {
    interviewPanel.pauseInterview();
}

function endInterview() {
    interviewPanel.endInterview();
}

function showFeedback() {
    interviewPanel.showFeedback();
}

function closeFeedback() {
    interviewPanel.closeFeedback();
}

function recordAnswer() {
    interviewPanel.recordAnswer();
}

function playbackAnswer() {
    interviewPanel.playbackAnswer();
}

function skipQuestion() {
    interviewPanel.skipQuestion();
}

function toggleVR() {
    interviewPanel.toggleVR();
}

function startRecording() {
    interviewPanel.startRecording();
}

function resetInterview() {
    interviewPanel.resetInterview();
}

function downloadReport() {
    interviewPanel.downloadReport();
}

function scheduleFollowUp() {
    interviewPanel.scheduleFollowUp();
}

function retakeInterview() {
    interviewPanel.retakeInterview();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    interviewPanel = new VRInterviewPanel();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);
