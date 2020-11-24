import Swal from "sweetalert2";
import bigNumber from "bignumber.js";
import "js-loading-overlay";
import axios from "axios";
import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
const { publicKey } = genKeyPairFromSeed("this seed should be fairly long for security");

const dataKey = "myApp";
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
const client = new SkynetClient();
require('dotenv').config({ path: '../.env' })
var user = JSON.parse(localStorage.getItem("user"));
user.collected = 0
console.log('secret: ', process.env.VUE_APP_SKYNET_SECRET)
let mediaRecorder = null;
var recordedBlobs = [];
console.log("window.URL: ", URL);
let stream = null;
const swarm = require("swarm-js").at("https://swarm-gateways.net");
configureStorage();
checkMetamask();
setUpBackEvent();
initGame();

function stopRecording() {
    mediaRecorder.stop();
}

function showLoading() {
    JsLoadingOverlay.show({ spinnerIcon: "ball-pulse-rise" });
}

function hideLoading() {
    JsLoadingOverlay.hide();
}

function configureStorage() {}

function handleSourceOpen(event) {
    console.log("MediaSource opened");
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log("Source buffer: ", sourceBuffer);
}
async function handleStop(event) {
    console.log("Recorder stopped: ", event);
    const superBuffer = new Blob(recordedBlobs, { type: "video/webm" });
    var data = await blobToVideo(superBuffer);
    await Promise.resolve(upload(data));
    window.document.dispatchEvent(
        new CustomEvent("playVideo", { bubbles: true, detail: data })
    );
}

async function blobToVideo(blob) {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                //callback(evt.target.result);
                resolve("data:video/webm;base64," + btoa(evt.target.result));
            }
        };
        reader.readAsBinaryString(recordedBlobs[0]);
    });
}
async function upload(file) {
    showLoading();
    return new Promise((resolve) => {
        try {

            swarm.upload(file).then(async(hash) => {
                console.log("Uploaded file. Address:", hash);
                await Promise.resolve(saveRecording(hash));
                hideLoading();
            });
        } catch (error) {
            console.log(error);
        }
    });
}
async function saveRecording(hash) {
    return new Promise(async(resolve) => {
        resolve("receipt from adding video hash", receipt);
    });
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
        console.log("recorded data.....");
    }
}

function setUpRecorder() {
    stream = document.getElementById("myCanvas");
    stream = stream.captureStream();
    console.log("Started stream capture from canvas element: ", stream);
    let options = { mimeType: "video/webm" };
    recordedBlobs = [];
    try {
        mediaRecorder = new MediaRecorder(stream, options);
    } catch (e0) {
        console.log("Unable to create MediaRecorder with options Object: ", e0);
        try {
            options = { mimeType: "video/webm;codecs=vp8" };
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e1) {
            console.log("Unable to create MediaRecorder with options Object: ", e1);
            try {
                options = { mimeType: "video/webm;codecs=daala" };
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e2) {
                try {
                    options = { mimeType: "video/webm;codecs=h264" };
                    mediaRecorder = new MediaRecorder(stream, options);
                } catch (error) {
                    try {
                        options = { mimeType: "video/webm;codecs=h264" };
                        mediaRecorder = new MediaRecorder(stream, options);
                    } catch (error) {
                        try {
                            options = { mimeType: "video/mpeg" };
                            mediaRecorder = new MediaRecorder(stream, options);
                        } catch (error) {
                            alert(
                                "MediaRecorder is not supported by this browser.\n\n" +
                                "Try Firefox 29 or later, or Chrome 47 or later, " +
                                "with Enable experimental Web Platform features enabled from chrome://flags."
                            );
                            console.error("Exception while creating MediaRecorder:", e2);
                            return;
                        }
                    }
                }
            }
        }
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
    console.log(
        "Created MediaRecorder",
        mediaRecorder,
        "with options",
        options
    );
}

function setUpBackEvent() {
    window.onhashchange = function() {
        //blah blah blah
        console.log("changing ....................");
        window.location.href = "/server";
    };
}

function startRecording() {
    mediaRecorder.start();
    //mediaRecorder.start();
}

function checkMetamask() {
    /*==========Metamask  Detection Start==========*/
    if (typeof web3 !== "undefined") {
        console.log("MetaMask is installed");
        var metamsk = activateEthListeners();
        if (metamsk) {
            warning("Game under development");
        } else {
            diplayMetaMaskError();
        }
    } else {
        diplayMetaMaskError();
        console.log("MetaMask is not installed");
    }
}

function diplayMetaMaskError() {
    window.location.href = "/error";
}

function warning(message) {
    Swal.fire("Warning", message, "warning");
}

function activateEthListeners() {
    try {
        window.ethereum.on("accountsChanged", function(accounts) {
            location.reload();
        });
        window.ethereum.on("networkChanged", function(netId) {
            location.reload();
        });
        return true;
    } catch (error) {
        return false;
    }
}

function initGame() {

    console.log("connected DApp..");
    const assets = ["ESKARGOT.ttf"];
    const path = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1604712/";
    var paused = false;
    const frame = new Frame(
        "fit",
        window.innerWidth - 200,
        window.innerHeight,
        darker,
        green,
        assets,
        path
    );
    frame.on("ready", () => {
        zog("ready from ZIM Frame"); // logs in console (F12 - choose console)
        let stageW = frame.width;
        let stageH = frame.height;
        let stage = frame.stage;
        let timeCost = new bigNumber(100000000000000000000).toFixed();
        const intro = new Container(stageW, stageH).addTo();
        new Blob({
                controlType: "none",
                points: 6,
                color: green,
                interactive: false,
            })
            .center(intro)
            .sca(5, 3)
            .sha("rgba(0,0,0,.3)", 10, 15, 10);

        // LOGO
        // we make the logo intro relevant to the game
        // we pretend to place the logo on the shadow
        new Label("The Collector", 130, "game", dark).center(intro).mov(10, 10);
        const collector = new Label("The Collector", 130, "game", black).center(
            intro
        );
        collector.wiggle("x", collector.x, -5, 10, 700, 1000);
        collector.wiggle("y", collector.y, -5, 10, 700, 1000);
        var start = new Button({
                width: 200,
                height: 80,
                corner: 0,
                backgroundColor: black,
                rollBackgroundColor: yellow,
                label: "LOADING",
            })
            .center(intro)
            .mov(0, 150);
        setTimeout(() => {
            intro.removeFrom();
            init();
            stage.update();
        }, 6000);

        async function init() {
            // often need below - so consider it part of the template
            let currentLevelTime = 30;
            let currentLevel = 9;
            let sizePenalty = 5;
            await start();
            setUpRecorder();
            mediaRecorder.start();
            async function start() {
                createPauseEvent();
                createContinueEvent();
                setUpRecorder();
                var tile = new Tile({
                    obj: new Circle({ min: 50, max: 30 }, [
                        yellow,
                        gray,
                        black,
                        red,
                        green,
                    ]),
                    cols: currentLevel,
                    rows: currentLevel,
                    spacingH: 500,
                    spacingV: 500,
                }).animate({
                    props: { scale: 2 },
                    rewind: true,
                    loop: true,
                    ease: "elasticOut",
                    time: { min: 1500, max: 3000 },
                    sequence: 0,
                });

                var total = tile.items.length;
                tile.loop((dot) => {
                    if (dot.color == dark) total--;
                });

                var world = new Container(tile.width, tile.height).center();

                tile.centerReg(world);
                var edges = new Rectangle(
                        tile.width + 400,
                        tile.height + 400,
                        clear,
                        green,
                        2,
                        50,
                        true
                    )
                    .alp(0.5)
                    .center(world);

                const colors = [green, yellow, black, gray];
                let currentColor = Promise.resolve(setPlayerColor(colors));
                console.log("playerColor: ", currentColor);
                const player = new Blob({
                        color: currentColor,
                        borderColor: "black",
                        borderWidth: 5,
                        interactive: false,
                        width: 5,
                        height: 5,
                        text: "User 1",
                    })
                    .transformPoints("scale", 0.8)
                    .transformPoints("rotation", 90)
                    .centerReg(world);
                new Label({
                    text: user.username,
                    size: 40,
                    color: "white",
                }).centerReg(player);
                frame.follow(player);

                const colorSeries = series(colors);
                async function setPlayerColor(colors) {
                    return new Promise((resolve) => {
                        var tempColor = colors[Math.round(rand(colors.length))];
                        while (tempColor !== undefined) {
                            tempColor = colors[Math.round(rand(colors.length))];
                        }
                        resolve(tempColor);
                    });
                }

                function makeStar() {
                    // each particle calls this function - to randomize the colors
                    let star = new Shape(-20, -20, 40, 40);
                    star.graphics.f(shuffle(colors)[0]).dp(0, 0, 18, 6, rand(0.5, 0.8));
                    return star.sca(2);
                }

                const emitter = new Emitter({
                    startPaused: true,
                    obj: new Circle(40, [black, gray, yellow]),
                    gravity: 0,
                    force: 10,
                    interval: 30,
                    decayTime: 500,
                    life: 500,
                    angle: 180,
                }).loc(player, null, stage, 0);

                const stars = new Emitter({
                    obj: makeStar, // ZIM VEE value or PICK - lets you pass a function that will be evaluated later - with random colors
                    random: { rotation: { min: 0, max: 360 } }, // start at random rotations for star
                    num: 3, // send two at once
                    life: 1000,
                    decayTime: 1000,
                    animation: {
                        props: { rotation: [-360, 360] },
                        ease: "linear",
                        loop: true,
                    }, // rotate one way or the other
                    startPaused: true, // wait until the emitter is spurted when the ball contacts a pin
                });

                const pieces = new Emitter({
                    obj: new Rectangle(40, 40, [black, grey, dark]), // ZIM VEE value or PICK - lets you pass a function that will be evaluated later - with random colors
                    random: { rotation: { min: 0, max: 360 } }, // start at random rotations for star
                    num: 3, // send two at once
                    life: 1000,
                    decayTime: 1000,
                    animation: {
                        props: { rotation: [-360, 360] },
                        ease: "linear",
                        loop: true,
                    }, // rotate one way or the other
                    startPaused: true, // wait until the emitter is spurted when the ball contacts a pin
                });

                const controller = new MotionController({
                    target: player,
                    type: "mouse",
                    container: world,
                    rotate: true,
                    speed: 10,
                    boundary: new Boundary(0, 0, tile.width, tile.height),
                });
                controller.on("startmoving", function() {
                    if (!paused) {
                        emitter.pauseEmitter(false);
                    }
                });
                controller.on("stopmoving", function() {
                    emitter.pauseEmitter(true);
                });

                const speed = controller.speed;
                let snap = null;
                let mapCheck = false,
                    purchaseTimeStart = false;

                function showMap() {
                    if (mapCheck) return;
                    mapCheck = true;
                    pausePlayer();
                    player.addTo(tile);
                    tile.scaleTo(stage, 70, 70);
                    snap = new Bitmap(world).center();
                    tile.sca(1);
                    player.addTo(world);
                    world.visible = false;
                    stage.update();
                }

                function purchaseTime() {
                    if (purchaseTimeStart) return;
                    pausePlayer();
                    timer.stop();
                    stage.update();
                    window.document.dispatchEvent(
                        new Event("showModal", { bubbles: true })
                    );
                }

                function createPauseEvent() {
                    // Listen for the event.
                    window.document.addEventListener(
                        "pause",
                        function(e) {
                            pausePlayer();
                        },
                        false
                    );
                }

                function createContinueEvent() {
                    window.document.addEventListener(
                        "continue",
                        function(e) {
                            var timeAdded = JSON.parse(localStorage.getItem("time"));
                            timer.time += timeAdded.time * 60; //@dev 60 seconds =1 minute
                            continuePlay();
                        },
                        false
                    );
                }

                function clearStorage() {
                    localStorage.clear();
                }

                function continuePlay() {
                    controller.speed = speed;
                    emitter.particles.alp(1);
                    paused = false;
                    timer.start();
                    stage.update();
                }

                function pausePlayer() {
                    controller.speed = 0;
                    emitter.particles.alp(0);
                    paused = true;
                    timer.stop();
                    stage.update();
                }

                function hideMap() {
                    if (!mapCheck) return;
                    mapCheck = false;
                    continuePlay();
                    world.visible = true;
                    if (snap) snap.removeFrom();
                    stage.update();
                }

                const timer = new Timer({
                    time: currentLevelTime,
                    borderColor: dark,
                }).pos(30, 30, LEFT);
                timer.on("complete", () => {
                    timer.backing.color = red;
                    timer.color = white;
                    loose.show().mov(0, 170);
                    stopRecording();
                    stage.update();
                });
                console.log("timer: ", timer.time);
                var scorer = new Scorer({
                    backgroundColor: yellow,
                    score: total,
                }).pos(30, 30, RIGHT);

                var map = new Button({
                        label: "MAP",
                        backgroundColor: black,
                        rollBackgroundColor: green,
                        corner: 5,
                        width: 100,
                    })
                    .sca(0.8)
                    .pos(30, 30, LEFT, BOTTOM);
                map.on("mousedown", showMap);
                map.on("pressup", hideMap);
                stage.update();
                /**/
                var sablier = new Button({
                        label: "Purchase Time",
                        backgroundColor: black,
                        rollBackgroundColor: green,
                        corner: 5,
                        width: 250,
                    })
                    .sca(0.8)
                    .pos(30, 30, RIGHT, BOTTOM);
                sablier.on("mousedown", purchaseTime);
                stage.update();

                Ticker.add(function() {
                    currentColor =
                        currentColor === null || player.color === undefined ?
                        player.color :
                        currentColor;
                    emitter.loc(player);
                    if (timer.time <= 0) {
                        loose.show().mov(0, 170);
                        pausePlayer();
                    }
                    if (
                        scorer.score <= 0 ||
                        player.width <= 1.3 ||
                        player.height <= 1.3
                    ) {
                        loose.show().mov(0, 170);
                        timer.stop();
                        pausePlayer();
                    }
                    emitter.angle = player.rotation + 180;
                    tile.loop((dot) => {
                        currentColor =
                            currentColor === null || currentColor === undefined ?
                            player.color :
                            currentColor;

                        if (player.color === currentColor && player.hitTestCircle(dot)) {
                            if (dot.color === red || player.color !== dot.color) {
                                stars.loc(dot).spurt(100);
                                //timer.time -= timePenalty;
                                if (scorer.score <= 0) {
                                    loose.show().mov(0, 170);
                                    timer.stop();
                                    pausePlayer();
                                }
                                player.width -= sizePenalty;
                                player.height -= sizePenalty;
                                dot.removeFrom();
                                changeColor();
                            } else if (timer.time <= 0) {
                                loose.show().mov(0, 170);
                                pausePlayer();
                            } else if (dot.color === currentColor) {
                                user.collected += 1
                                changeColor();
                                stars.loc(dot).spurt(20);
                                scorer.score--;
                                dot.removeFrom();
                            }
                        }
                    }, true); // loop backwards when removing
                });


                async function submitScore() {
                    showLoading();


                }


                function showAlert(message) {
                    Swal.fire("Alert", message, "warning");
                }

                function showSuccess(message) {
                    Swal.fire("Success", message, "success");
                }

                function changeColor() {
                    timeout(5000, function() {
                        console.log("changing colors");
                        currentColor = colors[Math.round(Math.random() * colors.length)];
                        player.color = currentColor;
                    });
                }
                const loose = new Pane(400, 150, black, yellow);
                new Button({
                        width: 200,
                        height: 50,
                        corner: 0,
                        backgroundColor: black,
                        rollBackgroundColor: yellow,
                        label: "Replay",
                    })
                    .center(loose)
                    .tap(async() => {
                        await submitScore();
                    });
            }
            stage.update(); // this is needed to show any changes
        }
    }); // end of ready frame
}