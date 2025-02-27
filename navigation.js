// Simple navigation function
function navigateSection(currentId, nextId) {
    console.log("Simple Navigation Function Called");
    console.log("Navigating from", currentId, "to", nextId);
    
    // Get the current and next section elements
    const currentSection = document.getElementById(currentId);
    const nextSection = document.getElementById(nextId);
    
    if (!currentSection || !nextSection) {
        console.error("Section not found:", !currentSection ? currentId : nextId);
        return;
    }
    
    // Hide all sections first
    document.querySelectorAll('.audit-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show only the next section
    nextSection.style.display = 'block';
    
    // Scroll to the top of the section
    window.scrollTo({
        top: nextSection.offsetTop - 100,
        behavior: 'smooth'
    });
}

// When the document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("Navigation.js loaded");
    
    // Hide all sections except the first one
    document.querySelectorAll('.audit-section').forEach(section => {
        if (section.id !== 'section1') {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
    
    // Add click event listeners to all next buttons
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', function() {
            console.log("Next button clicked");
            const currentSection = this.closest('.audit-section').id;
            const nextSection = this.getAttribute('data-next');
            navigateSection(currentSection, nextSection);
        });
    });
    
    // Add click event listeners to all previous buttons
    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', function() {
            console.log("Previous button clicked");
            const currentSection = this.closest('.audit-section').id;
            const prevSection = this.getAttribute('data-prev');
            navigateSection(currentSection, prevSection);
        });
    });
});
