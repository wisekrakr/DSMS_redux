const Laser = function(game,x, y, angle) {

    this.tag        = "Laser";
    this.tagNr      = Math.random();
    this.color      = "#faa98b";
    this.width      = 2;
    this.height     = 2;
    this.velocity_x = LASER_SPEED / FPS;
    this.velocity_y = LASER_SPEED / FPS;   
    this.angle      = angle;
    this.speed      = LASER_SPEED;       
    this.x          = x;
    this.y          = y;
    this.lifeTime   = 1 * FPS;
    this.game       = game;  

    this.game.instance.gameEngine.gameEngine.addObject(this);
};

Laser.prototype = {

    constructor : Laser,    

    collide: function () {       
        if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid || 
            this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Player){
          return true;
        }
      
        return false;           
    },
   
    update: function() {
         
        if(this.collide()){
            this.game.instance.gameEngine.gameEngine.removeObject(this);
                
        }else{
            //Set the appropriate speed and direction
            this.x -= this.velocity_x * Math.cos(this.angle);
            this.y -= this.velocity_y * Math.sin(this.angle);

            if(this.lifeTime > 0){
                this.lifeTime--;      
            }else{
                this.game.instance.gameEngine.gameEngine.removeObject(this);
            }
        }
        
    },    

};  
  
  
    
    
  
 