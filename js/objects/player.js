/**
 * Controllable object that needs can't shoot, but has to dodge incoming projectiles
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 */

const Player = function(game) {

  this.tag        = "Player";
  this.tagNr      = Math.random();
  this.color      = "rgb(255,77,0)";
  this.width      = PLAYER_WIDTH;
  this.height     = PLAYER_HEIGHT;
  this.x          = CENTER_X;
  this.y          = CENTER_Y;
  this.angle      = 0;
  this.speed      = PLAYER_SPEED;
  this.rotateSpeed= PLAYER_ROTATE_SPEED;
  this.rotation   = 90 / 180 * Math.PI;  
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.live       = 100;
  this.acc        = false;  
  this.thruster   = null; 
  this.invul      = false;
  this.game       = game; 
 
  this.game.instance.gameEngine.gameEngine.addObject(this);
  this.thruster = new Thruster(this.game); 
};

Player.prototype = {

  constructor : Player,
  explodeTime : EXPLODE_TIME,
  blinkTime : Math.ceil(BLINK_TIME * FPS), // Time the player blinks when invulnerable  
  invul_colors: [ // Player colors when invulnerable
    'rgb(0,255,255)', //cyan
    'rgb(218,165,32)' //gold
  ],
  collidedWith: null,
  myMessages:[], 
  sendMessage:false,
 
  forward:function() { this.acc = true;}, 
  moveLeft:function()  { this.rotation = this.rotateSpeed /180 * Math.PI / this.game.world.fps; },
  moveRight:function() { this.rotation = -this.rotateSpeed /180 * Math.PI / this.game.world.fps; },


  /**
   * If the player collides this will return true and also sets a collision object
   */
  collide: function () {
       
    if(!this.invul){
      if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Enemy || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Laser){

          this.collidedWith = this.game.instance.gameEngine.gameEngine.collisionObject(this);

        return true;
      }
    }
    return false;
     
  },   
  
  /**
   * If the player gets hit it will be invulnerable and blink for a couple of seconds (blinkTime)
   */
  invulnerable: function(){
    if(this.invul){         
        
      this.blinkTime--;       
      this.color = this.game.colorPicker(this.invul_colors);  
      
      if(this.blinkTime === 0){

        this.color      = "rgb(255,77,0)";
        this.blinkTime = Math.ceil(BLINK_TIME * FPS);
        this.blinkNum = Math.ceil(INVUL_TIME / BLINK_TIME);
        this.invul = false;
      }       
    }
  },  
  
  /**
   * Function to subtract damage taken from live (health percentage)
   */
  subtractFromLive: function(){
    let damage = (this.collidedWith.width + this.collidedWith.height) / 2;

    this.live -= damage;  
  },

  /**
   * Updates the player's movement, thruster, invulnerability and exploding
   */
  update:function() {       
    
    // As long as the player has live

    if(this.live > 0){

      // When NOT colliding with something
      if(!this.collide()){

        // Give the player an angle
        this.angle += this.rotation *= this.game.world.friction;     
        
        // When hitting the Up key, give the player velocity and give the thruster a "on" color.
        if(this.acc){
          this.velocity_x += this.speed * Math.cos(this.angle) / this.game.world.fps;
          this.velocity_y += this.speed * Math.sin(this.angle) / this.game.world.fps;
          
          this.thruster.color = this.game.colorPicker(this.thruster.various_colors);
          this.game.instance.gameEngine.gameEngine.explode(this.thruster, this.game, 2);

          this.acc = false;
        }else{
          // Slow the player down when not accelerating.

          this.velocity_x -= this.game.world.friction * this.velocity_x / this.game.world.fps;
          this.velocity_y -= this.game.world.friction * this.velocity_y / this.game.world.fps;

          // Give the thruster a black color to become invisible.
          this.thruster.color = '#ffffff00';
        }
        
        //Add the velocity to the position for movement.
        this.x += this.velocity_x;
        this.y -= this.velocity_y;  
        
      }else{
        // When the player does collide with something.
        // No more velocity
        this.velocity_x = 0;
        this.velocity_y = 0;    
        
        // Substract live from the player
        this.subtractFromLive();

        // Explode animation (creating debris)        
        this.game.instance.gameEngine.gameEngine.explode(this, this.game, 5);
        
        if(!this.sendMessage){
            this.game.world.messenger("Don't Shoot My Spaceship!",this);             
        }           
        // Start the invulnerable period.
        this.invul = true;        
      }

      // Period of invulnerability after death
      this.invulnerable();

    }
  } 
};