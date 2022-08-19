
    const G = .05,
        WW = window.innerWidth,
        WH = window.innerHeight,
        container = $('#container'),
        canvas = document.querySelector('canvas')

    const CW = canvas.width,
          CH = canvas.height,
          earthRadius = 150,
          bulletRadius = 10,
          cannonWidth = 15

    let play = false
    const initialPlayerVel = 5
    const initialBVel = 5

    const eWeight = 30
    const bWeight = 1

    const bPos = {
        y: (CH/2),
        x: (CW/2)
    }
    const bVel = {
        x: 5,
        y: 3
    }

    const p1 = {
        name: 'p1',
        y: 300,
        x: 100,
        h: 150,
        w: 10,
        vel: initialPlayerVel,
        moving: false,
        score: 0
    }

    const p2 = {
        name: 'p2',
        y: 300,
        x: CW-100,
        h: 150,
        w: 10,
        vel: initialPlayerVel,
        moving: false,
        score: 0
    }
    
    let frameId = null

    function drawBullet(){
        const context = canvas.getContext('2d')
        context.beginPath()
        context.fillStyle = '#fff'

        let f = G * ((bWeight * eWeight) / (CH-bPos.y)^2)
        
        // top colision
        if( bPos.y <= 0) {
            bVel.y *= -1
        }
        // bottom colision
        if( ((bPos.y+bulletRadius) >= CH) ){
            bVel.y *= -1
        }

        // left colision
        if( (bPos.x-bulletRadius) <= 0 ){
            win(p2)
        } 
        // player 1 colision
        else  if( ((bPos.x) <= (p1.w+p1.x)) && ((bPos.y+bulletRadius) >= p1.y) && ((bPos.y) <= (p1.y+p1.h)) ){
            playerColision()
        }

        // right colision
        if( (bPos.x+bulletRadius) >= CW ){
            win(p1)
        }
        // player 2 colision
        else if( ((bPos.x+bulletRadius) >= p2.x) && ((bPos.y+bulletRadius) >= p2.y) && ((bPos.y) <= (p2.y+p2.h)) ){
            playerColision()
        }
        

        bPos.x += bVel.x
        bPos.y += bVel.y

        context.arc( bPos.x, bPos.y, bulletRadius, 0, 2*Math.PI, false )
        context.fill()
    }

    function drawReact(player){
        const ctx = canvas.getContext('2d')
        ctx.beginPath()
        ctx.fillStyle = '#fff'
        ctx.rect(player.x, player.y, player.w, player.h)
        ctx.fill()
    }


    function clearCanvas(){
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height);
    }    

    const bindEvents = () => {
        $(document).on('keydown', async function(e) {
            const evt = MoveStartEvents[e.key]
            if(evt){
                await evt()
            }
        })
        $(document).on('keyup', async function(e) {
            const evt = MoveStopEvents[e.key]
            if(evt){
                await evt()
            }
        })
    }

    function verifyMove( player ) {

        if( player.moving == 'up' && player.y > 0 ){
            player.y -= player.vel
        }

        if( player.moving == 'down' && (player.y+player.h) < CH ){
            player.y += player.vel
        }

        if( (player.y+player.h) >= CH || player.y <= 0 )
            player.moving = false

    }

    function playerColision(){
        if( bVel.x < 0 ){
            bVel.x -= .3
        } else {
            bVel.x += .3
        }
        bVel.x *= -1
        p1.vel += .3
        p2.vel += .3
    }

    const MoveStartEvents = {
        w: () => {
            p1.moving = 'up'
        },
        s: () => {
            p1.moving = 'down'
        },
        
        ArrowUp: () => {
            p2.moving = 'up'
        },
        ArrowDown: () => {
            p2.moving = 'down'
        },
        ' ': () => {
            if( !play ){
                play = true
                start()
            }
        }
    }
    const MoveStopEvents = {
        w: () => {
            p1.moving = false
        },
        s: () => {
            p1.moving = false
        },
        
        ArrowUp: () => {
            p2.moving = false
        },
        ArrowDown: () => {
            p2.moving = false
        },
    }

    function start () {
        if(!play) return 

        init()
        frameId = requestAnimationFrame(start)
    }


    const init = () => {
        clearCanvas()

        drawBullet()

        verifyMove(p1)
        verifyMove(p2)

        drawReact(p1)
        drawReact(p2)
    }

    function win (winner=null){

        play = false

        if(winner) {
            winner.score++
            $(`#${winner.name}-score`).html(winner.score)
        }

        bPos.y = CH/2
        bPos.x = CW/2
        bVel.x = initialBVel
        p1.vel = initialPlayerVel
        p2.vel = initialPlayerVel
        

    }

$(document).ready(function(){
    bindEvents()
    init()
})
