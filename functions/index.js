const functions = require('firebase-functions');
const vision = require('@google-cloud/vision');
const admin = require('firebase-admin');

// Initialize the default Firebase app
admin.initializeApp()
const db = admin.firestore()

exports.analyzeImage = functions.storage.object().onFinalize(async (object) => {
    const imageBucket = `gs://${object.bucket}/${object.name}`;

    // Use Google Cloud Vision API to detect faces in the image
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.faceDetection(imageBucket);
    const faces = result.faceAnnotations;

    // Record results for each face detected
    faces.forEach(async (face, i) => {
        await db.collection('image-results').add({
            imageName: object.name,
            joy: face.joyLikelihood,
            anger: face.angerLikelihood,
            sorrow: face.sorrowLikelihood,
            surprise: face.surpriseLikelihood
        })
    })
});