// System UI Controller
class SystemUI {
  constructor() {
    this.systemUI = document.getElementById('system-ui');
    this.bootSequence = document.getElementById('system-boot');
    this.currentEra = document.getElementById('current-era');
    this.energyLevels = {
      storm: document.getElementById('storm-energy-level'),
      void: document.getElementById('void-energy-level')
    };
    
    // Add system OS identifier
    const topLeft = document.querySelector('.system-readout.top-left');
    const osIdentifier = document.createElement('div');
    osIdentifier.className = 'os-identifier';
    osIdentifier.innerHTML = `
      <span class="os-name">StormTechOS</span>
      <span class="os-version">v1.1.0.8</span>
      <span class="os-status">[ONLINE]</span>
      <span class="os-build">build:${this.generateBuildId()}</span>
    `;
    topLeft.insertBefore(osIdentifier, topLeft.firstChild);
    
    // Set initial planet name
    document.getElementById('planet-name').textContent = 'The Shattered World';
    
    this.eraData = {
      'Ancients Era': { temp: '40°C', hostility: 'Low', storm: 20, void: 80, water: 'High', biome: 'High' },
      'Shattering Era': { temp: '65°C', hostility: 'Critical', storm: 100, void: 100, water: 'Low', biome: 'Low' },
      'Era of Ashes': { temp: '55°C', hostility: 'High', storm: 40, void: 60, water: 'Low', biome: 'Low' },
      'Forgotten Era': { temp: '45°C', hostility: 'Medium', storm: 30, void: 70, water: 'Low', biome: 'Low' },
      'Modern Era': { temp: '58°C', hostility: 'High', storm: 65, void: 35, water: 'Low', biome: 'Low' },
      'Reignition Era': { temp: '75°C', hostility: 'Critical', storm: 90, void: 85, water: 'Low', biome: 'Low' },
      'Ascension Era': { temp: '48°C', hostility: 'Medium', storm: 50, void: 40, water: 'Low', biome: 'Low' },
      'Reflections Era': { temp: '52°C', hostility: 'Low', storm: 30, void: 30, water: 'Low', biome: 'Low' },
      'Renewal Era': { temp: '43°C', hostility: 'Low', storm: 20, void: 20, water: 'Medium', biome: 'Medium' }
    };

    this.terminalContent = document.getElementById('terminal-content');
    this.terminalMessages = [];
    this.messageCycleInterval = null;
    this.currentMessageIndex = 0;
    this.scrambleChars = '!<>-_\\/[]{}—=+*^?#@&$ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.scrambleDuration = 1000; // Duration of scramble effect in ms
    this.scrambleInterval = 50;   // Interval between scramble updates in ms
    this.currentScramble = null;  // Current scramble animation frame
    
    // Terminal message templates for each era
    this.eraMessages = {
      'Ancients Era': [
        { type: 'scan', text: 'SCANNING: Ancient structures detected beneath surface...' },
        { type: 'analysis', text: 'ANALYSIS: Advanced technology signatures found in ruins...' },
        { type: 'warning', text: 'WARNING: Temporal anomalies detected in core samples...' },
        { type: 'notice', text: 'NOTICE: High concentration of storm energy in ancient artifacts...' }
      ],
      'Shattering Era': [
        { type: 'warning', text: 'CRITICAL: Massive energy surge detected in historical records...' },
        { type: 'warning', text: 'WARNING: Catastrophic environmental changes logged...' },
        { type: 'analysis', text: 'ALERT: Civilization collapse patterns identified...' },
        { type: 'notice', text: 'NOTICE: First signs of void energy manifestation...' }
      ],
      'Era of Ashes': [
        { type: 'scan', text: 'SCANNING: Surface shows signs of extreme heat damage...' },
        { type: 'analysis', text: 'ANALYSIS: Storm energy patterns becoming more chaotic...' },
        { type: 'warning', text: 'WARNING: Void energy levels fluctuating dangerously...' },
        { type: 'notice', text: 'NOTICE: First signs of adaptation in local flora...' }
      ],
      'Forgotten Era': [
        { type: 'scan', text: 'SCANNING: Ancient knowledge fragments detected...' },
        { type: 'analysis', text: 'ANALYSIS: Storm energy stabilizing in certain regions...' },
        { type: 'warning', text: 'WARNING: Void energy pockets forming in deep caverns...' },
        { type: 'notice', text: 'NOTICE: New life forms adapting to harsh conditions...' }
      ],
      'Modern Era': [
        { type: 'scan', text: 'SCANNING: Current era stability metrics analyzed...' },
        { type: 'analysis', text: 'ANALYSIS: Storm energy patterns show cyclical behavior...' },
        { type: 'warning', text: 'WARNING: Void energy concentrations increasing...' },
        { type: 'notice', text: 'NOTICE: Surface temperature variations within expected range...' }
      ],
      'Reignition Era': [
        { type: 'warning', text: 'CRITICAL: Storm energy levels reaching new peaks...' },
        { type: 'warning', text: 'WARNING: Void energy patterns becoming more organized...' },
        { type: 'analysis', text: 'ALERT: Surface conditions approaching critical thresholds...' },
        { type: 'notice', text: 'NOTICE: New technological developments detected...' }
      ],
      'Ascension Era': [
        { type: 'scan', text: 'SCANNING: Advanced energy patterns detected...' },
        { type: 'analysis', text: 'ANALYSIS: Storm and void energy showing signs of harmony...' },
        { type: 'warning', text: 'WARNING: Temporal anomalies increasing in frequency...' },
        { type: 'notice', text: 'NOTICE: Civilization reaching new technological heights...' }
      ],
      'Reflections Era': [
        { type: 'scan', text: 'SCANNING: Historical patterns repeating in new forms...' },
        { type: 'analysis', text: 'ANALYSIS: Energy balance approaching optimal levels...' },
        { type: 'warning', text: 'WARNING: Temporal echoes detected in deep scans...' },
        { type: 'notice', text: 'NOTICE: New understanding of ancient technologies emerging...' }
      ],
      'Renewal Era': [
        { type: 'scan', text: 'SCANNING: Signs of planetary recovery detected...' },
        { type: 'analysis', text: 'ANALYSIS: Energy patterns showing increased stability...' },
        { type: 'warning', text: 'WARNING: Ancient technologies reactivating...' },
        { type: 'notice', text: 'NOTICE: New life forms adapting to balanced conditions...' }
      ]
    };

    this.init();
  }

  init() {
    // Start boot sequence
    this.startBootSequence();
    
    // Initialize particle effects
    this.initParticles();
    
    // Set initial era data
    const initialEra = window.ERA_DATA.eraData[window.ERA_DATA.currentEra];
    if (initialEra && this.eraData[initialEra.name]) {
      const data = this.eraData[initialEra.name];
      document.getElementById('surface-temp').textContent = data.temp;
      document.getElementById('surface-hostility').textContent = data.hostility;
      document.getElementById('surface-water').textContent = data.water;
      document.getElementById('biome-variety').textContent = data.biome;
      this.energyLevels.storm.style.width = `${data.storm}%`;
      this.energyLevels.void.style.width = `${data.void}%`;
    }
    
    // Listen for era changes
    window.addEventListener('eraSelected', (e) => this.updateEraData(e.detail.eraIndex));
    
    // Add scan lines effect
    this.addScanLines();

    // Add initial terminal message
    setTimeout(() => {
      this.addTerminalMessage('System initialized. Beginning planetary scan...', 'success');
    }, 1000);

    // Start message cycling after initial delay
    setTimeout(() => {
      this.startMessageCycle();
    }, window.TERMINAL_CONFIG.initialDelay);
  }

  startBootSequence() {
    const bootSequence = this.bootSequence;
    const bootText = bootSequence.querySelector('.boot-text');
    
    // Add grid and glow effects
    const grid = document.createElement('div');
    grid.className = 'boot-grid';
    bootSequence.appendChild(grid);
    
    const glow = document.createElement('div');
    glow.className = 'boot-glow';
    bootSequence.appendChild(glow);

    // Single powerful message with dramatic reveal
    const message = 'QUANTUM CORE ONLINE';
    
    // Initial state
    bootText.textContent = message;
    bootText.style.opacity = '0';
    bootText.style.transform = 'scale(0.8)';
    
    // Dramatic reveal sequence
    setTimeout(() => {
      // Add intense glitch effect
      bootText.classList.add('glitch-intense');
      
      // Reveal text with dramatic effect
      bootText.style.animation = 'bootTextReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
      
      // Remove glitch after reveal
      setTimeout(() => {
        bootText.classList.remove('glitch-intense');
        
        // Exit sequence
        setTimeout(() => {
          bootSequence.style.opacity = '0';
          bootSequence.style.transition = 'opacity 0.5s ease';
          setTimeout(() => {
            bootSequence.style.display = 'none';
            this.systemUI.style.opacity = '1';
            this.initParticles();
          }, 500);
        }, 1000);
      }, 800);
    }, 200);
  }

  initParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Random size
    const size = Math.random() * 2 + 1;
    
    // Random movement
    const speedX = (Math.random() - 0.5) * 0.5;
    const speedY = (Math.random() - 0.5) * 0.5;
    
    particle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      transform: translate(${speedX}px, ${speedY}px);
    `;
    
    this.systemUI.appendChild(particle);
    
    // Animate particle
    this.animateParticle(particle, x, y, speedX, speedY);
  }

  animateParticle(particle, x, y, speedX, speedY) {
    let posX = x;
    let posY = y;
    
    const animate = () => {
      posX += speedX;
      posY += speedY;
      
      // Wrap around screen
      if (posX < 0) posX = window.innerWidth;
      if (posX > window.innerWidth) posX = 0;
      if (posY < 0) posY = window.innerHeight;
      if (posY > window.innerHeight) posY = 0;
      
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  addScanLines() {
    const scanLines = document.createElement('div');
    scanLines.className = 'scan-lines';
    this.systemUI.appendChild(scanLines);
  }

  updateEraData(eraIndex) {
    const era = window.ERA_DATA.eraData[eraIndex];
    if (!era || !this.eraData[era.name]) return;

    const data = this.eraData[era.name];
    
    // Update era display
    this.currentEra.textContent = era.name;
    
    // Update environmental data
    document.getElementById('surface-temp').textContent = data.temp;
    document.getElementById('surface-hostility').textContent = data.hostility;
    document.getElementById('surface-water').textContent = data.water;
    document.getElementById('biome-variety').textContent = data.biome;
    
    // Update energy levels with animation
    this.energyLevels.storm.style.width = `${data.storm}%`;
    this.energyLevels.void.style.width = `${data.void}%`;
    
    // Add glitch effect during transition
    this.addGlitchEffect();

    // Clear existing messages and start new cycle
    this.terminalMessages = [];
    this.terminalContent.innerHTML = '';
    this.startMessageCycle();
  }

  addGlitchEffect() {
    const readouts = document.querySelectorAll('.readout-value');
    readouts.forEach(readout => {
      readout.classList.add('glitch');
      setTimeout(() => readout.classList.remove('glitch'), 300);
    });
  }

  startMessageCycle() {
    // Clear any existing interval
    if (this.messageCycleInterval) {
      clearInterval(this.messageCycleInterval);
    }

    // Start new cycle
    this.messageCycleInterval = setInterval(() => {
      this.cycleMessages();
    }, window.TERMINAL_CONFIG.cycleInterval);
  }

  cycleMessages() {
    const currentEra = window.ERA_DATA.eraData[window.ERA_DATA.currentEra].name;
    const messages = this.eraMessages[currentEra];
    if (!messages) return;

    // Get weighted random message based on type weights
    const message = this.getWeightedRandomMessage(messages);
    if (message) {
      // Clear existing messages before adding new one
      this.terminalMessages.forEach(msg => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), window.TERMINAL_CONFIG.fadeDuration);
      });
      this.terminalMessages = [];
      this.terminalContent.innerHTML = '';
      
      // Add new message with scramble effect
      this.addTerminalMessage(message.text, message.type);
    }
  }

  getWeightedRandomMessage(messages) {
    const weights = window.TERMINAL_CONFIG.messageTypes;
    const totalWeight = messages.reduce((sum, msg) => sum + (weights[msg.type] || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const message of messages) {
      random -= (weights[message.type] || 1);
      if (random <= 0) return message;
    }
    
    return messages[0]; // Fallback to first message
  }

  scrambleText(text, iterations = 0, finalText = null) {
    if (!finalText) finalText = text;
    if (iterations >= 20) return finalText; // Max 20 iterations for scramble effect
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        result += ' ';
      } else if (iterations < 10 || Math.random() < 0.3) {
        result += this.scrambleChars[Math.floor(Math.random() * this.scrambleChars.length)];
      } else {
        result += finalText[i];
      }
    }
    return result;
  }

  addTerminalMessage(message, type = 'notice') {
    const timestamp = new Date().toLocaleTimeString();
    const messageElement = document.createElement('div');
    messageElement.style.opacity = '0';
    messageElement.style.transition = `opacity ${window.TERMINAL_CONFIG.fadeDuration}ms ease`;
    
    const messageText = document.createElement('span');
    messageText.className = `message ${type}`;
    messageElement.innerHTML = `<span class="timestamp">[${timestamp}]</span>`;
    messageElement.appendChild(messageText);
    
    this.terminalContent.appendChild(messageElement);
    this.terminalMessages.push(messageElement);

    // Fade in
    requestAnimationFrame(() => {
      messageElement.style.opacity = '1';
    });

    // Start scramble effect
    let iterations = 0;
    const startTime = Date.now();
    
    const animateScramble = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / this.scrambleDuration, 1);
      
      if (progress < 1) {
        iterations = Math.floor(progress * 20); // Scale iterations to 20 max
        messageText.textContent = this.scrambleText(message, iterations, message);
        this.currentScramble = requestAnimationFrame(animateScramble);
      } else {
        messageText.textContent = message;
        this.currentScramble = null;
      }
    };

    // Clear any existing scramble animation
    if (this.currentScramble) {
      cancelAnimationFrame(this.currentScramble);
    }
    
    // Start new scramble animation
    this.currentScramble = requestAnimationFrame(animateScramble);

    // Keep only the last maxMessages
    while (this.terminalMessages.length > window.TERMINAL_CONFIG.maxMessages) {
      const oldMessage = this.terminalMessages.shift();
      oldMessage.style.opacity = '0';
      setTimeout(() => oldMessage.remove(), window.TERMINAL_CONFIG.fadeDuration);
    }
  }

  generateBuildId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}${month}${day}.${hour}${minute}`;
  }
}

// Initialize System UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SystemUI();
}); 