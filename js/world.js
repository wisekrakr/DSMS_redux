const World = function(game){    
    
    this.tag = "World";
    this.fps = FPS;
    this.background_color= "#000000" //'#ffffff00';

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
    this.boss=null;
            
    // Text messages  
    this.messages= new Map();  
    this.worldMessage=new WorldMessage(this);

    this.game = game;

    this.start_game= false;
    this.win = false;
}
 
World.prototype = { 

    constructor : World, 
    distance:0,

    changePerspective:function(object){
       
        let new_distance = this.game.gameEngine.distanceBetweenPoints(
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
            case 1: case 4:
                newGameSound(this.game.gameAudio); 
                this.messenger("W,A,D or Arrows to move, DODGE the ASTEROIDS", this.worldMessage);        
                break;
            case 8: case 11:
                this.messenger("ENEMIES destroy ASTEROIDS, and VICE VERSA", this.worldMessage); 
                break;    
            case 16: case 19:
                this.messenger("SURVIVE for 300 seconds and get the Highest Score", this.worldMessage); 
                break;  
            case 40:
                this.letItRain = true;          
                this.messenger("Protect the Planet from Meteors", this.worldMessage); 
                newStageSound(this.game.gameAudio); 
                break;        
            case 70:
                this.letItRain = false;  
                if(this.froggy === null){
                    //Create a Froggy to escort to a safe haven at a random position
                    this.froggy = new Froggy(this.game, 0, Math.random() * this.height); 
                    this.messenger("Time Trail: A New Escort Mission!", this.worldMessage); 
                    newStageSound(this.game.gameAudio);                                          
                }       
                break;
            case 120:          
                this.number_enemies = ENEMY_NUMBER*2;          
                break;
            case 130:
                if(this.froggy === null){
                    //Create a Froggy to escort to a safe haven at a random position
                    this.froggy = new Froggy(this.game, 0, Math.random() * this.height); 
                    this.messenger("Time Trail: Escort Mission Strikes Again!", this.worldMessage); 
                    newStageSound(this.game.gameAudio);                                          
                }                 
                break;
            case 180:
                this.number_asteroids = ASTEROID_NUMBER*2;  
                this.letItRain = true;          
                this.messenger("Protect the Planet from Meteors... AGAIN!", this.worldMessage); 
                newStageSound(this.game.gameAudio);                
                break;
            case 215:
                this.letItRain = false;          
                break;
            case 220:         
                if(this.froggy === null){
                    //Create a Froggy to escort to a safe haven at a random position
                    this.froggy = new Froggy(this.game, 0, Math.random() * this.height);  
                    this.messenger("Time Trail: Return of the Escort Mission!", this.worldMessage);
                    newStageSound(this.game.gameAudio);              
                }
                break;       
            case 240:
                this.number_asteroids = ASTEROID_NUMBER * 3;
                this.number_enemies = ENEMY_NUMBER * 3;                
                break;
            case 300:
                //BOSS BATTLE AND THEN YOU WIN
                // if(this.boss === null){
                //     this.boss = new Enemy(this.game, 0, Math.random() * this.height, ENEMY_WIDTH * 10, ENEMY_HEIGHT *20);
                //     this.messenger("BOSS BATTLE: ", this.worldMessage);
                //     newStageSound(this.game.gameAudio);         
                // }
                this.win = true;
                
                break;            
        }
    },  
    
    /**
   * This will run the game mechanics. Creates player and keeps track of time, live and death.
   * This will run the outOfBounds and scoreAndObjectHandler functions.
   * This will also hold special events that happen during the game. 
   */
    update: function(){    
        
        if(!this.win && this.start_game){

            if(this.player === null){                       

                this.player = new Player(this.game, this.width/2, this.height/2);                 
                    
                this.score = 0;
              
            }else{       

                let delta = this.game.spaceEngine.delta /1000;
                let clock = this.game.spaceEngine.clock /1000;
                
                this.time_keeper += delta;
                
                if(this.player.live <= 0){
                    // GAME OVER
                    this.game.gameEngine.removeObject(this.player);                 
                                        
                    if(this.death_time === 0){
                        this.death_time = clock;  
                        
                        //Game Over sound
                        this.game.gameAudio.play(750, 0.1, "triangle").stop(0.3);    
                        this.game.gameAudio.play(500, 0.1, "triangle", 0.3).stop(0.6);     
                        this.game.gameAudio.play(380, 0.1, "triangle", 0.6).stop(0.9); 
                        this.game.gameAudio.play(210, 0.1, "triangle", 0.9).stop(1.2); 
                    
                    }      
                    
                    if(clock - this.death_time >= RESPAWN_TIME){     
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
                            this.game.gameEngine.removeObject(met); 
                        }
                        this.meteor_shower.clear();

                        for(let planet of this.planets){    
                            
                            let distance = this.game.gameEngine.distanceBetweenPoints(
                                planet.x, planet.y, this.width, this.height/2
                            );
                    
                            if(distance > 10){
                                planet.x += planet.speed;      
                            }else{
                                this.planets.clear();
                                this.game.gameEngine.removeObject(planet);
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

                    for(let object of this.game.gameEngine.gameObjects){       
                
                        // When object goes out of bounds it will return from the opposite side
                        this.outOfBounds(object);    

                        // Handle exploding objects and setting the Score
                        this.game.scoreAndObjectHandler(object); 
                        
                        this.changePerspective(object);
                    }
                }
            }
        }else{
            this.destroyWorld();
        }
    },

    /**
   * Get all active game objects and clear them from all sets/arrays
   * We basically reset everything here, just to be sure.
   * This will clear all information and we can start a new world.
   */
  destroyWorld : function(){
    for(let object of this.game.gameEngine.gameObjects){ 
      this.game.gameEngine.removeObject(object);    

    }
    this.player = null;
    this.number_asteroids = ASTEROID_NUMBER;
    this.number_enemies = ENEMY_NUMBER;            
    this.enemies.clear();
    this.asteroids.clear();
    this.meteor_shower.clear();
    this.planets.clear();
    this.froggy = null;
    this.time_keeper = 0;    
    this.death_time = 0; 
    this.counter = 0;
    this.time_trial = 0; 
    another_timer = Math.ceil(0.12 * 60);
    if(this.letItRain){
        this.letItRain = false;
    }
  },
    
};



let timer = Math.ceil(0.12 * 60);
function newStageSound(gameAudio){
    timer--;
    
    if(timer > 0){
        
        gameAudio.play(587.3, 0.1, "sine").stop(0.25);
        gameAudio.play(587.3, 0.1, "sine", 0.3).stop(0.35);
        gameAudio.play(659.3, 0.1, "sine", 0.4).stop(0.55);
        gameAudio.play(587.3, 0.1, "sine", 0.6).stop(0.75);
        gameAudio.play(784.0, 0.1, "sine", 0.8).stop(0.95);
        gameAudio.play(740.0, 0.1, "sine", 1.0).stop(1.40);

        timer = 0;
    }   
};
let another_timer = Math.ceil(0.12 * 60);
function newGameSound(gameAudio){
    another_timer--;
    
    if(another_timer > 0){
        
        gameAudio.play(527.3, 0.1, "triangle").setFrequency(689.3, 0.2).stop(0.4);
        gameAudio.play(527.3, 0.1, "triangle", 0.4).setFrequency(689.3, 0.2).stop(0.8);
        gameAudio.play(689.3, 0.1, "triangle", 0.8).setFrequency(527.3, 1.0).stop(1.2);
        gameAudio.play(527.3, 0.1, "triangle", 1.2).setFrequency(689.3, 1.4).stop(1.6);        
        gameAudio.play(527.3, 0.1, "triangle", 1.6).setFrequency(689.3, 1.8).stop(2.0);
        gameAudio.play(689.3, 0.1, "triangle", 2.0).setFrequency(527.3, 2.2).stop(2.4);

        another_timer = 0;
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