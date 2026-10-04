# THPT Phú Nhuận School Report

Website phục vụ trình chiếu tại cuộc họp cha mẹ học sinh: tổng kết 2025–2026 và phương hướng 2026–2027. Báo cáo gồm 32 chủ đề; ảnh tư liệu được chọn theo nội dung, không lặp giữa các mục. Mỗi chủ đề được chia thành các trang con vừa đúng một màn hình, tùy kích thước trình chiếu.

## Chạy tại máy

Yêu cầu Node.js 20 trở lên. Không cần cài thư viện.

```sh
npm run dev
```

Mở địa chỉ được in trong terminal, mặc định http://localhost:5173. Hoặc chạy trực tiếp `node scripts/serve.mjs`.

## Sửa nội dung

- `content.js`: số liệu, chương trình, thành tích và chỉ tiêu. Số liệu giữ theo bản Word dự thảo, chưa xác minh; cập nhật tại đây trước khi sử dụng chính thức.
- `sections.js`: nội dung trình bày và bố cục của 32 section.
- `app.js`: điều hướng, hiệu ứng số liệu và ảnh tự chuyển.
- `styles.css`: màu sắc và animation.
- `presentation.css`: bố cục trình chiếu toàn màn hình, cỡ chữ và đơn vị tiền tệ cùng hàng với số.
- `pagination.js`: đo nội dung, chia trang con và chia lại khi thay đổi kích thước màn hình.

Các mục phù hợp dùng bố cục hai cột chữ – ảnh trên desktop; ảnh chỉ xuất hiện ở trang đầu của chủ đề. Trang số liệu hoặc nhiều chữ không thêm ảnh. Trên màn hình hẹp, ưu tiên nội dung báo cáo, giữ ảnh mở đầu/kết thúc và poster CLB; không sinh trang riêng chỉ để chứa ảnh. Nội dung ngắn được căn giữa theo chiều dọc, không kéo giãn khoảng cách giữa các ý.
- `assets/photos/manifest.json`: nhóm ảnh, kích thước và đường dẫn nguồn tương ứng trong thư mục tư liệu.
- `assets/`: ảnh WebP đã tối ưu và thư viện icon Lucide cục bộ.

Các dòng bị lặp trong Word được gộp khi trình bày. Phạm vi phần tổng kết được ghi 2025–2026 theo tiêu đề tài liệu. Các số liệu nhân sự khác nhau giữa phần tổng quan và thi đua được giữ nguyên.

## Trình chiếu

Toàn bộ nội dung chữ được hiển thị sẵn, không dùng tab hoặc mục thu gọn. Chỉ cần cuộn trang để xem; ảnh tự chuyển mỗi 6,5 giây khi nằm trong vùng đang xem. Một trang là một section toàn màn hình; chủ đề dài được chia thành trang con với ký hiệu 1 / 2, 2 / 2 trong tiêu đề. Desktop dùng tiêu đề 50–64px, nội dung 24–26px; mobile dùng nội dung 21–22px. Màn hình thấp có bố cục gọn hơn và được chia thêm trang, không cần cuộn nội dung bên trong.

Trang chỉ hiển thị nội dung: không header, menu, thanh điều hướng hoặc nút công cụ. Một đợt cuộn chuột/trackpad chuyển đúng một trang; cảm ứng dùng scroll snap gốc của trình duyệt. Phím mũi tên lên/xuống, Page Up/Page Down chuyển trang; Home/End tới đầu/cuối. Có thể dùng F11 của trình duyệt để trình chiếu toàn màn hình. Animation, transition và ảnh tự chuyển luôn bật mặc định, không tự tắt theo thiết lập giảm chuyển động của hệ điều hành. Người xem muốn tắt chuyển động có thể chủ động dùng URL `?motion=reduced`. Trang không tự cuộn để người thuyết trình chủ động thời gian đọc. Các thành tích ghi rõ đơn vị giải hoặc huy chương; tiền tệ ghi đầy đủ, ví dụ 60.000.000 đồng, trên cùng một hàng.

## Nhánh Mobile Version

Nhánh `mobile-version` bổ sung bố cục điện thoại, chưa thay đổi website GitHub Pages từ nhánh `main`. Khi tích hợp nhánh này, cùng một URL sẽ tự chọn mobile trên màn hình hẹp hoặc điện thoại cảm ứng đang xoay ngang; máy tính giữ bố cục trình chiếu hiện tại.

- Mỗi lần vuốt dọc chuyển đúng một trang, không có cuộn nội dung bên trong. Chủ đề dài tiếp tục được chia thành trang con.
- Thumbnail nhỏ ở vùng riêng, không che chữ. Sau 10–20 giây đọc, ảnh phóng lớn che nội dung, giữ tiêu đề; mỗi ảnh 5 giây, rồi thu về.
- Xoay điện thoại sẽ chia lại trang, giữ chủ đề đang xem và dừng lớp ảnh đang mở. Vuốt ngang hoặc cử chỉ thu/phóng hai ngón không bị dùng để chuyển trang.
- `mobile.css` chứa các điều chỉnh riêng cho mobile. Số liệu, từ ghép, đơn vị và ảnh sử dụng chung với bản trình chiếu.

Chạy `node scripts/check-mobile.mjs` để kiểm tra nhận diện thiết bị, và `npm run dev` để xem thử tại máy.

## Build và triển khai

```sh
npm run build
npm run preview
```

Kết quả ở `dist/`, tương thích các dịch vụ hosting tĩnh. Workflow GitHub Actions chỉ kiểm tra build, không tự xuất bản website. Có thể triển khai thư mục `dist/` sau khi duyệt nội dung.

## Nguồn

Nội dung: `2_DU THAO_BC TONG KET nam hoc 2526 va phuong huong nhiem vu nam hoc 2627.docx` do người dùng cung cấp. File Word gốc không được đưa vào repo.

Ảnh đang sử dụng được lấy từ thư mục `Hình ảnh` do người dùng cung cấp, theo các nhóm nội dung. Nhóm cơ sở vật chất sử dụng 5 khung hình tại giây thứ 3 của các video pn2, pn4, pn5, pn6, pn7. Nguồn từng ảnh được ghi trong `assets/photos/manifest.json`; ảnh gốc và video gốc được giữ nguyên ngoài repo. Các ảnh minh họa hoạt động không được dùng làm bằng chứng cho số liệu báo cáo. Icon Lucide theo giấy phép ISC trong `assets/LUCIDE-LICENSE`.
