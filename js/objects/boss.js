/**
 * The Boss of Space. Erratic movement to try to kill the player
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 */
const Boss = function(game, x, y, w, h) {

    this.tag        = "Boss";
    this.tag_nr     = Math.random();
    this.color      = "#657a87";
    this.width      = w;   
    this.height     = h; 
    this.init_width = w;
    this.init_height= h;     
    this.velocity_x = (ENEMY_SPEED*6) / FPS;
    this.velocity_y = (ENEMY_SPEED*6) / FPS;
    this.x          = x;
    this.y          = y;    
    this.angle      = 0;          
    this.game       = game;  
  
    this.game.gameEngine.addObject(this);  
  };
  
  Boss.prototype = {
  
    constructor : Boss,   
    explode_time: EXPLODE_TIME,
    last_movement: 0,  
    my_messages: [
      "Space Boss!",
      "My name is Zeep Xanflorp, you killed my father, prepare to die",
      "Call me The Micro-Manager",
      "0010011001110011111",
      "I'm missing golf for this?!?!",
      "Oy Oy OY OY",
      "I've no idea what I'm talking about",
      "I bought these engines with my bonus"
      
    ],     
    send_message:false, 
    health:2000,  
    
    /**
     * Function to angle towards the player and away from asteroids, when in range 
     */
    behavior: function(){
      for(let target of this.game.gameEngine.gameObjects){    
        if(target instanceof Player){     

          if(this.target !== null){
            if(this.game.gameEngine.distanceBetweenObjects(this,target) < 1000){

              this.angle = this.game.gameEngine.angleBetweenObjects(this,target); 
        
            }
          }
        }
      }
    },
    
    /**
     * Start moving erratic every 2.5 seconds, to confuse the player
     */
    erratic: function(){      
      
        let time = this.game.spaceEngine.clock/1000;

        if(this.last_movement === 0){
            this.last_movement = time;
        }      
            
        if(time - this.last_movement >= 0.04 * FPS){              

            this.game.gameAudio.play(440, 0.1, "sine").stop(0.1);    
            this.game.gameAudio.play(523.25, 0.25, "sine", 0.1).stop(0.2);     
            this.game.gameAudio.play(698.46, 0.3, "sine", 0.2).stop(0.3); 

            this.behavior(); //targeting player

            this.last_movement = time;
        }
      
    }, 

    /**
    * If the boss collides this will return true and  sets a collision object
    */
    collide: function () {       
      if(this.game.gameEngine.collisionObject(this) instanceof Asteroid){  

            return true;
      }    
      return false;         
    },
    
    /**
    * Updates the boss's movement and exploding.
    * Also initializes a message and substracting of live
    */
    update: function() {    

      this.x -= this.velocity_x * Math.cos(this.angle);
      this.y -= this.velocity_y * Math.sin(this.angle);
      
      if(!this.collide()){
       
        this.erratic();
       
        //Say something random
        if(!this.send_message){
            this.game.world.messenger(this.my_messages[Math.floor(Math.random() * this.my_messages.length)], this);           
        }            
        
      }else{
        // Substract live from the the boss
        this.health -= 5;
      }

      if(this.health <=0){
        this.game.gameEngine.explode(this, this.game,6);
      }
    },   
  
  };  
  
  