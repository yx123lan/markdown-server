FROM node:18

WORKDIR /usr/src/app

# 复制本地代码到容器中
COPY . .

# 安装依赖
RUN npm install

# 暴露端口
EXPOSE 8001

# 启动应用
CMD [ "node", "index.js" ]
