document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('dynamic-modal');
    const contentElem = modal.querySelector('.modal-content');
    const closeButton = modal.querySelector('.modal-close');
    const boostDuration = 1000;
    let contentData = null;
    let previousContent = null;

    function showCharacterCards() {
      const contentHTML = `
        <button class="modal-close">&times;</button>
        <h2>Characters</h2>
        <div class="char-cards-container">
          <div class="char-card" data-char="valen">
            <img src="visions/char_card_valen.webp" alt="The Bladecaster" class="char-card-img">
            <div class="char-card-overlay">
              <h3>The Bladecaster</h3>
              <p>A master of melee combat empowered by magical blades.</p>
            </div>
          </div>
          <div class="char-card" data-char="lyra">
            <img src="visions/char_card_lyra.webp" alt="The Survivor" class="char-card-img">
            <div class="char-card-overlay">
              <h3>The Survivor</h3>
              <p>A resourceful fighter skilled at turning enemies into allies.</p>
            </div>
          </div>
          <div class="char-card" data-char="aeron">
            <img src="visions/char_card_aeron.webp" alt="The Tinkerer" class="char-card-img">
            <div class="char-card-overlay">
              <h3>The Tinkerer</h3>
              <p>An Inventor, crafting mechanical constructs and advanced tools.</p>
            </div>
          </div>
        </div>
      `;
      contentElem.innerHTML = contentHTML;
      modal.classList.add('open');
    }

    function showLoreCards() {
      const contentHTML = `
        <button class="modal-close">&times;</button>
        <h2>Lore</h2>
        <div class="lore-cards-container">
          <div class="lore-card" data-lore="storm">
            <img src="visions/glyph_storm.webp" alt="The Storm" class="lore-card-img">
            <div class="lore-card-overlay">
              <h3>The Storm</h3>
              <p>The primal force of chaos and change</p>
            </div>
          </div>
          <div class="lore-card" data-lore="void">
            <img src="visions/glyph_void.webp" alt="The Void" class="lore-card-img">
            <div class="lore-card-overlay">
              <h3>The Void</h3>
              <p>The eternal darkness between worlds</p>
            </div>
          </div>
          <div class="lore-card" data-lore="eye">
            <img src="visions/glyph_eye.webp" alt="The Eye" class="lore-card-img">
            <div class="lore-card-overlay">
              <h3>The Eye</h3>
              <p>The watcher in the shadows</p>
            </div>
          </div>
          <div class="lore-card" data-lore="echo">
            <img src="visions/glyph_echo.webp" alt="The Echo" class="lore-card-img">
            <div class="lore-card-overlay">
              <h3>The Echo</h3>
              <p>The resonance of forgotten memories</p>
            </div>
          </div>
        </div>
      `;
      contentElem.innerHTML = contentHTML;
      modal.classList.add('open');
    }

    function handleCharacterClick(card) {
      const charName = card.querySelector('h3').textContent;
      const charData = contentData.characters.find(c => c.name === charName);
      
      if (charData) {
        previousContent = contentElem.innerHTML;
        
        const contentHTML = `
          <button class="modal-close" data-action="back">&times;</button>
          <img src="visions/char_card_${card.dataset.char}.webp" alt="${charName}" class="char-detail-img">
          <div class="char-detail-content">
            <h2>${charName}</h2>
            ${charData.paragraphs.map(p => `<p>${p}</p>`).join('')}
          </div>
        `;
        contentElem.innerHTML = contentHTML;
        modal.classList.add('open');
      }
    }

    function handleLoreClick(card) {
      const loreName = card.querySelector('h3').textContent;
      console.log('Lore card clicked:', { loreName, cardData: card.dataset.lore });
      console.log('Available lore data:', contentData.lore);
      
      const loreData = contentData.lore.find(l => l.title === loreName);
      console.log('Found lore data:', loreData);
      
      if (loreData) {
        previousContent = contentElem.innerHTML;
        
        const contentHTML = `
          <button class="modal-close" data-action="back">&times;</button>
          <img src="visions/glyph_${card.dataset.lore}.webp" alt="${loreName}" class="lore-detail-img">
          <div class="lore-detail-content">
            <h2>${loreName}</h2>
            <p>${loreData.text}</p>
          </div>
        `;
        contentElem.innerHTML = contentHTML;
        modal.classList.add('open');
      } else {
        console.error('No lore data found for:', loreName);
      }
    }

    contentElem.addEventListener('click', (e) => {
      const card = e.target.closest('.char-card, .lore-card');
      const closeBtn = e.target.closest('.modal-close');
      
      if (card) {
        if (card.classList.contains('char-card')) {
          handleCharacterClick(card);
        } else if (card.classList.contains('lore-card')) {
          handleLoreClick(card);
        }
      } else if (closeBtn) {
        if (closeBtn.dataset.action === 'back' && previousContent) {
          contentElem.innerHTML = previousContent;
          previousContent = null;
        } else {
          modal.classList.remove('open');
        }
      }
    });

    fetch('scrolls/content.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load content data');
        return res.json();
      })
      .then(data => {
        contentData = data;
        
        if (!contentData.eras) return;

        window.addEventListener('eraSelected', (event) => {
          const { modalId, eraIndex } = event.detail;
          
          if (!contentData) return;

          const modalKey = modalId.replace('modal-', '');
          const matchedEra = contentData.eras.find(era => era.id === modalKey);

          if (!matchedEra) return;

          const eraIcon = window.ERA_DATA?.eraData[eraIndex]?.icon;
          
          contentElem.innerHTML = `
            <button class="modal-close">&times;</button>
            <div class="modal-header">
              ${eraIcon ? `<img src="${eraIcon}" alt="${matchedEra.title}" class="era-modal-icon">` : ''}
            <h2>${matchedEra.title}</h2>
            </div>
            <p>${matchedEra.text}</p>
          `;
          modal.classList.add('open');
        });

        const aliasMap = {
          hero: 'about',
          timeline: 'lore',
          collectibles: 'map'
        };

        document.querySelectorAll('.nav-item').forEach(button => {
          button.addEventListener('click', () => {
            const rawSection = button.getAttribute('data-section').toLowerCase();
            const section = aliasMap[rawSection] || rawSection;
            let contentHTML = `<button class="modal-close">&times;</button>`;

            if (section === 'characters') {
              showCharacterCards();
            } else if (section === 'lore') {
              showLoreCards();
            } else if (section === 'map') {
              contentHTML += `
                <h2>World Map</h2>
                <div class="modal-map-container">
                  <div class="modal-runes-overlay"></div>
                  <img src="visions/map_shattered.png" alt="Shattered World Map" class="modal-map">
                </div>
                <p>${contentData.map.text}</p>
              `;
              contentElem.innerHTML = contentHTML;
              modal.classList.add('open');
            } else {
              const generic = contentData[section];
              if (generic) {
                contentHTML += `<h2>${generic.title || section}</h2><p>${generic.text}</p>`;
                contentElem.innerHTML = contentHTML;
                modal.classList.add('open');
              } else {
                contentHTML += `<p>Section "${section}" not found.</p>`;
                contentElem.innerHTML = contentHTML;
                modal.classList.add('open');
              }
            }
          });
        });
      })
      .catch(err => {
        contentElem.innerHTML = `
          <button class="modal-close">&times;</button>
          <h2>Error</h2>
          <p>Failed to load content. Please try refreshing the page.</p>
        `;
      });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        previousContent = null;
      }
    });
  });
  