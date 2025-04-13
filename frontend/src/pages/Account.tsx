// Account.tsx
// React
import { useState } from 'react';

// Hooks
import { useTheme } from '@/hooks/useTheme';

// Components
import Footer from '@/components/Footer';

export default function Account() {
  const { theme } = useTheme(); // Lấy theme từ useTheme hook
  const [language, setLanguage] = useState('English'); // Ngôn ngữ mặc định
  const [activeTab, setActiveTab] = useState('Hồ sơ'); // Tab mặc định

  // Danh sách các tab
  const tabs = [
    'Hồ sơ',
    'Tài khoản',
    'Phương thức thanh toán',
    'Thông báo',
    'Sửa riêng tư',
  ];

  // Hàm xử lý khi nhấn nút "Lưu lại"
  const handleSave = () => {
    console.log('Saving user data...');
    // Thêm logic lưu dữ liệu tại đây (gọi API, lưu vào state, v.v.)
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      }`}
    >
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
        {/* Tiêu đề */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
          Tài khoản của tôi
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-6 lg:space-x-10 mb-4 sm:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-sm sm:text-base ${
                activeTab === tab
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-500'
              } mb-2 sm:mb-0`} // Thêm margin-bottom cho mobile khi tabs wrap
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form thông tin người dùng */}
        <div>
          {/* Tên dự án và Avatar */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
            <div className="relative">
              {/* Thay bằng hình ảnh thực tế nếu có */}
              <img
                src="https://media.techz.vn/resize_x355x/media2019/source/Nhung-do/A-Son-Tung-MTP/Son-Tung-MTP-lo-anh-dung-do-doi-voi-Thieu-Bao-Tram-9.jpg" // Thay bằng đường dẫn hình ảnh thực tế
                alt="User Avatar"
                className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-black rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm text-white">✏️</span>
              </div>
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <label
                className={`block text-sm sm:text-base font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Tên đầy đủ
              </label>
              <input
                type="text"
                defaultValue=""
                className={`w-full p-2 sm:p-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
          </div>

          {/* Họ đệm */}
          <div className="mb-4">
            <label
              className={`block text-sm sm:text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Họ đệm
            </label>
            <input
              type="text"
              defaultValue=""
              className={`w-full p-2 sm:p-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>

          {/* Tiêu đề */}
          <div className="mb-4">
            <label
              className={`block text-sm sm:text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Tiêu đề
            </label>
            <input
              type="text"
              defaultValue=""
              className={`w-full p-2 sm:p-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>

          {/* Ngôn ngữ */}
          <div className="mb-4">
            <label
              className={`block text-sm sm:text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Ngôn ngữ
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full p-2 sm:p-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-auto ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="English">English</option>
              <option value="Vietnamese">Vietnamese</option>
            </select>
          </div>

          {/* Liên kết */}
          <div className="mb-4 sm:mb-6">
            <label
              className={`block text-sm sm:text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Liên kết
            </label>
            <input
              type="text"
              defaultValue="va.com"
              className={`w-full p-2 sm:p-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>

          {/* Nút Lưu lại */}
          <div className="flex justify-center sm:justify-start">
            <button
              onClick={handleSave}
              className="bg-[#8B5CF6] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-[#7C3AED] transition"
            >
              Lưu lại
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}