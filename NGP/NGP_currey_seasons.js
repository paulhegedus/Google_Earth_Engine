// ingest nex-gddp
//var nexgddp = ee.ImageCollection('NASA/NEX-GDDP');

// show NGP
Map.addLayer(NGP);

// make vector of seasons
var season = ['winter']; //['fall','winter'];['spring','summer']
// ^ had to run in two chunks 

// make vector of years
var years = [];
for (var i = 1950; i != 2100; ++i) years.push(i); 
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


// start loop for seasons
var l = 0;
for(l; l < season.length; l++){
  if(season[l]=='spring'){
    var startDay = '-03-01';
    var endDay = '-05-31';
  }
  if(season[l]=='summer'){
    var startDay = '-06-01';
    var endDay = '-08-31';
  }
  if(season[l]=='fall'){
    var startDay = '-09-01';
    var endDay = '-11-30';
  }
  if(season[l]=='winter'){
    var startDay = '-12-01';
    var endDay = '-02-28';
  }
  // start loop 1950:2100
  var i = 0;
  for(i; i < years.length; i++){
    // if year less than 2006 use historical scenario
    if(years[i] < 2006){
      var j = 0;
      for(j; j < models.length; j++){
         var startDate = years[i] + startDay;
         var endDate =  (years[i]+1) + endDay;
        //----- PRECIP -----
        var pr = nexgddp
          .filterDate(startDate, endDate)
          .filterMetadata('model','equals', models[j])
          .filterMetadata('scenario','equals',scenarios[0])
          .select('pr')
          .sum()            //  precip
          .multiply(86400)  //conversion to mm/year
          .clip(NGP);
        //----- TEMP -----
        var tasmax = nexgddp
          .filterDate(startDate, endDate)
          .filterMetadata('model','equals', models[j])
          .filterMetadata('scenario','equals',scenarios[0])
          .select('tasmax')
          .mean();
        var tasmin = nexgddp
          .filterDate(startDate, endDate)
          .filterMetadata('model','equals', models[j])
          .filterMetadata('scenario','equals',scenarios[0])
          .select('tasmin')
          .mean();  
        var tasave = tasmin
          .add(tasmax)		
          .divide(2)  //mean of daily temps
          .subtract(273.15)
          .rename('tasave')
          .clip(NGP);
        // stack up layers
        if(j===0){ // <- that triple equal is "to compare to 0". this language is whack
          var prStack = pr;
          var tStack = tasave;
        }else{
          prStack = prStack.addBands(pr);
          tStack = tStack.addBands(tasave);
        }
      } // end model loop
      // rename bands in stack with names of models <- maybe unnecessary
      prStack = prStack.rename(models);
      tStack = tStack.rename(models);
      // take average across stack
      var prMed = prStack.reduce(ee.Reducer.median());
      var tMed = tStack.reduce(ee.Reducer.median());
  
      //--------------------
      // TODO: PUT ALL PRECIP AND TEMP IN STACKS??
      // MIGHT BE EASIER FOR R THAN X # OF RASTER IMPORTS
      //--------------------
      
      //----- EXPORT -----
      Export.image.toDrive({
        image: prMed,
        description: 'NGP_' + years[i] + '_' + season[l] +  '_precip_mm_1km_' + scenarios[0],
        folder:'NGP_currey',
        crs: 'EPSG:4326', 
        region: NGP,
        maxPixels: 40000000000,
        scale: 1000,
      });
      Export.image.toDrive({
        image: tMed,
        description: 'NGP_' + years[i] + '_' + season[l] + '_avgTemp_C_1km_' + scenarios[0],
        folder:'NGP_currey',
        crs: 'EPSG:4326', 
        region: NGP,
        maxPixels: 40000000000,
        scale: 1000,
      });
    }else{ // end if year <= 2006
      // else loop through rcp scenarios
      var k = 1; // <- start at 'rcp45' (javascript index starts @ 0)
      for(k; k < scenarios.length; k++){ 
        var j = 0;
        for(j; j < models.length; j++){
          var startDate = years[i] + startDay;
          var endDate =  (years[i]+1) + endDay;
          //----- PRECIP -----
          var pr = nexgddp
            .filterDate(startDate, endDate)
            .filterMetadata('model','equals', models[j])
            .filterMetadata('scenario','equals',scenarios[k])
            .select('pr')
            .sum()            // sum precip
            .multiply(86400)  //conversion to mm/year
            .clip(NGP);
          //----- TEMP -----
          var tasmax = nexgddp
            .filterDate(startDate, endDate)
            .filterMetadata('model','equals', models[j])
            .filterMetadata('scenario','equals',scenarios[k])
            .select('tasmax')
            .mean();
          var tasmin = nexgddp
            .filterDate(startDate, endDate)
            .filterMetadata('model','equals', models[j])
            .filterMetadata('scenario','equals',scenarios[k])
            .select('tasmin')
            .mean();  
          var tasave = tasmin
            .add(tasmax)		
            .divide(2)  //mean of daily temps
            .subtract(273.15)
            .rename('tasave')
            .clip(NGP);
          // stack up layers
          if(j===0){ // <- that triple equal is "to compare to 0". this language is whack
            var prStack = pr;
            var tStack = tasave;
          }else{
            prStack = prStack.addBands(pr);
            tStack = tStack.addBands(tasave);
          }
        } // end model loop
        // rename bands in stack with names of models <- maybe unnecessary
        prStack = prStack.rename(models);
        tStack = tStack.rename(models);
        // take average across stack
        var prMed = prStack.reduce(ee.Reducer.median());
        var tMed = tStack.reduce(ee.Reducer.median());
  
        //----- EXPORT -----
        Export.image.toDrive({
          image: prMed,
          description: 'NGP_' + years[i] + '_' + season[l] + '_precip_mm_1km_' + scenarios[k],
          folder:'NGP_currey',
          crs: 'EPSG:4326', 
          region: NGP,
          maxPixels: 40000000000,
          scale: 1000,
        });
        Export.image.toDrive({
          image: tMed,
          description: 'NGP_' + years[i] + '_' + season[l] + '_avgTemp_C_1km_' + scenarios[k],
          folder:'NGP_currey',
          crs: 'EPSG:4326', 
          region: NGP,
          maxPixels: 40000000000,
          scale: 1000,
        });
      } // end rcp45 and rcp85 loops
    } // end if year > 2006
  } // end years loop
} // end seasons loop






