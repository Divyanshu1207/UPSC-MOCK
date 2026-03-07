<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OMR Test System</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .question { margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee; }
        .question label { margin-right: 15px; cursor: pointer; }
        #timer-box { position: fixed; top: 10px; right: 10px; background: #f4f4f4; padding: 10px; border: 1px solid #ccc; font-weight: bold; }
        #test { display: none; }
        button { cursor: pointer; padding: 5px 10px; }
        #result { margin-top: 20px; padding: 20px; border: 2px solid #333; }
    </style>
</head>
<body>

    <div id="start">
        <h1>Entrance Mock Test</h1>
        <button onclick="startTest()">Start Test</button>
    </div>

    <div id="test">
        <div id="timer-box">Time Remaining: <span id="time">120:00</span></div>
        <div id="omr"></div>
        <br>
        <button onclick="submitTest()" style="background: green; color: white; padding: 10px 20px;">Submit Test</button>
    </div>

    <div id="result"></div>

<script>
let userAnswers = Array(100).fill("");
let timer = 7200; // 2 hours in seconds
let answerKey = "A".repeat(100); // Replace this with your actual key (e.g., "ABCD...")

function startTest() {
    document.getElementById("start").style.display = "none";
    document.getElementById("test").style.display = "block";
    generateOMR();
    startTimer();
}

function generateOMR() {
    let omr = document.getElementById("omr");
    for (let i = 1; i <= 100; i++) {
        let div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `
            <strong>Q${i}.</strong>
            <label><input type="radio" name="q${i}" value="A" onclick="updateAnswer(${i}, 'A')"> A</label>
            <label><input type="radio" name="q${i}" value="B" onclick="updateAnswer(${i}, 'B')"> B</label>
            <label><input type="radio" name="q${i}" value="C" onclick="updateAnswer(${i}, 'C')"> C</label>
            <label><input type="radio" name="q${i}" value="D" onclick="updateAnswer(${i}, 'D')"> D</label>
            <button type="button" onclick="clearResponse(${i})">Clear</button>
        `;
        omr.appendChild(div);
    }
}

// Helper to update the array immediately when a user clicks
function updateAnswer(questionNum, value) {
    userAnswers[questionNum - 1] = value;
}

function clearResponse(i) {
    // 1. Uncheck all radio buttons for this question
    let radios = document.getElementsByName(`q${i}`);
    for (let radio of radios) {
        radio.checked = false;
    }
    // 2. Explicitly clear the value from our data array
    userAnswers[i - 1] = "";
}

function startTimer() {
    let countdown = setInterval(() => {
        timer--;
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        // Formats seconds to always show two digits (e.g., 09 instead of 9)
        document.getElementById("time").innerText = 
            minutes + ":" + String(seconds).padStart(2, '0');

        if (timer <= 0) {
            clearInterval(countdown);
            submitTest();
        }
    }, 1000);
}

function submitTest() {
    // Final check to ensure array is synced with DOM
    for (let i = 1; i <= 100; i++) {
        let selected = document.querySelector(`input[name="q${i}"]:checked`);
        userAnswers[i - 1] = selected ? selected.value : "";
    }
    calculateScore();
}

function calculateScore() {
    let answers = answerKey.split("");
    let score = 0;
    let correct = 0;
    let wrong = 0;

    for (let i = 0; i < 100; i++) {
        if (userAnswers[i] === "") {
            continue; // Unattempted
        } else if (userAnswers[i] === answers[i]) {
            score += 2;
            correct++;
        } else {
            score -= 0.66;
            wrong++;
        }
    }

    document.getElementById("test").style.display = "none";
    document.getElementById("result").innerHTML = `
        <h2>Test Results</h2>
        <p><strong>Final Score:</strong> ${score.toFixed(2)}</p>
        <p><strong>Correct:</strong> ${correct}</p>
        <p><strong>Wrong:</strong> ${wrong}</p>
        <p><strong>Unattempted:</strong> ${100 - (correct + wrong)}</p>
        <br>
        <a href="solution.pdf" download><button>Download Solution PDF</button></a>
        <button onclick="location.reload()">Restart Test</button>
    `;
}
</script>

</body>
</html>