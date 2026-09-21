# Đặc tả: Website ROBO AI đa ngôn ngữ

Trạng thái: Người dùng đã duyệt phạm vi và cho phép triển khai.

## Mục tiêu

Người dùng chọn ngôn ngữ trực tiếp trong website, không cần chức năng dịch của trình duyệt hoặc Google Translate. Hỗ trợ đầy đủ tiếng Việt (vi), tiếng Anh (en), tiếng Nhật (ja), tiếng Hàn (ko), tiếng Trung giản thể (zh-CN). Trung giản thể là giả định cần xác nhận nếu người dùng muốn phồn thể.

## Phạm vi và tiêu chí nghiệm thu

- Bộ chọn ngôn ngữ trong thanh điều hướng chung, dùng được bằng bàn phím và trên màn hình nhỏ; tên ngôn ngữ hiển thị bằng chính ngôn ngữ đó.
- Giữ tiếng Anh làm mặc định cho lượt truy cập đầu tiên; ghi nhớ lựa chọn trên trình duyệt. Nếu storage bị chặn, vẫn đổi ngôn ngữ được trong phiên hiện tại.
- Dịch toàn bộ nội dung do ứng dụng hiển thị trên các trang hiện có: Home, Basic, Cart, Checkout, Order Success, Account, Orders, My Robots, Pair và Robot Management; bao gồm menu, footer, modal, placeholder, nhãn hỗ trợ tiếp cận, trạng thái trống/loading/error và thông báo xác nhận.
- Ngày tháng, số và tiền tệ được định dạng theo locale; không đổi giá, quy đổi tiền hay tự thêm giá chưa công bố.
- Thương hiệu, mã đơn, mã thiết bị, model identifiers, tên riêng và dữ liệu người dùng nhập không bị dịch hoặc ghi đè. Không sửa snapshot đơn hàng chỉ để đổi ngôn ngữ.
- Đổi ngôn ngữ giữ nguyên trang, giỏ hàng và bản nháp biểu mẫu chưa lưu. Lựa chọn tiếp tục có hiệu lực sau chuyển trang và reload.
- Cập nhật thuộc tính lang của tài liệu; không có hydration error. Font hiển thị đúng dấu tiếng Việt và ký tự Nhật/Hàn/Trung, bố cục không tràn ở mobile.
- Nội dung dịch nằm trong các từ điển được quản lý cùng source, có kiểm tra thiếu khóa giữa 5 ngôn ngữ. Không gọi dịch vụ dịch tự động khi người dùng đổi ngôn ngữ.
- Không dịch chữ đã nhúng trong ảnh/video và không tạo bản lồng tiếng. Không tạo route cho các trang sản phẩm chưa triển khai.
- Giữ URL hiện có trong đợt này; URL riêng theo ngôn ngữ và SEO đa ngôn ngữ phía server chưa thuộc phạm vi. Metadata dùng chung hiện tại được giữ nguyên.

## Công nghệ và cấu trúc dự kiến

Giữ Next.js App Router, React, TypeScript, CSS hiện tại. Tích hợp tại app/layout.tsx và components/Navbar.tsx. Thêm context/LanguageContext.tsx, components/ui/LanguageSelector.tsx và thư mục i18n/ chứa locale registry, hàm định dạng và từ điển. Các component/hook dùng khóa dịch ổn định; service tiếp tục trả mã lỗi để UI ánh xạ sang nội dung đã dịch. Không thao tác thay chữ trực tiếp trên DOM.

## Quy ước code

Giữ phong cách TypeScript, dấu chấm phẩy và nháy kép hiện tại. Dùng câu gốc tiếng Anh làm khóa ổn định theo kiểu gettext, ví dụ `t("YOUR CART.")`, để dễ đối chiếu nội dung hiện tại và tái sử dụng nhãn chung. Câu có biến dùng tham số, ví dụ `t("Quantity: {count}", { count })`. ID nghiệp vụ độc lập với nhãn hiển thị. Khi sửa câu tiếng Anh, cập nhật các bản dịch và kiểm tra coverage cùng lúc.

## Lệnh kiểm tra

Chạy từ thư mục website ban hang, với Node hiện có trong PATH:

```sh
npm run dev
npm run typecheck
npm run build
npm test -- tests/i18n.spec.ts
npm test
```

## Chiến lược kiểm thử

Thêm kiểm tra tính đầy đủ của bộ từ điển và Playwright cho 5 ngôn ngữ: đổi ngôn ngữ, reload, chuyển trang, giữ bản nháp/giỏ hàng, thông báo validation, fallback storage và thuộc tính lang. Kiểm tra bố cục desktop/mobile và console trình duyệt. Chạy bộ test hiện có; cập nhật locator phụ thuộc ngôn ngữ khi cần, giữ nguyên mức kiểm tra hành vi nghiệp vụ.

## Ranh giới

- Luôn: giữ nghiệp vụ và dữ liệu hiện tại; kiểm tra Next.js docs cục bộ trước khi sửa code; kiểm tra type/build/test sau thay đổi.
- Cần trao đổi nếu mở rộng: thêm dịch vụ dịch trả phí, URL locale, backend hoặc thay đổi mô hình dữ liệu.
- Không: dùng Google Translate, thay chữ bằng DOM observer, sửa dữ liệu cá nhân, làm giả nội dung sản phẩm hoặc bỏ kiểm thử đang thất bại.

## Trình tự đề xuất

1. Nền tảng locale, từ điển và bộ chọn; kiểm tra đổi ngôn ngữ và ghi nhớ.
2. Home và Basic, bao gồm nội dung từ data/products.ts.
3. Cart, Checkout, Account và Orders.
4. Pairing và toàn bộ Robot Management, ánh xạ lỗi theo locale.
5. Rà soát đủ 5 ngôn ngữ, responsive, hồi quy, typecheck và build; cập nhật README.
