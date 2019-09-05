/* World constants */

const WIDTH = window.innerWidth; // World and canvas width, have the width of the screen size
const HEIGHT = window.innerHeight; // World and canvas height, have the height of the screen size
const FPS = 60; // 60/1000 (60 frames per second)

/* Game constants */

const EXPLODE_TIME = Math.ceil(0.12 * FPS); //Duration of explosion animation
const DSMS_HIGH_SCORES = "dsms_highscores";
const ASTEROID_NUMBER = 4; //Begin stage: 5 asteroids
const ENEMY_NUMBER = 1; //Begin stage: 1 enemy 

/* Player constants */

const PLAYER_WIDTH = 10;
const PLAYER_HEIGHT = 10;
const PLAYER_SPEED = 0.05 * FPS; 
const PLAYER_ROTATE_SPEED = 5 * FPS; // Rotate speed for the player

const INVUL_TIME = 2; //Invulnerable time for the player after death
const BLINK_TIME = 4; //Blinking animation after death

/* Enemy constants */

const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 10; 
const ENEMY_SPEED = 0.5 * FPS;
const ENEMY_TURN_SPEED = 2 * FPS; // Speed to turn towards a target
const ENEMY_RANGE = 350; // Radius range for the enemy to attack in

/* Laser constants */

const LASER_WIDTH = 2;
const LASER_HEIGHT = 2;
const LASER_MAX = 10; // Max number of lasers on screen at one time
const LASER_SPEED = 300; // Laser speed in PPS
const FIRE_RATE = 0.03 * FPS;

/* Asteroid constants */

const AS_WIDTH = 40; // Asteroid radius
const AS_HEIGHT = 40; // Asteroid height
const AS_SPEED = 0.6 * FPS;// Asteroid speed
const AS_ROTATE_SPEED = 0.03 * FPS;// Asteroid rotation speed
const VERTICES = 10;// Asteroid number of vertices of polygon
const AS_RIDGE = 0.3;// Number of Ridges on an Asteroid

/* Text constants */

const TEXT_SIZE = 25; // Text font size in pixels
const RESPAWN_TIME = 5; // 5 seconds after Game Over the game will restart
