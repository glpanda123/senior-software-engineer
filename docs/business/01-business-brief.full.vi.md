# TaskFlow — Business Brief (một trang)

Trạng thái: Bài mẫu giai đoạn 1 · Bản nháp để review · 22/10/2026

> Bản dịch đầy đủ của [`01-business-brief.md`](01-business-brief.md). Bản hướng dẫn đọc + câu hỏi phản biện: [`01-business-brief.vi.md`](01-business-brief.vi.md).

> **Một dòng:** bảng quản lý công việc gọn nhẹ cho các agency nhỏ làm việc với khách hàng — nhìn thấy việc gì đang trễ trên một màn hình, và cho mỗi khách hàng một trang chỉ xem, cập nhật trực tiếp, về dự án *của họ* thay vì một ảnh chụp màn hình.

## 1. Vấn đề

Các team nhỏ làm dự án cho khách hàng (agency thiết kế, lập trình và marketing, 3–15 người) điều phối công việc qua các nhóm chat Zalo/Slack, bảng tính và bảng Trello miễn phí.

| Nỗi đau | Bằng chứng hiện có | Trạng thái |
| --- | --- | --- |
| Lead mất ~30 phút/ngày để hỏi "ai đang làm gì?" | Kinh nghiệm của chính mình ở các team agency/outsourcing | **Giả định** — cần kiểm chứng |
| Việc trễ chỉ bị phát hiện khi đã quá hạn | Như trên | **Giả định** |
| Khách hàng nhận tiến độ qua ảnh chụp màn hình hoặc báo cáo hằng tuần, vì chia sẻ board đồng nghĩa với cho quyền sửa mọi thứ | Khách (guest) trên Trello/Jira thấy toàn bộ board; quyền chỉ xem theo từng dự án cần gói trả phí hoặc phải lách | **Đã kiểm chứng một phần** (tài liệu sản phẩm) |
| Jira quá nặng cho 5 người; Trello không có phân quyền thật sự hay lịch sử thay đổi | Lời phàn nàn phổ biến trong các bài đánh giá và bài "thay thế Jira" | **Đã kiểm chứng một phần** |

**Kế hoạch kiểm chứng (trước khi công khai khẳng định bất kỳ điều nào ở trên):** 5 cuộc phỏng vấn ngắn với team lead của các agency. Câu hỏi chính: *"Tuần trước, khách hàng của bạn biết tình trạng dự án của họ bằng cách nào?"*

## 2. Nhóm khách hàng

- **Thị trường đầu cầu (beachhead):** các agency và team outsourcing ở Việt Nam có **5–15 người và cùng lúc làm cho 2+ khách hàng bên ngoài**. Họ gặp nỗi đau "khách không nhìn thấy tiến độ" hằng tuần và tự chọn công cụ mà không qua quy trình mua sắm.
- **Người mua = người dùng:** team lead / project manager. Khách hàng (viewer) không bao giờ trả tiền nhưng thấy sản phẩm hằng tuần.
- **Chưa nhắm tới:** doanh nghiệp lớn (cần SSO, kiểm toán), freelancer làm một mình (không có team để điều phối), team phần mềm sống trên GitHub (Linear hợp với họ hơn).

## 3. Các lựa chọn thay thế và đối thủ

| Lựa chọn | Vì sao team chọn nó | Vì sao nó không đáp ứng nhóm khách này | Giá gói trả phí thấp nhất* |
| --- | --- | --- | --- |
| Chat + bảng tính | Miễn phí, có sẵn | Không có trạng thái, không có lịch sử, không có gì cho khách hàng | $0 |
| Trello | Dễ dùng, có gói miễn phí | Phân quyền yếu; khách (guest) thấy cả board, không phải "chỉ dự án của họ, chỉ xem" | ≈ $5/người/tháng |
| Jira | Mạnh, có phân quyền, có lịch sử | Cài đặt nặng nề, được xây cho sprint phần mềm | ≈ $7,75/người/tháng |
| Asana / ClickUp | Nhiều tính năng | Nhiều tính năng phải học; quyền cho khách là tiện ích trả thêm hoặc tính như một người dùng đầy đủ | ≈ $7–11/người/tháng |
| Linear | Nhanh, được dev yêu thích | Xây cho issue phần mềm, không phải bàn giao cho khách hàng | ≈ $8–10/người/tháng |
| Base.vn (trong nước) | Tiếng Việt, bộ HR + công việc | Bộ công cụ cho cả doanh nghiệp vừa và nhỏ, nặng hơn một bảng công việc của team | Không công bố |

\* Thanh toán theo năm, lấy từ các trang so sánh bên thứ ba (tháng 10/2026). Kiểm tra trang giá chính hãng trước khi trích dẫn.

## 4. Điểm khác biệt

**Định vị (positioning):** *Dành cho các agency nhỏ làm dự án cho khách hàng, TaskFlow là bảng công việc nơi mỗi khách hàng có một trang chỉ xem, cập nhật trực tiếp, về dự án của riêng họ. Khác với Trello hay Jira, quyền truy cập của khách mặc định là an toàn và miễn phí, và lead thấy việc gì đang trễ trên một màn hình.*

1. **Viewer cho khách theo từng dự án** — chỉ xem, chỉ thấy các dự án họ được mời vào, luôn miễn phí.
2. **Màn hình Today** — việc trễ, việc đến hạn trong tuần và việc chưa ai nhận, nhìn một lần là thấy; thay cho câu hỏi buổi sáng "ai đang làm gì?".
3. **AI soạn task** — dán brief của khách vào, nhận một danh sách task để duyệt trước khi lưu. Tiết kiệm bước nhàm chán nhất khi bắt đầu một dự án.
4. **Cố tình làm nhỏ gọn** — không sprint, không workflow tuỳ biến; một team mới giao task đầu tiên trong chưa đầy 3 phút.

## 5. Mô hình kinh doanh (giả thuyết)

- **Free:** tối đa 5 thành viên, 3 dự án. **Viewer cho khách không giới hạn và miễn phí ở mọi gói.**
- **Team:** ≈ $3/người/tháng (≈ 75.000đ), chỉ owner/admin/member được tính là một suất. Rẻ hơn Trello Standard trong khi có những thứ Trello thiếu đối với nhóm khách này.
- **Vòng lặp tăng trưởng (giả thuyết):** mỗi khách hàng thấy TaskFlow hằng tuần → một số khách hàng đó cũng quản lý team → họ đăng ký.
- **Kiểm tra quy mô một cách thẳng thắn:** một agency 10 suất trả ~$30/tháng; 100 team trả phí ≈ $3.000 doanh thu định kỳ mỗi tháng (MRR). Đây là sản phẩm ngách, điều đó ổn với một dự án portfolio; muốn tăng trưởng thì tính năng AI và tính năng cho khách hàng phải gánh được.

## 6. Chỉ số thành công

| Loại | Chỉ số | Mục tiêu (3 tháng đầu) |
| --- | --- | --- |
| North star | **Số dự án hoạt động mỗi tuần** (≥ 3 lần cập nhật task trong một tuần) | Tăng đều; lấy mốc sau khi ra mắt |
| Activation | Tỷ lệ workspace mới giao task đầu tiên ngay trong ngày 1 | ≥ 60%, thời gian trung vị < 3 phút |
| Giá trị cho khách | Tỷ lệ dự án có viewer mở xem trong 7 ngày gần nhất | ≥ 30% số dự án hoạt động |
| Retention | Tỷ lệ workspace còn hoạt động ở tuần 4 | ≥ 40% |
| AI | Tỷ lệ bản nháp AI được lưu với ≤ 2 lần sửa | ≥ 50% |
| Niềm tin | Số lần rò rỉ dữ liệu giữa các workspace | 0 (test cách ly trong CI) |

**Giai đoạn prototype (hiện tại):** 3 người test usability hoàn thành luồng chính mà không cần trợ giúp; mentor + 2–3 team lead nói "tôi sẽ gửi link này cho khách".

## 7. Rủi ro và giả định rủi ro nhất

| Rủi ro | Vì sao quan trọng | Cách kiểm chứng hoặc giảm thiểu |
| --- | --- | --- |
| **Lead có thể không muốn khách thấy board thật** (nó lộ ra sự lộn xộn nội bộ) | Phá hỏng điểm khác biệt #1 | Câu hỏi phỏng vấn: "Hôm nay bạn có gửi link này cho khách không?" Roadmap: đánh dấu task *internal* (ẩn với viewer) |
| Team không chịu rời Zalo + bảng tính ("vậy là đủ rồi") | Không ai dùng | Màn Today + onboarding 3 phút; đo activation |
| Bản nháp AI sai hoặc chung chung | Tính năng thành trò mánh lới | Output được kiểm tra theo schema, người duyệt trước khi lưu, bộ eval trong CI |
| Các công cụ lớn thêm trang xem miễn phí cho khách | Điểm khác biệt bị sao chép | Giữ nhỏ và nhanh cho nhóm khách này; ngôn ngữ và giá phù hợp thị trường trong nước |
| Rò rỉ dữ liệu giữa các workspace/khách hàng | Một sự cố là mất niềm tin | Cách ly tenant ngay từ thiết kế, trả 404 cho dữ liệu ngoài phạm vi, test trong CI |

## 8. Phạm vi

**v1 (đã chốt 24/10; giai đoạn 3 thiết kế toàn bộ; PRD v1.3):**

- Tài khoản: đăng ký, đăng nhập, duy trì đăng nhập (xoay vòng refresh token), đăng xuất
- Workspace, 4 role, mời qua email (gửi từ hàng đợi)
- **Viewer cho khách theo từng dự án**, chỉ xem
- Dự án và board với 4 cột trạng thái, kéo thả, **cập nhật trực tiếp (< 1 giây)**
- Task: tiêu đề, mô tả, trạng thái, người được giao, độ ưu tiên, hạn chót; phát hiện xung đột khi sửa (409)
- Tổng quan **Today**
- **Activity log** theo dự án (ai đổi gì, lúc nào) — giải quyết nỗi đau "không có lịch sử thay đổi"
- **AI soạn task** với LLM thật, người duyệt, eval trong CI
- Phi chức năng: cách ly tenant, giới hạn tần suất đăng nhập (rate limit), cache cho board

**Roadmap v1.1 (chưa làm bây giờ; ý tưởng mới ghi vào đây):** comment, label, đính kèm file (S3), tìm kiếm toàn văn, task *internal* ẩn với viewer, email tổng hợp task trễ, thông báo qua Slack/Zalo.

**Không làm:** sprint, chấm công, thanh toán/hoá đơn, trường tuỳ biến/tự động hoá, app native, SSO (xem non-goals trong PRD).

## 9. Pitch 60 giây

Bản tiếng Anh để luyện nói:

> Small agencies in Vietnam run client projects on Zalo threads and spreadsheets. Every morning the team lead asks "who's on what?", late tasks show up only after the deadline, and clients get progress by screenshot — because giving them access to Trello or Jira means giving them access to everything.
>
> TaskFlow is a lightweight task board for teams that work with clients. One screen, Today, shows what's late, what's due this week and what nobody owns. Each client gets a live, read-only view of their own project, so the status screenshot disappears. And instead of typing tasks one by one, you paste the client's brief and AI drafts the task list for you to review.
>
> We start with 5-to-15-person agencies. It's free for small teams, and client viewers are always free, so every client link shows TaskFlow to the next team. The prototype is live today, and the backend is next.

Bản dịch:

> Các agency nhỏ ở Việt Nam chạy dự án cho khách qua các nhóm Zalo và bảng tính. Sáng nào team lead cũng hỏi "ai đang làm gì?", task trễ chỉ lộ ra khi đã quá hạn, còn khách hàng nhận tiến độ qua ảnh chụp màn hình — vì cho họ quyền vào Trello hay Jira nghĩa là cho họ quyền vào mọi thứ.
>
> TaskFlow là một bảng công việc gọn nhẹ cho các team làm việc với khách hàng. Một màn hình, Today, cho thấy việc nào trễ, việc nào đến hạn trong tuần này và việc nào chưa ai nhận. Mỗi khách hàng có một trang chỉ xem, cập nhật trực tiếp, về dự án của riêng họ, nên ảnh chụp màn hình báo tiến độ biến mất. Và thay vì gõ từng task một, bạn dán brief của khách vào và AI soạn danh sách task để bạn duyệt.
>
> Chúng tôi bắt đầu với các agency 5 đến 15 người. Miễn phí cho team nhỏ, và viewer cho khách luôn miễn phí, nên mỗi đường link gửi cho khách lại giới thiệu TaskFlow tới team tiếp theo. Prototype đã chạy từ hôm nay, và backend là bước tiếp theo.
