const http = require("http"),
    url = require('url'),
    qs = require('querystring'),
    mathjax = require("mathjax-node"),
    yuml2svg = require('yuml2svg'),
    sharp = require('sharp');

mathjax.start();

// SVG转换为其他格式的函数
const convertSvg = async (svgContent, format = 'png', theme = 'light', dpi = 120) => {
    if (format === 'svg') {
        return svgContent;
    }
    
    try {
        const buffer = Buffer.from(svgContent);
        // 设置高DPI以提高清晰度
        let sharpInstance = sharp(buffer, { 
            density: dpi  // 设置DPI，默认120，比默认的72高很多
        });
        
        if (format === 'jpeg' || format === 'jpg') {
            // JPEG不支持透明度，需要添加背景色
            const backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
            return await sharpInstance
                .flatten({ background: backgroundColor })
                .jpeg({ 
                    quality: 95,  // 提高JPEG质量
                    progressive: true  // 渐进式JPEG
                })
                .toBuffer();
        } else if (format === 'png') {
            return await sharpInstance
                .png({ 
                    compressionLevel: 6,  // PNG压缩级别 (0-9)
                    quality: 95  // PNG质量
                })
                .toBuffer();
        } else {
            throw new Error(`Unsupported format: ${format}`);
        }
    } catch (error) {
        throw new Error(`Format conversion failed: ${error.message}`);
    }
};

// 获取正确的Content-Type
const getContentType = (format) => {
    switch (format) {
        case 'svg':
            return 'image/svg+xml;charset=utf-8';
        case 'jpeg':
        case 'jpg':
            return 'image/jpeg';
        case 'png':
        default:
            return 'image/png';
    }
};

const app = http.createServer(async (req, res) => {
    let queryObj = qs.parse(url.parse(req.url).query),
        tex = queryObj.tex,
        yuml = queryObj.yuml,
        theme = queryObj.theme,
        format = (queryObj.format || 'png').toLowerCase(), // 默认PNG格式
        dpi = parseInt(queryObj.dpi) || 300, // DPI参数，默认300
        errFn = (msg) => {
            res.writeHead(404, {'Content-type': 'text/html;charset=utf-8'});
            res.write(msg);
            res.end();
        },
        successFn = async (svgResult) => {
            try {
                const contentType = getContentType(format);
                const result = await convertSvg(svgResult, format, theme, dpi);
                
                res.writeHead(200, {'Content-type': contentType});
                res.write(result);
                res.end();
            } catch (error) {
                errFn(`Format conversion error: ${error.message}`);
            }
        };
    
    // 验证格式参数
    const supportedFormats = ['png', 'jpeg', 'jpg', 'svg'];
    if (!supportedFormats.includes(format)) {
        errFn(`Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`);
        return;
    }
    
    // 验证DPI参数
    if (dpi < 72 || dpi > 600) {
        errFn(`Invalid DPI value: ${dpi}. DPI should be between 72 and 600.`);
        return;
    }
    
    if (yuml) {
        yuml2svg(yuml, {isDark: theme === 'dark'}).then(v => {
            successFn(v);
        }).catch(e => {
            errFn('Yuml formula is wrong!');
        });
    } else if (tex) {
        mathjax.typeset({
            math: tex,
            format: 'TeX',
            svg: true
        }, data => {
            if (theme === 'dark') {
                data.svg = data.svg.replace(/fill="currentColor"/g, 'fill="#ffffff"');
            }
            successFn(data.svg);
        });
    } else {
        // 请通过`tex`参数传入LaTeX公式，或使用`yuml`参数传入`yuml`表达式。
        // 使用`format`参数指定输出格式：png（默认）、jpeg、svg
        // 使用`dpi`参数指定分辨率：72-600（默认300）
        errFn('Please pass LaTeX formula via `tex` parameter or `Yuml` expression using `yuml` parameter. Use `format` parameter to specify output format: png (default), jpeg, svg. Use `dpi` parameter to specify resolution: 72-600 (default 300).');
    }
});

app.listen(8001);