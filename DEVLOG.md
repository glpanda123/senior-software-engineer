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

