// GRR Soil Datasets
// Paul Hegedus
//
// From OpenLandMap
// Soil Org. Carbon: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_ORGANIC-CARBON_USDA-6A1C_M_v02#description
// Bulk Density: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_BULKDENS-FINEEARTH_USDA-4A1H_M_v02
// Clay Content: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_CLAY-WFRACTION_USDA-3A1A1A_M_v02
// Sand Content: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_SAND-WFRACTION_USDA-3A1A1A_M_v02
// Field Capacity: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_WATERCONTENT-33KPA_USDA-4B1C_M_v01#description
// pH: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_PH-H2O_USDA-4C1A2A_M_v02
// Taxonomy Great Groups: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_GRTGROUP_USDA-SOILTAX_C_v01
// USDA Soil Texture Class: https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_SOL_SOL_TEXTURE-CLASS_USDA-TT_M_v02
// 
// 
// ASSETS
//var soc = ee.Image("OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02"),
// bd = ee.Image("OpenLandMap/SOL/SOL_BULKDENS-FINEEARTH_USDA-4A1H_M/v02"),
// clay = ee.Image("OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02"),
// sand = ee.Image("OpenLandMap/SOL/SOL_SAND-WFRACTION_USDA-3A1A1A_M/v02"),
// fc = ee.Image("OpenLandMap/SOL/SOL_WATERCONTENT-33KPA_USDA-4B1C_M/v01"),
// pH = ee.Image("OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02"),
// gg = ee.Image("OpenLandMap/SOL/SOL_GRTGROUP_USDA-SOILTAX_C/v01"),
// txtr = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02");
//

//
//----------------------------------------------------------------
// USER INPUTS
//----------------------------------------------------------------
// String or sequence of years to get data for
var years = ['2019'];
// Note that it is the same image for all years..

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
    var currYear = CY;
    
    var mask = ee.FeatureCollection(farm_name);
    var mask_geometry = mask.geometry().bounds();

    //----------------------------------------------------------------
    // Soil Organic Carbon
    //----------------------------------------------------------------
    //var soc_clipped = soc.clip(mask).filterDate(startDate,endDate);
    var soc_clipped = soc.clip(mask);
    
    /*var visualization = {
      bands: ['b0'],
      min: 0.0,
      max: 120.0,
      palette: [
        "ffffa0","f7fcb9","d9f0a3","addd8e","78c679","41ab5d",
        "238443","005b29","004b29","012b13","00120b",
      ]
    };
    Map.addLayer(soc_clipped, visualization, "Soil organic carbon content in x 5 g / kg" + years[j]);
    */
    //export to google drive        
      Export.image.toDrive({
        image: soc_clipped,
        description: current_farm + '_250m_SoilOrgCarbon_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });

    //----------------------------------------------------------------
    // Bulk Density
    //----------------------------------------------------------------
    var bd_clipped = bd.clip(mask);
    
    /*var visualization = {
      bands: ['b0'],
      min: 5.0,
      max: 185.0,
      palette: ['5e3c99', 'b2abd2', 'f7e0b2', 'fdb863', 'e63b01']
    };
    
    Map.addLayer(bd_clipped, visualization, "Soil bulk density in x 10 kg / m3" + years[j]);
*/      
    //export to google drive        
      Export.image.toDrive({
        image: bd_clipped,
        description: current_farm + '_250m_bulkDensity_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });
    //----------------------------------------------------------------
    // Clay Content
    //----------------------------------------------------------------
    var clay_clipped = clay.clip(mask);    
    
    /*var visualization = {
      bands: ['b0'],
      min: 2.0,
      max: 100.0,
      palette: [
        "FFFF00","F8F806","F1F10C","EBEB13","E4E419","DDDD20",
        "D7D726","D0D02D","CACA33","C3C33A","BCBC41","B6B647",
        "B0B04E","A9A954","A3A35A","9C9C61","959568","8F8F6E",
        "898975","82827B","7B7B82","757589","6E6E8F","686895",
        "61619C","5A5AA3","5454A9","4D4DB0","4747B6","4141BC",
        "3A3AC3","3333CA","2D2DD0","2626D7","2020DD","1919E4",
        "1212EB","0C0CF1","0606F8","0000FF",
      ]
    };
    
    Map.addLayer(clay_clipped, visualization, "Clay content in % (kg / kg)" + years[j]);
    */
    //export to google drive        
      Export.image.toDrive({
        image: clay_clipped,
        description: current_farm + '_250m_clayContent_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });
    //----------------------------------------------------------------
    // Sand Content
    //----------------------------------------------------------------
    var sand_clipped = sand.clip(mask);    
    
   /* var visualization = {
      bands: ['b0'],
      min: 1.0,
      max: 100.0,
      palette: [
        "FFFF00","F8F806","F1F10C","EBEB13","E4E419","DDDD20",
        "D7D726","D0D02D","CACA33","C3C33A","BCBC41","B6B647",
        "B0B04E","A9A954","A3A35A","9C9C61","959568","8F8F6E",
        "898975","82827B","7B7B82","757589","6E6E8F","686895",
        "61619C","5A5AA3","5454A9","4D4DB0","4747B6","4141BC",
        "3A3AC3","3333CA","2D2DD0","2626D7","2020DD","1919E4",
        "1212EB","0C0CF1","0606F8","0000FF",
      ]
    };

    Map.addLayer(sand_clipped, visualization, "Sand content in % (kg / kg)" + years[j]);
    */
    //export to google drive        
      Export.image.toDrive({
        image: sand_clipped,
        description: current_farm + '_250m_sandContent_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });
    //----------------------------------------------------------------
    // Field Capacity
    //----------------------------------------------------------------
    var fc_clipped = fc.clip(mask);    
    
    /*var visualization = {
      bands: ['b0'],
      min: 0.0,
      max: 52.9740182135385,
      palette: [
        "d29642","eec764","b4ee87","32eeeb","0c78ee","2601b7",
        "083371",
      ]
    };
    
    Map.addLayer(fc_clipped, visualization, "Soil water content at 33kPa (field capacity)" + years[j]);
*/    
    //export to google drive        
      Export.image.toDrive({
        image: fc_clipped,
        description: current_farm + '_250m_fieldCapacity33kPa_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });
    //----------------------------------------------------------------
    // Soil Water pH Level
    //----------------------------------------------------------------
    var pH_clipped = pH.clip(mask);

    /*var visualization = {
      bands: ['b0'],
      min: 42.0,
      max: 110.0,
      palette: [
        "FF0000","FF1C00","FF3900","FF5500","FF7100","FF8E00",
        "FFAA00","FFC600","FFE200","FFFF00","E3FF00","C7FF00",
        "AAFF00","8EFF00","72FF00","55FF00","39FF00","1DFF00",
        "01FF00","00FF1C","00FF38","00FF54","00FF71","00FF8D",
        "00FFA9","00FFC6","00FFE2","00FFFE","00E3FF","00C7FF",
        "00ABFF","008FFF","0072FF","0056FF","003AFF","001DFF",
        "0001FF","1B00FF","3800FF","5400FF",
      ]
    };
    
    Map.addLayer(pH_clipped, visualization, "Soil pH x 10 in H2O" + years[j]);
    */
    //export to google drive        
      Export.image.toDrive({
        image: pH_clipped,
        description: current_farm + '_250m_pHx10_soilWater_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });
    //----------------------------------------------------------------
    // USDA Soil Great Group Taxonomy
    //----------------------------------------------------------------
    var gg_clipped = gg.clip(mask);
    
    /*var visualization = {
      bands: ['grtgroup'],
      min: 0.0,
      max: 433.0,
      palette: [
        "FFFFFF","ADFF2D","ADFF22","A5FF2F","87FF37","BAF019",
        "87FF19","96F03D","A3F52F","AFF319","91FF37","9CF319",
        "9BFF37","91FF19","71FF37","86FF19","A9D42D","AFF519",
        "9BFF19","9AF024","A5FD2F","88FF37","AFED19","71FF19",
        "AFF026","8CF537","B7FF19","7177C0","9A85EC","F5F5E1",
        "52CF5A","E42777","4EF76D","FF00FB","EB05EB","FA04FA",
        "FC04F5","F50DF0","F118F1","FA0CFA","FC05E1","F100D5",
        "EB09E6","FA22FA","FFDAB9","F5D2BB","E8C9B8","FFDDC4",
        "E7CBC0","FFD2C3","F5D6BB","D5D3B9","E8D4B8","E7CDC0",
        "F3EAC8","A0C4BA","FFD2B9","F5DABB","F5D5B9","E8EBB8",
        "FFDDC2","E7FFC0","F3E6C8","FFDAB9","F5CDB9","A91D30",
        "796578","D8FF6E","177548","43EFD6","8496A9","296819",
        "73FFD4","6FFFC8","75FBC9","86F5D1","82FFD2","88EEC8",
        "80FFD4","6BFFC9","88EEC8","7FFFC8","81FFD2","86F0D4",
        "67FFC8","88EEC8","7FFBCB","87FFD2","8AF5CE","6BFAD2",
        "78F0D4","88EEC8","7FFBD4","73F5CD","88C8D2","91F0CD",
        "73CDD2","88EEC8","FB849B","DD4479","61388B","A52A30",
        "722328","D81419","A42828","82F5CD","A54C2E","C11919",
        "B91419","21B199","702028","B41919","B22328","A2C7EB",
        "36BA79","806797","CB5B5F","CD5C5C","D94335","D35740",
        "E05A5D","CF5B5C","CA5964","CA5D5F","CD5E5A","CA5969",
        "D95A35","D36240","E05C43","D64755","CF595C","FF5F5F",
        "CD6058","D95F35","D35140","D65A55","E05C59","CF525E",
        "C65978","F5615F","826F9A","CFF41A","4A6F31","A96989",
        "E16438","24F640","88C1F9","F5D25C","D74322","7F939E",
        "41A545","8F8340","09FE03","0AFF00","0FF30F","02F00A",
        "0FC903","17F000","0CFF00","0AC814","0CFE00","0AFF0A",
        "03FF05","1CF31C","24F000","00FF0C","14C814","00FE4C",
        "14FF96","44D205","05F305","62F00A","0FCD03","00D20F",
        "1ADD11","09FF0C","03FF05","05E700","02F00A","0FEA03",
        "00F000","0CCB0C","14DD14","6A685D","FAE6B9","769A34",
        "6FF2DF","CA7FC6","D8228F","C01BF0","D2BAD3","D8C3CB",
        "D4C6D4","D5BED5","DDB9DD","D8D2D8","D4C9D4","D2BAD5",
        "D5BAD5","D5B2D5","D8C8D2","D4CBD4","552638","2571EB",
        "FFA514","F3A502","FB7B00","F0B405","F7A80F","FB9113",
        "FFA519","F3A702","FBBA07","F7970F","F3A702","FB5A00",
        "F0C005","F7810F","FF9C00","F3B002","F0B005","F7980F",
        "4D7CFC","FFFF00","FAFA05","EBEB22","FFFF14","F1F10A",
        "FAFA05","EBEB1E","F5EB0C","EEF506","F1F129","FAFA05",
        "EBEB0C","F5D202","FFD700","F1F12B","A91FAC","2DA468",
        "9A8B71","76B989","713959",
      ]
    };
    
    Map.addLayer(gg_clipped, visualization, "USDA soil taxonomy great groups" + years[j]);
    */
    //export to google drive        
      Export.image.toDrive({
        image: gg_clipped,
        description: current_farm + '_250m_USDA_soilClassGreatGroup_' + currYear,
        folder:'GRR_GEE',
        crs: 'EPSG:4326', // saves it as long lat wgs84 (reprojected for spatial analysis)
        scale: 10,
        region: mask_geometry
      });
    //----------------------------------------------------------------
    // USDA Soil Texture Class
    //----------------------------------------------------------------
    var txtr_clipped = txtr.clip(mask);

    /*var visualization = {
      bands: ['b0'],
      min: 1.0,
      max: 12.0,
      palette: [
        "d5c36b","b96947","9d3706","ae868f","f86714","46d143",
        "368f20","3e5a14","ffd557","fff72e","ff5a9d","ff005b",
      ]
    };
    
    Map.addLayer(txtr_clipped, visualization, "Soil texture class (USDA system)" + years[j]);
*/
    //export to google drive        
      Export.image.toDrive({
        image: txtr_clipped,
        description: current_farm + '_250m_USDA_soilTexture_' + currYear,
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
