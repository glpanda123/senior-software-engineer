# TaskFlow — Yêu cầu và ước lượng quy mô

Bản tiếng Việt của [`01-requirements-and-estimates.md`](01-requirements-and-estimates.md). Đây là bước 1–2 của system design. Phạm vi sản phẩm lấy từ [`docs/PRD.md`](../PRD.md).

Các thuật ngữ hay dùng khi phỏng vấn (QPS, p95, cache, WebSocket…) giữ nguyên tiếng Anh, có giải thích ở lần xuất hiện đầu.

> **Cập nhật 26/10 (PRD v1.3, đã chốt phạm vi):** comment, label, đính kèm file và tìm kiếm chuyển sang v1.1. v1 có thêm activity log theo dự án và AI soạn task bằng LLM thật. Các con số ước lượng giữ nguyên. Kiến trúc: repo taskflow, thư mục `docs/architecture/`.

## Yêu cầu chức năng (functional)

1. **Tài khoản:** người dùng đăng ký, đăng nhập, giữ đăng nhập an toàn (xoay vòng refresh token), đăng xuất.
2. **Workspace và phân quyền:** owner hoặc admin tạo workspace và project, mời người qua email kèm một role: **owner, admin, member, viewer**. Owner, admin và member thấy mọi project trong workspace. **Viewer chỉ thấy những project được mời vào.**
3. **Task:** member tạo, sửa và giao task (tiêu đề, mô tả, trạng thái, người phụ trách, độ ưu tiên, hạn chót, nhãn), comment và đính kèm file.
4. **Board và realtime:** member đổi trạng thái và thứ tự task bằng kéo thả (hoặc "Move to"). **Mọi người đang xem project đều thấy thay đổi ngay lập tức.**
5. **Tổng quan:** màn "Today" (việc trễ hạn, việc sắp đến hạn, ai đang làm gì), tìm kiếm task, nhật ký hoạt động.
6. **AI hỗ trợ:** dán một đoạn văn bản tự do → AI soạn danh sách task nháp, người dùng duyệt trước khi lưu.

**Ngoài phạm vi (v1):** sprint/Gantt, chấm công, thanh toán, app mobile native, tích hợp bên thứ ba, SSO.

## Yêu cầu phi chức năng (non-functional)

| | Mục tiêu | Vì sao ảnh hưởng tới thiết kế |
| --- | --- | --- |
| **Quy mô (scale)** | Năm đầu: 2.000 workspace × ~10 người = **20k user**, ~10k người hoạt động mỗi ngày, ~4k người dùng cùng lúc lúc cao điểm. Thiết kế để tăng gấp 10 lần mà không phải viết lại | Quyết định dùng một DB hay phải chia nhỏ (sharding), cần bao nhiêu instance realtime |
| **Độ trễ (latency)** | API trả danh sách task **p95 < 200 ms** (workspace có 100k task); cập nhật realtime hiện ở tab khác **p95 < 1 s**. *p95 = 95% request nhanh hơn mức này* | Cần index đúng và phân trang bằng cursor; đẩy thay đổi qua WebSocket thay vì để client hỏi liên tục (polling) |
| **Độ sẵn sàng (availability)** | **99.9%** (được sập tối đa ≈ 43 phút/tháng) | Tối thiểu 2 instance API sau load balancer, deploy không gián đoạn, backup DB và khôi phục được về một thời điểm bất kỳ (point-in-time recovery) |
| **Tính nhất quán (consistency)** | **Nhất quán mạnh** cho dữ liệu gốc: mọi lần ghi vào task (kể cả trạng thái và vị trí) và mọi dữ liệu thành viên/role. Hai người sửa cùng lúc → trả **409 nhờ optimistic locking**, không bao giờ ghi đè âm thầm. **Nhất quán sau (eventual, trễ vài giây)** cho các màn hiển thị lấy từ dữ liệu gốc: thông báo realtime, cache, các con số trên Today, activity feed, chỉ mục tìm kiếm | Một Postgres primary duy nhất và dùng transaction; chỉ dùng xử lý bất đồng bộ hoặc cache cho dữ liệu dẫn xuất |
| **Bảo mật (security)** | **Cách ly tenant:** workspace A không bao giờ đọc được dữ liệu workspace B. Phân quyền (RBAC) kiểm tra **ở API** (ẩn nút trên UI chỉ là trải nghiệm). Viewer bị giới hạn theo từng project | Cột `workspace_id` trên mọi bảng thuộc tenant, kèm bộ lọc bắt buộc hoặc Postgres RLS; test e2e kiểm tra cách ly chạy trong CI |
| **Tỷ lệ đọc/ghi** | ~6 lần đọc : 1 lần ghi | Đọc nhiều hơn ghi nhưng quy mô nhỏ, nên cache là tùy chọn, chưa bắt buộc |

## Ước lượng quy mô

**Giả định** (dựa trên team 3–15 người trong PRD):
- 2.000 workspace × 10 người = **20.000 user**
- Công cụ làm việc, dùng hằng ngày → **50% hoạt động mỗi ngày (DAU) = 10.000 người**
- Mỗi người hoạt động, mỗi ngày: **~60 lần đọc** (mở Today, mở board, xem chi tiết task), **~10 lần ghi** (tạo, sửa, kéo thả, comment)
- Cao điểm = **gấp 5 lần trung bình** (giờ hành chính)

*QPS = số request mỗi giây. Một ngày ≈ 100.000 giây.*

| | Cách tính | Kết quả |
| --- | --- | --- |
| Đọc | 10.000 × 60 = 600k/ngày ÷ 100k giây | **~6 QPS trung bình, ~30 QPS cao điểm** |
| Ghi | 10.000 × 10 = 100k/ngày ÷ 100k giây | **~1 QPS trung bình, ~5 QPS cao điểm** |
| Đọc : ghi | 600k : 100k | **~6 : 1** |
| Kết nối WebSocket | 10.000 DAU × 40% đang mở app lúc cao điểm | **~4.000 kết nối cùng lúc** |
| Tin nhắn realtime | 5 lần ghi/giây × ~3 người đang xem cùng project | **~15 tin/giây** |
| Dung lượng task (1 năm) | 10.000 × 3 task mới/ngày × 250 ngày làm việc = 7,5 triệu task × ~1 KB | **~7,5 GB** |
| + comment, nhật ký hoạt động | × ~3 | **~20–25 GB** trong Postgres |
| File đính kèm | lưu trên S3, không lưu trong DB | tăng riêng (tốn chi phí lưu trữ, không tạo tải cho DB) |

## Các con số nói lên điều gì

1. **Một Postgres primary là quá đủ.** ~35 QPS lúc cao điểm là rất nhỏ với Postgres. Không cần sharding, không cần read replica. Nên dồn công sức vào index, transaction và backup.
2. **Realtime vẫn cần từ 2 instance trở lên.** Một tiến trình Node chứa được ~4k kết nối, nhưng muốn đạt 99.9% availability và deploy không gián đoạn thì phải có ít nhất 2 instance. Khi đó, người đang kết nối vào instance A phải nhận được thay đổi do người ở instance B tạo ra → dùng **Redis pub/sub** (Socket.IO Redis adapter).
3. **Dung lượng nhỏ.** ~25 GB/năm nằm gọn trong một database; file đính kèm để trên S3.
4. **Cache là tùy chọn.** Với tỷ lệ 6:1 và 30 QPS đọc, Postgres tự phục vụ được. Chỉ thêm cache-aside sau này, cho những chỗ đã đo được là nóng.
5. **Phần khó là tính đúng đắn, không phải quy mô:** cách ly tenant, ghi đồng thời (409), sắp thứ tự mà không phải cập nhật lại cả danh sách (fractional indexing), và realtime chạy trên nhiều instance. Đây là chỗ cần đào sâu (deep dive).
6. **Khi lớn gấp 10 lần** (200k user, ~350 QPS cao điểm, ~40k kết nối): vẫn một DB primary với index tốt; thêm instance realtime; cân nhắc một read replica cho các truy vấn tổng quan của màn Today.
