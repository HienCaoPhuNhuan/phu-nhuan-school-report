# THPT Phú Nhuận School Report

Website một trang phục vụ trình chiếu tại cuộc họp cha mẹ học sinh: tổng kết 2025–2026 và phương hướng 2026–2027.

## Chạy tại máy

Yêu cầu Node.js 20 trở lên. Không cần cài thư viện.

```sh
npm run dev
```

Mở địa chỉ được in trong terminal, mặc định http://localhost:5173. Hoặc chạy trực tiếp `node scripts/serve.mjs`.

## Sửa nội dung

- `content.js`: số liệu, chương trình, thành tích và chỉ tiêu. Số liệu giữ theo bản Word dự thảo, chưa xác minh; cập nhật tại đây trước khi sử dụng chính thức.
- `app.js`: bố cục và hành vi.
- `styles.css`: màu sắc, responsive và animation.
- `assets/`: hình ảnh và thư viện icon Lucide cục bộ.

Các dòng bị lặp trong Word được gộp khi trình bày. Phạm vi phần tổng kết được ghi 2025–2026 theo tiêu đề tài liệu. Các số liệu nhân sự khác nhau giữa phần tổng quan và thi đua được giữ nguyên.

## Trình chiếu

Nút toàn màn hình và điều hướng trước/sau luôn hiển thị. Phím mũi tên lên/xuống, Page Up/Page Down chuyển section; Home/End tới đầu/cuối. Mục lục trên điện thoại và thanh chấm bên phải trên desktop giúp chuyển nhanh. Nút giảm chuyển động và thiết lập hệ thống `prefers-reduced-motion` tắt hiệu ứng, hiển thị số liệu ngay. Thiết lập giảm chuyển động được lưu trên thiết bị.

## Build và triển khai

```sh
npm run build
npm run preview
```

Kết quả ở `dist/`, tương thích các dịch vụ hosting tĩnh. Workflow GitHub Actions chỉ kiểm tra build, không tự xuất bản website. Có thể triển khai thư mục `dist/` sau khi duyệt nội dung.

## Nguồn

Nội dung: `2_DU THAO_BC TONG KET nam hoc 2526 va phuong huong nhiem vu nam hoc 2627.docx` do người dùng cung cấp. File Word gốc không được đưa vào repo.

Ảnh tư liệu được ghi nguồn trong `assets/SOURCES.md`. Các ảnh minh họa hoạt động không được dùng làm bằng chứng cho số liệu báo cáo. Icon Lucide theo giấy phép ISC trong `assets/LUCIDE-LICENSE`.
