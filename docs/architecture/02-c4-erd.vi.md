# C4 + ERD giải thích dễ hiểu

Bản tiếng Anh (công khai, đầy đủ hơn): repo taskflow, thư mục [`docs/architecture/`](https://github.com/glpanda123/taskflow/tree/master/docs/architecture). File này chỉ cần đọc **phần 1 và 2**. Phần 3 là thuật ngữ nâng cao, để dành đến giai đoạn 4 khi có code minh hoạ.

---

## Phần 1. C4 = bản đồ hệ thống

### Bắt đầu từ thứ bạn đã có

Prototype hiện tại đã có đủ 3 mảnh, chỉ là **cả 3 nằm trong trình duyệt**:

```
Trình duyệt
 ├─ Giao diện       → apps/web (React, Next.js)
 ├─ API giả         → mocks/handlers/*.ts   (kiểm tra quyền, trả lỗi 409…)
 └─ Database giả    → mocks/db.ts           (mảng users, tasks… trong bộ nhớ)
```

Bản thật chỉ là **tách 3 mảnh đó ra 3 nơi**:

```
[Trình duyệt: giao diện]  ──gọi API──▶  [API server]  ──đọc/ghi──▶  [Database]
```

Vẽ ra "có những phần nào chạy riêng, phần nào gọi phần nào" chính là **C4 mức 2**. (C4 mức 1 còn đơn giản hơn: cả TaskFlow là 1 hộp, xung quanh là người dùng và các dịch vụ bên ngoài như gửi email, AI.)

### Thêm hộp, mỗi hộp giải quyết một vấn đề

**Vấn đề 1: API server sập thì cả app chết.**
→ Chạy **2 bản API giống hệt nhau**, phía trước đặt một "người chia việc" (load balancer). Bản này chết, bản kia vẫn chạy.

```
                         ┌─▶ [API bản A]
[Trình duyệt] ─▶ [chia việc]
                         └─▶ [API bản B]
```

**Vấn đề 2: có 2 bản API thì realtime bị hỏng.**
- Ly mở board, kết nối vào **bản A**. Minh kết nối vào **bản B**.
- Minh kéo một task: bản B biết, còn bản A **không biết**, nên màn hình của Ly không đổi.

→ Thêm **Redis**, hãy hình dung như **nhóm chat giữa các bản API**. Bản B nhắn vào nhóm: "task X vừa chuyển sang In progress". Bản A đọc được và báo cho Ly.

**Vấn đề 3: có việc chậm, không nên bắt người dùng chờ** (ví dụ gửi email mời).
→ Thêm **Worker**: một "trợ lý" chạy riêng. API chỉ ghi "cần gửi email cho an@…" vào danh sách việc, rồi trả lời người dùng ngay. Worker lấy việc ra làm sau; email lỗi thì thử lại.

### Bản đồ hoàn chỉnh

```
[Trình duyệt] ─▶ [chia việc] ─▶ [API A] [API B] ─▶ [Postgres: dữ liệu thật]
                                    │      │
                                    └─▶ [Redis: nhóm chat + danh sách việc] ◀─ [Worker] ─▶ gửi email
                                    └─▶ dịch vụ AI (soạn task)
```

5 hộp: **Giao diện, API (2 bản), Worker, Postgres, Redis**. Không hộp nào thêm cho "pro"; mỗi hộp có một lý do.

**Một điều quan trọng:** Postgres là nơi duy nhất giữ dữ liệu thật. Redis mất thì chỉ chậm thông báo, không mất task nào.

---

## Phần 2. ERD = kiểu dữ liệu, vẽ thành hình

Mở `mocks/db.ts`, bạn đã có sẵn:

```ts
type Db = {
  users: ...;        // → bảng users        (ai dùng app)
  workspaces: ...;   // → bảng workspaces   (công ty / agency)
  memberships: ...;  // → bảng memberships  (ai thuộc workspace nào, role gì)
  projects: ...;     // → bảng projects
  tasks: ...;        // → bảng tasks
  activity: ...;     // → bảng activity_events (ai đổi gì, lúc nào)
};
```

ERD chỉ là vẽ các kiểu này thành **hộp**, rồi nối **mũi tên** cho quan hệ:

```
workspaces ──có nhiều──▶ projects ──có nhiều──▶ tasks
     │                                            │
     └──có nhiều──▶ memberships ◀──── users ──────┘ (được giao task)
```

Khác TypeScript ở 2 điểm, cả hai bạn đã gặp rồi:

| Database | Bạn đã dùng ở frontend |
| --- | --- |
| **Khoá ngoại**: `tasks.project_id` trỏ về project | `task.projectId` |
| **Index**: tra nhanh theo một cột | Dùng `Map` thay vì `array.find()` duyệt từ đầu đến cuối |

Bản thật có thêm vài bảng mà prototype không cần, ví dụ:
- `refresh_tokens`: để "giữ đăng nhập". Prototype giả lập việc này rất đơn giản.
- `project_viewers`: client được xem project nào. Prototype gộp nó vào `memberships`.

---

## Phần 3. Để dành cho giai đoạn 4 (không cần hiểu bây giờ)

Những từ này có trong bản tiếng Anh. Khi viết code ở giai đoạn 4, mỗi từ sẽ có ví dụ thật:

- **Optimistic locking / `version`**: cách phát hiện 2 người sửa cùng lúc. Bạn đã thấy nó chạy trong prototype (lỗi 409).
- **Outbox**: cách đảm bảo "thông báo realtime chỉ gửi khi dữ liệu đã lưu thật".
- **`COLLATE "C"`**: để database sắp xếp thứ tự task giống hệt trình duyệt.
- **Partial index**: index chỉ cho task chưa xong, để màn Today nhanh.

---

## Kiểm tra (chỉ 2 câu, trả lời ngắn)

1. Trong prototype, API giả và database giả nằm ở đâu? Sang bản thật, chúng thành hộp nào?
2. Vì sao có 2 bản API thì phải thêm Redis? (Gợi ý: Ly và Minh.)
