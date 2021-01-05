(function () {
    console.log("42 logic game - alpha V0.0.1")
})();

class GameConfig {
    constructor(props) {
        this.score = 0;
        this.directions = ['up', 'right', 'down', 'left'];
        this.currentDirection = 0;
        this.currentPosition = [0, 0];

        this.containerId = props.containerId;
        this.levels = props.levels;

        this.levelDetails = props.levels[0]
        this.levelDetails.level = 0;

        // this.matrix = props.matrix;
        // this.arrowInitialCoords = props.arrowInitialCoords;
        // this.targetCoords = props.targetCoords;
        // this.allowedTools = props.allowedTools;
        // this.functions = props.functions;

        this.buildLevel(this.levelDetails)
    }

    buildLevel = (levelDetails) => {
        this.matrix = levelDetails.matrix;
        this.arrowInitialCoords = levelDetails.arrowInitialCoords;
        this.targetCoords = levelDetails.targetCoords;
        this.allowedTools = levelDetails.allowedTools;
        this.functions = levelDetails.functions;

        document.getElementById(this.containerId).innerHTML = "";

        const enviroment = this.createEnviroment()
        this.gridRootClassName = enviroment.gridRootClassName;
        this.toolboxRootClassName = enviroment.toolboxRootClassName;
        this.functionsRootClassName = enviroment.functionsRootClassName;

        this.buildGrid()
        this.buildToolbox()
        this.buildFunctions()
        this.buildEmptySlotButton()
        this.buildSubmitButton()
    }

    createEnviroment = () => {

        document.getElementById(this.containerId).innerHTML += `<div class="box-container"></div>`;
        document.getElementById(this.containerId).innerHTML += `<div class="toolbox"></div>`;
        document.getElementById(this.containerId).innerHTML += `<div class="functions"></div>`;
       
        return {
            gridRootClassName : "box-container",
            toolboxRootClassName : "toolbox",
            functionsRootClassName : "functions"
        }
    }

    buildGrid = () => {
        let rows = "";
        this.matrix.forEach((row, index) => {
            let eachRow = "";
            eachRow += `<div class="line line-${index}">`;
            row.forEach((element, elemIndex) => {
                if(element == 0)
                    eachRow += `<div class="each-box zero-box box-${elemIndex}" id="${randomGenerator(10)}" data-priority="0"></div>`;
                else if(element == 1)
                    eachRow += `<div class="each-box one-box box-${elemIndex}" id="${randomGenerator(10)}" data-priority="1"></div>`;
                else if(element == 2)
                    eachRow += `<div class="each-box two-box box-${elemIndex}" id="${randomGenerator(10)}" data-priority="2"></div>`;
                // else if(element == 3)
                //     eachRow += `<div class="each-box three-box box-${elemIndex}" id="${randomGenerator(10)}" data-priority="3"></div>`;
                // else if(element == 4)
                //     eachRow += `<div class="each-box four-box box-${elemIndex}" id="${randomGenerator(10)}" data-priority="4"></div>`;
            })
            eachRow += `</div>`;
            rows += eachRow;
        });
        document.getElementsByClassName(this.gridRootClassName)[0].innerHTML = rows;
        this.locateArrow(this.arrowInitialCoords);
        this.locateStars(this.targetCoords);
    }

    locateArrow = () => {
        // first elem row, second elem column, third elem direction
        this.currentDirection = this.arrowInitialCoords[2];
        this.currentPosition = [this.arrowInitialCoords[0], this.arrowInitialCoords[1]]
        this.updateArrowCoordinates()
    }

    locateStars = () => {
        this.targetCoords.forEach(coord => {
            if(document
                .getElementsByClassName(`line-${coord[0]}`)[0]
                .getElementsByClassName(`box-${coord[1]}`)[0]
                .dataset.priority != 0)
                {
                    document
                        .getElementsByClassName(`line-${coord[0]}`)[0]
                        .getElementsByClassName(`box-${coord[1]}`)[0]
                        .innerHTML = `<div class="target"></div>`;
                    document
                        .getElementsByClassName(`line-${coord[0]}`)[0]
                        .getElementsByClassName(`box-${coord[1]}`)[0]
                        .dataset.priority = 5
                }
        })
    }

    buildToolbox = () => {
        let buttons = "";
        if(this.allowedTools.step)
            buttons += `<div class="tool" data-action="step" id="${randomGenerator(10)}" draggable="true" ondragstart="drag(event)"><i class="fa fa-arrow-up"></i></div>`;
        if(this.allowedTools.turnRight)
            buttons += `<div class="tool" data-action="turnRight" id="${randomGenerator(10)}" draggable="true" ondragstart="drag(event)"><i class="fa fa-arrow-right"></i></div>`;
        if(this.allowedTools.turnLeft)
            buttons += `<div class="tool" data-action="turnLeft" id="${randomGenerator(10)}" draggable="true" ondragstart="drag(event)"><i class="fa fa-arrow-left"></i></div>`;
    
        document.getElementsByClassName(this.toolboxRootClassName)[0].innerHTML = buttons;
    }

    addFunctionsToToolbox = (funcIndex) => {
        document.getElementsByClassName(this.toolboxRootClassName)[0].innerHTML += `<div class="tool" id="${randomGenerator(10)}" draggable="true" ondragstart="drag(event)" data-func="${funcIndex}">F${funcIndex}</div>`;
    }

    buildFunctions = () => {
        let funcs = "";
        this.functions.forEach((func, index) => {
            funcs += `<div class="function-row" id="function-${index}" data-func="${index}">`;
            this.addFunctionsToToolbox(index)
            funcs += `<div class="function-name-slot" onClick="">F${index}</div>`
            for(let i = 0; i < func; i++){
                funcs += `<div class="function-slot" id="${randomGenerator(10)}" onClick="putSelectorOnSlot(this)" ondrop="drop(event)" ondragover="allowDrop(event)"></div>`;
            }
            funcs += `</div>`;
        })
        document.getElementsByClassName(this.functionsRootClassName)[0].innerHTML = funcs;
    }

    buildSubmitButton = () => {
        this.submitId = randomGenerator(10);
        document.getElementById(this.containerId).innerHTML += `<button id="${this.submitId}" class="submit">Run</button>`
        let submitElement = document.getElementById(this.submitId);
        submitElement.addEventListener('click', this.runTest, false)
    }

    buildEmptySlotButton = () => {
        this.emptySlotId = randomGenerator(10);
        document.getElementById(this.containerId).innerHTML += `<button id="${this.submitId}" onclick="emptySlot(this)" class="emptySlot">Empty slot</button>`
    }

    runTest = () => {
        this.targetsLeft = document.getElementsByClassName("target").length;
        let functions = document.getElementsByClassName(this.functionsRootClassName)[0];
        [...functions.children].forEach(functionRow => {
            if(functionRow && functionRow.children.length)
                this.execFuncRow(functionRow);
        })
    }

    execFuncRow = async (functionRow) => {
        const funcChild = Array.from(functionRow.children)
        for(let func of funcChild) {
            if(func.children.length){
                if(func.getElementsByClassName('tool')[0].dataset.action){
                    if(func.getElementsByClassName('tool')[0].dataset.action == 'step'){
                        let result = new Promise((resolve, reject) => {
                            window.setTimeout(() => {
                                resolve(this.execStep());
                            }, 1000);
                        })
                        const response = await result 
                        console.log(result);
                        if(response == 0){
                            this.buildLevel(this.levels[this.levelDetails.level])
                            break;
                        } else if(this.checkWin()) {
                            this.buildLevel(this.levels[++this.levelDetails.level])
                            break;
                        }
                    }
                    else if(func.getElementsByClassName('tool')[0].dataset.action == 'turnLeft'){
                        setTimeout(() => {
                            this.currentDirection--;
                            this.updateArrowCoordinates()
                        }, 1000);
                    }
                    else if(func.getElementsByClassName('tool')[0].dataset.action == 'turnRight'){
                        setTimeout(() => {
                            this.currentDirection++;
                            this.updateArrowCoordinates()
                        }, 1000);
                    }
                } else if(func.getElementsByClassName('tool')[0].dataset.func){
                    setTimeout(() => {
                        this.execFuncRow(document.getElementById(`function-${func.getElementsByClassName('tool')[0].dataset.func}`))
                    }, 1000);
                }
            }
        }
        
    }

    execStep = () => {
        if (this.currentDirection == 0)
            this.currentPosition = [this.currentPosition[0] - 1, this.currentPosition[1]];
        else if (this.currentDirection == 1)
            this.currentPosition = [this.currentPosition[0], this.currentPosition[1] + 1];
        else if (this.currentDirection == 2)
            this.currentPosition = [this.currentPosition[0] + 1, this.currentPosition[1]];
        else if (this.currentDirection == 3)
            this.currentPosition = [this.currentPosition[0], this.currentPosition[1] - 1];
        
        let elem = document
            .getElementsByClassName(`line-${this.currentPosition[0]}`)[0]
            .getElementsByClassName(`box-${this.currentPosition[1]}`)[0]
        
        if(elem && elem.dataset.priority > 0) {
            this.updateArrowCoordinates()
        } else {
            alert("Wrong solution");
            return 0;
        }
    }

    updateArrowCoordinates = () => {
        let elem = document
            .getElementsByClassName(`line-${this.currentPosition[0]}`)[0]
            .getElementsByClassName(`box-${this.currentPosition[1]}`)[0]
        
        if(document.getElementById("cursor")) {
            document.getElementById("cursor").remove()
        }
        if(elem.getElementsByClassName('target').length){
            this.targetsLeft--;
        }
        elem.innerHTML = `<div id="cursor" class="arrow-${this.directions[this.currentDirection]}"></div>`;
    }

    checkWin = () => {
        if(this.targetsLeft <= 0){
            alert("Congrats. you've won!");
            return 1
        }
    }
}

emptySlot = () => {
    let elem = document.getElementsByClassName("selectedSlot")[0]
    elem.getElementsByClassName('tool')[0].remove();
    elem.style.border = "1px solid black"
}

putSelectorOnSlot = (elem) => {
    elem.classList.add("selectedSlot")
    elem.style.border = "1px solid lightgreen"
}

randomGenerator = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

allowDrop = (ev) => {
    ev.preventDefault();
}

drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.effectAllowed = 'move';
}

drop = (ev) => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = randomGenerator(10);
    ev.target.appendChild(nodeCopy);
}
