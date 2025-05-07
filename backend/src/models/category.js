const mongoose = require('mongoose');

// Kiểm tra nếu model đã tồn tại để tránh định nghĩa lại
let Category;
try {
  Category = mongoose.model('Category');
} catch (error) {
  // Nếu model chưa được định nghĩa, chúng ta sẽ tạo mới
  const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
  });

  Category = mongoose.model('Category', categorySchema);
}

module.exports = Category; 