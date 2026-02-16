
        
        
        
        // Load sources from JSON
        let trustworthySources = [];
        let untrustworthySources = [];
        let allSources = [];
        
        fetch('https://lawrenceeppard-rgb.github.io/pa-opportunity-map-data/news-sources.json')
            .then(response => response.json())
            .then(data => {
                trustworthySources = data.trustworthy;
                untrustworthySources = data.untrustworthy;
                allSources = [
                    ...trustworthySources.map(name => ({ name, type: 'trustworthy' })),
                    ...untrustworthySources.map(name => ({ name, type: 'untrustworthy' }))
                ];
            })
            .catch(error => console.error('Error loading sources:', error));
        

        const searchInput = document.getElementById('sourceSearch');
        const autocompleteResults = document.getElementById('autocompleteResults');
        const searchResult = document.getElementById('searchResult');

        // Fuzzy search function
        function fuzzyMatch(str, pattern) {
            const strLower = str.toLowerCase();
            const patternLower = pattern.toLowerCase();
            
            // Exact match or contains
            if (strLower.includes(patternLower)) return true;
            
            // Check if all characters in pattern appear in order in str
            let patternIdx = 0;
            for (let i = 0; i < strLower.length && patternIdx < patternLower.length; i++) {
                if (strLower[i] === patternLower[patternIdx]) {
                    patternIdx++;
                }
            }
            return patternIdx === patternLower.length;
        }

        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length < 1) {
                autocompleteResults.style.display = 'none';
                return;
            }

            const queryLower = query.toLowerCase();
            
            // Separate matches by priority
            const exactMatches = [];
            const startsWithMatches = [];
            const containsMatches = [];
            const fuzzyMatches = [];
            
            allSources.forEach(source => {
                const nameLower = source.name.toLowerCase();
                
                if (nameLower === queryLower) {
                    exactMatches.push(source);
                } else if (nameLower.startsWith(queryLower)) {
                    startsWithMatches.push(source);
                } else if (nameLower.includes(queryLower)) {
                    containsMatches.push(source);
                } else if (fuzzyMatch(source.name, query)) {
                    fuzzyMatches.push(source);
                }
            });
            
            // Combine in priority order and limit to 8 results
            const matches = [...exactMatches, ...startsWithMatches, ...containsMatches, ...fuzzyMatches].slice(0, 8);

            if (matches.length > 0) {
                autocompleteResults.innerHTML = matches.map(source => 
                    `<div class="autocomplete-item" data-source="${source.name}" data-type="${source.type}">${source.name}</div>`
                ).join('');
                autocompleteResults.style.display = 'block';
            } else {
                autocompleteResults.style.display = 'none';
            }
        });

        autocompleteResults.addEventListener('click', function(e) {
            if (e.target.classList.contains('autocomplete-item')) {
                const sourceName = e.target.dataset.source;
                const sourceType = e.target.dataset.type;
                
                searchInput.value = sourceName;
                autocompleteResults.style.display = 'none';
                
                displayResult(sourceName, sourceType);
            }
        });

        function displayResult(sourceName, sourceType) {
            if (sourceType === 'trustworthy') {
                searchResult.innerHTML = `
                    <div class="result-trustworthy">
                        <div style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #155724;">${sourceName}</div>
                        <div class="result-message">
                            <strong>TRUSTWORTHY SOURCE:</strong> Connors Institute analysts have determined that this source produces generally reliable information with limited partisan bias.
                        </div>
                        <div class="thumbs-icon" style="color: #28a745; filter: drop-shadow(0 0 20px #28a745) drop-shadow(0 0 40px #28a745); text-shadow: 0 0 30px rgba(40, 167, 69, 0.8);">👍</div>
                        <div style="font-size: 1.2rem; font-weight: 600; margin-top: 1.5rem; color: #155724;">${sourceName}: Trustworthy</div>
                    </div>
                `;
            } else {
                searchResult.innerHTML = `
                    <div class="result-untrustworthy">
                        <div style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #721c24;">${sourceName}</div>
                        <div class="result-message">
                            <strong>UNTRUSTWORTHY SOURCE:</strong> Connors Institute analysts have determined that this source produces information that is not consistently reliable and/or has an unacceptable degree of partisan bias.
                        </div>
                        <div class="thumbs-icon" style="color: #dc3545; filter: drop-shadow(0 0 20px #dc3545) drop-shadow(0 0 40px #dc3545); text-shadow: 0 0 30px rgba(220, 53, 69, 0.8);">👎</div>
                        <div style="font-size: 1.2rem; font-weight: 600; margin-top: 1.5rem; color: #721c24;">${sourceName}: Untrustworthy</div>
                    </div>
                `;
            }
            searchResult.style.display = 'block';
            searchResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Close autocomplete when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
                autocompleteResults.style.display = 'none';
            }
        });

        // Mobile tooltip support - toggle on tap
        document.querySelectorAll('.tooltip-wrapper').forEach(wrapper => {
            wrapper.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close all other tooltips
                document.querySelectorAll('.tooltip-wrapper').forEach(w => {
                    if (w !== wrapper) {
                        w.classList.remove('tooltip-active');
                    }
                });
                
                // Toggle this tooltip
                this.classList.toggle('tooltip-active');
            });
        });

        // Close tooltips when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.tooltip-wrapper')) {
                document.querySelectorAll('.tooltip-wrapper').forEach(wrapper => {
                    wrapper.classList.remove('tooltip-active');
                });
            }
        });

        // Add event listener for close button on tooltips
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tooltip-close-btn')) {
                e.stopPropagation();
                const wrapper = e.target.closest('.tooltip-wrapper');
                if (wrapper) {
                    wrapper.classList.remove('tooltip-active');
                }
            }
        });

        // Close tooltip when clicking on backdrop overlay (mobile)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tooltip-wrapper') && e.target.classList.contains('tooltip-active')) {
                const tooltipText = e.target.querySelector('.tooltip-text');
                if (tooltipText && !tooltipText.contains(e.target)) {
                    e.target.classList.remove('tooltip-active');
                }
            }
        });
    