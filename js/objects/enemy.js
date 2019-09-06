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
    this.tag_nr      = Math.random();
    this.color      = "rgb(0,255,128)";
    this.width      = ENEMY_WIDTH;   
    this.height     = ENEMY_HEIGHT; 
    this.init_width = ENEMY_WIDTH;
    this.init_height= ENEMY_HEIGHT;     
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
  
    this.game.gameEngine.addObject(this);  
  };
  
  Enemy.prototype = {
  
    constructor : Enemy,   
    explode_time: EXPLODE_TIME,
    lastShot: 0,
    fireRate: FIRE_RATE,
    my_messages: [
      "I will shoot you!",
      "come BACK here!",
      "bleep blorp zorg",
      "shinde kudasai",
      "amaré tu muerte",
      "Where's your Multipass",
      "By Grabthar’s hammer",
      "...I've seen things...",
      "weehoo!",
      "To infinity and beyond"
    ],     
    send_message:false,
    audio: new AudioContext(), 
    
    /**
     * Function to angle towards the player and away from asteroids, when in range 
     */
    behavior: function(){
      for(let target of this.game.gameEngine.gameObjects){    
        if(target instanceof Player){     

          if(this.target !== null){
            if(this.game.gameEngine.distanceBetweenObjects(this,target) < this.range &&
            this.game.gameEngine.distanceBetweenObjects(this,target) > target.width * 2){

              this.angle = this.game.gameEngine.angleBetweenObjects(this,target); 

              this.canShoot = true;
        
            }else{

              this.canShoot = false;
                           
            }
          }
        }else if(target instanceof Asteroid){

          if(this.target !== null){
            if(this.game.gameEngine.distanceBetweenObjects(this,target) < (this.width + target.width) + 20){

              this.angle = -this.game.gameEngine.angleBetweenObjects(this,target); 
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
      let time = this.game.spaceEngine.clock/1000;

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

          // Laser sound
          this.game.gameAudio.play(300, 0.1, "sine").stop(0.1);    
          this.game.gameAudio.play(350, 0.1, "sine", 0.1).stop(0.2);     
          this.game.gameAudio.play(400, 0.1, "sine", 0.2).stop(0.3);  
          this.game.gameAudio.play(450, 0.1, "sine", 0.3).stop(0.4);   
        }
      }
    }, 

    /**
    * If the enemy collides this will return true and also sets a collision object
    */
    collide: function () {       
      if(this.game.gameEngine.collisionObject(this) instanceof Asteroid || 
          this.game.gameEngine.collisionObject(this) instanceof Player || 
          this.game.gameEngine.collisionObject(this) instanceof Meteor){            
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
          if(!this.send_message){
            this.game.world.messenger(this.my_messages[Math.floor(Math.random() * this.my_messages.length)], this);           
          }     
        }
      }else{
          this.game.gameEngine.explode(this, this.game,5);
      }
    },   
  
  };  
  
  
    
    
  
 