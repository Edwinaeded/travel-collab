# 1. 使用 Node.js 官方映像
FROM node:18

# 2. 設定容器中的工作目錄
WORKDIR /app

# 3. 複製 package.json 和 package-lock.json
COPY package*.json ./

# 4. 安裝依賴
RUN npm install

# 5. 複製全部原始碼
COPY . .

# 6. 開放 port
EXPOSE 3000

# 7. 設定啟動指令
CMD [ "npm", "start" ]