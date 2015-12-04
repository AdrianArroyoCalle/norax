var gulp=require("gulp");
var ejs=require("ejs");
var rimraf=require("rimraf");
var shst=require("sh.st")();
var fs=require("fs");
var mkdirp=require("mkdirp");
var ghPages = require('gulp-gh-pages');

var addons=require("./addons.json");
var langPack=require("./lang.json");

/* Shorteners, pages, languages */
/* Google Analytics */
/* Insert AdSense and Cookie Consent */
/* Route to unique page (merge Changelog and Welcome) */
/* Some common translations */
/* Share buttons */

/* /firefox-addons/page/google-share/index.html or es.html, fr.html */
/* Travis */
/* Search Engine */
/* PageSpeed, W3C */
/* Meta and Link tags */

gulp.task("clean",function(cb){
	rimraf("_site",cb);
});

gulp.task('deploy', function() {
  return gulp.src('./_site/**/*')
    .pipe(ghPages());
});

gulp.task("img",function(){
	return gulp.src("img/*.png")
		.pipe(gulp.dest("_site/img/"));
});

gulp.task("css",function(){
	
});

gulp.task("addonPage",function(cb){
	for(var id in addons){
		var addonPage=fs.readFileSync("ejs/addonPage.ejs","utf-8");
		shst.short(addons[id].download,function(url){
			for(var lang in addons[id].description){				
				var html=ejs.render(addonPage,{
					lang: langPack[lang],
					addon: addons[id],
					imgPrefix: "../../../img/",
					downloadLink: url
				});
				mkdirp.sync("_site/"+lang+"/addon/"+id);
				fs.writeFileSync("_site/"+lang+"/addon/"+id+"/index.html",html);
			}
		});
	}
	cb();
});

gulp.task("indexPage",function(){
	var indexPage=fs.readFileSync("ejs/index.ejs","utf-8");
	for(var lang in langPack){
		if(lang==="en"){
			var html=ejs.render(indexPage,{
				lang: langPack[lang],
				imgPrefix: "img/"
			});
			mkdirp.sync("_site/");
			fs.writeFileSync("_site/index.html",html);
		}else{
			var html=ejs.render(indexPage,{
				lang: langPack[lang],
				imgPrefix: "../img/"
			});
			mkdirp.sync("_site/"+lang);
			fs.writeFileSync("_site/"+lang+"/index.html",html);
		}
	}
});

gulp.task("default",["img","indexPage","addonPage"],function(){
	
});
