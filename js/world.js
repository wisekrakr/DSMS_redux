const World = function(game){    
    
    this.tag = "World";
    this.fps = FPS;
    this.background_color='#000000';

    this.friction= 0.9;  

    this.width = WIDTH;  
    this.height = HEIGHT;

    this.time_keeper = 0;
    this.death_time = 0;
    this.score = 0;
    this.time_trial = 0;  
    this.time_trial_high = 0;
    this.counter = 0;

    this.number_asteroids=  ASTEROID_NUMBER;
    this.number_enemies= ENEMY_NUMBER;

    // Game Objects
    this.player=new Player(game, this.width/2, this.height/2);
    this.asteroids=new Set();
    this.enemies=new Set();
    this.meteor_shower=new Set();
    this.planets=new Set();

    this.letItRain= false;
    this.planet=false;    
    this.froggy=null;
            
    // Text messages  
    this.messages= new Map();  
    this.worldMessage=new WorldMessage(this);

    this.game = game;
}
 
World.prototype = { 

    constructor : World, 
    distance:0,

    changePerspective:function(object){
       
        let new_distance = this.game.instance.gameEngine.gameEngine.distanceBetweenPoints(
            object.x, object.y, this.width/2, this.height/2
        );
        
        let angle = Math.atan2(this.height/2 - object.y, this.width/2 - object.x);
        
        
       
        if(new_distance > this.distance){  
            let diff = new_distance - this.distance;   
            
            if(object.width >= object.init_width/2 && object.height >= object.init_height/2){
                object.width -= (diff/5000) * (this.fps/10);
                object.height -=  (diff/5000) * (this.fps/10);            
            }
            
            this.distance = new_distance;            
        }else{
            let diff = this.distance - new_distance;      

            if(object.width <= object.init_width && object.height <= object.init_height){
                object.width += (diff/5000) * (this.fps/10);
                object.height +=  (diff/5000) * (this.fps/10);
            }

            this.distance = new_distance;
        }
    
        
      
    },

    /**
     * Out of bounds Detection
     * 
     * @param  {} object game object
     */
    outOfBounds:function(object) {

        if(object.x < 0 - object.width) {
            object.x = this.width + object.width;

        }else if(object.x > this.width + object.width ) { 
            object.x = 0 - object.width;                
        }

        if (object.y < 0 - object.height) { 
            object.y = this.height + object.height;   

        }else if (object.y > this.height + object.height) {
            object.y = 0 - object.height;    
        }      
    },

    /**
     * Links a message to a game object by setting it to a map.
     * This gets rendered by the display
     * 
     * @param  {} message string text
     * @param  {} object sender of message
     */
    messenger : function(message, object){  
        this.messages.set(message, object); 
        object.send_message = true;
    },

    /**
     * Diffulty Changes and Messages.
     * 
     * The game is based on time and this will keep track of that and create scenarios
     * for that time.
     * Keeps track of the high score.
     */
    levelProgression : function(){        
        
        switch(Math.round(this.time_keeper)){   
            case 3:
                this.letItRain = true;          
                this.messenger("Protect the Planet from Meteors", this.worldMessage);    
                break;        
            case 59:
                this.letItRain = false;
                break;
            case 60:          
                this.number_enemies = ENEMY_NUMBER*2;          
                break;
            case 82:
                if(this.froggy === null){
                    //Create a Froggy to escort to a safe haven at a random position
                    this.froggy = new Froggy(this.game, 0, Math.random() * this.height); 
                    this.messenger("Time Trail: Escort Mission!", this.worldMessage);                        
                }                 
                break;
            case 120:
                this.number_asteroids = ASTEROID_NUMBER*2;   
            
                break;
            case 180:         
                if(this.froggy === null){
                    //Create a Froggy to escort to a safe haven at a random position
                    this.froggy = new Froggy(this.game, 0, Math.random() * this.height);  
                    this.messenger("Time Trail 2: Escort Harder!", this.worldMessage);   
                }
                break;       
            case 240:
                this.number_asteroids = ASTEROID_NUMBER * 3;
                this.number_enemies = ENEMY_NUMBER * 3;
                
                break;
        }
    },  
    
    /**
   * This will run the game mechanics. Creates player and keeps track of time, live and death.
   * This will run the outOfBounds and scoreAndObjectHandler functions.
   * This will also hold special events that happen during the game. 
   */
    update: function(){      

        if(this.player === null){

            this.player = new Player(this.game, this.width/2, this.height/2);                 
                
            this.score = 0;
            this.time_keeper = 0;

        }else{       
   
            let delta = this.game.instance.spaceEngine.delta /1000;
            let clock = this.game.instance.spaceEngine.clock /1000;
            
            this.time_keeper += delta;
            
            if(this.player.live <= 0){
                // GAME OVER
                this.game.instance.gameEngine.gameEngine.removeObject(this.player);    
                  
                if(this.death_time === 0){
                    this.death_time = clock;       
                }      
                
                if(clock - this.death_time >= RESPAWN_TIME){                 
                    this.player = null; // Player is null will start a new game
                    this.destroyWorld(); // Remove everything from display and start anew                            
                }        
                
            }else{

                // Conditions for when a player arrives at certain time frame and score setter
                this.levelProgression();

                // case 25 of levelProgression: Create Meteors

                if(this.letItRain){
                   
                    this.game.setPlanets();
                    
                    if(this.counter === 0){
                        this.counter = clock;       
                    }      
                    
                    if(clock - this.counter >= RESPAWN_TIME){                 
                        this.game.setMeteorShower();      
                        this.counter = 0;                               
                    }    
                }else{
                    // Remove meteors and planets
                    for(let met of this.meteor_shower){    
                        this.game.instance.gameEngine.gameEngine.removeObject(met); 
                    }
                    this.meteor_shower.clear();

                    for(let planet of this.planets){    
                       
                        let distance = this.game.instance.gameEngine.gameEngine.distanceBetweenPoints(
                            planet.x, planet.y, this.width, this.height/2
                        );
                
                        if(distance > 10){
                            planet.x += planet.speed;      
                        }else{
                            this.planets.clear();
                            this.game.instance.gameEngine.gameEngine.removeObject(planet);
                        }
                    }
                }
                
                // case 82 of levelProgression: Create Froggy

                if(this.froggy !== null){                     
                    if(this.froggy.following){             
                        this.time_trial += 1 / this.fps; 
                
                    }else{
                        if(this.time_trial > 0){
                            this.score += this.time_trial * 10;

                            if(this.time_trial > this.time_trial_high){
                                this.time_trial_high = this.time_trial;
                            }      
                            this.time_trial = 0;         
                        }            
                    }
                }                                         

                for(let object of this.game.instance.gameEngine.gameEngine.gameObjects){       
            
                    // When object goes out of bounds it will return from the opposite side
                    this.outOfBounds(object);    

                    // Handle exploding objects and setting the Score
                    this.game.scoreAndObjectHandler(object); 
                    
                    this.changePerspective(object);
                }
            }
        }
    },

    /**
   * Get all active game objects and clear them from all sets/arrays
   * We basically reset everything here, just to be sure.
   * This will clear all information and we can start a new world.
   */
  destroyWorld : function(){
    for(let object of this.game.instance.gameEngine.gameEngine.gameObjects){ 
      this.game.instance.gameEngine.gameEngine.removeObject(object);    

    }

    this.enemies.clear();
    this.asteroids.clear();
    this.meteor_shower.clear();
    this.planets.clear();
    this.froggy = null;    
    this.death_time = 0; 
    this.counter = 0;
    this.time_trial = 0; 
    if(this.letItRain){
        this.letItRain = false;
    }
  }
  
};

const WorldMessage = function(world) {
  
    this.width      = world.width/2;    
    this.height     = world.height/2;  
    this.x          = world.width/2; 
    this.y          = world.height/2; 
    
};
  
WorldMessage.prototype = {

    constructor : WorldMessage,    

};      