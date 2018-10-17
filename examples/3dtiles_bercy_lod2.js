/* global itowns, document, renderer, setupLoadingScreen */
// # Simple Globe viewer

// Define initial camera position
var positionOnGlobe = { longitude: 2.351323, latitude: 48.856712, altitude: 50000 };
var promises = [];

// `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
var viewerDiv = document.getElementById('viewerDiv');


// Instanciate iTowns GlobeView*
var globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe, { 
    renderer: renderer,
    sseSubdivisionThreshold: 5,
    // maxSubdivisionLevel: 10, 
});
setupLoadingScreen(viewerDiv, globeView);
function addLayerCb(layer) {
    return globeView.addLayer(layer);
}

// Add one imagery layer to the scene
// This layer is defined in a json file but it could be defined as a plain js
// object. See Layer* for more info.
promises.push(itowns.Fetcher.json('./layers/JSONLayers/Ortho.json').then(addLayerCb));
promises.push(itowns.Fetcher.json('./layers/JSONLayers/Top25.json').then(addLayerCb));
// Add two elevation layers.
// These will deform iTowns globe geometry to represent terrain elevation.
promises.push(itowns.Fetcher.json('./layers/JSONLayers/WORLD_DTM.json').then(addLayerCb));
promises.push(itowns.Fetcher.json('./layers/JSONLayers/IGN_MNT_HIGHRES.json').then(addLayerCb));

exports.view = globeView;
exports.initialPosition = positionOnGlobe;