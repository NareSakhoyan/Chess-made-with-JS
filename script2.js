let tr = document.getElementsByTagName("tr");
let td = document.getElementsByTagName("td");
let chessBoardArr = [["wrook", "wknight", "wbishop", "wking", "wqueen", "wbishop", "wknight", "wrook"],
    ["wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn"],
    [],
    [],
    [],
    [],
    ["bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn"],
    ["brook", "bknight", "bbishop", "bking", "bqueen", "bbishop", "bknight", "brook"]];
let moves = {
    "pawn": [],
    "rook":[],
    "knight":[],
    "bishop":[],
    "queen":[],
    "king":[],
};                                //turn == true? white: black
let step = false, place1, place2, turn = true, place1X, place1Y, place2X, place2Y, wKing = [0, 3], bKing = [7, 3], whiteIsCheck = false, blackIsCheck = false, currentMove = [];
let possibleMovesArr = [], canEatArr = [], currElem = [];

window.onload = function () {
    let pieces = [["bpawn", "brook", "bknight", "bbishop", "bqueen", "bking"], ["wpawn", "wrook", "wknight", "wbishop", "wqueen", "wking"]];
    givingIDsToTd();
    colorBoard();
    newGame();
    bindOnClickFunction();
};
function givingIDsToTd(){
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            tr[i].children[j].id = ''+i+j
        }
    }
}
function colorBoard(){
    for (let i = 1, len = td.length; i < len; i+=2) {
        let tmp = i;
        if (parseInt(i/8)%2) {
            tmp = i-1;
        }
        td[tmp].classList.add("blacksPlace");
    }
}

function newGame() {
    chessBoardArr.map((row, i) =>{
        row.map((item, j)=>{
            if(item){
                tr[i].children[j].firstChild.src = `images/${item}.png`;
                tr[i].children[j].firstChild.alt = item
            }
        })
    })
}

function bindOnClickFunction(){
    for (let i = 0, len = td.length; i < len; ++i) {
        td[i].addEventListener('click', function (event) {
            onClickHandler(event)
        })
    }
}

function onClickHandler(e) {
    let tmp = e.target;
    if(step){
        place2 = tmp.id? tmp.id: tmp.parentElement.id;//վերցնում ա էդ էլէմենտի տեղը

        //եթե իրա վրա ա նշում
        if (place1 == place2) {
            step = !step;
            clean()
        }
        else{
            place2X = place2[0];
            place2Y = place2[1];
            let place1Value = chessBoardArr[place1X][place1Y];//առաջին տեղում ինչ ա
            let place2Value = chessBoardArr[place2X][place2Y];//երկրորդ տեղում ինչ ա
            let col = place1Value[0];//էս անիմաստ ա turn-ով ստուգի
            let isInPossibleMovesArr = !!possibleMovesArr.find(i => (i[0] == place2X && i[1] == place2Y));
            let isInCanEatArr = !!canEatArr.find(i => (i[0] == place2X && i[1] == place2Y));

            if (isInPossibleMovesArr || isInCanEatArr){
                currElem[0][0] = place1X;
                currElem[0][1] = place1Y;
                currElem[1][0] = place2X;
                currElem[1][1] = place2Y;
                currentMove = [[place1X, place1Y], [place2X, place2Y]];

                //քայլ պիտի անի, քայլը անում ա, ստուգում ա եթե ինքը շախ ա բացում, չի անում էդ քայլը, եթե չի բացում ստուգում ա դիմացինին շախ անում  աթե չէ

                chessBoardArr[place1X][place1Y] = "";
                chessBoardArr[place2X][place2Y] = place1Value;
                clean();

                if(funcThatCallsIsChecking(place1Value[0])){
                    chessBoardArr[place1X][place1Y] = place1Value;
                    chessBoardArr[place2X][place2Y] = place2Value;
                    let k = turn? blackIsCheck: whiteIsCheck;//ստուգում եմ եթե շախ ա խաղացողը խաղում ա էլի շախ ա լինում քայլը հետ եմ տալիս
                    let king = turn? wKing: bKing;
                    document.getElementById(`${king[0]}${king[1]}`).classList.add('isChecked');
                    setTimeout(()=>{
                        document.getElementById(`${king[0]}${king[1]}`).classList.remove('isChecked');
                    }, 1500);
                    clean();
                    // turn = !turn;
                    step = !step;
                }
                else{
                    clean();
                    turn = !turn;
                    if(funcThatCallsIsChecking(place1Value[0]=="w"? "b": "w")){

                    }
                    if (place1Value[1] == "p" && ((place2X == 0 && col == "w") || (place2X == 7 && col == "b"))) {
                        makeQueen([[place1X, place1Y], [place2X, place2Y]])
                    }
                    else{
                        changeImages(currentMove)
                    }
                    //saving King's place
                    if (place1Value[3] == "n") {//place1Value.substr(1, 4) == "King"
                        if (place1Value[0] == "b"){
                            bKing = [...[place2X, place2Y]]
                        }
                        else {
                            wKing = [...[place2X, place2Y]]
                        }
                    }
                    if(isInCanEatArr){
                        //html-ում միավորները ցույց տալու տեղ սարքել, քարերը շարել ըտեղ
                    }
                }
            }
            else if(place2Value && turn == (place2Value[0]=="w")){//եթե իրա գույնի քարի վրա ա սեղմում, էդ քարն ա նշում
                step = !step;
                clean();
                place1 = [...place2];
                selectingPlace1();
            }
            else{
                step = !step;
                place1 = '';
                place2 = '';
                currElem = []
            }
        }
    }
    else{
        place1 = tmp.id? tmp.id: tmp.parentElement.id;
        selectingPlace1()
    }
    step = !step;
}

function selectingPlace1(){
    place1X = place1[0];
    place1Y = place1[1];
    currElem = [place1X, place1Y];
    let tmp7 = chessBoardArr[place1X][place1Y];
    if(tmp7){
        if(turn){//white's turn
            if(tmp7[0] == "w"){
                paintCurrentSelected();
                func()
            }
            else{
                step = !step
            }
        }
        else{
            if(tmp7[0] == "b"){
                paintCurrentSelected();
                func();
            }
            else{
                step = !step
            }
        }
    }
    else{
        step = !step
    }

    function  func() {
        if(possiblePlaces(place1)){
            paintBoardByPossiblePlaces();
            if(canEatArr.length){
                paintCanEatPlaces()
            }
            // step = !step;
        }
        else{
            step = !step;
            place1 = '';
            place2 = '';
        }
    }

}

function possiblePlaces(place) {
    let x = parseInt(place[0]);
    let y = parseInt(place[1]);
    let currentPiece = chessBoardArr[x][y];
    if (!currentPiece || currentPiece==""){//currentPiece == undefined
        console.log(`erbeq chi ashxati!!!!!!!!!!!!!!!!!!!!!!!!!!`)
        return false
    }
    else {
        possibleMovesArr = [];
        canEatArr = [];
        let pieceColor = currentPiece[0];
        currentPiece = currentPiece.substring(1, currentPiece.length);
        if (currentPiece == "pawn") {
            checkPawnMoves(pieceColor, x, y)
        }
        else if(currentPiece == "rook"){
            checkRookMoves(pieceColor, x, y)
        }
        else if(currentPiece == "knight"){
            checkKnightMoves(pieceColor, x, y)
        }
        else if(currentPiece == "bishop"){
            checkBishopMoves(pieceColor, x, y)
        }
        else if(currentPiece == "queen"){
            checkQueenMoves(pieceColor, x, y)
        }
        else if(currentPiece == "king"){
            checkKingMoves(pieceColor, x, y)
        }
        return true
    }
}

function paintBoardByPossiblePlaces(){
    let element;
    for (let i = 0, len = possibleMovesArr.length; i < len; ++i) {
        element = possibleMovesArr[i];//just temporary variable
        document.getElementById(''+element[0]+element[1]).classList.add("possiblePlace");
    }
}

function unPaintBoardByPossiblePlaces() {
    let element;
    for (let i = 0, len = possibleMovesArr.length; i < len; ++i) {
        element = possibleMovesArr[i];//just temporary variable
        document.getElementById(''+element[0]+element[1]).classList.remove("possiblePlace")
    }
}

function paintCanEatPlaces(){
    let element;
    for (let i = 0, len = canEatArr.length; i < len; ++i) {
        element = canEatArr[i];//just temporary variable
        document.getElementById(''+element[0]+element[1]).classList.add("canEat");
    }
}

function unPaintCanEatPlaces(){
    let element;
    for (let i = 0, len = canEatArr.length; i < len; ++i) {
        element = canEatArr[i];//just temporary variable
        document.getElementById(''+element[0]+element[1]).classList.remove("canEat");
    }
}

function paintCurrentSelected(){
    document.getElementById(''+currElem[0]+currElem[1]).classList.add("currentSelected");
}

function unPaintCurrentSelected(){
    document.getElementById(''+currElem[0]+currElem[1]).classList.remove("currentSelected");
}

function clean(){
    unPaintBoardByPossiblePlaces();
    unPaintCanEatPlaces();
    unPaintCurrentSelected();
}

function changeImages(){
    let elem1 = document.getElementById(`${place1X}${place1Y}`);
    let elem2 = document.getElementById(`${place2X}${place2Y}`);
    elem2.firstChild.src = elem1.firstChild.src;
    elem2.firstChild.alt = elem1.firstChild.alt;
    elem1.firstChild.src = "";
    elem1.firstChild.alt = "";
}

function makeQueen(){
    let elem1 = document.getElementById(`${place1X}${place1Y}`);
    let elem2 = document.getElementById(`${place2X}${place2Y}`);
    let tmp4 = `${elem1.firstChild.alt[0]}queen`;
    elem2.firstChild.src = `images/${tmp4}.png`;
    elem2.firstChild.alt = tmp4;
    elem1.firstChild.src = "";
    elem1.firstChild.alt = "";
    chessBoardArr[place2X][place2Y] = tmp4
}


function checkPawnMoves(pieceColor, x, y){
    if (pieceColor == "b"){
        if (!chessBoardArr[x-1][y]){
            possibleMovesArr.push([x-1, y]);
            if (x == 6 && !chessBoardArr[x-2][y]) {
                possibleMovesArr.push([x-2, y]);
            }
        }
        if (chessBoardArr[x-1][y-1] && chessBoardArr[x-1][y-1][0]!=pieceColor) {
            canEatArr.push([x-1,y-1])
        }
        if (chessBoardArr[x-1][y+1] && chessBoardArr[x-1][y+1][0]!=pieceColor){
            canEatArr.push([x-1, y+1])
        }
    }
    else{
        if (!chessBoardArr[x+1][y]){
            possibleMovesArr.push([x+1, y]);
            if (x == 1 && !chessBoardArr[x+2][y]) {
                possibleMovesArr.push([x+2, y]);
            }
        }
        if (chessBoardArr[x+1][y-1] && chessBoardArr[x+1][y-1][0]!=pieceColor) {
            canEatArr.push([x+1,y-1])
        }
        if (chessBoardArr[x+1][y+1] && chessBoardArr[x+1][y+1][0]!=pieceColor){
            canEatArr.push([x+1, y+1])
        }
    }
}

function checkRookMoves(pieceColor, x, y){
    let startX = x;
    let startY = y;

    while(x!=0 && !chessBoardArr[--x][y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
    x = startX;
    while(x!=7 && !chessBoardArr[++x][y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
    x = startX;
    while(y!=0 && !chessBoardArr[x][--y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
    y = startY;
    while(y!=7 && !chessBoardArr[x][++y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
}

function checkKnightMoves(pieceColor, x, y) {

    if (x>=2 && y<=6){
        func1()
    }
    if (x>=1 && y<=5){
        func2()
    }
    if (x<=6 && y<=5){
        func3()
    }
    if (x<=5 && y<=6){
        func4()
    }
    if (x<=5 && y>=1){
        func5()
    }
    if (x<=6 && y>=2){
        func6()
    }
    if (x>=1 && y>=2){
        func7()
    }
    if (x>=2 && y>=1){
        func8()
    }

    function func1(){
        let tmpX = x-2;
        let tmpY = y+1;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
    function func2(){
        let tmpX = x-1;
        let tmpY = y+2;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
    function func3(){
        let tmpX = x+1;
        let tmpY = y+2;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
    function func4(){
        let tmpX = x+2;
        let tmpY = y+1;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
    function func5(){
        let tmpX = x+2;
        let tmpY = y-1;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
    function func6(){
        let tmpX = x+1;
        let tmpY = y-2;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
    function func7(){
        let tmpX = x-1;
        let tmpY = y-2;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
    function func8(){
        let tmpX = x-2;
        let tmpY = y-1;

        if (!chessBoardArr[tmpX][tmpY]) {
            possibleMovesArr.push([tmpX, tmpY])
        }
        else{
            if(chessBoardArr[tmpX][tmpY][0]!=pieceColor){
                canEatArr.push([tmpX, tmpY])
            }
        }
    }
}

function checkBishopMoves(pieceColor, x, y) {
    let startX = x;
    let startY = y;
    while(x!=0 && y!=7 && !chessBoardArr[--x][++y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
    x = startX;
    y = startY;
    while(x!=7 && y!=0 && !chessBoardArr[++x][--y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
    x = startX;
    y = startY;
    while(x!=0 && y!=0 && !chessBoardArr[--x][--y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
    x = startX;
    y = startY;
    while(x!=7 && y!=7 && !chessBoardArr[++x][++y]){
        possibleMovesArr.push([x, y]);
    }
    if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor){
        canEatArr.push([x, y])
    }
}

function checkQueenMoves(pieceColor, x, y) {
    checkRookMoves(pieceColor, x, y);
    checkBishopMoves(pieceColor, x, y);
}

function checkKingMoves(pieceColor, x, y) {
    let possMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    startX = x;
    startY = y;
    for (let i = 0, len = possMoves.length; i < len; i++) {
        x=startX+possMoves[i][0];
        y=startY+possMoves[i][1];
        if (x==-1 || x==8 || y==-1 || y==8){continue}
        if (!chessBoardArr[x][y]){
            possibleMovesArr.push([x, y]);
        }
        if (chessBoardArr[x][y] && chessBoardArr[x][y][0]!=pieceColor) {
            canEatArr.push([x, y])
        }
    }

}

function isCheckFunction(col, king){
    console.log(`chessBoardArr:`, chessBoardArr);
    let x = parseInt(king[0]), y = parseInt(king[1]);
    possibleMovesArr = [];
    canEatArr = [];
    checkQueenMoves(col, x, y);
    let len = canEatArr.length;
    if (len){
        for (let i = 0; i < len; i++) {
            let tmp = canEatArr[i];
            let tmp2 = chessBoardArr[tmp[0]][tmp[1]];
            let attacker = tmp2.substring(1, tmp2.length);
            switch(attacker){
                case "queen": console.log(`is Check from Queen`);
                    return true;
                case "bishop": console.log(`is Check from bishop`);
                    return true;
                case "rook": console.log(`is Check from rook`);
                    return true;
            }
        }
    }

    possibleMovesArr = [];
    canEatArr = [];
    checkKnightMoves(col, x, y);
    len = canEatArr.length;
    if (len){
        for (let i = 0; i < len; i++) {
            let tmp = canEatArr[i];
            let tmp2 = chessBoardArr[tmp[0]][tmp[1]];
            let attacker = tmp2.substring(1, tmp2.length);
            if(attacker == "knight"){
                console.log(`is Check from Knight`);
                return true
            }
        }
    }

    possibleMovesArr = [];
    canEatArr = [];
    checkPawnMoves(col, x, y);
    len = canEatArr.length;
    if (len){
        for (let i = 0; i < len; i++) {
            let tmp = canEatArr[i];
            let tmp2 = chessBoardArr[tmp[0]][tmp[1]];
            let attacker = tmp2.substring(1, tmp2.length);
            if(attacker == "pawn"){
                console.log(`is Check from Pawn`);
                return true
            }
        }
    }

    possibleMovesArr = [];
    canEatArr = [];

    console.log('possibleMovesArr: ',possibleMovesArr);
    console.log('canEatArr: ',canEatArr);


    return false

}

function funcThatCallsIsChecking(col){
    //ըստ գույնի ստուգում ա շախ կա իրա վրա թե չէ
    console.log(`*********************************`);
    if(col == "w"){
        console.log(`for whites`);
        whiteIsCheck = isCheckFunction('w', wKing);
        if (whiteIsCheck) {
            console.log(`White King is checked`)
            return true
        }
    }
    else {
        console.log(`for whites`);
        blackIsCheck = isCheckFunction('b', bKing);
        if (blackIsCheck) {
            console.log(`Black King is checked`)
            return true
        }
    }
    return false
}
