# Ôn tập câu hỏi phỏng vấn (bản tiếng Việt)

Bản tiếng Việt của [`qa-review.md`](qa-review.md). Đọc bản này để hiểu ý, rồi **tập nói theo câu tiếng Anh** (giữ nguyên trong mỗi đáp án mẫu), vì phỏng vấn sẽ bằng tiếng Anh.

**Cách ôn:** đọc câu hỏi, tự trả lời thành tiếng trước (60–90 giây), rồi mới mở "Đáp án mẫu" để so sánh. Đánh dấu ✅ / 🔁 trong bảng "Nhật ký ôn tập" ở bản tiếng Anh.

Các câu dạng kể chuyện (Tell me about yourself, câu chuyện STAR) nằm ở [`stories.md`](stories.md).

---

## Q1. Sản phẩm: "Vì sao 'không làm app mobile native' là non-goal, nhưng web app vẫn phải chạy tốt ở 375px?"

*"Why is 'no native mobile app' a non-goal, but the web app must still work at 375px?"*

**Câu trả lời của mình (14/10):**
> Because of mobility abilities. At that time, we dont have enough resource to implement mobile, but at least stakeholder can view on mobile device

**Chỗ chưa ổn:** ý đúng (thiếu nguồn lực, stakeholder vẫn cần xem trên điện thoại), nhưng chưa nói rõ cái giá phải trả, chưa nói cụ thể ai cần, và chưa nêu khi nào sẽ xem xét lại.

<details><summary>Đáp án mẫu</summary>

> "A native app means a second codebase, app-store releases, and a team we don't have for v1. But our users still check status on their phones, especially viewers and leads between meetings. So a responsive web app covers that use case at a fraction of the cost. We'll revisit native only if mobile usage data shows people need things like push notifications or offline access."

**Nghĩa:** app native nghĩa là thêm một codebase nữa, phải phát hành qua app store, và cần một team mà v1 không có. Nhưng người dùng vẫn xem tình hình trên điện thoại, nhất là viewer và các lead giữa các cuộc họp. Vì vậy một web app responsive đáp ứng được nhu cầu đó với chi phí thấp hơn nhiều. Chỉ khi số liệu sử dụng trên mobile cho thấy người dùng cần những thứ như thông báo đẩy hay dùng offline thì mới xem xét làm app native.

**Bài học:** nói cái giá → ai cần → phương án rẻ hơn → **khi nào sẽ xem lại quyết định**.
</details>

---

## Q2. Sản phẩm/UX: "Bạn chọn layout nào cho màn hình task, vì sao?"

*"Which layout would you choose for the task screen, and why?"*

**Câu trả lời của mình (14/10):**
> I choose wireframes B and C based on the user's role. With viewers like stakeholders, wireframe C helps them have an overview of the current status: how many task that near the deadline, how many tasks are done, and how many are unassigned. stake holder is viewed-only so all buttons on wireframe C should be deleted. About B, leads and members can easily view priority and due date. I suggest having vertical drag-and-drop behavior to change task status, but each block (in progress, in review,...) should be more compact to be easier to view

**Chỗ chưa ổn:** ý tưởng chọn theo role rất tốt. Còn thiếu: vẫn giữ các nút đọc và điều hướng cho viewer, chỉ ẩn nút ghi; **ẩn nút không phải là bảo mật, API phải trả 403**; kéo thả cần có cách thay thế không cần kéo (WCAG 2.2, tiêu chí 2.5.7).

<details><summary>Đáp án mẫu</summary>

> "I'd pick the layout by role rather than one screen for everyone. For viewers like stakeholders, Option C gives a quick overview: what's overdue, what's due soon, what's done and what's unassigned. Since they have view-only access, we hide every action that changes data, and the API rejects those writes anyway. For leads and members, Option B makes priority and due dates easy to scan. I'd add vertical drag and drop between status groups and make the groups more compact, so we keep the realtime board experience without the wide Kanban layout."

**Nghĩa:** chọn layout theo role thay vì một màn cho tất cả. Với viewer như stakeholder, phương án C cho cái nhìn tổng quan nhanh: việc nào trễ, việc nào sắp đến hạn, bao nhiêu việc xong, bao nhiêu việc chưa ai nhận. Vì họ chỉ có quyền xem, ta ẩn mọi thao tác thay đổi dữ liệu, và API cũng từ chối các lệnh ghi đó. Với lead và member, phương án B giúp xem nhanh độ ưu tiên và hạn chót. Thêm kéo thả theo chiều dọc giữa các nhóm trạng thái và làm các nhóm gọn hơn, để vẫn giữ trải nghiệm board realtime mà không cần layout Kanban dàn ngang.

**Bài học:** ẩn trên UI = trải nghiệm người dùng; phân quyền = việc của backend. Luôn nói cả hai.
</details>

---

## Q3. Node.js: "Đoạn code này in ra gì, vì sao?"

*"What does this print, and why?"*

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
setImmediate(() => console.log('C'));
Promise.resolve().then(() => console.log('D'));
process.nextTick(() => console.log('E'));
console.log('F');
```

**Câu trả lời của mình (16/10):**
> A F E D B C. Explain: in JS, sync jobs have the highest priority, then async jobs. In async jobs, the priority is nextTick, promise - async await, libuv tasks (like setTimeout, I/O,...)

**Chỗ chưa ổn (8/10):** thứ tự đúng trong thực tế, nhưng **thứ tự giữa B và C không được đảm bảo khi chạy ở file chính** (setTimeout 0 thực ra là 1 ms). Bên trong một callback I/O thì setImmediate luôn chạy trước. Nên nêu tên các phase.

<details><summary>Đáp án mẫu</summary>

> "A and F first, because synchronous code runs to completion. Then the nextTick queue, so E, then promise microtasks, so D. Then the event loop phases: timers, where setTimeout's B runs, then poll for I/O, then check, where setImmediate's C runs. One caveat: in the main module the order of B and C isn't guaranteed, because a 0 ms timeout is really 1 ms and may not have expired when the loop first reaches the timers phase. Inside an I/O callback, setImmediate always runs before the timer."

**Nghĩa:** A và F chạy trước vì code đồng bộ luôn chạy hết. Tiếp theo là hàng đợi nextTick nên in E, rồi đến promise microtask nên in D. Sau đó là các phase của event loop: timers (chạy B của setTimeout), poll (xử lý I/O), rồi check (chạy C của setImmediate). Lưu ý: ở file chính, thứ tự B và C không đảm bảo, vì timeout 0 ms thực chất là 1 ms và có thể chưa hết hạn khi event loop vào phase timers lần đầu. Bên trong callback I/O thì setImmediate luôn chạy trước timer.

**Bài học:** đồng bộ → nextTick → promise → timers → poll → check → close; microtask được chạy hết giữa mỗi callback.
</details>

---

## Q4. Node.js / debug: "Mọi endpoint đều chậm, nhưng CPU chỉ 25% trên máy 4 core. Chuyện gì có thể đang xảy ra?"

*"Every endpoint is slow, but CPU is only 25% on a 4-core machine. What could be happening?"*

**Câu trả lời của mình (16/10):**
> Maybe some jobs take time; therefore all thread pool is exhausted, making the app blocked

**Chỗ chưa ổn (5/10):** thread pool bị dùng hết là giả thuyết thứ hai hợp lý, nhưng manh mối nằm ở con số: **25% của 4 core = 1 core đang chạy 100%**, tức thread JavaScript duy nhất đang bận → event loop bị chặn. Còn thiếu: cách xác nhận và cách sửa.

<details><summary>Đáp án mẫu</summary>

> "25% on four cores usually means one core is pegged, and Node runs JavaScript on a single thread. So my first suspect is something blocking the event loop: synchronous CPU work like parsing a huge JSON payload, a sync crypto call, or a slow regex. I'd confirm it by measuring event loop delay with `perf_hooks.monitorEventLoopDelay` and taking a CPU profile to find the hot function. The fix is to move that work off the main thread, with worker threads or a background job, and to run one process per core so all four are used. If event loop delay is low, requests are waiting on something else: the libuv thread pool (fs, DNS, crypto) or the database connection pool. Then I'd check pool usage and queue times."

**Nghĩa:** 25% trên 4 core thường có nghĩa một core đang chạy hết công suất, mà Node chạy JavaScript trên một thread duy nhất. Nên nghi ngờ đầu tiên là có thứ gì đó chặn event loop: tác vụ nặng CPU chạy đồng bộ, như parse một file JSON rất lớn, gọi hàm crypto đồng bộ, hay một regex chạy quá lâu. Xác nhận bằng cách đo độ trễ event loop với `perf_hooks.monitorEventLoopDelay` và chụp CPU profile để tìm hàm "nóng". Cách sửa: chuyển việc đó ra khỏi thread chính (worker threads hoặc job chạy nền), và chạy mỗi core một tiến trình để dùng hết 4 core. Nếu độ trễ event loop thấp thì request đang chờ thứ khác: thread pool của libuv (fs, DNS, crypto) hoặc connection pool của database. Khi đó kiểm tra mức sử dụng pool và thời gian xếp hàng.

**Bài học:** giả thuyết → cách đo → cách sửa → giả thuyết thứ hai. I/O mạng **không** dùng thread pool của libuv; fs, dns.lookup, crypto và zlib thì có dùng (mặc định 4 thread).
</details>

---

## Q5. Ước lượng: "Một hệ thống nhận 5 triệu request mỗi ngày. QPS trung bình là bao nhiêu? Lúc cao điểm thì sao?"

*"A system gets 5 million requests a day. What's the average QPS? And at peak?"*

**Câu trả lời của mình (16/10):**
> 50 QPS, cao điểm khoảng 150-250 QPS

**Chỗ chưa ổn:** không có. ✅

<details><summary>Đáp án mẫu</summary>

> "A day is about 100k seconds, so 5 million a day is roughly 50 QPS on average. Traffic isn't flat, so I'd plan for 3 to 5 times that at peak, around 150 to 250 QPS."

**Nghĩa:** một ngày khoảng 100.000 giây, nên 5 triệu request/ngày là khoảng 50 QPS trung bình. Lưu lượng không đều, nên lúc cao điểm tính gấp 3–5 lần, khoảng 150–250 QPS.

**Bài học:** 1 ngày ≈ 100.000 giây → 1 triệu request/ngày ≈ 10 QPS; cao điểm ≈ 3–5 lần trung bình.
</details>

---

## Q6. Tính nhất quán: "Trong TaskFlow, dữ liệu nào phải nhất quán mạnh, dữ liệu nào chấp nhận nhất quán sau?"

*"In TaskFlow, which data must be strongly consistent, and which can be eventually consistent?"*

**Câu trả lời của mình (16/10):**
> Theo t thì dữ liệu buộc nhất quán ngay là task, khi sửa hoặc xóa task thì nên đồng nhất về dữ liệu để tránh làm sai lệch thông tin. status của task có thể để stale, vì n chỉ ảnh hưởng việc hiển thị, data có thể sync up sau

**Chỗ chưa ổn:** trực giác đúng, ví dụ sai. **Status là một phần của task**: đổi status là một lần ghi, nên phải nhất quán (hai người cùng kéo một task → việc kiểm tra 409 phụ thuộc vào điều này). Thứ được phép trễ là **bản sao và các màn hiển thị**: màn hình của người khác được cập nhật qua realtime, dữ liệu đọc từ cache, các con số trên dashboard, activity feed, chỉ mục tìm kiếm. Còn thiếu: **quyền truy cập** phải nhất quán mạnh (thành viên bị xóa phải mất quyền ngay).

<details><summary>Đáp án mẫu</summary>

> "The source of truth has to be strongly consistent: every write to a task, including status and position, goes to a single Postgres primary in a transaction, with a version check so concurrent edits get a 409 instead of silently overwriting. Memberships and roles too, because revoking access must take effect immediately. What can be eventually consistent are derived views: the realtime push to other people's boards, cached task lists, the 'Today' counters, the activity feed and the search index. If those are a second or two behind, nobody is harmed, and it lets us use caching and async updates."

**Nghĩa:** dữ liệu gốc phải nhất quán mạnh: mọi lần ghi vào task, kể cả status và vị trí, đều đi vào một Postgres primary duy nhất trong một transaction, có kiểm tra version để hai người sửa cùng lúc thì người sau nhận 409 thay vì ghi đè âm thầm. Thành viên và role cũng vậy, vì thu hồi quyền phải có hiệu lực ngay. Những thứ được phép nhất quán sau là các màn hiển thị dẫn xuất: thông báo realtime tới board của người khác, danh sách task lấy từ cache, các con số trên màn Today, activity feed và chỉ mục tìm kiếm. Những thứ này trễ một hai giây thì không ai bị ảnh hưởng, và nhờ vậy ta dùng được cache và xử lý bất đồng bộ.

**Bài học:** nhất quán mạnh = **dữ liệu gốc + quyền truy cập**; nhất quán sau = **bản sao và màn hiển thị dẫn xuất** (realtime, cache, các con số, tìm kiếm).
</details>

---

## Q7. System design: "Thiết kế TaskFlow." Bước 1 (yêu cầu) và bước 2 (ước lượng)

*"Design TaskFlow." — Step 1 (requirements) and step 2 (estimates)*

**Câu trả lời bản 1 của mình (16/10):**
> 1.1 Functional: Leader can create workspace · Leader can create task, set due date · Leader can invite and remove member · Leader and member can assign task · Member can change task status
> 1.2 Non-functional: Scale: 2k workspace, 50k user · Latency: open board less than 2s, realtime in 300ms · availability: 99.9% · Consistency: all data related to workspace, project and task must be strong consistency, data in cache and use to display can be stale · Security: leader and member cannot view other project that not involve, viewer can only view project that they are invited
> 2. Estimate: 100 workspace, 1000 each, 10% · each user can write 30, read 60 · QPS for write is 100 * 1000 * 10 % * 30 / 86400, for read is 100 * 1000 * 10 % * 60 / 86400, r/w ratio is 2/1. memory i assume is 15gb

**Chỗ chưa ổn:** các con số mâu thuẫn nhau (50k và 100k user, 1.000 người mỗi workspace trong khi PRD là 3–15 người); "Leader" không phải là một role; thiếu kéo thả và realtime (phần khó nhất); thiếu cách ly tenant; độ trễ tính theo tải trang thay vì p95 của API; ước lượng dừng ở công thức (chưa ra số, chưa có kết luận); "memory" phải là dung lượng lưu trữ, và cần có cách tính; chưa ước lượng số kết nối WebSocket.

<details><summary>Đáp án mẫu</summary>

Xem [`docs/architecture/01-requirements-and-estimates.vi.md`](../architecture/01-requirements-and-estimates.vi.md) (bản tiếng Việt) hoặc [bản tiếng Anh](../architecture/01-requirements-and-estimates.md).

Bản nói (khoảng 60 giây):
> "Functionally: accounts, workspaces with four roles, tasks with comments and attachments, drag-and-drop with live updates for everyone on the board, a Today overview, search, and AI task drafts. Out of scope: sprints, billing, native apps.
> Year one: 2,000 workspaces of about ten people, so 20k users, half active daily. Sixty reads and ten writes each gives about 6 read QPS and 1 write QPS on average, maybe 30 and 5 at peak, plus around 4,000 concurrent WebSocket connections and 25 GB of data a year.
> So scale isn't the problem: one Postgres primary is plenty. But I still need at least two API instances for 99.9% availability, which means Redis pub/sub so realtime events reach users on either instance. The real challenges are correctness: tenant isolation, concurrent edits, and ordering — that's where I'd go deep."

**Nghĩa:** về chức năng: tài khoản, workspace với bốn role, task có comment và file đính kèm, kéo thả và mọi người trên board thấy thay đổi ngay, màn tổng quan Today, tìm kiếm, và AI soạn task. Ngoài phạm vi: sprint, thanh toán, app native.
Năm đầu: 2.000 workspace, mỗi workspace khoảng 10 người, tức 20k user, một nửa hoạt động mỗi ngày. Mỗi người 60 lần đọc và 10 lần ghi, ra khoảng 6 QPS đọc và 1 QPS ghi trung bình, cao điểm khoảng 30 và 5, cộng thêm khoảng 4.000 kết nối WebSocket cùng lúc và 25 GB dữ liệu mỗi năm.
Vậy quy mô không phải vấn đề: một Postgres primary là quá đủ. Nhưng vẫn cần ít nhất hai instance API để đạt 99.9% availability, nghĩa là cần Redis pub/sub để sự kiện realtime tới được người dùng ở instance nào cũng vậy. Thử thách thật nằm ở tính đúng đắn: cách ly tenant, ghi đồng thời và sắp thứ tự. Đó là phần sẽ đào sâu.

**Bài học:** giả định → phép tính → con số → **kết luận**. Kết luận mới là phần được chấm điểm.
</details>

---

## Q8. Câu hỏi vặn về ước lượng TaskFlow

*"(a) One Node instance can hold 4,000 connections — why run two? (b) Reads are 6:1 — why no cache yet? (c) At 10× scale, what changes first?"*

**Câu hỏi:** (a) Một Node instance chứa được 4.000 kết nối, vậy sao phải chạy hai? (b) Đọc nhiều gấp 6 lần ghi, sao chưa cần cache? (c) Lớn gấp 10 lần thì thứ gì thay đổi trước tiên?

**Câu trả lời của mình (17/10):**
> 1. cần 2 instance để đạt 99.9% và deploy không gián đoạn
> 2. vì 35 QPS là nhỏ với postgres
> 3. thêm read replica db

**Chỗ chưa ổn:** (a) ✅ (b) ✅, có thể nói thêm rằng cache kéo theo độ phức tạp khi phải làm mới dữ liệu (invalidation), nên chỉ thêm khi đã đo được nhu cầu. (c) đúng một phần: read replica là một lựa chọn, nhưng thứ chạm giới hạn đầu tiên là **lớp realtime** (~40k kết nối → cần thêm instance); database vẫn ổn nếu có index tốt.

<details><summary>Đáp án mẫu</summary>

> (a) "Not for load — for availability. With one instance, a crash or a deploy drops every connection. Two instances behind a load balancer give 99.9% and rolling deploys; Redis pub/sub keeps events flowing between them."
> (b) "30 read QPS on a small dataset is easy for Postgres with the right indexes. A cache adds invalidation bugs and stale data, so I'd add it only for a hot path I've actually measured."
> (c) "At 10× we'd have ~40k concurrent connections, so the realtime tier scales out first. The database is still one primary at ~350 QPS; I'd check slow queries and maybe add a read replica for the heavy Today overview queries."

**Nghĩa:**
(a) Không phải vì tải mà vì độ sẵn sàng. Chỉ một instance thì khi nó sập hoặc khi deploy, mọi kết nối đều mất. Hai instance sau load balancer giúp đạt 99.9% và deploy cuốn chiếu; Redis pub/sub giữ cho sự kiện được truyền qua lại giữa hai instance.
(b) 30 QPS đọc trên một tập dữ liệu nhỏ là việc dễ với Postgres nếu có index đúng. Cache kéo theo lỗi làm mới dữ liệu và dữ liệu cũ, nên chỉ thêm cho chỗ "nóng" đã đo được thật.
(c) Lớn gấp 10 lần sẽ có khoảng 40k kết nối cùng lúc, nên lớp realtime phải mở rộng trước. Database vẫn là một primary với khoảng 350 QPS; kiểm tra các truy vấn chậm và có thể thêm read replica cho các truy vấn nặng của màn Today.

**Bài học:** mỗi thành phần thêm vào đều có cái giá; hãy biện minh bằng một con số hoặc một yêu cầu.
</details>
