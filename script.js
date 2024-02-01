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
    welcomeBanner.className = 'access-granted-banner welcome';
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
            }, 500);
        });
    }, 500); // Adjusted delay as needed
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
            accessGrantedBanner.textContent = 'MEET MR. KD!';

            // Append the new banner to the container
            element.appendChild(accessGrantedBanner);

            // Additional lines of text
            const additionalText = [
                'Welcome to my profile!',
                'I am passionate about CYBERSECURITY.',
		'Experienced InfoSec CSOC Analyst | Threat Hunter | BTL1 (Gold)',
		'Visit my LinkedIN Profile by clicking on the profile.',
		' ',
		'Or Scan QR to download my PDF Resume: http://tinyurl.com/KDRESUME24.'
            ];

            // Display additional lines of text with a delay
            additionalText.forEach((line, index) => {
                setTimeout(() => {
                    element.innerHTML += '\n' + line;

                    // If it's the last line of text, create a container for the image
                    if (index === additionalText.length - 1) {
                        // Create a container for the image
                        const imageContainer = document.createElement('div');

                        // Create an anchor tag
                        const link = document.createElement('a');
                        link.href = 'https://linkedin.com/in/xitijdesai'; // Replace with the URL you want to redirect to

                        // Create an image element
                        const myImage = document.createElement('img');
                        myImage.src = '/assets/img/kd.png'; // Replace with the actual path to your image
                        myImage.alt = 'Meet KD';

                        // Append the image to the anchor tag
                        link.appendChild(myImage);

                        // Append the anchor tag to the container
                        imageContainer.appendChild(link);

                        // Append the image container to the main element
                        element.appendChild(imageContainer);
                    }
                }, (index + 1) * 1000); // Adjust the delay as needed
            });
        }
    }, 1000);
}
