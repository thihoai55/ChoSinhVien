import { useState } from 'react'

export default function Footer() {
	const [hovered, setHovered] = useState(null)

	// --- STYLES ---
	
	const root = { background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', color: '#1f2937', marginTop: 25, borderTop: '1px solid #dbeafe' }
	const container = { maxWidth: 1120, margin: '0 auto', padding: '48px 16px 0 16px' }
	const row = { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 24 }
	const divider = { borderTop: '1px solid #dbeafe', marginTop: 48, padding: "15px", textAlign: 'center', fontSize: 13, color: '#6b7280' }

	const brandRow = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }
	const link = { color: '#374151', textDecoration: 'none', transition: 'all 0.2s' }
	
	const title = { color: '#1f2937', margin: '0 0 8px', fontSize: 16, fontWeight: 600 }
	const brandTitle = { ...title, margin: 0 } 

	const brandIcon = { fontSize: 22, color: '#3b82f6' }
	
	const socialBase = { ...link, fontSize: 20, transition: 'all 0.2s' } 
	
	const iconFB = { ...socialBase, color: '#1877F2' }
	const iconIG = { ...socialBase, color: '#E4405F' }
	const iconTikTok = { ...socialBase, color: '#000000' }
	const iconTwitter = { ...socialBase, color: '#1DA1F2' }
	const iconZalo = { ...socialBase, color: '#0068FF' }
	const iconThreads = { ...socialBase, color: '#000000' }
	const iconEmail = { ...socialBase, color: '#6b7280' }
	
	const linkHover = { ...link, color: '#3b82f6', textDecoration: 'underline' }
	const socialHover = { opacity: 0.7, transform: 'scale(1.1)' }

	return (
		<footer style={root}>
			<div style={container}>
				<div style={row}>
					{/* Cột 1: Giới thiệu */}
					<div>
						<div style={brandRow}>
							<i className="bi bi-book" style={brandIcon} />
							<h2 style={brandTitle}>Sàn Trao Đổi SV</h2>
						</div>
						<p style={{ fontSize: 14, marginTop: 8, maxWidth: 320, lineHeight: 1.6 }}>
							Nền tảng được thiết kế dành riêng cho cộng đồng sinh viên, giúp bạn kết nối, chia sẻ và trao đổi vật dụng học tập, đồ dùng cá nhân.
						</p>
					</div>

					{/* Cột 2: Liên kết */}
					<div>
						<h3 style={title}>Liên kết</h3>
						<div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
							<a 
								href="#" 
								style={hovered === 'about' ? linkHover : link}
								onMouseEnter={() => setHovered('about')}
								onMouseLeave={() => setHovered(null)}
							>
								Về chúng tôi
							</a>
							<a 
								href="#" 
								style={hovered === 'rules' ? linkHover : link}
								onMouseEnter={() => setHovered('rules')}
								onMouseLeave={() => setHovered(null)}
							>
								Quy tắc cộng đồng
							</a>
							<a 
								href="#" 
								style={hovered === 'guide' ? linkHover : link}
								onMouseEnter={() => setHovered('guide')}
								onMouseLeave={() => setHovered(null)}
							>
								Hướng dẫn sử dụng
							</a>
							<a 
								href="#" 
								style={hovered === 'faq' ? linkHover : link}
								onMouseEnter={() => setHovered('faq')}
								onMouseLeave={() => setHovered(null)}
							>
								Câu hỏi thường gặp
							</a>
						</div>
					</div>

					{/* Cột 3: Hỗ trợ */}
					<div>
						<h3 style={title}>Hỗ trợ</h3>
						<div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
							<a 
								href="#" 
								style={hovered === 'contact' ? linkHover : link}
								onMouseEnter={() => setHovered('contact')}
								onMouseLeave={() => setHovered(null)}
							>
								Liên hệ
							</a>
							<a 
								href="#" 
								style={hovered === 'privacy' ? linkHover : link}
								onMouseEnter={() => setHovered('privacy')}
								onMouseLeave={() => setHovered(null)}
							>
								Chính sách bảo mật
							</a>
							<a 
								href="#" 
								style={hovered === 'terms' ? linkHover : link}
								onMouseEnter={() => setHovered('terms')}
								onMouseLeave={() => setHovered(null)}
							>
								Điều khoản sử dụng
							</a>
							<a 
								href="#" 
								style={hovered === 'report' ? linkHover : link}
								onMouseEnter={() => setHovered('report')}
								onMouseLeave={() => setHovered(null)}
							>
								Báo cáo vi phạm
							</a>
						</div>
					</div>
					
					{/* Cột 4: Kết nối (Mạng xã hội) */}
					<div>
						<h3 style={title}>Kết nối</h3>
						
						{/* === SỬA LAYOUT: 4 CỘT MỘT HÀNG === */}
						<div style={{ 
							display: 'grid', 
							gridTemplateColumns: 'repeat(4, auto)', // 4 cột, độ rộng tự động
							gap: 16, // Khoảng cách 16px cho cả 2 chiều
							justifyContent: 'start' // Căn lề trái
						}}> 
							<a 
								href="#" 
								style={hovered === 'fb' ? {...iconFB, ...socialHover} : iconFB} 
								aria-label="Facebook"
								onMouseEnter={() => setHovered('fb')}
								onMouseLeave={() => setHovered(null)}
							>
								<i className="bi bi-facebook" />
							</a>
							<a 
								href="#" 
								style={hovered === 'ig' ? {...iconIG, ...socialHover} : iconIG} 
								aria-label="Instagram"
								onMouseEnter={() => setHovered('ig')}
								onMouseLeave={() => setHovered(null)}
							>
								<i className="bi bi-instagram" />
							</a>
							<a 
								href="#" 
								style={hovered === 'tiktok' ? {...iconTikTok, ...socialHover} : iconTikTok} 
								aria-label="TikTok"
								onMouseEnter={() => setHovered('tiktok')}
								onMouseLeave={() => setHovered(null)}
							>
								<i className="bi bi-tiktok" />
							</a>
							<a 
								href="#" 
								style={hovered === 'twitter' ? {...iconTwitter, ...socialHover} : iconTwitter} 
								aria-label="Twitter"
								onMouseEnter={() => setHovered('twitter')}
								onMouseLeave={() => setHovered(null)}
							>
								<i className="bi bi-twitter" />
							</a>
							<a 
								href="#" 
								style={hovered === 'zalo' ? {...iconZalo, ...socialHover} : iconZalo} 
								aria-label="Zalo"
								onMouseEnter={() => setHovered('zalo')}
								onMouseLeave={() => setHovered(null)}
							>
								<i className="bi bi-person-workspace" />
							</a>
							<a 
								href="#" 
								style={hovered === 'threads' ? {...iconThreads, ...socialHover} : iconThreads} 
								aria-label="Threads"
								onMouseEnter={() => setHovered('threads')}
								onMouseLeave={() => setHovered(null)}
							>
								<i className="bi bi-at" />
							</a>
							<a 
								href="#" 
								style={hovered === 'email' ? {...iconEmail, ...socialHover} : iconEmail} 
								aria-label="Email"
								onMouseEnter={() => setHovered('email')}
								onMouseLeave={() => setHovered(null)}
							>
								<i className="bi bi-envelope-fill" />
							</a>
						</div>
					</div>
				</div>
				
				<div style={divider}>© 2024 Sàn Trao Đổi SV. Tất cả quyền được bảo lưu.</div>
			</div>
		</footer>
	)
}