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
    // Remove selected class from all ratings in this group
    const parent = element.parentNode;
    parent.querySelectorAll('.rating-item').forEach(item => {
        item.classList.remove('selected');
        item.classList.remove('default-selected'); // Remove default-selected class when user makes a selection
    });
    
    // Add selected class to clicked element
    element.classList.add('selected');
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
    
    // Find all question groups in this section
    const questionGroups = section.querySelectorAll('.question-group');
    
    questionGroups.forEach(group => {
        // Check if any rating is selected in this group
        const hasSelection = group.querySelector('.rating-item.selected');
        
        // If no rating is selected, select the first one (rating 1)
        if (!hasSelection) {
            const firstRating = group.querySelector('.rating-item[data-value="1"]');
            if (firstRating) {
                // Use the existing selectRating function to ensure consistent behavior
                selectRating(firstRating);
                
                // Add default-selected class to indicate this was auto-selected
                firstRating.classList.add('default-selected');
                
                console.log('Set default rating 1 for question in section', sectionId);
            }
        }
    });
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
    
    if (averageScore < 2) {
        readinessLevel = 'Low Readiness';
    } else if (averageScore < 3.5) {
        readinessLevel = 'Medium Readiness';
    } else {
        readinessLevel = 'High Readiness';
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