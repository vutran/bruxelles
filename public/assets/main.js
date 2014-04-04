jQuery(function($) {
    var i = 0, images = [];
    for (i = 0; i < mediaResults.length; i++) {
        images.push(mediaResults[i].images.standard_resolution.url);
    }
    $.backstretch(images, {duration: 3000, fade: 750});   
});