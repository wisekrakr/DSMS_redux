/**
 * Patrolling the heavens until a player is in its range, then it will follow and shoot
 * that player. The enemy also dodges asteroids.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 */
const Enemy = function(game, x, y) {

    this.tag        = "Enemy";
    this.tagNr      = Math.random();
    this.color      = "rgb(0,255,128)";
    this.width      = ENEMY_WIDTH;   
    this.height     = ENEMY_HEIGHT;   
    this.velocity_x = Math.random() * ENEMY_SPEED / FPS;
    this.velocity_y = Math.random() * ENEMY_SPEED / FPS;
    this.x          = x;
    this.y          = y;    
    this.angle      = 0;
    this.speed      = ENEMY_SPEED;
    this.turnSpeed  = ENEMY_TURN_SPEED;
    this.rotation   = 0;  
    this.range      = ENEMY_RANGE;  
    this.canShoot   = false;    
    this.game       = game;  
  
    this.game.instance.gameEngine.gameEngine.addObject(this);  
  };
  
  Enemy.prototype = {
  
    constructor : Enemy,   
    explodeTime: EXPLODE_TIME,
    lastShot: 0,
    fireRate: FIRE_RATE,
    myMessages: [
      "I will shoot you!",
      "come BACK here!",
      "bleep blorp zorg",
      "shinde kudasai",
      "amaré tu muerte",
      "oyisithutha ofile",
      "ich werde dich erschießen",
      "lelőlek",
      "zastrzelę cię",
      "nitakupiga",
      "я пристрелю тебя",
      "ik zal je neerschieten",
      "ti sparaghju"
    ],     
    sendMessage:false,
       
    
    /**
     * Function to angle towards the player and away from asteroids, when in range 
     */
    behavior: function(){
      for(let target of this.game.instance.gameEngine.gameEngine.gameObjects){    
        if(target instanceof Player){     

          if(this.target !== null){
            if(this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) < this.range &&
            this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) > target.width * 2){

              this.angle = this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this,target); 

              this.canShoot = true;
        
            }else{

              this.canShoot = false;
                           
            }
          }
        }else if(target instanceof Asteroid){

          if(this.target !== null){
            if(this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) < (this.width + target.width) + 20){

              this.angle = -this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this,target); 
            }
          }
        }
      }
    },
    
    /**
     * Function that handles creating lasers and shooting towards the player,
     * with a certain fire rate
     */
    shootLaser: function(){
      
      // Create laser object and fire it      
      let time = this.game.instance.spaceEngine.clock/1000;

      if(this.lastShot === 0){
        this.lastShot = time;
      }      
 
      if(this.canShoot){   
          
        if(time - this.lastShot >= this.fireRate){        

          new Laser(
            this.game,
            this.x + this.width/4 * Math.cos(this.angle),
            this.y + this.height * Math.sin(this.angle),
            this.angle,
            this
          );

          this.lastShot = time;
        }
      }
    }, 

    /**
    * If the enemy collides this will return true and also sets a collision object
    */
    collide: function () {       
      if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Player || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Meteor){            
            return true;
      }    
      return false;         
    },
    
    /**
    * Updates the enemy's movement and exploding.
    * Also initializes the rotation and shooting.
    */
    update: function() {    
      
      if(!this.collide()){

        this.x -= this.velocity_x * Math.cos(this.angle);
        this.y -= this.velocity_y * Math.sin(this.angle);

        this.behavior(); 
        this.shootLaser();
        
        //Messaging
        if(this.canShoot){
          if(!this.sendMessage){
            this.game.world.messenger(this.myMessages[Math.floor(Math.random() * this.myMessages.length)], this);           
          }     
        }
      }else{
          this.game.instance.gameEngine.gameEngine.explode(this, this.game,5);
      }
    },   
  
  };  
  
  
    
    
  
 