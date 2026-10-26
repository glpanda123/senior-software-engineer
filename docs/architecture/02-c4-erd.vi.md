# C4 + ERD: hướng dẫn đọc (bài mẫu giai đoạn 3)

Bản chính (tiếng Anh, công khai trong repo taskflow):
- [`docs/architecture/01-context-and-containers.md`](https://github.com/glpanda123/taskflow/blob/master/docs/architecture/01-context-and-containers.md): C4 mức 1–2
- [`docs/architecture/02-data-model.md`](https://github.com/glpanda123/taskflow/blob/master/docs/architecture/02-data-model.md): ERD

Đây là bài **mình làm mẫu** ("I do"). Lần sau (sequence diagram, 27/10) làm cùng nhau; ADR (28/10) bạn viết nháp trước vì đã thấy mẫu.

## 1. Dịch từ thứ bạn đã biết

| Backend / system design | Giống cái gì bên frontend |
| --- | --- |
| **C4 mức 1 (context)**: hệ thống là một hộp, xung quanh là người dùng và hệ thống ngoài | Sơ đồ "app của mình gọi những API bên thứ ba nào" |
| **C4 mức 2 (container)**: các phần **deploy riêng** bên trong | Monorepo có `apps/web`, `apps/api`, `apps/worker`: mỗi app một lần deploy |
| **Container ≠ Docker container** | Chỉ là "thứ chạy riêng": web app, API, database, Redis |
| **ERD**: các bảng, khoá, quan hệ | Kiểu TypeScript của dữ liệu (`Task`, `User`), nhưng thêm khoá ngoại và index |
| **Index** | `Map` tra cứu theo khoá thay vì `array.find()` duyệt hết |
| **Transaction** | Một lần `setState` gộp nhiều thay đổi: hoặc tất cả, hoặc không gì cả |
| **Redis pub/sub** | `EventEmitter` nhưng giữa nhiều server |
| **Worker + queue** | `setTimeout` / web worker cho việc chậm, nhưng không mất khi tab tắt (server crash) |

**Điều sẽ làm bạn bất ngờ:**
- **Ít container là tốt.** Ở 35 request/giây, một API + một worker là đủ. "Microservices" ở quy mô này là sai, không phải "pro".
- **Database là nguồn sự thật duy nhất.** Redis mất cũng không sao (chỉ chậm sự kiện); Postgres mất là mất dữ liệu.
- **Phần khó là đúng, không phải nhanh**: cách ly tenant, sửa đồng thời, thứ tự, realtime nhiều server.

## 2. Năm quyết định chính (và lý do)

1. **Modular monolith**: một codebase NestJS, build ra 2 image: `api` và `worker`. Một người làm, tải nhỏ → không cần microservices.
2. **WebSocket chạy chung process với API**. Muốn realtime chạy được khi có 2 instance → **Redis pub/sub**: instance nào xử lý write cũng phát lên kênh `project:{id}`, mọi instance nghe và đẩy cho browser của mình.
3. **Transactional outbox**: ghi task + activity + 1 dòng `outbox` **trong cùng transaction**; worker đọc outbox rồi mới phát lên Redis. Lý do: nếu phát lên Redis ngay trong request mà sau đó transaction rollback → browser thấy thay đổi không có thật; nếu crash giữa commit và phát → mất sự kiện.
4. **AI gọi đồng bộ** (không qua queue): người dùng đằng nào cũng chờ 2–8 giây; có timeout 20 giây + giới hạn tần suất theo workspace. **Không lưu brief của khách** (riêng tư), chỉ lưu số liệu sử dụng.
5. **JWT access 15 phút + refresh token xoay vòng trong cookie httpOnly**: API không cần chia sẻ session giữa các instance.

## 3. ERD: những chi tiết đáng nhớ để phỏng vấn

- **`workspace_id` có mặt ở mọi bảng của tenant** (kể cả `tasks`, dù đã có `project_id`): để mọi câu query lọc theo workspace dễ và nhanh → cách ly tenant.
- **`version` + `UPDATE … WHERE version = $2`**: optimistic locking trong **một câu SQL**, không có khe hở giữa kiểm tra và ghi.
- **`position` dùng `COLLATE "C"`**: fractional index so sánh theo byte; collation ngôn ngữ (vd. tiếng Việt) sẽ sắp khác client → thứ tự board sai. Chi tiết nhỏ nhưng interviewer thích.
- **Chỉ lưu hash của refresh token** (như mật khẩu): lộ database cũng không dùng được token.
- **Index một phần (partial index)** cho Today: `WHERE status <> 'done'` → task đã xong (đa số, theo thời gian) không bị quét.
- **Unique index cho lời mời đang chờ**: "đã mời rồi" (409) do database đảm bảo, không phải kiểm-tra-rồi-ghi (dễ race).
- **`activity_events.task_id` không có khoá ngoại**: lịch sử phải còn dù task bị xoá sau này.

## 4. Việc của bạn: đọc rồi phản biện (chọn 2–3 câu, trả lời ngắn)

1. Vì sao `tasks` vẫn cần `workspace_id` khi đã có `project_id` (project đã thuộc workspace)?
2. Nếu bỏ outbox và cho API phát lên Redis ngay sau khi commit, chuyện gì có thể sai? Có chấp nhận được ở v1 không?
3. Một viewer được mời vào 1 project: theo ERD, những bảng nào phải có dòng cho người đó?
4. Contract hiện vẫn trả `labels: []` dù labels là v1.1. Bạn chọn giữ field hay bỏ? Vì sao?
5. (Khó) Access token hết hạn sau 15 phút, nhưng WebSocket mở cả ngày. Server nên làm gì?

Câu trả lời của bạn sẽ vào `docs/interview/qa-review.md` như mọi câu kiểu phỏng vấn.
