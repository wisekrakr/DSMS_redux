const FPS = 30;
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth; 

const PLAYER_WIDTH = WIDTH /50;
const PLAYER_HEIGHT = HEIGHT/50;
const PLAYER_SPEED = 0.3 * FPS;
const PLAYER_TURN_SPEED = 8 * FPS;

const ENEMY_WIDTH = WIDTH /20;
const ENEMY_HEIGHT = HEIGHT/30;
const ENEMY_SPEED = 3 * FPS;
const ENEMY_TURN_SPEED = 6 * FPS;

const LASER_MAX = 10; // Max number of lasers on screen at one time
const LASER_SPEED = 500; // Laser speed in PPS
const FIRE_RATE = 0.06 * FPS; //Duration of explosion animation

const AS_WIDTH = WIDTH/20; // Asteroid width
const AS_HEIGHT = HEIGHT/20; // Asteroid height
const AS_SPEED = 1.7 * FPS;// Asteroid speed
const AS_ROTATE_SPEED = 0.06 * FPS;;// Asteroid speed
const VERTICES = 10;// Asteroid number of vertices of polygon
const AS_RIDGE = 0.3;// Number of Ridges on an Asteroid

const EXPLODE_TIME = Math.ceil(0.3 * FPS); //Duration of explosion animation
const INVUL_TIME = 2; //Invulnerable time for the player after death
const BLINK_TIME = 4; //Blinking animation after death
const CENTER_X = window.innerWidth/2; //Start position on the X-axis for the player
const CENTER_Y = window.innerHeight/2; //Start position on the Y-axis for the player 
