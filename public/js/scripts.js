let characterPosition = { x: 50, y: 100 }; // Initial position in percentage
const character = document.getElementById('character');
const buttons = document.querySelectorAll('#navbar button');

// Set up the overlay to trigger the tunnel effect on click
const tunnel = document.getElementById('tunnel');
tunnel.addEventListener('click', enterWebsite);

let isJumping = false; // Flag to check if the character is jumping

function enterWebsite() {
    const content = document.getElementById('content');

    // Show the tunnel overlay
    tunnel.style.display = 'flex';
    tunnel.style.opacity = 1;

    // Animate tunnel transition
    setTimeout(() => {
        tunnel.style.opacity = 0;
        setTimeout(() => {
            tunnel.style.display = 'none';
            content.style.display = 'flex';
            content.style.opacity = 1;
        }, 500);
    }, 1000);

    // Start character movement
    document.addEventListener('keydown', moveCharacter);
}

function moveCharacter(event) {
    switch (event.key) {
        case 'a': // Move left
            characterPosition.x -= 3;
            break;
        case 'd': // Move right
            characterPosition.x += 3;
            break;
        case 'w': // Move up
            characterPosition.y += 90;
            break;
        case 's': // Move down
            characterPosition.y -= 90;
            break;
        case ' ': // Jump
            jumpCharacter();
            return; // Exit to prevent movement after jump
        default:
            return; // Quit if the key isn't handled
    }

    character.style.left = characterPosition.x + '%';
    character.style.bottom = characterPosition.y + 'px';
}

function getDistance(rect1, rect2) {
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;
    
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function jumpCharacter() {
    isJumping = true; // Set flag when jumping
    character.style.transition = 'bottom 0.3s ease';
    character.style.bottom = (parseInt(character.style.bottom) + 50) + 'px'; // Jump up

    setTimeout(() => {
        character.style.bottom = (parseInt(character.style.bottom) - 50) + 'px'; // Fall back down
        checkButtonCollision(); // Check for button collision when falling
        isJumping = false; // Reset flag after jump
    }, 300);
}

function checkButtonCollision() {
    if (!isJumping) return;

    const characterRect = character.getBoundingClientRect();
    let closestButton = null;
    let minDistance = Infinity;

    // Remove in-range class from all buttons first
    buttons.forEach(btn => btn.classList.remove('in-range'));

    buttons.forEach(button => {
        const buttonRect = button.getBoundingClientRect();
        const distance = getDistance(characterRect, buttonRect);
        
        // Update closest button if this button is closer
        if (distance < minDistance) {
            minDistance = distance;
            closestButton = button;
        }
    });

    // If we found a close button and are within snap distance
    if (closestButton && minDistance < 150) { // 150 pixels snap distance
        const buttonRect = closestButton.getBoundingClientRect();
        
        // Add in-range class to closest button
        closestButton.classList.add('in-range');
        
        // Calculate position to center character on button
        const newX = ((buttonRect.left + (buttonRect.width / 2)) / window.innerWidth) * 100;
        const newY = window.innerHeight - buttonRect.top - (characterRect.height / 2);

        // Update character position
        characterPosition.x = newX;
        characterPosition.y = newY;
        
        // Apply new position
        character.style.left = newX + '%';
        character.style.bottom = newY + 'px';
        
        // Trigger button click after a short delay
        setTimeout(() => {
            closestButton.click();
        }, 200);
    }
}

function navigateTo(page) {
    // Navigate to the selected page directly without showing the tunnel
    window.location.href = `/${page}`; // Ensure that this matches your routing
}