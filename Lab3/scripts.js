const canvas = document.getElementById('canvas');
const Oxy = canvas.getContext('2d');

let pixelSize = 10;
let point1 = null;
let point2 = null;

function set_pixel() {
    let new_size = parseInt(prompt("Введите размер пикселя:", pixelSize));
    if (!isNaN(new_size) && new_size > 0) {
        pixelSize = new_size;
        drawGrid();
    }
}

function showDialog() {
    document.getElementById('dialog').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}


function closeDialog() {
    document.getElementById('dialog').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


function showCircleDialog() {
    document.getElementById('circleDialog').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}


function closeCircleDialog() {
    document.getElementById('circleDialog').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


function closeAllDialogs() {
    closeDialog();
    closeCircleDialog();
}

function setSegment() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
    
    if (!isNaN(x1) && !isNaN(y2) && !isNaN(x2) && !isNaN(y1)) {

        point1 = { x: x1 * pixelSize, y: y1 * pixelSize };
        point2 = { x: x2 * pixelSize, y: y2 * pixelSize };

        if (point1.x > point2.x && point1.y > point2.y){
            [point1.x, point2.x] = [point2.x, point1.x];
            [point1.y, point2.y] = [point2.y, point1.y];
        }

        drawGrid();
        drawLine();
        closeDialog();
    } else {
        alert("Еще раз введите координаты.");
    }
}

let CentreXY = null;
let R = null;



function drawGrid() {
    Oxy.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста
    Oxy.setTransform(1, 0, 0, -1, 0, canvas.height);
    Oxy.beginPath();
    Oxy.strokeStyle = '#ddd';
    Oxy.lineWidth = 0.8;

    for (let x = 0; x <= canvas.width; x += pixelSize) {
        Oxy.moveTo(x, 0);
        Oxy.lineTo(x, canvas.height);
    }


    for (let y = 0; y <= canvas.height; y += pixelSize) {
        Oxy.moveTo(0, y);
        Oxy.lineTo(canvas.width, y);
    }
    Oxy.stroke();

    Oxy.beginPath();
    Oxy.strokeStyle = 'blue';
    Oxy.lineWidth = 2;


    Oxy.moveTo(0, 0);
    Oxy.lineTo(0, canvas.height);


    Oxy.moveTo(0, 0);
    Oxy.lineTo(canvas.width, 0);

    Oxy.stroke();
    Oxy.lineWidth = 1;
    Oxy.closePath();


    Oxy.beginPath();
    Oxy.fillStyle = 'red';
    Oxy.arc(0, 0, pixelSize / 7, 0, 2 * Math.PI);
    Oxy.fill();
    Oxy.closePath();

    Oxy.setTransform(1, 0, 0, 1, 0, 0);

    Oxy.fillStyle = 'blue';
    Oxy.font = `${pixelSize / 3}px Arial`;
    Oxy.fillText(0, 4, canvas.height - 5);

    for (let x = pixelSize; x < canvas.width; x += pixelSize) {
        Oxy.fillText(x / pixelSize, x, canvas.height - 5);
    }

    for (let y = pixelSize; y < canvas.height; y += pixelSize) {
        Oxy.fillText(y / pixelSize, 5, canvas.height - y);
    }

    Oxy.setTransform(1, 0, 0, -1, 0, canvas.height);
}


function drawLine() {
    if (point1 && point2) {
        Oxy.beginPath();
        Oxy.strokeStyle = 'green';
        Oxy.lineWidth = 2;
        Oxy.moveTo(point1.x, point1.y);
        Oxy.lineTo(point2.x, point2.y);
        Oxy.stroke();
        Oxy.closePath();
    }
}


function drawLineStepByStep() {
    if (!point1 || !point2) {
        alert("Сначала задайте отрезок.");
        return;
    }
    console.time("StepByStep");

    let x = point1.x;
    let y = point1.y;

    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const k = dy / dx;
    const b = point1.y - k * point1.x;
    let offset = point2.y > point1.y ? pixelSize : -pixelSize;
    if (dx >= dy && dy >= 0)
    {
        const n = Math.abs(dx / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y, pixelSize, pixelSize);

        while (i < n) {
            x = point1.x + i * pixelSize;
            y = k * x + b;

            y = Math.floor(y/ pixelSize) * pixelSize;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(Math.round(x), Math.round(y), pixelSize, pixelSize);

            i++;
        }

    }

    else if ((dx > Math.abs(dy) && dy < 0)  || (dx == Math.abs(dy))) {

        const n = Math.abs(dx / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y - pixelSize, pixelSize, pixelSize);

        while (i < n) {
            
            x = point1.x + i * pixelSize;
            y = k * x + b;

            y = Math.round(y/ pixelSize) * pixelSize;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(Math.round(x), Math.round(y)-pixelSize, pixelSize, pixelSize);

            i++;
        }
    }  else if ((Math.abs(dy) > dx && dy < 0)) {

        const n = Math.abs(dy / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y - pixelSize, pixelSize, pixelSize);

        while (i < n) {
            y = point1.y + i * offset;
            x = (y - b) / k;

            x = Math.floor(x/ pixelSize) * pixelSize ;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y - pixelSize, pixelSize, pixelSize);

            i++;
        }
    }


    /*
    else if ((dx > Math.abs(dy) && dy < 0)) {
        const n = Math.abs(dx / pixelSize);
        let i = 0;
        
        while (i < n) {

            x = point1.x + i * pixelSize;

            y = k * x + b;

            y = Math.floor(y / pixelSize) * pixelSize;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(Math.round(x), Math.round(y) - pixelSize, pixelSize, pixelSize);

            i++;
        }
    }
    */else {

        const n = Math.abs(dy / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y, pixelSize, pixelSize);

        while (i < n) {
            y = point1.y + i * offset;
            x = (y - b) / k;

            x = Math.floor(x/ pixelSize) * pixelSize ;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y, pixelSize, pixelSize);

            i++;
        }
    }
    console.timeEnd("StepByStep");
}



function drawLineBresenham() {
    if (!point1 || !point2) {
        alert("Сначала задайте отрезок.");
        return;
    }

    console.time("Bresenham");

    let x = point1.x;
    let y = point1.y;

    const dx = Math.abs(point2.x - point1.x);
    const dy = Math.abs(point2.y - point1.y);

    const stepX = point2.x > point1.x ? pixelSize : -pixelSize;
    const stepY = point2.y > point1.y ? pixelSize : -pixelSize;

    if ((dx > Math.abs(dy)) && point2.y - point1.y  >= 0) {

        let error = dx ;
        const n = Math.abs(dx / pixelSize);
        let i = 0;

        Oxy.fillStyle = 'black';
       // Oxy.fillRect(x, y, pixelSize, pixelSize);

        while (i < n) {

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y, pixelSize, pixelSize);
            x += stepX;
            error -= dy;

            if (error < 0) {
                y += stepY;
                error += dx;
            }

        
            i++;
        }
    } else if (((dx > Math.abs(dy)) && point2.y - point1.y < 0)) {
        let error = dx/2 ;
        const n = Math.abs(dx / pixelSize);
        let i = 0;

        Oxy.fillStyle = 'black';
       // Oxy.fillRect(x, y, pixelSize, pixelSize);

        while (i < n) {

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y-pixelSize, pixelSize, pixelSize);
            x += stepX;
            error -= dy;

            if (error < 0) {
                y += stepY;
                error += dx;
            }

        
            i++;
        }
    } else if ((dx < Math.abs(dy)) && point2.y - point1.y < 0)
    {

            let error = dy ;
            const n = Math.abs(dy / pixelSize);
            let i = 1;
    
            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y-pixelSize, pixelSize, pixelSize);
    
            while (i < n) {
                y += stepY;
                error -= dx;
    
                if (error < 0) {
                    x += stepX;
                    error += dy;
                }
    
                Oxy.fillStyle = 'black';
                Oxy.fillRect(x, y-pixelSize, pixelSize, pixelSize);
                i++;
            }
        
    }
       else if (dx == dy && point2.y - point1.y < 0)
       {

        let error = dy ;
        const n = Math.abs(dy / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y-pixelSize, pixelSize, pixelSize);

        while (i <= n) {
            y += stepY;
            error -= dx;

            if (error < 0) {
                x += stepX;
                error += dy;
            }

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y, pixelSize, pixelSize);
            i++;
        }
       }
       else if (dx == dy && point2.y - point1.y > 0)
       {

        let error = dy ;
        const n = Math.abs(dy / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
      //  Oxy.fillRect(x, y-2*pixelSize, pixelSize, pixelSize);

        while (i <= n) {
            y += stepY;
            error -= dx;

            if (error < 0) {
                x += stepX;
                error += dy;
            }

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y-pixelSize, pixelSize, pixelSize);
            i++;
        }
       }
  else {

        let error = dy ;
        const n = Math.abs(dy / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y, pixelSize, pixelSize);

        while (i < n) {
            y += stepY;
            error -= dx;

            if (error < 0) {
                x += stepX;
                error += dy;
            }

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, y, pixelSize, pixelSize);
            i++;
        }
    }
    console.timeEnd("Bresenham");
}


function drawLineDDA() {
    if (!point1 || !point2) {
        alert("Сначала задайте отрезок.");
        return;
    }

    console.time("DDA");

    let x = point1.x;
    let y = point1.y;

    const dx = Math.abs(point2.x - point1.x);
    const dy = Math.abs(point2.y - point1.y);


    const stepX = point2.x > point1.x ? pixelSize : -pixelSize;
    const stepY = point2.y > point1.y ? pixelSize : -pixelSize;


    if (dx >= dy && point2.y - point1.y >= 0) {
        const n = Math.abs(dx / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y, pixelSize, pixelSize);

        while (i < n) {

            x = point1.x + i * stepX;

            y = point1.y + (dy * (x - point1.x)) / dx;

            let newY = Math.floor(y / pixelSize) * pixelSize;
            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, newY, pixelSize, pixelSize);

            i++;
        }
    }
    else if (dx >= dy && point2.y - point1.y < 0)
    {
        const n = Math.abs(dx / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y-pixelSize, pixelSize, pixelSize);

        while (i < n) {
            x = point1.x + i * stepX;
            y = point1.y - (dy * (x - point1.x)) / dx;

            let newY = Math.round(y / pixelSize) * pixelSize;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(x, newY-pixelSize, pixelSize, pixelSize);

            i++;
        }
    }
    else if (dx < dy && point2.y - point1.y < 0) {
        const n = Math.abs(dy / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y-pixelSize, pixelSize, pixelSize);

        while (i < n) {
            y = point1.y + i * stepY;

            x = point1.x - (dx * (y - point1.y)) / dy;

            let newX = Math.floor(x / pixelSize) * stepX;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(newX, y-pixelSize, pixelSize, pixelSize);

            i++;
        }
    }
    else {
        const n = Math.abs(dy / pixelSize);
        let i = 1;

        Oxy.fillStyle = 'black';
        Oxy.fillRect(x, y, pixelSize, pixelSize);

        while (i < n) {
            y = point1.y + i * stepY;

            x = point1.x + (dx * (y - point1.y)) / dy;

            let newX = Math.floor(x / pixelSize) * stepX;

            Oxy.fillStyle = 'black';
            Oxy.fillRect(newX, y, pixelSize, pixelSize);

            i++;
        }
    }
    console.timeEnd("DDA");
}


function setCircle() {
    const x = parseInt(document.getElementById('centerX').value);
    const y = parseInt(document.getElementById('centerY').value);
    const radius = parseInt(document.getElementById('radius').value);

    if (!isNaN(x) && !isNaN(y) && !isNaN(radius) && radius > 0) {
        CentreXY = { x: x * pixelSize, y: y * pixelSize };
        R = radius * pixelSize;

        closeCircleDialog();
        drawCircleBr();
    } else {
        alert("Пожалуйста, введите корректные координаты и радиус.");
    }
}

function drawCircleBr() {
    if (!CentreXY || R === null) {
        alert("Сначала задайте центр и радиус окружности.");
        return;
    }
    console.time("CircleBresenham");

    let x = 0;
    let y = R;
    let er = 1 - R;

    draw_simmetr(CentreXY.x, CentreXY.y, x, y);

    while (x < y) {
        if (er < 0) {
            er += 2 * x + 3;
        } else {
            er += 2 * (x - y) + 5;
            y -= pixelSize;
        }
        x += pixelSize;
        draw_simmetr(CentreXY.x, CentreXY.y, x, y);
    }
    console.timeEnd("CircleBresenham");
}

function draw_simmetr(cx, cy, x, y) {
    Oxy.fillStyle = 'black';

    const points = [
        { x: cx + x, y: cy + y },
        { x: cx - x, y: cy + y },
        { x: cx + x, y: cy - y },
        { x: cx - x, y: cy - y },
        { x: cx + y, y: cy + x },
        { x: cx - y, y: cy + x },
        { x: cx + y, y: cy - x },
        { x: cx - y, y: cy - x }
    ];

    points.forEach(p => {
        const gridX = Math.round(p.x / pixelSize) * pixelSize;
        const gridY = Math.round(p.y / pixelSize) * pixelSize;
        Oxy.fillRect(gridX, gridY, pixelSize, pixelSize);
    });
}
