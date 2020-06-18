//----------------------------------------------------------------
// Assets (COPY AND PASTE, UNCOMMENT, & IMPORT)
//----------------------------------------------------------------
//var gridmet = ee.ImageCollection("IDAHO_EPSCOR/GRIDMET"),
//ned = ee.Image("USGS/NED"),
//cdem = ee.ImageCollection("NRCan/CDEM"),
//srtm = ee.Image('USGS/SRTMGL1_003'),
//L7sr = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR"),
//s2toa = ee.ImageCollection("COPERNICUS/S2"),
//L5sr = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR"),
//L8sr = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR"),
//smap = ee.ImageCollection('NASA_USDA/HSL/SMAP_soil_moisture'),
//daymet = ee.ImageCollection('NASA/ORNL/DAYMET_V3'); // //s2sr = ee.ImageCollection("COPERNICUS/S2_SR"),


var precCY = 1; 
var precPY = 1; 
var gddCY = 1; 
var gddPY = 1; 
var aspect = 1; 
var slopeI = 1; 
var elev = 1; 
var tpiI = 1; 
var ndviCY = 1; 
var ndviPY = 1; 
var ndreCY = 1; 
var ndrePY = 1; 
var clreCY = 1; 
var clrePY = 1; 
var smapCY = 1;
var smapPY = 1;

// Calculate GDD Function
        var gdd = function(image){
          var days = image.expression('(tmmn + tmmx)/2 - (0 + 273.15)', {
            'tmmn': image.select('tmmn'),
            'tmmx': image.select('tmmx')
          });
          return days.rename(['gdd']).updateMask(days.gt(0));
        };
        
// Calculate GDD Function
      var gddV3 = function(image){
        var days = image.expression('(tmax + tmin)/2 - 0', {
          'tmin': image.select('tmin'),
          'tmax': image.select('tmax')
        });
        return days.rename(['gdd']).updateMask(days.gt(0));
      };

// String or sequence of years to get data for
//var years = ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019'];
var years = ['2000'];

// String of farms (assets that are ingested alread) to loop over (NEED to add others when you have them)
var farms = ['<farmer>_<farmname>']; // i.e. ['smith_famfarm','jones_farmtwo']

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
    var table = ee.FeatureCollection("users/paulhegedus/" + farms[i] + "_bbox");
    var farm_name = table;
    var current_farm = farms[i];
    Map.addLayer(farm_name,{}, current_farm + '_bbox', true);
    
    //----------------------------------------------------------------
    // Precipitation
    //----------------------------------------------------------------
    // PREC CY
    if(precCY==1){
      //use month-day of 11-01 and 03-30 for prec thru march of current grow yr, 
      var currYear = CY;
      var startDate = PY + '-11-01';
      var endDate =  CY + '-03-30';
      // select for precip data
      var precip = daymet.select('prcp')
        .filterDate(startDate, endDate)
        .sum();
      // Clip Precip images
      var mask = ee.FeatureCollection(farm_name);
      var mask_geometry = mask.geometry().bounds();
      var precip_sum_cy_clipped = precip.clip(mask);
      
      //precip_sum_cy_clipped.min();
      //print(precip_sum_cy_clipped.max());
      
      Map.addLayer(
        precip_sum_cy_clipped,
        {min:0,max:250,palette: ['00FFFF', '0000FF']},
        current_farm + '_1km_daymet_prec_currYr_' + currYear, 
        true
      );
    } // END PREC CY
    
    // PREC PY
    if(precPY==1){
      //use 11-01 and 10-31 for prev grow yr
      var prevYear = PY;
      var startDate = PY-1 +'-11-01';
      var endDate =  PY + '-10-31';
      // select for precip data
      var precip = daymet.select('prcp')
        .filterDate(startDate, endDate)
        .sum();
      // Clip Precip images
      var mask = ee.FeatureCollection(farm_name);
      var mask_geometry = mask.geometry().bounds();
      var precip_sum_py_clipped = precip.clip(mask);
      
      Map.addLayer(
        precip_sum_py_clipped,
        {min:100,max:650,palette: ['00FFFF', '0000FF']},
        current_farm + '_1km_daymet_prec_prevYr_' + prevYear, 
        true
      );
    } // END PREC PY
    
    //----------------------------------------------------------------
    // Growing Degree Days
    //----------------------------------------------------------------
    // GDD CY
    if(gddCY==1){
      var grow_yr = CY;
      
      //use this block for gdd from jan 1 to mar 30 of current yr (current year)
      var gdd_cy = daymet 
        .filterDate(grow_yr.toString(), (grow_yr + 1).toString())
        .filter(ee.Filter.dayOfYear(1, 90))
        .map(gddV3)
        .sum();
      // Clip GDD images
      var mask = ee.FeatureCollection(farm_name);
      var mask_geometry = mask.geometry().bounds();
      var gdd_cy_clip =  gdd_cy.clip(mask); 
      
      Map.addLayer(
        gdd_cy_clip,
        {min:600,
        max:6000,
        palette: ['FFFF00', 'FF0000']},
        current_farm + '_1km_daymet_gdd_currYr_' + grow_yr, 
        true
      );
    } // END CY GDD
    
    // GDD PY
    if(gddPY==1){
      var grow_PrevYr = PY;
      // use this block for gdd from jan 1 thru july 31 of prev grow yr (prev yr)
      var gdd_py = daymet
        .filterDate(grow_PrevYr.toString(), (grow_PrevYr + 1).toString())
        .filter(ee.Filter.dayOfYear(1, 213))
        .map(gddV3)
        .sum();
      // Clip GDD images
      var mask = ee.FeatureCollection(farm_name);
      var mask_geometry = mask.geometry().bounds();
      var gdd_py_clip = gdd_py.clip(mask); //
      
      Map.addLayer(
        gdd_py_clip,
        {min:1000,
        max:3000,
        palette: ['FFFF00', 'FF0000']},
        current_farm + '_1km_daymet_gdd_prevYr_' + grow_PrevYr, 
        true
      );
    } // END PY GDD  
    
    //---------------------------------------------------------
    if(farms[i]!='loewen_steinbach'){ // IF NOT CANADA get GRIDMET
      //----------------------------------------------------------------
      // Precipitation
      //----------------------------------------------------------------
      // PREC CY
      if(precCY==1){
        //use month-day of 11-01 and 03-30 for prec thru march of current grow yr, 
        var currYear = CY;
        var startDate = PY + '-11-01';
        var endDate =  CY + '-03-30';
        // select for precip data
        var precip = gridmet.select('pr')
          .filterDate(startDate, endDate)
          .sum();
        // Clip Precip images
        var mask = ee.FeatureCollection(farm_name);
        var mask_geometry = mask.geometry().bounds();
        var precip_sum_cy_clipped = precip.clip(mask);
        
        Map.addLayer(
          precip_sum_cy_clipped,
          {
            min:0,
            max:250,
            palette: ['00FFFF', '0000FF']
          },
          current_farm + '_4km_gridmet_prec_currYr_' + currYear, 
          true
        );
      } // END PREC CY  
      
      // PREC PY
      if(precPY==1){
        //use 11-01 and 10-31 for prev grow yr
        var prevYear = PY;
        var startDate = PY-1 +'-11-01';
        var endDate =  PY + '-10-31';
        // select for precip data
        var precip = gridmet.select('pr')
          .filterDate(startDate, endDate)
          .sum();
        // Clip Precip images
        var mask = ee.FeatureCollection(farm_name);
        var mask_geometry = mask.geometry().bounds();
        var precip_sum_py_clipped = precip.clip(mask);
        Map.addLayer(
          precip_sum_py_clipped,
          {
            min:100,
            max:650,
            palette: ['00FFFF', '0000FF']
          },
          current_farm + '_4km_gridmet_prec_prevYr_' + prevYear, 
          true
        );
      } // END PREC PY
    
      //----------------------------------------------------------------
      // Growing Degree Days
      //----------------------------------------------------------------
      // GDD CY
      if(gddCY==1){
        var grow_yr = CY;
        
        //use this block for gdd from jan 1 to mar 30 of current yr (current year)
        var gdd_cy = gridmet 
          .filterDate(grow_yr.toString(), (grow_yr + 1).toString())
          .filter(ee.Filter.dayOfYear(1, 90))
          .map(gdd)
          .sum();
        // Clip GDD images
        var mask = ee.FeatureCollection(farm_name);
        var mask_geometry = mask.geometry().bounds();
        var gdd_cy_clip =  gdd_cy.clip(mask); 
        Map.addLayer(
        gdd_cy_clip,
        {min:600,
        max:6000,
        palette: ['FFFF00', 'FF0000']},
         current_farm + '_4km_gridmet_gdd_currYr_' + grow_yr, 
        true
      );
      } // END CY GDD
     
     // GDD PY
      if(gddPY==1){
        var grow_PrevYr = PY;
        
        // use this block for gdd from jan 1 thru july 31 of prev grow yr (prev yr)
        var gdd_py = gridmet
          .filterDate(grow_PrevYr.toString(), (grow_PrevYr + 1).toString())
          .filter(ee.Filter.dayOfYear(1, 213))
          .map(gdd)
          .sum();
        // Clip GDD images
        var mask = ee.FeatureCollection(farm_name);
        var mask_geometry = mask.geometry().bounds();
        var gdd_py_clip = gdd_py.clip(mask); //
        Map.addLayer(
        gdd_py_clip,
        {min:1000,
        max:3000,
        palette: ['FFFF00', 'FF0000']},
        current_farm + '_4km_gridmet_gdd_prevYr_' + grow_PrevYr, 
        true
      );
      } // END PY GDD
    }
  }
}
  
    
    















