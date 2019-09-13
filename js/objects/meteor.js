/**
 * Meteors only want to give points to the player. So hit them towards the Meteor Goal
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 */

const Meteor = function(game,x, y) {

    this.tag        = "Meteor";
    this.tag_nr     = Math.random();
    this.color      = "rgb(180,230,245,0.6)";
    this.width      = AS_WIDTH/2.5;    
    this.height     = AS_HEIGHT/2.5; 
    this.init_width = AS_WIDTH/2.5;
    this.init_height= AS_HEIGHT/2.5;   
    this.velocity_x = Math.random() * (AS_SPEED * 2) / FPS;
    this.velocity_y = Math.random() * (AS_SPEED * 2) / FPS;
    this.angle      = Math.random();
    this.speed      = AS_SPEED * 2;       
    this.x          = x;
    this.y          = y;
    this.vertices   = Math.floor(Math.random() * (VERTICES + 1) + VERTICES /2);
    this.offset     = [];  
    this.game       = game;  

    this.game.gameEngine.addObject(this);

    //Create the vertex offset array
    for(let i = 0; i < this.vertices; i++){
        this.offset.push(Math.random() * AS_RIDGE * 2 + 1 - AS_RIDGE);
    }
};

Meteor.prototype = {

    constructor : Meteor,  
    collided_with:null,  
    send_message:false,
    explode_time:EXPLODE_TIME,
    my_messages:["Got em","Yup","Cya","No more","ya busted","too fast","splat","zzzzip","whack","pow!"],

    /**
    * If the meteor collides this will return true and also sets a collision object
    */
    collide: function () {       
        if(this.game.gameEngine.collisionObject(this) instanceof Enemy || 
          this.game.gameEngine.collisionObject(this) instanceof Player || 
          this.game.gameEngine.collisionObject(this) instanceof Laser || 
          this.game.gameEngine.collisionObject(this) instanceof Planet){   
              
            this.collided_with = this.game.gameEngine.collisionObject(this);

            return true;
      }    
      return false;      
    },

    /**
     * Function to angle towards the Planet, when in range 
     */
    behavior: function(){
        for(let target of this.game.gameEngine.gameObjects){    
          if(target instanceof Planet){           
  
            if(this.target !== null){
              if(this.game.gameEngine.distanceBetweenObjects(this,target) < 800){
  
                this.angle = this.game.gameEngine.angleBetweenObjects(this,target); 
            
              }
            }
          }
        }
      },
   
    /**
    * Updates the meteor's movement and exploding.  
    */
    update: function() {
         
        this.behavior();
        
        if(this.collide()){
            // Get destroyed.
            if(this.collided_with instanceof Planet){
                this.game.gameEngine.explode(this, this.game, 2);
                  
                this.game.world.score -= 20;
            }else if(this.collided_with instanceof Player){
                this.game.gameEngine.explode(this, this.game, 2);

                this.velocity_x = 0;
                this.velocity_y = 0;  

                if(!this.send_message){
                  this.game.world.messenger(this.my_messages[Math.floor(Math.random() * this.my_messages.length)], this);                      
                }
            }

        }else{
            this.x -= this.velocity_x * Math.cos(this.angle); 
            this.y -= this.velocity_y * Math.sin(this.angle); 

            this.color = this.game.colorPicker([
              "rgba(221,51,9, 0.7)",
              "rgba(227,158,3, 0.7)",
              "rgba(225,231,5, 0.7)",
              "rgba(200,250,189, 0.7)"
            ]);
        } 
    },    
};  


    
    
  
 