// Create a centralized navigation function
function navigateSection(currentId, nextId) {
    console.log("NAVIGATION FUNCTION CALLED");
    console.log("Navigating from", currentId, "to", nextId);
    
    // Get the current and next section elements
    const currentSection = document.getElementById(currentId);
    const nextSection = document.getElementById(nextId);
    
    console.log("Current section element:", currentSection);
    console.log("Next section element:", nextSection);
    
    if (!currentSection || !nextSection) {
        console.error("Section not found:", !currentSection ? currentId : nextId);
        return;
    }
    
    // Remove active class from all sections
    document.querySelectorAll('.audit-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Add active class to the next section
    nextSection.classList.add('active');
    
    console.log("Navigation complete");
}

// Function to handle rating selection
function selectRating(element) {
    // Get the selected value
    const value = element.getAttribute('data-value');
    const parent = element.parentNode;
    
    // Remove selected class and reset styles from all ratings in this group
    parent.querySelectorAll('.rating-item').forEach(item => {
        item.classList.remove('selected');
        item.classList.remove('default-selected');
        item.style.cssText = '';
    });
    
    // Add selected class to clicked element
    element.classList.add('selected');
    
    // Set color and label text based on the value
    let buttonColor = '';
    let labelText = '';
    let labelHeader = '';
    let labelIcon = '';
    
    switch(value) {
        case '1':
            buttonColor = '#d90429'; // Red
            labelHeader = 'Not Started';
            labelText = 'No capability—losing deals and time.';
            labelIcon = '❌';
            break;
        case '2':
            buttonColor = '#ff9e00'; // Orange
            labelHeader = 'Basic';
            labelText = 'Minimal efforts, inconsistent revenue impact.';
            labelIcon = '⚠️';
            break;
        case '3':
            buttonColor = '#06d6a0'; // Green
            labelHeader = 'Developing';
            labelText = 'Process exists, but not optimized for speed or wins.';
            labelIcon = '🔄';
            break;
        case '4':
            buttonColor = '#118ab2'; // Cyan
            labelHeader = 'Strong';
            labelText = 'Solid execution, driving some revenue lift.';
            labelIcon = '📈';
            break;
        case '5':
            buttonColor = '#7209b7'; // Purple
            labelHeader = 'Fully Optimized';
            labelText = 'Best-in-class, maximizing deal velocity and close rates.';
            labelIcon = '🏆';
            break;
        default:
            buttonColor = 'var(--primary-color)';
            labelHeader = '';
            labelText = '';
            labelIcon = '';
    }
    
    // Apply color to the selected button
    element.style.cssText = `
        background-color: ${buttonColor} !important;
        color: #fff !important;
        border-color: transparent !important;
    `;
    
    // Create or update the rating description
    const questionContainer = parent.closest('.question');
    let ratingDesc = questionContainer.querySelector('.rating-description');
    
    if (!ratingDesc) {
        ratingDesc = document.createElement('div');
        ratingDesc.className = 'rating-description';
        parent.insertAdjacentElement('afterend', ratingDesc);
    }
    
    ratingDesc.innerHTML = `
        <div class="rating-label" style="color: white; background-color: ${buttonColor};">
            <span class="label-icon">${labelIcon}</span>
            <strong class="label-header">${labelHeader}</strong>: ${labelText}
        </div>
    `;
    ratingDesc.style.display = 'block';
    
    // Update the progress bar
    updateProgressBar();
}

// Function to update the progress bar
function updateProgressBar() {
    // Count total questions
    const totalQuestions = document.querySelectorAll('.rating').length;
    
    // Count answered questions (those with a selected rating)
    const answeredQuestions = document.querySelectorAll('.rating-item.selected').length;
    
    // Calculate percentage
    const percentComplete = Math.round((answeredQuestions / totalQuestions) * 100);
    
    // Update progress bar width
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = percentComplete + '%';
    }
    
    // Update progress text
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = percentComplete + '% Complete';
    }
    
    // Update questions count
    const questionsCount = document.querySelector('.questions-count');
    if (questionsCount) {
        questionsCount.textContent = answeredQuestions + '/' + totalQuestions + ' Questions';
    }
}

// Function to handle hash changes
function handleHashChange() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#section')) {
        const sectionId = hash.substring(1).split('-')[0]; // Extract section ID from the hash
        const currentSectionNumber = parseInt(sectionId.replace('section', ''));
        const previousSectionNumber = currentSectionNumber - 1;
        
        // If navigating forward, set default values for unanswered questions in the previous section
        if (previousSectionNumber >= 1) {
            const previousSectionId = 'section' + previousSectionNumber;
            setDefaultValuesForSection(previousSectionId);
        }
        
        // Hide all sections
        document.querySelectorAll('.audit-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the section corresponding to the hash
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
}

// Function to set default values for unanswered questions in a section
function setDefaultValuesForSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Find all questions in this section
    const questions = section.querySelectorAll('.question');
    
    questions.forEach(question => {
        const ratingGroup = question.querySelector('.rating');
        if (!ratingGroup) return;
        
        // Check if any rating is selected in this group
        const hasSelection = ratingGroup.querySelector('.rating-item.selected');
        
        // If no rating is selected, select the first one (rating 1)
        if (!hasSelection) {
            const firstRating = ratingGroup.querySelector('.rating-item[data-value="1"]');
            if (firstRating) {
                // Use the existing selectRating function to ensure consistent behavior
                selectRating(firstRating);
                
                // Add default-selected class to indicate this was auto-selected
                firstRating.classList.add('default-selected');
                
                console.log('Set default rating 1 for question in section', sectionId);
            }
        }
    });
    
    // Update progress bar after setting defaults
    updateProgressBar();
}

// Function to handle navigation button clicks
function handleNavigationButtonClick(event) {
    const currentSection = this.closest('.audit-section').id;
    const nextSection = this.getAttribute('data-next') || this.getAttribute('data-prev');
    setDefaultValuesForSection(currentSection);
    navigateSection(currentSection, nextSection);
}

// Calculate score and show results
function calculateScore() {
    // Set default values for all unanswered questions in all sections
    for (let i = 1; i <= 8; i++) {
        setDefaultValuesForSection('section' + i);
    }
    
    // Get all ratings
    const ratings = document.querySelectorAll('.rating-item.selected');
    
    // Count total score
    let totalScore = 0;
    let totalQuestions = document.querySelectorAll('.question-group').length;
    
    // If we can't find question groups, count the questions directly
    if (totalQuestions === 0) {
        totalQuestions = document.querySelectorAll('.question').length;
    }
    
    // Calculate maximum possible score
    const maxPossibleScore = totalQuestions * 5;
    
    ratings.forEach(rating => {
        const value = parseInt(rating.getAttribute('data-value'));
        totalScore += value;
    });
    
    console.log("Total score:", totalScore);
    console.log("Total questions:", totalQuestions);
    console.log("Maximum possible score:", maxPossibleScore);
    
    // All questions should now be answered with at least the default value of 1
    
    // Get current scroll position
    const currentScrollY = window.scrollY;
    
    // Hide all sections
    document.querySelectorAll('.audit-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Determine readiness level
    const averageScore = totalScore / totalQuestions;
    let readinessLevel = '';
    let detailedSummary = '';
    
    if (averageScore < 2) {
        readinessLevel = 'Low Readiness';
        detailedSummary = `
            <h3>Low Readiness – Address Prolonged Cycles and Lost Opportunities</h3>
            <p><strong>Assessment:</strong> Your sales cycles likely exceed 90 days due to fragmented data and manual processes, leading to missed high-potential deals. Without change, your win rates may remain below 20%, leaving you at a severe competitive disadvantage.</p>
            <p><strong>Actions with Top Tools:</strong></p>
            <ul>
                <li><em>Data Boost:</em> Use Cognism ($39/month) to enrich prospect data from 50M+ contacts, then sync hourly to your CRM with Make.com ($9/month)—reduce qualification time by 30% (e.g., 10 to 7 hours/week).</li>
                <li><em>Intent Jumpstart:</em> Identify signals with Keyplay ($99/month) via public data, and automate Slack pings with Make.com—improve close rates by 20% (e.g., 15% to 18%) in 3 weeks.</li>
                <li><em>ICP Basics:</em> Build an ICP with Ocean.io ($99/month) from closed deals, and refine it with n8n ($20/month) using LLM persona tweaks—enhance win rates by 25% in 30 days.</li>
            </ul>
            <p><strong>Payoff:</strong></p>
            <ul>
                <li>Organizations reduced sales cycles from 90 to 65 days (+28% faster velocity).</li>
                <li>Increased win rates from 15% to 20% (+33% improvement).</li>
                <li>Grew pipeline revenue by 18% in 3 months (Forrester, 2024).</li>
            </ul>
            <p><strong>Why AI Matters:</strong></p>
            <ul>
                <li>These tools automate data and targeting—allowing reps to focus on closing deals, accelerating wins by 30%.</li>
            </ul>
        `;
    } else if (averageScore < 3.5) {
        readinessLevel = 'Medium Readiness';
        detailedSummary = `
            <h3>Moderate Readiness – Enhance Efficiency and Revenue Potential</h3>
            <p><strong>Assessment:</strong> Your sales cycles average around 60 days with win rates near 25%. Partial automation and unrefined targeting delay deals, leaving significant revenue opportunities untapped.</p>
            <p><strong>Actions with Top Tools:</strong></p>
            <ul>
                <li><em>ICP Refinement:</em> Use Clay.com ($149/month) to analyze customer patterns, then auto-update ICP lists with Make.com ($9/month)—double pipeline velocity and boost conversions 22% in 60 days.</li>
                <li><em>Content Automation:</em> Generate icebreakers with Warmer.ai ($97/month), triggering delivery with Make.com based on buyer stage—shorten closes by 18% (e.g., 60 to 49 days) in 30 days.</li>
                <li><em>Handoff Speed:</em> Automate routing with Sybill.ai ($59/month) and log delays with n8n ($20/month)—reduce handoff time by 40% and lift close rates by 15% in 6 weeks.</li>
            </ul>
            <p><strong>Payoff:</strong></p>
            <ul>
                <li>Organizations shortened cycles from 60 to 45 days (+25% faster velocity).</li>
                <li>Win rates rose from 25% to 32% (+28% improvement).</li>
                <li>Pipeline revenue jumped 22% in 4 months (Gartner, 2024).</li>
            </ul>
            <p><strong>Why AI Matters:</strong></p>
            <ul>
                <li>Cost-effective AI tools reduce delays by 40% and drive 20% larger wins with minimal effort.</li>
            </ul>
        `;
    } else {
        readinessLevel = 'High Readiness';
        detailedSummary = `
            <h3>High Readiness – Optimize for Market Leadership</h3>
            <p><strong>Assessment:</strong> With sales cycles around 50 days and win rates near 30%, your process is strong—but suboptimal personalization and manual prep work are capping your potential. Further refinement will position you ahead of competitors and maximize revenue velocity.</p>
            <p><strong>Actions with Top Tools:</strong></p>
            <ul>
                <li><em>ABM Precision:</em> Enrich ABM targets with Clay.com ($149/month), orchestrate campaigns with Make.com ($9/month), and personalize with n8n + LLM—grow deal sizes by 35% (e.g., $150K to $202K) in 6 months.</li>
                <li><em>Pre-Meeting Edge:</em> Compile briefs with Humanlinker ($75/month) and Sybill.ai ($59/month), automated via Make.com—improve win rates by 20% (e.g., 30% to 36%) in 90 days.</li>
                <li><em>Tech Power:</em> Scale email with Smartlead.ai ($39/month) and automate tasks with Bardeen.ai ($10/month)—reduce cycles by 45% (e.g., 50 to 27 days) and boost revenue by 30% in 4 months.</li>
            </ul>
            <p><strong>Payoff:</strong></p>
            <ul>
                <li>Organizations shortened cycles from 50 to 30 days (+40% faster velocity).</li>
                <li>Win rates improved from 30% to 40% (+33% improvement).</li>
                <li>Revenue grew by 35% in 6 months (HubSpot, 2024).</li>
            </ul>
            <p><strong>Why AI Matters:</strong></p>
            <ul>
                <li>Precision AI tools transform your sales engine—delivering faster cycles and larger wins for under $200/month.</li>
            </ul>
        `;
    }
    
    // Show results section
    document.getElementById('results').innerHTML = `
        <div class="results-section">
            <h2>Your AI Revenue Acceleration Readiness Score</h2>
            <div class="results-container">
                <div class="score-display">
                    <div class="final-score">${totalScore}</div>
                    <p>out of ${maxPossibleScore}</p>
                    <div class="score-status">${readinessLevel}</div>
                </div>
                <div class="score-interpretation">
                    <h4>${readinessLevel} (${averageScore.toFixed(1)}/5.0)</h4>
                    <p>Your organization is at the <strong>${readinessLevel}</strong> stage in terms of AI revenue acceleration capabilities.</p>
                    ${detailedSummary}
                </div>
            </div>
            <div class="cta-container">
                <h4>Ready to accelerate your revenue with AI?</h4>
                <p>Our team of experts can help you implement the recommended tools and strategies to improve your score and drive faster revenue growth.</p>
                <a href="mailto:contact@example.com" class="cta-button">Contact Us</a>
            </div>
        </div>
    `;
    
    // Show the results section
    document.getElementById('results').classList.add('active');
    
    // Maintain scroll position
    window.scrollTo({
        top: currentScrollY,
        behavior: 'auto'
    });
}

// Execute when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded - DOM Content Loaded Event");
    
    // Make sure section1 is visible and others are hidden
    document.querySelectorAll('.audit-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Check if there's a hash in the URL
    if (window.location.hash && window.location.hash.startsWith('#section')) {
        handleHashChange();
    } else {
        // Default to section1 if no hash
        document.getElementById('section1').classList.add('active');
    }
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Set default values for the visible section
    const visibleSection = document.querySelector('.audit-section.active');
    if (visibleSection) {
        setDefaultValuesForSection(visibleSection.id);
    }
    
    // Add click handlers for all rating items
    document.querySelectorAll('.rating-item').forEach(item => {
        item.addEventListener('click', function() {
            selectRating(this);
        });
    });
    
    // Initialize progress bar
    updateProgressBar();
    
    // Direct targeting of the first next button
    const firstNextButton = document.querySelector('#section1 .btn-next');
    if (firstNextButton) {
        console.log("Found first next button:", firstNextButton);
        firstNextButton.addEventListener('click', handleNavigationButtonClick);
    } else {
        console.error("Could not find the first next button!");
    }
    
    // Add click handlers for navigation buttons
    console.log("Setting up navigation button handlers");
    const nextButtons = document.querySelectorAll('.btn-next');
    console.log("Found next buttons:", nextButtons.length);
    
    nextButtons.forEach(button => {
        console.log("Adding click handler to button:", button);
        button.addEventListener('click', handleNavigationButtonClick);
    });
    
    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', handleNavigationButtonClick);
    });
    
    document.querySelectorAll('.btn-calculate').forEach(button => {
        button.addEventListener('click', calculateScore);
    });
});
