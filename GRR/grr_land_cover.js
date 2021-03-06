// GRR Land Cover Dataset
// Paul Hegedus
//
// From USDA NASS Cropland Data Layers - 30m
// See: https://developers.google.com/earth-engine/datasets/catalog/USDA_NASS_CDL
// From USGS National Land Cover Database (NLCD) - 30m
// See: https://developers.google.com/earth-engine/datasets/catalog/USGS_NLCD#bands
//
// ASSETS
//var cdl = ee.ImageCollection('USDA/NASS/CDL'),
//nlcd = ee.ImageCollection("USGS/NLCD");
//
//----------------------------------------------------------------
// USER INPUTS
//----------------------------------------------------------------
// String or sequence of years to get data for (NO Data for GRR boundary pre 2007)
/*var years = ['2007','2008','2009','2010','2011',
             '2012','2013','2014','2015','2016','2017',
             '2018','2019']; */// this sequence for usda
var years = ['2001','2004','2006','2008','2011',
             '2013','2016']; // this sequence for usgs


// String of farms (assets that are ingested already) to loop over (NEED to add others when you have them)
var farms = ['GRR_boundary']; //

//****************************************************************
// START CODE
//****************************************************************
// start loop through years
//----------------------------------------------------------------
var j=0;
for(j; j < years.length; j++){
  var CY = years[j];
  var PY = CY - 1;
  // start for loop through farms
  //----------------------------------------------------------------
  var i=0; 
  for(i; i < farms.length; i++){
    //****************************************************************
    // set up assets
    //****************************************************************
    var table = ee.FeatureCollection("users/paulhegedus/" + farms[i]); 
    // ^IMPORTANT^: Modify this path as needed. For example, remove "_bbox" if that is not in your asset names.
    var farm_name = table;
    var current_farm = farms[i];
    //Map.addLayer(farm_name,{}, current_farm, true);
    //********************************************************************
    // START CODE FOR FARMi YEARj
    //********************************************************************
    
    // Get land cover from USDA NASS. See the link at top of script for metadata.
    var currYear = CY;
    var startDate = CY + '-01-01';
    var endDate =  CY + '-12-31';
    
    //----------------------------------------------------------------
    // USDA Land Cover 
    //----------------------------------------------------------------
    var cdl_dat = cdl.select('cropland')
                     .filterDate(startDate, endDate)
                     .first();
    
    // Clip Land Cover images
    var mask = ee.FeatureCollection(farm_name);
    var mask_geometry = mask.geometry().bounds();
    var cdl_dat_clipped = cdl_dat.clip(mask);
    
    
    Map.addLayer(cdl_dat_clipped, {}, 'Crop Landcover ' + years[j]);
    //export to google drive        
     Export.image.toDrive({
        image: cdl_dat_clipped,
        description: current_farm + '_30m_NASS_landCover_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });

    //----------------------------------------------------------------
    // USGS Land Cover 
    //----------------------------------------------------------------
    var ncld_dat = nlcd.select('landcover')
                     .filterDate(startDate, endDate)
                     .first();
    
    // Clip Land Cover images
    var mask = ee.FeatureCollection(farm_name);
    var mask_geometry = mask.geometry().bounds();
    var ncld_dat_clipped = ncld_dat.clip(mask);
    
    var landcoverVis = {
      min: 0.0,
      max: 95.0,
      palette: [
        '000000','000000','000000', '000000','000000','000000','000000','000000',
        '000000','000000','000000','466b9f', 'd1def8', '000000','000000','000000',
        '000000','000000', '000000','000000', '000000', 'dec5c5','d99282','eb0000',
        'ab0000','000000','000000','000000','000000','000000','000000','b3ac9f',
        '000000','000000','000000','000000','000000','000000','000000','000000',
        '000000','68ab5f','1c5f2c','b5c58f','000000','000000','000000', '000000', 
        '000000', '000000','000000',    'af963c',    'ccb879',    '000000',    '000000',    '000000',
        '000000',    '000000',    '000000',    '000000',    '000000',    '000000',
        '000000',    '000000',   '000000',   '000000',   '000000',    '000000',    '000000',
        '000000',    '000000',    'dfdfc2','d1d182',    'a3cc51',    '82ba9e',   '000000',   '000000',
        '000000',    '000000',    '000000',    '000000',    'dcd939',    'ab6c28',
        '000000',    '000000',    '000000',   '000000',   '000000',   '000000',    '000000',
        'b8d9eb',    '000000',    '000000',    '000000',   '000000',    '6c9fb8'  ],
    };
    Map.addLayer(ncld_dat_clipped, landcoverVis, 'NLCD Landcover' + years[j]);
  
    //export to google drive        
      Export.image.toDrive({
        image: ncld_dat_clipped,
        description: current_farm + '_30m_NLCD_landCover_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });
    //********************************************************************
    // END FARMS LOOP
    //********************************************************************
  }
  //********************************************************************
  // END YEARS LOOP
  //********************************************************************
}
