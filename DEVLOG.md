# DEVLOG

Mỗi ngày: làm được gì, chỗ sai / agent làm hỏng và bài học, tự chấm độ sâu (1 dùng được · 2 giải thích được · 3 xử lý được khi hỏng · 4 dạy lại được).

## Ngày 1 — T4 14/10/2026

- Block 1 (DSA arrays & hashing): chưa làm, dời về cuối ngày (Longest Consecutive Sequence)
- Block 2 (P1 discovery): xong — docs/PRD.md, user flow, wireframe A/B/C → chọn B + C theo role (docs/design/wireframe-decision.md)
- Block 3 (Tell me about yourself): bản 90 s + 3 STAR story trong docs/interview/stories.md
- Sai / bài học: lần đầu viết PRD; non-goals là chỗ cắt scope có chủ đích. Tự giới thiệu phải trung thực: backend mới 3 tháng.
- Tự chấm:

## Ngày 2 — T5 15/10/2026

- Build: mockup hi-fi v1 (12 màn: tokens, login, onboarding 2 bước, new task, Today lead/viewer, project list + kéo thả, members, states gồm 409, 3 màn mobile); docs/design/ui-acceptance.md + tokens.json.
- Lý thuyết: design token, WCAG AA; Node event loop.
- Quiz event loop: câu 1 đúng thứ tự (A F E D B C), thiếu ý "B/C ở main module không đảm bảo thứ tự". Câu 2 nêu được thread pool cạn, chưa nêu nguyên nhân chính: 25% CPU trên 4 core = 1 core 100% → event loop bị chặn bởi code đồng bộ nặng CPU.
- Chưa làm: test mockup với 3 người, DSA.
- Tự chấm: Node event loop 2/4 (giải thích được, chưa debug được) → ôn lại tuần sau.

## Ngày 3 — T6 16/10/2026

- Mockup v2 sau AI persona walkthrough (7 lỗi ≥ 2/3 persona đã sửa); viewer chỉ xem project được mời → PRD v1.1.
- Học cách học với AI (docs/how-i-learn.md, CLAUDE.md); file ôn tập docs/interview/qa-review.md.
- System design: khung 7 bước, LB, scale ngang, CAP; requirements + estimate bản 1 (số liệu mâu thuẫn, estimate chưa ra số) → đang sửa.
- Dời sang Ngày 4: OpenAPI, monorepo, C4/ERD, budget alert. Dời cuối tuần: sequences, AI phản biện thiết kế, ADR-001/002.

## Ngày 4 — T7 17/10/2026

- TaskFlow repo: scaffold monorepo pnpm + Turborepo + Next 16 (PR #1) và OpenAPI contract + types sinh tự động + Swagger UI (PR #2); CI xanh, đã merge cả hai.
- Đọc contract, trả lời 3 câu (Q9): 409 → phải cho người dùng quyết định, không tự thử lại; cursor ✅; fractional indexing là chủ đề mới (đã giải thích).
- Tự chấm:

## Ngày 5 — CN 18/10/2026

- TaskFlow: API giả bằng MSW 3 + openapi-msw, có type lấy từ contract (PR #3, đã merge): PATCH 409, move fractional index, RBAC, dev panel giả lập chậm / lỗi / sửa đồng thời; trang `/dev` để thử luồng 409.
- Theme từ `tokens.json` (Tailwind v4, tên biến theo shadcn), font IBM Plex (PR #4).
- Deploy Vercel: https://taskflow-blond-gamma.vercel.app (tự deploy khi merge master, có preview cho mỗi PR).
- Bất ngờ: MSW 3 đổi `onUnhandledRequest` thành `onUnhandledFrame`; `msw/browser` không chạy ở server → `next/dynamic({ ssr: false })`. AI viết sai logic move khi chỉ có `beforeId`, phát hiện lúc tự review → cần test ở ngày hàng rào.
- Tự chấm:

## Ngày 6 — T2 19/10/2026

- Lớp dữ liệu typed (openapi-fetch + TanStack Query) + AuthProvider (PR #5); AI dựng màn auth + onboarding (PR #6 → #7: PR xếp chồng bị merge vào branch trung gian, mở lại vào master).
- Đổi vai: AI dựng FE, mình review; học lại toàn bộ backend đã có (`docs/learning/backend-so-far.vi.md`), trả lời Q10: 404 vs 403 ✅; chưa biết race condition check-then-write; nhầm rotation với thời hạn token.
- Chốt mật khẩu tối thiểu 8 ký tự (PRD v1.2).
- Tự chấm:

## Ngày 7 — T3 20/10/2026

- AI dựng Today / Project (list + chi tiết, Move to, 409 giữ bản sửa) / Members (mời viewer theo project) + khung app, phân quyền viewer (PR #8). Playwright 13/13.
- Việc của mình: review PR #8 như senior FE.
- Tự chấm:

## Ngày 8 — T4 21/10/2026

- Nghỉ (không có buổi học).

## Ngày 9 — T5 22/10/2026 · Giai đoạn 1

- Plan: xếp hàng ưu tiên sau 03/11 + 2 điều kiện (chốt & thiết kế trọn v1; khóa UI sau GĐ2).
- Business brief bài mẫu: `docs/business/01-business-brief.md` (+ `.vi.md` hướng dẫn đọc, câu hỏi phản biện). Đề xuất v1: thêm activity log; comment/label/file/tìm kiếm sang v1.1 → chờ mình duyệt rồi nâng PRD v1.3.
- Trang /status v1 (taskflow PR #9): dữ liệu `apps/web/src/content/progress.json`; chuyển các route dùng API vào route group `(prototype)` để /status render tĩnh từ server.
- Còn lại cho gate: trả lời ≥ 2 câu phản biện, chốt phạm vi v1, nói pitch 60 giây tiếng Anh.
- Tự chấm:

## Ngày 10 — T6 23/10/2026

- Không có buổi học (chỉ scan job tự động).

## Ngày 11 — T7 24/10/2026

- Chốt phạm vi v1 như đề xuất trong brief → PRD v1.3 (comment/label/file/tìm kiếm sang v1.1; activity log theo dự án ở v1). Thêm màn activity log vào giai đoạn 2.
- Gate giai đoạn 1 chưa xong: 2 câu phản biện + pitch 60 giây, mình sẽ luyện sau. Pitch phải xong trước buổi present của giai đoạn 2.
- Giai đoạn 2, buổi 1 (taskflow PR #11): landing page ở `/` (vấn đề → 3 tính năng → cách hoạt động → giá dự kiến), `/demo` vào thẳng app bằng tài khoản demo, visual v2 (sidebar có icon + màu dự án, Today có câu tóm tắt + "Projects to watch", màn đăng nhập mới). Test: auth 6/6, app 13/13.
- Việc của mình: review PR #11 như senior FE (gợi ý: landing có nói quá điều prototype chưa làm được không? màu dự án có đủ tương phản không?).
- Giai đoạn 2, buổi 2:
  - PR #12: board Kanban kéo thả (chuột, cảm ứng, bàn phím; trình đọc màn hình đọc vị trí), thả xong thấy ngay (optimistic). Realtime qua WebSocket thật, MSW chặn trong trình duyệt; "đồng đội ảo" kéo/thêm task, có avatar online + thông báo. Test bắt được lỗi a11y: thẻ của viewer bị đọc là "disabled".
  - PR #13 (merge sau #12): AI soạn task từ brief (mock theo luật, ghi rõ trên UI) + activity log. Thêm 2 endpoint vào contract dạng nháp để giai đoạn 3 review. Test 44/44.
- Còn lại của giai đoạn 2 (25/10): dữ liệu demo, kịch bản demo, pitch deck 6–8 slide, video 2 phút, tập thuyết trình 5 phút; mentor + 2–3 người xem.
- Tự chấm:

## Ngày 12 — CN 25/10/2026 · Giai đoạn 2, buổi cuối

- Dữ liệu demo: 3 dự án ở các giai đoạn khác nhau (Website redesign, Mobile app, Brand guidelines), mô tả cho task chính; viewer tên Hana Le.
- Video demo 100 giây (Playwright quay tự động, có con trỏ + chú thích), nhúng vào landing page ("Watch the demo"); WebM + MP4.
- Pitch deck 8 slide có speaker notes: https://claude.ai/artifact/AatZ6Tk9aQ8wCEM3Q6LcDC (cần Share trước khi gửi).
- Kịch bản demo 5 phút + câu hỏi khó + tin nhắn xin góp ý: `docs/business/02-demo-script.md` (+ `.vi.md`); bảng ghi góp ý `03-feedback.md`.
- Việc của mình: luyện pitch 60 s + demo 5 phút; gửi cho anh + 2–3 người; ghi góp ý. Gate giai đoạn 2 = góp ý xong, sửa điều ≥ 2 người nói, khóa UI.
- Tự chấm:

## Ngày 13 — T2 26/10/2026 · Giai đoạn 3, buổi 1

- C4 mức 1–2 + ERD cho toàn bộ v1 (bài mẫu), công khai trong taskflow `docs/architecture/` (PR); giải thích tiếng Việt + 5 câu phản biện: `docs/architecture/02-c4-erd.vi.md`.
- Quyết định chính: modular monolith (API + worker), WebSocket trong API + Redis pub/sub, transactional outbox, AI gọi đồng bộ có timeout + rate limit, Postgres là nguồn sự thật duy nhất.
- Tài liệu yêu cầu cập nhật theo PRD v1.3.
- Việc của mình: đọc, trả lời 2–3 câu phản biện; vẫn gom góp ý prototype.
- Tự chấm:

## Điều chỉnh plan — 17/10
- DSA tạm hoãn.
- Nộp CV + chỉnh CV/LinkedIn dời sang tuần 4 (từ 04/11). Scan job vẫn chạy hằng ngày.

## Điều chỉnh plan — 17/10 (lịch Ngày 5–8+)

Tính đến Ngày 4: còn nợ ~1,5 ngày khối lượng (nửa Ngày 3: C4, ERD, sequence, ADR-001/002, budget alert; gần trọn Ngày 4: prototype + deploy). Với nhịp ngày ngắn (ngày thường ~2 h) và "I do → we do → you do", phần nợ + hàng rào chất lượng dàn ra 7 buổi → backend bắt đầu 25/10 thay vì 19/10.

| Ngày | Mục tiêu chính | Ai viết |
| --- | --- | --- |
| CN 18/10 (4 h) | Khung prototype lên production: MSW, theme từ `tokens.json`, deploy Vercel | AI làm mẫu |
| T2 19/10 (2 h) | openapi-fetch + TanStack Query; màn Login / Signup / Onboarding | Nối dữ liệu: AI làm mẫu; màn: mình viết trước |
| T3 20/10 (2 h) | Today + Project list / task detail, UI xử lý 409 | Mình viết, AI review |
| T4 21/10 (2 h) | Members, trạng thái empty/loading/error, mobile → prototype xong | Mình viết, AI review |
| T5 22/10 (2 h) | C4 (mức 1–2) + ADR-001 (NestJS + Prisma) | AI làm mẫu |
| T6 23/10 (2 h) | Sequence "kéo thả realtime" + ADR-002 (hạ tầng) + AI phản biện thiết kế | Làm cùng |
| T7 24/10 (4 h) | Hàng rào chất lượng. **Chốt cắt scope** cho tuần 2–3 (ứng viên: thu gọn P2, bỏ đính kèm file / full-text search) | AI làm mẫu |
| CN 25/10 → | Backend TDD: auth → workspace/RBAC → task/409/move → realtime…; ERD vẽ cùng Prisma schema | AI làm mẫu → làm cùng |

Chen vào lúc nào cũng được: budget alert AWS (trước 28/10), SD URL shortener (một buổi cuối tuần). Giữ nhịp ngày ngắn; bù chậm bằng cắt scope, không kéo dài ngày học.

## Điều chỉnh plan — 19/10 (đổi vai ở phần màn hình)

Frontend là thế mạnh (7 năm), tự viết thêm màn hình không giúp lấp khoảng trống backend. Từ nay: **AI dựng các màn hình frontend, mình review như senior FE** (15–20 phút/lần, cũng là luyện review code AI). Giờ tự học dồn sang backend; backend kéo lên sớm 1 ngày.

| Ngày | Mục tiêu chính |
| --- | --- |
| T2 19/10 | AI dựng màn auth + onboarding; mình học lại toàn bộ phần backend đã có (contract, vòng đời request, authn/authz, 409, auth token) |
| T3 20/10 | AI dựng Today / Project / Members, mình review → prototype xong |
| T4 21/10 | C4 (mức 1–2) + ADR-001 |
| T5 22/10 | Sequence "kéo thả realtime" + ADR-002 + AI phản biện thiết kế |
| T6 23/10 | Hàng rào chất lượng |
| T7 24/10 | Backend TDD bắt đầu (auth). Chốt cắt scope tuần 2–3 |
| CN 25/10 → | Backend tiếp: workspace/RBAC → task/409/move → realtime… |

## Điều chỉnh plan — 22/10 (góp ý mentor: làm theo công đoạn)

Mentor: prototype còn đơn sơ; làm theo hướng business: bài toán → ý tưởng → present prototype → system design → code sau cùng; track hằng ngày, có trang status để show. Lịch mới: mục "Cập nhật 22/10" trong `docs/plan-4-tuan.md`.

Tóm tắt: GĐ1 bài toán + /status (22/10) → GĐ2 prototype "hoành tráng" + pitch (23–25/10) → GĐ3 system design (26–28/10) → GĐ4 code backend lõi (29/10–03/11) → tuần 4 phỏng vấn. Phần chưa kịp làm trước 04/11 không cắt mà xếp hàng ưu tiên (xem dòng dưới).
- Chốt (22/10): không cắt mà **xếp hàng ưu tiên** phần còn lại sau 03/11; hai điều kiện: chốt phạm vi + thiết kế trọn v1 từ đầu, khóa UI sau giai đoạn 2. Soạn tin nhắn gửi mentor xác nhận hướng.

