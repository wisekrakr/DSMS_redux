const Debris = function(game, x, y, width, height) {
    
    this.tag        = "Debris";
    this.width      = width;
    this.height     = height;  
    this.velocity_x = Math.random() * 60 / FPS;
    this.velocity_y = Math.random() * 60 / FPS; 
    this.x          = x;
    this.y          = y;
    this.angle      = Math.random() * 180 / Math.PI;
    this.lifeTime   = 2 * FPS;
    this.game       = game;  
    
    this.game.instance.gameEngine.gameEngine.addObject(this);
};

Debris.prototype = {

  constructor : Debris,  

  update: function() {

    this.x += this.velocity_x * Math.cos(this.angle); 
    this.y += this.velocity_y * Math.sin(this.angle);   
    
    if(this.lifeTime > 0){
      this.lifeTime--;      
    }else{
      this.game.instance.gameEngine.gameEngine.removeObject(this);
    }
  },   
  
  

};  


    
    
  
 