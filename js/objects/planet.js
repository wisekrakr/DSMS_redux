/**
 * A Planet to protect from meteors. Will scroll in screen from the sides.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 */
  
const Planet = function(game) {

    this.tag        = "Planet";
    this.tagNr      = Math.random();
    this.color      = "rgba(224,0,238, 1)";
    this.width      = AS_WIDTH*2;    
    this.height     = AS_HEIGHT*2;  
    this.x          = 0;
    this.y          = HEIGHT/2; 
    this.angle      = 0;
    this.velocity_x = 200 / FPS;
    this.velocity_y = 0;      
    this.game       = game;  

    this.game.instance.gameEngine.gameEngine.addObject(this);
    
};

Planet.prototype = {

    constructor : Planet,  
    collidedWith:null,  
    sendMessage:false,
    explodeTime:EXPLODE_TIME*2,
    myMessages:[
        fail=[
            "ow this hurts",
            "why? Flubelie! WHY?!?!",
            "awww too bad"
        ],
        win=[
            "our world thanks you",
            "hail to our champion",
            "you're so sexy!"
        ]    
    ],
    hitsUntilDestruction:0, // 6 hits will destroy the planet

    /**
    * If the Planet collides this will return true and also sets a collision object
    */
    collide: function () {       
        if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Meteor){   
              
            this.collidedWith = this.game.instance.gameEngine.gameEngine.collisionObject(this);

            return true;
      }    
      return false;      
    },
   
    /**
    * Updates movement and collision
    */
    update: function() {

        let distance = this.game.instance.gameEngine.gameEngine.distanceBetweenPoints(
            this.x, this.y, CENTER_X, CENTER_Y
        );

        if(distance > 10){
            this.x += this.velocity_x; 
            this.y += this.velocity_y;  
        }      
         
        if(this.collide()){
                       
            if(!this.sendMessage){
                this.game.world.messenger(this.myMessages[0][Math.floor(Math.random() * this.myMessages[0].length)] + " -1000", this);
            }
            this.hitsUntilDestruction++;
        }





        // TODO WHAT TO DO WHEN GETTING HIT OR GETTING HIT TO MANY TIMES!
        if(this.hitsUntilDestruction > 0){
            this.color = "rgba(224,0,238, " + 1/this.hitsUntilDestruction + ")"; 
           

            if(this.hitsUntilDestruction === 6){
                this.color = "rgba(224,0,238, 1)";
                this.game.instance.gameEngine.gameEngine.explode(this, this.game, 7);
                console.log("explode planet")
            }
        }
                
    },    

};      