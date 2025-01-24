const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Entfernt den Standard-Loader
engine.loadingScreen = null;

// Anpassung der Auflösung
engine.setHardwareScalingLevel(1); // 1 bedeutet volle Auflösung

const createScene = function () {
    // Create a basic scene
    const scene = new BABYLON.Scene(engine);

    // Transparenten Hintergrund einstellen
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // RGBA: vollständig transparent

    // Add a camera
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 3,
        5,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas, true);

    // Add a light
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.8;

    // Set HDR Environment Texture
    const hdrTexture = new BABYLON.HDRCubeTexture(
        "./assets/creepy_bathroom_1k.hdr", // Pfad zur HDR-Datei
        scene,
        512 // Auflösung des HDRs (z. B. 512, 1024)
    );
    scene.environmentTexture = hdrTexture;
    scene.environmentIntensity = 1.0;

    // Load the GLB model
    let model;
    BABYLON.SceneLoader.Append(
        "./models/", // Directory containing the .glb file
        "model.glb", // Name of the .glb file
        scene,
        function (loadedScene) {
            console.log("Model loaded successfully!");
            model = loadedScene.meshes[1]; // Erstes Mesh des Modells (falls nötig)
        },
        null,
        function (error) {
            console.error("Error while loading the model:", error);
        }
    );

    // Parallax effect: Move model slightly based on mouse position
    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    scene.onBeforeRenderObservable.add(() => {
        if (model) {
            model.rotation.y = mouseX * 0.2; // Rotate horizontally
            model.rotation.x = -mouseY * 0.1; // Rotate vertically
        }
    });

    return scene;
};

const scene = createScene(); // Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
