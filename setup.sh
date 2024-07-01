# 编译
npm run docs:build

# # 打包
cd docs/.vuepress && tar -czvf dist.tar.gz ./dist/

# # 上传
scp -P 22 ./dist.tar.gz zhuib:/opt/nginx/www

md5 dist.tar.gz