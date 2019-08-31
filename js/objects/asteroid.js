const Asteroid = function(game,x, y, w, h) {

    this.tag        = "Asteroid";
    this.tagNr      = Math.random();
    this.color      = "rgba(255,255,255,0.3)";
    this.width      = w;    
    this.height     = h;   
    this.velocity_x = Math.random() * AS_SPEED / FPS *(Math.random() < 0.5 ? 1 : -1);
    this.velocity_y = Math.random() * AS_SPEED / FPS *(Math.random() < 0.5 ? 1 : -1);
    this.angle      = Math.random() * Math.PI * 2;
    this.speed      = AS_SPEED;
    this.rotateSpeed= Math.random() * AS_ROTATE_SPEED;   
    this.x          = x;
    this.y          = y;
    this.vertices   = Math.floor(Math.random() * (VERTICES + 1) + VERTICES /2);
    this.offset     = [];      
    this.game       = game;  

    this.game.instance.gameEngine.gameEngine.addObject(this);

    //Create the vertex offset array
    for(let i = 0; i < this.vertices; i++){
        this.offset.push(Math.random() * AS_RIDGE * 2 + 1 - AS_RIDGE);
    }
};

Asteroid.prototype = {

    constructor : Asteroid,  
    explodeTime: EXPLODE_TIME,
    collidedWith: null,

    collide: function () {       
        if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Enemy || 
            this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Player || 
            this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Laser){
          
            this.collidedWith = this.game.instance.gameEngine.gameEngine.collisionObject(this);

          return true;
        }
      
        return false;         
    },
    
   
    update: function() {
         
        if(this.collide()){
            //Check what kind of object and either explode or blow in pieces        

            if(this.explodeTime > 0){
                this.game.instance.gameEngine.gameEngine.explode(this, this.game);

                this.explodeTime--;    
            }

        }else{
             //Set the appropriate speed and direction 

            this.x += this.velocity_x; 
            this.y += this.velocity_y; 
        }
        //Set the appropriate rotation         
        
        this.angle += this.rotateSpeed / this.game.world.fps;
    },    

};  
  
  
    
    
  
 