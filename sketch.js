var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bgImg;
var sun, sunImg;
var car, car_running, car_collided;
var ground, invisibleGround, groundImage;

var jump, collide;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage = ["HighestScore"];
localStorage[0] = 0;

function preload(){
car_running =loadAnimation("orange car.png");
car_collided =loadAnimation("green car_collided.png");
  
  sunImg = loadImage("sun.png");
  
  bgImg = loadImage("backgroundImg.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  jump = loadSound("jump.wav");
  collide = loadSound("collided.wav");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-90,120,10,10);
  sun.addImage(sunImg);
  sun.scale = 0.15;
  
  car = createSprite(50, height-150,20,50);
  
  car.addAnimation("running", car_running);
  car.addAnimation("collided",car_collided);
  car.scale = 0.15;
  
  car.setCollider("circle", 50, 0, 200);
  
  ground = createSprite(width/2,height+20,width,10);
  ground.addImage("ground",grounImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 + 50);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2, height-50,width, 10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //car.debug = true;
  background(bgImg);
  fill("black")
  textSize(20);
  textFont("Comic Sans MS");
  text("Score: "+ score, width/5, height/10);
  text("HI: "+ localStorage[0], width/20, height/10);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length > 0 || keyDown("UP_ARROW")) && car.y  >= height-180) {
      jump.play( )
      car.velocityY = -10;
      touches = [];
    }
  
    car.velocityY = car.velocityY + 0.6
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    car.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(car)){
        gameState = END;
        collide.play(      );
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    car.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the car animation
    car.changeAnimation("collided",car_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  ground.depth = car.depth;
  car.depth = car.depth + 1;
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(height-300,height-400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = sun.depth;
    sun.depth = sun.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = (0.2);
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = (0.1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstacle.depth = car.depth;
    car.depth = car.depth + 1;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  car.changeAnimation("running",car_running);
  
  if(localStorage[0]<score){
    localStorage[0] = score;
  }
  console.log(localStorage[0]);
  
  score = 0;
  
}