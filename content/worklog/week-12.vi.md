### Mục Tiêu Tuần 12

* Vác súng ra chiến trường: Báo cáo Thuyết trình đồ án.
* Gắn cái mác "Hoàn tất": Viết đánh giá tổng kết chặng đường nhọc nhằn làm AI/ML Lead.
* Khóa sổ Source Code chung.
* Trà chanh chém gió và chia vui cùng anh em!

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Bắt đầu | Hoàn thành | Tài liệu tham khảo |
| --- | --- | --- | --- | --- |
| 1 | - Khảo hạch cuối cùng <br>&emsp; + Soi cực kỳ kỹ đầu nối AppSync / Bedrock coi có khói lửa gì trước show múa không. <br>&emsp; + Soạn lại slide nói cho mượt. | 16/04/2026 | 16/04/2026 | - |
| 2 | - BÁO CÁO FINAL <br>&emsp; + Hiên ngang thuyết trình NutriTrack trước các Mentor của FCJ. <br>&emsp; + Test app trực tiếp mướt rượt; Ollie nhận diện cục mỡ nói bằng tiếng Việt chính xác phóc lúc diễn Live! | 17/04/2026 | 17/04/2026 | - |
| 3 | 🔥 **CỘT MỐC:** BÁO CÁO FINAL TRƯỚC MENTORS <br>&emsp; - Self-Evaluation Drafting <br>&emsp; + Gửi gắm tâm thư vào file Đánh giá: Viết sâu về các pattern hệ thống Bedrock đã xài. <br>&emsp; + Đúc kết hành trình từ gõ API ngu ngốc thành 1 thợ đúc Prompts ranh mãnh. | 18/04/2026 | 18/04/2026 | - |
| 4 | - Feedback Chương trình <br>&emsp; + Viết mấy lời tri ân gửi quản lý chương trình. <br>&emsp; + Cảm tạ sự dìu dắt bao dung của các mentor. | 19/04/2026 | 19/04/2026 | - |
| 5 | - Bàn giao Bí Kíp <br>&emsp; + Cập nhật đống hướng dẫn AWS Workshop sạch sẽ lên mạng. <br>&emsp; + Soi file `README.md` của Repo một lần cuối. | 20/04/2026 | 20/04/2026 | - |
| 6-7 | - Tiệc Tùng và Networking <br>&emsp; + Đi rải chiến tích 12 tuần vừa rồi trên Linkedin! <br>&emsp; + Xin nhiệt liệt biểu dương Team NeuraX vì pha teamwork vĩ đại kéo dài 12 tuần. | 21/04/2026 | 22/04/2026 | - |

### Kết quả đạt được Tuần 12

* **Vang danh thiên hạ:** Dưới ánh đèn Demo Live, các mentors ấn tượng với kiến trúc AI — Qwen3-VL 235B trên Bedrock cho phân tích ảnh đa phương thức, kết hợp hybrid DynamoDB fuzzy-match + Bedrock fallback trong `processNutrition`. Phép thuật biến nguyên liệu tủ lạnh thành công thức nấu ăn đã chạy xuất sắc.
* **Bảo vệ Hệ Thống:** Cả team đã làm được một ứng dụng trọn gói AWS Serverless AI Application xịn xò. Nó nhúc nhích, hít thở và tương tác được chứ không phải là mô hình cắt dán trên giấy.
* **Bước Tự Chuyển Hóa:** Bản thân tôi đã thoát kén, từ việc hiểu mơ màng "LLM là cái máy chat" sang việc nắm đằng chuôi nghệ thuật "Ep Bedrock Runtime nhả ra JSON cấu trúc y khuôn".

### Trọn vẹn Hành Trình 12 Tuần

**Bức Tranh Tổng Thể Mảng AI:**

| Phase | Weeks | Dấu Ấn Quan Trọng |
|-------|-------|---------------------|
| Khởi Động | 1-2 | Gom team, dợt cơ chế AWS, chốt ý tưởng NutriTrack |
| Triển Khai Bedrock | 3-6 | Đong đếm Models, tạc Schema, búng tay sinh hàm Voice Processing bằng Haiku |
| Logic Liên Hoa | 7-8 | Kiến trúc Prompts, bứng Data từ DynamoDB, chế hàm Recipe Lambda bằng Sonnet |
| Tối Ưu Lên Nóc | 9-10 | Phóng thích ông thần Coach `Ollie` với Context theo Cữ, Load Testing ngập họng |
| Trao Tay | 11-12 | Cắt gọt Parameters Inference, viết Docs, Demo chung kết tráng lệ |

**Tuyệt Kỹ AWS Sở Hữu:**

* **Amazon Bedrock** (Qwen3-VL 235B, `ap-southeast-2`) — gọi qua AWS SDK TypeScript `InvokeModelCommand` trong Node.js 22 Lambda
* **AWS Amplify Gen 2** — `defineBackend`, `defineFunction`, `defineData`, `defineAuth`, `defineStorage`, CDK escape hatch inject env var
* **AWS AppSync** — GraphQL schema 8 DynamoDB model, owner-scoped authorization, real-time subscriptions
* **Amazon Transcribe** — async job với `vi-VN`, S3 resource policy grant
* **Amazon DynamoDB** — on-demand tables, GSI, `TransactWriteItems` cho friend request

### Thổ Lộ Cuối Cùng

Trải qua 12 tuần mài mông trong FCJ Internship là một hành trình tu võ dở khóc dở cười với Generative AI. Rới tay vào Amazon Bedrock không phải là gõ API gọi cái máy lên rồi muốn múa gì thì múa; nó là đỉnh cao của Prompt Engineering — nghệ thuật thiết quân luật cho mô hình để nó ngoan ngoãn nôn ra dữ liệu y xì cái Database.

Việc ngồi kề vai bá cổ thằng cu Quan (DEV) để khớp lệnh giữa GraphQL với cái não Boto3 Bedrock thực sự mở mang nhãn quan của tôi về sự tiến bạo, tiến xấc xược của hệ thống Serverless hiện tại. Đội ơn các vị FCJ Mentors và anh em NeuraX team đã đồng sinh cộng tử ở cái ranh giới bleeding-edge này.

Xin khép lại hành trình rực lửa với NutriTrack! ☁️🚀
