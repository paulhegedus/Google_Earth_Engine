// Agroecology - LRES 543 - Lab 7
// 
// This code shows an example for gathering and exporting remotely sensed 
// data stored in the GEE data repository. Demonstrates with elevation, TPI,
// precipitation, and NDVI. This example works with the "wood_loma" 
// bounding box that encompases all of wood's fields in the loma area. 
// (This is to reduce repetition in data collection for each field. We 
// will clip the data to a field boundary in R.). You will need to change 
// all occurences of 'paulhegedus' to your name. Also, note that the 
// numbering of steps matches the lab 7 doc.

///////////////////    SET UP     ///////////////////
// 8) First, lets import some assets. COPY the lines below, uncomment, 
// hover cursor over lines, and select convert 
//var daymet = ee.ImageCollection('NASA/ORNL/DAYMET_V3'),
//ned = ee.Image("USGS/NED"),
//L8sr = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR"),
//s2toa = ee.ImageCollection("COPERNICUS/S2"); 

 


// 9) Next let's get our area of interest. Remember to change to your name.
var farm = ee.FeatureCollection("users/paulhegedus/wood_loma_543"); // 
var farm_name = 'wood_loma';
var farm_bounds = farm.geometry().bounds(); // makes a box around AOI
// Visualize the AOI & farm bounds on the map
Map.addLayer(farm,{},farm_name, true); // object, color, label
//Map.addLayer(farm_bounds,{}, farm_name + '_bounds', true); // show AOI bounds

///////////////////    Elevation    ///////////////////
// 10) Gather & visualizze the DEM from the National 
// Elevation Dataset (10m resolution)
var dem_clip = ned.clip(farm); // clip to farm boundary
// visualize the data
//Map.addLayer(dem_clip, {min: 800, max: 900, palette: ['black', 'white']}, 'DEM');

///////////////////    Precipitation    ///////////////////
// 11) Gather precipitation from the previous year of interest from
// NASA's Daymet V3 (1km resolution)
var year = '2017';
var startDate = year-1 +'-11-01';
var endDate =  year + '-10-31';
// select for precip data
var precip = daymet.select('prcp')
      .filterDate(startDate, endDate)
      .sum();
var precip_clip = precip.clip(farm);
// visualize data
//Map.addLayer(precip_clip,{min: 200, max: 300, palette: ['white', 'blue']},"PREC");

///////////////////    NDVI    ///////////////////
// 12) Gather NDVI from the year of interest from Sentinel 2 & Landsat 8 (>2016)
// select year and start or end dates
var year = 2017; //  
var start = ee.Date(year+'-01-01');
var end = ee.Date(year+'-12-31'); //

// A) Landsat 8 (30m resolution)
// make function to mask clouds 
var maskL8sr = function(image) {
    // Bits 3 and 5 are cloud shadow and cloud, respectively.
    var cloudShadowBitMask = (1 << 3);
    var cloudsBitMask = (1 << 5);
    // Get the pixel QA band.
    var qa = image.select('pixel_qa');
    // Both flags should be set to zero, indicating clear conditions.
    var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
              .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
    return image.updateMask(mask);
};

// filter the landsat layer 
var L8SR_filter = L8sr
  .filterBounds(farm)
  .filterDate(start, end)
  .map(maskL8sr);
// function for calculating NDVI from L8
var ndvi_L8 = L8SR_filter.map(function(img){
    var red = ee.Image(img.select('B4'));
    var nir = ee.Image(img.select('B5'));
    return (nir.subtract(red)).divide(nir.add(red)).rename('ndvi');
});
// Make a "greenest" pixel composite.
var ndvi_L8_filter_comp = ndvi_L8.qualityMosaic('ndvi');

// clip images
var mask = ee.FeatureCollection(farm);
var ndvi_L8_filter_comp_clipped = ndvi_L8_filter_comp.clip(mask);

// visualize images
//Map.addLayer(ndvi_L8_filter_comp_clipped,{min: 0, max: 1, palette: ['white', 'black']},"NDVI_L8");

// B) Sentinel 2 (10m resolution)
// Function to mask clouds using the Sentinel-2 QA band.
var maskS2clouds = function(image) {
  var qa = image.select('QA60');
  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));
  // Return the masked and scaled data, without the QA bands.
  return image.updateMask(mask).divide(10000)
         .select("B.*")
         .copyProperties(image, ["system:time_start"]);
};
        
var s2_filter = s2toa
  .filterBounds(farm)
  .filterDate(start, end)
  // Pre-filter to get less cloudy granules.
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);
  // compute ndvi using red band 4 and NIR band 8a; calculated as
  // : (b8-b4)/(b8+b4)
var ndvi_s2_filter = s2_filter.map(function(img){
  var red = ee.Image(img.select('B4'));
  var nir = ee.Image(img.select('B8'));
  return (nir.subtract(red)).divide(nir.add(red)).rename('ndvi');
});
// Make a "greenest" pixel composite.
var ndvi_s2_filter_comp = ndvi_s2_filter.qualityMosaic('ndvi');

// clip images
var mask = ee.FeatureCollection(farm);
var ndvi_s2_filter_comp_clipped = ndvi_s2_filter_comp.clip(mask);

// visualize images
//Map.addLayer(ndvi_s2_filter_comp_clipped,{min: 0, max: 1, palette: ['white', 'black']},"NDVI_S2");

///////////////////    Export Data    ///////////////////
// 13) Uncomment the code below to download data to the specified 
// Google Drive folder.
Export.image.toDrive({
    image: dem_clip,  //
    description: farm_name + '_ned_10m_dem', // 
    folder:'543_GEE',
    scale: 10,
    crs: 'EPSG:4326',
    region: farm_bounds
});

Export.image.toDrive({
    image: precip_clip,
    description: farm_name + '_daymet_1km_prec_' + year,
    folder:'543_GEE',
    crs: 'EPSG:4326',
    scale: 10,
    region: farm_bounds
});

Export.image.toDrive({
    image: ndvi_L8_filter_comp_clipped,
    description: farm_name + '_L8_30m_ndvi_' + year,
    folder:'543_GEE',
    scale: 30,
    crs: 'EPSG:4326',
    region: farm_bounds
});

Export.image.toDrive({
  image: ndvi_s2_filter_comp_clipped,
  description: farm_name + '_S2_10m_ndvi_'  + year,
  folder:'543_GEE',
  scale: 10,
  crs: 'EPSG:4326',
  region: farm_bounds
});



