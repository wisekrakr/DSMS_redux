/**
 * A bullet that an enemy can shoot towards the player and that does damage.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 * @param  {} parent game object that uses this object
 */

const Laser = function(game,x, y, a, parent) {

    this.tag        = "Laser";
    this.tag_nr      = Math.random();
    this.color      = "rgb(255,165,0)";
    this.width      = LASER_WIDTH; 
    this.height     = LASER_HEIGHT; 
    this.init_width = LASER_WIDTH;
    this.init_height= LASER_HEIGHT;     
    this.velocity_x = LASER_SPEED / FPS;
    this.velocity_y = LASER_SPEED / FPS;   
    this.angle      = a;     
    this.x          = x;
    this.y          = y;
    this.lifeTime   = 1 * FPS;
    this.parent     = parent;
    this.game       = game;  

    this.game.gameEngine.addObject(this);
};

Laser.prototype = {

    constructor : Laser,    

     /**
    * If the laser collides this will return true and also sets a collision object
    */
    collide: function () {       
        if(this.game.gameEngine.collisionObject(this) instanceof Asteroid ||
            this.game.gameEngine.collisionObject(this) instanceof Player) {

          return true;
        }      
        return false;           
    },
   
    /**
    * Updates the laser's movement and exploding.
    * Also removes laser after a certain time to simulate a bullet range
    */
    update: function() {

        this.color = this.game.colorPicker([
            "rgb(255,165,0)",
            "rgb(255,215,0)",
            "rgb(237,26,38)"
        ]);
         
        if(this.collide()){
           
            this.game.gameEngine.explode(this, this.game, 3);
                
        }else{
            //Set the appropriate speed and direction
            this.x -= this.velocity_x * Math.cos(this.angle);
            this.y -= this.velocity_y * Math.sin(this.angle);

            if(this.lifeTime > 0){
                this.lifeTime--;      
            }else{
                this.game.gameEngine.removeObject(this);
            }
        }        
    },   
};  
 