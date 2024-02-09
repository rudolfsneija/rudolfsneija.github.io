let particles = [];
let sliders = {};
let labels = {};
let frameRateText;

let settings = {
    count: 4000,
    noise: 0.008,
    speed: 0.4,
    size: 0.8,
    alpha: 6,
};

let sliderStartX = 40;
let sliderStartY;
let sliderSpacing = 200;

function setup() {
    createCanvas(windowWidth, windowHeight).parent('render-container');
    // createCanvas(windowWidth, windowHeight - 130).parent('render-container');

    background('rgba(7, 1, 14, 1)');

    sliderStartY = height + 50;

    createSliderAndLabel('count', 0, 10000, settings.count, 50);
    createSliderAndLabel('noise', 0, 0.01, settings.noise, 0.0001);
    createSliderAndLabel('speed', 0.05, 2, settings.speed, 0.05);
    createSliderAndLabel('size', 0, 8, settings.size, 0.1);
    createSliderAndLabel('alpha', 0, 100, settings.alpha, 1);

    frameRateText = createP();
    frameRateText.position(width - 100, sliderStartY);
    frameRateText.style('color', '#fff');

    createParticles();
}

function draw() {
    updateSettingsAndLabels();

    background(7, 9, 14, sliders.alpha.value());

    // Adjust the number of particles according to the slider
    while (particles.length < settings.count) {
        particles.push(createParticle());
    }
    while (particles.length > settings.count) {
        particles.pop();
    }

    particles.forEach(p => {
        let r = noise(p.pos.x * settings.noise, p.pos.y * settings.noise) * 255;
        let g = noise((p.pos.x + 10000) * settings.noise, p.pos.y * settings.noise) * 255;

        stroke(r, g, 255, p.alpha);
        strokeWeight(settings.size);

        let angle = noise(p.pos.x * settings.noise, p.pos.y * settings.noise) * TWO_PI;
        p.pos.x += cos(angle) * settings.speed;
        p.pos.y += sin(angle) * settings.speed;

        if (!isOnScreen(p.pos)) {
            p.pos.x = random(width);
            p.pos.y = random(height);
            p.alpha = 255;
        }

        point(p.pos.x, p.pos.y);
    });

    displayFrameRate();
}

function createSliderAndLabel(name, min, max, value, step) {
    let label = createSpan(name.charAt(0).toUpperCase() + name.slice(1) + ': ');
    label.position(sliderStartX, sliderStartY - 10);
    label.style('color', '#fff');

    let slider = createSlider(min, max, value, step);
    slider.position(sliderStartX, sliderStartY + 20);

    sliders[name] = slider;
    labels[name] = label;

    sliderStartX += sliderSpacing; // Move the start position for the next slider
}

function updateSettingsAndLabels() {
    for (let name in settings) {
        settings[name] = sliders[name].value();
        labels[name].html(name + ': ' + settings[name]);
    }
}

function createParticles() {
    for (let i = 0; i < settings.count; i++) {
        particles.push({
            pos: createVector(random(width), random(height)),
            hue: createVector(random(255), random(255), random(255)),
            alpha: 255,
        });
    }
}

function createParticle() {
    return {
        pos: createVector(random(width), random(height)),
        hue: createVector(random(255), random(255), random(255)),
        alpha: 255,
    };
}

function displayFrameRate() {
    frameRateText.html("fps: " + int(frameRate()));
}

function isOnScreen(point) {
    return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === ' ') {
        noiseSeed(random(100000));
    }
    if (key === 'r') {
        for (let name in settings) {
            sliders[name].value(random(sliders[name].elt.min, sliders[name].elt.max));
        }
    }
}
