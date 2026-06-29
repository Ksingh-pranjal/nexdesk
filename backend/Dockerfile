# A sequential list of instructions used to automatically build a docker image
# official Node.js image as base
FROM node:20-alpine

#working directory -> inside the container every command after this runs relative to /app inside the container
WORKDIR /app

# If code changes but dependencies don't, Docker skips re-running npm install
COPY package*.json ./

# Install dependencies inside the container
RUN npm install --production

# Now copy rest of backend code
COPY . .

# Backend port -> 5000 
EXPOSE 5000

CMD ["node", "server.js"]
