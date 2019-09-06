/**
 * Meteors only want to give points to the player. So hit them towards the Meteor Goal
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 */

const Meteor = function(game,x, y) {

    this.tag        = "Meteor";
    this.tag_nr      = Math.random();
    this.color      = "rgb(180,230,245,0.6)";
    this.width      = AS_WIDTH/3.3;    
    this.height     = AS_HEIGHT/3.3; 
    this.init_width = AS_WIDTH/3.3;
    this.init_height= AS_HEIGHT/3.3;   
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
                this.game.gameEngine.explode(this, this.game, 3);
                  
                this.game.world.score -= 20;
            }else if(this.collided_with instanceof Player){
                this.game.gameEngine.explode(this, this.game, 3);

                this.velocity_x = 0;
                this.velocity_y = 0;  

                if(!this.send_message){
                    this.game.world.messenger("+100", this);                   
                }
            }

            // // Bounce of collided object
            // else{
            //     this.angle = -this.game.gameEngine.angleBetweenObjects(this,this.collided_with);

            //     this.velocity_x = -this.velocity_x * AS_SPEED;
            //     this.velocity_y = -this.velocity_y * AS_SPEED;  
            // }
        }else{
            this.x -= this.velocity_x * Math.cos(this.angle); 
            this.y -= this.velocity_y * Math.sin(this.angle); 

            let debrisParts = [];
            for (let i = debrisParts.length; i < 2; i++) {      
                debrisParts[i] = new Debris(this.game, 
                    this.x, this.y, 
                    this.width / i+1, this.height / i+1, 
                    this.color
                    );
    
            } 
        }
        
        
    },    

};  


    
    
  
 