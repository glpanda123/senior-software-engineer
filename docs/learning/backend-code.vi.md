# Đọc code backend TaskFlow bằng tiếng Việt

Bản dịch toàn bộ comment trong `apps/api` (repo taskflow), cập nhật đến PR #21 (09/11/2026). Code và comment gốc vẫn bằng tiếng Anh vì repo là portfolio công khai. File này để đọc song song.

**Cách dùng:** mở file code bên cạnh, tìm theo số dòng ở cột "Dòng". Số dòng có thể lệch vài dòng khi code thay đổi; tìm theo nội dung là chắc nhất.

**Thứ tự đọc** đi theo đường đi của một request: cấu hình → database → phần dùng chung → đăng nhập → phân quyền → workspace/project → task → test.

---

## 1. Cấu hình

### `vitest.config.mts` (chạy test)

| Dòng | Nghĩa |
| --- | --- |
| 5–6 | NestJS tự tạo các dependency trong constructor dựa vào "decorator metadata" mà TypeScript sinh ra. esbuild (trình biên dịch mặc định của Vitest) không sinh metadata này, còn SWC thì có, nên dùng SWC. |
| 14 | Chỉ có một database cho test, nên các file test chạy lần lượt, không chạy song song. |
| 17 | Nhóm `unit`: hàm thuần, không cần database. `pnpm test:unit` chạy được trên mọi máy. |
| 19 | Nhóm `e2e`: gọi HTTP thật vào app, dùng Postgres thật. |

### `eslint.config.mjs` (lint)

| Dòng | Nghĩa |
| --- | --- |
| 1–2 | Hàng rào cho code backend. Các luật "hiểu kiểu dữ liệu" bắt những lỗi gây hại nhất trên server: quên `await` khi ghi database, hoặc một promise không ai xử lý lỗi. |
| 24 | Trong test, body JSON trả về từ supertest không có kiểu, nên nới vài luật cho thư mục test. |

---

## 2. Database

### `prisma/schema.prisma`

| Dòng | Nghĩa |
| --- | --- |
| 1–4 | Schema được dựng dần từng phần theo `docs/architecture/02-data-model.md`. Buổi 1 (đăng nhập): users, refresh tokens, và các bảng workspace mà `/me` đọc. Buổi 2 (phân quyền): projects và project_viewers. Buổi 3 (task): tasks. |
| 22 | Thứ tự khai báo enum `TaskStatus` chính là thứ tự cột trên board. Postgres so sánh enum theo thứ tự khai báo. |
| 53–54 | Mỗi refresh token đã cấp là một dòng; chỉ lưu mã băm SHA-256, không lưu token thật. Các token sinh ra từ cùng một lần đăng nhập thuộc cùng một "family"; dùng lại một token đã dùng thì cả family bị thu hồi. |
| 110 | Chỉ có membership vai trò viewer thì chưa xem được gì: mỗi project mà viewer được xem phải có một dòng ở bảng này. |
| 125 | `workspace_id` được chép từ project sang task, để lọc theo tenant không cần JOIN. |
| 134 | `position` là khóa phân số, so sánh từng byte; migration thêm `COLLATE "C"` để Postgres sắp đúng như vậy. |
| 136 | `version` là khóa lạc quan: mỗi lần ghi tăng 1; PATCH hoặc move gửi version cũ thì trả 409. |

### `prisma/migrations/*/migration.sql`

Các dòng `-- CreateTable`, `-- CreateIndex`, `-- AddForeignKey`… do Prisma tự sinh, chỉ là nhãn ("tạo bảng", "tạo index", "thêm khóa ngoại"). Hai comment mình viết tay:

| File | Nghĩa |
| --- | --- |
| `…_auth`, dòng 1 | Email không phân biệt hoa thường (cột `users.email` có kiểu CITEXT). |
| `…_tasks`, dòng 18 | Khóa phân số phải sắp theo từng byte, giống như trình duyệt và thư viện `fractional-indexing`. |

---

## 3. Phần dùng chung

### `src/app.ts`

| Dòng | Nghĩa |
| --- | --- |
| 6 | Hàm tạo app với đúng mọi thứ production dùng; `main.ts` và test dùng chung hàm này. |

### `src/common/problem.ts` (định dạng lỗi)

| Dòng | Nghĩa |
| --- | --- |
| 1–3 | Lỗi trả về theo chuẩn RFC 9457 "problem details" (`application/problem+json`), đúng hình dạng mà schema `Problem` và `ValidationProblem` trong contract mô tả. |
| 34 | Cùng một câu trả lời cho "không tồn tại" và "có tồn tại nhưng bạn không được xem". |
| 38 | Lỗi 409 khi `version` đã cũ: body kèm bản hiện tại của dữ liệu (schema `ConflictProblem`). |
| 68 | Lỗi của chính NestJS (đường dẫn không tồn tại → 404, JSON hỏng → 400). |
| 75 | Không bao giờ để lộ chi tiết bên trong cho client; ghi vào log thay vào đó. |

### `src/common/contract.ts` (kiểm tra body theo contract)

| Dòng | Nghĩa |
| --- | --- |
| 1–3 | Kiểm tra request trực tiếp bằng contract OpenAPI (theo ADR-001). Schema trong `openapi.yaml` là nơi duy nhất viết một quy tắc như "mật khẩu ≥ 8 ký tự". |
| 27 | Ném lỗi 422 nếu `body` không khớp schema `components/schemas/<tên>`. |

### `src/common/input.ts`

| Dòng | Nghĩa |
| --- | --- |
| 5 | Kiểm tra trước khi giá trị đi tới cột kiểu uuid: Postgres từ chối giá trị sai bằng một lỗi, và lỗi đó sẽ thành 500. |
| 8–10 | Tên hoặc tiêu đề bắt buộc, đã cắt khoảng trắng. Quy tắc `minLength: 1` của contract tính cả dấu cách, nên `"   "` vẫn qua; hàm này chặn nó bằng lỗi 422 cùng dạng. |

---

## 4. Đăng nhập

### `src/auth/tokens.ts`

| Dòng | Nghĩa |
| --- | --- |
| 1–10 | Hai loại token. **Access token:** JWT có chữ ký, hạn 15 phút, giữ trong bộ nhớ trình duyệt, gửi qua header `Authorization: Bearer …`. Bản API nào cũng tự kiểm tra được mà không cần hỏi database, nhờ vậy API không giữ trạng thái và chạy được nhiều bản sau load balancer. **Refresh token:** chuỗi ngẫu nhiên dài, hạn 30 ngày, nằm trong cookie httpOnly. Database chỉ giữ mã băm SHA-256 của nó, nên dù database bị lộ cũng không dùng được để đăng nhập thay ai. |
| 24 | Tham số `ttlSeconds` chỉ test mới đổi (giá trị âm tạo ra một token đã hết hạn). |
| 35 | Trả về id người dùng, hoặc `null` nếu token sai định dạng, bị sửa, hoặc đã hết hạn. |

### `src/auth/auth.guard.ts`

| Dòng | Nghĩa |
| --- | --- |
| 8 | Bắt buộc có `Authorization: Bearer <access token>`; gắn id người dùng vào request. |

### `src/auth/auth.service.ts`

| Dòng | Nghĩa |
| --- | --- |
| 17 | Thứ mà đăng nhập trả về: body JSON, cộng với refresh token để đặt vào cookie. |
| 20–21 | Khi email không tồn tại, vẫn kiểm tra mật khẩu với một mã băm giả. Nhờ vậy "không có tài khoản" mất thời gian y như "sai mật khẩu", và thời gian phản hồi không để lộ email nào đã đăng ký. |
| 37–38 | Ràng buộc UNIQUE trên cột email (kiểu citext) quyết định email trùng, không phải một câu tìm kiếm trước: hai người đăng ký cùng email cùng lúc không thể cùng thành công. |
| 58–61 | Xoay vòng: mỗi refresh token chỉ dùng được một lần. Dùng nó thì nó bị đánh dấu đã dùng, và token kế tiếp cùng family được cấp. Thấy lại một token đã dùng nghĩa là có hai bên đang giữ nó (một bên có lẽ là kẻ tấn công), nên thu hồi cả family. |
| 85–88 | Đánh dấu token đã dùng, nhưng chỉ khi nó vẫn chưa dùng, trong **một** câu lệnh. Nếu hai request vừa cùng đọc thấy "chưa dùng", chỉ một trong hai nhận `true` ở đây. (Đọc rồi mới ghi, tách hai bước, sẽ để cả hai lọt qua: đây chính là race condition đứng sau luật 409.) |

---

## 5. Phân quyền

### `src/access/policy.ts`

| Dòng | Nghĩa |
| --- | --- |
| 1–3 | Ai được làm gì: toàn bộ luật phân quyền của TaskFlow trong một hàm thuần. Không database, không NestJS: nhận vào dữ kiện, trả ra quyết định, nên rất dễ test. |
| 5–13 | Bảng luật (PRD v1.3, mục "Rules" 1 và 5 trong `02-data-model.md`), xem bảng bên dưới. |
| 15–19 | Vì sao có hai kiểu "không". **403 forbidden:** bạn ở trong workspace và thấy được thứ đó, nhưng vai trò không cho phép làm việc này (member tạo project). **404 not-found:** bạn không được biết thứ đó tồn tại (người ngoài workspace, hoặc viewer hỏi một project mình không được mời). |
| 29 | Vai trò của người gọi trong workspace, hoặc `null` nếu không phải thành viên. |
| 31 | Với các hành động ở cấp project: người gọi có dòng `project_viewers` cho project này không? |
| 36 | Ngoài workspace: giấu mọi thứ, với mọi hành động. |
| 41 | Mọi thành viên đều được xem danh sách; viewer nhận danh sách đã lọc (việc lọc làm trong câu truy vấn). |
| 49 | Viewer không được biết sự tồn tại của project mà họ không được mời. |

| Hành động | owner | admin | member | viewer | không phải thành viên |
| --- | --- | --- | --- | --- | --- |
| `project:list` | cho phép | cho phép | cho phép | cho phép (chỉ thấy project được mời) | 404 |
| `project:create` | cho phép | cho phép | 403 | 403 | 404 |
| `project:read` | cho phép | cho phép | cho phép | cho phép nếu được mời, không thì 404 | 404 |
| `task:create` | cho phép | cho phép | cho phép | 403 nếu được mời, không thì 404 | 404 |
| `task:update` | cho phép | cho phép | cho phép | 403 nếu được mời, không thì 404 | 404 |

### `src/access/access.service.ts`

| Dòng | Nghĩa |
| --- | --- |
| 8–10 | Lấy dữ kiện từ database, hỏi `policy.decide()`, và đổi câu trả lời "không" thành 403 hoặc 404. Mọi API đụng tới dữ liệu workspace đều đi qua đây. |
| 16 | Cho hành động trên một workspace (xem danh sách hoặc tạo project). Trả về vai trò của người gọi. |
| 27–29 | Cho hành động bên trong một project (các task của nó). Workspace lấy từ dòng project trong database, không bao giờ lấy từ URL, nên chỉ có id project thì không với tới được tenant khác. |
| 52 | Cho hành động trên một task: project của task quyết định, không lấy gì từ URL. |

---

## 6. Workspace và project

### `src/workspaces/workspaces.controller.ts`

| Dòng | Nghĩa |
| --- | --- |
| 13 | Ai đã đăng nhập cũng tạo được workspace; người tạo thành owner (một câu insert, nguyên khối). |

### `src/projects/projects.controller.ts`

| Dòng | Nghĩa |
| --- | --- |
| 34 | Viewer: chỉ những project họ được mời. |

---

## 7. Task

### `src/tasks/tasks.controller.ts` (`/projects/:id/tasks`)

| Dòng | Nghĩa |
| --- | --- |
| 25 | Một tham số query chỉ được xuất hiện tối đa một lần, ở dạng chữ thường. |
| 32 | Chuyển query string thành bộ lọc có kiểu, theo quy tắc của contract (sai thì 422). |

### `src/tasks/task.controller.ts` (`/tasks/:id`)

| Dòng | Nghĩa |
| --- | --- |
| 18 | Một task, gọi bằng chính id của nó (xem ghi chú phía trên `/tasks/{taskId}` trong `openapi.yaml`). |
| 44 | Một hành động POST, không phải PATCH trường `position`: server tự tính khóa (theo `openapi.yaml`). |

### `src/tasks/tasks.service.ts`

| Dòng | Nghĩa |
| --- | --- |
| 16 | Thứ tự cột trên board; khớp với thứ tự enum `TaskStatus` trong Postgres. |
| 21 | Cursor kiểu keyset: khóa sắp xếp của task cuối cùng trên trang. Client coi nó là chuỗi mờ, không cần hiểu bên trong. |
| 36 | Rơi xuống dòng dưới (để báo lỗi cursor không hợp lệ). |
| 72 | Cuối cột của nó: một khóa nằm sau khóa cuối cùng hiện có. |
| 107–108 | "Sau (s, p, i)" theo thứ tự board. Prisma không so sánh lớn hơn được với enum, nên "một cột phía sau" được viết thành danh sách các trạng thái phía sau. |
| 143–145 | PATCH: chỉ trường được gửi mới đổi; `null` xóa giá trị của trường cho phép rỗng. Việc ghi nằm ở `updateIfVersion()`; hàm này đổi kết quả của nó thành 200 hoặc 409. |
| 161 | 0 dòng được sửa: có người đã lưu xen vào (hoặc đã xóa task). Gửi về bản đang có. |
| 166–170 | *(Comment cũ từ lúc giao bài, sẽ xóa ở PR sau vì bạn đã viết xong.)* Ghi theo khóa lạc quan trong **một** câu lệnh: áp dụng `changes` và tăng `version` thêm 1, nhưng chỉ khi version đang lưu vẫn là `expectedVersion`. Trả `true` nếu lần gọi này sửa được dòng, `false` nếu không. Gợi ý: `AuthService.claim()` làm đúng việc này cho refresh token (Q13). |
| 191–193 | Kéo-thả: đổi trạng thái và/hoặc đặt vào giữa hai thẻ. Server sở hữu `position`; chỉ một dòng này được ghi. Cùng luật 409 như PATCH. |
| 196–197 | Cột đích như hiện tại, theo thứ tự board, không tính thẻ đang kéo. Mỗi cột trong v1 tối đa vài trăm thẻ, nên đọc khóa của cả cột vẫn rẻ. |
| 222 | Luật tenant: chỉ người làm trong cùng workspace mới được giao task. |

### `src/tasks/position.ts` (kéo-thả)

| Dòng | Nghĩa |
| --- | --- |
| 1–10 | Thẻ được kéo sẽ nằm ở đâu, tính bằng khóa phân số (xem rule 3 trong `02-data-model.md`). Client nói "đặt giữa `afterId` và `beforeId`" (hai thẻ sẽ nằm ngay trên và ngay dưới nó). Không bao giờ đánh số lại cả cột: chọn một khóa **mới** nằm giữa khóa của hai hàng xóm, nên chỉ dòng được kéo bị ghi. Ví dụ: cột `a0 ─ a1 ─ a2`; kéo vào giữa `a0` và `a1` → `generateKeyBetween('a0', 'a1') = 'a0V'`; kết quả `a0 ─ a0V ─ a1 ─ a2`. |
| 16 | Một hàng xóm không có trong cột đích: hình ảnh board phía client đã cũ. |
| 23–26 | `column`: cột đích theo thứ tự board, **không gồm** thẻ đang kéo. `afterId`: thẻ sẽ nằm ngay trên (`null`: không gửi). `beforeId`: thẻ sẽ nằm ngay dưới (`null`: không gửi). |
| 39–41 | Gửi cả hai: chúng phải nằm sát nhau, đúng thứ tự. Nếu giờ có thẻ khác nằm giữa, board phía client đã cũ: một khóa "ở giữa" chúng có thể trùng đúng khóa của thẻ đó, và hai thẻ sẽ có cùng vị trí. |
| 49–50 | Chỉ gửi "phía trên": biên dưới là chính thẻ đó; biên trên là thẻ đang nằm ngay dưới nó (hoặc không có, nếu nó là thẻ cuối). |
| 56 | Chỉ gửi "phía dưới": ngược lại với nhánh phía trên. |
| 58–59 | Biên trên là chính thẻ đó; biên dưới là thẻ đang nằm ngay **trên** nó (hoặc không có, nếu nó là thẻ đầu). |
| 64 | Không gửi gì: cuối cột. |

---

## 8. Test

Tên mỗi test (`it('…')`) là một quy tắc viết bằng câu. Đọc tên test là biết hệ thống phải làm gì.

### Thiết lập test

| File | Dòng | Nghĩa |
| --- | --- | --- |
| `test/global-setup.ts` | 4 | Đưa database test lên migration mới nhất trước khi chạy bất kỳ test nào. |
| `test/test-database-url.ts` | 7–11 | Database mà test e2e dùng. Test xóa sạch nó, nên nó không bao giờ được là database của app. Thứ tự tìm: `TEST_DATABASE_URL` (biến shell, rồi file `apps/api/.env`) → `DATABASE_URL` từ shell (CI) → Postgres trên máy. `DATABASE_URL` trong `.env` là database của app và không bao giờ được đọc ở đây. |

### `test/auth.e2e.test.ts`

Đầu file (1–3): test đăng nhập từ đầu đến cuối, gọi HTTP thật vào app Nest và Postgres thật. Mỗi `it` là một quy tắc lấy từ contract (`openapi.yaml`) hoặc thiết kế (`03-sequences.md`). Dòng 19: lấy cookie `refresh_token` từ response, ở dạng `refresh_token=…` (đúng thứ trình duyệt gửi lại).

| Nhóm | Test | Nghĩa |
| --- | --- | --- |
| Đăng ký | creates the account… | Tạo tài khoản, trả access token và đặt cookie refresh httpOnly. |
| | stores an argon2id hash… | Lưu mã băm argon2id, không bao giờ lưu mật khẩu. |
| | rejects an email that is already registered… | Từ chối email đã đăng ký, bất kể viết hoa hay thường (409). |
| | validates against the contract… | Kiểm tra theo contract: mật khẩu dưới 8 ký tự là 422, kèm tên field. |
| | rejects a name that is only spaces… | Từ chối tên chỉ toàn dấu cách (422, kèm field). |
| Đăng nhập | logs in with the right password | Đăng nhập được với mật khẩu đúng. |
| | gives the same 401… | Sai mật khẩu và email không tồn tại nhận cùng một lỗi 401 (không cho dò danh sách tài khoản). |
| `/me` | needs an access token | Cần access token. |
| | rejects an expired access token | Từ chối access token đã hết hạn. |
| | returns the user and their workspaces with roles | Trả người dùng và các workspace kèm vai trò. |
| Refresh | swaps the refresh token for a new one… | Đổi refresh token lấy cái mới và trả access token mới. |
| | treats reuse of an old token as theft… | Coi việc dùng lại token cũ là bị trộm: thu hồi cả family. (Dòng 165–167: ai đó phát lại token đầu tiên, ví dụ bị đánh cắp → 401; và token mới hợp lệ cũng chết theo: mọi người phải đăng nhập lại.) |
| | claims a token at most once… | Mỗi token chỉ được "nhận" tối đa một lần, kể cả khi hai request cùng thấy nó chưa dùng. (Dòng 172–173: tạo race condition một cách chắc chắn: cả hai request đã đọc dòng là "chưa dùng", giờ cùng đánh dấu. Chỉ một được thắng.) |
| | lets only one of two simultaneous refreshes… win | Hai lần refresh cùng lúc bằng cùng một token: chỉ một thắng. |
| | rejects a missing or unknown token | Từ chối khi thiếu token hoặc token lạ. |
| Đăng xuất | revokes the session and clears the cookie | Thu hồi phiên và xóa cookie. |

### `test/rbac.e2e.test.ts`

Đầu file (1–4): test vai trò và cách ly tenant. Dàn nhân vật: workspace Acme có mỗi vai trò một người, cộng một người ngoài sở hữu workspace khác (Globex). Dòng 30: lấy danh sách id (hoặc tên) project trong response, đúng thứ tự. Dòng 37: chức năng mời làm sau; tạm thời thêm thành viên thẳng vào database.

| Test | Nghĩa |
| --- | --- |
| makes the creator the owner | Người tạo workspace thành owner. |
| needs a name (422) and a login (401) | Cần tên (422) và cần đăng nhập (401). |
| lets the owner and an admin create a project | Owner và admin tạo được project. |
| refuses a member and a viewer with 403… | Member và viewer nhận 403: họ ở trong workspace nhưng vai trò quá thấp. |
| rejects a name that is only spaces (422) | Từ chối tên chỉ toàn dấu cách. |
| shows owner, admin and member every project… | Owner, admin, member thấy mọi project trong workspace. |
| shows a viewer only the projects they were invited to | Viewer chỉ thấy project được mời. |
| never lists another workspace's projects | Không bao giờ liệt kê project của workspace khác. |
| answers an outsider with 404, not 403… | Người ngoài nhận 404 chứ không phải 403, cả khi đọc lẫn khi ghi. |
| gives the same 404 for a real workspace you are not in and one that does not exist | Cùng một lỗi 404 cho workspace có thật mà bạn không thuộc về, và workspace không tồn tại. |

### `test/tasks.e2e.test.ts`

Đầu file (1–4): Task phần 1, tạo và xem. Cùng dàn nhân vật như `rbac.e2e`.

| Test | Nghĩa |
| --- | --- |
| creates a task with the contract defaults and a Location header | Tạo task với giá trị mặc định theo contract, và header `Location`. |
| keeps the fields it was given | Giữ đúng các trường được gửi. |
| refuses a viewer with 403 on a project they can see, and 404 on one they cannot | Viewer nhận 403 ở project họ thấy được, 404 ở project không thấy. |
| answers an outsider with 404 and writes nothing | Người ngoài nhận 404 và không có gì được ghi. |
| only assigns people who work in the workspace | Chỉ giao task cho người làm trong workspace (422 ở `assigneeId`). |
| validates against the contract: empty title, bad date | Kiểm tra theo contract: tiêu đề rỗng, ngày sai định dạng. |
| puts each new task at the bottom of its own column | Task mới luôn nằm cuối cột của nó. |
| returns tasks in board order… | Trả task theo thứ tự board: từng cột, rồi theo vị trí. |
| sorts positions byte by byte (COLLATE "C")… | Sắp vị trí theo từng byte: `a0Z` đứng trước `a0a`. (Dòng 164: collation theo ngôn ngữ sẽ đặt `a0a` lên trước; trình duyệt và mock so sánh theo byte. Dòng 175–176: thứ tự trên vẫn đúng trên database mà collation mặc định đã là "C", nên kiểm tra thêm collation của cột; nếu migration mất `COLLATE` thì test đỏ trên mọi database.) |
| lets an invited viewer read, and hides the project from everyone else | Viewer được mời thì đọc được; người khác không thấy project. |
| filters by status and by assignee | Lọc theo trạng thái và người được giao. |
| pages with a cursor across columns, without gaps or repeats | Phân trang bằng cursor qua nhiều cột, không sót và không lặp. |
| rejects a bad cursor, status or limit with 422 | Từ chối cursor, trạng thái hay `limit` sai bằng 422. (Dòng 230: JSON đúng định dạng nhưng id bên trong không phải UUID: không được để nó đi tới database.) |

### `test/task-update.e2e.test.ts`

Đầu file (1–4): Task phần 2, xem một task và sửa với khóa lạc quan. Luật (rule 2 của data model): mỗi lần ghi nêu rõ version mà nó dựa vào; nếu có người lưu xen vào, câu trả lời là 409 kèm task hiện tại.

| Test | Nghĩa |
| --- | --- |
| returns the task to anyone who can see its project | Trả task cho bất kỳ ai thấy được project của nó. |
| hides it (404) from an uninvited viewer and from outsiders | Giấu (404) với viewer không được mời và người ngoài. |
| changes only the fields sent, bumps the version, keeps the rest | Chỉ đổi trường được gửi, tăng version, giữ nguyên phần còn lại. |
| clears nullable fields with null | Gửi `null` để xóa giá trị các trường cho phép rỗng. |
| rejects a stale version with 409… | Version cũ thì 409 kèm task hiện tại, và không ghi gì. |
| lets the loser retry with the version from the 409 body | Người thua thử lại được bằng version lấy từ body của 409. |
| applies a version at most once… | Một version chỉ được áp dụng tối đa một lần, kể cả khi hai lần ghi cùng đọc nó. (Dòng 160: tạo race chắc chắn: cả hai đều tin version 1 là hiện tại.) |
| lets exactly one of two simultaneous edits win over HTTP | Hai lần sửa cùng lúc qua HTTP: đúng một thắng. |
| does not bump the version on a 409 | Không tăng version khi trả 409. |
| refuses an invited viewer (403) and hides the task from outsiders (404) | Viewer được mời nhận 403; người ngoài nhận 404. |
| validates the body… | Kiểm tra body: bắt buộc có version, có ít nhất một thay đổi, giá trị hợp lệ. |

### `test/task-move.e2e.test.ts`

Đầu file (1–3): Task phần 3, kéo-thả. Client nêu hàng xóm; server chọn khóa. Dòng 47: board như client thấy, dạng `{ todo: [tiêu đề…], in_progress: […], … }`. Dòng 87: board Website ban đầu: todo `[A, B, C]`, in_progress `[P]`.

| Test | Nghĩa |
| --- | --- |
| reorders inside a column, writing only the moved card | Đổi thứ tự trong một cột, chỉ ghi thẻ được kéo. (Dòng 100: A và B giữ nguyên khóa và version: không đánh số lại cột.) |
| moves to another column at the bottom when no neighbour is given | Không gửi hàng xóm thì chuyển sang cột khác, ở cuối cột. |
| moves to the top of a column with only beforeId | Chỉ gửi `beforeId` của thẻ đầu thì lên đầu cột. |
| moves between two given neighbours | Đặt vào giữa hai hàng xóm được gửi. |
| moves into an empty column | Chuyển vào một cột trống. |
| answers a stale version with 409… | Version cũ thì 409 kèm task hiện tại, và không di chuyển gì. |
| rejects a neighbour from another column, another project, or the card itself (422) | Từ chối hàng xóm ở cột khác, project khác, hoặc chính thẻ đó. |
| rejects neighbours that are no longer adjacent… | Từ chối hai hàng xóm không còn sát nhau: client phải tải lại. (Dòng 145: board của client vẫn thấy A ngay trên C, nhưng B đang nằm giữa.) |
| rejects neighbours in the wrong order (422) | Từ chối hàng xóm sai thứ tự. |
| validates the body against the contract | Kiểm tra body theo contract. |
| refuses an invited viewer (403) and hides the task from outsiders (404) | Viewer được mời nhận 403; người ngoài nhận 404. |

### `test/unit/policy.test.ts`

Đầu file (1–3): bảng phân quyền trong `policy.ts`, mỗi ô một test. Nếu luật thay đổi, sửa bảng ở đây trước, rồi mới sửa hàm.

| Dòng | Nghĩa |
| --- | --- |
| 9 | `project:list`: mọi thành viên được xem danh sách (viewer nhận danh sách đã lọc, việc lọc làm trong câu truy vấn). |
| 16 | `project:create`: chỉ owner và admin. |
| 23 | `project:read`: viewer chỉ xem được project mình được mời. |
| 31 | Có tên trong danh sách viewer của project không giúp được người đã rời workspace. |
| 34 | `task:create`: ai làm trong workspace cũng được; viewer xem được nhưng không ghi được. |
| 39 | Viewer không thấy được project thì không được biết nó tồn tại. |
| 43 | `task:update`: ai được tạo thì được sửa. |

### `test/unit/position.test.ts`

Đầu file (1–4): `positionBetween()`: thẻ được thả sẽ rơi vào đâu. Hàm thuần, không database. Mọi test kiểm tra đúng một điều board quan tâm: khóa mới phải sắp đúng chỗ client yêu cầu. Dòng 9: một cột gồm ba thẻ với khóa phân số thật. Dòng 15: chèn khóa mới và trả danh sách id theo thứ tự sắp (so sánh chuỗi thường, giống `COLLATE "C"` của Postgres).

| Test | Nghĩa |
| --- | --- |
| puts the first card of an empty column somewhere valid | Thẻ đầu tiên của cột trống nhận một khóa hợp lệ. |
| goes to the bottom when no neighbour is given | Không gửi hàng xóm thì xuống cuối. |
| goes between two given neighbours | Nằm giữa hai hàng xóm được gửi. |
| only afterId: directly below that card | Chỉ `afterId`: ngay dưới thẻ đó. |
| only beforeId: directly above that card | Chỉ `beforeId`: ngay trên thẻ đó. |
| only beforeId on the first card: to the very top | Chỉ `beforeId` là thẻ đầu: lên trên cùng. |
| rejects a neighbour that is not in the column, naming the field | Từ chối hàng xóm không có trong cột, và nói rõ field nào. |
| rejects two neighbours that are not next to each other (stale board) | Từ chối hai hàng xóm không sát nhau (board cũ). (Dòng 56–57: client tưởng A và C sát nhau, nhưng giờ B nằm giữa. Khóa "giữa A và C" có thể trùng khóa của B, và hai thẻ sẽ cùng vị trí.) |
| rejects neighbours given in the wrong order | Từ chối hàng xóm gửi sai thứ tự. |
| keeps working when the same gap is used again and again | Vẫn đúng khi cùng một khe được dùng đi dùng lại. (Dòng 68: thả 20 thẻ liên tiếp ngay dưới A: khóa dài dần ra nhưng thứ tự vẫn đúng.) |
