
// canvas
const canvas = document.getElementById('main')
const canvasH = canvas.height
const canvasW = canvas.width

// player
const playerW = 35, playerH = 35
const playerX = 20
let playerY = 100
let playerSpeed = 8
let G = .5

// pipesStack
let pipesStack = []
let obstacleInterval = 1500 // milliseconds
let lastObstable = Date.now()

// game
let gameSpeed = 4
const floorH = 120
let isMouseDown = false
let play = false
let fallTime = 0
let score = 0

/**
 * drawers
 */

const bg = {
    img: document.getElementById('bg'),
    imgW: canvasW,
    bgSpeed: 1,

    imgX_1: 0,
    imgX_2: canvasW,
    draw: (x=0) => {
        const ctx = canvas.getContext('2d')
        ctx.drawImage(bg.img, x, 0)
    },
    animate: () => {
        bg.imgX_1 -= bg.bgSpeed
        bg.imgX_2 -= bg.bgSpeed

        if(bg.imgX_1+canvasW <= 0){
            bg.imgX_1 = canvasW
        }
        if(bg.imgX_2+canvasW <= 0){
            bg.imgX_2 = canvasW
        }

        bg.draw(bg.imgX_1)
        bg.draw(bg.imgX_2)
    }
}

const floor = {
    img: document.getElementById('floor'),
    imgX_1: 0,
    imgX_2: canvasW,
    draw: (x=0) => {
        const ctx = canvas.getContext('2d')
        ctx.drawImage(floor.img, x, canvasH-floorH, 500, floorH)
    },
    animate: () => {
        floor.imgX_1 -= gameSpeed
        floor.imgX_2 -= gameSpeed

        if(floor.imgX_1+canvasW <= 0){
            floor.imgX_1 = canvasW
        }
        if(floor.imgX_2+canvasW <= 0){
            floor.imgX_2 = canvasW
        }

        floor.draw(floor.imgX_1)
        floor.draw(floor.imgX_2)
    }
}

const flappy = {

    img: document.getElementById('flappy'),
    draw: () => {
        const ctx = canvas.getContext('2d')
        ctx.drawImage(flappy.img, playerX, playerY, playerW, playerH)
    }
}

const pipes = {
    img: document.getElementById('pipe'),
    img2: document.getElementById('pipe-ceil'),
    w: 80, 
    h: 500,
    space: 140,

    draw: (obs) => {

        const ctx = canvas.getContext('2d')


        // ceil pipe
        const pipeCeilX = obs.x
        const pipeCeilY = obs.y
        ctx.drawImage(
            pipes.img2,
            pipeCeilX, pipeCeilY,
            pipes.w, pipes.h,
        )

        // floor pipe
        const pipeFloorX = obs.x
        const pipeFloorY = pipes.h + pipes.space + obs.y
        ctx.drawImage(
            pipes.img,
            pipeFloorX, pipeFloorY,
            pipes.w, pipes.h,
        )

        obs.ceil = {
            x: pipeCeilX,
            y: pipeCeilY + pipes.h,
        }
        obs.floor = {
            x: pipeFloorX,
            y: pipeFloorY,
        }
    },

    pushPipe: () => {
        const now = Date.now()
        if( now - lastObstable > obstacleInterval ){            
            const maxH = 0
            const minH = -450
            let newObsH = Math.random() * (maxH - minH) + minH
            const newObstacle = {
                x: canvasW+pipes.w,
                y: newObsH
            }

            pipesStack.push(newObstacle)
            lastObstable = now
        }
    },
    animate: () => {
        for(idx in pipesStack){
            const obs = pipesStack[idx]
            obs.x -= gameSpeed
            if(obs.x + pipes.w <= 0){
                score++
                pipesStack.splice(idx, 1)
            } 
        }
    },

    verifyColision: (obs) => {
        
        pipes.draw(obs)
        if(  playerX+playerW >= obs.x && obs.x+pipes.w > 0 ) {
            if( playerY <= obs.ceil.y ){
                return true
            }
            if( playerY+playerH >= obs.floor.y ) {
                return true
            }
        }
        return false
    }

}

const scoreEl = {
    draw: () => {
        const ctx = canvas.getContext('2d')
        ctx.font = '30px Arial'
        ctx.fillText(score, (canvasW/2), 50)
    }
}
function clearCanvas(){
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvasW, canvasH);
}

function init(){
    setInitialState()
    gameLoop()
    $(canvas).on('mousedown', () => {
        isMouseDown = true
        if(!play){ 
            play = true
        }
    })
    $(canvas).on('mouseup', () => {
        isMouseDown = false
        fallTime = 0
    })

    $(document).on('keydown', function (e) {
        isMouseDown = true
        if(!play){ 
            play = true
        }
    })
    $(document).on('keyup', function (e) {
        isMouseDown = false
        fallTime = 0
    })
}

function gameLoop() {

    clearCanvas()
    
    if(play){
        if( isMouseDown && playerY > 0 ){
            playerY -= playerSpeed
        } else {
            playerY += G * fallTime
            fallTime++
        }
        pipes.pushPipe()
    }
    
    bg.animate()
    pipes.animate()
    

    if( playerY >= canvasH-playerH-floorH )
        return gameOver()

    for(obs of pipesStack){
        if(pipes.verifyColision(obs))
            return gameOver()
        
    }

    floor.animate()
    flappy.draw()
    scoreEl.draw()

    requestAnimationFrame(gameLoop)
}

function setInitialState(){
    score = 0
    play = false
    playerY = 100
    pipesStack = []
    clearCanvas()
    bg.animate()
    flappy.draw()
    floor.animate()
}

function gameOver(){
    setInitialState()
    gameLoop()
}

$(document).ready(function(){
    init()
})