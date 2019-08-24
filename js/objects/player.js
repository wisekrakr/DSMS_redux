const Player = function(game) {

  this.tag        = "Player";
  this.tagNr      = Math.random();
  this.color      = "#ff4d00";
  this.width      = PLAYER_WIDTH;
  this.height     = PLAYER_HEIGHT;
  this.x          = CENTER_X;
  this.y          = CENTER_Y;
  this.angle      = 0;
  this.speed      = PLAYER_SPEED;
  this.turnSpeed  = PLAYER_TURN_SPEED;
  this.rotation   = 90 / 180 * Math.PI;  
  this.velocity_x = 0;
  this.velocity_y = 0;
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
  blinkTime : Math.ceil(BLINK_TIME * FPS),
  blinkNum : Math.ceil(INVUL_TIME / BLINK_TIME),
  invul_colors: [ 
    '#00ffff', //cyan
    '#daa520' //gold
  ],
 
  forward:function() { this.acc = true;}, 
  moveLeft:function()  { this.rotation = this.turnSpeed /180 * Math.PI / this.game.world.fps; },
  moveRight:function() { this.rotation = -this.turnSpeed /180 * Math.PI / this.game.world.fps; },


  collide: function () {
       
    if(!this.invul){
      if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Enemy || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Laser){
        return true;
      }
    }
    return false;
     
  }, 

  invulnerable: function(){
    if(this.invul){     

      if(this.blinkNum > 0){
        
        this.blinkTime--;       
        this.color = this.game.colorPicker(this.invul_colors);          

        if(this.blinkTime === 0){

          this.color      = "#ff4d00";
          this.blinkTime = Math.ceil(BLINK_TIME * FPS);
          this.blinkNum = Math.ceil(INVUL_TIME / BLINK_TIME);
          this.invul = false;
        }
      }  
    }
  },
  

  update:function() {   
           
    // When NOT colliding with something
    if(!this.collide()){

      // Give the player an angle
      this.angle += this.rotation *= this.game.world.friction;     
      
      // When hitting the Up key, give the player velocity and give the thruster a "on" color.
      if(this.acc){
        this.velocity_x += this.speed * Math.cos(this.angle) / this.game.world.fps;
        this.velocity_y += this.speed * Math.sin(this.angle) / this.game.world.fps;
        
        this.thruster.color = this.game.colorPicker(this.thruster.various_colors);

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

      // Explode animation (creating debris)
      if(this.explodeTime > 0){
        this.game.instance.gameEngine.gameEngine.explode(this, this.game);

        this.explodeTime--;      
        
        // Start the invulnerable period.
        this.invul = true;
      }
    }

    // Period of invulnerability after death
    this.invulnerable();
    
  } 
};