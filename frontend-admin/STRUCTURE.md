# Cấu trúc thư mục dự án Car Rental Admin

## Tổng quan

Dự án này sử dụng cấu trúc thư mục sau:

```
frontend-admin/
├── app/               # Next.js app router pages và layout
├── components/        # Các component UI được sử dụng trong ứng dụng
├── lib/               # Các tiện ích, API helpers, hook, context, v.v.
├── styles/            # Global styles và theme configuration
├── public/            # Static assets
```

## Lưu ý về cấu trúc thư mục

- Sử dụng thư mục gốc (root) để chứa các thành phần chính của ứng dụng, không sử dụng thư mục `src/`.
- Các thành phần UI (components) được lưu trong thư mục `components/`.
- Các tiện ích và logic xử lý API được lưu trong thư mục `lib/`.
- Cấu hình và styles được lưu trong thư mục `styles/`.
- Sử dụng app router của Next.js với cấu trúc thư mục `app/` cho các trang và layout.

## Chú ý khi phát triển:

1. Không tạo các thư mục trùng lặp (như `src/components` và `components`).
2. Giữ cấu trúc thư mục nhất quán theo mô hình đã định nghĩa ở trên.
3. Tất cả các assets nên được đặt trong thư mục `public/`.
4. Sử dụng các alias import đã cấu hình trong `jsconfig.json` (ví dụ: `@/components/`, `@/lib/`).

Cấu trúc này tuân theo các khuyến nghị tốt nhất của Next.js và giúp duy trì mã nguồn rõ ràng, dễ hiểu. 