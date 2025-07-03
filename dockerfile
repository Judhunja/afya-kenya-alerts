# 1. Use official Node.js base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the app files
COPY . .

# 6. Build the TypeScript project
RUN npm run build

# 7. Specify default command (you can change this depending on your app)
CMD ["node", "dist/index.js"]
