/**
 * A object that needs to cross the galaxy and it needs help.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 */
const Froggy = function(game,x ,y) {

    this.tag        = "Froggy";
    this.tagNr      = Math.random();
    this.color      = "#ffffff";
    this.width      = PLAYER_WIDTH;
    this.height     = PLAYER_HEIGHT;  
    this.velocity_x = Math.random() * ENEMY_SPEED / FPS;
    this.velocity_y = Math.random() * ENEMY_SPEED / FPS;
    this.x          = x;
    this.y          = y;    
    this.angle      = 0;
    this.speed      = ENEMY_SPEED;
    this.turnSpeed  = ENEMY_TURN_SPEED;
    this.rotation   = 0;    
    this.game       = game;
    
    this.game.instance.gameEngine.gameEngine.addObject(this);
};

Froggy.prototype = {

    constructor : Froggy,
    collidedWith:null,
    explodeTime: EXPLODE_TIME,
    myMessages: [
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
    sendMessage:false,
    following:false,
  
    /**
    * If the enemy collides this will return true and also sets a collision object
    */
    collide: function () {       
        if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Enemy || 
            this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid){       
                
                this.collidedWith = this.game.instance.gameEngine.gameEngine.collisionObject(this);

            return true;
        }    
        return false;         
    },

    /**
     * Function to angle towards the player when in range 
     */
    behavior: function(){

        for(let target of this.game.instance.gameEngine.gameEngine.gameObjects){    
          if(target instanceof Player){    

            //Go towards Player
            if(this.target !== null){
                if(this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) < 250){
  
                    this.angle = this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this,target); 
                     
                    this.following = true;

                    if(this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) < target.width * 2){
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
                    if(this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) < (this.width + target.width) + 20){
    
                        this.angle = -this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this,target); 
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
                
            if(this.collidedWith instanceof Enemy || this.collidedWith instanceof Asteroid){
              
                this.game.world.timeTrial = 0;

                if(!this.sendMessage){
                    this.game.world.messenger(this.myMessages[0][Math.floor(Math.random() * this.myMessages[0].length)], this);
                 
                }  

                this.game.instance.gameEngine.gameEngine.explode(this, this.game, 3);                
                
                this.game.world.froggy = null;                       
            }                               
        }else{
            this.behavior();

            switch(Math.round(this.game.world.timeTrial)){
                case 15: case 28: case 42: case 66: case 99:           
                    if(!this.sendMessage){
                        this.game.world.messenger(this.myMessages[1][Math.floor(Math.random() * this.myMessages[1].length)], this);
                      
                    }     
                    break;
            }
        }
    },    
};  
  
