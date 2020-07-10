// ingest nex-gddp
//var nexgddp = ee.ImageCollection('NASA/NEX-GDDP');

// show NGP
//Map.addLayer(NGP,{},'NGP');

// Calculate GDD Function
var gdd = function(image){
  var days = image.expression('(tasmin + tasmax)/2 - (10 + 273.15)', {
    'tasmin': image.select('tasmin'),
    'tasmax': image.select('tasmax')
  });
  return days.rename(['gdd']).updateMask(days.gt(0));
};

// make vector of years
var years = [];
for (var i = 2006; i != 2100; ++i) years.push(i); 
// make vector of scenarios
var scenarios = ['historical','rcp45','rcp85'];
//make vector of models
var models = ['ACCESS1-0', 'bcc-csm1-1', 'BNU-ESM', 
             'CanESM2', 'CCSM4', 'CESM1-BGC', 
              'CNRM-CM5', 'CSIRO-Mk3-6-0', 'GFDL-CM3', 
              'GFDL-ESM2G', 'GFDL-ESM2M', 'inmcm4', 
              'IPSL-CM5A-LR', 'IPSL-CM5A-MR', 'MIROC-ESM', 
              'MIROC-ESM-CHEM', 'MIROC5', 'MPI-ESM-LR', 
              'MPI-ESM-MR', 'MRI-CGCM3', 'NorESM1-M'];

// start loop 1950:2100
var i = 0;
for(i; i < years.length; i++){
  // if year less than 2006 use historical scenario
  if(years[i] < 2006){
    var j = 0;
    for(j; j < models.length; j++){
      var startDate = years[i] + '-01-01';
      var endDate =  years[i] + '-12-31';
      var agdd = nexgddp 
        .filterDate(startDate, endDate)
        .filterMetadata('model','equals', models[j])
        .filterMetadata('scenario','equals',scenarios[0])
        .map(gdd)
        .sum()
        .clip(NGP);
      // stack up layers
      if(j===0){ // <- that triple equal is "to compare to 0". this language is whack
        var agddStack = agdd;
      }else{
        agddStack = agddStack.addBands(agdd);
      }
    } // end model loop
    // rename bands in stack with names of models <- maybe unnecessary
    agddStack = agddStack.rename(models);
    // take median across stack
    var agddMed = agddStack.reduce(ee.Reducer.median());

    //----- EXPORT -----
    Export.image.toDrive({
      image: agddMed,
      description: 'NGP_' + years[i] + '_AGDD_C_1km_' + scenarios[0],
      folder:'NGP_currey',
      crs: 'EPSG:4326', 
      region: NGP,
      maxPixels: 40000000000,
      scale: 1000,
    });
    
    //Map.addLayer(agddMed, {min:0, max:2500}, 'agddMed' + years[i]);

  }else{ // end if year <= 2006
    // else loop through rcp scenarios
    var k = 1; // <- start at 'rcp45' (javascript index starts @ 0)
    for(k; k < scenarios.length; k++){ 
      var j = 0;
      for(j; j < models.length; j++){
        var startDate = years[i] + '-01-01';
        var endDate =  years[i] + '-12-31';
        var agdd = nexgddp 
        .filterDate(startDate, endDate)
        .filterMetadata('model','equals', models[j])
        .filterMetadata('scenario','equals',scenarios[k])
        .map(gdd)
        .sum()
        .clip(NGP);
        // stack up layers
        if(j===0){ // <- that triple equal is "to compare to 0". this language is whack
          var agddStack = agdd;
        }else{
          agddStack = agddStack.addBands(agdd);
        }
      } // end model loop
      // rename bands in stack with names of models <- maybe unnecessary
      agddStack = agddStack.rename(models);
      // take median across stack
      var agddMed = agddStack.reduce(ee.Reducer.median());

      //----- EXPORT -----
      Export.image.toDrive({
        image: agddMed,
        description: 'NGP_' + years[i] + '_AGDD_C_1km_' + scenarios[k],
        folder:'NGP_currey',
        crs: 'EPSG:4326', 
        region: NGP,
        maxPixels: 40000000000,
        scale: 1000,
      });
      
    //Map.addLayer(agddMed, {min:0, max:2500}, 'agddMed' + years[i]);

    } // end rcp45 and rcp85 loops
  } // end if year > 2006
} // end years loop





