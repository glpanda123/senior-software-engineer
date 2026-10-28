# Sequence diagram + ADR giải thích dễ hiểu

Bản tiếng Anh (công khai): repo taskflow, [`docs/architecture/03-sequences.md`](https://github.com/glpanda123/taskflow/blob/master/docs/architecture/03-sequences.md) và thư mục [`adr/`](https://github.com/glpanda123/taskflow/tree/master/docs/architecture/adr). Đọc file này khoảng 20 phút.

---

## Phần 1. Sequence diagram = "chuyện gì xảy ra, theo thứ tự thời gian"

C4 cho biết **có những hộp nào**. Sequence diagram cho biết **khi bấm một nút, các hộp nói gì với nhau, theo thứ tự**. Giống bạn mở tab Network trong DevTools rồi đọc từ trên xuống.

### Luồng 1: Minh kéo task, Ly thấy ngay (dù hai người nối vào 2 bản API khác nhau)

1. Minh thả thẻ. Thẻ đứng yên ngay chỗ mới (giống prototype).
2. Trình duyệt gửi `POST /tasks/T/move` kèm `version: 4` tới **bản API B**.
3. B kiểm tra: token hợp lệ? Minh có quyền sửa không? Có thấy project này không?
4. B ghi vào database bằng **một câu lệnh**: "đổi cột, tăng version lên 5, **chỉ khi** version đang là 4".
   - **Có người sửa trước** (version không còn là 4): không ghi gì, trả **409**. Đây là cái bạn đã thấy trong prototype.
   - **Ghi được:** trong cùng một lần lưu, B ghi thêm 2 dòng: một dòng lịch sử (activity) và một dòng "cần báo cho mọi người" (gọi là **outbox**, hãy hình dung như "hộp thư đi").
5. B trả 200 cho Minh.
6. **Worker** đọc hộp thư đi, đăng tin lên **Redis** (nhóm chat của các bản API).
7. **Bản API A** (nơi Ly đang nối) nghe được tin, đẩy xuống màn hình Ly. Ly thấy thông báo "Minh moved…".

**Vì sao cần "hộp thư đi" mà không báo luôn?** Nếu B báo lên Redis trước, rồi việc lưu bị lỗi, Ly sẽ thấy một thay đổi **không có thật**. Ghi "cần báo" cùng lúc với việc lưu thì: lưu được mới báo, lưu lỗi thì không báo gì.

### Luồng 2: AI soạn task

1. Lead dán brief, bấm "Draft tasks".
2. API kiểm tra quyền và độ dài đoạn văn.
3. API kiểm tra **giới hạn tần suất** (đếm trong Redis): workspace này gọi AI quá nhiều trong 1 phút thì trả 429 "thử lại sau". Mỗi lần gọi AI là tốn tiền.
4. API gọi dịch vụ AI, **chờ tối đa 20 giây**. Quá giờ thì báo lỗi, không treo mãi.
5. API **kiểm tra lại kết quả** của AI có đúng định dạng không, bỏ phần sai.
6. Trả bản nháp. **Chưa lưu gì.** Người dùng sửa, bỏ chọn, bấm "Add" thì mới tạo task bằng API bình thường.

### Luồng 3: giữ đăng nhập

- Access token sống 15 phút. Hết hạn → gọi `/auth/refresh` (trình duyệt tự gửi cookie) → nhận token mới.
- Mỗi lần refresh, refresh token cũ **bị thay bằng cái mới**. Nếu cái cũ bị dùng lại → nghi bị đánh cắp → khoá cả chuỗi, bắt đăng nhập lại. (Đây là câu Q10 bạn đã trả lời hôm 19/10.)
- WebSocket mở cả ngày, lâu hơn 15 phút: server định kỳ báo "token hết hạn", trình duyệt refresh rồi gửi token mới qua socket.

---

## Phần 2. ADR = "biên bản ra quyết định"

**ADR (Architecture Decision Record)**: một trang ghi lại **chọn gì, vì sao, đã cân nhắc những phương án nào, và chấp nhận đánh đổi gì**. Giống mô tả PR, nhưng cho quyết định kiến trúc. Khi phỏng vấn, interviewer hay hỏi "vì sao chọn X mà không chọn Y?": ADR chính là câu trả lời viết sẵn.

### ADR-001: stack backend

| Quyết định | Lý do ngắn | Đã cân nhắc |
| --- | --- | --- |
| **NestJS** (TypeScript) | Cùng ngôn ngữ với frontend; có sẵn cấu trúc module, guard để phân quyền, WebSocket; rất phổ biến trong tin tuyển dụng ở Hà Nội | Express/Fastify (phải tự dựng cấu trúc), Hono (hệ sinh thái nhỏ) |
| **Prisma** để làm việc với database | Schema dễ đọc, type tự sinh, migration có sẵn; vài chỗ đặc biệt thì viết SQL tay | Drizzle/Kysely (gần SQL hơn, phương án dự phòng), TypeORM (type yếu) |
| **Kiểm tra request bằng chính OpenAPI** | Contract là nguồn sự thật duy nhất, không viết luật 2 lần | DTO class của NestJS (dễ lệch với contract) |
| **Test với Postgres + Redis thật** (chạy trong container) | Lỗi cách ly tenant hay lỗi 409 chỉ lộ ra với database thật | Mock database (nhanh nhưng dễ "xanh giả") |

### ADR-002: hạ tầng

- **Web:** giữ Vercel như hiện tại.
- **Backend:** AWS. API và Worker chạy dạng container (ECS Fargate) sau load balancer; database là RDS Postgres; Redis là ElastiCache; email qua SES.
- **Hai cấu hình** dùng chung một cách dựng:
  - *Demo* (chạy ngay, rẻ): 1 bản API, database nhỏ, không dự phòng.
  - *Production* (cách đạt 99,9%): ≥ 2 bản API ở 2 vùng, database có bản dự phòng. Chỉ khác **cấu hình**, không khác code.
- **Đặt cảnh báo ngân sách AWS ($30/tháng) trước khi tạo bất cứ thứ gì.** Đây chính là việc "budget alert" đang treo của bạn.
- Đã cân nhắc: 1 máy ảo chạy Docker Compose (rẻ nhất, phương án dự phòng); Render/Railway/Fly (nhanh, rẻ, nhưng ít điểm để nói khi phỏng vấn công ty dùng AWS); Kubernetes và Lambda (không hợp quy mô hoặc không hợp WebSocket).

---

## Việc của bạn: đồng ý hay phản đối (~10 phút)

Trả lời từng dòng bằng ✅ (đồng ý) hoặc ❌ + lý do ngắn:

1. NestJS cho backend.
2. Prisma, viết SQL tay ở vài chỗ đặc biệt.
3. AWS cho backend, có cấu hình demo rẻ + cảnh báo ngân sách $30.
4. Hôm nay hoặc mai bạn tự tạo cảnh báo ngân sách AWS (khoảng 10 phút, mình hướng dẫn từng bước nếu cần).

Thêm 1 câu kiểm tra (trả lời 1–2 dòng): **Trong luồng 1, nếu lưu bị lỗi 409 thì Ly có nhận được thông báo gì không? Vì sao?**
