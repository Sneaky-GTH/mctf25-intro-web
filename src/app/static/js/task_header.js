// flag_header.js

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('flag-input');
    const button = document.getElementById('submit-flag-btn');
    const message = document.getElementById('flag-message');

    button.addEventListener('click', () => {
        const flag = input.value.trim();
        if (!flag) {
            message.textContent = "Enter a flag!";
            message.style.color = "#cf716cff"; // red for error
            return;
        }

        fetch("/submit-flag", {  // update route if necessary
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ flag: flag })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                message.textContent = `Correct!`;
                message.style.color = "#7ec98aff"; // green
                input.value = ""; // clear input
            } else {
                message.textContent = `${data.error}!`;
                message.style.color = "#cf8985ff"; // red
            }
        })
        .catch(err => {
            console.error(err);
            message.textContent = "Error submitting flag!";
            message.style.color = "#ff3b30";
        });
    });

    // Optional: press Enter to submit
    input.addEventListener('keyup', (e) => {
        if (e.key === "Enter") {
            button.click();
        }
    });
});
