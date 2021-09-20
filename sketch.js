
var zombie , zombie_running,zombie_collided;
var weapon , obstacle, obstacleImage;
var ground;
var weaponGroup, obstacleGroup;
var score=0;
var survivalTime=0;
var play=1;
var end=0;
var gameState=play;
var restart,restartIma;
var gameover,gameoverIma;

function preload()
{
  
  zombie_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png");
  zombie_collided=loadAnimation("sprite_0.png");
  
  
  obstaceImage = loadImage("obstacle.png");
  weapon1 = loadImage("weapon1.png");
  weapon2 = loadImage("weapon2.png");
  weapon3 = loadImage("weapon3.png");
  weapon4 = loadImage("weapon4.png");
  bgImage = loadImage("bg2.jpg");
  restartIma=loadImage("restart.png");
  gameoverIma=loadImage("gameover.png");
}



function setup() 
{
  createCanvas(windowWidth, windowHeight);

  bg=createSprite(width/2,height/2);  
  bg.addImage("bgImage",bgImage);
  bg.velocityX = -1;
  bg.scale = 1;

  
  
  zombie=createSprite(50,height-30,20,40);
  zombie.addAnimation("running",zombie_running);
  zombie.addAnimation("collided",zombie_collided);
  zombie.scale=1;
  
  ground=createSprite(width/2,height-10,width,25);  
  ground.shapeColour="black";
  ground.visible = false;

  
  obstacleGroup = createGroup();
  weaponGroup= createGroup();
  
  gameover=createSprite(width/2,height/2- 50);
  gameover.addImage("gameover",gameoverIma);
  gameover.visible=false;
  
  restart=createSprite(width/2,height/2+50);
  restart.addImage("restart",restartIma);
  restart.scale=0.2;
  restart.visible=false;
}


function draw() 
{
  background(0);
  
  if(gameState===play)
    {
      ground.velocityX = -6;
  
      if (ground.x < 0)
        {
          ground.x = width/2;
          bg.x = width/2;
        }
      
      if (keyDown("space") && zombie.y >= height-120)
        {
          console.log("zombie jumping");
          zombie.velocityY=-15;
        }
        zombie.velocityY=zombie.velocityY+0.8;
        zombie.collide(ground);
      
      spawnObstacles();
      spawnWeapon();
      
      if(zombie.isTouching(weaponGroup))
        {
          score=score+10;
          zombie.scale = zombie.scale + 0.1;
          weaponGroup.destroyEach();
          survivalTime = survivalTime + 1;
        }
  
      if(zombie.isTouching(obstacleGroup))
        {
          gameState=end;
          bg.velocityX=0;
        }
      
      //console.log(zombie.y);
      //survivalTime=Math.ceil(frameCount/frameRate());
    }
  
  else if(gameState===end)
    {
      obstacleGroup.setVelocityXEach(0);
      weaponGroup.setVelocityXEach(0);
      
      obstacleGroup.setLifetimeEach(-1);
      weaponGroup.setLifetimeEach(-1);
      
      ground.velocityX=0;
      bg.velocityX=0;
      zombie.velocityY=0;
      
      gameover.visible=true;
      restart.visible=true;
      
      zombie.changeAnimation("collided",zombie_collided);
      
      if(mousePressedOver(restart)) 
      {
        reset();
      }
    }
  
    zombie.collide(ground); 
  
  drawSprites();
  
  
  
  stroke="white";
  textSize(20);
  fill("white");
  
  text("Score : "+survivalTime,width-100,25);
}

function spawnObstacles()
{
 if (frameCount % 300 === 0)
 {
    obstacle = createSprite(width,height-50,10,40);
    obstacle.velocityX = -6;
    obstacle.addImage("rock",obstaceImage);
            
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.setCollider("circle",0,0,180);
   
    obstacleGroup.add(obstacle);
 }
}

function spawnWeapon() 
{
  if (frameCount % 90 === 0) {
    weapon = createSprite(width,Math.round(random(100,height-100)),40,10);
    
    weapon.velocityX = -6;
    weapon.lifeTime=300;

    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: weapon.addImage(weapon1);
              break;
      case 2: weapon.addImage(weapon2);
              break;
      case 3: weapon.addImage(weapon3);
              break;
      case 4: weapon.addImage(weapon4);
              break;
      default: break;
    }
    weapon.scale = 0.3;
    weaponGroup.add(weapon);
  }
}

function reset()
{
  frameCount=0;
  gameState=play;
  gameover.visible=false;
  restart.visible=false;
  score=0;
  zombie.changeAnimation("running",zombie_running);
  obstacleGroup.destroyEach();
  weaponGroup.destroyEach();
  bg.velocityX = -2;
}

