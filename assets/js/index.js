let WIDTH = 0;
if (navigator.mediaDevices) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
            const audioCtx = new AudioContext();
            const analyser = audioCtx.createAnalyser();
            window.analyser = analyser;
            window.audioCtxZap = audioCtx;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const canvas = document.getElementById('oscilloscope');
            const canvasCtx = canvas.getContext('2d')
            WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            var freqDomain = new Float32Array(analyser.frequencyBinCount);
            window.freqDomain = freqDomain;
            analyser.getFloatFrequencyData(freqDomain);

            maxFrequency = audioCtx.sampleRate / 2;

            drawAliasX(maxFrequency, 10);

            function getFrequencyValue(frequency) {
                return freqDomain[getIndexByFrequency(frequency)];
            }

            function getIndexByFrequency(frequency) {
                var nyquist = audioCtx.sampleRate / 2;
                return Math.round(frequency / nyquist * freqDomain.length);
            }

            function draw() {
                drawVisual = requestAnimationFrame(draw);
                canvasCtx.fillStyle = "rgb(0, 0, 0)";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                var freqDomain = new Uint8Array(analyser.frequencyBinCount);
                window.data123 = analyser.getByteFrequencyData(freqDomain);
                for (var i = 0; i < analyser.frequencyBinCount; i++) {
                    var value = freqDomain[i];
                    var percent = value / 256;
                    var height = HEIGHT * percent;
                    var offset = HEIGHT - height - 1;
                    var barWidth = WIDTH / analyser.frequencyBinCount;
                    var hue = i / analyser.frequencyBinCount * 360;
                    canvasCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
                    canvasCtx.fillRect(i * barWidth, offset, barWidth, height);
                }
            }
            draw();
        });
}

function atualizarAtenuacao(atenuation) {
    atenuation = -31 - 0.69 * atenuation;
    window.analyser.minDecibels = atenuation;
    document.getElementById('atenuationLabel').innerHTML = atenuation;
}

const eixoX = document.getElementById('eixoX');

function drawAliasX(maxFrequency, labels) {
    let step = maxFrequency / 9;
    for (let i = 0; i < labels; i++) {
        labelValue = Math.round(i * step);
        let div = document.createElement("div");
        div.innerHTML = labelValue;
        div.classList.add('labelX');
        div.style.minWidth = (WIDTH / 9) + 'px';
        eixoX.appendChild(div);
    }
}