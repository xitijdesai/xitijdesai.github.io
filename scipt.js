document.addEventListener('DOMContentLoaded', function() {
    const outputElement = document.getElementById('output');

    // Simulate the command-line animation
    simulateCommandLine(outputElement);
});

function simulateCommandLine(outputElement) {
    const commandLineText = 'C:/Users/' + getUsername() + '> WHOAMI';

    // Display the command-line text with typing animation and cursor
    displayTextWithTypingAnimation(outputElement, commandLineText, 100, () => {
        // Add a blinking cursor after the command
        outputElement.innerHTML += '<span id="cursor">|</span>';
    });
}

function displayTextWithTypingAnimation(element, text, speed, callback) {
    let index = 0;

    function type() {
        element.innerHTML += text.charAt(index);
        index++;

        if (index < text.length) {
            setTimeout(type, speed);
        } else {
            // Callback function after typing is complete
            if (callback) {
                callback();
            }
        }
    }

    // Start the typing animation
    type();
}

// Placeholder functions to simulate command output
function getUsername() {
    // Replace this with the actual username retrieval logic
    return 'john_doe';
}
