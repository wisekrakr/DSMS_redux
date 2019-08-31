const Meteor = function(game,x, y) {

    this.tag        = "Meteor";
    this.tagNr      = Math.random();
    this.color      = "rgb(180,230,245,0.2)";
    this.width      = AS_WIDTH/4;    
    this.height     = AS_HEIGHT/4; 
    this.velocity_x = Math.random() * (AS_SPEED * 4) / FPS;
    this.velocity_y = Math.random() * (AS_SPEED * 4) / FPS;
    this.angle      = Math.random();
    this.speed      = AS_SPEED * 4;       
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

Meteor.prototype = {

    constructor : Meteor,  
    collidedWith:null,  

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
            this.angle = -this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this, this.collidedWith);

            this.velocity_x = -this.velocity_x;
            this.velocity_y = -this.velocity_y;  
        }
        
        this.x += this.velocity_x * Math.cos(this.angle); 
        this.y += this.velocity_y * Math.sin(this.angle); 
    },    

};  
  
  
    
    
  
 