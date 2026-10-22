# Plan 4 tuần: Senior Software Engineer trong thời đại coding agent

Oct 13, 2026 · @Hoang Nguyen Duong · bản rút gọn từ plan 60 ngày

## Cập nhật 22/10: làm theo công đoạn, hướng business

Góp ý của mentor (22/10): prototype còn đơn sơ; phải làm **đúng công đoạn**: bài toán → ý tưởng → **present prototype** → system design → **viết code sau cùng**, không làm lắt nhắt mỗi thứ một ít rồi sửa. Và phải **track tiến độ hằng ngày**, có trang status công khai (kiểu status.claude.com) để show.

Phần này **thay cho lịch từ Ngày 9 trở đi** ở các bảng tuần bên dưới. Các bảng cũ giữ lại để tham khảo nội dung từng chủ đề.

### Nguyên tắc

1. **Mỗi giai đoạn có cổng (gate)**: chưa qua gate thì không sang giai đoạn sau. Không quay lại sửa giai đoạn trước, trừ khi gate sau phát hiện lỗi (ghi lý do vào DEVLOG).
2. **Mỗi giai đoạn trả lời một câu hỏi**: *có đáng làm không?* → *người dùng có muốn không?* → *xây thế nào?* → *xây cho chạy được*.
3. **Track hằng ngày**: cuối mỗi buổi cập nhật `DEVLOG.md` (riêng tư) và trang **/status** (công khai, chỉ thông tin trình bày được).
4. Vai trò giữ nguyên: frontend do AI dựng, mình review; chủ đề mới thì AI làm mẫu → làm cùng → mình tự làm.

### Giai đoạn và lịch

| Giai đoạn | Ngày | Mục tiêu chính | Output | Gate |
| --- | --- | --- | --- | --- |
| **1. Bài toán & ý tưởng** | T5 22/10 (2 h) | Vì sao TaskFlow đáng làm | Business brief 1 trang: vấn đề có bằng chứng, nhóm khách hàng, đối thủ, điểm khác biệt, mô hình kinh doanh giả định, chỉ số thành công, rủi ro. **Trang /status v1** | Nói được pitch 60 giây bằng tiếng Anh |
| **2. Prototype "hoành tráng" + present** | T6 23/10 (2 h) | Nâng cấp hình ảnh | Visual v2 (shadcn/ui, minh hoạ, chuyển động nhẹ) + **landing page** (vấn đề → giải pháp → "Try the demo") | |
| | T7 24/10 (4 h) | Tính năng "wow" chạy trên mock | **Board Kanban kéo thả** (có cách dùng bàn phím) · **realtime giả lập** (đồng đội ảo kéo task, avatar online, toast) · **AI soạn task từ đoạn văn** (mock) | |
| | CN 25/10 (4 h) | Present | Dữ liệu demo đẹp, kịch bản demo, **pitch deck 6–8 slide**, video demo 2 phút; mình tập thuyết trình 5 phút bằng tiếng Anh | Mentor + 2–3 người xem, góp ý ≥ 2 người trùng nhau thì sửa |
| **3. System design** | T2 26/10 (2 h) | Kiến trúc tổng thể | C4 mức 1–2 + ERD | |
| | T3 27/10 (2 h) | Luồng khó | Sequence: kéo thả realtime nhiều instance, AI soạn task; AI phản biện thiết kế | |
| | T4 28/10 (2 h) | Quyết định | ADR-001 (NestJS + Prisma), ADR-002 (hạ tầng); cập nhật contract cho tính năng mới (AI draft, sự kiện realtime) | Design review: tự trình bày 10 phút không cần đọc |
| **4. Code** | T5 29/10 | Hàng rào chất lượng | Lint/hook/CI chặn agent "phá rào" | |
| | T6 30/10 → T3 03/11 | Backend TDD lõi | Auth → workspace/RBAC + test cách ly tenant → task/409/move → realtime (Redis pub/sub) → nối FE, tắt MSW từng phần, deploy API | Màn chính chạy API thật trên production |
| **5. Tuần 4** | 04/11 → 10/11 | Phỏng vấn | Nộp 1–2 đơn/ngày, mock interview, STAR; backend làm tiếp nhẹ (AI draft gọi LLM thật) | |

### Phạm vi: xếp hàng ưu tiên, không cắt (chốt 22/10)

Backend bắt đầu 29/10. Không xoá phần nào của plan cũ; phần chưa kịp làm trước 04/11 được **xếp hàng ưu tiên**, làm tiếp song song với nộp đơn:

1. Redis: cache, rate limit login, BullMQ gửi email mời, outbox (~3 buổi)
2. AI soạn task gọi LLM thật + eval trong CI (~3 buổi)
3. P2 rút gọn: MCP tự viết + 1 skill (~4 buổi)
4. Deploy AWS đơn giản → Terraform (~4 buổi)
5. Nếu còn thời gian: bảo mật + mutation test, P2 phần còn lại, P3

**Hai điều kiện để không làm lắt nhắt:**

1. **Chốt phạm vi và thiết kế trọn vẹn từ đầu.** Giai đoạn 1 chốt **phạm vi v1** và **roadmap v1.1**. Giai đoạn 3 thiết kế **toàn bộ v1**, kể cả phần code sau 03/11 (Redis/hàng đợi, AI thật, deploy). Sau đó chỉ code theo thiết kế, không quay lại thiết kế. Thứ ngoài v1 (đính kèm file, full-text search…) nằm trong roadmap, không làm.
2. **Khóa UI sau giai đoạn 2.** Prototype có sẵn giao diện mọi tính năng v1; code backend chỉ thay mock bằng API thật. Ý tưởng mới giữa chừng ghi vào backlog v1.1.

Mục tiêu thời gian của toàn bộ hàng đợi: ~31 buổi (~3,5 tuần ở nhịp hiện tại) nếu làm hết.

### Trang /status

- Địa chỉ: `/status` trên prototype (https://taskflow-blond-gamma.vercel.app/status).
- Hiển thị: % hoàn thành từng giai đoạn và tổng, giai đoạn hiện tại, việc hôm nay, nhật ký ngắn các ngày gần nhất, link repo / prototype / tài liệu.
- Dữ liệu: file `progress.json` trong repo taskflow (công khai), cập nhật cuối mỗi buổi. Không đưa job tracker, tự chấm hay ghi chú cá nhân lên đó.

## Mục tiêu

Trong 28 ngày (Thứ Tư 14/10 – Thứ Ba 10/11/2026), tự học cường độ cao để chuyển từ **Senior React Developer** thành **Senior Software Engineer** (JS/TS, ứng dụng AI).

Điểm xuất phát đã là senior ở frontend. Plan này không nhằm chứng minh một người làm được mọi việc của cả squad. Nó nhằm nâng các mảng còn ở mức "đã làm, chưa sâu" (backend, database, system design, hạ tầng, vận hành, cách làm việc với coding agent) lên cùng tầm với frontend. Kết quả mong muốn: hiểu đủ sâu để ra quyết định, giải thích trade-off, debug khi hỏng và hướng dẫn được người khác ở mọi tầng của hệ thống.

Ba mock project là nơi học qua thực chiến. Mỗi project là sân tập để luyện kỹ năng dùng coding agent, đồng thời đào sâu một mảng năng lực:

| Project | Thời gian | Mảng năng lực senior | Kỹ năng coding agent luyện được |
| --- | --- | --- | --- |
| P1 TaskFlow: multi-tenant SaaS | Tuần 1 – giữa tuần 3 | Product → UI/UX → system design → backend → database → realtime → deploy → vận hành | Agent làm feature theo TDD sau hàng rào chất lượng; chuyển mockup sang code qua MCP |
| P2 TaskFlow AI Dev Kit | Lớn dần từ tuần 1, hoàn thiện cuối tuần 3 | Thiết kế quy trình và công cụ cho cả team, kiểm soát chất lượng, bảo mật | CLAUDE.md, rule, skill, hook, subagent, MCP tự viết, agent trong CI, plugin, agent loop tự viết |
| P3 Job Hunt kit | Tuần 4 | Đi nhanh từ idea đến công cụ dùng thật, thiết kế deterministic + LLM | Dùng chính plugin P2 để build nhanh; skill + MCP dùng hằng ngày cho việc săn job |

Output của project (repo, ADR, postmortem, số đo) là sản phẩm phụ của việc học. Nó giúp bạn kể lại khi phỏng vấn bằng kinh nghiệm thật, không phải là mục tiêu tự thân.

Nộp đơn chạy song song từ Ngày 3. Mục tiêu có offer trước 12/12/2026 giữ nguyên; 4 tuần này là giai đoạn chuẩn bị, phỏng vấn thật sẽ rơi vào tuần 3 trở đi.

## Review plan 60 ngày cũ

Giữ nguyên: 3 mock project cùng scope và acceptance gốc; stack (Next.js + NestJS + PostgreSQL + Prisma + Redis + Docker + AWS); Claude Code là công cụ chính; `AI_WORKFLOW.md`; gate cuối mỗi giai đoạn; mock full loop với Claude; quy tắc "phỏng vấn thật thì bỏ plan ngày đó".

Thay đổi để vừa 4 tuần và đúng mục tiêu:

| Vấn đề của plan cũ | Hệ quả | Bản 4 tuần xử lý thế nào |
| --- | --- | --- |
| 14 ngày học BE core trước, project bắt đầu từ Ngày 16 | Thời gian học không để lại output; 4 tuần không còn chỗ cho giai đoạn học riêng | Học just-in-time ngay trong P1: mỗi chủ đề lý thuyết (event loop, index, transaction, auth, Redis…) gắn với tính năng P1 làm trong ngày đó |
| Không có bước mockup/UX, bắt đầu từ backend | Không kiểm chứng ý tưởng trước khi build | P1 đi theo idea → mockup UI + system design bằng công cụ AI → prototype web ship được → backend |
| Testing là 1 ngày riêng; guardrail cho agent chỉ có 2 hook, đến Ngày 36 mới có | Agent có thể sửa test cho xanh, tắt lint, `--no-verify`; không chắc hiểu code agent sinh ra | Hàng rào chất lượng 6 lớp dựng ở Ngày 5, trước dòng backend đầu tiên; backend P1 theo TDD; JSDoc bắt buộc |
| P2 bắt đầu sau khi P1 xong | P1 được build mà chưa có kit, không đo được kit giúp gì | P2 lớn dần song song với P1 từ tuần 1 (hook, CLAUDE.md, `test-writer`), tuần 3 hoàn thiện phần còn lại |
| Deploy ở Ngày 25/60 | Rủi ro hạ tầng dồn cuối, ít thời gian vận hành | P1 có URL production từ Ngày 4 (prototype), mỗi ngày build kết thúc bằng một lần deploy |
| P3 ở Ngày 46–47, ngay trước khi kết thúc | Ít thời gian dùng thật | P3 build ở Ngày 22–23 bằng plugin P2, rồi dùng cho JD thật đến hết tuần 4 |
| DSA 1 bài/ngày | Tốn ~25% thời gian | 3 bài/tuần, nói to bằng tiếng Anh; tăng lại nếu target công ty nặng DSA |

Chủ đề của plan cũ được nén chứ không bỏ: system design nâng cao (Ngày 49–50 cũ) và FE deep (Ngày 43–45 cũ) dồn vào tuần 4. Bản 60 ngày gốc vẫn lưu để tham khảo chi tiết.

## Khoảng cách cần bù: từ Senior React Developer đến Senior Software Engineer

Frontend là điểm mạnh nên chỉ cần giữ nhịp; thời gian dồn cho các mảng còn thiếu độ sâu.

| Mảng | Hiện trạng | Mức cần đạt sau 4 tuần | Học qua đâu trong plan |
| --- | --- | --- | --- |
| Frontend (React, Next.js) | Senior | Giữ nhịp; tận dụng để làm nhanh phần UI và dành thời gian cho phần khác | P1 Ngày 1–4, ôn nhanh Ngày 24 |
| Product → UI/UX → prototype với công cụ AI | Đã quen phía FE | Đi nhanh từ idea qua mockup đến prototype bằng công cụ AI, có kiểm chứng người dùng | P1 Ngày 1–4 |
| Backend (Node.js, NestJS, API design) | Đã làm, chưa sâu | Hiểu runtime, thiết kế API, auth, phân quyền, xử lý bất đồng bộ đến mức giải thích được trade-off và debug được | P1 Ngày 6–14 |
| Database (PostgreSQL) | Chưa sâu | Thiết kế schema, index, transaction, isolation, lock; đọc được `EXPLAIN ANALYZE` | P1 Ngày 7–9, 16 |
| System design | Chưa sâu | Tự dẫn một buổi system design 45 phút, nói rõ trade-off và điểm lỗi | P1 Ngày 3, mỗi cuối tuần, Ngày 26 |
| Chất lượng phần mềm (TDD, test design, convention) | Có test FE | Thiết kế test trước, dựng hàng rào chất lượng cho cả repo | Ngày 5 trở đi, P2 |
| Hạ tầng, deploy, vận hành | Chưa sâu | Tự deploy lên AWS bằng IaC, đặt SLO, xử lý sự cố, viết postmortem | P1 Ngày 4, 15–17 |
| Làm việc với coding agent | Đang dùng | Hiểu cơ chế bên trong, cấu hình agent cho cả team, kiểm soát được chất lượng và bảo mật | P2, áp dụng xuyên suốt P1 và P3 |

### Tự đánh giá độ sâu

Cuối mỗi tuần, tự chấm từng chủ đề đã học theo 4 mức. Senior cần đạt mức 3 trở lên ở các chủ đề lõi backend, database và system design.

| Mức | Nghĩa là |
| --- | --- |
| 1. Dùng được | Làm theo hướng dẫn hoặc để agent làm, chạy được |
| 2. Giải thích được | Nói được nó hoạt động thế nào và vì sao chọn nó thay vì phương án khác |
| 3. Xử lý được khi hỏng | Debug được khi lỗi, biết điểm yếu và giới hạn của nó |
| 4. Dạy lại được | Giải thích cho người khác, review được code người khác (hoặc agent) viết về chủ đề đó |

Ghi điểm tự chấm vào `DEVLOG.md`. Chủ đề nào dưới mức 3 thì đưa vào phần ôn của tuần sau hoặc Ngày 27.

## Chiến lược

1. **Mock project là sân tập thực chiến.** Mỗi chủ đề đi theo vòng: gặp vấn đề thật trong project → học đến khi giải thích được và xử lý được khi hỏng (mức 3) → áp vào code/hạ tầng → đo kết quả → ghi lại và tự chấm. Ví dụ: `GET tasks` chậm khi seed 100k dòng → học `EXPLAIN ANALYZE` và composite index → thêm index → đo p95 trước/sau → ghi vào README và `DEVLOG.md`.
2. **Design trước, code sau, nhưng nhanh.** P1 Ngày 1–3 dựng mockup UI/UX và mockup system design bằng công cụ AI, test với người dùng. UI đạt tiêu chí chấp nhận thì Ngày 4 chuyển thành prototype web chạy trên production với API giả theo OpenAPI contract.
3. **Hàng rào trước, backend sau.** Ngày 5 dựng toàn bộ hàng rào chất lượng. Chưa có hàng rào thì không cho agent viết backend.
4. **Backend theo TDD.** Thiết kế test → viết test đỏ (bạn duyệt) → khóa test → agent implement cho xanh → refactor → deploy. Test là spec; agent không được sửa spec.
5. **Agent là đồng đội, bạn là tech lead, nhưng không để agent học thay.** Bạn duyệt plan, duyệt test, đọc diff kèm JSDoc trước khi merge. Với chủ đề đang học trong ngày (ví dụ refresh token rotation, optimistic lock, Redis adapter), tự viết phần lõi hoặc tự thiết kế trước rồi mới so với cách agent làm; phải giải thích được từng dòng trước khi merge.
6. **Ba project nối với nhau.** P2 dựng trên repo P1 và được đo bằng chính việc làm P1. P3 được build bằng plugin của P2. Mỗi project là input cho project sau.
7. **Làm như trong team.** Mọi thay đổi đi qua issue → branch → PR → review → merge, kể cả khi làm một mình với agent. Bug vào GitHub Issues có nhãn mức độ; mỗi release có changelog.
8. **Không giấu chỗ sai.** Quyết định sai, lần agent làm hỏng, lần rollback đều ghi vào `DEVLOG.md` kèm bài học. Đây là nguồn chất liệu cho câu chuyện STAR ở tuần 4.

## Nhịp học

| Khung | Ngày thường (~3,5h) | Cuối tuần (~6h) |
| --- | --- | --- |
| 15 phút đầu ngày | Scan job, nộp 1–2 đơn (từ Ngày 3), cập nhật tracker | Như ngày thường + review pipeline ứng tuyển |
| Block 1 | 30 phút: DSA hoặc 1 câu hỏi lý thuyết, nói to bằng tiếng Anh (theo cột Block 1 của từng ngày) | 1,5h system design: 1 đề, vẽ cùng AI rồi tự phản biện, nói to |
| Block 2 | 2h build: 1 tính năng từ spec đến prod | 3h build |
| Block 3 | 30 phút tiếng Anh: 1 câu chuyện hoặc giải thích 1 quyết định trong 2 phút, ghi âm, nghe lại | 1h mock interview với Claude |
| Cuối ngày | 10 phút `DEVLOG.md` + kiểm tra dashboard prod | 30 phút retro tuần, chỉnh plan tuần sau |

Tổng: khoảng 118 giờ (20 ngày thường × 3,5h + 8 ngày cuối tuần × 6h). Ba project trong 118 giờ chỉ khả thi khi coding agent gánh phần lớn việc viết code; đó cũng chính là năng lực plan muốn chứng minh. Ngày nào không kịp thì xem mục "Khi bị chậm".

Ngân sách: đặt AWS Budget alert và giới hạn chi tiêu API LLM ngay Ngày 3, trước khi tạo tài nguyên.

## Tuần 1 (14/10 – 20/10): P1 idea → mockup → prototype → hàng rào → backend TDD

Gate 1 (Ngày 7):
- Mockup TaskFlow đạt tiêu chí chấp nhận UI và đã test với 3 người.
- Sơ đồ system design (C4 container, sequence, ERD) + ADR-001, ADR-002 + OpenAPI contract.
- Prototype web chạy trên HTTPS với API giả; merge vào `main` là tự deploy.
- Hàng rào chất lượng chạy thật, có bằng chứng: commit thiếu JSDoc bị chặn; `git commit --no-verify` của agent bị hook chặn; PR vi phạm bị CI chặn.
- Auth + workspace + RBAC làm theo TDD; test e2e chứng minh user workspace A không đọc được dữ liệu workspace B.
- CV mới và ≥ 5 đơn đã nộp.

| Ngày | Thứ, ngày | Build (output) | Lý thuyết gắn kèm | Block 1 |
| --- | --- | --- | --- | --- |
| 1 | T4 14/10 | P1 discovery: PRD 1 trang (vấn đề, người dùng, non-goals, chỉ số thành công); user flow; wireframe low-fi: cho AI sinh 3 phương án bố cục board/task (Claude artifact hoặc v0), chọn 1 | Jobs-to-be-done, user flow, đủ trạng thái màn hình (empty, loading, error, success) | DSA: arrays & hashing |
| 2 | T5 15/10 | Mockup hi-fi trong Figma hoặc Penpot, điều khiển từ Claude Code qua MCP: design token, màn login, workspace + thành viên, board, task detail, bản mobile. Viết tiêu chí chấp nhận UI, test click-through với 3 người, sửa 1 vòng | Design system, token, WCAG AA | Lý thuyết: Node event loop, microtask vs macrotask, libuv thread pool |
| 3 | T6 16/10 | Mockup system design cùng AI: C4, ERD (theo data model P1), sequence cho "kéo thả task realtime" và "upload file qua presigned URL"; bắt AI đóng vai reviewer tấn công thiết kế rồi sửa. OpenAPI contract. Monorepo pnpm + Turborepo. ADR-001 NestJS + Prisma, ADR-002 hạ tầng. Đặt budget alert. Bắt đầu nộp đơn | Khung system design 7 bước; load balancer, scale ngang, CAP | DSA: two pointers |
| 4 | T7 17/10 | Mockup → prototype ship được: Next.js App Router + shadcn/ui theo token, chuyển từ Figma/Penpot sang code qua MCP; API giả bằng MSW sinh từ OpenAPI; Sentry cho web; deploy lên domain thật (VM + Caddy), GitHub Actions tự deploy. Gửi link cho 3 người dùng thử. Cập nhật CV tiếng Anh + LinkedIn | Server vs Client Component; contract-first: FE và BE làm song song trên cùng một contract | SD: URL shortener |
| 5 | CN 18/10 | Dựng hàng rào chất lượng 6 lớp (mục dưới) + CLAUDE.md + rule đầu tiên của P2. Viết `tools/guardrail-tests/` thử từng cách phá | Shift-left; vì sao gate local chỉ để nhanh, CI mới là nguồn sự thật; vì sao luật bắt buộc phải nằm ở hook chứ không ở CLAUDE.md | SD: Rate limiter. Mock: "Tell me about yourself" |
| 6 | T2 19/10 | Backend TDD 1: NestJS + Postgres + Prisma migration trong CI; tạo subagent `test-writer` (P2); test design cho auth; auth register/login/refresh/logout, hash argon2, rotate refresh token, phát hiện reuse thì thu hồi cả chuỗi; pino log + request id | NestJS core: module, DI, provider scope, pipe, guard, interceptor, exception filter; session vs JWT; OAuth2/OIDC | DSA: sliding window |
| 7 | T3 20/10 | Backend TDD 2: workspace (tenant), membership, RBAC 4 role (owner, admin, member, viewer), mời thành viên; test cách ly tenant viết trước, rồi Postgres RLS hoặc lọc bắt buộc theo `workspace_id`; nối màn login + workspace từ MSW sang API thật. Kiểm tra Gate 1 | RBAC/ABAC, multi-tenancy (cột tenantId, RLS); chuẩn hóa, constraint | Lý thuyết: TypeScript generics, discriminated union, zod |

Tiếng Anh tuần 1: Tell me about yourself; vì sao rời công ty cũ (kể trung tính); vì sao dựng hàng rào chất lượng trước khi cho agent viết backend.

## Tuần 2 (21/10 – 27/10): P1 tính năng lõi, realtime, AI

Gate 2 (Ngày 14): toàn bộ scope P1 chạy trên prod, không còn màn nào dùng MSW; mọi tính năng có tài liệu test design và test viết trước; hai tab cùng sửa 1 task thì tab sau nhận 409; 2 instance API vẫn đẩy event realtime tới đủ client; coverage ≥ 80% ở `apps/api`, mutation score ≥ 70% ở module lõi (RBAC policy, fractional indexing); eval cho tính năng AI đạt ngưỡng tự đặt; ≥ 12 đơn đã nộp.

Từ tuần này, mọi tính năng backend đi theo vòng TDD. Một tính năng tính là xong khi qua đủ gate, đã deploy và màn tương ứng trên prototype đã nối API thật.

| Ngày | Thứ, ngày | Build (output lên prod) | Lý thuyết gắn kèm | Block 1 |
| --- | --- | --- | --- | --- |
| 8 | T4 21/10 | Project + task CRUD (status, assignee, priority, due date, label), comment; cursor pagination, filter; activity log ghi trong cùng transaction; client và API dùng chung type sinh từ OpenAPI + contract test | REST: cursor vs offset, idempotency key, versioning, error format RFC 7807 | DSA: stack |
| 9 | T5 22/10 | `PATCH /tasks/:id` kèm `version` → 409 khi xung đột; `POST /tasks/:id/move` với fractional indexing (`beforeId`, `afterId`); kéo thả trên UI với optimistic update + rollback khi lỗi | Transaction, isolation level, optimistic vs pessimistic lock, deadlock | Lý thuyết: index B-tree/composite/partial, `EXPLAIN ANALYZE`, N+1 |
| 10 | T6 23/10 | Realtime: WebSocket gateway trong NestJS, room theo project, Redis adapter; test e2e chạy 2 instance API | Scale WebSocket, sticky session vs pub/sub | DSA: binary search |
| 11 | T7 24/10 | Redis: cache-aside cho `GET task`, rate limit endpoint login (token bucket); BullMQ gửi email mời thành viên, retry/backoff, idempotent consumer, outbox pattern | Cache invalidation, TTL, distributed lock; khái niệm Kafka | SD: Notification system |
| 12 | CN 25/10 | Đính kèm file: S3 presigned URL + job tạo thumbnail; tìm task bằng Postgres full-text search; e2e Playwright cho luồng chính | Presigned URL vs upload qua API; FTS vs Elasticsearch | SD: Chat system. Mock: Node/BE Q&A |
| 13 | T2 26/10 | Tính năng AI: gõ mô tả tự do → LLM tách thành danh sách task có cấu trúc (structured output, validate bằng zod); rate limit riêng; eval golden set 20 mô tả, chạy trong CI khi đổi prompt; ghi cost và latency mỗi request; ADR-003 | Thiết kế tính năng LLM: validate output, eval, chi phí token | DSA: linked list |
| 14 | T3 27/10 | Security: OWASP API Top 10, injection, CORS, CSRF, helmet, quản lý secret; mutation test (Stryker) cho module lõi. Mời vài người dùng thật (nhóm bạn dùng TaskFlow quản lý việc chung). Kiểm tra Gate 2 | Threat model cho multi-tenant SaaS | Lý thuyết: Redis data structures, pub/sub |

Tiếng Anh tuần 2: giải thích kiến trúc TaskFlow trong 3 phút; một trade-off kỹ thuật (fractional indexing vs cập nhật cả list); một lần agent cố vượt rào và gate chặn được.

## Tuần 3 (28/10 – 03/11): P1 deploy + vận hành, P2 hoàn thiện

Gate 3 (Ngày 21):
- P1: hạ tầng codify bằng Terraform; CI/CD lint, typecheck, test, build, deploy tự động khi merge; dashboard + SLO + alert; báo cáo k6 trước/sau; rollback và restore backup đã thử; 1 diễn tập sự cố có postmortem; README có sơ đồ kiến trúc, ≥ 3 ADR, `AI_WORKFLOW.md`.
- P2: AI Dev Kit chạy thật gồm CLAUDE.md, rule, 3 skill, 1 MCP server tự viết, 2 hook, 2 subagent, agent review PR trong CI, plugin dùng chung, agent loop tự viết; kịch bản demo chạy được từ issue đến PR.

| Ngày | Thứ, ngày | Build (output) | Lý thuyết gắn kèm | Block 1 |
| --- | --- | --- | --- | --- |
| 15 | T4 28/10 | P1 hạ tầng: Docker multi-stage, non-root, healthcheck; Terraform cho bản chuẩn (ALB, ECS Fargate api/web, RDS, ElastiCache, S3) hoặc bản tiết kiệm (1 EC2 + docker compose + Caddy), secret trong SSM Parameter Store; ADR ghi trade-off giữa 2 bản | VPC, subnet public/private, security group, IAM role; ECS Fargate vs EC2 | DSA: trees BFS/DFS |
| 16 | T5 29/10 | P1 observability + hiệu năng: pino, OpenTelemetry tracing, Sentry, metrics; dashboard + 2 SLO + alert theo burn rate; k6 `GET tasks` với 100k task, mục tiêu p95 < 200 ms, fix 1 bottleneck, ghi số đo thật | SLI/SLO/error budget; connection pool, read replica khi nào cần | Lý thuyết: câu hỏi Node.js hay gặp |
| 17 | T6 30/10 | P1 release + sự cố: feature flag, migration expand/contract, thử rollback image cũ, backup + restore đo RTO; diễn tập sự cố (tự gây lỗi, phát hiện qua alert, xử lý theo runbook) và viết postmortem blameless | Zero-downtime deploy, RPO/RTO; quy trình incident | DSA: graph |
| 18 | T7 31/10 | P2: agent loop tự viết ~100 dòng TS trong `packages/mini-agent` (tool `read_file`, `write_file`, `run_tests`); hoàn thiện skill `new-endpoint`, `db-migration`, `pr-review` (+ `tdd-feature`); rule theo `paths` | Agent loop: model gọi tool, nhận kết quả, lặp lại; context window; SKILL.md nạp khi cần | SD: hệ thống chạy coding agent cho cả team (quota, audit log, secret) |
| 19 | CN 01/11 | P2 MCP: gắn MCP có sẵn (GitHub, Postgres với user chỉ đọc); tự viết `packages/mcp-taskflow` bằng TypeScript SDK với tool `list_tasks`, `create_task`, `get_error_logs`, validate bằng zod, transport HTTP + token, test bằng MCP Inspector, mặc định chỉ đọc, quyền ghi phải bật rõ | MCP host/client/server; tool/resource/prompt; stdio vs HTTP; prompt injection qua output tool; quyền tối thiểu | Mock: "How do you use AI at work?" |
| 20 | T2 02/11 | P2: subagent `reviewer` (soát diff theo convention + JSDoc) cùng `test-writer` đã có; chạy nhiều agent song song bằng git worktree; agent review PR headless trong `.github/workflows/ai-review.yml` có giới hạn quyền và chi phí; đóng gói skill + hook + subagent + MCP + cấu hình hàng rào thành plugin dùng chung, README onboard | Khi nào dùng subagent; bảo mật agent trong CI | DSA: heap |
| 21 | T3 03/11 | P2 đo hiệu quả: bảng thời gian 3 feature có/không agent, số lần sửa output, số lần mỗi lớp hàng rào chặn agent; chạy kịch bản demo issue → PR; kiểm tra "người mới clone repo làm được feature đầu tiên". Cheat sheet AI workflow. Kiểm tra Gate 3 | Skill vs CLAUDE.md vs hook; MCP vs gọi API trực tiếp | — |

Tiếng Anh tuần 3: kể workflow AI hằng ngày trong 3 phút; kể sự cố đã diễn tập; cách giữ an toàn khi cho agent truy cập DB và GitHub.

## Tuần 4 (04/11 – 10/11): P3 + interview intensive

Gate 4 (Ngày 28): P3 đạt acceptance và đã dùng cho ≥ 10 JD thật; 4 mock full loop có log feedback; 8 câu chuyện STAR bằng tiếng Anh gắn với bằng chứng; README cho cả 3 project; 3 cheat sheet; kịch bản deal lương. Nếu trùng lịch phỏng vấn thật, ngày đó bỏ plan và chuẩn bị riêng cho công ty đó.

| Ngày | Thứ, ngày | Chủ đề chính | Output cuối ngày | Block 1 |
| --- | --- | --- | --- | --- |
| 22 | T4 04/11 | P3 ngày 1, build bằng plugin P2 và theo vòng TDD: MCP server `job-tracker` (SQLite; `save_job`, `list_jobs`, `update_status`), schema trích JD, `scripts/score.ts` + hàm chuẩn hóa tên skill | Chạy được trong Claude Code; ghi thời gian vào `AI_WORKFLOW.md` | DSA: intervals |
| 23 | T5 05/11 | P3 ngày 2: skill `jd-match` (trích JD, chạy `score.ts`, viết gap, cách bù, 10 câu hỏi dự kiến gắn STAR), đóng gói plugin, cài thử trên máy khác. Bắt đầu dùng cho mọi JD đang nộp. Mock full loop 1 | Plugin P3 + README cài đặt + log feedback | DSA: DP 1D |
| 24 | T6 06/11 | README cho 3 project (mục "Output dùng khi phỏng vấn"); bộ 8 câu chuyện STAR từ `DEVLOG.md` và kinh nghiệm 5 năm | README + STAR | Lý thuyết FE: rendering, reconciliation, useEffect, Suspense, RSC, caching Next.js, Core Web Vitals |
| 25 | T7 07/11 | Live build với AI được phép: đề 60 phút "thêm tính năng X vào codebase lạ", vừa làm vừa nói tiếng Anh: hỏi làm rõ, viết test trước, ra lệnh cho agent, đọc diff, chạy gate. Mock full loop 2 | Repo bài tập + ghi chú tự chấm | SD: FE system design (autocomplete, infinite feed) |
| 26 | CN 08/11 | System design nâng cao: replication, read replica, sharding, CQRS, event sourcing, modular monolith vs microservices, API gateway, saga, idempotency xuyên service; đề "AI customer support system". Tìm hiểu mặt bằng lương, viết kịch bản deal | Template SD 1 trang + ADR mẫu tách service + script deal lương | Mock: system design 45 phút + role-play deal lương |
| 27 | T2 09/11 | Ôn điểm yếu từ log feedback. Cheat sheet BE (Node, Postgres, Redis, auth) và vận hành + chất lượng (SLO, incident, deploy, TDD, hàng rào). Mock full loop 3 | 2 cheat sheet + danh sách điểm yếu đã xử lý | DSA: ôn bài sai |
| 28 | T3 10/11 | Mock full loop 4 (bản cuối). Retro 4 tuần, cập nhật CV/portfolio, lên plan giai đoạn phỏng vấn đến 12/12 | Plan tiếp theo | — |

Một mock full loop với Claude (90 phút, toàn bộ tiếng Anh): 10 phút giới thiệu, 25 phút coding hoặc live build có AI, 30 phút system design, 15 phút behavioral, 10 phút "deep dive project" (Claude đóng vai interviewer đào sâu vào TaskFlow hoặc AI Dev Kit), 5 phút bạn hỏi ngược. Cuối buổi Claude chấm theo rubric: giao tiếp, phán đoán kỹ thuật, độ sâu, tín hiệu senior.

## Từ idea đến prototype: công cụ và tiêu chí

Áp dụng cho P1 (và mọi project có UI sau này). Chọn 1–2 công cụ mỗi bước và dùng thành thạo, không thử hết.

| Bước | Công cụ AI gợi ý | Output | Xong khi |
| --- | --- | --- | --- |
| Wireframe low-fi | Claude (artifact HTML), v0 | 3 phương án bố cục cho màn chính | Đã chọn 1 phương án và ghi lý do |
| Mockup hi-fi | Figma (Figma Make, Figma MCP) hoặc Penpot (Penpot MCP) điều khiển từ Claude Code | Token + các màn chính + mobile + đủ trạng thái | Đạt tiêu chí chấp nhận UI bên dưới |
| Mockup system design | Mermaid trong repo (diff được, review được), FigJam AI hoặc Excalidraw để trình bày | C4 context/container, sequence, ERD trong `docs/architecture/` | AI đóng vai reviewer không tìm thêm được điểm lỗi nghiêm trọng nào chưa có phương án |
| Prototype web | Claude Code + Figma/Penpot MCP → Next.js + shadcn/ui; MSW sinh từ OpenAPI | URL public dùng thử được | Người dùng làm hết luồng chính không cần bạn hướng dẫn |

Tiêu chí chấp nhận UI (UI đạt thì mới chuyển sang prototype):

- [ ] Luồng chính (tạo workspace → tạo project → tạo và kéo thả task) không cần hướng dẫn
- [ ] Mỗi màn có đủ trạng thái empty, loading, error, success
- [ ] Contrast đạt WCAG AA, mọi input có label, dùng được bằng bàn phím
- [ ] Chạy đúng ở chiều rộng 375px
- [ ] 3 người dùng thử mockup; vấn đề ≥ 2/3 người gặp đã được sửa

Mockup là nguồn sự thật cho UI: thay đổi giao diện lớn thì sửa mockup trước, rồi mới sửa code.

## Hàng rào chất lượng: để AI không phá rào

Dựng ở Ngày 5 trong repo P1, là phần lõi của P2, và được đóng gói vào plugin P2 để P3 dùng lại.

Nguyên tắc: hướng dẫn (CLAUDE.md, rule, skill) agent có thể bỏ qua; hàng rào (hook, git hook, CI, branch protection) thì không. Mọi luật bắt buộc phải có ít nhất một lớp hàng rào thực thi, và CI là lớp cuối cùng không thể bỏ qua từ máy local ([nguồn](https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more)).

### 6 lớp

| Lớp | Công cụ | Chạy gì | Chặn được gì |
| --- | --- | --- | --- |
| 1. Agent | Hook trong `.claude/settings.json` | `PostToolUse`: ESLint + typecheck file vừa sửa, trả lỗi về cho agent. `PreToolUse` (exit code 2): chặn `--no-verify`, `-n`, `HUSKY=0`, `LEFTHOOK=0`, `git push --force`, `rm -rf`; chặn sửa file cấu hình hàng rào; chặn sửa file test khi đang ở pha implement | Agent tự tắt gate, sửa test cho xanh, phá repo |
| 2. Pre-commit | lefthook + lint-staged | Prettier, ESLint (có JSDoc), typecheck các package bị đổi, commitlint, gitleaks quét secret | Code sai convention, thiếu doc, commit message sai, lộ secret |
| 3. Pre-push | lefthook | Typecheck toàn repo, unit + integration test, coverage threshold, build, script kiểm tra "src đổi thì test phải đổi" | Push code chưa test, làm giảm coverage |
| 4. CI | GitHub Actions | Chạy lại toàn bộ lớp 2 và 3 + e2e Playwright + eval LLM + mutation test (module lõi) + TypeDoc với warning là lỗi + audit dependency + `tools/guardrail-tests/` | Mọi thứ bị bỏ qua ở local; đây là nguồn sự thật |
| 5. Branch protection | GitHub | Bắt buộc PR, bắt buộc CI xanh, cấm force push vào `main`, CODEOWNERS cho file cấu hình hàng rào | Merge thẳng, merge khi đỏ, sửa luật lén |
| 6. Review | Bạn + subagent `reviewer` + agent review trong CI | Đọc diff kèm JSDoc, kiểm tra doc khớp code, kiểm tra test thật sự kiểm đúng hành vi | Code đúng luật nhưng sai ý đồ |

File cấu hình hàng rào được bảo vệ (lớp 1 chặn agent sửa, lớp 5 yêu cầu review): `eslint.config.*`, `tsconfig*.json`, `lefthook.yml`, `commitlint.config.*`, `.github/workflows/**`, `.claude/settings.json`, `stryker.config.*`, ngưỡng coverage.

### Coding convention bắt buộc

| Luật | Thực thi bằng | Lý do |
| --- | --- | --- |
| JSDoc/TSDoc cho mọi class, method, property, interface, type export và function export: có mô tả, `@param`, `@returns`, `@throws` | `eslint-plugin-jsdoc` (`require-jsdoc` với contexts class/method/property/interface, `require-description`, `require-param`, `require-returns`, `require-throws`, `informative-docs`); TypeDoc trong CI | Đọc doc là hiểu ngay agent định làm gì; `informative-docs` chặn kiểu doc chỉ lặp lại tên hàm mà agent hay sinh |
| Doc mô tả hợp đồng và lý do (vì sao, điều kiện trước/sau, lỗi có thể ném), không kể lại code | Review lớp 6 | Doc kể lại code thì không giúp bạn phát hiện code sai ý đồ |
| TypeScript `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` | `tsconfig` | Bắt lỗi agent hay mắc với null và index |
| Cấm `any`, cấm `@ts-ignore`; `@ts-expect-error` và `eslint-disable` phải có mô tả lý do | `typescript-eslint` strict-type-checked, `ban-ts-comment`, `eslint-comments/require-description` | Agent hay tắt lỗi thay vì sửa |
| Cấm `.only`, `.skip` trong test | `eslint-plugin-jest` hoặc `vitest` rule | Agent hay skip test đỏ |
| Giới hạn độ phức tạp: cyclomatic ≤ 10, hàm ≤ 50 dòng, file ≤ 300 dòng | ESLint `complexity`, `max-lines-per-function`, `max-lines` | Code nhỏ thì đọc và review được |
| Input từ ngoài (HTTP, queue, output LLM) phải validate bằng zod | Rule trong `.claude/rules/` + test | Không tin dữ liệu, kể cả do LLM trả về |
| Migration chỉ được thêm, không sửa | Rule + script CI so sánh migration đã merge | Tránh lệch schema giữa các môi trường |
| Conventional Commits; commit `feat:`/`fix:` phải có test đi kèm hoặc commit `test:` trước đó | commitlint + script pre-push | Git history kể lại được quy trình TDD |

### Vòng TDD với agent (mỗi tính năng backend)

1. **Test design** (bạn chủ trì, AI gợi ý thêm case): `docs/test-design/<feature>.md` liệt kê case từ acceptance criteria: happy path, biên, lỗi, bảo mật (cách ly tenant, phân quyền), xung đột ghi đồng thời, idempotency, hiệu năng nếu cần.
2. **Red**: subagent `test-writer` viết test theo tài liệu. Bạn duyệt từng test như duyệt spec. Commit `test(<scope>): ...`.
3. **Khóa test**: bật cờ khóa (ví dụ file `.claude/tdd-lock`); hook `PreToolUse` từ chối mọi Edit/Write vào `**/*.spec.ts`, `**/*.test.ts` khi cờ còn bật.
4. **Green**: agent implement kèm JSDoc cho đến khi test xanh; hook lớp 1 chạy lint + typecheck sau mỗi lần sửa.
5. **Refactor**: bạn đọc diff và doc; agent refactor dưới sự bảo vệ của test.
6. **Mở khóa, push, PR**: pre-push và CI chạy đủ gate; merge thì tự deploy.

Nếu thật sự cần sửa test trong pha implement: bạn tự mở khóa, sửa, và ghi lý do vào commit. Mỗi lần như vậy ghi vào `AI_WORKFLOW.md`.

### Chứng minh hàng rào hoạt động

Thư mục `tools/guardrail-tests/` chứa script thử từng cách phá: commit thiếu JSDoc, commit có `any`, `git commit --no-verify` qua agent, agent sửa test khi đang khóa, push làm giảm coverage, PR sửa `eslint.config` không qua review. Mỗi cách phải bị chặn và script chạy trong CI. Đây là thứ đáng demo nhất khi bị hỏi "làm sao kiểm soát code AI viết".

## Mock Project 1: TaskFlow (multi-tenant SaaS, Ngày 1–17)

TaskFlow là app quản lý task kiểu mini Jira/Trello cho nhiều workspace. Project này chứng minh: đi từ idea qua mockup đến prototype, thiết kế backend, cách ly dữ liệu multi-tenant, xử lý ghi đồng thời, realtime chạy được nhiều instance, deploy production trên AWS và vận hành nó. Đây cũng là sân tập chính cho vòng TDD với agent sau hàng rào chất lượng.

### Kiến trúc

```
Browser ── ALB / Caddy (HTTPS) ──┬── web: Next.js (App Router, shadcn/ui theo design token)
                                 └── api: NestJS (2+ instance) ──┬── PostgreSQL (Prisma, RLS)
                                                                 ├── Redis (cache, pub/sub cho WebSocket, queue)
                                                                 └── S3 (file đính kèm, presigned URL)
                               worker: NestJS + BullMQ (email mời, thumbnail) ── Redis, S3
                               LLM API (tách mô tả thành task)
Contract: OpenAPI → type dùng chung + MSW (giai đoạn prototype) + contract test
Telemetry: pino, OpenTelemetry, Sentry, dashboard + alert
Hạ tầng: Terraform; secret trong SSM Parameter Store; CI/CD: GitHub Actions → ECR → deploy
```

Redis đóng 3 vai: cache, pub/sub cho WebSocket khi chạy nhiều instance API, và queue cho Worker.

### Luồng phát triển

1. Idea → PRD → wireframe → mockup hi-fi → test với 3 người (Ngày 1–2).
2. Mockup system design + OpenAPI contract (Ngày 3).
3. Prototype web với API giả, lên production (Ngày 4).
4. Hàng rào chất lượng (Ngày 5).
5. Backend theo TDD, mỗi tính năng thay một phần API giả bằng API thật (Ngày 6–14).
6. Hạ tầng, observability, vận hành (Ngày 15–17).

### Scope

- [ ] Đăng ký, đăng nhập, rotate refresh token, mời thành viên vào workspace qua email
- [ ] RBAC 4 role: owner, admin, member, viewer
- [ ] Project, board, task (status, assignee, priority, due date, label), comment, file đính kèm
- [ ] Kéo thả đổi thứ tự task, board cập nhật realtime
- [ ] Activity log, tìm task bằng Postgres full-text search
- [ ] Tính năng AI nhỏ: gõ mô tả tự do, LLM tách thành danh sách task có cấu trúc

### Data model

| Bảng | Cột chính | Ghi chú thiết kế |
| --- | --- | --- |
| users | id, email (unique), password\_hash, name | Hash bằng argon2 |
| workspaces | id, name, slug (unique) | Đơn vị tenant |
| memberships | user\_id, workspace\_id, role | PK kép (user\_id, workspace\_id) |
| projects | id, workspace\_id, name | Mọi query đều lọc theo workspace\_id |
| tasks | id, workspace\_id, project\_id, title, status, position, assignee\_id, due\_at, version | `position` dùng fractional indexing; `version` cho optimistic lock |
| comments | id, task\_id, author\_id, body |  |
| attachments | id, task\_id, s3\_key, mime, size | Upload qua presigned URL |
| activity\_logs | id, workspace\_id, actor\_id, action, payload (jsonb) | Ghi trong cùng transaction với thay đổi |
| refresh\_tokens | id, user\_id, token\_hash, expires\_at, revoked\_at | Phát hiện reuse thì thu hồi cả chuỗi token |

### API chính

| Method | Path | Quyền |
| --- | --- | --- |
| POST | /auth/register, /auth/login, /auth/refresh, /auth/logout | Public |
| POST | /workspaces/:ws/invites | owner, admin |
| GET | /workspaces/:ws/projects/:id/tasks?cursor=&status= | member trở lên, viewer chỉ đọc |
| PATCH | /tasks/:id (kèm `version`) | member |
| POST | /tasks/:id/move (kèm `beforeId`, `afterId`) | member |
| POST | /tasks/:id/attachments/presign | member |
| POST | /ai/tasks/draft | member, có rate limit |
| WS | /realtime (room theo project) | member |

### Deploy

- Giai đoạn prototype (Ngày 4–14): 1 VM + docker compose + Caddy (tự cấp HTTPS), để có production sớm.
- Bản chuẩn: ALB, ECS Fargate (api, web), RDS PostgreSQL, ElastiCache Redis, S3, secret trong SSM Parameter Store.
- Bản tiết kiệm: 1 EC2 chạy docker compose + Caddy. Ghi rõ trade-off giữa 2 bản trong ADR; Ngày 15 chọn một bản và codify bằng Terraform.

### Acceptance

- [ ] Mockup đạt tiêu chí chấp nhận UI; prototype khớp mockup ở các màn chính
- [ ] User của workspace A không đọc được bất kỳ dữ liệu nào của workspace B. Có test e2e chứng minh
- [ ] Hai tab cùng sửa 1 task: tab sau nhận lỗi 409, không ghi đè im lặng
- [ ] Chạy 2 instance API: event realtime vẫn tới đủ mọi client
- [ ] k6: `GET tasks` p95 < 200 ms với 100k task (mục tiêu tự đặt, ghi số đo thật vào README)
- [ ] Mọi tính năng backend có test design và commit `test:` đứng trước commit `feat:`; coverage ≥ 80%, mutation score ≥ 70% ở module lõi
- [ ] 100% class, method, property, export có JSDoc đạt rule; TypeDoc build không warning
- [ ] Eval tính năng AI chạy trong CI khi prompt đổi
- [ ] CI: lint, typecheck, test, build, deploy tự động khi merge vào main; rollback đã thử
- [ ] Restore backup đã thử, ghi RTO thực tế; 1 postmortem
- [ ] README: mockup, sơ đồ kiến trúc, ≥ 3 ADR, dashboard, `AI_WORKFLOW.md`

Câu hỏi phỏng vấn project này giúp trả lời: cách ly tenant; sắp xếp thứ tự mà không phải update cả list; xử lý ghi đồng thời; scale WebSocket; vì sao chọn presigned URL thay vì upload qua API; đi từ idea đến prototype thế nào; deploy lỗi thì làm gì.

## Mock Project 2: TaskFlow AI Dev Kit (Ngày 5–21)

AI Dev Kit là bộ cấu hình để coding agent làm việc đúng chuẩn trên repo TaskFlow. Project này trả lời câu "bạn ứng dụng AI trong công việc thế nào" và "làm sao kiểm soát code AI viết" bằng một repo mà người phỏng vấn mở ra xem được. Kit lớn dần trong lúc làm P1 nên mọi thành phần đều đã được dùng thật, không phải cấu hình mẫu.

CLAUDE.md và skill là hướng dẫn, agent vẫn có thể không làm theo. Hook là guardrail luôn chạy, nên những gì bắt buộc phải nằm ở hook ([nguồn](https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more)).

### Thành phần

| Thành phần | Vị trí trong repo | Có từ | Nội dung |
| --- | --- | --- | --- |
| CLAUDE.md | `/CLAUDE.md` | Ngày 5 | Kiến trúc, lệnh build/test, convention, vòng TDD; dưới 200 dòng |
| MCP thiết kế | Figma MCP hoặc Penpot MCP | Ngày 2 | Đọc/ghi mockup từ Claude Code, chuyển mockup sang code |
| Hàng rào chất lượng | `eslint.config.*`, `lefthook.yml`, `commitlint.config.*`, `.github/workflows/ci.yml`, `tools/guardrail-tests/` | Ngày 5 | 6 lớp ở mục "Hàng rào chất lượng" |
| Rules | `.claude/rules/` | Ngày 5 | Mọi handler trong `src/api/**` phải validate bằng zod; migration chỉ được thêm, không sửa; doc mô tả hợp đồng, không kể lại code |
| Hooks | `.claude/settings.json` | Ngày 5 | Lint + typecheck sau khi sửa file; chặn `rm -rf`, `git push --force`, `--no-verify`; khóa test trong pha implement |
| Subagents | `.claude/agents/` | Ngày 6 (`test-writer`), Ngày 20 (`reviewer`) | `test-writer` viết test từ test design; `reviewer` soát diff theo convention và JSDoc |
| Skills | `.claude/skills/<tên>/SKILL.md` | Ngày 18 | `new-endpoint`, `db-migration`, `pr-review`, `tdd-feature` |
| MCP tự viết | `packages/mcp-taskflow` | Ngày 19 | Tool `list_tasks`, `create_task`, `get_error_logs`; mặc định chỉ đọc |
| MCP có sẵn | Cấu hình MCP của project | Ngày 19 | Postgres (user chỉ đọc), GitHub |
| CI | `.github/workflows/ai-review.yml` | Ngày 20 | Agent chạy headless review PR, comment lên PR |
| Plugin | plugin dùng chung | Ngày 20 | Skill, hook, subagent, MCP, cấu hình hàng rào; README onboard |
| Agent loop tự viết | `packages/mini-agent` | Ngày 18 | ~100 dòng TS, để hiểu cơ chế bên trong |

### Kịch bản demo (chạy trực tiếp khi phỏng vấn, hoặc mở PR mẫu đã có)

1. Mở issue "Thêm label cho task" trên GitHub.
2. Agent đọc issue qua MCP GitHub và đề xuất plan. Bạn duyệt plan.
3. Agent dùng skill `tdd-feature`: subagent `test-writer` viết test theo test design, bạn duyệt, test bị khóa.
4. Agent dùng skill `db-migration` và `new-endpoint`. Hook tự chạy lint/typecheck sau mỗi lần sửa; nếu agent thử sửa test hoặc `--no-verify` thì bị chặn.
5. Subagent `reviewer` soát diff và JSDoc.
6. Mở PR. CI chạy đủ gate và agent review comment lên PR.

### Acceptance

- [ ] Người mới clone repo là làm được feature đầu tiên với agent, đúng convention, không cần đọc wiki
- [ ] MCP server có test, đã thử bằng MCP Inspector, quyền ghi phải bật rõ ràng
- [ ] Hook chặn được lệnh nguy hiểm và mọi cách phá trong `tools/guardrail-tests/`, có test case chạy trong CI
- [ ] `AI_WORKFLOW.md` có số đo: thời gian làm 3 feature có/không agent, số lần phải sửa output của agent, số lần mỗi lớp hàng rào chặn agent
- [ ] Plugin cài được vào repo khác (dùng thật cho P3)
- [ ] Không có secret nào trong file cấu hình agent

Câu hỏi phỏng vấn project này giúp trả lời: skill khác CLAUDE.md và hook thế nào; khi nào nên tự viết MCP server; agent loop chạy ra sao; làm sao để agent không phá repo và không sửa test cho xanh; vì sao bắt JSDoc cho mọi method/class/property và cái giá của luật đó; đo hiệu quả của AI bằng gì.

## Mock Project 3: Job Hunt kit (skill + MCP, Ngày 22–23)

Job Hunt kit đóng gói việc săn job thành 1 skill và 1 MCP server dùng ngay trong Claude Code. Bạn dùng nó cho các JD đang nộp, nên khi phỏng vấn có chuyện thật để kể. Project này được build bằng plugin của P2, để luyện việc tái dùng công cụ và quy trình đã xây cho một ý tưởng mới, vẫn qua đủ hàng rào chất lượng.

Nguyên tắc thiết kế: agent chỉ trích xuất và viết giải thích, còn điểm số do script tính. Kết quả vì vậy lặp lại được và test được, đây cũng là điểm nên nói khi phỏng vấn.

### Thành phần

- MCP server `job-tracker` lưu bằng SQLite, có tool `save_job`, `list_jobs`, `update_status` (saved, applied, interview, offer, rejected).
- Skill `jd-match`: SKILL.md hướng dẫn trích JD theo schema, chạy `scripts/score.ts` để tính điểm, rồi viết gap và 10 câu hỏi dự kiến.
- Đóng gói skill + MCP thành 1 plugin để cài lại trên máy khác.

### Luồng xử lý

1. Dán text JD vào Claude Code (không scrape trang tuyển dụng).
2. Skill `jd-match` trích JD thành JSON theo schema.
3. Script `score.ts` tính điểm so với CV profile đã lưu.
4. Agent viết gap, cách bù, và 10 câu hỏi dự kiến gắn với câu chuyện STAR phù hợp.
5. Agent gọi tool `save_job` của MCP `job-tracker` để lưu vào tracker.

### Acceptance

- [ ] Cùng một JD chạy 3 lần thì điểm không đổi
- [ ] Unit test cho `score` và hàm chuẩn hóa tên skill (ví dụ "Node.js" = "NodeJS"), viết trước theo vòng TDD
- [ ] Qua đủ hàng rào chất lượng của plugin P2
- [ ] Đã dùng cho ít nhất 10 JD thật bạn đang nộp
- [ ] Plugin cài được trên máy khác theo README

## Output dùng khi phỏng vấn

Output là thứ tự nhiên còn lại sau khi học qua project, không làm riêng để trình diễn. Mỗi repo có `README.md` tóm tắt vấn đề, kiến trúc, quyết định chính và số đo thật, rồi liên kết tới tài liệu chi tiết. Khi phỏng vấn, dùng chúng để kể kinh nghiệm cụ thể:

| Vòng phỏng vấn | Mở cái gì để kể |
| --- | --- |
| Behavioral / hiring manager | ADR có phương án bị loại, postmortem, `DEVLOG.md` (chỗ sai và bài học) |
| System design | Sơ đồ kiến trúc P1, các trade-off đã thật sự gặp (tenant, realtime, ghi đồng thời) |
| Deep dive kỹ thuật | Git history TDD, code có JSDoc, cấu hình hàng rào và `tools/guardrail-tests/`, MCP server, agent loop tự viết, dashboard |

Các file trong repo: `docs/PRD.md`, `docs/design/` (mockup, tiêu chí UI, ghi chú test người dùng), `docs/architecture/`, `docs/adr/`, `docs/test-design/`, `docs/postmortems/`, `docs/runbook.md`, `CHANGELOG.md`, `DEVLOG.md`, `AI_WORKFLOW.md`.

Tài liệu: [Steering Claude Code](https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more), [Skills](https://code.claude.com/docs/en/skills), [Subagents](https://code.claude.com/docs/en/sub-agents), [Hooks](https://code.claude.com/docs/en/hooks-guide), [Permissions](https://code.claude.com/docs/en/permissions), [Plugins](https://code.claude.com/docs/en/plugins), [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc), [lefthook](https://github.com/evilmartians/lefthook), [Stryker](https://stryker-mutator.io/).

## Chuẩn bị phỏng vấn

### 8 câu chuyện STAR (tiếng Anh, mỗi câu ≤ 2 phút)

| # | Chủ đề | Nguồn |
| --- | --- | --- |
| 1 | Từ ý tưởng đến mockup, prototype và production | P1: PRD, mockup, prototype Ngày 4 |
| 2 | Một quyết định kiến trúc và phương án đã loại | ADR P1 (ECS vs EC2, fractional indexing, RLS vs lọc ở app) |
| 3 | Sự cố production và postmortem | Diễn tập Ngày 17 |
| 4 | Agent cố vượt rào (sửa test, tắt lint, `--no-verify`) và hàng rào chặn được; bạn thêm luật gì sau đó | P2: `AI_WORKFLOW.md`, `tools/guardrail-tests/` |
| 5 | Xây công cụ giúp cả team làm nhanh và đúng chuẩn hơn | P2 plugin, dùng lại cho P3 |
| 6 | Cải thiện hiệu năng có số đo | k6 Ngày 16 |
| 7 | Bất đồng với teammate/stakeholder | Kinh nghiệm 5 năm |
| 8 | Mentoring hoặc nâng chuẩn cho cả team | Kinh nghiệm 5 năm + hàng rào chất lượng như chuẩn chung |

### Câu hỏi phải trả lời trơn tru

- Bạn đi từ ý tưởng đến prototype thế nào; dùng công cụ AI nào cho mockup và vì sao; làm sao biết UI đã đủ tốt để code.
- Làm sao đảm bảo chất lượng code agent viết; làm sao agent không sửa test cho xanh hoặc tắt gate; TDD với agent khác TDD truyền thống ở đâu; mutation testing để làm gì.
- Agent loop chạy ra sao; MCP vs gọi API trực tiếp; skill vs CLAUDE.md vs hook; rủi ro bảo mật khi cho agent truy cập DB và GitHub.
- Cách ly tenant; sắp xếp thứ tự không update cả list; xử lý ghi đồng thời; scale WebSocket; presigned URL; contract-first.
- SLO của bạn là gì và vì sao; deploy lỗi thì làm gì; RPO/RTO bao nhiêu; ECS vs EC2.
- Node event loop; Postgres index và isolation level; Redis dùng cho gì; session vs JWT; outbox pattern.

### DSA

12 bài trong 4 tuần (3 bài/tuần), mức Easy–Medium, mỗi bài vừa giải vừa nói tiếng Anh. Nếu công ty target là big tech hoặc global remote nặng DSA, đổi Block 3 của ngày thường thành DSA và tăng lên 1 bài/ngày.

## Khi bị chậm

Scope của 3 mock project không tự cắt. Mỗi Thứ Ba là ngày kiểm tra gate; nếu chưa qua:

1. Dùng block build của cuối tuần kế tiếp để bù.
2. Nếu vẫn không đủ, liệt kê các hạng mục đang trễ kèm ước lượng, rồi bạn quyết định: lùi gate, giảm độ sâu một hạng mục (ví dụ mutation test chỉ cho 1 module), hay đổi lịch phần interview prep.

Không thay đổi: hàng rào chất lượng, TDD, JSDoc bắt buộc, test mockup với người dùng, deploy hằng ngày, test cách ly tenant, `DEVLOG.md`, mock full loop.

## Theo dõi tiến độ

| Chỉ số | Tuần 1 | Tuần 2 | Tuần 3 | Tuần 4 |
| --- | --- | --- | --- | --- |
| Số lần deploy prod (P1) | ≥ 4 | ≥ 10 | ≥ 16 | — |
| Tính năng backend làm theo TDD (cộng dồn) | 2 | 9 | 9 | 11 (gồm P3) |
| Thành phần P2 đang chạy thật | Hàng rào, CLAUDE.md, hook, `test-writer` | + rule | Đủ bảng thành phần | Dùng cho P3 |
| Số lần hàng rào chặn agent | ghi lại | ghi lại | ghi lại | tổng kết |
| ADR (cộng dồn) | 2 | 3 | ≥ 4 | ≥ 4 |
| JD thật chạy qua P3 | — | — | — | ≥ 10 |
| Đơn đã nộp (cộng dồn) | ≥ 5 | ≥ 12 | ≥ 20 | ≥ 28 |
| Mock (cộng dồn) | 1 | 2 | 3 | ≥ 4 full loop + các mock lẻ |
| Bài DSA (cộng dồn) | 3 | 6 | 8 | 11 |
