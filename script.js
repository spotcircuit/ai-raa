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
        item.style.backgroundColor = '';
        item.style.color = '';
        item.style.fontWeight = '';
    });
    
    // Add selected class to clicked element
    element.classList.add('selected');
    
    // Get the question container
    const questionContainer = parent.closest('.question');
    
    // Set the text and color based on the value
    let scoreText = '';
    let scoreColor = '';
    
    switch(value) {
        case '1':
            scoreText = 'Not Started';
            scoreColor = 'var(--danger-color)';
            break;
        case '2':
            scoreText = 'Basic';
            scoreColor = 'var(--warning-color)';
            break;
        case '3':
            scoreText = 'Intermediate';
            scoreColor = '#FFC107';
            break;
        case '4':
            scoreText = 'Advanced';
            scoreColor = '#4CAF50';
            break;
        case '5':
            scoreText = 'Fully Optimized';
            scoreColor = 'var(--success-color)';
            break;
        default:
            scoreText = 'Not Selected';
            scoreColor = 'var(--gray-color)';
    }
    
    // Apply color to the selected button
    element.style.backgroundColor = scoreColor;
    element.style.color = '#fff';
    element.style.fontWeight = '600';
    
    // Update or create the rating description
    let ratingDesc = questionContainer.querySelector('.rating-description');
    if (!ratingDesc) {
        // Remove old rating labels if they exist
        const oldLabels = questionContainer.querySelector('.rating-labels');
        if (oldLabels) {
            oldLabels.style.display = 'none';
        }
        
        // Create new rating description
        ratingDesc = document.createElement('div');
        ratingDesc.className = 'rating-description';
        parent.insertAdjacentElement('afterend', ratingDesc);
    }
    
    ratingDesc.innerHTML = `<span class="rating-value" style="color: ${scoreColor};">${value} - ${scoreText}</span>`;
    ratingDesc.style.display = 'block';
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
    
    // Get all rating groups in the section
    const ratingGroups = section.querySelectorAll('.rating');
    
    ratingGroups.forEach(group => {
        // Check if any rating in this group is already selected
        const selectedRating = group.querySelector('.rating-item.selected');
        
        // If no rating is selected, select the default (middle) rating
        if (!selectedRating) {
            const defaultRating = group.querySelector('.rating-item[data-value="3"]');
            if (defaultRating) {
                defaultRating.classList.add('default-selected');
                // Call selectRating to update the UI and store the value
                selectRating(defaultRating);
            }
        }
    });
}

// Function to calculate the score
function calculateScore() {
    let totalScore = 0;
    let answeredQuestions = 0;
    
    // Get all rating groups
    const ratingGroups = document.querySelectorAll('.rating');
    
    ratingGroups.forEach(group => {
        // Find the selected rating in this group
        const selectedRating = group.querySelector('.rating-item.selected, .rating-item.default-selected');
        
        if (selectedRating) {
            // Get the value of the selected rating
            const value = parseInt(selectedRating.getAttribute('data-value'));
            totalScore += value;
            answeredQuestions++;
        }
    });
    
    // Calculate the average score
    const averageScore = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
    
    // Display the results
    document.getElementById('score').textContent = totalScore;
    
    // Determine readiness level based on score
    let readinessLevel = '';
    let detailedSummary = '';
    
    if (totalScore <= 18) {
        readinessLevel = 'Low Readiness';
        document.getElementById('readiness-level').style.color = 'var(--danger-color)';
        
        detailedSummary = 
            <h3>Assessment: Low AI Readiness</h3>
            <p>Your organization is in the early stages of AI readiness. Your current revenue operations have minimal AI integration, with significant opportunities for improvement.</p>
            
            <h3>Actions with Tools:</h3>
            <ul>
                <li>Start with <em>data cleanup</em> in your CRM - this is the foundation for any AI implementation.</li>
                <li>Implement basic <em>lead scoring</em> using simple rules before moving to AI-based scoring.</li>
                <li>Adopt a <em>content management system</em> that can centralize your marketing assets.</li>
                <li>Begin <em>tracking customer interactions</em> across channels to build your data foundation.</li>
                <li>Consider a <em>pilot project</em> with a managed AI service in one specific area (e.g., email personalization).</li>
            </ul>
            
            <h3>Payoff:</h3>
            <p>Focus on these fundamentals first to build your AI foundation. You can expect:</p>
            <ul>
                <li>20-30% reduction in manual data entry tasks</li>
                <li>15% improvement in lead quality through basic scoring</li>
                <li>Faster sales cycles by eliminating low-value activities</li>
            </ul>
            
            <h3>Why AI Matters:</h3>
            <ul>
                <li>Companies that successfully implement AI in sales see a <strong>50% increase in leads and appointments</strong> (McKinsey)</li>
                <li>AI-enhanced teams achieve <strong>27% higher win rates</strong> and <strong>40% more conversions</strong> (Harvard Business Review)</li>
            </ul>
        ;
    } else if (totalScore <= 30) {
        readinessLevel = 'Moderate Readiness';
        document.getElementById('readiness-level').style.color = 'var(--warning-color)';
        
        detailedSummary = 
            <h3>Assessment: Moderate AI Readiness</h3>
            <p>Your organization has established some foundations for AI implementation. You have systems in place but need to optimize them for AI-powered revenue acceleration.</p>
            
            <h3>Actions with Tools:</h3>
            <ul>
                <li>Implement <em>advanced lead scoring</em> using machine learning algorithms.</li>
                <li>Adopt <em>conversation intelligence</em> tools to analyze sales calls and provide coaching insights.</li>
                <li>Integrate <em>predictive analytics</em> into your forecasting process.</li>
                <li>Deploy <em>intent data tools</em> to identify prospects actively researching solutions like yours.</li>
                <li>Implement <em>AI-driven content recommendations</em> for your sales team.</li>
            </ul>
            
            <h3>Payoff:</h3>
            <p>These mid-level AI implementations can deliver significant results:</p>
            <ul>
                <li>30-40% increase in qualified pipeline opportunities</li>
                <li>25% reduction in sales cycle length</li>
                <li>20% improvement in forecast accuracy</li>
            </ul>
            
            <h3>Why AI Matters:</h3>
            <ul>
                <li>B2B companies using AI for sales enablement report <strong>up to 30% higher close rates</strong> (Forrester)</li>
                <li>Sales teams using AI spend <strong>40% less time on administrative tasks</strong> and more time selling (Salesforce)</li>
            </ul>
        ;
    } else {
        readinessLevel = 'High Readiness';
        document.getElementById('readiness-level').style.color = 'var(--success-color)';
        
        detailedSummary = 
            <h3>Assessment: High AI Readiness</h3>
            <p>Your organization is well-positioned to leverage advanced AI capabilities. You have mature systems and processes that can be enhanced with cutting-edge AI technologies.</p>
            
            <h3>Actions with Tools:</h3>
            <ul>
                <li>Implement <em>generative AI</em> for personalized outreach at scale.</li>
                <li>Deploy <em>real-time opportunity coaching</em> using AI during customer interactions.</li>
                <li>Utilize <em>advanced buyer intent signals</em> with predictive account prioritization.</li>
                <li>Implement <em>AI-driven dynamic pricing</em> based on customer value and win probability.</li>
                <li>Create <em>digital sales rooms</em> with AI-powered content recommendations and buyer engagement tracking.</li>
            </ul>
            
            <h3>Payoff:</h3>
            <p>These advanced AI implementations can transform your revenue operations:</p>
            <ul>
                <li>50%+ increase in sales productivity</li>
                <li>35% higher win rates on competitive deals</li>
                <li>25-30% increase in average deal size</li>
            </ul>
            
            <h3>Why AI Matters:</h3>
            <ul>
                <li>Organizations with mature AI implementations achieve <strong>3-15% revenue increase</strong> across the entire customer lifecycle (McKinsey)</li>
                <li>AI-powered sales organizations are <strong>2.8x more likely to be growing 30%+ annually</strong> compared to peers (Aberdeen)</li>
            </ul>
        ;
    }
    
    document.getElementById('readiness-level').textContent = readinessLevel;
    document.getElementById('detailed-summary').innerHTML = detailedSummary;
    
    // Show the results section
    document.getElementById('results').style.display = 'block';
    
    // Scroll to the results section
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all rating items
    document.querySelectorAll('.rating-item').forEach(item => {
        item.addEventListener('click', function() {
            selectRating(this);
        });
    });
    
    // Add click event listeners to navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const currentSectionId = this.closest('.audit-section').id;
            const action = this.getAttribute('data-action');
            
            let nextSectionId;
            if (action === 'next') {
                const currentSectionNumber = parseInt(currentSectionId.replace('section', ''));
                nextSectionId = 'section' + (currentSectionNumber + 1);
            } else if (action === 'prev') {
                const currentSectionNumber = parseInt(currentSectionId.replace('section', ''));
                nextSectionId = 'section' + (currentSectionNumber - 1);
            } else if (action === 'submit') {
                // Calculate and display the score
                calculateScore();
                return;
            }
            
            navigateSection(currentSectionId, nextSectionId);
            
            // Update progress bar
            updateProgress();
        });
    });
    
    // Initialize progress bar
    updateProgress();
    
    // Add hash change listener
    window.addEventListener('hashchange', handleHashChange);
    
    // Check if there's a hash in the URL on page load
    if (window.location.hash) {
        handleHashChange();
    }
});

// Function to update progress bar
function updateProgress() {
    const totalSections = document.querySelectorAll('.audit-section').length;
    const activeSectionId = document.querySelector('.audit-section.active').id;
    const currentSectionNumber = parseInt(activeSectionId.replace('section', ''));
    
    const progressPercentage = (currentSectionNumber / totalSections) * 100;
    
    document.getElementById('progressBar').style.width = progressPercentage + '%';
    document.querySelector('.progress-text').textContent = Math.round(progressPercentage) + '% Complete';
    
    // Count total questions and answered questions
    const totalQuestions = document.querySelectorAll('.rating').length;
    const answeredQuestions = document.querySelectorAll('.rating-item.selected, .rating-item.default-selected').length;
    
    document.querySelector('.questions-count').textContent = answeredQuestions + '/' + totalQuestions + ' Questions';
}
