let userAnswers = Array(100).fill("");
let timer = 7200;

function startTest(){

document.getElementById("start").style.display="none";
document.getElementById("test").style.display="block";

generateOMR();
startTimer();

}

function generateOMR(){

let omr = document.getElementById("omr");

for(let i=1;i<=100;i++){

let div = document.createElement("div");
div.className="question";

div.innerHTML = `
Q${i}
<label><input type="radio" name="q${i}" value="A">A</label>
<label><input type="radio" name="q${i}" value="B">B</label>
<label><input type="radio" name="q${i}" value="C">C</label>
<label><input type="radio" name="q${i}" value="D">D</label>
<button type="button" onclick="clearResponse(${i})">Clear</button>
`;

omr.appendChild(div);

}

}

function clearResponse(i){
let radios = document.getElementsByName(`q${i}`);

for(let j=0;j<radios.length;j++){
radios[j].checked = false;
}
}

function startTimer(){

setInterval(()=>{

timer--;

let minutes=Math.floor(timer/60);
let seconds=timer%60;

document.getElementById("time").innerText =
minutes+":"+seconds;

if(timer<=0) submitTest();

},1000)

}

function submitTest(){

for(let i=1;i<=100;i++){

let selected =
document.querySelector(`input[name=q${i}]:checked`);

if(selected){
userAnswers[i-1]=selected.value;
}

}

calculateScore();

}

function calculateScore(){

let answers = answerKey.split("");

let score=0;
let correct=0;
let wrong=0;

for(let i=0;i<100;i++){

if(userAnswers[i]==answers[i]){
score+=2;
correct++;
}
else if(userAnswers[i]!=""){
score-=0.66;
wrong++;
}

}

document.getElementById("test").style.display="none";

document.getElementById("result").innerHTML=

`
<h2>Result</h2>
Score: ${score}<br>
Correct: ${correct}<br>
Wrong: ${wrong}<br>
Unattempted: ${100-correct-wrong}
<br><br>
<a href="solution.pdf" download>
<button>Download Solution PDF</button>
</a>
`;

}