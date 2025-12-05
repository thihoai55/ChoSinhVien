import { useState, useEffect } from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { getUsers } from '../data/userData'
import { useAuth } from '../contexts/AuthContext'
import { usePosts } from '../contexts/PostContext'
import { useWallet } from '../contexts/WalletContext'
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

export default function EditPostPage({ postId, onNavigate }) {
  const { user } = useAuth()
  const { posts = [], updatePost } = usePosts?.() || {}
  const { addNotification } = useNotifications()
  const { balance, pay } = useWallet()

  // Tìm bài đăng cần chỉnh sửa
  const post = posts.find((p) => String(p.id) === String(postId))

  // Loại bài đăng - xác định từ post.type hoặc dựa vào price/package
  const getPostType = () => {
    if (post?.type) return post.type
    // Fallback: nếu có package hoặc price thì là 'sell', ngược lại là 'buy'
    if (post?.package || (post?.price && post.price.trim() !== '')) return 'sell'
    return 'buy'
  }

  const [postType, setPostType] = useState(getPostType())

  // Thông tin cơ bản - khởi tạo với dữ liệu từ post
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || post?.description || '')
  const [selectedCategory, setSelectedCategory] = useState(post?.category || 'Tất cả')

  // Thông tin chi tiết
  const [price, setPrice] = useState(post?.price || '')
  const [condition, setCondition] = useState(post?.condition || 'Mới')
  const [location, setLocation] = useState(post?.location || post?.address || '')
  const [contact, setContact] = useState(post?.contact || '')

  // File upload state - khởi tạo với images/videos hiện có
  const [files, setFiles] = useState([])
  const [existingImages, setExistingImages] = useState(post?.images || [])
  const [existingVideos, setExistingVideos] = useState(post?.videos || [])

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [selectedPackage, setSelectedPackage] = useState(post?.package || 'basic')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Load dữ liệu khi post thay đổi
  useEffect(() => {
    if (post) {
      // Xác định postType từ post
      let determinedType = post.type
      if (!determinedType) {
        // Fallback: nếu có package hoặc price thì là 'sell', ngược lại là 'buy'
        if (post.package || (post.price && post.price.trim() !== '')) {
          determinedType = 'sell'
        } else {
          determinedType = 'buy'
        }
      }
      setPostType(determinedType)
      setTitle(post.title || '')
      setContent(post.content || post.description || '')
      setSelectedCategory(post.category || 'Tất cả')
      setPrice(post.price || '')
      setCondition(post.condition || 'Mới')
      setLocation(post.location || post.address || '')
      setContact(post.contact || '')
      setExistingImages(post.images || [])
      setExistingVideos(post.videos || [])
      setSelectedPackage(post.package || 'basic')
    }
  }, [post])

  const handleBack = () => {
    if (onNavigate) onNavigate('post-detail', postId)
  }

  // Kiểm tra xem bài đăng đã quá 1 ngày chưa
  const isPostOlderThanOneDay = () => {
    if (!post?.timestamp) return false
    const postDate = new Date(post.timestamp)
    const now = new Date()
    const diffTime = now - postDate
    const diffDays = diffTime / (1000 * 60 * 60 * 24) // Chuyển đổi sang ngày
    return diffDays >= 1
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset errors
    const newErrors = {}
    
    // Validate từng trường
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề bài đăng.'
    }
    
    if (!content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung bài đăng.'
    }
    
    if (postType === 'sell' && !price.trim()) {
      newErrors.price = 'Vui lòng nhập giá bán.'
    }
    
    // Nếu có lỗi, hiển thị và dừng lại
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Clear errors nếu không có lỗi
    setErrors({})

    // Logic thanh toán khi chỉnh sửa:
    // 1. Nếu bài đăng đã quá 1 ngày → bắt buộc thanh toán
    // 2. Nếu là bài đăng "Cần bán" và chưa thanh toán → hiển thị modal thanh toán
    const needsPayment = isPostOlderThanOneDay() || (postType === 'sell' && !post?.package)
    
    if (needsPayment) {
      setShowPaymentModal(true)
      return
    }

    // Submit bài đăng
    await submitPost()
  }

  // Hàm submit bài đăng (sau khi thanh toán thành công hoặc là bài đăng miễn phí)
  const submitPost = async () => {
    setErrors({})
    setSubmitting(true)

    try {
      // Xử lý file upload - giữ lại images/videos cũ và thêm mới
      const uploadedImages = [...existingImages]
      const uploadedVideos = [...existingVideos]

      // Simulate file upload cho files mới
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          uploadedImages.push(url)
        } else if (file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file)
          uploadedVideos.push(url)
        }
      }

      if (updatePost && post) {
        await updatePost(post.id, {
          title: title.trim(),
          content: content.trim(),
          description: content.trim(), // Giữ cả description để tương thích
          category: selectedCategory,
          type: postType, // Giữ nguyên type (không cho đổi)
          price: price.trim(),
          condition,
          location: location.trim(),
          address: location.trim(), // Giữ cả address để tương thích
          contact: contact.trim(),
          images: uploadedImages,
          videos: uploadedVideos,
          package: postType === 'sell' ? selectedPackage : null,
          status: 'pending', // Sau khi chỉnh sửa, chuyển về trạng thái chờ duyệt
          // Giữ nguyên authorId, author, authorAvatar
        })

        // Notify admins that a post was edited and awaits approval
        try {
          const admins = getUsers().filter(u => u.role === 'admin');
          admins.forEach((a) => {
            addNotification(a.id, {
              type: 'post_pending',
              postId: post.id,
              message: `Bài đăng "${title.trim()}" đã được cập nhật và cần được duyệt.`,
            });
          });
        } catch (e) {
          // ignore if user data not present
        }
      }

      setTimeout(() => {
        setSubmitting(false)
        if (onNavigate) onNavigate('post-detail', postId)
      }, 500)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
      setErrors({ general: 'Có lỗi xảy ra khi cập nhật bài đăng. Vui lòng thử lại.' })
    }
  }

  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = (paymentMethod) => {
    // Tính giá dựa trên loại bài đăng
    let packagePrice = 0
    if (postType === 'sell') {
      packagePrice = selectedPackage === 'basic' ? 10000 : 25000
    } else {
      // Nếu là bài đăng "Cần mua" nhưng quá 1 ngày, vẫn tính phí
      packagePrice = selectedPackage === 'basic' ? 10000 : 25000
    }
    
    // Nếu thanh toán bằng số dư, trừ tiền ngay
    if (paymentMethod === 'balance') {
      const paymentDescription = isPostOlderThanOneDay() 
        ? `Thanh toán chỉnh sửa bài đăng (${selectedPackage === 'basic' ? 'Cơ bản' : 'Premium'})`
        : `Thanh toán gói ${selectedPackage === 'basic' ? 'Cơ bản' : 'Premium'} cho bài đăng`
      
      const paymentSuccess = pay(packagePrice, paymentDescription)
      
      if (paymentSuccess) {
        setShowPaymentModal(false)
        submitPost()
      } else {
        alert('Số dư không đủ. Vui lòng nạp thêm tiền.')
        setShowPaymentModal(false)
      }
    } else {
      // Các phương thức khác (VNPay, MoMo, QR) - giả lập thanh toán
      setShowPaymentModal(false)
      submitPost()
    }
  }

  // Xóa ảnh/video hiện có
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingVideo = (index) => {
    setExistingVideos(prev => prev.filter((_, i) => i !== index))
  }

  // Nếu không tìm thấy post, hiển thị thông báo
  if (!post) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 56px)', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        padding: '40px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ marginBottom: '16px', color: '#1f2937' }}>Không tìm thấy bài đăng</h2>
        <button
          onClick={() => onNavigate?.('home')}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 500
          }}
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  // ========== STYLES ==========
  const page = {
    minHeight: 'calc(100vh - 56px)',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    padding: '12px 0 80px 0',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1f2937',
    lineHeight: '1.5'
  }
  
  const container = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 16px',
    position: 'relative',
    zIndex: '1'
  }
  
  const card = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    padding: '24px',
    transition: 'all 0.3s ease',
    margin: '0 10px',
  }

  const getCardStyle = () => {
    if (postType === 'sell') {
      return {
        ...card,
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(to bottom, #fffbeb 0%, #ffffff 8%)',
      }
    }
    return card
  }

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
            // Thêm props cho edit mode
            isEditMode={true}
            existingImages={existingImages}
            existingVideos={existingVideos}
            removeExistingImage={removeExistingImage}
            removeExistingVideo={removeExistingVideo}
          />
        </div>
      </div>

      {/* Payment Modal - Hiển thị khi:
          1. Bài đăng đã quá 1 ngày (bắt buộc thanh toán khi chỉnh sửa)
          2. Hoặc là bài đăng "Cần bán" và chưa thanh toán
      */}
      {showPaymentModal && (
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
  )
}

