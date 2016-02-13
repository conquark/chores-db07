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

//upload image
//send result to save record with image method

