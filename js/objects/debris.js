/**
 * Simulates particles during explosions of objects.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 * @param  {} w width in pixels
 * @param  {} h height in pixels
 * @param  {} color coloring for the object
 */

const Debris = function(game, x, y, w, h, color) {
    
    this.tag        = "Debris";
    this.color      = color;
    this.width      = w;   
    this.height     = h;  
    this.init_width = w;
    this.init_height= h;   
    this.velocity_x = Math.random() * 60 / FPS;
    this.velocity_y = Math.random() * 60 / FPS; 
    this.x          = x;
    this.y          = y;
    this.angle      = Math.random() * 180 / Math.PI;
    this.lifeTime   = 0.8 * FPS;
    this.game       = game;  
    
    this.game.instance.gameEngine.gameEngine.addObject(this);
};

Debris.prototype = {

  constructor : Debris,  

  /**
   * Update debris movement and remove from display after 2 seconds
   */
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


    
    
  
 