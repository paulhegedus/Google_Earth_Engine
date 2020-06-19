//Script for gathering surface data from AOI
// 20190702
// user will need to create a bounding box (bbox) dataset and upload as an asset to GEE
//var s2 = ee.ImageCollection("COPERNICUS/S2"),
//    table = ee.FeatureCollection("users/paulhegedus/nCottonwood_gee_bbox");

// Paul's nCottonwood inputs
var farm_name = table;
var current_farm = table;
Map.addLayer(farm_name,{},'nCottonwood_gee_bbox', true);

// Surfaces
// downloads elevation data, calculates slope, aspect, tpi from USGS National 
// Elevation Dataset (NED); 
// @ 1/3 arc-second resolution (10m) clipped to farm boundary box

// Calculate slope and aspect
// Define a function to convert from degrees to radians for aspect
function radians(img) {
  return img.toFloat().multiply(Math.PI).divide(180);
}

var terrain = ee.Algorithms.Terrain(ned);
var slope = terrain.select('slope').float();
var aspect_rad = radians(terrain.select('aspect')).float();

// calculate TPI
var scale = 10;
var tpi_radius = 3*scale;
var tpi = ned.subtract(ned.focal_mean(tpi_radius, 'circle', 'meters')).add(0.5);

// clip datasests to farm boundary box
var mask = ee.FeatureCollection(farm_name);
var mask_geometry = mask.geometry().bounds();
var dem_clip = ned.clip(mask);
var slope_clip = slope.clip(mask);
var aspect_rad_clip = aspect_rad.clip(mask);
var tpi_clip = tpi.clip(mask);

// add to map (optional)
Map.addLayer(tpi_clip);

// export to google drive (have to change for each var)
Export.image.toDrive({
  image: tpi_clip, 
  description: current_farm + '_tpi_10m', //
  folder:'GEE_Surfaces',
  scale: 10,
  crs: 'EPSG:26912',
  region: mask_geometry
});





