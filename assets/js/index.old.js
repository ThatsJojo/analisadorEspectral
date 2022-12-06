if (navigator.mediaDevices) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
            const audioCtx = new AudioContext();
            const analyser = audioCtx.createAnalyser();
            window.analyserZap = analyser;
            window.audioCtxZap = audioCtx;


            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const canvas = document.getElementById('oscilloscope');
            const canvasCtx = canvas.getContext('2d')
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            analyser.fftSize = 1024;
            analyser.minDecibels = -50;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            function draw() {
                drawVisual = requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                canvasCtx.fillStyle = "rgb(0, 0, 0)";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);



                const barWidth = (WIDTH / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = 2 * dataArray[i];

                    canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

                    x += barWidth + 1;
                }
            }
            draw();
        });
}