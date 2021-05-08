var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood, feedButton, exerciseButton;
var foodObj;
var hourTime;


//create feed and lastFed variable here
var feed, lastfeed;
var feedTime;
var hour;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  console.log(database)
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedButton = createButton("Feed the Dog");
  feedButton.position(890,95);
  feedButton.mousePressed(feedDog);


  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  

  exerciseButton=createButton("Exercise");
  exerciseButton.position(1000,95);
  exerciseButton.mousePressed(exercise);

  
  

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database ;
  var var_feedTime = database.ref('FeedTime');
  var_feedTime.on("value", feedOp);

  var var_hourTime = database.ref('Hour');
  var_hourTime.on("value", hourOp);

  
 
  //write code to display text lastFed time and no. of times the dog is fed.
  if(feedTime !== undefined) {
  push();
  fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("NUMBER OF MILK BOTTLES DRANK: "+feedTime, 650, 397)

  pop();

  }
  else{
    push();
  fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("NUMBER OF MILK BOTTLES DRANK: Calculating...", 650, 397)
  pop()
  }

  //display lastFedTime
 //console.log(hourTime)
 if(hourTime !== undefined) {

  if(hourTime >0 && hourTime < 12){

  push();
  fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Last Fed: "+hourTime+" AM", 75, 397)
  pop()
  }
  else if(hourTime === 12) {
    push();
  fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Last Fed: "+hourTime+" Noon", 90, 397)
  pop()
  }
  else if(hourTime === 0) {
    push();
  fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Last Fed: "+hourTime+" MidNight", 90, 397)
  pop()
  }
  else if(hourTime > 12 && hourTime <=23) {
    hourTime = hourTime-12
    push();
  fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Last Fed: "+hourTime+" PM", 75, 397)
  pop()
  }

 }

 

  dogStatus();

  

  
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  

  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  
  var food_stock_value = foodObj.getFoodStock();
  if(food_stock_value <= 0) {
    foodObj.updateFoodStock(food_stock_value *0)
  }
  else{
    foodObj.updateFoodStock(food_stock_value -1);
    feedTime++;
    database.ref('/').update({
      FeedTime: feedTime
    })
    foodS = foodS - 1;
  database.ref('/').update({
    Food: foodS
  })

  hour = hour();

  if(hour !== undefined) {
  database.ref('/').update({
    Hour: hour
  })

  
  

  
  }

  else{
    console.log("Please load again")
  }
  

  

  }
  


}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedOp(data) {
  feedTime = data.val();
}

function dogStatus() {
  if(feedTime !== undefined) {
  //console.log("hey what happened")
  if(feedTime < 50) {
    push() 
    fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Status: NEED FOOD :/", 305, 50)
    pop()
  }
  else if(feedTime <= 100 && feedTime >= 50) {
    push() 
    fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Status: Healthy :)", 305, 50)
    pop()
  }
  else {
    push() 
    fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Status: NEED EXERCISE :(", 305, 50)
    pop()
  }
}
else {
  push() 
    fill("white");
  strokeWeight(1);
  textSize(20);
  textAlign(CENTER);
  text("Status: Calculating...", 305, 50)
    pop()
}
}

function exercise() {
  if(feedTime > 0) {
    feedTime = feedTime -1
  }
  else {
    feedTime = 0
  }
  database.ref('/').update({
    FeedTime: feedTime
  })
}

function hourOp(data) {
  hourTime = data.val();
}



