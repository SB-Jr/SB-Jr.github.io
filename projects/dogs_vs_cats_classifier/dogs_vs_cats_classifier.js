const IMAGESIZE=[128,128];
let model;

let fileForm = document.getElementById('file_form');
let outputDiv = document.getElementById('output');
let img_uploader = document.getElementById('image_upload');
let img_output = document.getElementById('output_img');
let predictButton = document.getElementById('predict');

fileForm.addEventListener('submit', handleFileSelect, false);
predictButton.addEventListener('click', predict_class, false);
loadModel();

//To convert file submission into an image object
function handleFileSelect(event) {
    //Stop sbmit button from refreshing the page
    event.preventDefault();

    outputDiv.innerHTML = '<b>Processing!!!</b>'

    var files = img_uploader.files;
    f = files[0];
    var reader = new FileReader();
    reader.onload = (function (event) {
        return function (e) {
            let img = e.target.result;
            img_output.src = img
        }
    })(f);
    reader.readAsDataURL(f);
}

//To load a pretrained model
async function loadModel() {
    console.log('Loading Model');
    model = await tf.loadLayersModel('model/model.json');
    console.log('Model Loaded');
};

//to predict the class of the input image
async function predict_class() {
    let img_tensor = tf.browser.fromPixels(img_output);
    let img_tensor_resized = tf.image.resizeBilinear(img_tensor, IMAGESIZE);
    let img_tensor_normalized = tf.div(img_tensor_resized, 255.0);
    if(model != null && img_tensor_resized != null){
        prediction = await model.predict(img_tensor_normalized.as4D(1,128,128,3)).data();
        if(prediction > 0.5){
            outputDiv.innerHTML = 'Woof!! Woff! It is such a cute <b>Dog</b>!!';
        } else if (prediction < 0.5) {
            outputDiv.innerHTML = 'Meooooowwwwww........It is a <b>Cat</b>!!';
        } else {
            outputDiv.innerHTML = 'Sorry!! Didint quite get the image.....'
        }
    }
}
