/*
 * fis
 * http://fis.baidu.com/
 */
'use strict';
var path = require('path');
var STYLE_END_TAG = /<\/style>/,
	HEAD_END_TAG = /<\/head>/;

module.exports = function (ret, conf, setting, opt) {
	var widget_reg = /<widget\s*src=[\'\"]([^\'\"]*)[\'\"]\s*>/,
		matches;
	fis.util.map(ret.src, function(subpath, file){
		if(file.isHtmlLike){
			var content = file.getContent();
			if((matches = content.match(widget_reg))){
				// 处理css文件依赖
				var htmlFilename = matches[1],
					cssFilename = htmlFilename.replace('.html', '.scss'),
					htmlFile = fis.file.wrap(htmlFilename),
					cssFile = fis.file.wrap(cssFilename);

				if(cssFile.exists()){
					if(opt.pack){
						// inline方式	
						var _cssContent = cssFile.getContent();
						content = content.replace(STYLE_END_TAG, _cssContent + '\n$&');
					}else{
						// link 方式
						var _link = '<link rel="stylesheet" type="text/css" href="'+ ret.map.res[cssFilename].uri +'">';
						content = content.replace(HEAD_END_TAG, _link + '\n$&');
					}
				}

				if(htmlFile.exists()){
					content = content.replace(widget_reg, htmlFile.getContent());
				}
				file.setContent(content);
			}
		}
	});
};