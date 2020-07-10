//Script for gathering NDVI, NDRE, and CLRE from AOI
// 20190702
//var s2 = ee.ImageCollection("COPERNICUS/S2"),
//    table = ee.FeatureCollection("users/paulhegedus/nCottonwood_gee_bbox");

// Paul's nCottonwood inputs
var farm_name = table;
var current_farm = table;
Map.addLayer(farm_name,{},'nCottonwood_gee_bbox', true);

// NDVI
// Phil's stuff
// 20180910; calculates ndvi @ 10m resolution from Sentinel-2 
// this is generated code from the 'asset import' feature in GEE;
// define start and end date vars.
var year = 2018;
var start = ee.Date(year+'-01-01');
var end = ee.Date(year+'-12-31');

// s2_filter: filters all avail sentinel 2 (s2) images: limit spatial extent 
// to the boundary and filter date range by start and end vars defined above
var s2_filter = s2
.filterBounds(farm_name)
.filterDate(start, end);

// print number of images in collection, given spatial/temporal filters
// already defined
var count = s2_filter.size();
print('size of image collection', count);


// compute ndvi using red band 4 and NIR band 8a; calculated as
// : (b8-b4)/(b8+b4)
var ndvi = s2_filter.map(function(img){
  var red = ee.Image(img.select('B4'));
  var nir = ee.Image(img.select('B8'));
  return (nir.subtract(red)).divide(nir.add(red)).rename('ndvi');
});

// print metadata and attributes 
print(ndvi);

// limit values returned to ONE value in the 95th percentile; not using max to avoid outliers
var ndvi_95 = ndvi.reduce(ee.Reducer.percentile([95]));

// define color palette for display (optional)
var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};

// add 95th pctile values to map as one surface (optional)
Map.addLayer(ndvi_95, ndviParams, 'ndvi image');

// print info on created raster
print(ndvi_95);

// clip images
var mask = ee.FeatureCollection(farm_name);
var ndvi_95_clip = ndvi_95.clip(mask);

var mask_geometry = mask.geometry().bounds();

// export to google drive
Export.image.toDrive({
  image: ndvi_95_clip,
  description: current_farm + '_ndvi95_10m'  + '_' + year,
  folder:'surfaces',
  scale: 10,
  crs: 'EPSG:26912',
  region: mask_geometry
});


// **************** end ndvi

// NDRE
// Phil's stuff
// 20180910; this calculates ndre @ 20m resolution using approaches
// from clevers and gitleson 2012: using red-edge bands on Sentinel-2 
// for retrieving canopy chlorophyll and nitrogen content
// define start and end date vars.
var year = 2018;
var start = ee.Date(year+'-01-01');
var end = ee.Date(year+'-12-31');

// s2_filter: filters all avail sentinel 2 (s2) images: limit spatial extent 
// to the boundary and filter date range by start and end vars defined above
var s2_filter = s2
.filterBounds(farm_name)
.filterDate(start, end);

// print number of images in collection, given spatial/temporal filters
// already defined
var count = s2_filter.size();
print('size of image collection', count);

// *********** start ndre processing

// compute ndre using red edge bands 5 and 6; formula from
// clevers and gitleson 2012: (b6-b5)/(b6+b5);

var ndre = s2_filter.map(function(img){
  var re1 = ee.Image(img.select('B6'));
  var re2 = ee.Image(img.select('B5'));
  return (re1.subtract(re2)).divide(re1.add(re2)).rename('ndre');
});

// print metadata and attributes 
print(ndre);

// limit values returned to ONE value in the 95th percentile; not using max to avoid outliers
var ndre_95 = ndre.reduce(ee.Reducer.percentile([95]));

// define color palette for display (optional)
var ndreParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};

// add 95th pctile values to map as one surface (optional)
Map.addLayer(ndre_95, ndreParams, 'ndre_95 image');

// print info on created raster
print(ndre_95);

// clip images
var mask = ee.FeatureCollection(farm_name);
var ndre_95_clip = ndre_95.clip(mask);
var mask_geometry = mask.geometry().bounds();

// export to google drive
//Export.image.toDrive({
//  image: ndre_95_clip,
//  description: current_farm + '_ndre95_20m'  + '_' + year,
//  folder:'ndre',
//  scale: 20,
//  crs: 'EPSG:26912',
//  region: mask_geometry
//});

// **************** end ndre

// CLRE
// Phil's stuff
// CLRE
// 20180910; this calculates red-edge chlorophyll (clre) index @ 20m resolution 
// using approaches from clevers and gitleson 2012: using red-edge bands on 
// Sentinel-2 for retrieving canopy chlorophyll and nitrogen content
// define start and end date vars.
var year = 2018;
var start = ee.Date(year+'-01-01');
var end = ee.Date(year+'-12-31');

// s2_filter: filters all avail sentinel 2 (s2) images: limit spatial extent 
// to the boundary and filter date range by start and end vars defined above
var s2_filter = s2
.filterBounds(farm_name)
.filterDate(start, end);

// print number of images in collection, given spatial/temporal filters
// already defined
var count = s2_filter.size();
print('size of image collection', count);

// **************** start red edge chlorophyll processing

// calculate chlorophyll red edge index using bands 7 and 5; formula from 
// clevers and gitleson 2012: (b7 / b5) - 1

var clre = s2_filter.map(function(img){
  var b7 = ee.Image(img.select('B7'));
  var b5 = ee.Image(img.select('B5'));
  return (b7.divide(b5)).subtract(1).rename('cl_re');
});

// print metadata and attributes 
print(clre);

// limit values returned to ONE value in the 95th percentile; not using max to avoid outliers
var clre_95 = clre.reduce(ee.Reducer.percentile([95]));

// define color palette for display (optional)
var clreParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};

// add 95th pctile values to map as one composite surface (optional)
Map.addLayer(clre_95, clreParams, 'clre_95 image');

// print info on created raster
print(clre_95);

// clip images
var mask = ee.FeatureCollection(farm_name);
var clre_95_clip = clre_95.clip(mask);
var mask_geometry = mask.geometry().bounds();

// // export to google drive
//Export.image.toDrive({
//  image: clre_95_clip,
//  description: current_farm + '_clre95_20m'  + '_' + year,
//  folder:'clre',
//  scale: 20,
//  crs: 'EPSG:26912',
//  region: mask_geometry
//});

// ************** end red edge chlorophyll


















