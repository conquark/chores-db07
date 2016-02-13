cloudinary.setCloudName('ntcapps');

var theresult = {};

var startwidget = function() {
    cloudinary.openUploadWidget({upload_preset: 'xisr5ror', cropping:true, multiple:false}, 
  function(error, result) {
    console.log(error, result);
    theresult = result;
    alert(result[0].url);
    });
}




    window["dictionary"] = {
      "powered_by_cloudinary": "Powered by Cloudinary - Image management in the cloud",
      "sources.local.title": "My files",
      "sources.local.drop_file": "Drop file here",
      "sources.local.drop_files": "Drop files here",
      "sources.local.drop_or": "Or",
      "sources.local.select_file": "Select File",
      "sources.local.select_files": "Select Files",
      "sources.url.title": "Web Address",
      "sources.url.note": "Public URL of an image file:",
      "sources.url.upload": "Upload",
      "sources.url.error": "Please type a valid HTTP URL.",
      "sources.camera.title": "Camera",
      "sources.camera.note": "Make sure your browser allows camera capture, position yourself and click Capture:",
      "sources.camera.capture": "Capture",
      "progress.uploading": "Uploading...",
      "progress.upload_cropped": "Upload",
      "progress.processing": "Processing...",
      "progress.retry_upload": "Try again",
      "progress.use_succeeded": "OK",
      "progress.failed_note": "Some of your images failed uploading."
  };


//$(document).ready(function() {
//   $.cloudinary.config({ cloud_name: 'ntcapps', api_key: '323117293954935'});
//    
//    $('.upload_field').unsigned_cloudinary_upload("xisr5ror", 
//      { cloud_name: 'ntcapps', tags: 'browser_uploads' }, 
//      { multiple: true }
//    ).bind('cloudinarydone', function(e, data) {
//
//      $('.thumbnails').append($.cloudinary.image(data.result.public_id, 
//        { format: 'jpg', width: 150, height: 100, 
//          crop: 'thumb', gravity: 'face', effect: 'saturation:50' } ))}
//
//    ).bind('cloudinaryprogress', function(e, data) { 
//
//      $('.progress_bar').css('width', 
//        Math.round((data.loaded * 100.0) / data.total) + '%'); 
//
//    });    
//});
//
//var testdata = { 
//  "timestamp":  1345719094, 
//  "callback": "https://www.example.com/cloudinary_cors.html",
//  "signature": "7ac8c757e940d95f95495aa0f1cba89ef1a8aa7a", 
//  "api_key": "1234567890" 
//}
//
//var tdstr = JSON.stringify(testdata);
//
//var testdataescaped = encodeURI(testdata);
//
//var tdstresc = encodeURI(tdstr);
//
////alert('tdstr = ' + tdstr);
////alert('tdstresc = ' + tdstresc);


cloudinary.openUploadWidget({upload_preset: 'xisr5ror'}, 
  function(error, result) {console.log(error, result)});
