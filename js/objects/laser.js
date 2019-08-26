const Laser = function(game,x, y, a, parent) {

    this.tag        = "Laser";
    this.tagNr      = Math.random();
    this.color      = "#faa98b";
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
        if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid) {

          return true;

        }else if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Player){
          
        //   this.game.world.messenger("Got ya bitch", parent);
        }
      
        return false;           
    },
   
    update: function() {

        this.color = this.game.colorPicker([
            "#ffa500",
            "#ffd700",
            "#ed1a26"
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
  
  
    
    
  
 