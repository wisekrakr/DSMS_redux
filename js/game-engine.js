const GameEngine = function(){

    this.gameEngine = {

        gameObjects: new Set(),
        to_be_removed:new Set(),

        /* Out of bounds Detection */
        addObject : function(object) {

            this.gameObjects.add(object, object.tagNr);              
        },

        /* Player Movement */
        removeObject : function(object) {   

            this.gameObjects.delete(object, object.tagNr);
            this.to_be_removed.add(object, object.tagNr);
        },
        
        update : function(){
            
            for(let object of this.gameObjects){     

                object.update();            
            }
        },

        distanceBetweenObjects : function(object1, object2){
            let attackDistanceX = object1.x - object2.x;
            let attackDistanceY = object1.y - object2.y;

            return Math.hypot(attackDistanceX, attackDistanceY);
        },

        distanceBetweenPoints : function(x1, y1, x2, y2){
            return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
        },

        angleBetweenObjects : function(object1, object2){
            let attackDistanceX = object1.x - object2.x;
            let attackDistanceY = object1.y - object2.y;

            return Math.atan2(attackDistanceY, attackDistanceX);
        },

        collision : function(object){  
            for (let sub of this.gameObjects) {      

                if (sub !== object && sub.tag !== "Thruster" && sub.tag !== 'Debris') {   
                    
                    if (this.distanceBetweenObjects(object, sub) < object.height + sub.height ||
                        this.distanceBetweenObjects(object, sub) < object.width + sub.width) {                
                        return true;
                    }else{
                        return false;
                    }    
                }
            }
        },

        collisionObject : function(object){ 
            let collisionObject; 

            for (let sub of this.gameObjects) {      

                if (sub !== object && sub.tag !== "Thruster" && sub.tag !== 'Debris') {   
                    
                    if (this.distanceBetweenPoints(object.x, object.y, sub.x, sub.y) < 
                        object.height + sub.height && object.width + sub.width) {   

                        collisionObject = sub;
                    }
                }
            }
            return collisionObject;
        },


        explode : function(object, game){
            
            let debrisParts = [];
            for (let i = debrisParts.length; i < 5; i++) {      
                debrisParts[i] = new Debris(game, object.x, object.y, object.width / i+1, object.height / i+1);
     
            } 
        },        

        size : function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        }
    }

    this.update = function() {
     
        this.gameEngine.update();
        
    };
}

GameEngine.prototype = { constructor : GameEngine };