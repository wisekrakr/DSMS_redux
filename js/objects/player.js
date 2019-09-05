/**
 * Controllable object that needs can't shoot, but has to dodge incoming projectiles
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 */

const Player = function(game,x,y) {

  this.tag        = "Player";
  this.tag_nr     = Math.random();
  this.color      = "rgb(255,77,0)";
  this.width      = PLAYER_WIDTH;
  this.height     = PLAYER_HEIGHT;
  this.init_width = PLAYER_WIDTH;
  this.init_height= PLAYER_HEIGHT;   
  this.x          = x;
  this.y          = y;
  this.angle      = 0;
  this.speed      = PLAYER_SPEED;
  this.rotate_speed= PLAYER_ROTATE_SPEED;
  this.rotation   = 90 / 180 * Math.PI;  
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.live       = 100;
  this.acc        = false;
  this.invul      = false;
  this.game       = game; 
 
  this.game.instance.gameEngine.gameEngine.addObject(this);
};

Player.prototype = {

  constructor : Player,
  explode_time : EXPLODE_TIME,
  blink_time : Math.ceil(BLINK_TIME * FPS), // Time the player blinks when invulnerable  
  invul_colors: [ // Player colors when invulnerable
    'rgb(0,255,255)', //cyan
    'rgb(218,165,32)' //gold
  ],
  collided_with: null,
  my_messages:[], 
  send_message:false,
 
  forward:function() { this.acc = true;}, 
  moveLeft:function()  { this.rotation = this.rotate_speed /180 * Math.PI / this.game.world.fps; },
  moveRight:function() { this.rotation = -this.rotate_speed /180 * Math.PI / this.game.world.fps; },


  /**
   * If the player collides this will return true and also sets a collision object
   */
  collide: function () {
       
    if(!this.invul){
      if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Enemy || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Laser){

          this.collided_with = this.game.instance.gameEngine.gameEngine.collisionObject(this);

        return true;
      }
    }
    return false;
     
  },   
  
  /**
   * If the player gets hit it will be invulnerable and blink for a couple of seconds (blink_time)
   */
  invulnerable: function(){
    if(this.invul){         
        
      this.blink_time--;       
      this.color = this.game.colorPicker(this.invul_colors);  
      
      if(this.blink_time === 0){

        this.color  = "rgb(255,77,0)";
        this.blink_time = Math.ceil(BLINK_TIME * FPS);     
        this.invul = false;
      }       
    }
  },   
  
  /**
   * Simulates boosting
   */
  boosting: function(){
    let debrisParts = [];

    for (let i = debrisParts.length; i < 2; i++) {      
        debrisParts[i] = new Debris(this.game, 
            this.x - this.width * Math.cos(-this.angle), 
            this.y + this.height * Math.sin(this.angle), 
            (this.width/3) / i+1, (this.height/3) / i+1, 
            this.game.colorPicker([
              'rgb(255,0,0)', //red
                'rgb(255,153,0)',  //orange
                'rgb(255,255,102)' //yellow
              ])
            );
    }
  },
  
  /**
   * Updates the player's movement, boosting, invulnerability and exploding
   */
  update:function() {      
    
    // As long as the player has live

    if(this.live > 0){

      // When NOT colliding with something
      if(!this.collide()){

        // Give the player an angle
        this.angle += this.rotation *= this.game.world.friction;     
        
        // When hitting the Up key, give the player velocity and give a boosting animation.
        if(this.acc){
          this.velocity_x += this.speed * Math.cos(this.angle) / this.game.world.fps;
          this.velocity_y += this.speed * Math.sin(this.angle) / this.game.world.fps;

          // Simulates boosting engine
          this.boosting();

          this.acc = false;
        }else{
          // Slow the player down when not accelerating.

          this.velocity_x -= this.game.world.friction * this.velocity_x / this.game.world.fps;
          this.velocity_y -= this.game.world.friction * this.velocity_y / this.game.world.fps;
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
        this.game.instance.gameEngine.gameEngine.subtractFromLive(this);   

        // Explode animation (creating debris)        
        this.game.instance.gameEngine.gameEngine.explode(this, this.game, 5);        
              
        // Start the invulnerable period.
        this.invul = true;        
      }

      // Period of invulnerability after death
      this.invulnerable();

    }
  } 
};