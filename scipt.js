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

        // Simulate the whoami command output
        const whoAmIOutput = `username: ${getUsername()}
hostname: ${getHostname()}
OS: ${getOS()}`;

        // Display the output with a delay to simulate a command-line interface
        setTimeout(() => {
            outputElement.textContent += '\n' + whoAmIOutput;
        }, 500); // Adjust the delay as needed
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

function loadReadme() {
    // Fetch the README.md content
    fetch('README.md')
        .then(response => response.text())
        .then(content => {
            // Display the README.md content in the output element
            document.getElementById('output').textContent = content;
        })
        .catch(error => {
            console.error('Error fetching README.md:', error);
        });
}

// Functions to simulate command output
function getUsername() {
    // You can replace this with the actual username retrieval logic
    return 'john_doe';
}

function getHostname() {
    // You can replace this with the actual hostname retrieval logic
    return 'my-computer';
}

function getOS() {
    // You can replace this with the actual OS retrieval logic
    return 'Linux';
}
