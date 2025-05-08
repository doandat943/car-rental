# Cấu trúc thư mục dự án Car Rental Backend

## Tổng quan

Dự án backend này sử dụng cấu trúc thư mục sau:

```
backend/
├── src/               # Mã nguồn chính
│   ├── config/        # Cấu hình (database, environment, etc.)
│   ├── controllers/   # Xử lý logic nghiệp vụ
│   ├── middlewares/   # Middleware Express
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # Business logic và services
│   ├── utils/         # Các hàm tiện ích
│   ├── app.js         # Express app setup
│   ├── server.js      # Entry point
│   └── seed-data.js   # Dữ liệu mẫu để khởi tạo
```

## Lưu ý về cấu trúc thư mục

- Thư mục `config/` chứa các cấu hình database và các cấu hình khác.
- Thư mục `controllers/` chứa các hàm xử lý request và gửi response.
- Thư mục `middlewares/` chứa các middleware như authentication, validation, error handling.
- Thư mục `models/` chứa các Mongoose schema và models.
- Thư mục `routes/` chứa các API routes định nghĩa endpoints.
- Thư mục `services/` chứa business logic không phụ thuộc trực tiếp vào request/response.
- Thư mục `utils/` chứa các hàm tiện ích được sử dụng trong toàn bộ ứng dụng.

## Chú ý khi phát triển:

1. KHÔNG sử dụng thư mục `configs/` - đã được thay thế bằng `config/`.
2. KHÔNG tạo thư mục `backend/` bên trong project - gây trùng lặp không cần thiết.
3. Sử dụng `config/db.js` cho các cấu hình database.
4. Các file mới nên tuân theo cấu trúc đã mô tả ở trên.

Cấu trúc này tuân theo nguyên tắc tổ chức mã nguồn theo chức năng (functional organization) và giúp duy trì mã nguồn rõ ràng, dễ bảo trì. 