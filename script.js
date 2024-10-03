const colorDisplay = document.getElementById('colorDisplay');
const colorPicker = document.getElementById('colorPicker');

const redRange = document.getElementById('redRange');
const greenRange = document.getElementById('greenRange');
const blueRange = document.getElementById('blueRange');

const cyanRange = document.getElementById('cyanRange');
const magentaRange = document.getElementById('magentaRange');
const yellowRange = document.getElementById('yellowRange');
const blackRange = document.getElementById('blackRange');

const hueRange = document.getElementById('hueRange');
const saturationRange = document.getElementById('saturationRange');
const valueRange = document.getElementById('valueRange');

const redInput = document.getElementById('redInput');
const greenInput = document.getElementById('greenInput');
const blueInput = document.getElementById('blueInput');

const cyanInput = document.getElementById('cyanInput');
const magentaInput = document.getElementById('magentaInput');
const yellowInput = document.getElementById('yellowInput');
const blackInput = document.getElementById('blackInput');

const hueInput = document.getElementById('hueInput');
const saturationInput = document.getElementById('saturationInput');
const valueInput = document.getElementById('valueInput');

const redValue = document.getElementById('redValue');
const greenValue = document.getElementById('greenValue');
const blueValue = document.getElementById('blueValue');

const cyanValue = document.getElementById('cyanValue');
const magentaValue = document.getElementById('magentaValue');
const yellowValue = document.getElementById('yellowValue');
const blackValue = document.getElementById('blackValue');

const hueValue = document.getElementById('hueValue');
const saturationValue = document.getElementById('saturationValue');
const valueValue = document.getElementById('valueValue');

function updateColor(r, g, b) {
    const color = `rgb(${r}, ${g}, ${b})`;
    colorDisplay.style.backgroundColor = color;

    redRange.value = r;
    greenRange.value = g;
    blueRange.value = b;
    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;

    redInput.value = r
    greenInput.value = g
    blueInput.value = b


    const cmyk = rgbToCmyk(r, g, b);
    cyanRange.value = cmyk[0];
    magentaRange.value = cmyk[1];
    yellowRange.value = cmyk[2];
    blackRange.value = cmyk[3];
    cyanValue.textContent = cmyk[0];
    magentaValue.textContent = cmyk[1];
    yellowValue.textContent = cmyk[2];
    blackValue.textContent = cmyk[3];
    cyanInput.value = cmyk[0];
    magentaInput.value = cmyk[1];
    yellowInput.value = cmyk[2];
    blackInput.value = cmyk[3];

   
    const hsv = rgbToHsv(r, g, b);
    hueRange.value = hsv[0];
    saturationRange.value = hsv[1];
    valueRange.value = hsv[2];
    hueInput.value = hsv[0];
    saturationInput.value = hsv[1];
    valueInput.value = hsv[2];
    hueValue.textContent = hsv[0];
    saturationValue.textContent = hsv[1];
    valueValue.textContent = hsv[2];
}

function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    if (k === 1) return [0, 0, 0, 100];
    c = ((c - k) / (1 - k)) * 100;
    m = ((m - k) / (1 - k)) * 100;
    y = ((y - k) / (1 - k)) * 100;
    return [Math.round(c), Math.round(m), Math.round(y), Math.round(k * 100)];
}

function cmykToRgb(c, m, y, k) {

    c = Math.max(0, Math.min(100, c)) / 100;
    m = Math.max(0, Math.min(100, m)) / 100;
    y = Math.max(0, Math.min(100, y)) / 100;
    k = Math.max(0, Math.min(100, k)) / 100;

    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));
    
    return [r, g, b];
}


function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function hsvToRgb(h, s, v) {
    s /= 100; v /= 100;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r, g, b;

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

colorPicker.addEventListener('input', (event) => {
    const selectedColor = event.target.value;
    const r = parseInt(selectedColor.slice(1, 3), 16);
    const g = parseInt(selectedColor.slice(3, 5), 16);
    const b = parseInt(selectedColor.slice(5, 7), 16);
    updateColor(r, g, b);
});

redRange.addEventListener('input', () => {updateColor(parseInt(redRange.value), parseInt(greenRange.value), parseInt(blueRange.value))});
greenRange.addEventListener('input', () => updateColor(parseInt(redRange.value), parseInt(greenRange.value), parseInt(blueRange.value)));
blueRange.addEventListener('input', () => updateColor(parseInt(redRange.value), parseInt(greenRange.value), parseInt(blueRange.value)));

cyanRange.addEventListener('input', () => {

    const c = parseInt(cyanRange.value);
    const m = parseInt(magentaRange.value);
    const y = parseInt(yellowRange.value);
    const k = parseInt(blackRange.value);
    
    const [r, g, b] = cmykToRgb(c, m, y, k);
    

    updateColor(r, g, b);
  });
  
  magentaRange.addEventListener('input', () => {
    const c = parseInt(cyanRange.value);
    const m = parseInt(magentaRange.value);
    const y = parseInt(yellowRange.value);
    const k = parseInt(blackRange.value);
  
    const [r, g, b] = cmykToRgb(c, m, y, k);
    updateColor(r, g, b);
  });
  
  yellowRange.addEventListener('input', () => {
  const c = parseInt(cyanRange.value);
  const m = parseInt(magentaRange.value);
  const y = parseInt(yellowRange.value);
  const k = parseInt(blackRange.value);
  
  const [r, g, b] = cmykToRgb(c, m, y, k);
  updateColor(r, g, b);
  });
  
  blackRange.addEventListener('input', () => {
  const c = parseInt(cyanRange.value);
  const m = parseInt(magentaRange.value);
  const y = parseInt(yellowRange.value);
  const k = parseInt(blackRange.value);
  
  const [r, g, b] = cmykToRgb(c, m, y, k);
  updateColor(r, g, b);
  });

  hueRange.addEventListener('input', () => {
    const h = parseInt(hueRange.value);
    const s = parseInt(saturationRange.value);
    const v = parseInt(valueRange.value);

    const [r, g, b] = hsvToRgb(h, s, v);
    updateColor(r, g, b);
    });
    
    saturationRange.addEventListener('input', () => {
    const h = parseInt(hueRange.value);
    const s = parseInt(saturationRange.value);
    const v = parseInt(valueRange.value);
    
    const [r, g, b] = hsvToRgb(h, s, v);
    updateColor(r, g, b);
    });
    
    valueRange.addEventListener('input', () => {
    const h = parseInt(hueRange.value);
    const s = parseInt(saturationRange.value);
    const v = parseInt(valueRange.value);
    
    const [r, g, b] = hsvToRgb(h, s, v);
    updateColor(r, g, b);
    });
    

redInput.addEventListener('input', () => {
    const r = parseInt(redInput.value);
    const g = parseInt(greenInput.value);
    const b = parseInt(blueInput.value);
    updateColor(r, g, b);
  });
  greenInput.addEventListener('input', () => {
    const r = parseInt(redInput.value);
    const g = parseInt(greenInput.value);
    const b = parseInt(blueInput.value);
    updateColor(r, g, b);
  });
  blueInput.addEventListener('input', () => {
    const r = parseInt(redInput.value);
    const g = parseInt(greenInput.value);
    const b = parseInt(blueInput.value);
    updateColor(r, g, b);
  });


cyanInput.addEventListener('input', () => {
    const c = parseInt(cyanInput.value) || 0;
    const m = parseInt(magentaInput.value) || 0;
    const y = parseInt(yellowInput.value)|| 0;
    const k = parseInt(blackInput.value) || 0;
    const [r, g, b] = cmykToRgb(c, m, y, k);
    updateColor(r, g, b);
});

magentaInput.addEventListener('input', () => {
    const c = parseInt(cyanInput.value) || 0;
    const m = parseInt(magentaInput.value) || 0;
    const y = parseInt(yellowInput.value)|| 0;
    const k = parseInt(blackInput.value) || 0;
    const [r, g, b] = cmykToRgb(c, m, y, k);
    updateColor(r, g, b);
});

yellowInput.addEventListener('input', () => {
    const c = parseInt(cyanInput.value) || 0;
    const m = parseInt(magentaInput.value) || 0;
    const y = parseInt(yellowInput.value)|| 0;
    const k = parseInt(blackInput.value) || 0;
    const [r, g, b] = cmykToRgb(c, m, y, k);
    updateColor(r, g, b);
});

blackInput.addEventListener('input', () => {
    const c = parseInt(cyanInput.value) || 0;
    const m = parseInt(magentaInput.value) || 0;
    const y = parseInt(yellowInput.value)|| 0;
    const k = parseInt(blackInput.value) || 0;
    const [r, g, b] = cmykToRgb(c, m, y, k);
    updateColor(r, g, b);
});

hueInput.addEventListener('input', () => {
    const h = parseInt(hueInput.value) || 0;
    const s = parseInt(saturationInput.value) || 0;
    const v = parseInt(valueInput.value) || 0;
    const [r, g, b] = hsvToRgb(h, s, v);
    updateColor(r, g, b);
});

saturationInput.addEventListener('input', () => {
    const h = parseInt(hueInput.value) || 0;
    const s = parseInt(saturationInput.value) || 0;
    const v = parseInt(valueInput.value) || 0;
    const [r, g, b] = hsvToRgb(h, s, v);
    updateColor(r, g, b);
});

valueInput.addEventListener('input', () => {
    const h = parseInt(hueInput.value) || 0;
    const s = parseInt(saturationInput.value) || 0;
    const v = parseInt(valueInput.value) || 0;
    const [r, g, b] = hsvToRgb(h, s, v);
    updateColor(r, g, b);
});