# DEVLOG

Mỗi ngày: làm được gì, chỗ sai / agent làm hỏng và bài học, tự chấm độ sâu (1 dùng được · 2 giải thích được · 3 xử lý được khi hỏng · 4 dạy lại được).

## Ngày 1 — T4 14/10/2026

- Block 1 (DSA arrays & hashing): chưa làm, dời về cuối ngày (Longest Consecutive Sequence)
- Block 2 (P1 discovery): xong — docs/PRD.md, user flow, wireframe A/B/C → chọn B + C theo role (docs/design/wireframe-decision.md)
- Block 3 (Tell me about yourself): bản 90 s + 3 STAR story trong docs/interview/stories.md
- Sai / bài học: lần đầu viết PRD; non-goals là chỗ cắt scope có chủ đích. Tự giới thiệu phải trung thực: backend mới 3 tháng.
- Tự chấm:

## Ngày 2 — T5 15/10/2026

- Build: mockup hi-fi v1 (12 màn: tokens, login, onboarding 2 bước, new task, Today lead/viewer, project list + kéo thả, members, states gồm 409, 3 màn mobile); docs/design/ui-acceptance.md + tokens.json.
- Lý thuyết: design token, WCAG AA; Node event loop.
- Quiz event loop: câu 1 đúng thứ tự (A F E D B C), thiếu ý "B/C ở main module không đảm bảo thứ tự". Câu 2 nêu được thread pool cạn, chưa nêu nguyên nhân chính: 25% CPU trên 4 core = 1 core 100% → event loop bị chặn bởi code đồng bộ nặng CPU.
- Chưa làm: test mockup với 3 người, DSA.
- Tự chấm: Node event loop 2/4 (giải thích được, chưa debug được) → ôn lại tuần sau.

## Ngày 3 — T6 16/10/2026

- Mockup v2 sau AI persona walkthrough (7 lỗi ≥ 2/3 persona đã sửa); viewer chỉ xem project được mời → PRD v1.1.
- Học cách học với AI (docs/how-i-learn.md, CLAUDE.md); file ôn tập docs/interview/qa-review.md.
- System design: khung 7 bước, LB, scale ngang, CAP; requirements + estimate bản 1 (số liệu mâu thuẫn, estimate chưa ra số) → đang sửa.
- Dời sang Ngày 4: OpenAPI, monorepo, C4/ERD, budget alert. Dời cuối tuần: sequences, AI phản biện thiết kế, ADR-001/002.

## Điều chỉnh plan — 17/10
- DSA tạm hoãn.
- Nộp CV + chỉnh CV/LinkedIn dời sang tuần 4 (từ 04/11). Scan job vẫn chạy hằng ngày.
