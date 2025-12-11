import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePosts } from '../contexts/PostContext'
import { useWallet } from '../contexts/WalletContext'
import { useNotifications } from '../contexts/NotificationContext'
import { getUsers } from '../data/userData'
import { ArrowLeft } from 'react-bootstrap-icons'
import CreatePostForm from './CreatePostForm'
import PaymentModal from './PaymentModal'

// Danh mục bài đăng
const categories = [
  'Tất cả',
  'Sách & tài liệu',
  'Đồ điện tử',
  'Đồ dùng học tập',
  'Xe đạp',
  'Quần áo',
  'Gia dụng',
  'Nội thất',
  'Thể thao',
  'Nhạc cụ',
  'Phụ kiện',
  'Khác'
]

export default function CreatePostPage({ onNavigate, hiddenPostData }) {
  const { user } = useAuth()
  const { addPost, deletePost, findMatchingBuyerPosts } = usePosts?.() || {}
  const { balance, pay } = useWallet()
  const { addNotification } = useNotifications()

  // Xác định postType từ hiddenPostData hoặc mặc định
  const getPostType = () => {
    if (hiddenPostData?.type) return hiddenPostData.type
    if (hiddenPostData?.package || (hiddenPostData?.price && hiddenPostData.price.trim() !== '')) return 'sell'
    return 'buy'
  }

  // Loại bài đăng: người dùng có thể đăng tin cần mua hoặc cần bán
  const [postType, setPostType] = useState(() => {
    if (hiddenPostData?.type) return hiddenPostData.type
    if (hiddenPostData?.package || (hiddenPostData?.price && hiddenPostData.price.trim() !== '')) return 'sell'
    return 'buy'
  })

  // Thông tin cơ bản - khởi tạo từ hiddenPostData nếu có
  const [title, setTitle] = useState(hiddenPostData?.title || '')
  const [content, setContent] = useState(hiddenPostData?.content || hiddenPostData?.description || '')
  const [selectedCategory, setSelectedCategory] = useState(hiddenPostData?.category || 'Tất cả')

  // Thông tin chi tiết (phù hợp hơn với tin mua/bán đồ)
  const [price, setPrice] = useState(hiddenPostData?.price || '')
  const [condition, setCondition] = useState(hiddenPostData?.condition || 'Mới')
  const [location, setLocation] = useState(hiddenPostData?.location || hiddenPostData?.address || '')
  const [contact, setContact] = useState(hiddenPostData?.contact || '')

  // File upload state - khởi tạo với images/videos từ hiddenPostData
  const [files, setFiles] = useState([])
  // Xử lý cả image (số ít) và images (số nhiều)
  const getExistingImages = () => {
    if (hiddenPostData?.images && Array.isArray(hiddenPostData.images)) {
      return hiddenPostData.images;
    }
    if (hiddenPostData?.image) {
      return [hiddenPostData.image];
    }
    return [];
  };
  const [existingImages, setExistingImages] = useState(getExistingImages())
  const [existingVideos, setExistingVideos] = useState(hiddenPostData?.videos || [])

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({}) // Object chứa errors cho từng field
  const [selectedPackage, setSelectedPackage] = useState(hiddenPostData?.package || 'basic') // 'basic' | 'premium'
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Load dữ liệu từ hiddenPostData khi component mount
  useEffect(() => {
    if (hiddenPostData) {
      const determinedType = getPostType()
      setPostType(determinedType)
      setTitle(hiddenPostData.title || '')
      setContent(hiddenPostData.content || hiddenPostData.description || '')
      setSelectedCategory(hiddenPostData.category || 'Tất cả')
      setPrice(hiddenPostData.price || '')
      setCondition(hiddenPostData.condition || 'Mới')
      setLocation(hiddenPostData.location || hiddenPostData.address || '')
      setContact(hiddenPostData.contact || '')
      // Xử lý cả image (số ít) và images (số nhiều)
      if (hiddenPostData.images && Array.isArray(hiddenPostData.images)) {
        setExistingImages(hiddenPostData.images);
      } else if (hiddenPostData.image) {
        setExistingImages([hiddenPostData.image]);
      } else {
        setExistingImages([]);
      }
      setExistingVideos(hiddenPostData.videos || [])
      setSelectedPackage(hiddenPostData.package || 'basic')
    }
  }, [hiddenPostData])

  const handleBack = () => {
    if (onNavigate) onNavigate('home')
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset errors
    const newErrors = {};
    
    // Validate từng trường
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề bài đăng.';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung bài đăng.';
    }
    
    if (postType === 'sell' && !price.trim()) {
      newErrors.price = 'Vui lòng nhập giá bán.';
    }
    
    // Nếu có lỗi, hiển thị và dừng lại
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors nếu không có lỗi
    setErrors({});

    // Nếu là bài đăng "Cần bán" → hiển thị modal thanh toán
    if (postType === 'sell') {
      setShowPaymentModal(true);
      return;
    }

    // Nếu là bài đăng "Cần mua" → submit luôn (miễn phí)
    await submitPost();
  }

  // Hàm submit bài đăng (sau khi thanh toán thành công hoặc là bài đăng miễn phí)
  const submitPost = async () => {
    setErrors({})
    setSubmitting(true)

    try {
      // In a real app, you would upload files to a server here
      // and get back URLs to store in your database
      const uploadedImages = [];
      const uploadedVideos = [];

      // Xử lý file upload - giữ lại images/videos cũ và thêm mới
      const finalImages = [...existingImages]
      const finalVideos = [...existingVideos]

      // Simulate file upload cho files mới
      // Convert files to base64 data URLs so they persist across page reloads
      const readFileAsDataURL = (file) => new Promise((res, rej) => {
        try {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = (e) => rej(e);
          reader.readAsDataURL(file);
        } catch (e) { rej(e); }
      });

      for (const file of files) {
        try {
          const dataUrl = await readFileAsDataURL(file);
          if (file.type.startsWith('image/')) {
            finalImages.push(dataUrl);
          } else if (file.type.startsWith('video/')) {
            finalVideos.push(dataUrl);
          }
        } catch (e) {
          // fallback to object URL if conversion fails
          if (file.type.startsWith('image/')) {
            finalImages.push(URL.createObjectURL(file));
          } else if (file.type.startsWith('video/')) {
            finalVideos.push(URL.createObjectURL(file));
          }
        }
      }

      if (addPost && user) {
        const newPost = {
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory,
          type: postType,
          price: price.trim(),
          condition,
          location: location.trim(),
          contact: contact.trim(),
          images: finalImages,
          videos: finalVideos,
          timestamp: new Date().toISOString(),
          package: postType === 'sell' ? selectedPackage : null, // Lưu thông tin gói nếu là bài đăng có phí
          status: 'pending', // Tất cả bài đăng đều có status pending và chờ admin duyệt
          hidden: false, // Bài đăng mới luôn là hidden: false (chưa bị ẩn)
          authorId: user.id, // Thêm authorId để bài đăng hiển thị trong trang cá nhân
          authorName: user.name, // Thêm tên tác giả (sử dụng authorName để hiển thị chính xác)
          authorAvatar: user.avatar, // Thêm avatar tác giả
        };
        
        const createdPost = await addPost(newPost);

        // Gửi thông báo cho admin khi có bài đăng mới
        const users = getUsers();
        const admin = users && users.find(u => u.role === 'admin');
        if (admin && addNotification) {
          addNotification(admin.id, {
            type: 'new_pending_post',
            postId: createdPost.id,
            fromUserId: user.id,
            message: `Có bài đăng mới cần duyệt: "${newPost.title}" từ ${user.name}`,
          });
        }

        // 🎯 THÊM: Nếu là bài PREMIUM, gửi notification đến buyers có category giống
        // (Khi bài được duyệt thì mới hiệu lực, nhưng ta có thể chuẩn bị sẵn)
        if (postType === 'sell' && selectedPackage === 'premium' && selectedCategory !== 'Tất cả') {
          try {
            // Note: Khi bài mới tạo thì status='pending', nên nó sẽ chỉ gửi notification khi admin duyệt
            // Nhưng ta có thể thêm notification sau khi duyệt trong AdminPostDetail.jsx
          } catch (error) {
            console.error('Error preparing buyer notifications:', error);
          }
        }

        // Nếu đăng lại từ bài đăng đã ẩn, xóa bài đăng cũ
        if (hiddenPostData?.id) {
          deletePost?.(hiddenPostData.id);
        }
      }

      setTimeout(() => {
        setSubmitting(false);
        if (onNavigate) onNavigate('home');
      }, 500);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setErrors({ general: 'Có lỗi xảy ra khi tạo bài đăng. Vui lòng thử lại.' });
    }
  }

  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = (paymentMethod) => {
    const packagePrice = selectedPackage === 'basic' ? 10000 : 25000;
    
    // Nếu thanh toán bằng số dư, trừ tiền ngay
    if (paymentMethod === 'balance') {
      const paymentSuccess = pay(packagePrice, `Thanh toán gói ${selectedPackage === 'basic' ? 'Cơ bản' : 'Premium'} cho bài đăng`);
      
      if (paymentSuccess) {
        setShowPaymentModal(false);
        submitPost();
      } else {
        alert('Số dư không đủ. Vui lòng nạp thêm tiền.');
        setShowPaymentModal(false);
      }
    } else {
      // Các phương thức khác (VNPay, MoMo, QR) - giả lập thanh toán
      // Trong thực tế, sẽ redirect đến cổng thanh toán
      setShowPaymentModal(false);
      submitPost();
    }
  }

  // ========== STYLES ==========
  const page = {
    minHeight: 'calc(100vh - 56px)', // Trừ đi chiều cao header
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    padding: '12px 0 80px 0', // Thêm padding bottom để có khoảng cách với footer
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1f2937',
    lineHeight: '1.5'
  };
  
  const container = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 16px',
    position: 'relative',
    zIndex: '1'
  };
  
  const card = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    padding: '24px',
    transition: 'all 0.3s ease',
    margin: '0 10px',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  };

  // Dynamic card style based on post type
  const getCardStyle = () => {
    if (postType === 'sell') {
      return {
        ...card,
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(to bottom, #fffbeb 0%, #ffffff 8%)',
      };
    }
    return card;
  };


  return (
    <div style={page}>
      <div style={container}>
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '15px',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#f3f4f6'
              }
            }}
          >
            <ArrowLeft size={20} className="me-2" />
            Quay lại
          </button>
        </div>
        <div style={getCardStyle()}>
          <CreatePostForm
            postType={postType}
            setPostType={setPostType}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            price={price}
            setPrice={setPrice}
            condition={condition}
            setCondition={setCondition}
            location={location}
            setLocation={setLocation}
            files={files}
            setFiles={setFiles}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            errors={errors}
            setErrors={setErrors}
            submitting={submitting}
            onSubmit={handleSubmit}
            onBack={handleBack}
            // Props cho repost mode (từ bài đăng đã ẩn)
            isRepostMode={!!hiddenPostData}
            existingImages={existingImages}
            existingVideos={existingVideos}
            removeExistingImage={(index) => setExistingImages(prev => prev.filter((_, i) => i !== index))}
            removeExistingVideo={(index) => setExistingVideos(prev => prev.filter((_, i) => i !== index))}
          />
        </div>
      </div>

      {/* Payment Modal - Chỉ hiển thị khi đăng bài "Cần bán" */}
      {postType === 'sell' && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          packageType={selectedPackage}
          packagePrice={selectedPackage === 'basic' ? 10000 : 25000}
          postTitle={title}
        />
      )}

      {/* Global styles */}
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, sans-serif;
          color: #1f2937;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        input,
        select,
        textarea,
        button {
          font-family: inherit;
          font-size: 100%;
          line-height: inherit;
          color: inherit;
          margin: 0;
          padding: 0;
        }
        button {
          cursor: pointer;
        }
        :focus {
          outline: none;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

