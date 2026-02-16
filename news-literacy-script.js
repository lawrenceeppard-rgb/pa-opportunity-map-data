
        const trustworthySources = ["ABC News","Anchorage Daily News","Arizona Daily Star","Associated Press","Atlanta Journal-Constitution","Axios","Baltimore Sun","Barron's","BBC","BBC News","Bloomberg","Buffalo News","Business Insider","C-SPAN","CBS News","Charleston Gazette-Mail","Chicago Sun-Times","Chicago Tribune","Christian Science Monitor","Cleveland Plain Dealer","Cleveland.com","The Buffalo News","The Clarion-Ledger","The Columbus Dispatch","The Dallas Morning News","Dallas Morning News","The Denver Post","Denver Post","Des Moines Register","Deseret News","Defense News","Detroit Free Press","Detroit News","The Economist","Financial Times","Forbes","Foreign Affairs","Foreign Policy","Heavy.com","The Hill","Honolulu Star-Advertiser","Houston Chronicle","Idaho Statesman","IndyStar","Insider","The Kansas City Star","Kansas City Star","LA Times","Las Vegas Review-Journal","Live Science","Los Angeles Times","MarketWatch","Miami Herald","Military Times","Milwaukee Journal Sentinel","MLive.com","NBC News","New York Times","NJ.com","Nola.com","The Oklahoman","Omaha World-Herald","The Oregonian","Orlando Sentinel","The Palm Beach Post","PBS","PennLive.com","Pittsburgh Post-Gazette","PolitiFact","Politico","Poynter","Reuters","Richmond Times-Dispatch","The Roanoke Times","Roll Call","Salt Lake Tribune","The Salt Lake Tribune","San Diego Union-Tribune","The Seattle Times","Seattle Times","SFGate","Snopes","St. Louis Post-Dispatch","Stars and Stripes","StarTribune","STAT","Tampa Bay Times","The Dispatch","The Free Press","The Tennessean","Toronto Star","Tucson.com","Tulsa World","U.S. News & World Report","US News and World Report","USA Today","Wall Street Journal","Washington Post","Wired","Wisconsin State Journal"];
        const untrustworthySources = ["AJ+","Alaska Watchman","Alex Jones","Alice Giordano","Alpha News","AlterNet","America Conservative Union","American Greatness","American Thinker","Americans for Democratic Action","Andrew Napolitano","Andrew Tate","Ann Coulter","Atlas Network","Barstool","Bearing Drift","Being Liberal","Ben Shapiro","Beyond Today","Biblical Gender Roles","Biblical Sexology","Billboard","Bipartisan Report","Bizpac Review","Blavity","Blaze Media","Boing Boing","Bolts","Braver Angels","Breitbart","Breitbart News","Briahna Joy Gray","Brownstone Institute","BuzzFeed","Candace Owens","Care2","CBN","Cenk Uygur","Center for Countering Digital Hate","Center on Budget and Policy Priorities","Charles C. W. Cooke","Chicago Crusader","Chicago Defender","Chidike Okeem","Children's Defense Fund","Christian News Network","Church Militant","City Journal","CNN","CNSNews.com","Common Dreams","Conservative HQ","ContraPoints","Cosmopolitan","Council on Foreign Relations","Covie","Current Affairs","Daily Beast","Daily Citizen","Daily Kos","Daily Mail","Daily Record","Data for Progress","DC Draino","Defend Democracy","Defiant L's","Democracy Now!","Dennis Prager","Diamond and Silk","Dinesh D'Souza","Don Lemon","Drudge Report","Ebony","Economic Policy Institute","EdVotes.org","End Wokeness","Epoch Times","Esquire","EWTN News","Ezra Klein","Faithwire","Florida's Voice","Forward Progressives","Fox News","Free Beacon Fact Check","Frontlines TPUSA","GayNewsToday","GayStarNews","Georgia Voice","GLAAD","Glenn Beck","Global Disinformation Index","Gutfeld!","Hip Latina","Hodgetwins","HuffPost","Huffington Post","Human Rights Campaign","Ian Miles Cheong","If You Only News","In the Grey","Inacow","Independent Journal Review","InfoWars","Infowars","Jack Posobiec","Jacobin","Jamelle Bouie","Jesse Watters","Jezebel","JoeMyGod","John Podhoretz","JRL Charts","Keeping it Right","La Opinion","LA Sentinel","Latino Rebels","Laura Ingraham","Leafly","LGBTQ Nation","Libs of TikTok","Liberal America","Log Cabin","Mashable","Matt Drudge","Matt Walsh","Media Matters","Media Research Center","Megyn Kelly","Mehdi Hasan","Metro Weekly","Mic.com","Michelle Malkin","Middle East Eye","Mike Cernovich","Minnesota Reformer","Mitú","Mother Jones","MS NOW","MSN","MSNBC","National Catholic Register","National Review","Navigator Research","New Republic","New Statesman","New York Daily News","New York Magazine","New York Post","NewsNation","NewsBusters","Newsmax","NewsOne","Newsweek","Nicholas J. Fuentes","NPR","NowThis","NYNMedia","Occupy Democrats","One America News Network (OAN)","Out","Pacific Research Institute","Palmer Report","Pat Buchanan","Paul Krugman","People for the American Way","PinkNews","PJ Media","Pod Save America","PoliticusUSA","PragerU","Progressive Voices of Iowa","Project Veritas","Queerly","Rachel Maddow","Raw Story","RealClearPolitics","Rebel News","Red Racing Horses","RedState","Refinery29","Revolver News","Right Side Broadcasting","Right Side News","Right Wing News","Ring of Fire","Robert Reich","Rolling Stone","Russell Brand","Salon","Sam Seder","San Francisco Chronicle","Sean Hannity","Slate","Socialist Project","Southern Poverty Law Center","Splinter","StandAmerica","Steven Bannon","Teen Vogue","Tennessee Star","Texas Signal","The American Conservative","The American Prospect","The American Spectator","The Austin Chronicle","The Ben Shapiro Show","The Blaze","The Borowitz Report","The Bullet","The Chicago Genius","The Christian Left Blog","The College Fix","The Conscious Conservative","The Daily Caller","The Daily Signal","The Daily Wire","The Damage Report","The Epoch Times","The Federalist","The Five","The Florida Capital Star","The Gateway Pundit","The Georgia Star News","The Glorious American","The Grayzone","The Great Awakening","The Guardian","The Hankyoreh","The Heritage Foundation","The Imaginative Conservative","The Intercept","The Juggernaut","The Maine Wire","The Michigan Star","The Minority Eye","The Mirror","The Nation","The National Desk","The National Pulse","The New Yorker","The New York Sun","The Patriot Post","The Philly Tribune","The Post Millennial","The Rachel Maddow Show","The Resurgent","The Rubin Report","The Spectator Australia","The Spectator World","The Vigilant Fox","The Washington Stand","The Western Journal","The Young Turks","TheGailyGrind","Think Progress","ThinkProgress","Timcast IRL","Tomi Lahren","Tony Michaels","Townhall","TPUSA","Truthdig","Truthout","TruthOut","Tucker Carlson","Turning Point USA","Upworthy","Vice","Virtue Online","Vogue","Voice of Chid","Vox","Voz Media","Washington Examiner","Washington Free Beacon","Washington Times","Whatfinger News","WND","World Magazine","WorldNetDaily","Zero Hedge","ZeroHedge"];
        const allSources = [...trustworthySources.map(s => ({name: s, type: 'trustworthy'})), 
                           ...untrustworthySources.map(s => ({name: s, type: 'untrustworthy'}))];

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
    