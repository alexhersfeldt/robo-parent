const fileInput = document.getElementById('file-input');
const imgContainer = document.getElementById('img-container');
const clearButton = document.getElementById('clear');
const width = imgContainer.clientWidth;
const height = imgContainer.clientHeight;
const result = document.getElementById('result');

tf.loadLayersModel('model/model.json')
    .then(model => window.model = model);

fileInput.addEventListener(
    'change',
    () => displayImage().then(loadImageAndPredict)
);

clearButton.addEventListener('click', clear);



async function displayImage() {
    imgContainer.replaceChildren(); // clear dom to prevent predict() to run using the previous picture
    result.innerHTML = ''; // clear previous result message

    const file = fileInput.files[0];
    const reader = new FileReader();

    const img = new Image(width, height);

    reader.onload = e => {
        img.src = e.target.result;
        img.alt = 'your image';
        img.setAttribute('id', 'image');
        imgContainer.replaceChildren(img);
    }

    await reader.readAsDataURL(file);
}

function loadImageAndPredict() {
    const image = document.getElementById('image');
    if (image) predict(image)
    else setTimeout(() => loadImageAndPredict(), 50);
}

async function predict(image) {

    if (window.model) {

        let tensor_img = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([112, 112])
            .toFloat().expandDims();

        const offset = tf.scalar(255.0);
        let normalised = tensor_img.div(offset);

        const result = await model.predict(normalised).data();
        displayResult(result[0])

    } else {
        setTimeout(() => predict(image), 50);
    }
}

function displayResult(prediction) {
    let message = '';

    if (prediction > 0.5) {
        message = 'This is a mess. Clean up!';
        result.style.color = 'red';
        imgContainer.style['border-color'] = 'red';
    } else {
        message = 'Nice clean room. You can go outside and play';
        result.style.color = 'lightgreen';
        imgContainer.style['border-color'] = 'lightgreen';
    }

    result.innerHTML = message;
}

function clear() {
    result.innerHTML = '';
    imgContainer.replaceChildren();
    imgContainer.style['border-color'] = 'deepskyblue';
}
