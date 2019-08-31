const Laser = function(game,x, y, a, parent) {

    this.tag        = "Laser";
    this.tagNr      = Math.random();
    this.color      = "rgb(255,165,0)";
    this.width      = LASER_WIDTH; 
    this.height     = LASER_HEIGHT;   
    this.velocity_x = LASER_SPEED / FPS;
    this.velocity_y = LASER_SPEED / FPS;   
    this.angle      = a;
    this.speed      = LASER_SPEED;       
    this.x          = x;
    this.y          = y;
    this.lifeTime   = 1 * FPS;
    this.parent     = parent;
    this.game       = game;  

    this.game.instance.gameEngine.gameEngine.addObject(this);
};

Laser.prototype = {

    constructor : Laser,    

    collide: function () {       
        if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid ||
            this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Player) {

          return true;
        }      
        return false;           
    },
   
    update: function() {

        this.color = this.game.colorPicker([
            "rgb(255,165,0)",
            "rgb(255,215,0)",
            "rgb(237,26,38)"
        ]);
         
        if(this.collide()){
            if(this.explodeTime > 0){
                this.game.instance.gameEngine.gameEngine.explode(this, this.game);

                this.explodeTime--;    
            }
                
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
  
  
    
    
  
 