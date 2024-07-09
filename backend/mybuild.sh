# react project build
cd ../frontend
npm run build

# index.html, main.js 복사(이동) : dist -> static
cd ../backend
rm -rf src/main/resources/static
mv ../frontend/dist src/main/resources/static

# spring project build
./gradlew bootJar

# build image
#docker build -t popyto/spacehub .
docker buildx build --platform linux/amd64 -t popyto/spacehub .

# push image
docker push popyto/spacehub

# remote 에서

# 컨테이너 멈추고
ssh -i src/main/resources/secret/key0527.pem ubuntu@13.209.49.141 'docker stop spacehub'
# 컨테이너 삭제
ssh -i src/main/resources/secret/key0527.pem ubuntu@13.209.49.141 'docker rm spacehub'
# pull image
ssh -i src/main/resources/secret/key0527.pem ubuntu@13.209.49.141 'docker pull popyto/spacehub'
# 컨테이너 실행
ssh -i src/main/resources/secret/key0527.pem ubuntu@13.209.49.141 'docker run -d -p 8080:8080 --restart always --name spacehub popyto/spacehub'