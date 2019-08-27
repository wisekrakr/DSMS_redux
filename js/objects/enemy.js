const Enemy = function(game, x, y) {

    this.tag        = "Enemy";
    this.tagNr      = Math.random();
    this.color      = "#00ff80";
    this.width      = ENEMY_WIDTH;   
    this.height     = ENEMY_HEIGHT;   
    this.velocity_x = Math.random() * ENEMY_SPEED / FPS;
    this.velocity_y = Math.random() * ENEMY_SPEED / FPS;
    this.x          = x;
    this.y          = y;    
    this.angle      = 0;
    this.speed      = ENEMY_SPEED;
    this.turnSpeed  = ENEMY_TURN_SPEED;
    this.rotation   = 0;  
    this.range      = ENEMY_RANGE;  
    this.canShoot   = false;    
    this.game       = game;  
  
    this.game.instance.gameEngine.gameEngine.addObject(this);  
  };
  
  Enemy.prototype = {
  
    constructor : Enemy,   
    explodeTime: EXPLODE_TIME,
    lastShot: 0,
    fireRate: FIRE_RATE,   
    messages:[
      "You better run!",
      "Imma gonna get ya",
      "I got a bad feeling about this",
      "Don't get cocky",
      "Kamehameha",
      "Do you know Wisekrakr?",
      "I'm Batman!",
      "Weehoo!"
    ], 
    currentMessage:null, 

    pickMessage: function(){      
        return this.messages[Math.floor(Math.random() * this.messages.length)];         
    },
    
    // Function to move towards the player when in range 
    rotateToPlayer: function(){
      for(let sub of this.game.instance.gameEngine.gameEngine.gameObjects){    
        if(sub instanceof Player){
          
          let target = sub;

          if(this.target !== null){
            if(this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) < this.range){

              this.angle = this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this,target); 

              this.canShoot = true;

            }else{

              this.canShoot = false;
                           
            }
          }
        }else if(sub instanceof Asteroid){
          let target = sub;

          if(this.target !== null){
            if(this.game.instance.gameEngine.gameEngine.distanceBetweenObjects(this,target) < (this.width + target.width) + 20){

              this.angle = -this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this,target); 
            }
          }
        }
      }
    },

    // Function that handles creating lasers and shooting towards the player,
    // with a certain fire rate
    shootLaser: function(){
      // Create laser object and fire it      
      let time = this.game.instance.spaceEngine.clock/1000;

      if(this.lastShot === 0){
        this.lastShot = time;
      }      
 
      if(this.canShoot){        

        if(this.currentMessage === null){
          this.currentMessage = this.pickMessage();
        }
        this.game.world.messenger(this.currentMessage, this);
        if(time - this.lastShot >= this.fireRate){

          new Laser(
            this.game,
            this.x + this.width/4 * Math.cos(this.angle),
            this.y + this.height * Math.sin(this.angle),
            this.angle,
            this
          );

          this.lastShot = time;
        }
      }
    }, 

    // Check if there is a collision
    collide: function () {       
      if(this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Asteroid || 
          this.game.instance.gameEngine.gameEngine.collisionObject(this) instanceof Player){            
            return true;
      }    
      return false;         
    },
    
    update: function() {    
      
      if(!this.collide()){

        this.x -= this.velocity_x * Math.cos(this.angle);
        this.y -= this.velocity_y * Math.sin(this.angle);

        this.rotateToPlayer(); 
        this.shootLaser();            
        
      }else{
        
        if(this.explodeTime > 0){          

          this.game.instance.gameEngine.gameEngine.explode(this, this.game);

          this.explodeTime--;                 
          
        }      
      }
    },   
  
  };  
  
  
    
    
  
 