# THPT Phú Nhuận School Report

Website một trang phục vụ trình chiếu tại cuộc họp cha mẹ học sinh: tổng kết 2025–2026 và phương hướng 2026–2027. Bản mở rộng gồm 30 section và 94 ảnh tư liệu được tối ưu từ các nhóm hình ảnh do người dùng cung cấp.

## Chạy tại máy

Yêu cầu Node.js 20 trở lên. Không cần cài thư viện.

```sh
npm run dev
```

Mở địa chỉ được in trong terminal, mặc định http://localhost:5173. Hoặc chạy trực tiếp `node scripts/serve.mjs`.

## Sửa nội dung

- `content.js`: số liệu, chương trình, thành tích và chỉ tiêu. Số liệu giữ theo bản Word dự thảo, chưa xác minh; cập nhật tại đây trước khi sử dụng chính thức.
- `sections.js`: nội dung trình bày và bố cục của 30 section.
- `app.js`: điều hướng, hiệu ứng số liệu và ảnh tự chuyển.
- `styles.css`: màu sắc, responsive và animation.
- `assets/photos/manifest.json`: nhóm ảnh, kích thước và đường dẫn nguồn tương ứng trong thư mục tư liệu.
- `assets/`: ảnh WebP đã tối ưu và thư viện icon Lucide cục bộ.

Các dòng bị lặp trong Word được gộp khi trình bày. Phạm vi phần tổng kết được ghi 2025–2026 theo tiêu đề tài liệu. Các số liệu nhân sự khác nhau giữa phần tổng quan và thi đua được giữ nguyên.

## Trình chiếu

Toàn bộ nội dung chữ được hiển thị sẵn, không dùng tab hoặc mục thu gọn. Chỉ cần cuộn trang để xem; ảnh tự chuyển mỗi 6,5 giây khi nằm trong vùng đang xem. Mỗi section là một chủ đề riêng. Cỡ chữ desktop: tiêu đề 54–66px, nội dung 24–28px; số liệu lớn hơn. Mobile dùng chữ 19–24px và bố cục một cột.

Nút toàn màn hình và điều hướng trước/sau luôn hiển thị. Phím mũi tên lên/xuống, Page Up/Page Down chuyển section; Home/End tới đầu/cuối. Mục lục có đầy đủ 30 section; thanh chấm desktop chia thành 7 chương. Nút giảm chuyển động và thiết lập hệ thống `prefers-reduced-motion` tắt hiệu ứng và ảnh tự chuyển, hiển thị số liệu ngay. Thiết lập giảm chuyển động được lưu trên thiết bị. Trang không tự cuộn để người thuyết trình chủ động thời gian đọc.

## Build và triển khai

```sh
npm run build
npm run preview
```

Kết quả ở `dist/`, tương thích các dịch vụ hosting tĩnh. Workflow GitHub Actions chỉ kiểm tra build, không tự xuất bản website. Có thể triển khai thư mục `dist/` sau khi duyệt nội dung.

## Nguồn

Nội dung: `2_DU THAO_BC TONG KET nam hoc 2526 va phuong huong nhiem vu nam hoc 2627.docx` do người dùng cung cấp. File Word gốc không được đưa vào repo.

Ảnh đang sử dụng được lấy từ thư mục `Hình ảnh` do người dùng cung cấp, theo các nhóm nội dung. Nhóm cơ sở vật chất sử dụng 5 khung hình tại giây thứ 3 của các video pn2, pn4, pn5, pn6, pn7. Nguồn từng ảnh được ghi trong `assets/photos/manifest.json`; ảnh gốc và video gốc được giữ nguyên ngoài repo. Các ảnh minh họa hoạt động không được dùng làm bằng chứng cho số liệu báo cáo. Icon Lucide theo giấy phép ISC trong `assets/LUCIDE-LICENSE`.
