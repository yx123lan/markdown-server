# Markdown-server

Markdown-server 提供了Markdown的数学公式 `LaTex`，以及流程图`yUML`服务端渲染支持。

## 功能特性

- 支持 LaTeX 数学公式渲染
- 支持 yUML 流程图渲染
- 支持多种输出格式：PNG（默认）、JPEG、SVG
- 支持深色主题
- 智能背景处理：PNG保持透明背景，JPEG自动添加适当背景色

## 如何使用

- clone 本项目
    - `git clone https://github.com/sbfkcel/markdown-server`
- 安装依赖
    - `npm install` 或 `yarn`
- 启动服务
    - `node index.js`

## API 参数

### 基础参数
- `tex`: LaTeX 数学公式
- `yuml`: yUML 流程图表达式
- `theme`: 主题，支持 `dark`（深色主题）
- `format`: 输出格式，支持 `png`（默认）、`jpeg`、`svg`
- `dpi`: 分辨率，支持 72-600（默认300），仅对PNG和JPEG有效

### 格式说明
- **PNG**: 保持透明背景，适合网页使用，支持DPI调节
- **JPEG**: 自动添加背景色（浅色主题为白色，深色主题为黑色），文件更小，支持DPI调节
- **SVG**: 矢量格式，可无限缩放，不受DPI影响

### DPI说明
- **72 DPI**: 网页标准分辨率，文件最小，适合在线显示
- **150 DPI**: 中等分辨率，平衡清晰度和文件大小
- **300 DPI**: 高分辨率（默认），适合打印和高清显示
- **600 DPI**: 最高分辨率，文件最大，适合专业印刷

### 使用示例

#### LaTeX 数学公式
- PNG格式（默认，透明背景，300 DPI）: `http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.`
- JPEG格式（白色背景，300 DPI）: `http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.&format=jpeg`
- 高分辨率PNG（600 DPI）: `http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.&format=png&dpi=600`
- 网页优化JPEG（72 DPI）: `http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.&format=jpeg&dpi=72`
- JPEG深色主题（黑色背景）: `http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.&format=jpeg&theme=dark`
- SVG格式: `http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.&format=svg`

#### yUML 流程图
- PNG格式（默认，300 DPI）: `http://localhost:8001/?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end)`
- JPEG格式（300 DPI）: `http://localhost:8001/?yuml=...&format=jpeg`
- 高分辨率JPEG（600 DPI）: `http://localhost:8001/?yuml=...&format=jpeg&dpi=600`
- SVG格式: `http://localhost:8001/?yuml=...&format=svg`

## 查看服务

可以通过以下示例用来查看服务是否正常。

- [（本地）LaTeX 数学公式 - PNG](http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.)
- [（本地）LaTeX 数学公式 - JPEG](http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.&format=jpeg)
- [（本地）yUML 流程图 - PNG](http://localhost:8001/?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end))

---

- [（在线）LaTeX 数学公式](http://towxml.vvadd.com/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.)
- [（在线）yUML 流程图](http://towxml.vvadd.com/?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end))

## 修改服务端口

编辑 `index.js` 最后一行的端口号即可。
