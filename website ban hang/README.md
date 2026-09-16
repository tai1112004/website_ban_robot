# ROBO AI — Your Intelligent Companion

Frontend **Home, Product Detail Basic, Cart và Checkout demo** giới thiệu Robot AI với Next.js App Router, React, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Lenis, Lucide React và font Manrope lưu cục bộ. Chỉ dùng các ảnh/video được cung cấp. Không có backend, database, tài khoản hay thanh toán thật.

## Đối chiếu brief Home mới

| Hạng mục                                     | Thay đổi                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Intro, Hero, Lenis, video scroll, 4 biểu cảm | Giữ lại; bảo toàn scrub 0,3 giây và cập nhật copy theo brief                               |
| Why Robo AI                                  | Thêm bốn giá trị Voice AI / Personality / Memory / Knowledge                               |
| Core AI                                      | Thêm ba chương đổi theo scroll; reduced motion hiển thị đầy đủ cả ba                       |
| Inside the Robot                             | Cập nhật sáu hotspot AI Controller / Voice Input / Audio System / Display / Motion / Power |
| Expressive Robot                             | Thêm trạng thái nghe, nghĩ, nói, vui và Wave / Nod / Turn                                  |
| Knowledge Packs                              | Thêm bảy concept và điểm nhấn Hát Sắc Bùa / First Knowledge Pack                           |
| Product Design                               | Giữ crossfade hai góc; cập nhật bốn tính năng, bỏ nội dung pin/vision cũ                   |
| Models                                       | Thêm Basic / Plus / Custom, Coming Soon và Pricing to be announced                         |
| Navigation, CTA, Footer                      | Cập nhật luồng khám phá và các nhóm Product / Platform / Company / Support                 |
| Giỏ hàng, Search, giá demo                   | Gỡ khỏi Home. Các component cũ được giữ trong mã nguồn, không import vào Home              |

Thứ tự: Intro → Hero → Why Robo → Core AI → Video Story → Technology → Expressive Robot → Personality → Knowledge Packs → Product Design → Models → CTA → Footer.

Các nút Explore Basic / Explore Plus / Talk to us trỏ tới `/products/basic`, `/products/plus`, `/products/custom` theo brief. Route **`/products/basic` đã được triển khai**; Plus và Custom vẫn trả 404, dành cho giai đoạn sau.

## Product Detail Basic

Mở http://localhost:3000/products/basic. Layout lấy dữ liệu typed từ `data/products.ts`; các phần được tách trong `components/product/`, CSS riêng tại `app/products/product.css`.

- Gallery năm góc nhìn: thumbnail, nút mũi tên, phím trái/phải và vuốt trên điện thoại.
- Video 360° và biểu cảm lazy-load gần viewport, tự chạy trong viewport, dừng khi ra ngoài/ẩn tab/mở dialog. Có nút play/pause, poster khi lỗi; reduced motion chỉ phát thủ công.
- Voice AI theo scroll, bốn biểu cảm, memory switch demo, Knowledge Packs, sáu hotspot cấu tạo, crossfade thiết kế, lifestyle và bảng so sánh có cuộn ngang trên mobile.
- Giá `null` hiển thị `PRICE TO BE ANNOUNCED`. Không tự đặt giá, thông số hoặc ngày ra mắt.
- Form quan tâm có native validation, chỉ mô phỏng xác nhận; **không gửi, lưu dữ liệu hoặc đăng ký danh sách thật**. FAQ và các CTA nêu rõ trạng thái phát triển.
- Sticky CTA xuất hiện sau hero, ẩn khi đến CTA cuối và khi mở modal/menu. Navbar/Footer dùng chung Home với các đường dẫn phù hợp.

## Cart

Luồng: Home → **VIEW ROBO BASIC** → **ADD TO CART** → **VIEW CART** hoặc biểu tượng giỏ hàng trên navbar.

- `/cart` có sản phẩm, tăng/giảm số lượng, xóa, tổng quan đơn hàng và trạng thái giỏ trống; không tải video.
- `context/CartContext.tsx` dùng React Context + reducer, bọc một lần tại root layout. `lib/cart.ts` xử lý dữ liệu, `types/cart.ts` định nghĩa item; UI nằm trong `components/cart/`, CSS riêng `app/cart.css`.
- LocalStorage `robo-ai-cart` chỉ lưu `{ id, quantity }`. Dữ liệu hiển thị được dựng lại từ `data/products.ts`; bỏ mã sản phẩm không tồn tại, reset JSON hỏng, chuẩn hóa số lượng 1–5. Đây là giới hạn bản frontend, không phải thông tin tồn kho.
- Đồng bộ giữa tab; storage bị chặn vẫn dùng được state trong trang và hiển thị thông báo không lưu được. Không lưu thông tin cá nhân.
- ProductModel hiện có giá dạng `{ amount, currency } | null`; adapter chuyển thành `CartItem.price: number | null` và giữ currency. Giá chưa có hiển thị `TO BE ANNOUNCED`, không hiển thị số 0 giả.
- Giữ nguyên form quan tâm đặt trước. Thêm vào giỏ không đặt hàng, giữ hàng hoặc thu tiền.
- **PROCEED TO CHECKOUT** mở `/checkout`: form frontend demo, không có thanh toán hay gửi đơn thật.
- Các component giỏ hàng cũ, chưa dùng từ giai đoạn trước, không được nối vào luồng mới.

## Checkout demo

Luồng hoàn chỉnh: Product Detail → Add to Cart → Cart → Checkout → Place Order → `/order-success`.

- Route `/checkout` dùng CartContext hiện có, bảo vệ giỏ rỗng và chỉ đọc storage sau hydration. Không tải video hoặc gọi dịch vụ ngoài.
- Form kiểm tra email, điện thoại quốc tế cơ bản (7–15 chữ số), các trường địa chỉ bắt buộc và checkbox xác nhận. Lỗi nằm dưới trường, có aria-invalid/aria-describedby và focus vào lỗi đầu tiên.
- Delivery/Payment đều là demo; shipping chưa xác định nên total vẫn `null`, kể cả khi subtotal có giá. Không đặt mức phí hoặc ngày giao hàng giả.
- `lib/orders.ts` tạo ID `ROBO-YYYYMMDD-XXXX`, internal UUID, snapshot sản phẩm; thêm vào `robo-ai-orders` và lưu ID cuối vào sessionStorage `robo-ai-last-order`.
- Chỉ clear giỏ sau khi lưu thành công. Lưu thất bại hiển thị lỗi inline và cho thử lại. Không gửi request tạo đơn; không nhận thông tin thẻ.
- **Thông tin liên hệ/địa chỉ trong đơn demo được lưu tại trình duyệt này.** Form có thông báo rõ và gợi ý dùng dữ liệu mẫu. Có thể xóa dữ liệu demo bằng cách xóa key `robo-ai-orders` và `robo-ai-last-order` trong browser storage.
- `/order-success` đọc đơn vừa lưu và hiển thị đầy đủ xác nhận demo; xem chi tiết bên dưới. Không phải hệ thống xác nhận đơn thật.
- Checkout-specific files nằm trong `app/checkout/`, `components/checkout/`, `types/order.ts`, `lib/orders.ts`; không tạo context hoặc product data khác.

## Order Success

- Route `/order-success` dùng `components/order/*`, CSS riêng `app/order-success/order-success.css` và Order type hiện có. Navbar/Footer được dùng chung.
- `getRecentOrder()` trong `lib/orders.ts` đọc `robo-ai-last-order` từ sessionStorage rồi tìm snapshot trong `robo-ai-orders`. Trang không tạo đơn mới, không clear hoặc sửa cart.
- Hiển thị mã đơn có copy/fallback chọn chữ, ngày tạo theo locale tiếng Anh, status dễ đọc, sản phẩm/số lượng/giá, thông tin liên hệ và địa chỉ; bỏ dòng địa chỉ tùy chọn rỗng.
- Tiến trình 5 trạng thái lấy từ status thực trong snapshot. Phần 3 bước tiếp theo và device/account chỉ là preview, không bịa ngày giao hàng hay gửi email.
- Có trạng thái riêng cho chưa có mã đơn gần nhất, không tìm thấy đơn, storage không truy cập được; reload vẫn giữ đơn trong tab hiện tại.
- Chỉ dùng ảnh sản phẩm trong `/images/`, có fallback khi ảnh lỗi; không tải video.
- **VIEW ORDER** mở `/orders/{id}` của đơn vừa tạo. Navbar có biểu tượng Account và trang xác nhận có lối vào `/account`.

## Account và quản lý đơn hàng

- `/account`: tổng số đơn, profile từ đơn mới nhất theo `createdAt`, recent order, số My Robots lấy từ `useRobots()`, Support và Settings coming soon.
- `/orders`: danh sách snapshot đã lưu, mặc định mới nhất trước; có chọn mới nhất/cũ nhất. Không tạo dữ liệu mẫu trong ứng dụng.
- `/orders/[id]`: mã đơn/copy, ngày tạo, trạng thái và tiến trình, thông tin liên hệ/giao hàng, sản phẩm/giá và link sản phẩm theo slug của từng item.
- `hooks/useOrders.ts` là lớp đọc dữ liệu sau mount, expose loading/error/retry, sắp xếp và cập nhật khi tab khác đổi storage. Nguồn duy nhất vẫn là `lib/orders.ts` / `robo-ai-orders`; Account và Orders không phụ thuộc sessionStorage.
- JSON hỏng hiển thị giỏ lịch sử rỗng, ID không tồn tại có Order Not Found, storage bị chặn có thông báo retry. Thông tin liên hệ/địa chỉ thiếu được chuẩn hóa thành chuỗi rỗng để UI hiển thị fallback, không tạo khách hàng giả.
- Đây là dashboard demo cục bộ, không có login, phân quyền, tracking trực tiếp hay thiết bị đã kết nối. Bất kỳ ai dùng cùng browser storage đều có thể xem dữ liệu demo này.
- `/my-robots` mở danh sách thiết bị và luồng pairing. `/support` chưa có route; Settings bị vô hiệu hóa và ghi Coming Soon.
- Tái sử dụng Navbar/Footer, OrderDetails, OrderSummary, OrderStatus và CopyOrderNumber; CSS mới tại `app/account/account.css`.

## Chạy dự án

Yêu cầu Node.js >= 20.9 (khuyến nghị Node 22).

```powershell
cd "D:\thuctap\TechByte\GiaoViec\IOT\website ban hang"
npm install
npm run dev
```

Mở http://localhost:3000.

Máy hiện tại chưa chọn Node trong NVM. Đã chuẩn bị Node 22 portable tại `../.tools/node-v22.23.2-win-x64`. Dùng lệnh dưới trong terminal hiện tại, rồi chạy các lệnh npm như bình thường:

```powershell
$env:PATH = (Resolve-Path "..\.tools\node-v22.23.2-win-x64").Path + ";" + $env:PATH
npm.cmd run dev
```

```sh
npm run typecheck
npm run build
npm start
npm test
```

Playwright chạy Chrome headless với profile riêng; cần Google Chrome cài sẵn. `npm test` tự mở dev server nếu port 3000 chưa có server. Ảnh kiểm tra desktop/mobile ở `test-results/`, không đưa vào git.

## Cấu trúc

```text
app/
  page.tsx                 # Điểm vào Home
  layout.tsx               # Metadata, font cục bộ
  globals.css              # Tokens, responsive, giao diện các section
  home.css                 # Các chương khám phá mới và bố cục mobile
  icon.svg                 # Icon robot đồng bộ navbar
components/
  Storefront.tsx           # Điều phối Home, intro, thông tin footer và animation
  IntroTrailer.tsx         # Video fullscreen, skip, replay, autoplay fallback
  Navbar.tsx
  Hero.tsx
  WhyRobo.tsx              # Bốn giá trị AI
  CoreAI.tsx               # Voice / Personality / Memory theo scroll
  RobotStory.tsx           # Sticky 550vh, scroll -> currentTime và text
  Technology.tsx           # Exploded view và hotspot/accordion mobile
  ExpressiveRobot.tsx      # Khuôn mặt và hành động vật lý
  ProductDesign.tsx        # Hai góc render crossfade theo scroll
  Personality.tsx          # Bốn biểu cảm
  KnowledgePacks.tsx       # Các concept pack, điểm nhấn Hát Sắc Bùa
  Models.tsx               # Preview Basic / Plus / Custom, chưa có giá
  CTA.tsx
  Footer.tsx
  ui/                      # Button, SectionTitle, Modal, CustomCursor
hooks/                     # Reduced motion, touch detection
lib/                       # GSAP và Lenis lifecycle
public/images/
public/videos/
tests/                     # Kiểm tra hành vi và ảnh trình duyệt
playwright.config.ts
postcss.config.mjs         # Tailwind v4
next.config.ts
package.json
package-lock.json
```

## Asset

Asset được sao chép từ `../public`, giữ nguyên nội dung file gốc. Những tên khác biệt đã có bản sao theo đúng đường dẫn yêu cầu:

| File nguồn                                    | Đường dẫn trong website                 |
| --------------------------------------------- | --------------------------------------- |
| `public/images/product render chinh dien.png` | `/images/product_render_chinh_dien.png` |
| `public/images/cách thiết kế trang home.png`  | `/images/cach_thiet_ke_trang_home.png`  |
| `public/video/video trailler.mp4`             | `/videos/video_trailler.mp4`            |
| `public/video/video_chay_o_home.mp4`          | `/videos/video_chay_o_home.mp4`         |

Các ảnh còn lại giữ đúng tên trong `/images/`. Ảnh `cach_thiet_ke_trang_home.png` chỉ dùng tham khảo, không render trong UI. Hero dùng `hinh2.png`, CTA dùng `CTA.png`; navbar, chữ, nút là HTML/React thực.

## Hành vi chính

- Mỗi lần mở hoặc tải lại Home: intro tự hiện, có Skip/Escape và fade qua nền đen. Không lưu hoặc đọc cờ đã xem intro; WATCH FILM mở lại. Khi autoplay bị chặn có nút Play; lỗi video vẫn có Skip. Người bật reduced motion vẫn vào Home trực tiếp.
- Video story chờ metadata, dùng tiến độ ScrollTrigger để seek hai chiều. RAF gộp cập nhật và `seeked` lấy vị trí mới nhất; không cập nhật React mỗi frame, không autoplay thay scrub.
- Video, năm đoạn copy và thanh tiến trình dùng chung playhead có độ đuổi GSAP `scrub: 0.3` giây; tiếp tục cập nhật đến khi bắt kịp cả khi đã ngừng cuộn. Điều chỉnh tại `SCRUB_CATCH_UP_SECONDS` trong `components/RobotStory.tsx`. Copy theo các mốc 0/20/40/60/80%; fade chuyển tiếp. Reduced motion bỏ intro tự động, tắt Lenis/scrub và dùng poster. Video lỗi dùng poster, trang vẫn cuộn được.
- Một Lenis được nối vào GSAP ticker, cleanup khi khóa scroll/unmount. Tất cả GSAP context được revert.
- Core AI kể ba chương qua scroll hoặc các nút chọn chương; state React chỉ đổi khi sang chương. Memory giới thiệu khả năng nhớ theo sự cho phép, không thu thập dữ liệu người dùng ở frontend.
- Models là preview ba phiên bản, không có giao dịch hay giá. Knowledge Packs chỉ giới thiệu concept, không phải marketplace.
- Footer mở thông tin About / Research / Contact / Help / FAQ / Privacy / Terms trong dialog; chưa có thông tin liên hệ hay chính sách kinh doanh chính thức.
- Native dialog giữ focus, Escape đóng, nền khóa cuộn; có skip link và focus-visible. Mood/hotspot thao tác được bằng bàn phím.

## Trước khi đưa lên domain thật

Đặt `NEXT_PUBLIC_SITE_URL=https://your-domain.example` để URL Open Graph trỏ đúng domain. Cập nhật thông tin công ty, hỗ trợ, chính sách thực; xây các route Plus/Custom và dịch vụ tiếp nhận form ở giai đoạn sau. Giá và thông số chưa xác nhận không được hiển thị trên Home.

Đã kiểm tra tự động trên Chrome desktop và viewport giả lập mobile. Không coi viewport giả lập là kiểm chứng trên thiết bị iOS/Safari thực. Độ mượt seek còn phụ thuộc decoder và khoảng cách keyframe của video gốc; không mã hóa lại hay thay asset người dùng.

Tài liệu nền tảng: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [Tailwind](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Lenis](https://github.com/darkroomengineering/lenis).

## My Robots + Pair Device

- Vào biểu tượng Account → My Robots → Pair Your Robo. `/my-robots` có empty/loading/error/retry, cards và unpair với xác nhận; `/my-robots/pair` có validation, loading, lỗi, thành công. `/my-robots/[id]` mở Robot Management với 8 tab cấu hình và thông tin thiết bị.
- Dùng thử Device ID `RB-A8F2K91`, activation code `DEMO-CODE`. Mock chấp nhận ID 5–64 chữ/số/dấu gạch nối và code 6–128 ký tự; không xác thực mã hoặc ownership thật. ID được trim/uppercase để ngăn trùng.
- `RobotDevice` và `PairRobotRequest` nằm trong `types/robot.ts`. UI → hooks → `services/robotService.ts` → mock storage hoặc `lib/apiClient.ts`. UI không đọc/ghi localStorage. Các hàm get/list/pair/unpair đều trả Promise.
- Mock mặc định, lưu duy nhất danh sách thiết bị tại `robo-ai-devices`. Không tự seed thiết bị; không lưu activation code. Model mới mặc định BASIC, status UNKNOWN, firmware/serial chưa biết. Gỡ thiết bị không sửa orders/cart. JSON/schema lỗi hiển thị retry và không ghi đè dữ liệu cũ. Web Locks tuần tự hóa thay đổi giữa các tab trên trình duyệt hỗ trợ; fallback read/write đồng bộ cho trình duyệt khác.
- Hook refresh khi service thay đổi, tab khác đổi thiết bị hoặc cửa sổ nhận focus; không polling, telemetry, WebSocket hay video. Bỏ qua kết quả async cũ để tránh request về muộn thay thế dữ liệu mới.
- `.env.example` có `NEXT_PUBLIC_USE_MOCK_API=true` và `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`. Khi backend sẵn sàng, đặt mock=false và restart/rebuild. Service đã map GET `/api/devices`, GET `/api/devices/{id}`, POST `/api/devices/pair`, DELETE `/api/devices/{id}/pair`, validate response, chuẩn hóa lỗi `ApiError`. Chưa gọi hoặc xác minh backend thật. Việc gắn token/session, CORS và chính sách CSRF sẽ làm tại API client/backend khi có auth; không gửi userId trong pair request. Copy demo cũng cần cập nhật khi bật dịch vụ thật.
- Kiểm tra: `npm run typecheck`, `npm run build`, `npm test -- tests/robots.spec.ts tests/account.spec.ts`. Chrome dùng profile kiểm thử riêng, không seed dữ liệu vào trình duyệt của người dùng.

## Robot Management

- Vào My Robots → **MANAGE ROBO**. `/my-robots/[id]?tab=overview|personality|memory|knowledge|voice|display|actions|device` hỗ trợ deep-link, refresh và Back/Forward. Desktop có sidebar; mobile có thanh tab cuộn và tự đưa tab đang chọn vào khung nhìn. Arrow keys/Home/End thao tác tab bằng bàn phím.
- Overview hiển thị cấu hình **đã lưu**, thông tin thiết bị và CTA mở từng tab. Personality có 5 profile, Custom chỉnh response length/humor/formality. Memory mặc định off, có quyền theo nhóm và modal clear. Knowledge có 8 pack (highlight Hát Sắc Bùa). Voice có profile/language/volume/speed, chưa có audio/TTS. Display dùng đúng 4 ảnh biểu cảm đã có; không tạo/tải asset ngoài.
- Mỗi settings panel có bản nháp và nút Save. Chuyển tab giữ bản nháp; refresh/đóng trang khi chưa lưu có browser warning. Save lỗi giữ giá trị để thử lại. Không tự save slider. Knowledge install/remove lưu ngay theo nút bấm, không tải AI content.
- UI → `hooks/useRobotManagement.ts` → `robotConfigService`/`knowledgeService`/`actionService`/`robotService`. DTO và request types nằm tại `types/robotConfig.ts`, tách khỏi `RobotDevice`. Defaults/catalog/illustrative personality previews nằm ở service. `robotConfigRepository.ts` là implementation mock, key `robo-ai-config:{robotId}`; chỉ tạo cấu hình mặc định khi đọc, không persist đến khi user Save. Không có conversation history giả.
- Mỗi lần ghi kiểm tra thiết bị còn paired, đọc cấu hình hiện tại rồi chỉ thay section cần lưu. Web Locks tuần tự hóa thay đổi cùng Robo. JSON/schema lỗi báo lỗi và không ghi đè. Clear Memory reset 4 quyền thành false, giữ nguyên cấu hình khác. Unpair không sửa lịch sử orders; cấu hình cũ không thể truy cập khi id không còn paired. Pair lại nhận id mới và cấu hình mặc định.
- Actions yêu cầu **status ONLINE + capability MOTION** ở cả UI và service. Robo Basic mới pair có VOICE/MEMORY/KNOWLEDGE/DISPLAY, không tự khai báo MOTION. Thiết bị cũ thiếu capabilities cũng không được giả định có motion. OFFLINE/PAIRING/UNKNOWN đều khóa Actions. Mock command trả thông báo gửi mô phỏng, không xác nhận robot vật lý đã di chuyển. Không có telemetry/WebSocket/servo control.
- Device hỗ trợ rename 1–60 ký tự và unpair có confirmation → My Robots. Rename cập nhật card/header qua service subscription hiện có. Firmware chỉ đọc.
- API mode dùng cấu hình `.env.example` hiện có và API client chung: GET/PUT `/api/devices/{id}/config`, GET/PUT từng `/personality`, `/memory`, `/voice`, `/display`; DELETE `/memory`; GET `/knowledge-packs`, POST/DELETE `/knowledge-packs/{packId}`; POST `/actions` với `{action}`; PUT `/api/devices/{id}` với `{name}`. Clear và knowledge mutations re-read sau response. Không gửi userId. Backend phải kiểm tra ownership, auth và capabilities; chưa có backend thật để integration test.
- Kiểm thử chức năng: `npm test -- tests/robot-management.spec.ts tests/robot-service.spec.ts tests/robots.spec.ts`. API contract được test với fetch stub, không kết nối dịch vụ thật. Mock motion ONLINE chỉ được seed trong profile Chrome kiểm thử, không ghi vào dữ liệu của người dùng.
