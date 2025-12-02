import { useEffect, useMemo, useState } from 'react'
import { mockPosts, mockCommentsByPostId } from '../data/mock'
// --- SỬA 1: Import hook useAuth ---
import { useAuth } from '../contexts/AuthContext'
import { usePosts } from '../contexts/PostContext'

// --- SỬA 2: Xóa prop "user" ---
export default function PublicHomePage({ searchQuery = '', onNavigate, showToast }) {
	// --- SỬA 3: Lấy "user" từ context ---
	const { user } = useAuth();
	const { posts } = usePosts();
	
	const [selectedPost, setSelectedPost] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [sortType, setSortType] = useState('newest')

	const categories = [
		{ name: 'Tất cả', icon: 'bi-collection' },
		{ name: 'Sách & Tài liệu', icon: 'bi-book' },
		{ name: 'Đồ điện tử', icon: 'bi-cpu' },
		{ name: 'Đồ dùng học tập', icon: 'bi-pencil' },
		{ name: 'Xe đạp', icon: 'bi-bicycle' },
		{ name: 'Quần áo', icon: 'bi-bag' },
		{ name: 'Gia dụng', icon: 'bi-house-door' },
		{ name: 'Nội thất', icon: 'bi-lamp' },
		{ name: 'Thể thao', icon: 'bi-basket3' },
		{ name: 'Nhạc cụ', icon: 'bi-music-note-beamed' },
		{ name: 'Phụ kiện', icon: 'bi-gem' },
		{ name: 'Khác', icon: 'bi-box' },
	]
	const filtered = useMemo(() => {
		// Lọc bài đăng: chỉ hiển thị bài đã được duyệt (approved hoặc không có status) và không bị ẩn
		let processedPosts = posts.filter((p) => {
			// Chỉ hiển thị bài đăng đã được duyệt và không bị ẩn
			const isApproved = p.status === 'approved' || (!p.status && p.status !== 'pending' && p.status !== 'rejected');
			const isNotHidden = !p.hidden;
			return isApproved && isNotHidden;
		});
		
		if (sortType === 'popular') {
			processedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0))
		} else {
			// Sắp xếp theo mới nhất
			processedPosts.sort((a, b) => {
				const timeA = a.timestamp || a.createdAt || '';
				const timeB = b.timestamp || b.createdAt || '';
				return new Date(timeB) - new Date(timeA);
			});
		}
		
		return processedPosts.filter((p) => {
			const matchSearch = (p.title + ' ' + (p.content || p.description || ''))
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
			const matchCat =
				!selectedCategory ||
				selectedCategory === 'Tất cả' ||
				p.category === selectedCategory
			return matchSearch && matchCat
		})
	}, [searchQuery, selectedCategory, sortType, posts])
	const pageSize = 9
	const [currentPage, setCurrentPage] = useState(1)
	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
	const startIdx = (currentPage - 1) * pageSize
	const paginated = filtered.slice(startIdx, startIdx + pageSize)
	const [vw, setVw] = useState(
		typeof window !== 'undefined' ? window.innerWidth : 1200
	)
	useEffect(() => {
		const onResize = () => setVw(window.innerWidth)
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])
	useEffect(() => {
		setCurrentPage(1)
	}, [searchQuery, selectedCategory, sortType])

	const page = {
		minHeight: '100vh',
		background: 'linear-gradient(180deg,#eff6ff,#ffffff)',
		padding: '16px 0',
	}
	const container = { maxWidth: 1200, margin: '0 auto', padding: '0 16px' }
	const grid = {
		display: 'grid',
		gridTemplateColumns: vw >= 1024 ? '1fr 340px' : '1fr',
		gap: 16,
	}
	const card = {
		background: '#fff',
		border: '1px solid #e5e7eb',
		borderRadius: 12,
		boxShadow: '0 4px 12px rgba(0,0,0,.04)',
	}
	const cardBody = { padding: 16 }
	const listBase = { display: 'grid', gap: 12 }
	const isWide = vw >= 1280
	const list = isWide
		? { ...listBase, gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }
		: listBase
	const postCard = {
		display: 'block',
		textDecoration: 'none',
		border: '1px solid #dbeafe',
		borderRadius: 10,
		overflow: 'hidden',
		background: '#fff',
		boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
		transition: 'all 0.25s ease',
	}
	const postCardHover = {
		transform: 'translateY(-4px)',
		boxShadow: '0 8px 16px rgba(37,99,235,0.12)',
		borderColor: '#2563eb',
	}
	const thumb = { width: '100%', height: 180, objectFit: 'cover' }
	const badge = {
		border: '1px solid #c7d2fe',
		padding: '6px 10px',
		borderRadius: 16,
		cursor: 'pointer',
		background: '#fff',
		color: '#1e3a8a',
		transition: 'all .15s ease',
		outline: 'none',
		boxShadow: 'none',
		transform: 'scale(1)',
	}
	const badgeHover = {
		background: '#eef2ff',
		borderColor: '#a5b4fc',
		transform: 'scale(1.05)'
	}
	const badgeActive = {
		...badge,
		background: '#2563eb',
		color: '#fff',
		borderColor: '#2563eb',
		boxShadow: '0 2px 8px rgba(37,99,235,0.18)',
		transform: 'scale(1.05)',
	}
	const statBox = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 10,
		background: '#fff',
		borderRadius: 10,
		border: '1px solid #e5e7eb',
		transition: 'all 0.2s ease',
		transform: 'scale(1)'
	}
	const statBoxHover = {
		transform: 'scale(1.03)',
		boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
		borderColor: '#c7d2fe'
	}
	const tabButton = (active) => ({
		flex: 1,
		padding: '0',
		border: 'none',
		background: active ? '#2563eb' : '#f9fafb',
		color: active ? '#fff' : '#111827',
		fontWeight: 500,
		cursor: 'pointer',
		transition: 'all 0.25s ease',
		borderBottom: active ? '3px solid #1e40af' : '3px solid transparent',
		outline: 'none',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	})
	const createPostBtn = {
		width: '100%',
		background: '#2563eb',
		color: '#fff',
		border: 'none',
		padding: '10px 12px',
		borderRadius: 10,
		cursor: 'pointer',
		fontWeight: 500,
		outline: 'none',
		transition: 'all 0.3s ease',
		boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
		fontSize: 16,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8
	}

	// --- SỬA 4: Hàm này giờ sẽ tự động dùng "user" từ context ---
	const handleRequireLogin = () => {
		if (!user) {
			showToast?.('Vui lòng đăng nhập!')
			return true
		}
		return false
	}

	return (
		<div style={page}>
			<div style={container}>
				<div style={grid}>
					{/* LEFT: posts */}
					<div style={{ display: 'grid', gap: 16 }}>
						<div
							style={{
								...card,
								overflow: 'hidden',
								display: 'flex',
								height: 40,
								alignItems: 'stretch',
							}}
						>
							<button
								onClick={() => setSortType('newest')}
								style={tabButton(sortType === 'newest')}
								onMouseDown={(e) => e.preventDefault()}
								onFocus={(e) => e.target.blur()}
							>
								<i className="bi bi-clock" style={{ marginRight: 8 }} /> Mới nhất
							</button>
							<button
								onClick={() => setSortType('popular')}
								style={tabButton(sortType === 'popular')}
								onMouseDown={(e) => e.preventDefault()}
								onFocus={(e) => e.target.blur()}
							>
								<i className="bi bi-graph-up" style={{ marginRight: 8 }} /> Phổ biến
							</button>
						</div>
						<div style={list}>
							{filtered.length === 0 ? (
								<div
									style={{
										textAlign: 'center',
										padding: '48px 0',
										fontSize: 18,
										color: '#6b7280',
										gridColumn: '1 / -1',
									}}
								>
									Không tìm thấy bài viết nào
								</div>
							) : (
								paginated.map((p) => (
									<a
										key={p.id}
										href="#"
										onClick={(e) => {
											e.preventDefault()
											onNavigate?.('post-detail', p.id)
										  }}
										  
										style={{ ...postCard }}
										onMouseEnter={(e) =>
											Object.assign(e.currentTarget.style, postCardHover)
										}
										onMouseLeave={(e) =>
											Object.assign(e.currentTarget.style, {
												transform: '',
												boxShadow: postCard.boxShadow,
												borderColor: '#dbeafe',
												transition: postCard.transition,
											})
										}
									>
										<img alt="thumb" src={(p.images && p.images.length > 0) ? p.images[0] : (p.image || '')} style={thumb} />
										<div style={{ padding: 12 }}>
											<h3
												style={{
													margin: '0 0 6px',
													fontSize: 16,
													color: '#1e3a8a',
													fontWeight: 600,
												}}
											>
												{p.title}
											</h3>
											<div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
												{p.content}
											</div>
											<div
												style={{
													display: 'flex',
													gap: 14,
													alignItems: 'center',
													fontSize: 13,
													color: '#6b7280',
												}}
											>
												<span
													onClick={() => {
														if (handleRequireLogin()) return
														showToast?.('Đã thích bài viết!')
													}}
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: 4,
														cursor: 'pointer',
														transition: 'all 0.25s ease',
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)'
														e.currentTarget.style.color = '#db2777'
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.transform = 'translateY(0) scale(1)'
														e.currentTarget.style.color = '#6b7280'
													}}
												>
													<i className="bi bi-heart" style={{ color: '#db2777', transition: 'color 0.3s' }} />
													{p.likes}
												</span>
												<span
													onClick={() => {
														if (handleRequireLogin()) return
														showToast?.('Mở phần bình luận...')
													}}
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: 4,
														cursor: 'pointer',
														transition: 'all 0.25s ease',
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)'
														e.currentTarget.style.color = '#2563eb'
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.transform = 'translateY(0) scale(1)'
														e.currentTarget.style.color = '#6b7280'
													}}
												>
													<i className="bi bi-chat-dots" style={{ color: '#2563eb', transition: 'color 0.3s' }} />
													{mockCommentsByPostId[p.id]?.length || 0}
												</span>
												<span
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: 4,
														cursor: 'pointer',
														transition: 'all 0.25s ease',
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)'
														e.currentTarget.style.color = '#059669'
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.transform = 'translateY(0) scale(1)'
														e.currentTarget.style.color = '#6b7280'
													}}
												>
													<i className="bi bi-eye" style={{ color: '#059669', transition: 'color 0.3s' }} />
													{p.views}
												</span>
											</div>

										</div>
									</a>
								))
							)}
						</div>
						{filtered.length > 0 && (
							<div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
								<button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									onMouseDown={(e) => e.preventDefault()}
									onFocus={(e) => e.target.blur()}
									style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: currentPage === 1 ? '#f3f4f6' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', outline: 'none' }}>
									<i className="bi bi-chevron-left" />
								</button>
								{Array.from({ length: totalPages }).map((_, i) => (
									<button key={i} onClick={() => setCurrentPage(i + 1)}
										onMouseDown={(e) => e.preventDefault()}
										onFocus={(e) => e.target.blur()}
										style={{
											padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
											background: currentPage === i + 1 ? '#2563eb' : '#fff',
											color: currentPage === i + 1 ? '#fff' : '#111827', cursor: 'pointer',
											outline: 'none'
										}}>
										{i + 1}
									</button>
								))}
								<button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									onMouseDown={(e) => e.preventDefault()}
									onFocus={(e) => e.target.blur()}
									style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: currentPage === totalPages ? '#f3f4f6' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', outline: 'none' }}>
									<i className="bi bi-chevron-right" />
								</button>
							</div>
						)}
					</div>

					{/* RIGHT: sidebar */}
					<div style={{ display: 'grid', gap: 16 }}>

						{/* --- SỬA 5: Logic này giờ dùng "user" từ context --- */}
						{user ? (
							// --- CARD KHI ĐÃ ĐĂNG NHẬP ---
							<div style={{ ...card, ...cardBody }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
									<img src={user.avatar} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #e5e7eb' }} alt="avatar" />
									<div>
										<h3 style={{ margin: 0, fontSize: 15, color: '#6b7280', fontWeight: 500 }}>Chào mừng trở lại,</h3>
										<h2 style={{ margin: '0 0 4px', fontSize: 18, color: '#2563eb' }}>{user.name}</h2>
									</div>
								</div>
								<button
									onMouseDown={(e) => e.preventDefault()}
									onFocus={(e) => e.currentTarget.blur()}
									onClick={() => onNavigate('create-post')}
									style={createPostBtn}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
										e.currentTarget.style.boxShadow = '0 8px 18px rgba(37, 99, 235, 0.2)';
										e.currentTarget.style.background = '#1d4ed8';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0) scale(1)';
										e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
										e.currentTarget.style.background = '#2563eb';
									}}
								>
									<i className="bi bi-plus-circle-fill" />
									Tạo bài đăng mới
								</button>
							</div>

						) : (
							// --- CARD KHI CHƯA ĐĂNG NHẬP ---
							<div
								style={{
									...card,
									...cardBody,
									background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
									color: '#fff',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<div
										style={{
											width: 30,
											height: 30,
											background: 'rgba(255,255,255,.25)',
											borderRadius: '50%',
											margin: '0 auto 8px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 18,
											transition: 'all 0.3s ease',
										}}
									>
										<i className="bi bi-lock-fill" style={{ fontSize: 14 }} />
									</div>
									<h3 style={{ margin: '0 0 6px' }}>Tham gia ngay!</h3>
									<p style={{ margin: '0 0 8px', color: '#e0e7ff' }}>
										Đăng nhập để trải nghiệm đầy đủ tính năng
									</p>
									<div style={{ display: 'grid', gap: 8 }}>
										<button
											onMouseDown={(e) => e.preventDefault()}
											onFocus={(e) => e.currentTarget.blur()}
											onClick={() => onNavigate('login')}
											style={{
												background: '#fff',
												color: '#2563eb',
												border: 'none',
												padding: '10px 12px',
												borderRadius: 10,
												cursor: 'pointer',
												fontWeight: 500,
												outline: 'none',
												transition: 'all 0.3s ease',
												boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
												e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.15)';
												e.currentTarget.style.background = '#f0f9ff';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0) scale(1)';
												e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
												e.currentTarget.style.background = '#fff';
											}}
										>
											<i
												className="bi bi-box-arrow-in-right"
												style={{ marginRight: 6, fontSize: 16 }}
											/>{' '}
											Đăng nhập
										</button>
										<button
											onMouseDown={(e) => e.preventDefault()}
											onFocus={(e) => e.currentTarget.blur()}
											onClick={() => onNavigate('register')}
											style={{
												background: 'transparent',
												color: '#fff',
												border: '1px solid rgba(255,255,255,.6)',
												padding: '10px 12px',
												borderRadius: 10,
												cursor: 'pointer',
												fontWeight: 500,
												outline: 'none',
												transition: 'all 0.3s ease',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
												e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
												e.currentTarget.style.boxShadow = '0 8px 18px rgba(255,255,255,0.2)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0) scale(1)';
												e.currentTarget.style.background = 'transparent';
												e.currentTarget.style.boxShadow = 'none';
											}}
										>
											<i
												className="bi bi-person-plus"
												style={{ marginRight: 6, fontSize: 16 }}
											/>{' '}
											Đăng ký
										</button>
									</div>
								</div>
							</div>
						)}

						{/* (Phần còn lại của file giữ nguyên) */}
						<div style={{ ...card, ...cardBody }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
								<i className="bi bi-sliders" style={{ color: '#2563eb' }} />
								<h3 style={{ margin: 0 }}>Danh mục</h3>
							</div>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
								{categories.map((c) => {
									const isSelected = selectedCategory === c.name;
									return (
										<button
											key={c.name}
											onMouseDown={(e) => e.preventDefault()}
											onClick={() => setSelectedCategory(isSelected ? null : c.name)}
											onFocus={(e) => e.currentTarget.blur()}
											style={isSelected ? badgeActive : badge}
											onMouseEnter={(e) => { if (!isSelected) Object.assign(e.currentTarget.style, badgeHover) }}
											onMouseLeave={(e) => { if (!isSelected) Object.assign(e.currentTarget.style, { ...badge, transform: 'scale(1)' }) }}
										>
											<i className={`bi ${c.icon}`} style={{ marginRight: 6 }} />{c.name}
										</button>
									)
								})}
							</div>
						</div>
						<div style={{ ...card, ...cardBody, background: 'linear-gradient(135deg,#eef2ff,#ffffff)' }}>
							<h3 style={{ margin: '0 0 12px', color: '#3730a3' }}>Thống kê cộng đồng</h3>
							<div style={{ display: 'grid', gap: 10 }}>
								<div
									style={statBox}
									onMouseEnter={(e) => Object.assign(e.currentTarget.style, statBoxHover)}
									onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...statBox, transform: 'scale(1)' })}
								>
									<span><i className="bi bi-file-earmark-text" style={{ marginRight: 6 }} />Tổng bài viết</span>
									<b style={{ color: '#2563eb' }}>{mockPosts.length}</b>
								</div>
								<div
									style={statBox}
									onMouseEnter={(e) => Object.assign(e.currentTarget.style, statBoxHover)}
									onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...statBox, transform: 'scale(1)' })}
								>
									<span><i className="bi bi-heart" style={{ marginRight: 6, color: '#db2777' }} />Tổng lượt thích</span>
									<b style={{ color: '#db2777' }}>{mockPosts.reduce((s, p) => s + p.likes, 0)}</b>
								</div>
								<div
									style={statBox}
									onMouseEnter={(e) => Object.assign(e.currentTarget.style, statBoxHover)}
									onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...statBox, transform: 'scale(1)' })}
								>
									<span><i className="bi bi-eye" style={{ marginRight: 6, color: '#059669' }} />Tổng lượt xem</span>
									<b style={{ color: '#059669' }}>{mockPosts.reduce((s, p) => s + p.views, 0)}</b>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}