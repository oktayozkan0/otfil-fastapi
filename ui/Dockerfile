# 1. Node.js resmi imajını kullanıyoruz
FROM node:18

# 2. Çalışma dizinini ayarlıyoruz
WORKDIR /app

# 3. package.json ve package-lock.json dosyalarını kopyalıyoruz
COPY package*.json ./

# 4. Bağımlılıkları yüklüyoruz
RUN npm install

# 5. Proje dosyalarını kopyalıyoruz
COPY . .

# 6. Uygulamayı başlatmak için gerekli komutu belirtiyoruz
CMD ["npm", "start"]

# 7. Geliştirme sunucusu 3000 portunu kullanır
EXPOSE 3000
