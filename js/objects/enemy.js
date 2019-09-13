/**
 * Patrolling the heavens until a player is in its range, then it will follow and shoot
 * that player. The enemy also dodges asteroids.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 */
const Enemy = function(game, x, y, w, h, mark) {

    this.tag        = "Enemy";
    this.mark       = mark;
    this.tag_nr     = Math.random();
    this.color      = game.colorPicker(["#e03e69","#20b3a2", "#657a87", "#935f7b", "#b5c68a"]);
    this.width      = w;   
    this.height     = h; 
    this.init_width = w;
    this.init_height= h;     
    this.velocity_x = Math.random() * ENEMY_SPEED / FPS;
    this.velocity_y = Math.random() * ENEMY_SPEED / FPS;
    this.x          = x;
    this.y          = y;    
    this.angle      = 0;          
    this.game       = game;  
  
    this.game.gameEngine.addObject(this);  
  };
  
  Enemy.prototype = {
  
    constructor : Enemy,   
    explode_time: EXPLODE_TIME,
    can_shoot : false, 
    last_shot: 0,  
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
      "To infinity and beyond",
      "dodge this",
      "js13kGames made me do it!",
      "don't get cocky",
      "do a barrel role",
      "You may call me Hal"
    ],     
    send_message:false,  
    
    /**
     * Function to angle towards the player and away from asteroids, when in range 
     */
    behavior: function(attack_range){
      for(let target of this.game.gameEngine.gameObjects){    
        if(target instanceof Player){     

          if(this.target !== null){
            if(this.game.gameEngine.distanceBetweenObjects(this,target) < attack_range &&
            this.game.gameEngine.distanceBetweenObjects(this,target) > target.width * 2){

              this.angle = this.game.gameEngine.angleBetweenObjects(this,target); 

              this.can_shoot = true;
        
            }else{

              this.can_shoot = false;
                           
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
    shootLaser: function(fire_rate){
      
      // Create laser object and fire it      
      let time = this.game.spaceEngine.clock/1000;

      if(this.last_shot === 0){
        this.last_shot = time;
      }      
 
      if(this.can_shoot){   
          
        if(time - this.last_shot >= fire_rate){      
      
          new Laser(
            this.game,
            this.x + this.width/4 * Math.cos(this.angle),
            this.y + this.height * Math.sin(this.angle),
            this.angle,
            this
          );

          this.last_shot = time;

          // Laser sound
          this.game.gameAudio.play(200, 0.1, "square").stop(0.1);           
          this.game.gameAudio.play(350, 0.1, "square", 0.1).stop(0.2);   
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

        switch(this.mark){
          case 1:
            this.behavior(ENEMY_RANGE/2); 
            this.shootLaser(FIRE_RATE*2);
            break;
          case 2: 
            this.behavior(ENEMY_RANGE); 
            this.shootLaser(FIRE_RATE);
            break;
          case 3:
            this.behavior(ENEMY_RANGE*2); 
            this.shootLaser(FIRE_RATE/2);
            break;               
        }
       
        //Messaging
        if(this.can_shoot){
          if(!this.send_message){
            this.game.world.messenger(this.my_messages[Math.floor(Math.random() * this.my_messages.length)], this);           
          }     
        }       
        
        
      }else{
          this.game.gameEngine.explode(this, this.game,2);
      }
    },   
  
  };  
  
  
    
    
  
 