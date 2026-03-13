let userAnswers = Array(100).fill("");
let timer = 7200;

let answerKey = "";
let solutions = [];
let dataLoaded = false;


// LOAD CSV FILE
fetch("answer.csv")
.then(response => response.text())
.then(data => {

let rows = data.trim().split("\n");

// remove header if present
if(rows[0].toLowerCase().includes("answer")){
rows.shift();
}

rows.forEach(row => {

let parts = row.split(",");

// remove Windows \r
let ans = parts[0].trim().replace("\r","");

answerKey += ans;

solutions.push(parts.slice(1).join(",").trim());

});

console.log("Answers loaded:", answerKey.length);
dataLoaded = true;
})
.catch(err=>{
console.error("CSV load error:",err);
});


function startTest(){

if(!dataLoaded){
alert("Answers still loading. Please wait.");
return;
}

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
<label><input type="radio" name="q${i}" value="A" onclick="toggleRadio(this)">A</label>
<label><input type="radio" name="q${i}" value="B" onclick="toggleRadio(this)">B</label>
<label><input type="radio" name="q${i}" value="C" onclick="toggleRadio(this)">C</label>
<label><input type="radio" name="q${i}" value="D" onclick="toggleRadio(this)">D</label>
`;

omr.appendChild(div);

}

}



function toggleRadio(radio){

if(radio.dataset.checked==="true"){

radio.checked=false;
radio.dataset.checked="false";

}else{

let group=document.querySelectorAll(`input[name="${radio.name}"]`);

group.forEach(r=>r.dataset.checked="false");

radio.dataset.checked="true";

}

}



function startTimer(){

let interval=setInterval(()=>{

timer--;

let minutes=Math.floor(timer/60);
let seconds=timer%60;

document.getElementById("time").innerText =
minutes+":"+String(seconds).padStart(2,"0");

if(timer<=0){
clearInterval(interval);
submitTest();
}

},1000);

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

let resultHTML = `
<h2>Result</h2>
Score: ${score.toFixed(2)}<br>
Correct: ${correct}<br>
Wrong: ${wrong}<br>
Unattempted: ${100-correct-wrong}

<br><br>

<a href="solution.pdf" download>
<button>Download Solution PDF</button>
</a>

<h3>Answer Analysis</h3>

<table border="1" cellpadding="6">
<tr>
<th>Q</th>
<th>Your Answer</th>
<th>Correct Answer</th>
<th>Status</th>
<th>Explanation</th>
</tr>
`;

for(let i=0;i<100;i++){

let user = userAnswers[i] || "-";
let correctAns = answers[i];

let status;

if(user=="-"){
status="Unattempted";
}
else if(user==correctAns){
status="Correct";
}
else{
status="Wrong";
}
let rowColor = "";

if(status == "Wrong"){
rowColor = "style='background-color:#ffcccc;'";
}

resultHTML += `
<tr ${rowColor}>
<td>${i+1}</td>
<td>${user}</td>
<td>${correctAns}</td>
<td>${status}</td>
<td>${solutions[i] || ""}</td>
</tr>
`;

}

resultHTML += "</table>";

document.getElementById("result").innerHTML=resultHTML;


}
