# website_ban_robot

Frontend website Robo AI.

- `website ban hang/`: ứng dụng Next.js, các trang bán hàng và quản lý Robo.
- `public/`: ảnh và video nguồn của dự án.

## Chạy local

Yêu cầu Node.js 22 và npm.

```powershell
cd "website ban hang"
npm install
npm run dev
```

Mở http://localhost:3000.

## Deploy lên Vercel

Ứng dụng Next.js nằm trong `website ban hang/`, không nằm ở gốc repository.
Trong Vercel → Project → Settings → Build and Deployment, đặt:

| Cài đặt | Giá trị |
| --- | --- |
| Root Directory | `website ban hang` |
| Framework Preset | Next.js |
| Node.js Version | 22.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

File `website ban hang/vercel.json` giữ cấu hình framework/install/build/output
trong Git. Root Directory phải đặt trong Vercel; file này không thay đổi cài đặt
Root Directory của project đã tạo.

Sau khi Save, deploy lại commit mới nhất trên nhánh `main`. Nếu đã build lỗi,
Redeploy và bỏ chọn sử dụng Build Cache.

Lỗi **No Next.js version detected** xảy ra khi Vercel tìm `package.json`
ở sai thư mục. Không cần thêm một bản Next.js khác ở gốc repository.

Tham khảo: [Vercel Root Directory](https://vercel.com/docs/builds/configure-a-build#root-directory).

Hướng dẫn tính năng, dữ liệu demo và cấu hình API: [README ứng dụng](<website ban hang/README.md>).

Hiện dự án chỉ có frontend; dữ liệu mua hàng và thiết bị dùng mock trong trình duyệt, chưa có backend hoặc kết nối robot thật.
