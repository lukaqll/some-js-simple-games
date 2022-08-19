
    const canvas = $('#canvas').get(0),
          tetrisLength = 10,
          canvasH = 30,
          dpr = 25,
          partWidth = 1,
          gamePieces = [],
          fillCanvas = []
          

    const pieces = {
        'T': [
            [1,1,1],
            [0,1,0],
        ],
        'dot': [
            [1]
        ],
        'O': [
            [1,1],
            [1,1]
        ],
        'L': [
            [1,0],
            [1,0],
            [1,1],
        ],
        'I': [
            [1],
            [1],
            [1],
        ],
        'S': [
            [0,1],
            [1,1],
            [1,0],
        ],
        'i': [
            [1,1]
        ]
    }

    function setupCanvas(){
        const ctx = canvas.getContext('2d');
        return ctx;
    }

    function clearCanvas(){
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function buildSquare(x=0, y=0, color='red'){
        const ctx = setupCanvas()
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.rect(x, y, partWidth, partWidth)
        ctx.fill()
    }

    function buildPiece( piece ){

        const p = piece.type
        
        for(let i=0; i<p.length; i++){
            
            for(let j=0; j<p[i].length; j++){

                if( p[i][j] === 1 ){
                    buildSquare(j+Math.floor(piece.x), i+Math.floor(piece.y), piece.color)
                }
            }
        }

    }

    function getPieceHeight( piece ){

        const p = piece.type
        let height = 0
        for(let i=0; i<p.length; i++){
            
            if( p[i].includes(1) )
                height++
        }
        return height
    }

    function rotatePiece( piece ){
        p = piece.type
        const rotated = p[0].map((val, index) => p.map(row => row[index]).reverse())
        piece.type = rotated
    }

    function pushNewPiece(){

        const types = ['T', 'dot', 'O', 'L', 'I', 'i', 'S']
        const colors = ['red', 'blue', 'green', 'yellow', 'green', 'lightblue', 'grey']

        const randIndex = Math.random() * (types.length)
        const randColorIndex = Math.random() * (colors.length)

        gamePieces.push({
            type: pieces[ types[Math.floor(randIndex)] ],
            color: colors[Math.floor(randColorIndex)],
            x: 4, y:0
        })
    }

    function fillCanvas( piece ){
        
    }

    function start() {
        pushNewPiece()
        renderGame()
    }

    function renderGame(){

        clearCanvas()

        for (const p of gamePieces) {
            buildPiece(p)
        }
        const piece = gamePieces.slice(-1)[0]
        
        const pieceHeight = getPieceHeight(piece)
        if( piece.y < canvasH-pieceHeight ){
            piece.y = (piece.y)+.05
        } else {
            
            pushNewPiece()
        }

        buildPiece(piece)

        requestAnimationFrame(renderGame)
    }

    function bindEvents(){

        const events = {
            // up
            '38': function(){
                const piece = gamePieces.slice(-1)[0]
                rotatePiece(piece)
            },
            // down
            '40': function(){
                
            },
            // left
            '37': function(){
                const piece = gamePieces.slice(-1)[0]
                piece.x = piece.x-1
            },
            // right
            '39': function(){
                const piece = gamePieces.slice(-1)[0]
                piece.x = piece.x+1
            }

        }

        $(document).on('keydown', function(e){
            const fn = events[e.keyCode]
            fn && fn()
        })
    }

    $(document).ready(function(){
        bindEvents()
        start()
    })
