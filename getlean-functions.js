// --- Tabs ---
let tabs = ['dashboard','nutrition','workouts','trackers','progress','tools','settings'];
function tab(name){
  tabs.forEach(t=>document.getElementById(t).classList.remove('active'));
  document.getElementById(name).classList.add('active');
}

// --- Dashboard ---
let streak = 0;
function completeDay(){
  streak++; 
  document.getElementById('streaks').innerText = streak + " days completed";
}

// Motivation
const motivations = [
  "Keep pushing!","You got this!","Every rep counts!","Consistency is key!","Strong today, stronger tomorrow!"
];
document.getElementById('motivation').innerText = motivations[Math.floor(Math.random()*motivations.length)];

// --- Program Timer ---
let programStart=null, programLength=42;
function startProgram(){
  const sd = document.getElementById('startDate').value;
  const days = parseInt(document.getElementById('programDays').value);
  if(!sd || !days) return alert("Enter start date and program days");
  programStart = new Date(sd); 
  programLength = days;
  updateDayDisplay();
}
function updateDayDisplay(){
  if(!programStart) return;
  const now = new Date();
  const diff = Math.floor((now - programStart) / (1000*60*60*24)) + 1;
  document.getElementById('dayDisplay').innerText = `Day ${diff>programLength?programLength:diff} of ${programLength}`;
}
setInterval(updateDayDisplay, 60000);

// --- 10-Minute Workout Timer ---
let workoutTime=0, workoutInterval=null;
function startWorkout(){
  if(workoutInterval) return;
  workoutInterval = setInterval(()=>{
    workoutTime++;
    document.getElementById('timer').innerText = workoutTime + "s";
    document.getElementById('workoutTimerBar').value = workoutTime;
    if(workoutTime >= 600) clearInterval(workoutInterval);
  }, 1000);
}
function stopWorkout(){ clearInterval(workoutInterval); workoutInterval = null; }
function resetWorkout(){ stopWorkout(); workoutTime = 0; document.getElementById('timer').innerText="0s"; document.getElementById('workoutTimerBar').value=0; }

// --- Gym Plan ---
const gymPlan = [
  "Monday — Chest + Triceps: Bench Press, Dumbbell Fly, Tricep Dips",
  "Tuesday — Back + Biceps: Pull-ups, Row, Dumbbell Curls",
  "Wednesday — Legs: Squats, Lunges, Leg Press",
  "Thursday — Shoulders: Shoulder Press, Lateral Raise, Shrugs",
  "Friday — Upper Body: Mix Chest/Back/Shoulders",
  "Saturday — Full Body: Compound lifts, Cardio",
  "Sunday — Rest"
];
const gymPlanList=document.getElementById('gymPlanList');
gymPlan.forEach(w=>{
  let li = document.createElement('li'); 
  li.innerText = w; 
  gymPlanList.appendChild(li);
});

// --- Meal Tracker ---
let calories = 0, meals = [], caloriesChart = null;
function addMeal(){
  const chicken = parseFloat(document.getElementById('chicken').value) || 0;
  const rice = parseFloat(document.getElementById('brownRice').value) || 0;
  const broccoli = parseFloat(document.getElementById('broccoli').value) || 0;
  const juice = parseFloat(document.getElementById('juice').value) || 0;
  const custom = parseFloat(document.getElementById('custom').value) || 0;
  const total = chicken*50 + rice*215 + broccoli*55 + juice + custom; // calorie estimates
  calories += total;
  meals.push(total);
  document.getElementById('calories').innerText = "Calories: " + calories;
  updateCaloriesChart();
}

function updateCaloriesChart(){
  const ctx = document.getElementById('caloriesChart').getContext('2d');
  if(!caloriesChart){
    caloriesChart = new Chart(ctx,{
      type:'line',
      data:{labels:meals.map((v,i)=>`Day ${i+1}`), datasets:[{label:'Calories', data:meals, borderColor:'green', fill:false}]},
      options:{plugins:{legend:{display:false}}, responsive:true}
    });
  } else {
    caloriesChart.data.labels = meals.map((v,i)=>`Day ${i+1}`);
    caloriesChart.data.datasets[0].data = meals;
    caloriesChart.update();
  }
}

// --- Water Tracker ---
let water = 0, waterHistory = [], waterChart = null;

function addWater(){
  water++; if(water>16) water=16;
  document.getElementById('water').innerText = water;
  waterHistory.push(water);
  updateWaterChart();
}

function removeWater(){
  water--; if(water<0) water=0;
  document.getElementById('water').innerText = water;
  waterHistory.push(water);
  updateWaterChart();
}

function resetWater(){
  water = 0;
  waterHistory = [];
  document.getElementById('water').innerText = water;
  updateWaterChart();
}

function updateWaterChart(){
  const ctx = document.getElementById('waterChart').getContext('2d');
  if(!waterChart){
    waterChart = new Chart(ctx,{
      type:'line',
      data:{labels:waterHistory.map((v,i)=>`Day ${i+1}`), datasets:[{label:'Glasses', data:waterHistory, borderColor:'blue', fill:false}]},
      options:{plugins:{legend:{display:false}}, responsive:true}
    });
  } else {
    waterChart.data.labels = waterHistory.map((v,i)=>`Day ${i+1}`);
    waterChart.data.datasets[0].data = waterHistory;
    waterChart.update();
  }
}

// --- Trackers: Weight, Steps, Body Fat, BMI ---
let weights=[], stepsList=[], bodyFatList=[], bmiList=[];
let weightChart=null, stepsChart=null, bfChart=null, bmiChart=null;

function addWeight(){
  const w = parseFloat(document.getElementById('weightInput').value) || 0;
  weights.push(w);
  document.getElementById('weightList').innerText = weights.join(", ");
  updateWeightChart();
}

function updateSteps(){
  const s = parseInt(document.getElementById('steps').value) || 0;
  stepsList.push(s);
  document.getElementById('stepsDisplay').innerText = stepsList.join(", ");
  updateStepsChart();
}

function saveBodyFat(){
  const bf = parseFloat(document.getElementById('bodyfat').value) || 0;
  bodyFatList.push(bf);
  document.getElementById('bfList').innerText = bodyFatList.join(", ");
  updateBFChart();
}

function calcBMI(){
  const h = parseFloat(document.getElementById('height').value);
  const w = parseFloat(document.getElementById('bmiWeight').value);
  if(!h || !w) return;
  const bmi = (w / ((h*0.0254)**2)).toFixed(1);
  bmiList.push(bmi);
  document.getElementById('bmi').innerText = bmi;
  updateBMIChart();
}

// --- Tracker Charts ---
function updateWeightChart(){ updateLineChart(weights,'weightChart','Weight','red'); }
function updateStepsChart(){ updateLineChart(stepsList,'stepChart','Steps','green'); }
function updateBFChart(){ updateLineChart(bodyFatList,'bodyFatChart','Body Fat %','orange'); }
function updateBMIChart(){ updateLineChart(bmiList,'bmiChart','BMI','purple'); }

function updateLineChart(dataArray,canvasId,label,color){
  const ctx = document.getElementById(canvasId).getContext('2d');
  if(window[canvasId]) window[canvasId].destroy();
  window[canvasId] = new Chart(ctx,{
    type:'line',
    data:{labels:dataArray.map((v,i)=>`Day ${i+1}`), datasets:[{label:label, data:dataArray, borderColor:color, fill:false}]},
    options:{plugins:{legend:{display:false}}, responsive:true}
  });
}

// --- Macro Calculator ---
function calcMacros(){
  const cal = parseInt(document.getElementById('macroCalories').value) || 0;
  if(!cal) return;
  const protein = Math.round(cal*0.3/4);
  const carbs = Math.round(cal*0.5/4);
  const fat = Math.round(cal*0.2/9);
  document.getElementById('macroResult').innerText = `Protein: ${protein}g, Carbs: ${carbs}g, Fat: ${fat}g`;
  generateMacroMealPlan(protein, carbs, fat);
}

// --- Meal Plan Generator ---
function mealPlan(){
  const cal = parseInt(document.getElementById('planCalories').value) || 1750;
  const lunch = Math.round(cal*0.4);
  const snack = Math.round(cal*0.2);
  const dinner = Math.round(cal*0.4);
  document.getElementById('plan').innerText = `Lunch 1PM: ${lunch} cal\nSnack 4PM: ${snack} cal\nDinner 8PM: ${dinner} cal`;
}

let macroChart=null;
function generateMacroMealPlan(p,c,f){
  const ctx = document.getElementById('macroMealPlanChart').getContext('2d');
  const data = [
    {meal:'Lunch',protein:Math.round(p*0.4),carbs:Math.round(c*0.4),fat:Math.round(f*0.4)},
    {meal:'Snack',protein:Math.round(p*0.2),carbs:Math.round(c*0.2),fat:Math.round(f*0.2)},
    {meal:'Dinner',protein:Math.round(p*0.4),carbs:Math.round(c*0.4),fat:Math.round(f*0.4)}
  ];
  if(macroChart) macroChart.destroy();
  macroChart = new Chart(ctx,{
    type:'bar',
    data:{
      labels:data.map(d=>d.meal),
      datasets:[
        {label:'Protein',data:data.map(d=>d.protein),backgroundColor:'red'},
        {label:'Carbs',data:data.map(d=>d.carbs),backgroundColor:'blue'},
        {label:'Fat',data:data.map(d=>d.fat),backgroundColor:'orange'}
      ]
    },
    options:{responsive:true,plugins:{legend:{position:'top'}}}
  });
}

// --- Fat Loss Simulator ---
function simulate(){
  const cw=parseFloat(document.getElementById('currentWeight').value)||0;
  const gw=parseFloat(document.getElementById('goalWeight').value)||0;
  const days=parseInt(document.getElementById('simDays').value)||42;
  if(!cw||!gw||!days) return alert("Enter all fields");
  const dailyLoss=(cw-gw)/days;
  document.getElementById('result').innerText = `Daily Weight Loss Needed: ${dailyLoss.toFixed(2)} lbs`;

  const simWeights=[];
  for(let i=0;i<days;i++){ simWeights.push(cw - dailyLoss*(i+1)); }
  const ctx=document.getElementById('weightSimChart').getContext('2d');
  new Chart(ctx,{
    type:'line',
    data:{labels:simWeights.map((v,i)=>`Day ${i+1}`), datasets:[{label:'Projected Weight', data:simWeights, borderColor:'red', fill:false}]},
    options:{plugins:{legend:{display:false}}, responsive:true}
  });
}

// --- Notifications ---
function enableNotifications(){
  if(!("Notification" in window)) return alert("Notifications not supported");
  Notification.requestPermission().then(permission=>{
    if(permission==="granted") alert("Notifications enabled!");
    else alert("Permission denied");
  });
}
