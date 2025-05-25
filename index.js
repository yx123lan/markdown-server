const http = require("http"),
    url = require('url'),
    qs = require('querystring'),
    mathjax = require("mathjax-node"),
    yuml2svg = require('yuml2svg'),
    sharp = require('sharp');

mathjax.start();

// SVG转换为其他格式的函数
const convertSvg = async (svgContent, format = 'png', theme = 'light') => {
    if (format === 'svg') {
        return svgContent;
    }
    
    try {
        const buffer = Buffer.from(svgContent);
        let sharpInstance = sharp(buffer);
        
        if (format === 'jpeg' || format === 'jpg') {
            // JPEG不支持透明度，需要添加背景色
            const backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
            return await sharpInstance
                .flatten({ background: backgroundColor })
                .jpeg({ quality: 90 })
                .toBuffer();
        } else if (format === 'png') {
            return await sharpInstance.png().toBuffer();
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
        errFn = (msg) => {
            res.writeHead(404, {'Content-type': 'text/html;charset=utf-8'});
            res.write(msg);
            res.end();
        },
        successFn = async (svgResult) => {
            try {
                const contentType = getContentType(format);
                const result = await convertSvg(svgResult, format, theme);
                
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
        errFn('Please pass LaTeX formula via `tex` parameter or `Yuml` expression using `yuml` parameter. Use `format` parameter to specify output format: png (default), jpeg, svg.');
    }
});

app.listen(8001);