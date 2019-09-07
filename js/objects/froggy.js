/**
 * A object that needs to cross the galaxy and it needs help.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 */
const Froggy = function(game,x ,y) {

    this.tag        = "Froggy";
    this.tag_nr      = Math.random();
    this.color      = "#ffffff";
    this.width      = PLAYER_WIDTH;
    this.height     = PLAYER_HEIGHT; 
    this.init_width = PLAYER_WIDTH;
    this.init_height= PLAYER_HEIGHT;    
    this.velocity_x = Math.random() * ENEMY_SPEED / FPS;
    this.velocity_y = Math.random() * ENEMY_SPEED / FPS;
    this.x          = x;
    this.y          = y;    
    this.angle      = 0;
    this.speed      = ENEMY_SPEED;
    this.turnSpeed  = ENEMY_TURN_SPEED;
    this.rotation   = 0;    
    this.game       = game;
    
    this.game.gameEngine.addObject(this);
};

Froggy.prototype = {

    constructor : Froggy,
    collided_with:null,
    explode_time: EXPLODE_TIME,
    my_messages: [
      fail=[
        "they got me!",
        "you failed me!",
        "why??!?!?!?!",
        "tell my wife that I....",
        "blurghhh"
      ],
      win=[
        "thank you kind person",
        "you did it!",
        "i'm happy now",
        "what a wonderful day",
        "vape's are on me!"
      ]    
    ],  
    send_message:false,
    following:false,
  
    /**
    * If the enemy collides this will return true and also sets a collision object
    */
    collide: function () {       
        if(this.game.gameEngine.collisionObject(this) instanceof Enemy || 
            this.game.gameEngine.collisionObject(this) instanceof Asteroid){       
                
                this.collided_with = this.game.gameEngine.collisionObject(this);

            return true;
        }    
        return false;         
    },

    /**
     * Function to angle towards the player when in range 
     */
    behavior: function(){

        for(let target of this.game.gameEngine.gameObjects){    
          if(target instanceof Player){    

            //Go towards Player
            if(this.target !== null){
                if(this.game.gameEngine.distanceBetweenObjects(this,target) < 250){
  
                    this.angle = this.game.gameEngine.angleBetweenObjects(this,target); 
                     
                    this.following = true;

                    if(this.game.gameEngine.distanceBetweenObjects(this,target) < target.width * 2){
                        this.x += this.velocity_x * Math.cos(-this.angle);
                        this.y += this.velocity_y * Math.sin(-this.angle);
                    }
                }else{
 
                    this.following = false;

                    this.game.world.messenger("HELP ME!", this);
                             
                }
            }

            //Move away from Enemies
            }else if(target instanceof Enemy){                
    
                if(this.target !== null){
                    if(this.game.gameEngine.distanceBetweenObjects(this,target) < (this.width + target.width) + 20){
    
                        this.angle = -this.game.gameEngine.angleBetweenObjects(this,target); 
                    }
                }
            }
        }
    },

    /**
     * Update froggy's movement and behavior after collision with certain objects.
     */
    update: function() {        

        this.x -= this.velocity_x * Math.cos(this.angle);
        this.y -= this.velocity_y * Math.sin(this.angle);

        if(this.collide()){            
                
            if(this.collided_with instanceof Enemy || this.collided_with instanceof Asteroid){
              
                this.game.world.time_trial = 0;

                if(!this.send_message){
                    this.game.world.messenger(this.my_messages[0][Math.floor(Math.random() * this.my_messages[0].length)], this);
                 
                }  

                this.game.gameEngine.explode(this, this.game, 2);                
                
                this.game.world.froggy = null;                       
            }                               
        }else{
            this.behavior();

            switch(Math.round(this.game.world.time_trial)){
                case 15: case 28: case 42: case 66: case 99:           
                    if(!this.send_message){
                        this.game.world.messenger(this.my_messages[1][Math.floor(Math.random() * this.my_messages[1].length)], this);
                      
                    }     
                    break;
            }
        }
    },    
};  
  
