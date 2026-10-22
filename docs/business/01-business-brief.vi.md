# Business brief: hướng dẫn đọc (bản tiếng Việt)

Bản chính (tiếng Anh): [`01-business-brief.md`](01-business-brief.md). Bản dịch đầy đủ: [`01-business-brief.full.vi.md`](01-business-brief.full.vi.md). Đây là bài mẫu ("I do"): mình viết trọn, bạn đọc rồi phản biện. Lần sau (brief cho P2) mình làm cùng nhau.

## 1. Khái niệm mới, dịch từ thứ bạn đã biết

| Khái niệm business | Giống cái gì bên frontend | Ý nghĩa |
| --- | --- | --- |
| Problem + evidence | Bug report có bước tái hiện | Nỗi đau phải có bằng chứng. Chưa có bằng chứng thì ghi rõ là **giả định** |
| Customer segment / beachhead | Target browser + breakpoint đầu tiên | Chọn **một** nhóm khách nhỏ, rõ ràng để làm tốt trước, đừng làm cho "mọi người" |
| Buyer vs user | Người duyệt PR vs người dùng tính năng | Người trả tiền (team lead) khác người chỉ xem (client) |
| Alternatives | Thư viện có sẵn trước khi tự viết | Đối thủ lớn nhất thường là "Zalo + Excel", không phải Jira |
| Positioning statement | Mô tả một dòng trong README | "Cho ai, giải quyết gì, khác đối thủ ở đâu" |
| North star metric | Core Web Vitals | Một con số chính phản ánh khách có nhận được giá trị không |
| Activation / retention | Conversion funnel | Khách có dùng được ngay không (activation), tuần sau có quay lại không (retention) |
| Riskiest assumption | Phần kỹ thuật dễ sai nhất, phải spike trước | Giả định mà sai thì cả sản phẩm sụp, phải kiểm chứng đầu tiên |
| Scope v1 / roadmap | Milestone + backlog | v1 là thứ cam kết làm; roadmap ghi lại, chưa làm |

**Điều sẽ làm bạn bất ngờ:**

- Brief tốt **nói thẳng cái gì là giả định**. Interviewer đánh giá cao câu "chưa kiểm chứng, đây là cách mình sẽ kiểm" hơn một con số bịa.
- Khác biệt không nằm ở nhiều tính năng mà ở **một điểm đối thủ làm dở cho đúng nhóm khách**: ở đây là client chỉ xem đúng dự án của họ.
- Mô hình kinh doanh có phần **"honest scale check"**: sản phẩm ngách, thu nhập nhỏ. Nói thẳng điều này cho thấy bạn hiểu business, không làm bạn yếu đi.

## 2. Tóm tắt từng phần

1. **Vấn đề:** agency nhỏ quản lý việc qua Zalo, Excel, Trello miễn phí. Lead mất thời gian hỏi tiến độ; task trễ chỉ lộ ra khi đã quá hạn; client nhận tiến độ qua ảnh chụp màn hình vì cho vào Trello/Jira là cho quyền thấy hết.
2. **Khách hàng:** agency/outsourcing ở VN, 5–15 người, cùng lúc làm cho 2+ client. Team lead là người trả tiền.
3. **Đối thủ:** Zalo + Excel, Trello, Jira, Asana/ClickUp, Linear, Base.vn. Giá tham khảo lấy từ trang so sánh (tháng 10/2026), cần kiểm lại trang chính hãng trước khi trích dẫn.
4. **Khác biệt:** viewer theo dự án (miễn phí, chỉ xem), màn Today, AI soạn task, gọn nhẹ (task đầu tiên trong 3 phút).
5. **Mô hình (giả thuyết):** free đến 5 thành viên; gói Team ~75.000đ/người/tháng; viewer luôn miễn phí. Mỗi client nhìn thấy TaskFlow hằng tuần là một kênh lan truyền.
6. **Chỉ số:** north star = số dự án hoạt động mỗi tuần; thêm activation, tỷ lệ client mở link, retention tuần 4, chất lượng AI, 0 rò rỉ dữ liệu.
7. **Rủi ro lớn nhất:** team lead **không muốn** client thấy board thật (lộ việc nội bộ lộn xộn). Kiểm bằng phỏng vấn; giải pháp ở roadmap là đánh dấu task "internal".
8. **Phạm vi v1 (đề xuất chốt):** auth, workspace + 4 role + mời qua email, viewer theo dự án, board kéo thả + realtime, task + 409, Today, **activity log**, AI soạn task thật. **v1.1:** comment, label, đính kèm file (S3), tìm kiếm, task internal, email nhắc task trễ, thông báo Slack/Zalo.

> **Khác PRD v1.2:** comment, label, đính kèm file và tìm kiếm chuyển từ v1 sang v1.1; activity log giữ lại trong v1 vì nó giải quyết nỗi đau "không có lịch sử thay đổi". Khi bạn đồng ý, mình nâng PRD lên v1.3 cho khớp và thêm màn activity log vào giai đoạn 2.

## 3. Pitch 60 giây: nghĩa tiếng Việt

Giữ bản tiếng Anh để luyện nói. Nghĩa:

> Agency nhỏ ở Việt Nam chạy dự án cho khách qua nhóm Zalo và bảng tính. Sáng nào team lead cũng hỏi "ai đang làm gì?", task trễ chỉ lộ ra khi đã quá hạn, còn khách xem tiến độ qua ảnh chụp màn hình, vì cho họ vào Trello hay Jira là cho họ thấy mọi thứ.
>
> TaskFlow là bảng công việc gọn nhẹ cho team làm việc với khách. Một màn hình, Today, cho thấy việc nào trễ, việc nào đến hạn tuần này, việc nào chưa ai nhận. Mỗi khách có một trang chỉ xem, cập nhật trực tiếp, chỉ thấy dự án của họ, nên không cần chụp màn hình nữa. Thay vì gõ từng task, bạn dán brief của khách vào và AI soạn sẵn danh sách task để bạn duyệt.
>
> Bắt đầu với agency 5–15 người. Miễn phí cho team nhỏ, viewer luôn miễn phí, nên mỗi đường link gửi khách lại giới thiệu TaskFlow cho team tiếp theo. Prototype đã chạy, backend làm tiếp theo.

**Mẹo nói:** 3 đoạn = **vấn đề → giải pháp (3 điểm) → khách hàng + mô hình + trạng thái**. Không cần thuộc từng chữ, chỉ cần thuộc khung 3 đoạn và 3 điểm khác biệt.

## 4. Việc của bạn (gate giai đoạn 1)

**Đọc và phản biện**, chọn ít nhất 2 câu để trả lời (trả lời ngắn, tiếng Việt cũng được):

1. Beachhead là agency có client. Bạn có đồng ý không, hay team nội bộ công ty (không có client) hợp hơn? Nếu đổi thì khác biệt #1 còn đứng được không?
2. Rủi ro lớn nhất mình chọn là "lead không muốn client thấy board thật". Bạn từng làm ở team có client chưa? Lead của bạn có gửi link board cho khách không?
3. Activity log nên ở v1 hay v1.1? Lý do?
4. Giá ~75.000đ/người/tháng: cao, thấp hay vừa? Bạn sẽ hỏi team lead câu gì để biết?

Sau đó **ghi âm hoặc nói pitch 60 giây bằng tiếng Anh** (đọc nhìn cũng được lần đầu). Gửi mình bản text bạn nói, mình chỉ ra 1–2 chỗ cần sửa. Nói trôi trong ~60 giây là qua gate.
