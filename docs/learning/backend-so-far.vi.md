# Backend: những gì đã có trong TaskFlow (tính đến 19/10)

Bài học tổng hợp mọi khái niệm backend đã xuất hiện trong 6 ngày đầu, trỏ thẳng vào code để đọc. Thời gian đọc: ~45 phút.
Mỗi phần có: **ý chính** → **ở TaskFlow nằm đâu** → **câu nói khi phỏng vấn** (tiếng Anh, kèm nghĩa).

Đường dẫn code tính từ repo `taskflow`. `mocks/` = `apps/web/src/mocks/`.

---

## 0. Backend làm gì: đối chiếu với frontend

| Frontend (bạn đã quen) | Backend |
| --- | --- |
| Validate form để báo lỗi nhanh cho người dùng | Validate **lại toàn bộ**, vì client có thể bị bỏ qua (gọi API bằng curl) |
| Ẩn nút "Xoá" với viewer | **Chặn thật** request xoá của viewer (403). Ẩn nút chỉ là trải nghiệm |
| State trong một tab, của một người | Dữ liệu dùng chung cho **nhiều người cùng lúc** → phải xử lý ghi đồng thời |
| Lỗi thì hiện toast | Lỗi phải có **mã và cấu trúc thống nhất** để mọi client xử lý được |
| Chạy trên máy người dùng | Chạy trên server: phải tính **tải, độ trễ, bảo mật, chi phí** |

> Câu cần nhớ: **"The client is untrusted."** Mọi thứ đến từ client (body, header, id) đều có thể bị sửa.

---

## 1. Thiết kế API (contract)

**Ý chính**
- REST xoay quanh **tài nguyên** (`/tasks/{id}`) và **động từ HTTP**: GET đọc, POST tạo / hành động, PATCH sửa một phần, DELETE xoá.
- **Status code là một phần của API**, client dựa vào đó để xử lý:

| Code | Nghĩa | Ví dụ TaskFlow |
| --- | --- | --- |
| 200 / 201 / 204 | Thành công / đã tạo / không có body | Sửa task / tạo task / logout |
| 401 | Chưa xác thực (không có hoặc sai token) | Gọi `/me` khi chưa đăng nhập |
| 403 | Đã xác thực nhưng không đủ quyền | Viewer sửa task |
| 404 | Không có, **hoặc không được phép biết là có** | Task của công ty khác |
| 409 | Xung đột với trạng thái hiện tại | Sửa task bằng version cũ; email đã đăng ký |
| 422 | Dữ liệu sai luật | Title rỗng |

- **Lỗi có cấu trúc thống nhất** (RFC 9457): `type` (mã máy đọc), `title`, `status`, `detail`, cộng thêm field riêng (`errors` cho 422, `current` cho 409).
- **Phân trang bằng cursor** thay vì `?page=3`: ổn định khi dữ liệu thay đổi và không chậm dần như `OFFSET`.

**Ở TaskFlow:** `packages/api-contract/openapi.yaml`. Đã học kỹ trong Q9.

> "I design the API contract first, so frontend and backend can work in parallel and the types are generated from one source of truth."
> *Nghĩa: tôi thiết kế contract trước để FE và BE làm song song, và type sinh ra từ một nguồn duy nhất.*

---

## 2. Vòng đời của một request

**Ý chính:** gần như mọi endpoint ghi dữ liệu đều đi đúng thứ tự này:

```
1. Xác thực (authn)  → 401
2. Tìm dữ liệu       → 404  (không có, hoặc thuộc tenant khác)
3. Phân quyền (authz) → 403
4. Validate           → 422
5. Luật nghiệp vụ     → 409 (version lệch, email trùng…)
6. Ghi + trả kết quả  → 200 / 201
```

Vì sao bước 2 đứng trước bước 3: nếu kiểm tra quyền trước, người ngoài nhận 403 và biết được tài nguyên đó **có tồn tại**.

**Ở TaskFlow:** `mocks/handlers/tasks.ts`, handler `http.patch('/tasks/{taskId}'…)`. Đọc lại và tìm đủ 6 bước.

**Khi viết bằng NestJS, mỗi bước có một chỗ riêng:**

| Bước | NestJS |
| --- | --- |
| Xác thực | `AuthGuard` (đọc và kiểm tra JWT) |
| Phân quyền | `RolesGuard` / policy |
| Validate | `ValidationPipe` + DTO (hoặc zod) |
| Luật nghiệp vụ + ghi | `TasksService` |
| Đổi lỗi thành RFC 9457 | `ExceptionFilter` |

> "Every write goes through the same pipeline: authenticate, load the resource scoped to the tenant, authorize, validate, apply business rules, then write."

---

## 3. Xác thực (authentication)

**Ý chính**

**a) Session hay JWT?**

| | Session | JWT (access token) |
| --- | --- | --- |
| Server lưu gì | Bảng session (Redis/DB), client giữ session id | Không lưu gì: token tự chứa thông tin, có chữ ký |
| Thu hồi ngay | Dễ: xoá session | Khó: token còn hạn là còn dùng được |
| Mỗi request | Phải tra bảng session | Chỉ cần kiểm tra chữ ký |

TaskFlow kết hợp cả hai: **access token JWT sống ngắn (15 phút)**, cộng **refresh token sống dài, lưu ở server**, để vẫn thu hồi được.

**b) Lưu token ở đâu?**
- **Access token: trong bộ nhớ JavaScript.** Không để trong `localStorage`, vì bất kỳ script bị chèn vào (XSS) cũng đọc được.
- **Refresh token: cookie `HttpOnly; Secure; SameSite=Strict`.** JavaScript không đọc được, và trình duyệt tự gửi kèm khi gọi `/auth/refresh`.

**c) Xoay vòng refresh token (rotation) và phát hiện token bị đánh cắp**
- Mỗi lần refresh: cấp refresh token **mới**, vô hiệu token cũ.
- Nếu một token **đã dùng rồi** lại được gửi lên, nghĩa là có hai bên đang giữ nó (một trong hai là kẻ trộm) → **thu hồi cả chuỗi**, bắt đăng nhập lại.

**d) Hai luật nhỏ nhưng hay bị hỏi**
- **Không lưu mật khẩu dạng chữ thường:** hash bằng argon2 hoặc bcrypt (cố tình chậm để khó dò).
- **Không để lộ email nào đã có tài khoản:** sai email hay sai mật khẩu đều trả cùng một câu "Wrong email or password".

**Ở TaskFlow**
- Luồng phía client: `apps/web/src/lib/auth/token.ts` (token trong bộ nhớ), `session.tsx` (khi tải trang thì gọi `/auth/refresh`), `lib/api/client.ts` (middleware gắn token, gặp 401 thì đăng xuất).
- Phía "server" giả: `mocks/handlers/auth.ts`. Mock **chưa** hash mật khẩu và **chưa** có cookie: đây là việc của ngày backend đầu tiên.
- Contract: `/auth/refresh` mô tả rotation và reuse detection.

> "Short-lived access token in memory, long-lived refresh token in an httpOnly cookie, rotated on every use. If an old refresh token is reused, we revoke the whole family, because that means it was stolen."

---

## 4. Phân quyền và multi-tenancy

**Ý chính**
- **RBAC** (role-based access control): quyền theo vai trò. TaskFlow có 4 role: owner, admin, member, viewer.
- **Phân quyền theo tài nguyên:** viewer chỉ thấy **project được mời** (bảng `project_members`). Quyết định này có từ buổi persona walkthrough 16/10.
- **Cách ly tenant:** workspace A **không bao giờ** đọc được dữ liệu workspace B. Mọi query phải lọc theo `workspace_id`, hoặc dùng Postgres RLS (database tự chặn).
- **Phân quyền ở API, không phải ở UI.** UI chỉ ẩn nút cho dễ dùng (bài học từ Q2).

**Ở TaskFlow:** `mocks/http.ts`, các hàm `membershipOf`, `canSeeProject`, `roleIn`, `canWriteTasks`, `canManage`. Luật "viewer phải có project" nằm trong `mocks/handlers/members.ts`.

> "Authorization lives in the API, not the UI. Every query is scoped by workspace, and viewers are additionally scoped to the projects they were invited to. Resources outside your scope return 404, not 403."

---

## 5. Ghi đồng thời và tính nhất quán

**Ý chính**
- **Lost update:** A và B cùng đọc task, A lưu, rồi B lưu đè lên mà không biết A đã sửa.
- **Optimistic locking:** mỗi bản ghi có `version`. Client gửi version mình đã đọc; lệch thì trả **409**, kèm dữ liệu mới nhất.
- **Phải nguyên tử (atomic):** kiểm tra và ghi trong **một câu SQL**:
  ```sql
  UPDATE tasks SET title = $3, version = version + 1
  WHERE id = $1 AND version = $2;   -- 0 dòng bị sửa → 409
  ```
  "Đọc version, so sánh, rồi mới ghi" thành 2 bước sẽ bị **race condition**: hai request cùng qua bước so sánh.
- **Cùng kiểu lỗi đó với email trùng:** kiểm tra bằng code (`.some()`) rồi mới insert là không an toàn. Phải có **`UNIQUE` constraint** trong database.
- **Nhất quán mạnh hay nhất quán sau** (Q6): dữ liệu gốc và quyền truy cập phải nhất quán mạnh; các bản sao và dữ liệu dẫn xuất (realtime, cache, bộ đếm) được phép trễ.

**Ở TaskFlow:** `mocks/handlers/tasks.ts`, comment ở bước kiểm tra version. Mock **đang làm 2 bước**, chỉ an toàn vì JavaScript trong trình duyệt chạy một luồng. Backend thật phải làm 1 câu SQL.

> "I use optimistic locking with a version column. The check and the write are a single conditional UPDATE, so two concurrent requests can't both pass the check."

---

## 6. Thứ tự: fractional indexing

**Ý chính:** lưu vị trí bằng một chuỗi nằm giữa hai hàng xóm (`a1` < `a1V` < `a2`), nên mỗi lần kéo thả chỉ ghi **1 dòng**. Client gửi `afterId` / `beforeId` (ID ổn định), server tự sinh khóa vị trí.

**Ở TaskFlow:** `mocks/handlers/tasks.ts`, handler `move` (dùng thư viện `fractional-indexing`). Đã học trong Q9.

---

## 7. Quy mô: các mảnh đã gặp trong system design

| Khái niệm | Một câu | Gặp ở |
| --- | --- | --- |
| Ước lượng | Ước lượng → con số → **kết luận** (phần nào khó) | TaskFlow (16/10), URL shortener |
| Server stateless + load balancer | Muốn thêm server thì app không được giữ state trong RAM | TaskFlow cần ≥ 2 instance |
| Redis pub/sub | Sự kiện realtime đến được người dùng nối vào instance khác | TaskFlow realtime |
| Cache-aside | Đọc cache, không có (miss) thì đọc DB rồi ghi vào cache; chỉ thêm khi đã đo được nhu cầu | URL shortener, Q8 |
| Queue | Việc phụ (email, đếm click) làm bất đồng bộ để không chậm việc chính | URL shortener |
| Rate limit | Chống lạm dụng (dò mật khẩu, spam) | URL shortener, login |
| CAP | Khi mạng bị chia cắt, chọn nhất quán hay sẵn sàng, **tùy loại dữ liệu** | 16/10 |

---

## 8. Mock đang "ăn gian" → việc của backend thật

| Mock | Backend thật | Ngày làm |
| --- | --- | --- |
| Mật khẩu dạng chữ thường | Hash argon2 | Ngày backend đầu tiên (auth) |
| Token ngẫu nhiên lưu trong Map | JWT + refresh cookie xoay vòng | Auth |
| Lọc tenant bằng `.filter()` | `WHERE workspace_id` / RLS + test e2e cách ly | Workspace / RBAC |
| So sánh version rồi mới ghi | `UPDATE … WHERE version = $2` | Task / 409 |
| Kiểm tra email trùng bằng code | `UNIQUE` constraint | Auth |
| Dữ liệu trong bộ nhớ | Postgres + Prisma migration | Từ ngày backend đầu tiên |
| Không có rate limit | Rate limit endpoint login | Tuần 2 |

---

## 9. Tự kiểm tra (trả lời không mở tài liệu)

Trả lời bằng tiếng Anh hoặc tiếng Việt đều được. Mình sẽ ghi vào sổ Q&A.

1. Vì sao không tồn tại và không có quyền xem đều trả **404** mà không trả 403?
2. Mock đang kiểm tra version rồi mới ghi. Ở backend thật, điều gì có thể sai, và sửa bằng cách nào?
3. Vì sao access token để trong bộ nhớ mà không để trong `localStorage`? Còn refresh token để ở đâu, vì sao?
4. Refresh token rotation là gì? Nếu một refresh token **đã dùng** bị gửi lên lần nữa thì server làm gì, vì sao?
5. Frontend đã ẩn nút "Sửa" với viewer rồi. Vì sao API vẫn phải kiểm tra quyền?
