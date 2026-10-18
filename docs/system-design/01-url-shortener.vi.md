# System design: rút gọn link (bài mẫu)

Bản tiếng Việt của [`01-url-shortener.md`](01-url-shortener.md). Các câu "nói khi phỏng vấn" giữ nguyên tiếng Anh, có phần **Nghĩa**. Thuật ngữ (QPS, cache, TTL…) giữ tiếng Anh.

---

## 1. Requirements (5 phút)

**Nói khi phỏng vấn:**
> "Before designing, let me confirm the scope. Users paste a long URL and get a short one; anyone opening the short URL is redirected. Do we need custom aliases, expiry, and click analytics? Do users need accounts? And what scale should I design for?"

**Nghĩa:** Trước khi thiết kế, cho tôi chốt phạm vi: người dùng dán link dài, nhận link ngắn; ai mở link ngắn sẽ được chuyển hướng. Có cần alias tự đặt, hạn dùng, đếm lượt click không? Có cần tài khoản không? Thiết kế cho quy mô bao nhiêu?

Giả sử interviewer trả lời: có alias tự đặt và hạn dùng, có đếm click cơ bản, không cần tài khoản (có API key tùy chọn cho người dùng nhiều), 100 triệu link mới mỗi tháng.

**Chức năng (functional)**
1. Tạo link ngắn từ link dài; tùy chọn alias tự đặt và ngày hết hạn.
2. Chuyển hướng `short.ly/{code}` sang link dài.
3. Đếm số lượt click mỗi link.

Ngoài phạm vi: tài khoản, sửa link, thống kê chi tiết (vị trí, thiết bị).

**Phi chức năng (non-functional)**

| | Mục tiêu | Vì sao quan trọng |
| --- | --- | --- |
| Quy mô | 100 triệu link mới/tháng, đọc:ghi ≈ 100:1 | Đọc áp đảo → thiết kế đường đọc trước |
| Độ trễ | Redirect p99 < 50 ms (phía server) | Mỗi cú click đều chờ mình; phải gần như tức thì |
| Độ sẵn sàng | Redirect 99,99%; tạo link 99,9% | Redirect hỏng là làm hỏng trang, email, quảng cáo của người khác; tạo link lỗi thì ít hại hơn |
| Nhất quán | Link vừa tạo phải dùng được ngay (read-your-writes); số click được phép trễ | Số click là dữ liệu dẫn xuất → nhất quán sau là đủ |
| Bảo mật | Code không đoán được; giới hạn tốc độ tạo link | Code tăng dần thì ai cũng dò ra mọi link (kể cả link tài liệu riêng tư!) |

---

## 2. Ước lượng (3 phút)

**Nói khi phỏng vấn:**
> "100M links a month is about 3M a day, so roughly 40 writes per second, maybe 200 at peak. With 100 reads per write that's 4,000 redirects per second on average and 20k at peak. Over five years we store 6 billion links; at about 500 bytes each that's 3 TB. A 7-character base62 code gives 3.5 trillion combinations, far more than 6 billion. And if 20% of links get most of the traffic, the hot set fits in one Redis node."

**Nghĩa:** 100 triệu link/tháng ≈ 3 triệu/ngày ≈ 40 lượt ghi/giây, cao điểm ~200. Đọc gấp 100 lần → trung bình 4.000 redirect/giây, cao điểm 20k. 5 năm lưu 6 tỷ link × ~500 byte = 3 TB. Code 7 ký tự base62 cho 3.500 tỷ tổ hợp, dư xa so với 6 tỷ. Nếu 20% link nhận phần lớn lượt truy cập, phần "nóng" nằm gọn trong một node Redis.

| | Cách tính | Kết quả |
| --- | --- | --- |
| Ghi | 100 triệu / 30 ngày ≈ 3,3 triệu/ngày ÷ 100k giây | **~40 QPS**, cao điểm ~200 |
| Đọc | 40 × 100 | **~4k QPS**, cao điểm ~20k |
| Dung lượng (5 năm) | 100 triệu × 12 × 5 = 6 tỷ link × ~500 B | **~3 TB** |
| Độ dài code | 62⁶ = 57 tỷ (lâu dài sẽ chật), 62⁷ = 3.500 tỷ | **7 ký tự** (base62: `a–z A–Z 0–9`) |
| Cache | ~20% link nóng, ~20 triệu × 500 B | **~10 GB** → một node Redis |
| Băng thông | 20k × 500 B | ~10 MB/s, không đáng lo |

**Kết luận:** lượng ghi nhỏ; **thách thức là phục vụ 20k redirect/giây với độ trễ thấp và độ sẵn sàng cao**, và sinh code không trùng mà không cần các server phải phối hợp với nhau.

---

## 3. API (5 phút)

```http
POST /api/v1/urls
{ "longUrl": "https://…", "customAlias": "launch-2026", "expiresAt": "2027-01-01T00:00:00Z" }
→ 201 { "code": "aZ3k9Qx", "shortUrl": "https://short.ly/aZ3k9Qx", "expiresAt": … }
→ 409 nếu alias đã có người dùng · 422 nếu URL không hợp lệ · 429 nếu vượt giới hạn tốc độ

GET /{code}
→ 302 Location: https://…   (404 nếu không tồn tại, 410 Gone nếu đã hết hạn)

GET /api/v1/urls/{code}/stats
→ 200 { "clicks": 1234 }
```

**301 hay 302?** Câu này hay bị hỏi.
- **301 Moved Permanently**: trình duyệt nhớ luôn chỗ chuyển hướng, lần sau không hỏi mình nữa. Đỡ tải, nhưng **không thấy được các lần click lặp lại**, nên thống kê sai, và không đổi hay cho hết hạn link đó trên trình duyệt ấy được nữa.
- **302 Found** (hoặc 307): trình duyệt hỏi mình mỗi lần. Tốn tải hơn, nhưng **đếm click đúng và hạn dùng hoạt động**.
- Chọn **302**, vì đếm click và hạn dùng là yêu cầu. Phần tải tăng thêm đã có cache gánh.

---

## 4. Data model (5 phút)

```
urls
  code        varchar(7)  PRIMARY KEY
  long_url    text        NOT NULL
  created_at  timestamp
  expires_at  timestamp   NULL
  api_key_id  uuid        NULL

click_counts                       (do consumer analytics ghi bất đồng bộ)
  code        varchar(7)  PRIMARY KEY
  clicks      bigint
```

- Truy vấn nóng duy nhất là **"tìm theo code"**, tức tra theo khóa chính. Đường đọc không cần index nào khác.
- **Cùng một link dài tạo hai lần → hai code khác nhau.** Muốn gộp trùng thì phải có index trên `long_url` (hoặc hash của nó) và tra cứu mỗi lần ghi, lại còn trộn lẫn hạn dùng và thống kê của những người khác nhau. Không đáng.
- **Dùng database nào?** Kiểu truy cập thuần key-value với 6 tỷ dòng → **key-value store như DynamoDB** là hợp nhất: tự mở rộng ngang không cần tự chia shard, có sẵn TTL để xóa link hết hạn. Năm đầu dùng Postgres vẫn ổn (40 lượt ghi/giây chẳng là gì); lý do chuyển là dung lượng (3 TB trở lên), không phải tải.

---

## 5. Kiến trúc tổng thể (7 phút)

```
                  ┌──────────── đường ghi ─────────────┐
Client ─► LB ─► App servers (stateless) ─► Key-value DB
                  │        ▲
                  │        └── cache-aside ── Redis
                  │
                  └── sự kiện click ─► Queue (SQS/Kafka) ─► Consumer analytics ─► click_counts
```

- **App server không giữ trạng thái (stateless)** → tải tăng thì thêm server sau load balancer.
- **Redirect (đường đọc):** hỏi Redis trước; không có (miss) thì đọc DB rồi ghi vào cache.
- **Đếm click bất đồng bộ:** redirect chỉ đẩy một sự kiện vào queue rồi trả kết quả ngay; consumer cộng dồn sau. Hệ thống analytics chậm không bao giờ được làm chậm redirect.
- Ở quy mô này, tạo link và redirect có thể là một service; chỉ tách khi chúng cần scale hoặc deploy riêng.

---

## 6. Deep dive (15 phút)

### 6a. Sinh code không trùng

| Cách | Làm thế nào | Ưu | Nhược |
| --- | --- | --- | --- |
| **Hash link** | MD5/SHA-256 của link dài, giữ 7 ký tự base62 | Cùng link → cùng code | Cắt ngắn gây trùng → vẫn phải kiểm tra rồi thử lại; mà gộp trùng thì mình không cần |
| **Bộ đếm tự tăng** | Sequence của DB → base62 (1 → `b`, 2 → `c`…) | Không trùng | **Đoán được** (dò ra mọi link); một bộ đếm duy nhất là nút thắt và điểm hỏng duy nhất |
| **Bộ đếm theo dải** | Mỗi server mượn một dải số (ví dụ 1.000 ID) từ bộ đếm trung tâm, rồi mã hóa và xáo trộn | Không trùng, gần như không cần phối hợp | Thêm thành phần; phải có bước xáo trộn để code không bị đoán |
| **Code ngẫu nhiên** ✅ | 7 ký tự base62 ngẫu nhiên, insert kiểu "chỉ ghi nếu chưa tồn tại" | Stateless, không đoán được, đơn giản | Thỉnh thoảng trùng → thử lại |

**Chọn: code ngẫu nhiên + insert có điều kiện.** Xác suất trùng mỗi lần insert ≈ số link đã lưu ÷ không gian code = 6 tỷ ÷ 3.500 tỷ ≈ **0,2%, kể cả sau 5 năm**. Thử lại một lần gần như chắc chắn thành công. Đảm bảo không trùng đến từ database (`PRIMARY KEY` / conditional put của DynamoDB), không phải từ code ứng dụng, nên hai server không bao giờ cấp cùng một code.

> "If the interviewer pushes on 'avoid the retry entirely', I'd switch to counter ranges with a scramble step."

**Nghĩa:** Nếu interviewer muốn bỏ hẳn bước thử lại, tôi chuyển sang bộ đếm theo dải kèm bước xáo trộn.

### 6b. Phục vụ 20k redirect mỗi giây

1. **Cache-aside bằng Redis.** Tỷ lệ trúng cache 90% thì DB chỉ còn ~2k lượt đọc/giây, nhẹ nhàng với key-value store.
2. **TTL của cache**: 24 giờ, và không bao giờ dài hơn `expires_at` của chính link đó.
3. **Cache cả kết quả "không tồn tại" (negative caching)** trong vài phút. Nếu không, bot dò code ngẫu nhiên sẽ đánh thẳng vào DB ở mọi request.
4. **Kiểm tra hạn dùng khi đọc**: quá `expires_at` → trả 410, kể cả khi TTL chưa kịp xóa dòng đó.
5. **Link nóng** (một link bỗng viral): một key Redis có thể bị dồn tải → giữ thêm **cache trong bộ nhớ của từng app server** (vài giây) cho các code nóng nhất.

---

## 7. Điểm lỗi và mở rộng (5 phút)

**Nói khi phỏng vấn:**
> "Let me go through what breaks. If Redis goes down, redirects fall back to the database. Latency goes up, but they keep working, and I'd rate-limit to protect the DB. The database runs across availability zones; for 99.99% on redirects I'd replicate it to a second region, which is fine because links are written once and never change. The analytics queue can lag or even drop events without affecting redirects. Abuse is the real-world risk: rate-limit creation per IP and API key, and scan new URLs against a malware list asynchronously."

**Nghĩa:** Điểm qua những gì có thể hỏng. Redis sập thì redirect đọc thẳng DB: chậm hơn nhưng vẫn chạy, và tôi bật giới hạn tốc độ để bảo vệ DB. Database chạy trên nhiều availability zone; muốn redirect đạt 99,99% thì nhân bản sang region thứ hai, việc này ổn vì link ghi một lần và không bao giờ đổi. Queue analytics có trễ, thậm chí mất sự kiện, cũng không ảnh hưởng redirect. Rủi ro thực tế là bị lạm dụng: giới hạn tốc độ tạo link theo IP và API key, và quét link mới với danh sách mã độc một cách bất đồng bộ.

| Cái gì hỏng / tăng | Ảnh hưởng | Cách xử lý |
| --- | --- | --- |
| Redis sập | Redirect chậm hơn | Đọc thẳng DB, giới hạn tốc độ, có bản sao Redis |
| DB mất một AZ / region | Redirect lỗi | Multi-AZ; read replica ở region khác (link không đổi → độ trễ nhân bản vô hại) |
| Queue analytics bị dồn | Số click trễ | Yêu cầu cho phép; redirect không bị ảnh hưởng |
| Link spam / lừa đảo | Domain bị chặn | Giới hạn tốc độ tạo, quét mã độc bất đồng bộ, cờ gỡ link |
| Hai người tranh cùng alias | Trùng alias | Insert có điều kiện → người sau nhận 409 |
| Tải ×10 | 200k redirect/giây | Thêm app server, Redis cluster, DB chia partition theo `code` (hash phân bố đều); CDN cho các link nóng nhất |

---

## Tóm tắt 60 giây

> "It's a read-heavy key-value problem: about 40 writes and 4,000 reads per second, 3 TB over five years. Codes are 7 random base62 characters; uniqueness comes from a conditional insert, and collisions are rare enough to retry. Redirects use 302 so counts and expiry work, with Redis cache-aside, negative caching for unknown codes, and click counting pushed to a queue so it never slows a redirect down. Storage is a key-value store partitioned by code. The main risks are cache failure, which degrades to the DB, and abuse, which needs rate limiting and URL scanning."

**Nghĩa:** Đây là bài toán key-value đọc nhiều: ~40 lượt ghi và 4.000 lượt đọc mỗi giây, 3 TB trong 5 năm. Code là 7 ký tự base62 ngẫu nhiên; không trùng nhờ insert có điều kiện, trùng hiếm đến mức chỉ cần thử lại. Redirect dùng 302 để đếm click và hạn dùng hoạt động, có Redis cache-aside, cache cả kết quả "không tồn tại", và việc đếm click đẩy sang queue để không bao giờ làm chậm redirect. Lưu trữ bằng key-value store chia partition theo code. Rủi ro chính là cache hỏng (lùi về đọc DB) và bị lạm dụng (cần giới hạn tốc độ và quét link).
