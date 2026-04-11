FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer cache friendly)
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
