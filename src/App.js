import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PublicHomePage from "./components/PublicHomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Toast from "./components/Toast";
import PostDetailPage from "./components/PostDetailPage";
import { UserProfilePage } from "./components/UserProfilePage";
import CreatePostPage from "./components/CreatePostPage";
import EditPostPage from "./components/EditPostPage";
import EditProfile from "./components/EditProfile";
import RechargePage from "./components/RechargePage";
import LichSuGiaoDichPage from "./components/LichSuGiaoDichPage";
import PostNotificationHandler from "./components/PostNotificationHandler";
import BuyerInfoPage from "./components/BuyerInfoPage";
import RatingSellersPage from "./components/RatingSellersPage";
import AdminLayout from "./components/AdminLayout";

// 🧩 Import các Provider context
import { AuthProvider } from "./contexts/AuthContext";
import { PostProvider } from "./contexts/PostContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ChatProvider } from "./contexts/ChatContext";
import { WalletProvider } from "./contexts/WalletContext";
import { FollowProvider } from "./contexts/FollowContext";

function App() {
  // ✅ 1. Thay đổi state để lưu lịch sử
  const [pageHistory, setPageHistory] = useState(["home"]);
  // Trang hiện tại luôn là trang cuối cùng trong mảng lịch sử
  const currentPage = pageHistory[pageHistory.length - 1];

  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const [hiddenPostData, setHiddenPostData] = useState(null);


  // ✅ 2. Cập nhật onNavigate để *thêm* trang vào lịch sử
  const onNavigate = (page, data) => {
    if (page === "logout") {
      setPageHistory(["home"]); // Logout thì reset về home
      // (Thêm logic logout của context vào đây nếu cần)
    } else if (page === "post-detail") {
      setSelectedPostId(data);
      setPageHistory(prev => [...prev, "post-detail"]); // Thêm 'post-detail' vào mảng
    } else if (page === "user-profile") {
      setSelectedUserId(data);
      setPageHistory(prev => [...prev, "user-profile"]); // Thêm 'user-profile' vào mảng
    } else if (page === "edit-post") {
      setEditPostId(data);
      setPageHistory(prev => [...prev, "edit-post"]); // Thêm 'edit-post' vào mảng
    } else if (page === "create-post") {
      // Nếu có data (từ bài đăng đã ẩn), lưu vào state
      if (data && typeof data === 'object' && data.fromHiddenPost) {
        setHiddenPostData(data.fromHiddenPost);
      } else {
        setHiddenPostData(null);
      }
      setPageHistory(prev => [...prev, "create-post"]);
    } else {
      // Xử lý các trang đơn giản (login, register, home)
      if (page === 'home') {
        setPageHistory(['home']); // Về home thì reset lịch sử
      } else {
        setPageHistory(prev => [...prev, page]); // Thêm trang (vd: 'login')
      }
    }
  };



  // ✅ 3. Tạo hàm onBack để *xóa* trang khỏi lịch sử
  const onBack = () => {
    setPageHistory(prev => {
      // Chỉ quay lại nếu có nhiều hơn 1 trang trong lịch sử
      if (prev.length > 1) {
        return prev.slice(0, -1); // Trả về mảng mới, bỏ đi phần tử cuối
      }
      return prev; // Nếu chỉ còn 'home', thì giữ nguyên
    });
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    // Bọc toàn bộ App bằng các Provider
    <AuthProvider>
      <WalletProvider>
        <ChatProvider>
          <FollowProvider>
            <PostProvider>
              <NotificationProvider>
                <PostNotificationHandler />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* Render AdminLayout riêng biệt nếu là trang admin */}
          {currentPage === "admin" ? (
            <AdminLayout onNavigate={onNavigate} />
          ) : (
            <>
              {currentPage !== "login" && currentPage !== "register" && (
                <Header
                  onNavigate={onNavigate}
                  showSearch={currentPage === "home"}
                  onSearch={setSearchQuery}
                  showToast={showToast}
                />
              )}

              <main style={{ flex: 1 }}>
                {currentPage === "home" && (
                  <PublicHomePage
                    onNavigate={onNavigate}
                    searchQuery={searchQuery}
                    showToast={showToast}
                  />
                )}

                {currentPage === "create-post" && (
                  <CreatePostPage onNavigate={onNavigate} hiddenPostData={hiddenPostData} />
                )}

                {currentPage === "edit-post" && (
                  <EditPostPage postId={editPostId} onNavigate={onNavigate} />
                )}

                {currentPage === "edit-profile" && (
                  <EditProfile onNavigate={onNavigate} />
                )}

                {currentPage === "post-detail" && (
                  <PostDetailPage postId={selectedPostId} onNavigate={onNavigate} onBack={onBack} />
                )}

                {currentPage === "buyers" && (
                  <BuyerInfoPage onNavigate={onNavigate} onBack={onBack} />
                )}

                {currentPage === "rating-sellers" && (
                  <RatingSellersPage onNavigate={onNavigate} onBack={onBack} />
                )}

                {currentPage === "login" && (
                  <Login 
                    onNavigate={onNavigate} 
                  />
                )}

                {currentPage === "register" && (
                  <Register onNavigate={onNavigate} />
                )}

                {currentPage === "user-profile" && (
                  <UserProfilePage userId={selectedUserId} onNavigate={onNavigate} onBack={onBack} />
                )}

                {currentPage === "recharge" && (
                  <RechargePage onNavigate={onNavigate} onBack={onBack} />
                )}

                {currentPage === "transaction-history" && (
                  <LichSuGiaoDichPage onNavigate={onNavigate} onBack={onBack} />
                )}
              </main>

              {toast && <Toast message={toast} onClose={() => setToast(null)} />}

              {currentPage !== "login" && currentPage !== "register" && <Footer />}
            </>
          )}
        </div>
              </NotificationProvider>
            </PostProvider>
          </FollowProvider>
      </ChatProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;