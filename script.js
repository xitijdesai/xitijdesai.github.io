document.addEventListener('DOMContentLoaded', function () {
    const outputElement = document.getElementById('output');

    // Simulate the command-line animation
    simulateCommandLine(outputElement);
});

function simulateCommandLine(outputElement) {
    const welcomeText = '> Hello, World!';
    const commandLineText = '>C:/Users/Stranger> WHOAMI';

    // Display the WELCOME text at the top of the page
    const welcomeBanner = document.createElement('div');
    welcomeBanner.className = 'access-granted-banner';
    welcomeBanner.textContent = welcomeText;
    outputElement.appendChild(welcomeBanner);

    // Add a slight delay before starting the typing animation
    setTimeout(() => {
        // Display the command-line text with typing animation
        displayTextWithTypingAnimation(outputElement, commandLineText, 100, () => {
            // Add a blinking cursor after the command
            const cursorElement = document.createElement('span');
            cursorElement.id = 'cursor';
            cursorElement.innerHTML = '|';
            outputElement.appendChild(cursorElement);

            // Blink the cursor for 2 seconds
            let isCursorVisible = true;
            const blinkInterval = setInterval(() => {
                cursorElement.style.visibility = isCursorVisible ? 'visible' : 'hidden';
                isCursorVisible = !isCursorVisible;
            }, 500);

            // Stop the blinking after 2 seconds
            setTimeout(() => {
                clearInterval(blinkInterval);
                cursorElement.style.visibility = 'hidden'; // Hide cursor

                // Display loading message
                displayLoadingMessage(outputElement);
            }, 2000);
        });
    }, 1500); // Adjusted delay as needed
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

function displayLoadingMessage(element) {
    // Simulate loading message with countdown
    const loadingMessage = 'LOADING KD\'s DETAILS...';
    element.innerHTML += '\n' + loadingMessage;


    let countdown = 3; // Adjusted to 2
    const countdownInterval = setInterval(() => {
        element.innerHTML += '\n' + `Securing your access in ${countdown}... `;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);

            // Set the background color of the entire page to black
            document.body.style.backgroundColor = 'black';

            // Clear the terminal-like interface
            element.innerHTML = '';

            // Create a new div for "Access Granted" banner
            const accessGrantedBanner = document.createElement('div');
            accessGrantedBanner.className = 'access-granted-banner';
            accessGrantedBanner.textContent = 'ACCESS GRANTED!';

            // Append the new banner to the container
            element.appendChild(accessGrantedBanner);
        }
    }, 1000);
}
