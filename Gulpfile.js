var gulp=require("gulp");
var ejs=require("ejs");
var rimraf=require("rimraf");
var fs=require("fs");
var mkdirp=require("mkdirp");
var ghPages = require('gulp-gh-pages');
var less = require("less");

var addons=require("./addons.json");
var langPack=require("./lang.json");

const ADFLY = "http://adf.ly/4869054/";
const OUOIO = "http://ouo.io/s/kZrfrYdn?s=";
const SHST = "http://sh.st/st/cc80433e0a07cff9b538b28eb8c6d814/";
const LINKSHRINK = "http://linkshrink.net/zA6T=";
const ADFOCUS = "http://adfoc.us/serve/sitelinks/?id=309201&url=";
const BCVC = "http://bc.vc/96749/";
const SHINKIN = "http://shink.in/62630/";

const SHORT = ADFLY;
const TRACKER = "?src=external-norax";
const PICK_OF_THE_MONTH = "send-to-mail";

/* Shorteners, pages, languages */
/* Google Analytics */
/* Insert AdSense and Cookie Consent */
/* Route to unique page (merge Changelog and Welcome) */
/* Some common translations */
/* Share buttons */
/* Migrate all addons */
/* Translations */

/* /firefox-addons/page/google-share/index.html or es.html, fr.html */
/* Travis */
/* Search Engine */
/* PageSpeed, W3C */
/* Meta and Link tags */
/* Amazon */
/* MailChimp */
/* Donate */
/* Contact */
/* Página 404 */
/* Sustituir Fennec por Android */
/* Heavy test under multilang */
/* Specify URL for new installed addons */

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

gulp.task("foundation",function(){
	return gulp.src("css/foundation.min.css")
		.pipe(gulp.dest("_site/"));
});

gulp.task("css",function(cb){
	var cssFile=fs.readFileSync("css/main.less","utf-8");
	var copyAddons=Object.create(addons);
	copyAddons["adsense"]={};
	copyAddons["adsense"].color="#E56B20";
	copyAddons["pick"]={};
	copyAddons["pick"].color="#A4212F";
	copyAddons["share"]={};
	copyAddons["share"].color="#5FEC58";
	var ejsCss=ejs.render(cssFile,{addons: copyAddons});
	less.render(ejsCss,function(e,output){
		mkdirp.sync("_site");
		fs.writeFileSync("_site/main.min.css",output.css);
		cb();
	});
});

gulp.task("addonPage",function(cb){
	for(var id in addons){
		var addonPage=fs.readFileSync("ejs/addonPage.ejs","utf-8");
		for(var lang in addons[id].description){				
			var html=ejs.render(addonPage,{
				lang: langPack[lang],
				addon: addons[id],
				imgPrefix: "../../../img/",
				downloadLink: SHORT + addons[id].download + TRACKER
			});
			mkdirp.sync("_site/"+lang+"/addon/"+id);
			fs.writeFileSync("_site/"+lang+"/addon/"+id+"/index.html",html);
		}
	}
	cb();
});

gulp.task("indexPage",function(){
	var indexPage=fs.readFileSync("ejs/index.ejs","utf-8");
	
	for(var lang in langPack){
		if(lang==="en"){
			var html=ejs.render(indexPage,{
				lang: langPack[lang],
				imgPrefix: "img/",
				addons: addons,
				TRACKER: TRACKER
			});
			mkdirp.sync("_site/");
			fs.writeFileSync("_site/index.html",html);
		}else{
			var html=ejs.render(indexPage,{
				lang: langPack[lang],
				imgPrefix: "../img/",
				addons: addons,
				TRACKER: TRACKER
			});
			mkdirp.sync("_site/"+lang);
			fs.writeFileSync("_site/"+lang+"/index.html",html);
		}
	}
});

gulp.task("default",["foundation","img","css","indexPage","addonPage"],function(){
	
});
