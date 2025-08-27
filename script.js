
Date.prototype.getWeekNumber = function(){
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
};
const weekNumber = new Date().getWeekNumber();

const workoutData = {
  Beginner: [
    {name:"Jumping Jacks", duration:30, animation:"https://media.giphy.com/media/26tPoyDhjiJ2pna9S/giphy.gif"},
    {name:"Push-Ups", duration:20, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Squats", duration:25, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Lunges", duration:20, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Plank", duration:30, animation:"https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif"}
  ],
  Intermediate: [
    {name:"Burpees", duration:25, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Push-Ups", duration:30, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Jump Squats", duration:25, animation:"https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif"},
    {name:"Lunges", duration:25, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Glute Bridges", duration:30, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"}
  ],
  Advanced: [
    {name:"Burpees with Push-Up", duration:30, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Pistol Squats", duration:25, animation:"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"},
    {name:"Plank to Push-Up", duration:30, animation:"https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif"},
    {name:"Jump Lunges", duration:25, animation:"https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif"},
    {name:"Mountain Climbers", duration:30, animation:"https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif"}
  ]
};

function getCurrentWeekExercises(level){
  const base = workoutData[level];
  const rotationIndex = weekNumber % base.length;
  return [...base.slice(rotationIndex), ...base.slice(0, rotationIndex)];
}

let currentWorkout = "Beginner";
let currentExercise = 0;
let timerInterval;
const exerciseContainer = document.getElementById("exerciseContainer");
const summaryDiv = document.getElementById("summary");

function loadExercise(){
  const exercises = getCurrentWeekExercises(currentWorkout);
  if(currentExercise >= exercises.length){
    exerciseContainer.style.display="none";
    summaryDiv.style.display="block";
    return;
  }
  summaryDiv.style.display="none";
  exerciseContainer.style.display="flex";
  const ex = exercises[currentExercise];
  exerciseContainer.innerHTML = `
    <img src="${ex.animation}" alt="${ex.name}">
    <div class="exercise-info">
      <h3>${ex.name}</h3>
      <div class="timer" id="timer">${ex.duration}</div>
    </div>
  `;
  startTimer(ex.duration);
}

function startTimer(duration){
  let timeLeft = duration;
  const timerElem = document.getElementById("timer");
  timerInterval = setInterval(()=>{
    timeLeft--;
    timerElem.textContent = timeLeft;
    if(timeLeft <= 0){
      clearInterval(timerInterval);
      restTimer(10);
    }
  },1000);
}

function restTimer(duration){
  exerciseContainer.innerHTML += `<div class="timer">Rest: ${duration}</div>`;
  let timeLeft = duration;
  const restElem = exerciseContainer.querySelector(".timer:last-child");
  const restInterval = setInterval(()=>{
    timeLeft--;
    restElem.textContent = "Rest: "+timeLeft;
    if(timeLeft <= 0){
      clearInterval(restInterval);
      currentExercise++;
      loadExercise();
    }
  },1000);
}

document.getElementById("workoutSelect").addEventListener("change", function(){
  currentWorkout = this.value;
  currentExercise = 0;
  loadExercise();
});

function restartWorkout(){
  currentExercise = 0;
  loadExercise();
}

const darkBtn = document.getElementById("darkModeBtn");
darkBtn.addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});
if(localStorage.getItem("darkMode")==="true") document.body.classList.add("dark");

loadExercise();

const ctx = document.getElementById('weightChart').getContext('2d');
const weightChart = new Chart(ctx,{
  type:'line',
  data:{
    labels:['Week 1','Week 2','Week 3','Week 4'],
    datasets:[{
      label:'Weight (kg)',
      data:[70,69.5,69,68.5],
      borderColor:'#1e88e5',
      backgroundColor:'rgba(30,136,229,0.2)',
      fill:true,
      tension:0.3
    }]
  },
  options:{responsive:true, maintainAspectRatio:false}
});
