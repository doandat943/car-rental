# Mock Data Migration Documentation

## Tổng Quan

Tài liệu này mô tả quá trình di chuyển dữ liệu mô phỏng (mock data) từ frontend-admin sang backend, loại bỏ hoàn toàn cơ chế mô phỏng API và đảm bảo hệ thống hoạt động với dữ liệu thực từ database.

## Các Thay Đổi Chính

### 1. Loại bỏ cơ chế mô phỏng API trong frontend

- Đã xóa biến `MOCK_API_ENABLED` và toàn bộ cơ chế fallback sang dữ liệu mô phỏng trong file `frontend-admin/lib/api.js`
- Đã loại bỏ hoàn toàn hàm `mockApiResponse` và các xử lý liên quan
- Đã xóa file `frontend-admin/lib/seed-data.js` chứa dữ liệu mô phỏng

### 2. Cập nhật API trong frontend

- Đã chuẩn hóa các API endpoint để trỏ đến backend thực
- Đã sửa lại cấu trúc của một số API để phù hợp với backend
- Đã loại bỏ cơ chế kiểm tra endpoint tồn tại trước khi call API

### 3. Tích hợp dữ liệu mô phỏng vào backend

- Đã tạo mới các model cần thiết trong backend:
  - `Model/statistic.js`: Lưu trữ dữ liệu thống kê cho dashboard
  - `Model/setting.js`: Lưu trữ cài đặt hệ thống

- Đã cập nhật file `backend/src/seed-data.js` để tích hợp dữ liệu mô phỏng vào quá trình seed database
- Đã thêm các hàm để chuẩn bị dữ liệu thống kê, đánh giá, booking từ mock data

### 4. Thêm các API endpoint mới

- Đã thêm các endpoint mới trong dashboard controller:
  - `/api/dashboard/top-cars`: Lấy danh sách các xe được đặt nhiều nhất
  - `/api/dashboard/cars-by-status`: Thống kê xe theo trạng thái

## Hướng Dẫn Chạy

1. **Rebuild database với dữ liệu seed mới**:
   ```
   cd backend
   npm run seed
   ```

2. **Khởi động cả frontend và backend**:
   ```
   # Terminal 1
   cd backend
   npm run dev
   
   # Terminal 2
   cd frontend-admin
   npm run dev
   ```

## Lưu Ý

- Tất cả các chức năng hiện nay sẽ sử dụng dữ liệu thật từ database
- Đảm bảo backend đang chạy để frontend hoạt động đúng
- Không còn cơ chế fallback sang dữ liệu mô phỏng nếu API gặp lỗi 