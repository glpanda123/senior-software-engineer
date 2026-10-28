# Bắt đầu từ đây: thứ tự đọc toàn bộ tài liệu

**Đang chờ bạn ngay bây giờ:** `docs/architecture/03-sequences-adr.vi.md` (trả lời 4 ✅/❌ + 1 câu ở cuối).

Quy tắc chung: file nào có bản `.vi.md` thì **chỉ đọc bản `.vi.md`**; bản `.md` tiếng Anh cùng tên là bản sao để công khai. Thứ tự dưới đây đi theo đúng câu chuyện của dự án: kế hoạch → sản phẩm → prototype → kiến thức backend → thiết kế → phỏng vấn.

Ký hiệu: **Đọc** = đọc kỹ · **Lướt** = xem tiêu đề và ý chính · ✅ = đã đọc xong.

## A. Bức tranh chung (~20 phút)

| # | File (repo riêng) | Cách đọc | Để làm gì |
| --- | --- | --- | --- |
| 1 | `CLAUDE.md` | Lướt | Luật làm việc giữa bạn và AI |
| 2 | `docs/how-i-learn.md` | Lướt | Cách học: mình làm mẫu → làm cùng → bạn tự làm |
| 3 | `docs/plan-4-tuan.md`, **chỉ mục "Cập nhật 22/10"** | Đọc | Lịch 5 giai đoạn đang theo |

## B. Sản phẩm và business: giai đoạn 0–1 (~40 phút)

| # | File | Cách đọc | Để làm gì |
| --- | --- | --- | --- |
| 4 | `docs/PRD.md` | Đọc | TaskFlow làm gì, cho ai, phạm vi v1 (bản v1.3) |
| 5 | `docs/business/01-business-brief.full.vi.md` | Đọc | Vấn đề, khách hàng, đối thủ, mô hình kinh doanh, pitch 60 giây |
| 6 | `docs/business/01-business-brief.vi.md` | Lướt | Bảng dịch khái niệm business + câu hỏi phản biện |
| 7 | `docs/design/wireframe-decision.md`, `persona-walkthrough-v1.md`, `ui-acceptance.md` | Lướt | Quyết định giao diện của tuần 1 |

## C. Prototype và trình bày: giai đoạn 2 (~25 phút)

| # | File | Cách đọc | Để làm gì |
| --- | --- | --- | --- |
| 8 | Repo taskflow: `README.md` | Lướt | Repo có gì, link prototype và trang status |
| 9 | `docs/business/02-demo-script.vi.md` rồi `02-demo-script.md` | Đọc | Cách luyện + kịch bản demo 5 phút (bảng bấm gì / nói gì nằm ở bản tiếng Anh) |
| 10 | `docs/business/03-feedback.md` | Điền | Ghi góp ý của anh và 2–3 người |

## D. Kiến thức backend và system design nền (~55 phút)

| # | File | Cách đọc | Để làm gì |
| --- | --- | --- | --- |
| 11 | `docs/learning/backend-so-far.vi.md` | **Đọc kỹ** | Nền tảng backend: API, vòng đời request, đăng nhập, phân quyền, 409, thứ tự task |
| 12 | `docs/architecture/01-requirements-and-estimates.vi.md` | Đọc | Yêu cầu và ước lượng quy mô của TaskFlow |
| 13 | `docs/system-design/01-url-shortener.vi.md` | Đọc | Bài mẫu khung system design 7 bước |

## E. Thiết kế TaskFlow: giai đoạn 3 (~30 phút)

| # | File | Cách đọc | Để làm gì |
| --- | --- | --- | --- |
| 14 | `docs/architecture/02-c4-erd.vi.md` (phần 1–2) | ✅ | Các hộp trong hệ thống + các bảng dữ liệu |
| 15 | `docs/architecture/03-sequences-adr.vi.md` | **Đọc ngay** | Từng bước của 3 luồng khó + 2 quyết định stack và hạ tầng |
| 16 | Repo taskflow: `docs/architecture/` theo thứ tự README → 01 → 02 → 03 → `adr/ADR-001` → `adr/ADR-002` | Đọc trước phỏng vấn system design | Bản đầy đủ tiếng Anh, chính là thứ bạn sẽ trình bày |

## F. Phỏng vấn (ôn nhiều lần)

| # | File | Cách đọc | Để làm gì |
| --- | --- | --- | --- |
| 17 | `docs/interview/qa-review.vi.md` | Ôn | Q1–Q12: đọc câu hỏi, tự nói trước, rồi mới mở đáp án |
| 18 | `docs/interview/stories.md` | Ôn | Tự giới thiệu + 3 câu chuyện STAR |

## G. Không cần đọc

- **Bản sao tiếng Anh** của file đã có `.vi.md`: `01-business-brief.md`, `01-requirements-and-estimates.md`, `01-url-shortener.md`, `qa-review.md`.
- **Bản kế hoạch gốc** `plan.md`: đã được thay bằng `docs/plan-4-tuan.md`.
- **Nhật ký và tra cứu:** `DEVLOG.md` (mình cập nhật), `job-hunt/jobs.md` (dùng từ 04/11), `README.md` (trống).
- **Repo taskflow:** `apps/web/AGENTS.md` và `apps/web/README.md` (file do công cụ tự sinh).

Tổng thời gian nếu đọc hết A–F: khoảng 3 giờ. Không cần đọc một lần: hiện tại chỉ cần #15, còn lại đọc dần theo giai đoạn.
