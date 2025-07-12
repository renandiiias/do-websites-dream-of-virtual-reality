<!--
//
// NEXUS AGENCY - Immersive Digital Experiences
// Transforming the future of web interaction
//
-->
'use strict'

var clock, container, camera, scene, renderer, controls, effect, manager, listener, loader, loaderStroke, meshLine;
var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
var sound1, sound2, sound3, ambientSound;
var toggle = 0;
var sky, nexusLogo, dataStream, energyField, particleSystem;
var cameraRails = new THREE.Object3D();
var cameraOnRails = true;
var lightsArr = [];
var isPaused = false;
var isVRMode = false;
var currentSection = 'home';

// Agency-specific variables
var logoMesh, particlePoints, energyLines = [];
var audioContext, analyser, dataArray;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var interactiveObjects = [];

// Colors for the agency theme
var agencyColors = [
    0x00f5ff, // Cyan
    0xff006e, // Pink
    0x8338ec, // Purple
    0x3a86ff, // Blue
    0x06ffa5, // Green
    0xffbe0b  // Yellow
];

window.mobilecheck = function() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function init() {
    container = document.getElementById('container');
    
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.set(0, 0, 10);

    listener = new THREE.AudioListener();
    camera.add(listener);

    scene = new THREE.Scene();

    cameraRails.add(camera);
    scene.add(cameraRails);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    renderer.setClearColor(0x000000, 0);

    effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    // CONTROLS
    controls = new THREE.VRControls(camera);
    manager = new WebVRManager(renderer, effect, { hideButton: true });

    // Create immersive environment
    createSky();
    createNexusLogo();
    createDataStreams();
    createParticleSystem();
    createEnergyField();
    createInteractiveLights();
    
    // Load ambient sound
    loadAmbientAudio();

    // Mouse interaction
    setupMouseInteraction();

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function createSky() {
    var skyGeo = new THREE.SphereGeometry(4500, 32, 15);
    
    loader = new THREE.TextureLoader();
    loader.load('assets/stars.jpg', function(texture) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ 
            map: texture, 
            side: THREE.BackSide,
            opacity: 0.7,
            transparent: true
        }));
        sky.rotation.y = Math.PI / 2;
        scene.add(sky);
    });
}

function createNexusLogo() {
    // Create geometric logo representation
    var logoGeometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    var logoMaterial = new THREE.MeshBasicMaterial({
        color: agencyColors[0],
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    
    nexusLogo = new THREE.Mesh(logoGeometry, logoMaterial);
    nexusLogo.position.set(0, 5, -10);
    scene.add(nexusLogo);
    
    interactiveObjects.push(nexusLogo);
}

function createDataStreams() {
    loaderStroke = new THREE.TextureLoader();
    loader.load('assets/stroke02.png', function(texture) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Create multiple data streams
        for (let i = 0; i < 5; i++) {
            var geo = new Float32Array(150 * 3);
            for (var j = 0; j < geo.length; j += 3) {
                geo[j] = geo[j + 1] = geo[j + 2] = 0;
            }

            var g = new THREE.MeshLine();
            g.setGeometry(geo, function(p) {
                return Math.pow(p, 2) * 2;
            });

            var material = new THREE.MeshLineMaterial({
                useMap: true,
                map: texture,
                color: new THREE.Color(agencyColors[i % agencyColors.length]),
                opacity: 0.8,
                resolution: resolution,
                sizeAttenuation: true,
                lineWidth: 0.2,
                near: camera.near,
                far: camera.far,
                depthTest: false,
                depthWrite: false,
                transparent: true
            });

            var meshLine = new THREE.Mesh(g.geometry, material);
            meshLine.frustumCulled = false;
            meshLine.geo = geo;
            meshLine.g = g;
            meshLine.streamId = i;
            
            energyLines.push(meshLine);
            scene.add(meshLine);
        }
    });
}

function createParticleSystem() {
    var particleCount = 1000;
    var particles = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);
    var velocities = new Float32Array(particleCount * 3);

    for (var i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        var color = new THREE.Color(agencyColors[Math.floor(Math.random() * agencyColors.length)]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particles.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.addAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    var particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

function createEnergyField() {
    var fieldGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    var fieldMaterial = new THREE.MeshBasicMaterial({
        color: agencyColors[0],
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        side: THREE.DoubleSide
    });

    energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    energyField.rotation.x = -Math.PI / 2;
    energyField.position.y = -10;
    scene.add(energyField);
}

function createInteractiveLights() {
    for (let i = 0; i < 8; i++) {
        var light = new THREE.PointLight(agencyColors[i % agencyColors.length], 1, 50);
        light.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
        );
        
        // Create light helper geometry
        var lightGeometry = new THREE.SphereGeometry(0.2, 8, 6);
        var lightMaterial = new THREE.MeshBasicMaterial({
            color: light.color,
            transparent: true,
            opacity: 0.8
        });
        var lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.copy(light.position);
        
        light.add(lightMesh);
        lightsArr.push(light);
        interactiveObjects.push(lightMesh);
        scene.add(light);
    }
}

function loadAmbientAudio() {
    // Create ambient sound using existing audio file
    ambientSound = new THREE.Audio(listener);
    ambientSound.load('audio/base.mp3');
    ambientSound.setVolume(0.3);
    ambientSound.source.loop = true;
    ambientSound.autoplay = true;
    scene.add(ambientSound);
}

function setupMouseInteraction() {
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
        var object = intersects[0].object;
        
        // Create interaction effect
        createInteractionEffect(intersects[0].point);
        
        // Animate object
        animateObjectInteraction(object);
    }
}

function createInteractionEffect(position) {
    var effectGeometry = new THREE.RingGeometry(0.5, 2, 16);
    var effectMaterial = new THREE.MeshBasicMaterial({
        color: agencyColors[Math.floor(Math.random() * agencyColors.length)],
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    var effect = new THREE.Mesh(effectGeometry, effectMaterial);
    effect.position.copy(position);
    effect.lookAt(camera.position);
    scene.add(effect);
    
    // Animate effect
    var scale = { value: 1 };
    var opacity = { value: 0.8 };
    
    var tween = new (function() {
        var start = Date.now();
        var duration = 1000;
        
        var animate = function() {
            var elapsed = Date.now() - start;
            var progress = elapsed / duration;
            
            if (progress < 1) {
                scale.value = 1 + progress * 2;
                opacity.value = 0.8 * (1 - progress);
                
                effect.scale.setScalar(scale.value);
                effect.material.opacity = opacity.value;
                
                requestAnimationFrame(animate);
            } else {
                scene.remove(effect);
            }
        };
        animate();
    })();
}

function animateObjectInteraction(object) {
    var originalScale = object.scale.clone();
    var targetScale = originalScale.clone().multiplyScalar(1.2);
    
    // Scale up
    var scaleUp = new (function() {
        var start = Date.now();
        var duration = 200;
        
        var animate = function() {
            var elapsed = Date.now() - start;
            var progress = elapsed / duration;
            
            if (progress < 1) {
                object.scale.lerpVectors(originalScale, targetScale, progress);
                requestAnimationFrame(animate);
            } else {
                // Scale back down
                scaleDown();
            }
        };
        animate();
    })();
    
    function scaleDown() {
        var start = Date.now();
        var duration = 200;
        
        var animate = function() {
            var elapsed = Date.now() - start;
            var progress = elapsed / duration;
            
            if (progress < 1) {
                object.scale.lerpVectors(targetScale, originalScale, progress);
                requestAnimationFrame(animate);
            } else {
                object.scale.copy(originalScale);
            }
        };
        animate();
    }
}

function updateDataStreams() {
    energyLines.forEach(function(meshLine, index) {
        if (meshLine && meshLine.geo && meshLine.g) {
            var geo = meshLine.geo;
            var g = meshLine.g;
            
            // Shift existing points
            for (var j = 0; j < geo.length - 3; j += 3) {
                geo[j] = geo[j + 3];
                geo[j + 1] = geo[j + 4];
                geo[j + 2] = geo[j + 5];
            }
            
            // Add new point based on current section and interaction
            var sectionMultiplier = getSectionMultiplier();
            var mouseInfluence = mouse.length() * 2;
            
            var radius = 15 + index * 3;
            var angle = toggle * (2 + index * 0.5) + index * Math.PI / 3;
            var height = Math.sin(toggle * 10 + index) * (2 + mouseInfluence) * sectionMultiplier;
            
            geo[geo.length - 3] = Math.cos(angle) * radius;
            geo[geo.length - 2] = height;
            geo[geo.length - 1] = Math.sin(angle) * radius;
            
            g.setGeometry(geo);
        }
    });
}

function getSectionMultiplier() {
    switch(currentSection) {
        case 'services': return 1.5;
        case 'portfolio': return 2.0;
        case 'team': return 1.2;
        case 'contact': return 0.8;
        default: return 1.0;
    }
}

function updateParticleSystem() {
    if (particleSystem) {
        var positions = particleSystem.geometry.attributes.position.array;
        var velocities = particleSystem.geometry.attributes.velocity.array;
        
        for (var i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            // Boundary check and reset
            if (Math.abs(positions[i]) > 50) velocities[i] *= -1;
            if (Math.abs(positions[i + 1]) > 50) velocities[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 50) velocities[i + 2] *= -1;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
}

function updateCameraMovement() {
    var sectionFactor = getSectionMultiplier();
    var mouseInfluence = 0.5;
    
    cameraRails.position.x = Math.sin(toggle * 0.5) * 5 * sectionFactor + mouse.x * mouseInfluence;
    cameraRails.position.y = Math.cos(toggle * 0.3) * 2 + mouse.y * mouseInfluence;
    cameraRails.position.z = Math.cos(toggle * 0.5) * 5 * sectionFactor;
    
    // Subtle camera rotation based on mouse
    camera.rotation.y += (mouse.x * 0.001 - camera.rotation.y) * 0.05;
    camera.rotation.x += (mouse.y * 0.001 - camera.rotation.x) * 0.05;
}

function updateLights() {
    lightsArr.forEach(function(light, index) {
        var time = toggle + index * Math.PI / 4;
        var intensity = 0.5 + Math.sin(time * 2) * 0.5;
        light.intensity = intensity;
        
        // Move lights in orbital pattern
        var radius = 20 + index * 2;
        light.position.x = Math.cos(time) * radius;
        light.position.z = Math.sin(time) * radius;
        light.position.y = Math.sin(time * 0.5) * 10;
    });
}

function updateNexusLogo() {
    if (nexusLogo) {
        nexusLogo.rotation.x += 0.005;
        nexusLogo.rotation.y += 0.01;
        nexusLogo.rotation.z += 0.002;
        
        var scale = 1 + Math.sin(toggle * 2) * 0.1;
        nexusLogo.scale.setScalar(scale);
        
        // Change color based on current section
        var colorIndex = Math.floor(toggle * 0.5) % agencyColors.length;
        nexusLogo.material.color.setHex(agencyColors[colorIndex]);
    }
}

function updateEnergyField() {
    if (energyField) {
        var vertices = energyField.geometry.attributes.position.array;
        
        for (var i = 0; i < vertices.length; i += 3) {
            var x = vertices[i];
            var z = vertices[i + 2];
            vertices[i + 1] = Math.sin((x + z) * 0.1 + toggle * 2) * 2;
        }
        
        energyField.geometry.attributes.position.needsUpdate = true;
        energyField.rotation.z += 0.001;
    }
}

function onWindowResize() {
    resolution.set(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
}

function animate(timestamp) {
    if (isPaused) {
        return;
    }
    
    toggle += 0.01;
    
    // Update all systems
    updateDataStreams();
    updateParticleSystem();
    updateCameraMovement();
    updateLights();
    updateNexusLogo();
    updateEnergyField();
    
    // Rotate sky slowly
    if (sky) {
        sky.rotation.y += 0.0002;
    }
    
    // Update VR headset position and apply to camera
    controls.update();
    
    // Render the scene through the manager
    manager.render(scene, camera, timestamp);
    
    requestAnimationFrame(animate);
}

function pauseAll(bool) {
    isPaused = bool;
    if (bool) {
        if (ambientSound && ambientSound.isPlaying) {
            ambientSound.pause();
        }
    } else {
        animate();
        if (ambientSound && !ambientSound.isPlaying) {
            ambientSound.play();
        }
    }
}

function setCurrentSection(section) {
    currentSection = section;
    
    // Adjust visual intensity based on section
    var intensity = getSectionMultiplier();
    lightsArr.forEach(function(light) {
        light.intensity = intensity;
    });
}

// Window focus/blur handlers
window.onfocus = function() {
    pauseAll(false);
};

window.onblur = function() {
    pauseAll(true);
};

// VR Mode functions
function enterVRMode() {
    isVRMode = true;
    document.getElementById('vr-info').classList.remove('hidden');
    manager.enterVR();
}

function exitVRMode() {
    isVRMode = false;
    document.getElementById('vr-info').classList.add('hidden');
    manager.exitVR();
}

// Expose functions globally
window.enterVRMode = enterVRMode;
window.exitVRMode = exitVRMode;
window.setCurrentSection = setCurrentSection;

init();